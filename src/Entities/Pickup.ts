import { Vec3 } from "webgl-obj-loader";
import { Entity } from "../Entity";


export class Pickup extends Entity { //maybe this needs to be a parent class of all pickups (if we make more than just the 'required' one)

    constructor(id:number,origin:Vec3)
    {
        super(id,origin);
        this.name = "pickup"
        this.class = "pickup"
        this.spawnPoint = origin;
    }
    update(dt:number) : void {

    }
}