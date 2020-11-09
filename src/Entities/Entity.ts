import { vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { Transform } from '../Transform';

export abstract class Entity {

    public id: number;
    public mesh: Mesh | null;
    public active = true;
    public draw = true;
    public name = 'none';
    public trans: Transform = new Transform();
    public origin: vec3;
    public vao: WebGLVertexArrayObject;

    protected constructor(id: number, origin: vec3) {
        this.trans.pos = origin;
        this.trans.angle = [0, 0, 0];
        this.trans.scale = [1, 1, 1];
        this.id = id;
        this.mesh = null;
        this.origin = origin;
    }

    public setPosition(x: number, y: number, z: number): void {
        this.trans.pos = [x, y, z];
        // todo: limits etc
    }

    public setAngle(roll: number, yaw: number, pitch: number): void {
        this.trans.angle = [roll, yaw, pitch];
        // todo: limits etc
    }

    public setScale(x: number, y: number, z: number): void {
        this.trans.scale = [x, y, z];
        // todo: limits etc
    }

    abstract update(dt: number): void;
}
