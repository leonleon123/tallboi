import { Entity } from './Entity';
import { Scene } from './Scene';

export class Renderer{

    constructor(
        private gl: WebGL2RenderingContext
    ) { }

    public renderScene(scene: Scene): void{
        for (const entity of scene.entManager.entities){
            this.renderEntity(entity);
        }
    }

    public renderEntity(entity: Entity): void{

    }
}
