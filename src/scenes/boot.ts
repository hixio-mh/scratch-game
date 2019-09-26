import { loader }          from 'pixi.js'
import { SceneManager }    from '../core/SceneManager'
import { Splash }          from './splash'
import { splashResources } from '../resources/splashResources'

export class Boot extends PIXI.Container {
    constructor () {
        super();
        for (let [, resourceData] of Object.entries(splashResources)) {
            loader.add(resourceData.key, resourceData.url)
        }
        loader.load(this.setup.bind(this));
    }

    setup () {
        SceneManager.goTo(Splash);
    }
}
