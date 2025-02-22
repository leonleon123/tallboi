import { World } from 'cannon';
import { BodyType } from '../Util/Enums';
import { LevelData, Size } from '../Util/Interfaces';
import { loadAsset, loadAssets, loadCollisionBodies, loadLevelData } from '../Util/Utility';
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

    public levelOrder = ['level_tutorial', 'level1', 'level2'];
    private pickupMeshNames = ['orange', 'watermelon', 'avocado', 'cherry', 'pineapple'];
    public currentLevel = 0;
    public currentLevelData: LevelData;
    public levelStartTime: number;
    public levelTime = 0;
    public showEndScreen = false;

    constructor(
        private size: Size
    ) {
        this.userInput = new UserInput();
        this.entManager = new EntityManager(this.userInput);
        this.camera = new Camera(this.size);
        this.light = new Light(
            [0, 0, 0], // position
            0.8, // ambient
            0.1, // diffuse
            0.8, // specular
            10, // shininess
            [1, 1, 1], // color
            [0.4, 0, 0.02] // attenuation
        );
    }

    public async buildLevel(levelName: string): Promise<void> {
        console.log('Building level ' + levelName);
        if (this.entManager.level !== undefined)
        {
            this.entManager.level.ready = false;
        }
        this.entManager.entities = [];
        this.entManager.world = new World();
        this.entManager.world.gravity.set(0, 0, 0);
        this.currentLevelData = await loadLevelData(levelName);
        this.entManager.createPlayerAt(
            this.currentLevelData.spawn,
            this.currentLevelData.spawnYaw,
            await loadAsset('player/player'),
            [await loadAsset('player/l_arm'), await loadAsset('player/r_arm')],
            [await loadAsset('player/l_leg'), await loadAsset('player/r_leg')],
            await loadCollisionBodies('player/player_col', BodyType.PLAYER, BodyType.WALL)
        );
        this.entManager.addPickups(
            await loadAssets(this.pickupMeshNames.map(name => 'pickups/' + name)),
            await loadCollisionBodies('levels/' + levelName + '_pickups', BodyType.NONE, BodyType.NONE)
        );

        for (const origin of this.currentLevelData.exitOrigins){
            this.entManager.createExit(await loadAsset('other/exit'), origin, this.currentLevelData.exitSize);
        }

        for (const warp of this.currentLevelData.warps){
            this.entManager.createWarp(await loadAsset('other/exit'), warp.origin, warp.to);
        }

        this.entManager.createLevel(
            await loadAsset('levels/' + levelName),
            await loadCollisionBodies('levels/' + levelName + '_col', BodyType.WALL, BodyType.PLAYER)
        );
        this.camera.pitch = this.camera.defaultPitch;
    }

    public loadNextLevel(): void{
        new Audio('assets/sounds/level_end.mp3').play();
        this.currentLevel++;
        if (this.currentLevel >= this.levelOrder.length){
            this.currentLevel = 0;
            this.buildLevel('level_menu');
            this.showEndScreen = true;
        }
        else{
            this.buildLevel(this.levelOrder[this.currentLevel]);
        }
    }

    public loadLevel(name: string): void{
        for (let i = 0; i < this.levelOrder.length; i++){
            // tslint:disable-next-line: triple-equals
            if (this.levelOrder[i].trim() == name.trim()){
                this.currentLevel = i;
            }
        }
        this.buildLevel(name);
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

    private loadingCheck(): void {
        if (!this.entManager.level.ready && this.entManager.level.check) {
            const len = this.entManager.level.mesh?.materialNames.length!;
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
                    this.levelStartTime = Date.now();
                    this.showEndScreen = false;
                }
            }
        }

    }

    private levelTransitionCheck(): void {
        if (this.entManager.player.exited){
            this.levelTime = ((Date.now() - this.levelStartTime) / 1000);
            this.loadNextLevel();
            this.entManager.player.exited = false;
        }

        if (this.entManager.player.warpTo !== ''){
            this.levelTime = 0;
            this.loadLevel(this.entManager.player.warpTo);
            this.entManager.player.warpTo = '';
        }
    }

    private generalInput(): void {
        if (this.userInput.onPress('KeyR')){
            this.entManager.player.reset();
            this.camera.pitch = this.camera.defaultPitch;
            this.entManager.enablePersistant();
            this.levelStartTime = Date.now();
        }
        if (this.userInput.onPress('KeyP') && this.userInput.devMode){
            this.loadNextLevel();
        }
        if (this.userInput.onPress('KeyL') && this.userInput.devMode){
            this.entManager.player.warpTo = 'level_menu';
        }
        if (this.userInput.onPress('KeyM') && this.userInput.devMode){
            this.entManager.player.exited = true;
        }
    }

    private preUpdate(): void {
        this.loadingCheck();
        this.levelTransitionCheck();
        this.generalInput();
    }


}
