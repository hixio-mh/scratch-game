import { 
    gameData,
    ItemData,
    BonusData
} from '../gameData'

import { ProbabilityQueue } from '../utils/Probability'
import { shuffleArray }     from '../utils/ArrayUtils'

interface WinData {
    coins: number,
    cash : number
}

export class GameController {
    public items  : ItemData[];
    public winItem: ItemData;
    public bonus  : BonusData;
    public winData: WinData;
    
    private itemsQueue:   ProbabilityQueue
    private bonusesQueue: ProbabilityQueue

    constructor () {
        this.items = [];
        this.winItem = null;
        this.bonus = null;
        this.winData = null;

        this.itemsQueue = new ProbabilityQueue('probability');
        gameData.items.forEach((item: ItemData) => {
            this.itemsQueue.insert(item);
        })

        this.bonusesQueue = new ProbabilityQueue('probability');
        gameData.bonuses.forEach((bonus: BonusData) => {
            this.bonusesQueue.insert(bonus);
        })
    }

    create (): void {
        const itemsCopy: ItemData[] = []
        gameData.items.forEach((item: ItemData) => {
            if (item.name !== 'loose')
                itemsCopy.push(item);
        });

        this.winItem = this.itemsQueue.pick();
        
        this.items = [];
        if (this.winItem.name !== 'loose') {
            for (let i: number = 0; i < 3; i++) {
                this.items.push(this.winItem);
            }
            itemsCopy.splice(itemsCopy.indexOf(this.winItem), 1);
        }

        while (this.items.length != 6) {
            let item = itemsCopy.pop()
            if (!item) {
                item = this.items[0];
            }
            this.items.push(item);
        }

        shuffleArray(this.items);

        this.bonus = this.bonusesQueue.pick();

        this.calculateWinData();
    }

    clear (): void {
        this.items = [];
        this.winItem = null;
        this.bonus = null;
    }

    calculateWinData (): void {
        this.winData = {
            coins: 0,
            cash : 0
        };
        this.winData.coins = this.winItem.coin + (this.bonus.coin || 0)
        this.winData.cash = this.bonus.cash || 0
    }

    static generateRandomPercent (): number {
        return Math.round(Math.random() * 100);
    }
}