import { Skeleton, Material, Shader, WebGLRenderer } from "three";
import { Device } from "../Main";

let _onBeforeCompile = (shader: Shader, renderer: WebGLRenderer, skeleton: Skeleton, clipSize) => {
    let skinning_pars_vertex = `

        attribute vec2 instanceFrameData; // currentStep

        int bonesCount = ${skeleton.bones.length};

        int clipSize = ${clipSize};

        #ifdef USE_SKINNING
        
            uniform mat4 bindMatrix;
            uniform mat4 bindMatrixInverse;
        
            // #ifdef BONE_TEXTURE
        
                uniform ${Device.isMobile() ? "mediump" : "highp"} sampler2D boneTexture;
                
                // uniform int boneTextureSize;
        
                // Get skinning for bone 'i' at frame 'step'
                mat4 getStepBoneMatrix( const in float i, const in int clipIndex, const in int step ) {
                    // int boneTextureSize = textureSize( boneTexture, 0 ).x;

                    // // 4 pixels for 1 matrix
                    // float j = float(step) * float(bonesCount) * 4.0 + i * 4.0;
                    // float x = mod( j, float( boneTextureSize ) );
                    // float y = floor( j / float( boneTextureSize ) );
        
                    // float dx = 1.0 / float( boneTextureSize );
                    // float dy = 1.0 / float( boneTextureSize );
        
                    // y = dy * ( y + 0.5 );
        
                    // vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
                    // vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
                    // vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
                    // vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
        
                    // mat4 bone = mat4( v1, v2, v3, v4 );
                    // return bone;

int size = textureSize(boneTexture, 0).x;
// int j = int(i) * 4;
// int x = j % size;
// int y = j / size;


// int j = step * bonesCount * 4 + int(i) * 4;
int j = clipSize * clipIndex * 4 +  step * bonesCount * 4 + int(i) * 4;
int x = j % size;
int y = j / size;

vec4 v1 = texelFetch(boneTexture, ivec2(x, y), 0);
vec4 v2 = texelFetch(boneTexture, ivec2(x + 1, y), 0);
vec4 v3 = texelFetch(boneTexture, ivec2(x + 2, y), 0);
vec4 v4 = texelFetch(boneTexture, ivec2(x + 3, y), 0);
	return mat4(v1, v2, v3, v4);
                }


                mat4 getBoneMatrix( const in float i ) {
                    mat4 bone0 = getStepBoneMatrix(i, int(instanceFrameData.x), int(instanceFrameData.y));
                    // mat4 bone0 = getStepBoneMatrix(i, 0, 10);
                    // TODO restore
                    // mat4 bone0 = getStepBoneMatrix(i, int(0));
                    return bone0;
                }


        
            // #else
            //     uniform mat4 boneMatrices[ MAX_BONES ];
            //     mat4 getBoneMatrix( const in float i ) {
            //         mat4 bone = boneMatrices[ int(i) ];
            //         return bone;
            //     }
            // #endif
        
        #endif
        `;


    shader.vertexShader = shader.vertexShader.replace('#include <skinning_pars_vertex>', skinning_pars_vertex);
}

export let patchShader = (material, skeleton: Skeleton, clipSize) => {
    material.onBeforeCompile = (s, r) => _onBeforeCompile(s, r, skeleton, clipSize);
}