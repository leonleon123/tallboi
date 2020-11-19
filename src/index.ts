import Application from './Application';

let app: Application;

window.addEventListener('load', async () => {
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    const textCanvas = document.querySelector('#text') as HTMLCanvasElement;
    if (canvas && textCanvas){
        app = new Application(canvas, textCanvas);
    }else{
        throw new Error('No canvas element found');
    }
});
