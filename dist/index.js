"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const gl_matrix_1 = require("gl-matrix");
const webgl_obj_loader_1 = require("webgl-obj-loader");
const shaders_1 = require("./shaders");
let vertexBuffer;
let vertexShader;
let fragmentShader;
let program;
let uModelViewProjection;
let gl;
window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
    const canvas = document.querySelector('canvas');
    gl = canvas === null || canvas === void 0 ? void 0 : canvas.getContext('webgl2');
    if (!gl) {
        return;
    }
    const vertices = yield getVertices();
    console.log(vertices);
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, shaders_1.vertex);
    gl.compileShader(vertexShader);
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, shaders_1.fragment);
    gl.compileShader(fragmentShader);
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    uModelViewProjection = gl.getUniformLocation(program, 'uModelViewProjection');
    render();
}));
let x = 0;
function render() {
    gl.useProgram(program);
    const M = gl_matrix_1.mat4.create();
    gl_matrix_1.mat4.scale(M, M, gl_matrix_1.vec3.fromValues(0.01, 0.01, 0.01));
    gl_matrix_1.mat4.rotateX(M, M, Math.sin(x) * Math.PI * 2);
    gl_matrix_1.mat4.rotateY(M, M, Math.sin(x) * Math.PI * 2);
    gl_matrix_1.mat4.translate(M, M, gl_matrix_1.vec3.fromValues(-30, -30, -20));
    gl.uniformMatrix4fv(uModelViewProjection, false, M);
    x += 0.01;
    // gl.uniformMatrix4fv()
    const activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    const attributes = {};
    for (let i = 0; i < activeAttributes; i++) {
        const info = gl.getActiveAttrib(program, i);
        attributes[info.name] = gl.getAttribLocation(program, info.name);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(attributes.aPosition);
    gl.vertexAttribPointer(attributes.aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_LOOP, 0, 6);
    requestAnimationFrame(render);
}
function getVertices() {
    return __awaiter(this, void 0, void 0, function* () {
        const req = yield fetch('assets/diamond.obj');
        const text = yield req.text();
        const mesh = new webgl_obj_loader_1.Mesh(text);
        return new Promise((resolve, reject) => resolve(new Float32Array(mesh.vertices)));
    });
}
//# sourceMappingURL=index.js.map