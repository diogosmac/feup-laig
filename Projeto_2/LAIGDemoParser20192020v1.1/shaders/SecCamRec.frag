#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
    // vec2 center = vec2(0.5, 0.5);
    // float distFromCenter = distance(vTextureCoord, center);

    // vec4 color = texture2D(uSampler, vTextureCoord);

    // gl_FragColor = vec4(color.rgb * vTextureCoord.x, 1.0);

    gl_FragColor = texture2D(uSampler, vTextureCoord);
}