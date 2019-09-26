import {
    Container,
    Graphics,
    Sprite,
    loader,
    Text
}                          from 'pixi.js';
import { gameResources }   from 'resources/gameResources';
import { Application }     from '../core/Application'       
import { Button }          from './button'
import { LinearComposite } from './linearComposite'
import { config }          from '../config'
import { gameData }        from '../gameData'

const FOOTER_FRAME = 'magic_forest_frame3.png';
const BUTTON_FRAME = 'magic_forest_button.png';
const HEADER_FRAME = 'magic_forest_frame1.png';

const COIN_FRAME = 'magic_forest_coin_icon_small.png';
const CASH_FRAME = 'magic_forest_dollar_icon.png';

// const ORANGE_COLOR = 0xff8729;
const RED_COLOR    = 0xf45b4e;
const LIGHT_COLOR  = 0xffffff;
const DARK_COLOR   = 0x311d1f;
interface MenuUIConfig {
    width  : number,
    height : number,
    onClick: Function
}

export class MenuUI extends Container {
    private footer: Container;
    private fade  : Graphics;
    private button: Button;
    private header: Container;

    private headerCoins   : Text;
    private headerCash    : Text;

    constructor (private config: MenuUIConfig) {
        super();
        this.footer = null;
        this.fade   = null;
        this.button = null;
        this.header = null;

        this.headerCash  = null;
        this.headerCoins = null;

        this.init();
    }
    
    init (): void {
        this.fade = new Graphics();
        this.fade.beginFill(0x000000, 0.4);
        this.fade.drawRect(0, 0, this.config.width, this.config.height);
        this.addChild(this.fade);

        const spriteSheet = loader.resources[gameResources.main_spritesheet.key];
        
        this.footer = new Container();
        this.addChild(this.footer);

        const footerBg = new Sprite(spriteSheet.textures[FOOTER_FRAME]);
        this.footer.addChild(footerBg);

        this.footer.position.set(this.config.width / 2 - this.footer.width / 2, this.config.height - this.footer.height);

        this.initButton();

        this.initHeader();
    }

    initHeader (): void {
        const mainSpritesheet = loader.resources[gameResources.main_spritesheet.key]
        this.header = new Container();
        this.addChild(this.header);

        const headerBg = new Sprite(mainSpritesheet.textures[HEADER_FRAME]);
        this.header.addChild(headerBg)

        this.header.position.set(config.width / 2 - this.header.width / 2, 250);
        
        const title = new Text('YOU WIN', {
            fontFamily : config.FONT_BASE,
            fontSize   : 116,
            fill       : RED_COLOR,
            align      : 'center'
        });
        this.header.addChild(title);
        title.position.set(this.header.width / 2 - title.width / 2, 50);


        const amountTextStyle = {
            fontFamily : config.FONT_BASE,
            fontSize   : 126,
            fill       : DARK_COLOR,
            align      : 'center'
        }
        this.headerCash = new Text('0 ', amountTextStyle)
        let cashImg = new Sprite(mainSpritesheet.textures[CASH_FRAME])

        this.headerCoins = new Text('0   ', amountTextStyle)
        let coinsImg = new Sprite(mainSpritesheet.textures[COIN_FRAME])

        const amountComposite = new LinearComposite(
            this.headerCash,
            cashImg,
            this.headerCoins,
            coinsImg
        );
        this.header.addChild(amountComposite);

        amountComposite.position.set(this.header.width / 2 - amountComposite.width / 2, 230);
    }

    updateHeaderValues(cash: number, coins: number) {
        this.headerCash.text = String(cash);
        this.headerCoins.text = coins ? String(coins) : '0  ';
    }

    initButton (): void {
        const _btnSprite = new Sprite(loader.resources[gameResources.main_spritesheet.key].textures[BUTTON_FRAME]);
        _btnSprite.anchor.set(0.5);

        const textStyle = {
            fontFamily : config.FONT_BASE,
            fontSize   : 90,
            fill       : LIGHT_COLOR,
            align      : 'center'
        }
        const _btnTextPart1 = new Text(`play for ${gameData.gameCost} `, textStyle);

        const _btnImageInText = new Sprite(loader.resources[gameResources.main_spritesheet.key].textures['magic_forest_coin_icon_small.png']);

        const _btnContent = new LinearComposite(_btnTextPart1, _btnImageInText);
        _btnContent.position.set(-_btnContent.width / 2, -20);
        _btnSprite.addChild(_btnContent);

        this.button = new Button({
            texture : Application.getInstance().renderer.generateTexture(_btnSprite),
            callback: this.config.onClick.bind(this)
        });
        this.button.anchor.set(0.5)
        let buttonOffsetY = 100
        this.button.position.set(this.footer.width / 2, this.footer.height / 2 + buttonOffsetY);
        this.footer.addChild(this.button);
    }

    showHeader (): void {
        this.header.visible = true;
    }

    hideHeader (): void {
        this.header.visible = false;
    }

    show (): void {
        this.visible = true
    }

    hide (): void {
        this.visible = false
    }
}