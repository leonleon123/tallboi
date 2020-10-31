import { mat4, vec3 } from 'gl-matrix';
import { Mesh } from 'webgl-obj-loader';
import { fragment, vertex } from './shaders';

let vertexBuffer: WebGLBuffer;
let indexBuffer: WebGLBuffer;
let vertexShader: WebGLShader;
let fragmentShader: WebGLShader;
let program: WebGLProgram;
let uMVPLocation: WebGLUniformLocation;

let vertices: Float32Array;
let indices: Uint16Array;

let gl: WebGL2RenderingContext;

let x = 0;
const bgColor: number[] = [240 / 256, 198 / 256, 120 / 256, 1];
const pos: vec3 = vec3.create();
const keyPressX: {[key: string]: number} = {a: -0.1, d: 0.1};
const keyPressZ: {[key: string]: number} = {w: -0.1, s: 0.1};

window.addEventListener('load', async () => {
    document.addEventListener('keypress', (event: KeyboardEvent) => {
        pos[0] += keyPressX[event.key] || 0;
        pos[2] += keyPressZ[event.key] || 0;
    });

    const canvas =  document.querySelector('canvas');
    gl = canvas?.getContext('webgl2') as WebGL2RenderingContext;
    if (!gl) { return; }

    const mesh = await getMesh('map.obj');

    vertices = new Float32Array(mesh.vertices);
    indices = new Uint16Array(mesh.indices);

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

    uMVPLocation = gl.getUniformLocation(program, 'uMVP') as WebGLUniformLocation;
    render();
});

function getMVP(): mat4{
    const M: mat4 = mat4.create();
    // mat4.translate(M , M, pos);
    // mat4.rotateX(M, M, Math.sin(x) * Math.PI);
    // mat4.rotateY(M, M, Math.sin(x) * Math.PI / 2);
    mat4.rotateY(M, M, Math.sin(x));
    mat4.scale(M, M, vec3.fromValues(0.3, 0.3, 0.3));

    const P: mat4 = mat4.create();
    mat4.perspective(P, Math.PI / 3, 1, 0.1, 100);
    mat4.rotateX(P, P, Math.PI / 12);
    mat4.translate(P, P, vec3.fromValues(0, -3, -6));

    const MVP: mat4 = mat4.create();
    mat4.mul(MVP, M, MVP);
    mat4.mul(MVP, P, MVP);

    x += 0.02;

    return MVP;
}

function render(): void {
    gl.clearColor(bgColor[0], bgColor[1], bgColor[2], bgColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniformMatrix4fv(uMVPLocation, false, getMVP());

    const activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    const attributes: {[key: string]: number} = {};
    for (let i = 0; i < activeAttributes; i++){
        const info = gl.getActiveAttrib(program, i) as WebGLActiveInfo;
        attributes[info.name] = gl.getAttribLocation(program, info.name);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(attributes.aPosition);
    gl.vertexAttribPointer(attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
}

async function getMesh(file: string): Promise<Mesh>{
    const req = await fetch(`assets/${file}`);
    const text = await req.text();
    const mesh = new Mesh(text);
    return new Promise((resolve, reject) => resolve(mesh));
}
