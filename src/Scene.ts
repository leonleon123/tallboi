import { Entity } from './Entity';

export class Scene {
    entities: Entity[];

    constructor(){
        this.entities = [];
    }

    update(): void{
        for (const entity of this.entities){
            entity.update();
        }
    }
}
