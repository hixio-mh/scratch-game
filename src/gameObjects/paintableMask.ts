import {
  Sprite,
  Texture,
  Point,
  CanvasRenderTarget,
  interaction
} from 'pixi.js';

export interface PaintEvent {
    prev  : Point,
    pos   : Point,
    percent: number
}

const PAINT_WEIGHT = 60

export class PaintableMask extends Sprite {
    private prevPos: Point
    private context: CanvasRenderingContext2D;
    private drawing: boolean;
    private locked : boolean;

    constructor(width: number, height: number) {
        let renderTarget = new CanvasRenderTarget(width, height, 1);
        let texture = Texture.from(renderTarget.canvas);
        
        super(texture);

        this.context = renderTarget.context;
        this.context.fillStyle = '#FFFFFF';
        this.context.fillRect(0, 0, width, height);
        this.context.lineWidth = PAINT_WEIGHT;
        this.context.lineCap   = 'round';

        this.interactive = true;

        // Add interactivity
        this.on('mousedown', this.onDown.bind(this));
        this.on('mousemove', this.onMove.bind(this));
        this.on('mouseup', this.onUp.bind(this));
        this.on('mouseupoutside', this.onUp.bind(this));
        this.on('touchstart', this.onDown.bind(this));
        this.on('touchmove', this.onMove.bind(this));
        this.on('touchend', this.onUp.bind(this));
        this.on('touchendoutside', this.onUp.bind(this));

        this.prevPos = null;

        this.drawing = false;
    }

    onDown (e: interaction.InteractionEvent) {
        if (this.locked)
            return
        this.prevPos = e.data.global;

        this.drawing = true;

        var pos = e.data.getLocalPosition(this);
        pos.x = pos.x + this.anchor.x * this.width
        pos.y = pos.y + this.anchor.y * this.height

        this.context.beginPath();
        this.context.moveTo(pos.x, pos.y);
        this.context.lineTo(pos.x, pos.y + 0.5);
        this.context.stroke();

        this.texture.update();

        this.emit('paintStart');
    }

    onUp () {
        if (this.locked)
            return
        if (this.drawing) {
            this.emit('paintStop')
        }
        this.drawing = false;
    }

    onMove (e: interaction.InteractionEvent) {
        if (this.locked)
            return
        if (this.drawing) {
            var pos = e.data.getLocalPosition(this);
            pos.x = pos.x + this.anchor.x * this.width
            pos.y = pos.y + this.anchor.y * this.height

            this.context.lineTo(pos.x, pos.y);
            this.context.stroke();

            this.texture.update();

            let percent = this.calcPercentComplete();

            this.emit('paint', {
                prev  : this.prevPos,
                pos   : e.data.global,
                percent: percent
            });

            this.prevPos = e.data.global;
        }
    }

    calcPercentComplete(x = 0, y = 0 , width = this.texture.width, height = this.texture.height) {
        let data = this.context.getImageData(x, y, width, height).data;

        let count = 0;

        for(let i = 0, len = data.length; i < len; i += 4) {
            if(data[i] < 255) {
              count++;
            }
        }

        return (100 * count / (width * height));
    }
    
    lock () {
        this.locked = true;
    }

    unlock () {
        this.locked = false;
    }
}
