
import { Body } from 'cannon';
import { Mesh } from 'webgl-obj-loader';
import { Entity } from '../Entities/Entity';

export class Level extends Entity {

    constructor(id: number, mesh: Mesh, collisionBodies: Body[]) {
        super(id, [0, 0, 0]);
        this.name = 'level';
        this.mesh = mesh;
        this.color = [240 / 256, 198 / 256, 120 / 256, 1];
        this.collisionBodies = collisionBodies;
    }

    public update(dt: number): void{

    }
}
