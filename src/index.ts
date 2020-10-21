import { test } from './func';
console.log(test(4, 4) + 10);

window.addEventListener('load', () => {
    const canvas =  document.querySelector('canvas');
    const gl = canvas?.getContext('webgl2');
    console.log(gl);
});

