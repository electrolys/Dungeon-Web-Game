
attribute vec4 i;

varying lowp vec2 UV;
uniform lowp vec2 off;
uniform lowp vec2 scl;

void main(){
    UV = i.zw;

    gl_Position = vec4((i.xy+off)*scl,0.0,0.9);
}
