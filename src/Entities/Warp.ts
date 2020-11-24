
import { vec2, vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { Entity } from './Entity';
import { Player } from './Player';

export class Warp extends Entity {
    private to: string;
    public red: boolean;

    constructor(id: number, origin: vec3, mesh: Mesh, to: string, private player: Player) {
        super(id, origin);
        this.name = 'warp';
        this.origin = origin;
        this.mesh = mesh;
        this.persistant = false;
        this.to = to;
        this.draw = false;
    }

    public update(dt: number): void {
        let point1: vec2 = vec2.create();
        let point2: vec2 = vec2.create();
        point1 = [this.origin[0], this.origin[2]];
        point2 = [this.player.trans.pos[0], this.player.trans.pos[2]];
        if (vec2.dist(point1, point2) < 1.7) {
            // console.log('hit warp');
            this.player.warpTo = this.to;
        }
    }
}
