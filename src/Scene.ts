import { Vec3 } from 'webgl-obj-loader';
import { Player } from './Entities/Player';
import { Entity } from './Entity';
import { Exit } from './Entities/Exit';
import { Pickup } from './Entities/Pickup';
import { EntityManager } from './EntityManager';

export class Scene {
    entManager: EntityManager;

    lastUpdate: number = Date.now();
    idGenerator = 0;

    constructor(){
        this.entManager = new EntityManager();
    }

    update(dt:number): void
    {
        if(dt <= 0.100) //if the delta time between frames is too large, dont even update (to avoid some calculation issues if fps is spiking)
        {
            for (const entity of this.entManager.entities)
            {
                entity.update(dt);
            }
        }
    }
}
