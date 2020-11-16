import { BodyType } from '../Util/Enums';
import { Size } from '../Util/Interfaces';
import { loadAsset, loadCollisionBodies } from '../Util/Utility';
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
            [0, 15, 0], // position
            1.0, // ambient
            0.7, // diffuse
            1.0, // specular
            20, // shininess
            [1, 1, 1], // color
            [1, 0, 0.02] // attenuation
        );
    }

    public async loadAssets(): Promise<void> {
        this.entManager.createPlayerAt(
            [0, 0, 0],
            await loadAsset('player.obj'),
            await loadCollisionBodies('player.obj', BodyType.PLAYER, BodyType.WALL)
        );

        const pickupMesh = await loadAsset('cube.obj');

        this.entManager.addPickup([0, 2, 2], pickupMesh);
        this.entManager.addPickup([2, 2, 0], pickupMesh);
        this.entManager.addPickup([2, 2, 2], pickupMesh);
        this.entManager.addPickup([-2, 2, -4], pickupMesh);

        this.entManager.createLevel(
            await loadAsset('map2.obj'),
            await loadCollisionBodies('map2.obj', BodyType.WALL, BodyType.PLAYER)
        );
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
            this.entManager.world.step(1 / 150, dt); // this makes the movement work the same on any device
        }
    }


}
