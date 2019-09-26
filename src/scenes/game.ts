import { 
    Sprite,
    loader,
    Container,
    Text
 }                          from 'pixi.js';
import { config }           from '../config';
import { Red, RedStates }   from '../gameObjects/red';
import { MenuUI }           from '../gameObjects/menuUI';
import { Scratchable }      from '../gameObjects/scratchable';
import { ScratchableCards } from '../gameObjects/scratchableCards';
import { gameResources }    from '../resources/gameResources';
import { 
    ItemData
}                           from '../gameData';
import { GameController }   from '../gameLogic/gameController'

const SCRATCH_FRAME_BIG = 'magic_forest_scratch_frame_big.png';
const TEXT_FRAME        = 'magic_forest_frame_for_text.png';

const RED_COLOR         = 0xf45b4e;

const CARDS_SIZE_X = 3;
const CARDS_SIZE_Y = 2;
const CARDS_OFFSET_X = 55;
const CARDS_OFFSET_Y = 50;

export class Game extends PIXI.Container {
    private red              : Red;
    private menuUI           : MenuUI;
    private gameLayer        : Container;
    private bonusScratchable : Scratchable;
    private scratchableCards : ScratchableCards;
    private gameController   : GameController;

    private cardsCompleted   : boolean;
    private bonusCompleted   : boolean;
    private needToInitObjects: boolean;
    private gameFinished     : boolean;

    constructor () {
        super();

        this.needToInitObjects = true;
        this.cardsCompleted = false;
        this.bonusCompleted = false;
        this.gameFinished = false;

        this.init();
    }

    init (): void {
        const mainSpritesheet = loader.resources[gameResources.main_spritesheet.key];

        // init game controller
        this.gameController = new GameController();
        this.gameController.create();

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

        // add helper
        const helperHolder = new Sprite(mainSpritesheet.textures[TEXT_FRAME]);
        this.addChild(helperHolder);
        helperHolder.position.set(config.width / 2 - helperHolder.width / 2, 1040);

        const helperText = new Text('MATCH THE WINNER AND WIN THE PRIZE', {
            fontFamily: config.FONT_BASE,
            fontSize  : 52,
            fill      : RED_COLOR,
        });
        this.addChild(helperText);
        helperText.position.set(
            config.width / 2- helperText.width / 2,
            1070
        )

        // add winner placeholder 
        const winnerHolder = new Sprite(mainSpritesheet.textures['magic_forest_winner_frame.png']);
        winnerHolder.position.set(config.width - winnerHolder.width, 200);
        this.addChild(winnerHolder);

        // setup RED character component
        this.red = new Red();
        this.red.position.set(360, 670);
        this.addChild(this.red);

        // add game layer
        this.gameLayer = new Container();
        this.addChild(this.gameLayer);

        // init game ojbects
        this.initGameObjects();

        // setup menu UI component
        this.menuUI = new MenuUI({
            width  : config.width,
            height : config.height,
            onClick: this.startGame.bind(this)
        });
        this.menuUI.updateHeaderValues(
            this.gameController.winData.cash,
            this.gameController.winData.coins
        );
        
        this.menuUI.hideHeader();
        this.addChild(this.menuUI);
    }

    initScratchableCards (): void {
        this.scratchableCards = new ScratchableCards({
            sizeX    : CARDS_SIZE_X,
            sizeY    : CARDS_SIZE_Y,
            itemsData: this.gameController.items,
            offsetX  : CARDS_OFFSET_X,
            offsetY  : CARDS_OFFSET_Y
        });
        this.gameLayer.addChild(this.scratchableCards);
        this.scratchableCards.position.set(215, 1370);
        this.scratchableCards.lock();

        this.scratchableCards.on('scratchStart', () => {
            this.red.setState(RedStates.WORRY);
        });
        this.scratchableCards.on('scratchStop', () => {
            this.red.setState(RedStates.IDLE);
        });
        this.scratchableCards.on('complete', (itemData: ItemData) => {
            if (itemData === this.gameController.winItem)
                this.red.runHappyCardAnimation();
            else
                this.red.runDisappointedAnimation();
            this.red.setState(RedStates.IDLE);
        })
        this.scratchableCards.on('allCompleted', () => {
            this.cardsCompleted = true;

            this.checkForFinish();
        })
    }

    initBonus (): void {
        const mainSpritesheet = loader.resources[gameResources.main_spritesheet.key];

        this.bonusScratchable = new Scratchable(
            new Sprite(mainSpritesheet.textures[this.gameController.bonus.frame]),
            new Sprite(mainSpritesheet.textures[SCRATCH_FRAME_BIG]),
            this.gameController.bonus
        );
        this.gameLayer.addChild(this.bonusScratchable);
        this.bonusScratchable.position.set(800, 600);
        this.bonusScratchable.lock();

        this.bonusScratchable.on('scratchStart', () => {
            this.red.setState(RedStates.WORRY);
        });

        this.bonusScratchable.on('scratchStop', () => {
            this.red.setState(RedStates.IDLE);
        });

        this.bonusScratchable.on('complete', () => {
            this.bonusCompleted = true
            this.red.runHappyBonusAnimation();
            this.red.setState(RedStates.IDLE);

            this.checkForFinish();
        })
    }

    startGame () : void {
        this.menuUI.hide();

        if (this.gameFinished)
            this.clearGame();

        if (this.needToInitObjects) {
            this.initGameObjects(true);
        }

        this.bonusScratchable.unlock();
        this.scratchableCards.unlock();
    }

    finishGame () : void {
        this.menuUI.showHeader();
        this.menuUI.show();
        this.bonusScratchable.lock();
        this.scratchableCards.lock();

        this.gameFinished = true;
    }

    clearGame () : void {
        this.bonusScratchable.destroy();
        this.bonusScratchable = null;
        this.bonusCompleted = false;

        this.scratchableCards.destroy();
        this.scratchableCards = null;
        this.cardsCompleted = false;

        this.menuUI.hideHeader();

        this.needToInitObjects = true;
    }

    initGameObjects (recreateController: boolean = false) : void {
        if (recreateController) {
            this.gameController.create();
            this.menuUI.updateHeaderValues(
                this.gameController.winData.cash,
                this.gameController.winData.coins
            );
        }

        this.initBonus();
        this.initScratchableCards();
        
        this.needToInitObjects = false;
    }

    checkForFinish () : void {
        if (this.cardsCompleted && this.bonusCompleted) { 
            this.finishGame();
        }
    }
}
