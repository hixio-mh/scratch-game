export interface ItemData {
    name       : string,
    frame      : string,
    frameSmall : string,
    probability: number,
    coin       : number
}

export interface BonusData {
    name       : string,
    frame      : string,
    probability: number,
    coin?      : number,
    cash?      : number
}

export const gameData = {
    gameCost           : 60,
    scratchLimitPercent: 50,
    items              : [
        {
            name       : 'leaf',
            frame      : 'magic_forest_leaf.png',
            frameSmall : 'magic_forest_leaf_small.png',
            probability: 0.06,
            coin       : 35
        },
        {
            name       : 'rope',
            frame      : 'magic_forest_rope.png',
            frameSmall : 'magic_forest_rope_small.png',
            probability: 0.04,
            coin       : 50
        },
        {
            name       : 'tent',
            frame      : 'magic_forest_tent.png',
            frameSmall : 'magic_forest_tent_small.png',
            probability: 0.02,
            coin       : 100
        },
        {
            name       : 'bonfire',
            frame      : 'magic_forest_bonfire.png',
            frameSmall : 'magic_forest_bonfire_small.png',
            probability: 0.1,
            coin       : 25
        },
        {
            name       : 'bow',
            frame      : 'magic_forest_bow.png',
            frameSmall : 'magic_forest_bow_small.png',
            probability: 0.08,
            coin       : 30
        },
        {
            name       : 'loose',
            frame      : null,
            frameSmall : null,
            probability: 0.7,
            coin       : 0
        }
    ],
    bonuses: [
        {
            name       : 'coin',
            frame      : 'magic_forest_coin_icon_big.png',
            probability: 0.8,
            coin       : 25
        },
        {
            name       : 'cash',
            frame      : 'magic_forest_dollar_icon.png',
            probability: 0.2,
            cash       : 1
        }
    ]
}