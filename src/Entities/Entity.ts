import { Body } from 'cannon';
import { mat4, vec3, vec4 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { MaterialRenderInfo } from '../Util/Interfaces';
import { Transform } from '../Util/Transform';
import { degToRad } from '../Util/Utility';

export abstract class Entity {

    public id: number;
    public mesh: Mesh | null;
    public active = true;
    public draw = true;
    public persistant = false; // used for entities that are added only at the start of level
    public initialized = false;
    public name = 'none';
    public trans: Transform = new Transform();
    public origin: vec3;
    public materialRenderInfos: MaterialRenderInfo[] = [];
    public color: vec4 = [1, 1, 1, 1];
    public collisionBodies: Body[];

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
    }

    public setRoll(roll: number): void {
        if (roll < -180) {
            roll += 360;
        }
        if (roll >= 180) {
            roll -= 360;
        }
        this.trans.angle[0] = roll;
    }

    public setYaw(yaw: number): void {
        if (yaw < -180) {
            yaw += 360;
        }
        if (yaw >= 180) {
            yaw -= 360;
        }
        this.trans.angle[1] = yaw;
        this.trans.yawVector = [Math.cos(degToRad(yaw)), 0, -Math.sin(degToRad(yaw))];
    }

    public setPitch(pitch: number): void {
        if (pitch < -180) {
            pitch += 360;
        }
        if (pitch >= 180) {
            pitch -= 360;
        }
        this.trans.angle[2] = pitch;
    }

    public setAngle(roll: number, yaw: number, pitch: number): void {
        this.setRoll(roll);
        this.setYaw(yaw);
        this.setPitch(pitch);
    }

    public setScale(x: number, y: number, z: number): void {
        this.trans.scale = [x, y, z];
    }

    abstract update(dt: number): void;

    public getModelView(): mat4{
        const M: mat4 = mat4.create();
        mat4.translate(M , M, this.trans.pos);
        mat4.rotateX(M, M, degToRad(this.trans.angle[0]));
        mat4.rotateY(M, M, degToRad(this.trans.angle[1]));
        mat4.rotateZ(M, M, degToRad(this.trans.angle[2]));
        mat4.scale(M, M, this.trans.scale);

        return M;
    }
}
