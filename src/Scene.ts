import { Camera } from './Camera';
import { EntityManager } from './EntityManager';
import { Size } from './Interfaces';
import { UserInput } from './UserInput';
import { loadAsset } from './Utility';


export class Scene {

    public entManager: EntityManager;
    public camera: Camera;

    private lastUpdate: number = Date.now();
    private userInput: UserInput;
    // add map instance here (also create the class)

    constructor(
        private size: Size
    ) {
        this.userInput = new UserInput();
        this.entManager = new EntityManager(this.userInput);
        this.camera = new Camera(this.size);
    }

    public async loadAssets(): Promise<void> {
        const playerMesh = await loadAsset('cube.obj');
        const pickupMesh = playerMesh;

        this.entManager.createPlayerAt([0, 0, 0], playerMesh);
        this.entManager.addPickup([0, 0, 2], pickupMesh);
        this.entManager.addPickup([2, 0, 0], pickupMesh);
        this.entManager.addPickup([2, 0, 2], pickupMesh);
        this.entManager.addPickup([0, 0, 0], pickupMesh);

        this.entManager.createLevel(await loadAsset('map.obj'));
    }

    public update(): void {
        // if the delta time between frames is too large, dont even update
        // (to avoid some calculation issues if fps is spiking)
        const now = Date.now();
        const dt = (now - this.lastUpdate) / 1000;
        if (dt <= 0.100) {
            for (const entity of this.entManager.entities) {
                if (entity.active){
                    entity.update(dt);
                }
            }
            this.camera.update(dt, this.entManager.player, this.userInput);
            this.lastUpdate = now;
        }
    }


}
