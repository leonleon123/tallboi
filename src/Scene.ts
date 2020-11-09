import { Mesh } from 'webgl-obj-loader';
import { EntityManager } from './EntityManager';

export class Scene {

    public entManager: EntityManager;
    public lastUpdate: number = Date.now();
    public idGenerator = 0;

    constructor() {
        this.entManager = new EntityManager();
    }

    public async loadAssets(): Promise<void> {
        const mesh = await this.loadAsset('map.obj');
        this.entManager.createMap(mesh);
    }

    public update(): void {
        // if the delta time between frames is too large, dont even update
        // (to avoid some calculation issues if fps is spiking)
        const now = Date.now();
        const dt = now - this.lastUpdate;
        this.lastUpdate = now;
        if (dt <= 0.100) {
            for (const entity of this.entManager.entities) {
                if (entity.active){
                    entity.update(dt);
                }
            }
        }
    }

    private async loadAsset(file: string): Promise<Mesh> {
        const req = await fetch(`assets/${file}`);
        const text = await req.text();
        const mesh = new Mesh(text);
        return new Promise((resolve, reject) => resolve(mesh));
    }
}
