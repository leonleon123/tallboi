import { World } from 'cannon';
import { BodyType } from '../Util/Enums';
import { Size } from '../Util/Interfaces';
import { loadAsset, loadCollisionBodies, loadLevelData } from '../Util/Utility';
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

    public levelOrder = ['level4', 'level3'];
    public currentLevel = 0;

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

    public async loadLevel(levelName: string): Promise<void> {
        console.log('Loading level ' + levelName);
        if (this.entManager.level !== undefined)
        {
            this.entManager.level.ready = false;
        }
        this.entManager.entities = [];
        this.entManager.world = new World();
        this.entManager.world.gravity.set(0, 0, 0);
        const data = await loadLevelData(levelName);
        this.entManager.createPlayerAt(
            data.spawn,
            data.spawnYaw,
            await loadAsset('player'),
            await loadCollisionBodies('player', BodyType.PLAYER, BodyType.WALL)
        );

        this.entManager.addPickups(
            await loadAsset('cube'),
            await loadCollisionBodies('levels/' + levelName + '_pickups', BodyType.NONE, BodyType.NONE)
        );

        for (const origin of data.exitOrigins){
            this.entManager.createExitAt(await loadAsset('exit'), origin, data.exitSize);
        }

        this.entManager.createLevel(
            await loadAsset('levels/' + levelName),
            await loadCollisionBodies('levels/' + levelName + '_col', BodyType.WALL, BodyType.PLAYER)
        );
        this.camera.pitch = this.camera.defaultPitch;
    }

    public loadNextLevel(): void{
        this.currentLevel++;
        if (this.currentLevel >= this.levelOrder.length)
        {
            this.currentLevel = 0;
        }
        this.loadLevel(this.levelOrder[this.currentLevel]);
    }

    public update(): void {
        // if the delta time between frames is too large, dont even update
        // (to avoid some calculation issues if fps is spiking)
        const now = Date.now();
        const dt = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;
        this.preUpdate();
        if (dt <= 0.100 && this.entManager.level.ready) {
            for (const entity of this.entManager.entities) {
                if (entity.active){
                    entity.update(dt);
                }
            }
            this.light.update(this.entManager.player);
            this.camera.update(dt, this.entManager.player, this.userInput);
            if (dt > 0.017){
                this.entManager.world.step(1 / 60, dt);
            }
            else{
                this.entManager.world.step(dt);
            }
        }
    }

    private preUpdate(): void {
        if (!this.entManager.level.ready && this.entManager.level.check) {
            const len = this.entManager.level.mesh?.materialNames.length!;
            // console.log(len);
            if (len > 0 && len === this.entManager.level.materialRenderInfos.length) {
                let loaded = true;
                for (const it of this.entManager.level.materialRenderInfos) {
                    if (it.textureLoaded === false) {
                        loaded = false;
                    }
                }
                if (loaded) {
                    this.entManager.level.ready = true;
                    this.entManager.level.check = false;
                    // console.log('ready');
                }
            }
        }

        if (this.entManager.player.exited){
            this.loadNextLevel();
            this.entManager.player.exited = false;
        }

        if (this.userInput.onPress('KeyR')){
            this.entManager.player.reset();
            this.camera.pitch = this.camera.defaultPitch;
            this.entManager.enablePersistant();
        }
        if (this.userInput.onPress('KeyP')){
            this.loadNextLevel();
        }
    }


}
