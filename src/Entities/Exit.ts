
import { vec3 } from 'gl-matrix';
import { Entity } from './Entity';

export class Exit extends Entity {

    constructor(id: number, origin: vec3) {
        super(id, origin);
        this.name = 'exit';
        this.origin = origin;
    }

    public update(dt: number): void {

    }
}
