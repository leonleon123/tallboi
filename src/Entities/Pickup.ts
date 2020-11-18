import { vec2, vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { Entity } from './Entity';
import { Player } from './Player';

// maybe this needs to be a parent class of all pickups (if we make more than just the 'required' one)
export class Pickup extends Entity {

    private randomOffset = Math.random();

    constructor(
        id: number, origin: vec3, mesh: Mesh,
        private player: Player
    ) {
        super(id, origin);
        this.name = 'pickup';
        this.origin = origin;
        this.mesh = mesh;
        // this.color = [0.4, 0.2, 0.6, 1];
        this.persistant = true;
        this.setYaw(this.randomOffset * 360 - 180);
    }

    public update(dt: number): void {

        this.setYaw(this.trans.angle[1] + 180 * dt);
        this.setPosition(this.origin[0], this.origin[1] + Math.sin(Date.now() / 500 + this.randomOffset * Math.PI * 2) / 5, this.origin[2]);

        // with colliders, this should be done in 3D by
        // checking if origin 3D point is in the 3D player collider
        let point1: vec2 = vec2.create();
        let point2: vec2 = vec2.create();
        point1 = [this.origin[0], this.origin[2]];
        point2 = [this.player.trans.pos[0], this.player.trans.pos[2]];

        if (vec2.dist(point1, point2) < 0.75) {
            this.player.onPickup(this);
        }

    }
}
