import { Container, Sprite } from 'pixi.js'

export class LinearComposite extends Container {
    constructor (...objects: Sprite[]) {
        super();

        objects.forEach((obj: Sprite) => {
            obj.anchor.set(0, 0.5)
            if (this.children.length === 0)
                this.addChild(obj);
            else {
                obj.position.set(this.width, 0);
                this.addChild(obj);
            }
        })
    }
} 