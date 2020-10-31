export function createShader(gl: WebGL2RenderingContext, source: string, type: number): WebGLShader {
    const shader = gl.createShader(type) as WebGLShader;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!status) {
        const log = gl.getShaderInfoLog(shader);
        throw new Error('Cannot compile shader\nInfo log:\n' + log);
    }
    return shader;
}

type Attributes = {[key: string]: number};
type Uniforms =  {[key: string]: WebGLUniformLocation};

interface Program{
    program: WebGLProgram;
    attributes: Attributes;
    uniforms: Uniforms;
}

export function createProgram(gl: WebGL2RenderingContext, shaders: WebGLShader[]): Program {
    const program = gl.createProgram() as WebGLProgram;
    for (const shader of shaders) {
        gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    const status = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!status) {
        const log = gl.getProgramInfoLog(program);
        throw new Error('Cannot link program\nInfo log:\n' + log);
    }

    const attributes = {} as Attributes;
    const activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < activeAttributes; i++) {
        const info = gl.getActiveAttrib(program, i) as WebGLActiveInfo;
        attributes[info.name] = gl.getAttribLocation(program, info.name);
    }

    const uniforms = {} as Uniforms;
    const activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < activeUniforms; i++) {
        const info = gl.getActiveUniform(program, i) as WebGLActiveInfo;
        uniforms[info.name] = gl.getUniformLocation(program, info.name) as WebGLUniformLocation;
    }

    return { program, attributes, uniforms } as Program;
}

interface Shader{
    vertex: string;
    fragment: string;
}

type Shaders = {[key: string]: Shader};
type Programs = {[key: string]: Program};

export function buildPrograms(gl: WebGL2RenderingContext, shaders: Shaders ): Programs {
    const programs = {} as Programs;
    // tslint:disable-next-line: forin
    for (const name in shaders) {
        try {
            const program = shaders[name];
            programs[name] = createProgram(gl, [
                createShader(gl, program.vertex, gl.VERTEX_SHADER),
                createShader(gl, program.fragment, gl.FRAGMENT_SHADER)
            ]);
        } catch (err) {
            throw new Error('Error compiling ' + name + '\n' + err);
        }
    }
    return programs;
}
