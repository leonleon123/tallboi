import { Vec3 } from 'webgl-obj-loader';
import { Entity } from '../Entity';
export class Player extends Entity
{
    speed: number = 5.0; //placeholder
    //todo: figure out what else
    constructor(id:number,origin:Vec3)
    {
        super(id,origin);
        this.name = "player_name"
        this.class = "player"
        this.spawnPoint = origin;
    }

    update (dt:number) : void {
        
    }
}