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

    constructor(
        private size: Size
    ) {
        this.userInput = new UserInput();
        this.entManager = new EntityManager(this.userInput);
        this.camera = new Camera(this.size);
        this.light = new Light(
            [0, 15, 0], // position
            0.5, // ambient
            0.2, // diffuse
            0, // specular
            10, // shininess
            [1, 1, 1], // color
            [0.6, 0, 0.02] // attenuation
        );
    }

    public async loadAssets(): Promise<void> {
        this.entManager.createPlayerAt(
            [0, 1, 0],
            await loadAsset('player.obj'),
            await loadCollisionBodies('player.obj', BodyType.PLAYER, BodyType.WALL)
        );

        const pickupMesh = await loadAsset('cube.obj');

        this.entManager.addPickups(await loadCollisionBodies('pickups.obj', 0, 0), pickupMesh);

        this.entManager.createLevel(
            await loadAsset('map3.obj'),
            await loadCollisionBodies('map3.obj', BodyType.WALL, BodyType.PLAYER)
        );
    }

    public update(): void {
        // if the delta time between frames is too large, dont even update
        // (to avoid some calculation issues if fps is spiking)
        const now = Date.now();
        const dt = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        this.preUpdate();
        if (dt <= 0.100) {
            for (const entity of this.entManager.entities) {
                if (entity.active){
                    entity.update(dt);
                }
            }
            this.light.update(this.entManager.player);
            this.camera.update(dt, this.entManager.player, this.userInput);
            this.entManager.world.step(1 / 150, dt); // this makes the movement work the same on any device
        }
    }

    private preUpdate(): void {
        if (this.userInput.onPress('KeyR')){
            this.entManager.player.reset();
            this.entManager.enablePersistant();
        }
    }


}
