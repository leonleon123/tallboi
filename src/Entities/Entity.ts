import { vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { Transform } from '../Transform';
import { UserInput } from '../UserInput';
import { Utility } from '../Utility';

export abstract class Entity {

    public id: number;
    public mesh: Mesh | null;
    public active = true;
    public draw = true;
    public initialized = false;
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

    //maybe angles need to be normalized to -180 - 180 ??
    public setRoll(roll: number): void {
        if(roll < -180)
            roll += 360;
        if(roll >= 180)
            roll -= 360;
        this.trans.angle[0] = roll;
    }

    public setYaw(yaw: number): void {
        if(yaw < -180)
            yaw += 360;
        if(yaw >= 180)
            yaw -= 360;
        this.trans.angle[1] = yaw;
        this.trans.yawVector = [Math.cos(Utility.degToRad(yaw)),0,-Math.sin(Utility.degToRad(yaw))]; //It should be + at sinus, but only - works. Why?
    }

    public setPitch(pitch: number): void {
        if(pitch < -180)
            pitch += 360;
        if(pitch >= 180)
            pitch -= 360;
        this.trans.angle[2] = pitch;
    }

    public setAngle(roll: number, yaw: number, pitch: number): void {
        this.setRoll(roll);
        this.setYaw(yaw);
        this.setPitch(pitch);
        // todo: limits etc
    }

    public setScale(x: number, y: number, z: number): void {
        this.trans.scale = [x, y, z];
        // todo: limits etc
    }

    abstract update(dt: number, input: UserInput): void;
}
