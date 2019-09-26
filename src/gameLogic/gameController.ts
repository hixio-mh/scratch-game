import { 
    gameData,
    ItemData,
    BonusData
} from '../gameData'

interface ItemProbability {
    data: ItemData | BonusData,
    from: number,
    to  : number
}

export class GameController {
    public items            : ItemData[];
    public bonus            : BonusData;
    private itemsProbability: ItemProbability[];
    private bonusProbability: ItemProbability[];

    constructor () {
        this.init();
    }

    init () {
        this.itemsProbability = [];
        this.bonusProbability = [];

        gameData.items.forEach((item: ItemData) => {
            if (!this.itemsProbability) {
                this.itemsProbability.push({
                    data: item,
                    from: 0,
                    to  : item.probability
                })
            }
            let lastItem = this.itemsProbability[this.itemsProbability.length - 1];

            this.itemsProbability.push({
                data: item,
                from: (lastItem.to + 1),
                to: (lastItem.to + 1) + item.probability
            });
        });

        gameData.bonuses.forEach((bonus: BonusData) => {
            if (!this.bonusProbability) {
                this.bonusProbability.push({
                    data: bonus,
                    from: 0,
                    to  : bonus.probability
                })
            }
            let lastBonus = this.bonusProbability[this.bonusProbability.length - 1];
            this.bonusProbability.push({
                data: bonus,
                from: (lastBonus.to + 1),
                to  : (lastBonus.to + 1) + bonus.probability
            })
        })
    }

    create () {

    }

    static generateRandomPercent () {
        return Math.round(Math.random() * 100);
    }
}