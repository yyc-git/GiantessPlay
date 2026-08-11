const NormalizeColorShader = {

    name: 'NormalizeColorShader',

    uniforms: {

        'tDiffuse': { value: null },

    },

    vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

    fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 tex = texture2D( tDiffuse, vUv );

            // float length = tex.r+tex.g+tex.b;
			// tex.rgb /= length;
//             float factor = 1.0;
//             if(tex.b > 1.0){
// factor = 0.5;
//             }
			// tex.rgb *= factor;

//             float factor = 0.0;
//             if(tex.b > 1.0){
// factor = tex.b - 1.0;
//             }
			// float factorB =max(tex.b -  1.0, 0.0);
			// tex.r =max(tex.r -  factor, 0.0);
			// tex.b =max(tex.b -  factor, 0.0);

			float factor =max(tex.r -  1.0, 0.0);
			tex.r =max(tex.r -  factor, 0.0);
			tex.g =max(tex.g -  factor, 0.0);
			tex.b =max(tex.b -  factor, 0.0);

			factor =max(tex.g -  1.0, 0.0);
			tex.r =max(tex.r -  factor, 0.0);
			tex.g =max(tex.g -  factor, 0.0);
			tex.b =max(tex.b -  factor, 0.0);

			factor =max(tex.b -  1.0, 0.0);
			tex.r =max(tex.r -  factor, 0.0);
			tex.g =max(tex.g -  factor, 0.0);
			tex.b =max(tex.b -  factor, 0.0);


			gl_FragColor = tex;
		}`

};

export { NormalizeColorShader };
