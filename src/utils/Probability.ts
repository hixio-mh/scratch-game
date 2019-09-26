function weightGetter(field: any) {
    switch (typeof field) {
        case 'function':
        return field;
        case 'string':
        return (element: any) => element[field];
        default:
        throw new Error('weightField should be either function or a string');
    }
}
  
function idGetter (field: any) {
    switch(typeof field) {
        case 'function':
        return field;
        case 'string':
        return (element: any) => element[field];
        case 'undefined':
        return null;
        default:
        throw new Error('idField should be either function or a string');
    }
}
  
 export class ProbabilityQueue {
    private weight  : Function;
    private id      : Function;
    private elements: any[];
    private sum     : number;

    constructor(weightField: any, idField?: any) {
        this.weight = weightGetter(weightField);
        this.id = idGetter(idField);
        this.elements = [];
        this.sum = 0.0;
    }

    update() {
        this.sum = 0.0;
        for(let i=0; i<this.elements.length; ++i) {
            const weight = this.weight(this.elements[i]);
            if(weight < 0) {
                throw new Error('Element updated to negative weight');
            }      
            this.sum += weight;
        }
    }

    insert (element: any) {
        this.elements.push(element);
        const weight = this.weight(element);
        if(weight < 0) {
            throw new Error('Added element with negative weight');
        }
        this.sum += this.weight(element);
    }

    remove (eid: number) {
        let idx = -1;
        if(this.id) {
            idx = this.elements.findIndex(e => this.id(e) === eid);
        } else {
            idx = this.elements.indexOf(eid);
        }
        if(idx >= 0) {
            this.sum -= this.weight(this.elements[idx]);
            this.elements.splice(idx, 1);
        }
    }

    probability(element: any) {
        return this.weight(element) / this.sum;
    }

    pick() {
        const r = Math.random() * this.sum;
        let begin = 0;
        for(let i=0; i < this.elements.length; ++i) {
            const w = this.weight(this.elements[i]);
            if((r >= begin) && (r < begin + w)) {
                return this.elements[i];
            }
            begin += w;
        }
        return null;
    }
};