import { Mesh, Vec3 } from 'webgl-obj-loader';
import { Transform } from './Transform';

export abstract class Entity {
    id: number;
    mesh: Mesh | null;
    active: boolean = true; //if true - run update
    draw: boolean = true; //if true - render
    class: string = "default";
    name: string = "none";
    trans: Transform;
    spawnPoint: Vec3;

    setPosition(x:number,y:number,z:number) : void {
        this.trans.pos = [x,y,z];
        //todo: limits etc
    }

    setAngle(roll:number,yaw:number,pitch:number) : void {
        this.trans.angle = [roll,yaw,pitch];
        //todo: limits etc
    }

    setScale(x:number,y:number,z:number) : void {
        this.trans.scale = [x,y,z];
        //todo: limits etc
    }

    protected constructor(id:number, origin:Vec3)
    {
        this.trans.pos = origin;
        this.trans.angle = [0,0,0];
        this.trans.scale = [1,1,1];
        this.id = id;
        this.mesh = null;
        this.spawnPoint = origin;
    }

    abstract update(dt: number): void;
}
