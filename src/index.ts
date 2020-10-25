import { mat4, vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { fragment, vertex } from './shaders';

let vertexBuffer: WebGLBuffer;
let indexBuffer: WebGLBuffer;
let vertexShader: WebGLShader;
let fragmentShader: WebGLShader;
let program: WebGLProgram;
let uModelViewProjection: WebGLUniformLocation;

let vertices: Float32Array;
let indices: Uint16Array;

let gl: WebGL2RenderingContext;


window.addEventListener('load', async () => {
    const canvas =  document.querySelector('canvas');
    gl = canvas?.getContext('webgl2') as WebGL2RenderingContext;
    if (!gl) { return; }

    const mesh = await getMesh();
    vertices = new Float32Array(mesh.vertices);
    indices = new Uint16Array(mesh.indices);
    console.log(indices);

    indexBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    vertexBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    gl.shaderSource(vertexShader, vertex);
    gl.compileShader(vertexShader);

    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    gl.shaderSource(fragmentShader, fragment);
    gl.compileShader(fragmentShader);

    program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    uModelViewProjection = gl.getUniformLocation(program, 'uModelViewProjection') as WebGLUniformLocation;
    render();
});
let x = 0;
function render(): void {
    gl.useProgram(program);

    const M: mat4 = mat4.create();
    mat4.scale(M, M, vec3.fromValues(0.01, 0.01, 0.01));
    mat4.rotateX(M, M, Math.sin(x) * Math.PI * 2);
    mat4.rotateY(M, M, Math.sin(x) * Math.PI * 2);
    mat4.translate(M, M, vec3.fromValues(-30, -30, -20));
    gl.uniformMatrix4fv(uModelViewProjection, false, M);
    x += 0.01;
    // gl.uniformMatrix4fv()

    const activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    const attributes: {[key: string]: number} = {};
    for (let i = 0; i < activeAttributes; i++){
        const info = gl.getActiveAttrib(program, i) as WebGLActiveInfo;
        attributes[info.name] = gl.getAttribLocation(program, info.name);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(attributes.aPosition);
    gl.vertexAttribPointer(attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.drawElements(gl.LINE_LOOP, 27, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
}

async function getMesh(): Promise<Mesh>{
    const req = await fetch('assets/diamond.obj');
    const text = await req.text();
    const mesh = new Mesh(text);
    return new Promise((resolve, reject) => resolve(mesh));
}
