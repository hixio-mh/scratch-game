import { Sprite, Texture } from 'pixi.js'

export interface ButtonConfig {
    texture?    : Texture,
    textureDown?: Texture,
    textureOver?: Texture,
    callback?   : Function,
}

export class Button extends Sprite {
    private isDown: boolean
    private isOver: boolean

    constructor (private config: ButtonConfig) {
        super();

        const defaultTexture = config.texture || Texture.EMPTY

        this.config = Object.assign({
            texture    : defaultTexture,
            textureDown: defaultTexture,
            textureOver: defaultTexture,
            callback   : () => {}
        }, this.config)

        this.texture= config.texture

        this.isDown = false;
        this.isOver = false;

        this.buttonMode = true;

        this.anchor.set(0.5);

        // make the button interactive...
        this.interactive = true;
    
        this
            // set the mousedown and touchstart callback...
            .on('mousedown',       this.onButtonDown)
            .on('touchstart',      this.onButtonDown)

            // set the mouseup and touchend callback...
            .on('mouseup',         this.onButtonUp)
            .on('touchend',        this.onButtonUp)
            .on('mouseupoutside',  this.onButtonUp)
            .on('touchendoutside', this.onButtonUp)

            // set the mouseover callback...
            .on('mouseover',       this.onButtonOver)

            // set the mouseout callback...
            .on('mouseout',        this.onButtonOut)

            // listen to click and tap events :
            .on('click',           this.config.callback)
            .on('tap',             this.config.callback)
    }

    onButtonDown () {
        this.isDown  = true;
        this.texture = this.config.textureDown;
    }

    onButtonUp () {
        this.isDown = false;

        if (this.isOver)
            this.texture = this.config.textureOver;
        else
            this.texture = this.config.texture;
    }

    onButtonOver () {
        this.isOver = true;

        if (this.isDown)
            return;

        this.texture = this.config.textureOver;
    }

    onButtonOut () {
        this.isOver = false;

        if (this.isDown)
            return;

        this.texture = this.config.texture;
    }
}