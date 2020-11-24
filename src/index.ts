import Application from './Application';

let app: Application;

window.addEventListener('load', async () => {
    document.getElementById('start')?.addEventListener('click', () => {
        document.getElementById('splash')!.style.visibility = 'hidden';
        start();
    });
    document.getElementById('stage')?.addEventListener('click', () => {
        document.getElementById('splash')!.style.visibility = 'hidden';
        start('level_menu');
    });
});

function start(levelNameOverride?: string): void{
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    const textCanvas = document.querySelector('#text') as HTMLCanvasElement;
    if (canvas && textCanvas){
        app = new Application(canvas, textCanvas, levelNameOverride);
    }else{
        throw new Error('No canvas element found');
    }
}
