import { IUniform } from 'three';

export const NormalizeColorShader: {
    uniforms: {
        tDiffuse: IUniform;
    };
    vertexShader: string;
    fragmentShader: string;
};
