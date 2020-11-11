import { Mesh } from 'webgl-obj-loader';
import { Camera } from './Camera';
import { Player } from './Entities/Player';
import { EntityManager } from './EntityManager';
import { UserInput } from './UserInput';

export class Scene {

    public entManager: EntityManager;
    public camera: Camera;
    public lastUpdate: number = Date.now();
    public idGenerator = 0;
    //add map instance here (also create the class)

    constructor() {
        this.entManager = new EntityManager();
        this.camera = new Camera();
    }

    public async loadAssets(): Promise<void> {
        
        const player_mesh = await this.loadAsset('cube.obj');
        const pickup_mesh = player_mesh;
        this.entManager.createPlayerAt([0,0,0],player_mesh);
        this.entManager.addPickup([0,0,2],pickup_mesh);
        this.entManager.addPickup([2,0,0],pickup_mesh);
        this.entManager.addPickup([2,0,2],pickup_mesh);
        this.entManager.addPickup([0,0,0],pickup_mesh);
    }

    public update(input: UserInput): void {
        // if the delta time between frames is too large, dont even update
        // (to avoid some calculation issues if fps is spiking)
        const now = Date.now();
        const dt = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        if (dt <= 0.100) {
            for (const entity of this.entManager.entities) {
                if (entity.active){
                    entity.update(dt,input);
                }
            }
            this.camera.update(dt,<Player>this.entManager.entities[0],input); //UGLY HACK, change asap; need a good way to reliably get the Player entity
        }
    }

    private async loadAsset(file: string): Promise<Mesh> {
        const req = await fetch(`assets/${file}`);
        const text = await req.text();
        const mesh = new Mesh(text);
        return new Promise((resolve, reject) => resolve(mesh));
    }
}
