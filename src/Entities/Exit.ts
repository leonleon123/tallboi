import { Vec3 } from "webgl-obj-loader";
import { Entity } from "../Entity";


export class Exit extends Entity {

    constructor(id:number,origin:Vec3)
    {
        super(id,origin);
        this.name = "exit"
        this.class = "exit"
        this.spawnPoint = origin;
    }
    update(dt:number) : void {

    }
}