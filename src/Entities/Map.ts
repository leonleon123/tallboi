import { vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { Entity } from './Entity';

export class Map extends Entity {

    constructor(id: number, origin: vec3, mesh: Mesh) {
        super(id, origin);
        this.name = 'map';
        this.origin = origin;
        this.mesh = mesh;
    }

    public update(dt: number): void{

    }
}
