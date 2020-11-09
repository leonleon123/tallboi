import { vec3 } from 'gl-matrix';
import { Entity } from './Entity';

// maybe this needs to be a parent class of all pickups (if we make more than just the 'required' one)
export class Pickup extends Entity {

    constructor(id: number, origin: vec3) {
        super(id, origin);
        this.name = 'pickup';
        this.origin = origin;
    }

    public update(dt: number): void {

    }
}
