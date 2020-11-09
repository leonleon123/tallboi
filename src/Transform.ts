import { vec3 } from 'gl-matrix';

export class Transform {

    public pos: vec3 = [0, 0, 0];
    // roll,yaw,pitch
    public angle: vec3 = [0, 0, 0];
    public scale: vec3 = [1, 1, 1];
}
