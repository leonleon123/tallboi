
import { vec2, vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { Entity } from './Entity';
import { Player } from './Player';

export class Exit extends Entity {
    private exitSize: number;
    public red: boolean;

    constructor(id: number, origin: vec3, mesh: Mesh, exitSize: number, private player: Player) {
        super(id, origin);
        this.name = 'exit';
        this.origin = origin;
        this.exitSize = exitSize;
        this.mesh = mesh;
        this.red = true;
        this.persistant = true;
        this.color = [1, 0, 0, 1];
    }

    public update(dt: number): void {
        if (this.player.height >= this.exitSize){
            if (this.red){
                this.color = [0, 1, 0, 1];
                this.red = false;
                this.initialized = false;
            }
            // with colliders, this should be done in 3D by
            // checking if origin 3D point is in the 3D player collider
            let point1: vec2 = vec2.create();
            let point2: vec2 = vec2.create();
            point1 = [this.origin[0], this.origin[2]];
            point2 = [this.player.trans.pos[0], this.player.trans.pos[2]];

            if (vec2.dist(point1, point2) < 0.75) {
                this.player.exited = true;
            }
        }
    }
}
