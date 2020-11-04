import { Vec3 } from "webgl-obj-loader";
import { Exit } from "./Entities/Exit";
import { Pickup } from "./Entities/Pickup";
import { Player } from "./Entities/Player";
import { Entity } from "./Entity";

export class EntityManager
{
    entities: Entity[];
    idGenerator : number = 0;
    addPlayer(origin:Vec3) : void 
    {
        let pl = new Player(this.idGenerator,origin);
        this.entities.push(pl);
        this.idGenerator++;
    }

    addPickup(origin:Vec3) : void 
    {
        let pu = new Pickup(this.idGenerator,origin);
        this.entities.push(pu);
        this.idGenerator++;
    }

    addExit(origin:Vec3) : void 
    {
        let ex = new Exit(this.idGenerator,origin);
        this.entities.push(ex);
        this.idGenerator++;
    }

    getPlayer() : Player | null {
        for(var i = 0; i < this.entities.length;i++)
        {   
            if(this.entities[i].class = "player")
            {
                return <Player>this.entities[i];
            }
        }
        return null;
    }
    constructor()
    {
        this.entities = [];
    }
}