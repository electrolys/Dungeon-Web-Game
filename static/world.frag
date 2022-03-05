
varying lowp vec2 UV;
uniform sampler2D tex;
uniform int spnum;
void main(){
    gl_FragColor = texture2D(tex, vec2(UV.x,UV.y/float(spnum)));
    // gl_FragColor = vec4(0.0,1.0,0.0,1.0);
}
