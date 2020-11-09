import Application from './Application';

let app: Application;

window.addEventListener('load', async () => {
    const canvas =  document.querySelector('canvas');
    if (canvas){
        app = new Application(canvas);
    }else{
        throw new Error('No canvas element found');
    }
});
