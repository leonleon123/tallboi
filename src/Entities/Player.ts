import { vec3 } from 'gl-matrix';
import { Entity } from './Entity';

export class Player extends Entity {
    // placeholder
    private speed = 5.0;

    // todo: figure out what else
    constructor(id: number, origin: vec3) {
        super(id, origin);
        this.name = 'player_name';
        this.origin = origin;
    }

    public update(dt: number): void {

    }
}
