import { Size } from '../Util/Interfaces';
import { loadAsset } from '../Util/Utility';
import { Camera } from './Camera';
import { EntityManager } from './EntityManager';
import { Light } from './Light';
import { UserInput } from './UserInput';


export class Scene {

    public entManager: EntityManager;
    public camera: Camera;
    public light: Light;

    private lastUpdate: number = Date.now();
    private userInput: UserInput;
    // add map instance here (also create the class)

    constructor(
        private size: Size
    ) {
        this.userInput = new UserInput();
        this.entManager = new EntityManager(this.userInput);
        this.camera = new Camera(this.size);
        this.light = new Light(
            [0, 10, 0],
            0.9,
            0.2,
            1.0,
            20,
            [1, 1, 1],
            [1, 0, 0.02]
        );
    }

    public async loadAssets(): Promise<void> {
        const playerMesh = await loadAsset('player.obj');
        const pickupMesh = await loadAsset('cube.obj');

        this.entManager.createPlayerAt([0, 0, 0], playerMesh);
        this.entManager.addPickup([0, 2, 2], pickupMesh);
        this.entManager.addPickup([2, 2, 0], pickupMesh);
        this.entManager.addPickup([2, 2, 2], pickupMesh);
        this.entManager.addPickup([0, 2, 0], pickupMesh);

        this.entManager.createLevel(await loadAsset('map2.obj'));
    }

    public update(): void {
        // if the delta time between frames is too large, dont even update
        // (to avoid some calculation issues if fps is spiking)
        const now = Date.now();
        const dt = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        if (dt <= 0.100) {
            for (const entity of this.entManager.entities) {
                if (entity.active){
                    entity.update(dt);
                }
            }
            this.camera.update(dt, this.entManager.player, this.userInput);
        }
    }


}
