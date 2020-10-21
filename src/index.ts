function test(a: number, b: number): number{
    return (a + b);
}

console.log(test(4, 4) + 10);

const canvas =  document.querySelector('canvas');
const gl = canvas?.getContext('webgl2');

