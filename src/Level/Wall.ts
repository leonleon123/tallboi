import { vec3 } from 'gl-matrix';
import { Entity } from '../Entities/Entity';

export class Wall extends Entity {

    public halfExtents: vec3;

    constructor(id: number, origin: vec3, halfExtents: vec3) {
        super(id, origin);
        this.name = 'level';
        this.halfExtents = halfExtents;
    }

    public update(dt: number): void{

    }
}
