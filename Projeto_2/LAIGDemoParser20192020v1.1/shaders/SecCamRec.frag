#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float timeFactor;

void main() {
    vec2 center = vec2(0.5, 0.5);
    float distFromCenter = distance(vTextureCoord, center);

    vec4 color = texture2D(uSampler, vTextureCoord);

    if(mod(vTextureCoord.y * 40.0 - timeFactor / 5.0, 2.0) > 1.0)
        color = vec4(color.rgb + 0.3, 1.0);

    float radius = 0.5 * sqrt(2.0);
    float f = -pow((distFromCenter - (radius / 2.0)), 2.0) + pow((radius / 2.0), 2.0);
    float g = (f * 1.6) + distFromCenter;
    float distFactor = g * (1.0 / radius);

    gl_FragColor = vec4(color.rgb * (1.0 - distFactor), 1.0);
}