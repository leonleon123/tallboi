import { Mesh } from 'webgl-obj-loader';
import { Entity } from '../Entities/Entity';

export class Wall extends Entity {

    constructor(id: number, mesh: Mesh) {
        super(id, [0, -1, 0]);
        this.name = 'level';
        this.mesh = mesh;
    }

    public update(dt: number): void{

    }
}
