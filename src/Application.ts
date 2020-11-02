import { Renderer } from './Renderer';
import { Scene } from './Scene';

export default class Application {

    private gl: WebGL2RenderingContext;
    private renderer: Renderer;
    private scene: Scene;

    constructor(private canvas: HTMLCanvasElement) {
        this.gl = this.canvas.getContext('webgl2')!;
        if (!this.gl) {
            throw new Error('Cannot create WebGL 2.0 context');
        }

        this.scene = new Scene();
        this.renderer = new Renderer(this.gl);

        this.start();
    }

    start(): void {
        requestAnimationFrame(this.update);
    }

    update = (): void => {
        this.scene.update();
        this.render();
        requestAnimationFrame(this.update);
    }

    render(): void {
        this.renderer.renderScene(this.scene);
    }
}
