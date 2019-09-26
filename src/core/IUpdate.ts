interface updateFunc {
    (delta?: number): void;
}

export interface Updatable {
    update: updateFunc
}

export function isUpdatable (obj: any): obj is Updatable {
    return (obj as Updatable).update !== undefined;
}