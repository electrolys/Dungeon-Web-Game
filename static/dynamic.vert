
attribute vec4 i;

varying lowp vec2 UV;
uniform lowp vec2 off;
uniform lowp vec2 scl;

uniform lowp vec2 lscl;
uniform lowp vec2 uvoff;
uniform lowp float angle;

void main(){

    UV = i.zw+uvoff;

    float cf = cos(angle);
    float sf = sin(angle);
    gl_Position = vec4((( (i.xy*mat2(cf, sf, -sf, cf)) *lscl)+off)*scl,0.0,0.9);
}
