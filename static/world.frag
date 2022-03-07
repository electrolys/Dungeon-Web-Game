
varying lowp vec2 UV;
uniform sampler2D tex;
uniform ivec2 spnum;
void main(){
    gl_FragColor = texture2D(tex, vec2(UV.x/float(spnum.x),UV.y/float(spnum.y)));
    // gl_FragColor = vec4(0.0,1.0,0.0,1.0);
}
