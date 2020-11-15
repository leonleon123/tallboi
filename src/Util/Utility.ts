import { Mesh } from 'webgl-obj-loader';

export function degToRad(degrees: number): number {
    const pi = Math.PI;
    return degrees * (pi / 180);
}

export async function loadAsset(file: string): Promise<Mesh> {
    const req = await fetch(`assets/${file}`);
    const text = await req.text();
    const mesh = new Mesh(text);
    return new Promise((resolve, reject) => resolve(mesh));
}
