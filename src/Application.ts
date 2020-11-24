import { Renderer } from './Render/Renderer';
import { Scene } from './Scene/Scene';
import { Size } from './Util/Interfaces';

export default class Application {

    private gl: WebGL2RenderingContext;
    private text: CanvasRenderingContext2D;
    private renderer: Renderer;
    private scene: Scene;
    private size: Size = { width: window.innerWidth, height: window.innerHeight };

    constructor(
        private canvas: HTMLCanvasElement, private textCanvas: HTMLCanvasElement, levelNameOverride?: string
    ) {
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        this.textCanvas.width = this.size.width;
        this.textCanvas.height = this.size.height;

        this.gl = this.canvas.getContext('webgl2')!;
        this.text = this.textCanvas.getContext('2d')!;
        if (!this.gl) {
            throw new Error('Cannot create WebGL 2.0 context');
        }
        if (!this.text) {
            throw new Error('Cannot create 2D context');
        }
        this.scene = new Scene(this.size);
        this.renderer = new Renderer(this.gl, this.text, this.size);
        this.scene.buildLevel(levelNameOverride || this.scene.levelOrder[this.scene.currentLevel]).then(this.init);
    }

    public init = (): void => {
        this.renderer.initScene(this.scene);
        const audio = new Audio('assets/sounds/soundtrack_1.mp3');
        audio.loop = true;
        audio.volume = 0.1;
        audio.play();
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



