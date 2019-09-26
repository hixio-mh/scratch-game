import { loader } from 'pixi.js';
import { Updatable } from '../core/IUpdate';

export enum RedStates {
    LOADING,
    IDLE,
    WORRY
    // HAPPY_BONUS,
    // HAPPY_CARD,
    // DISSAPOINTED,
}

export class Red extends PIXI.spine.Spine implements Updatable {
    private currentState : RedStates;
    private lockAnimation: boolean;

    constructor() {
        super(loader.resources['char_mesh'].spineData);

        this.setState(RedStates.IDLE);
    }

    setState(state: RedStates) {
        switch (state) {
            case RedStates.LOADING:
                this.lockAnimation = false;

                this.state.setAnimation(0, 'red_loading_screen_animation_loop', true)
                break;
            case RedStates.WORRY:
                this.lockAnimation = false

                this.state.setAnimation(0, 'red_worry_st', false);
                this.state.addAnimation(0, 'red_worry_loop', true, 0);
                break;
            case RedStates.IDLE:
                if (this.currentState === RedStates.WORRY && !this.lockAnimation)
                    this.state.setAnimation(0, 'red_worry_end', false);

                this.lockAnimation = false;
                this.state.addAnimation(0, 'red_idle_loop', true, 0);
                break;
            }
            this.currentState = state
    }

    runHappyBonusAnimation () {
        if (this.currentState === RedStates.WORRY)
            this.state.setAnimation(0, 'red_worry_end', false);
        this.state.addAnimation(0, 'red_happy_bonus_st', false, 0);
        this.state.addAnimation(0, 'red_happy_bonus_loop', false, 0);
        this.state.addAnimation(0, 'red_happy_bonus_end', false, 0);

        this.lockAnimation = true
    }

    runHappyCardAnimation () {
        if (this.currentState === RedStates.WORRY)
            this.state.setAnimation(0, 'red_worry_end', false);
        this.state.addAnimation(0, 'red_happy_card_st', false, 0);
        this.state.addAnimation(0, 'red_happy_card_loop', false, 0);
        this.state.addAnimation(0, 'red_happy_card_end', false, 0);

        this.lockAnimation = true
    }

    runDisappointedAnimation () {
        if (this.currentState === RedStates.WORRY)
            this.state.setAnimation(0, 'red_worry_end', false);
        this.state.addAnimation(0, 'red_disappointed_st', false, 0);
        this.state.addAnimation(0, 'red_disappointed_loop', false, 0);
        this.state.addAnimation(0, 'red_disappointed_end', false, 0);

        this.lockAnimation = true
    }


    runLoadingAnimation () {
        this.state.setAnimation(0, 'red_loading_screen_animation_loop', true);
        this.state.timeScale = 0.02;
    }
}
