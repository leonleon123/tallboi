import { vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { Entity } from './Entities/Entity';
import { Exit } from './Entities/Exit';
import { Pickup } from './Entities/Pickup';
import { Player } from './Entities/Player';
import { Level } from './Level/Level';
import { UserInput } from './UserInput';

export class EntityManager {

    public entities: Entity[];
    public player: Player;
    public level: Level;
    private idGenerator = 0;

    public createPlayerAt(origin: vec3, mesh: Mesh): void {
        this.player = new Player(this.idGenerator++, origin, mesh, this.userInput);
        this.entities.push(this.player);
    }

    public addPickup(origin: vec3, mesh: Mesh): void {
        const pu = new Pickup(this.idGenerator++, origin, mesh);
        pu.setScale(0.2, 0.2, 0.2);
        this.entities.push(pu);
    }

    public createExitAt(origin: vec3): void {
        const ex = new Exit(this.idGenerator++, origin);
        this.entities.push(ex);
    }

    public createLevel(mesh: Mesh): void{
        this.level = new Level(this.idGenerator++, mesh);
    }

    constructor(private userInput: UserInput) {
        this.entities = [];
    }
}
