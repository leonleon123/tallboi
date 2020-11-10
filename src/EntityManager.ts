import { vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { Entity } from './Entities/Entity';
import { Exit } from './Entities/Exit';
import { Map } from './Entities/Map';
import { Pickup } from './Entities/Pickup';
import { Player } from './Entities/Player';

export class EntityManager {

    public entities: Entity[];
    public player: Player;
    private idGenerator = 0;

    public createPlayerAt(origin: vec3,mesh:Mesh): void {
        this.player = new Player(this.idGenerator++, origin, mesh);
        this.entities.push(this.player);
    }

    public addPickup(origin: vec3,mesh:Mesh): void {
        const pu = new Pickup(this.idGenerator++, origin,mesh);
        pu.setScale(0.2,0.2,0.2);
        this.entities.push(pu);
    }

    public createExitAt(origin: vec3): void {
        const ex = new Exit(this.idGenerator++, origin);
        this.entities.push(ex);
    }

    public createMap(mesh: Mesh): void{
        const map = new Map(this.idGenerator++, vec3.fromValues(0, 0, 0), mesh);
        this.entities.push(map);
    }

    

    constructor() {
        this.entities = [];
    }
}
