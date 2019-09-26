import { Updatable, isUpdatable } from '../core/IUpdate'
import { Container, DisplayObject } from 'pixi.js'

export class BaseScene extends Container implements Updatable {
    private updatableObjects: Updatable[];

    constructor () {
        super();

        this.updatableObjects = [];
    }

    update (delta: number): void {
        this.updatableObjects.forEach((obj: any) => {
            if (isUpdatable(obj)) 
                obj.update(delta);
        })
    }

    addChild<T extends DisplayObject> (child: T, ...additionalChilds: DisplayObject[]): T {
        super.addChild(child, ...additionalChilds);
        if (isUpdatable(child))
            this.updatableObjects.push(child);

        additionalChilds.forEach(child => {
            if (isUpdatable(child))
                this.updatableObjects.push(child);
        });

        return child;
    }

    addChildAt<T extends DisplayObject> (child: T, index: number): T {
        super.addChildAt(child, index);
        if (isUpdatable(child))
            this.updatableObjects.push(child);

        return child;
    }
}