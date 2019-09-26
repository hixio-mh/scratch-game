import * as PIXI from "pixi.js";

import { Application } from './Application';
import { isUpdatable } from './IUpdate';

export class SceneManager {
    protected static instance: SceneManager;

    protected app: Application = Application.getInstance();
    protected currentScene: PIXI.Container;

    constructor () {
        this.app.ticker.add((delta: number) => {
            if (this.currentScene && isUpdatable(this.currentScene)) {
                this.currentScene.update(delta)
            }
        });
    }

    // Public methods
    static goTo (sceneClass: any) {
        this.getInstance().goTo(sceneClass);
    }

    protected goTo (sceneClassOrInstance: any) {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
        }

        this.currentScene = (sceneClassOrInstance instanceof PIXI.DisplayObject)
            ? sceneClassOrInstance
            : new sceneClassOrInstance();

        this.app.stage.addChild(this.currentScene);
    }

    static getInstance () { 
        if (!this.instance) {
            this.instance = new SceneManager();
        }
        return this.instance;
    }
}