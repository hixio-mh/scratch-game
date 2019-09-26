import { Sprite, loader }   from 'pixi.js';
import { config }           from '../config';
import { Red, RedStates }   from '../gameObjects/red';
import { MenuUI }           from '../gameObjects/menuUI';
import { Scratchable }      from '../gameObjects/scratchable';
import { ScratchableCards } from '../gameObjects/scratchableCards';
import { gameResources }    from '../resources/gameResources';
import { 
    gameData,
    ItemData,
    BonusData
}                           from '../gameData';

// const SCRATCH_FRAME = 'magic_forest_scratch_frame.png';
const SCRATCH_FRAME_BIG = 'magic_forest_scratch_frame_big.png';

const CARDS_SIZE_X = 3;
const CARDS_SIZE_Y = 2;
const CARDS_OFFSET_X = 55;
const CARDS_OFFSET_Y = 50;

const mockItems = [
    gameData.items[0],
    gameData.items[2],
    gameData.items[3],
    gameData.items[1],
    gameData.items[2],
    gameData.items[3],
]

export class Game extends PIXI.Container {
    private red             : Red;
    private menuUI          : MenuUI;
    private bonusScratchable: Scratchable;
    private scratchableCards: ScratchableCards;

    constructor () {
        super();

        this.init();
    }

    init () {
        const mainSpritesheet = loader.resources[gameResources.main_spritesheet.key]

        // setup background
        const bg = new Sprite(loader.resources['main_background'].texture)
        bg.x = config.width / 2;
        bg.y = config.height / 2;
        bg.anchor.set(0.5)
        this.addChild(bg);

        // add title
        const title = new Sprite(mainSpritesheet.textures['magic_forest_win_up_to_100.png']);
        title.anchor.set(0.5);
        let titleOffsetY = 50;
        title.position.set(config.width / 2, title.height / 2 + titleOffsetY);
        this.addChild(title);

        // add winner placeholder 
        const winnerHolder = new Sprite(mainSpritesheet.textures['magic_forest_winner_frame.png']);
        winnerHolder.position.set(config.width - winnerHolder.width, 200);
        this.addChild(winnerHolder);

        // setup RED character component
        this.red = new Red();
        this.red.position.set(360, 670);
        this.addChild(this.red);

        // add random scatch on screen
        let randomItem: BonusData = this.getRandomBonus();
        this.bonusScratchable = new Scratchable(
            new Sprite(mainSpritesheet.textures[randomItem.frame]),
            new Sprite(mainSpritesheet.textures[SCRATCH_FRAME_BIG]),
            randomItem
        );
        this.addChild(this.bonusScratchable);
        this.bonusScratchable.position.set(800, 600);
        this.bonusScratchable.lock();

        this.bonusScratchable.on('scratchStart', () => {
            this.red.setState(RedStates.WORRY);
        });

        this.bonusScratchable.on('scratchStop', () => {
            this.red.setState(RedStates.IDLE);
        });

        this.bonusScratchable.on('complete', () => {
            this.red.runHappyBonusAnimation();
            this.red.setState(RedStates.IDLE);
        })

        // add scratchable cards
        this.scratchableCards = new ScratchableCards({
            sizeX    : CARDS_SIZE_X,
            sizeY    : CARDS_SIZE_Y,
            itemsData: mockItems,
            offsetX  : CARDS_OFFSET_X,
            offsetY  : CARDS_OFFSET_Y
        });
        this.addChild(this.scratchableCards);
        this.scratchableCards.position.set(215, 1370);
        this.scratchableCards.lock();

        this.scratchableCards.on('scratchStart', () => {
            this.red.setState(RedStates.WORRY);
        });
        this.scratchableCards.on('scratchStop', () => {
            this.red.setState(RedStates.IDLE);
        });
        this.scratchableCards.on('complete', () => {
            this.red.runDisappointedAnimation();
            this.red.setState(RedStates.IDLE);
        })
        this.scratchableCards.on('allCompleted', () => {
            console.log('all completed!');
        })

        // setup menu UI component
        this.menuUI = new MenuUI({
            width  : config.width,
            height : config.height,
            onClick: this.startGame.bind(this)
        });
        this.addChild(this.menuUI);
    }

    getRandomItem (): ItemData {
        return gameData.items[Math.round(Math.random() * (gameData.items.length - 1))]
    }

    getRandomBonus (): BonusData {
        return gameData.bonuses[Math.round(Math.random() * (gameData.bonuses.length - 1))]
    }

    startGame () {
        this.menuUI.hide();
        this.bonusScratchable.unlock();
        this.scratchableCards.unlock();
    }
}
