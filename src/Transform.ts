import { vec3 } from 'gl-matrix';
import { Utility } from './Utility';

export class Transform {

    public pos: vec3 = [0, 0, 0];
    // roll,yaw,pitch
    public angle: vec3 = [0, 0, 0];
    public scale: vec3 = [1, 1, 1];

    public yawVector: vec3 = [Math.cos(Utility.degToRad(0)),0,Math.sin(Utility.degToRad(0))];
}
