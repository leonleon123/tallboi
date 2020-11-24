import { Body, World } from 'cannon';
import { vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { Entity } from '../Entities/Entity';
import { Exit } from '../Entities/Exit';
import { Pickup } from '../Entities/Pickup';
import { Player } from '../Entities/Player';
import { Warp } from '../Entities/Warp';
import { pickRandom } from '../Util/Utility';
import { Level } from './Level';
import { UserInput } from './UserInput';

export class EntityManager {

    public entities: Entity[] = [];
    public player: Player;
    public level: Level;
    public world: World;
    private idGenerator = 0;

    constructor(private userInput: UserInput) {
        this.world = new World();
        this.world.gravity.set(0, 0, 0);
    }

    public createPlayerAt(origin: vec3, originalYaw: number, mesh: Mesh, arms: Mesh[], legs: Mesh[], collisionBodies: Body[]): void {
        this.player = new Player(this.idGenerator++, origin, originalYaw, mesh, collisionBodies[0], arms, legs, this.userInput);
        this.world.addBody(this.player.body);
        this.entities.push(this.player);
    }

    public addPickups(meshes: Mesh[], collisionBodies: Body[]): void{
        for (const body of collisionBodies){
            this.addPickup([body.position.x, body.position.y, body.position.z], pickRandom(meshes));
        }
    }

    public addPickup(origin: vec3, mesh: Mesh): void {
        const pu = new Pickup(this.idGenerator++, origin, mesh, this.player);
        this.entities.push(pu);
    }

    public createExit(mesh: Mesh, origin: vec3, exitSize: number): void {
        const ex = new Exit(this.idGenerator++, origin, mesh, exitSize, this.player);
        this.entities.push(ex);
    }

    public createWarp(mesh: Mesh, origin: vec3, to: string): void {
        const ex = new Warp(this.idGenerator++, origin, mesh, to, this.player);
        this.entities.push(ex);
    }

    public createLevel(mesh: Mesh, collisionBodies: Body[]): void{
        this.level = new Level(this.idGenerator++, mesh, collisionBodies);
        for (const body of this.level.collisionBodies){
            this.world.addBody(body);
        }
    }

    public enablePersistant(): void {
        for (const entity of this.entities) {
            if (entity.persistant){
                entity.draw = true;
                entity.active = true;
            }
            if (entity instanceof Exit){
                entity.red = true;
                entity.initialized = false;
                entity.color = [1, 0, 0, 1];
            }
        }
    }

}
