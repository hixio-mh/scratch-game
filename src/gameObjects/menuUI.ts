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

// const ORANGE_COLOR = 0xff8729;
// const RED_COLOR    = 0xf45b4e;
const LIGHT_COLOR  = 0xffffff;
// const DARK_COLOR   = 0x311d1f;
interface MenuUIConfig {
    width  : number,
    height : number,
    onClick: Function
}

export class MenuUI extends Container {
    private footer: Container;
    private fade  : Graphics;
    private button: Button;

    constructor (private config: MenuUIConfig) {
        super();

        this.init();
    }
    
    init () {
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
    }

    initButton () {
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

    show () {
        this.visible = true
    }

    hide () {
        this.visible = false
    }
}