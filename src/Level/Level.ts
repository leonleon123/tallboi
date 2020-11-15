
import { Mesh } from 'webgl-obj-loader';
import { Entity } from '../Entities/Entity';
import { Wall } from './Wall';

export class Level extends Entity {

    public walls: Wall[];

    constructor(id: number, mesh: Mesh) {
        super(id, [0, 0, 0]);
        this.name = 'level';
        this.mesh = mesh;
        this.color = [1, 1, 1, 1];
    }

    public update(dt: number): void{

    }
}
