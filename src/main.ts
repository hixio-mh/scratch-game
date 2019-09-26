import { Application } from './core/Application';
import { SceneManager } from './core/SceneManager';
import 'pixi-spine';
import { Boot } from './scenes/boot'

Application.getInstance({
    width: 1080,
    height: 1920,
    backgroundColor: 0x000000
});

// Boot the game
SceneManager.goTo(Boot)
