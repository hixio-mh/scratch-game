import {
    Container,
    Sprite,
    loader
}                        from 'pixi.js';
import { ItemData }      from '../gameData';
import { Scratchable }   from './scratchable';
import { gameResources } from '../resources/gameResources';

const SCRATCH_FRAME = 'magic_forest_scratch_frame.png';

interface ScratchableCardsConfig {
    sizeX    : number,
    sizeY    : number,
    itemsData: ItemData[],
    offsetX? : number,
    offsetY? : number
}

const CARD_WIDTH  = 280
const CARD_HEIGHT = 280

export class ScratchableCards extends Container {
    private list: Scratchable[];

    constructor (private config: ScratchableCardsConfig) {
        super();

        const mainSpriteSheet = loader.resources[gameResources.main_spritesheet.key]
        this.config.offsetX = this.config.offsetX || 0;
        this.config.offsetY = this.config.offsetY || 0;

        this.list = [];
        let x = 0;
        let y = 0;
        this.config.itemsData.forEach((itemData: ItemData) => {
            let card: Scratchable = new Scratchable(
                new Sprite(mainSpriteSheet.textures[itemData.frame]),
                new Sprite(mainSpriteSheet.textures[SCRATCH_FRAME]),
                itemData
            );

            card.position.set(
                x * (CARD_WIDTH + this.config.offsetX),
                y * (CARD_HEIGHT + this.config.offsetY)
            );

            card.on('scratch', this.onScratch.bind(this));
            card.on('scratchStart', this.onScratchStart.bind(this));
            card.on('scratchStop', this.onScratchStop.bind(this));
            card.on('complete', this.onComplete.bind(this));

            this.addChild(card);
            this.list.push(card);

            x++;
            y++;
            if (x === this.config.sizeX) 
                x = 0;
            if (y === this.config.sizeY)
                y = 0;
        });
    }

    lock () {
        this.list.forEach((card: Scratchable) => {
            card.lock();
        });
    }

    unlock () {
        this.list.forEach((card: Scratchable) => {
            card.unlock();
        });
    }

    onScratch () {
        this.emit('scratch');
    }

    onScratchStart () {
        this.emit('scratchStart');
    }

    onScratchStop () {
        this.emit('scratchStop');
    }

    onComplete (itemData: ItemData) {
        this.emit('complete', itemData);
        this.checkAllCompleted();
    }

    checkAllCompleted () {
        for (let i = 0; i < this.list.length; i++) {
            if (!this.list[i].completed)
                return;
        }
        this.allCompleted();
    }

    allCompleted () {
        this.emit('allCompleted');
    }
}