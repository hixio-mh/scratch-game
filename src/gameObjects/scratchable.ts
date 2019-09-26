import { Container, Sprite }             from 'pixi.js'
import { PaintableMask, PaintEvent }     from './paintableMask'
import { gameData, ItemData, BonusData } from '../gameData'

export class Scratchable extends Container {
    private coverMask: PaintableMask;
    public completed: boolean;

    constructor (
        private sprite: Sprite,
        private cover: Sprite,
        private data: ItemData | BonusData
    ) {
        super();

        this.addChild(this.sprite);
        this.sprite.anchor.set(0.5);

        this.addChild(this.cover);
        this.cover.anchor.set(0.5);
        
        this.coverMask = new PaintableMask(this.cover.width, this.cover.height);
        this.coverMask.anchor.set(0.5);
        this.cover.mask = this.coverMask;
        this.addChild(this.coverMask);

        this.coverMask.on('paint', this.onScratch.bind(this));
        this.coverMask.on('paintStart', this.onScratchStart.bind(this));
        this.coverMask.on('paintStop',  this.onScratchStop.bind(this));

        this.completed = false;
    }

    onScratch (event: PaintEvent) {
        this.emit('scratch', this.data);

        if (event.percent >= gameData.scratchLimitPercent) {
            this.cover.destroy();
            this.coverMask.destroy();
            this.completed = true;
            this.emit('complete', this.data);
        }
    }

    onScratchStart () {
        this.emit('scratchStart');
    }

    onScratchStop () {
        this.emit('scratchStop');
    }

    lock () {
        this.coverMask.lock();
    }

    unlock () {
        this.coverMask.unlock();
    }
}