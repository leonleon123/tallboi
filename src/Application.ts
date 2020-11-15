import { Renderer } from './Render/Renderer';
import { Scene } from './Scene/Scene';
import { Size } from './Util/Interfaces';

export default class Application {

    private gl: WebGL2RenderingContext;
    private renderer: Renderer;
    private scene: Scene;
    private size: Size = { width: 800, height: 800 };

    constructor(
        private canvas: HTMLCanvasElement
    ) {
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;

        this.gl = this.canvas.getContext('webgl2')!;
        if (!this.gl) {
            throw new Error('Cannot create WebGL 2.0 context');
        }
        this.scene = new Scene(this.size);
        this.renderer = new Renderer(this.gl);
        this.scene.loadAssets().then(this.init);
    }

    public init = (): void => {
        this.renderer.initScene(this.scene);
        requestAnimationFrame(this.update);
    }

    public update = (): void => {
        this.scene.update();
        this.render();
        requestAnimationFrame(this.update);
    }

    public render(): void {
        this.renderer.renderScene(this.scene);
    }
}



