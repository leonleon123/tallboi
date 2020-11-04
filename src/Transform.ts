import { Vec3 } from "webgl-obj-loader";

export class Transform
{
    pos:Vec3 = [0,0,0];
    angle:Vec3 = [0,0,0]; //roll,yaw,pitch
    scale:Vec3 = [1,1,1];
}