import { loader }        from 'pixi.js';
import * as WebFont      from 'webfontloader'
import { BaseScene }     from '../scenes/baseScene';
import { SceneManager }  from '../core/SceneManager';
import { Game }          from '../scenes/game';
import { Red }           from '../gameObjects/red';
import { config }        from '../config';
import { gameResources } from '../resources/gameResources';
import { Updatable }     from 'core/IUpdate';

export class Splash extends BaseScene implements Updatable {
    private fontsLoaded: boolean;
    private assetsLoaded: boolean;

    constructor () {
        super();
        this.fontsLoaded = false;
        this.assetsLoaded = false;

        // load assets
        for (let [, resourceData] of Object.entries(gameResources)) {
            loader.add(resourceData.key, resourceData.url)
        }
        loader.load(this.setup.bind(this));

        // load fonts
        if (config.webfonts.length) {
            WebFont.load({
              custom: { 
                families: config.webfonts
              },
              active: () => {
                  this.fontsLoaded = true
              }
            })
          }

        // add animated char during loading
        const loadingRed = new Red();
        this.addChild(loadingRed);
        loadingRed.runLoadingAnimation();

        loadingRed.x = config.width / 2;
        loadingRed.y = config.height / 2;
    }

    setup () {
        this.assetsLoaded = true;
    }

    update () {
        if (this.assetsLoaded && this.fontsLoaded)
            SceneManager.goTo(Game);
    }
}
