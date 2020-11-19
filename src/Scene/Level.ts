
import { Body } from 'cannon';
import { Mesh } from 'webgl-obj-loader';
import { Entity } from '../Entities/Entity';

export class Level extends Entity {

    public ready = false;
    public check = false;
    public bkgColor = [0.529, 0.808, 0.98]; // old color: 240 / 255, 198 / 255, 120 / 255

    constructor(id: number, mesh: Mesh, collisionBodies: Body[]) {
        super(id, [0, 0, 0]);
        this.name = 'level';
        this.mesh = mesh;
        // this.color = [240 / 256, 198 / 256, 120 / 256, 1];
        this.collisionBodies = collisionBodies;
    }

    public update(dt: number): void{

    }
}
