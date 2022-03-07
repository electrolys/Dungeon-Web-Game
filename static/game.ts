


declare var io:any;
var socket:any = io();


function loadtxt(filePath, mimeType){
  var xmlhttp:any=new XMLHttpRequest();
  xmlhttp.open("GET",filePath,false);
  if (mimeType != null) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();
  if (xmlhttp.status==200)
  {
    return xmlhttp.responseText;
  }
  else {
  console.log("exec");
    return null;
  }
}
function loadJSON(filePath) {
  // Load json file;
  var json = loadtxt(filePath, "application/json");
  // Parse json
  return JSON.parse(json);
}

class vec{
  x:number;
  y:number;
  constructor(x:number,y:number){
    this.x=x;
    this.y=y;
  }
  add(t:vec):vec {
    return new vec(this.x+t.x,this.y+t.y);
  }
  sub(t:vec):vec {
    return new vec(this.x-t.x,this.y-t.y);
  }
  mul(t:vec):vec {
    return new vec(this.x*t.x,this.y*t.y);
  }
  div(t:vec):vec {
    return new vec(this.x/t.x,this.y/t.y);
  }
  smul(t:number):vec {
    return new vec(this.x*t,this.y*t);
  }
  sdiv(t:number):vec {
    return new vec(this.x/t,this.y/t);
  }
  lensq():number {
    return this.x*this.x+this.y*this.y;
  }
  len():number {
    return Math.sqrt(this.lensq());
  }
  norm():vec {
    return this.sdiv(this.len());
  }
}
class sarray<T> extends Array<T>{
  constructor(length){
    super(length);
  }
}
class array2d<T>{
  sz:number;
  data:sarray<T>;
  constructor(sz){
    this.sz = sz;
    this.data = new sarray(sz*sz);

  }
  g(i,j){return this.data[i+j*this.sz];}
  s(i,j,v){this.data[i+j*this.sz]=v;}

}
class vtx{


}

var canvas:any = document.getElementById('canvas');
var gl = canvas.getContext('experimental-webgl',{preserveDrawingBuffer:false});




function loadTexture( url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  };
  image.src = url;

  return texture;
}


// var context:any = canvas.getContext('2d');

class player {
  pos:vec;
  hp:number;
  maxhp:number;
  atk:number;
  itemeff:number;
  lvl:number;

  meals:number;
  bigmeals:number;
  feasts:number;
  teas:number;
  coffees:number;
  constructor(){
    this.pos = new vec(10,980);

  }

}



var pl:player = new player();

class gamestate {


  level:array2d<number>;
  vbo:any;vao:any;vsize:number;
  shader:any;
  tex:any;
  update(){
    var data:number[] = [];
    for (let i : number = 1 ; i < 1000 ; i++)
      for (let j : number = 1 ; j < 1000 ; j++){

          let o:number = 5;
          if (this.level.g(i,j)>0)
            o=10;
          else if (this.level.g(i+1,j)>0&&this.level.g(i,j+1)>0&&this.level.g(i-1,j)>0&&this.level.g(i,j-1)>0)
            o=5;
          else if (this.level.g(i+1,j)>0 && !(this.level.g(i-1,j)>0 || ((this.level.g(i,j+1)>0) != (this.level.g(i,j-1)>0) ) ))
            o=4;
          else if (this.level.g(i-1,j)>0 && !(this.level.g(i+1,j)>0 || ((this.level.g(i,j+1)>0) != (this.level.g(i,j-1)>0) ) ))
            o=3;
          else if (this.level.g(i,j+1)>0 && !(this.level.g(i,j-1)>0 || ((this.level.g(i+1,j)>0) != (this.level.g(i-1,j)>0) ) ))
            o=2;
          else if (this.level.g(i,j-1)>0 && !(this.level.g(i,j+1)>0 || ((this.level.g(i+1,j)>0) != (this.level.g(i-1,j)>0) ) ))
            o=1;
          else if ((this.level.g(i,j-1)>0) == (this.level.g(i,j+1)>0) && (this.level.g(i-1,j)>0) == (this.level.g(i+1,j)>0) && (this.level.g(i,j-1)>0) != (this.level.g(i-1,j)>0))
            o=0;
          else if (this.level.g(i+1,j)>0||this.level.g(i-1,j)>0||this.level.g(i,j+1)>0||this.level.g(i,j-1)>0)
            o = 5;
          else if ((((this.level.g(i+1,j+1)>0)?1:0)+((this.level.g(i-1,j+1)>0)?1:0)+((this.level.g(i+1,j-1)>0)?1:0)+((this.level.g(i-1,j-1)>0)?1:0)) > 1)
            o = 5;
          else if (this.level.g(i+1,j+1)>0)
            o = 6;
          else if (this.level.g(i-1,j+1)>0)
            o = 7;
          else if (this.level.g(i+1,j-1)>0)
            o = 8;
          else if (this.level.g(i-1,j-1)>0)
            o = 9;
          else
            o = 0;
          let id = Math.abs(this.level.g(i,j))-1;
          data.push(i);
          data.push(j);
          data.push(o+0.01);
          data.push(id+0.01);

          data.push(i);
          data.push(j+1);
          data.push(o+0.01);
          data.push(id+0.99);

          data.push(i+1);
          data.push(j);
          data.push(o+0.99);
          data.push(id+0.01);

          data.push(i+1);
          data.push(j+1);
          data.push(o+0.99);
          data.push(id+0.99);


          data.push(i+1);
          data.push(j);
          data.push(o+0.99);
          data.push(id+0.01);


          data.push(i);
          data.push(j+1);
          data.push(o+0.01);
          data.push(id+0.99);


      }
    gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    this.vsize=data.length/4;




  }

  constructor(){
    this.level = new array2d(1000);
    let js = loadJSON("static/level.json");
    let inc = 0;
    for (let i:number = 0 ; i < 1000 ; i++){
      for (let j:number = 0 ; j < 1000 ; j++){
        this.level.s(i,j,js[inc]);
        inc++;
      }
    }

    this.vbo=gl.createBuffer();
    //this.vao=gl.createVertexArray();
    //gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,0,0]),gl.STATIC_DRAW);this.vsize=0;

    // gl.vertexAttribPointer(0, 2, gl.FLOAT, false, sizeof(1.1)*4, sizeof(1.1)*0);
    // gl.enableVertexAttribArray(0);
    // gl.vertexAttribPointer(1, 2, gl.FLOAT, false, sizeof(1.1)*4, sizeof(1.1)*2);
    // gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER,null);

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, loadtxt('static/world.vert','text/plain'));
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, loadtxt('static/world.frag','text/plain'));
    gl.compileShader(fragShader);

    this.shader = gl.createProgram();
    gl.attachShader(this.shader, vertShader);
    gl.attachShader(this.shader, fragShader);
    gl.linkProgram(this.shader);

    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);
    gl.detachShader(this.shader,vertShader);
    gl.detachShader(this.shader,fragShader);
    this.update();
    this.tex = loadTexture('static/test.png');
  }
  render(){
    gl.useProgram(this.shader);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);
    let t:any = gl.getUniformLocation(this.shader,'i');
    gl.vertexAttribPointer(t, 4, gl.FLOAT, false,0, 0);
    gl.enableVertexAttribArray(t);
    // gl.vertexAttribPointer(t2, 2, gl.FLOAT, false, 8*4, 8*2);
    // gl.enableVertexAttribArray(t2);
    gl.uniform2f(gl.getUniformLocation(this.shader,'off'),-pl.pos.x,-pl.pos.y);
    gl.uniform2f(gl.getUniformLocation(this.shader,'scl'),1/16,(1/16)*(canvas.width/canvas.height));
    gl.uniform2i(gl.getUniformLocation(this.shader,'spnum'),11,2);

    gl.drawArrays(gl.TRIANGLES,0,this.vsize);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    gl.useProgram(null);

  }


}

var gmst:gamestate = new gamestate();



var keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  main: false,
  off:false,
  block:false,
  inv:false,
  friend:false,
}
var pkeys = {
  up: false,
  down: false,
  left: false,
  right: false,
  main: false,
  off:false,
  block:false,
  inv:false,
  friend:false,
}
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37:
      if (!event.repeat)
        keys.left = true;
      break;
    case 38:
      if (!event.repeat)
        keys.up = true;
      break;
    case 39: // ->
      if (!event.repeat)
        keys.right = true;
      break;
    case 40: // ->
      if (!event.repeat)
        keys.down = true;
      break;
    case 90: // X
      if (!event.repeat)
        keys.main = true;
      break;
    case 32:// X
      if (!event.repeat)
        keys.block = true;
      break;
    case 88:
      if (!event.repeat)
        keys.off = true;
      break;
    case 67:
      if (!event.repeat)
        keys.inv = true;
      break;
    case 70:
      if (!event.repeat)
        keys.friend = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 37:
      if (!event.repeat)
        keys.left = false;
      break;
    case 38:
      if (!event.repeat)
        keys.up = false;
      break;
    case 39: // ->
      if (!event.repeat)
        keys.right = false;
      break;
    case 40: // ->
      if (!event.repeat)
        keys.down = false;
      break;
    case 90: // X
      if (!event.repeat)
        keys.main = false;
      break;
    case 32:// X
      if (!event.repeat)
        keys.block = false;
      break;
    case 88:
      if (!event.repeat)
        keys.off = false;
      break;
    case 67:
      if (!event.repeat)
        keys.inv = false;
      break;
    case 70:
      if (!event.repeat)
        keys.friend = false;
      break;
  }
});



var spsize = 64;
var lastUpdateTime:any = performance.now();




var plvbo:any=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,plvbo);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,0,0, 1,0,1,0, 0,1,0,1,  1,1,1,1, 1,0,1,0, 0,1,0,0]),gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER,null);


setInterval(function(){
  var currentTime:any = performance.now();
  var dt:number = (currentTime - lastUpdateTime)/1000.0;

  {
    if (canvas.width != window.innerWidth || canvas.height != window.innerHeight){
      canvas.width  = window.innerWidth;
    	canvas.height = window.innerHeight;
      gl.viewport(0,0,canvas.width,canvas.height);
    }
    gl.clearColor(0.9,0.9,0.8,1);
    gl.clear(gl.COLOR_BUFFER_BIT);


    gmst.render();
    gl.useProgram(gmst.shader);
    gl.bindBuffer(gl.ARRAY_BUFFER,plvbo);
    let t:any = gl.getUniformLocation(gmst.shader,'i');
    gl.vertexAttribPointer(t, 4, gl.FLOAT, false,0, 0);
    gl.enableVertexAttribArray(t);

    gl.uniform2f(gl.getUniformLocation(gmst.shader,'off'),-0.5,-0.5);
    gl.uniform2f(gl.getUniformLocation(gmst.shader,'scl'),1/16,(1/16)*(canvas.width/canvas.height));
    gl.uniform2i(gl.getUniformLocation(gmst.shader,'spnum'),11,2);
    gl.drawArrays(gl.TRIANGLES,0,6);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    gl.useProgram(null);



    gl.flush();



    // context.clearRect(0, 0, canvas.width, canvas.height);
    // context.fillStyle = 'rgb(0,0,0)';
    // context.beginPath();
    // context.rect(0,0,canvas.width,canvas.height);
    // context.fill();
    // let plsize = canvas.height/16;
    //
    //
    // let im = Math.min(pl.pos.x+((canvas.width/2)/plsize+1),999);
    // let jm = Math.min(pl.pos.y+((canvas.height/2)/plsize+1),999);
    // for (let i = Math.max(Math.floor(pl.pos.x-(((canvas.width/2)/plsize)+1)),1) ; i < im; i++)
    //   for (let j = Math.max(Math.floor(pl.pos.y-(((canvas.height/2)/plsize)+1)),1) ; j < jm ; j++)
    //     if (gmst.level.g(i,j)>0){
    //       context.fillStyle = 'rgb(100,100,100)';
    //       context.beginPath();
    //       context.rect((i-pl.pos.x)*plsize+(canvas.width/2)-1,(j-pl.pos.y)*plsize+(canvas.height/2)-1,plsize+2,plsize+2);//characters[mee.char],0,mee.anim*spsize,spsize,spsize
    //       context.fill();
    //     }else {
    //       context.fillStyle = 'rgb(150,150,150)'
    //
    //       let o:number = 5;
    //
    //       if (gmst.level.g(i+1,j)!=0&&gmst.level.g(i,j+1)!=0&&gmst.level.g(i-1,j)!=0&&gmst.level.g(i,j-1)!=0)
    //         o=5;
    //       else if (gmst.level.g(i+1,j)!=0 && !(gmst.level.g(i-1,j)!=0 || ((gmst.level.g(i,j+1)!=0) != (gmst.level.g(i,j-1)!=0) ) ))
    //         o=4;
    //       else if (gmst.level.g(i-1,j)!=0 && !(gmst.level.g(i+1,j)!=0 || ((gmst.level.g(i,j+1)!=0) != (gmst.level.g(i,j-1)!=0) ) ))
    //         o=3;
    //       else if (gmst.level.g(i,j+1)!=0 && !(gmst.level.g(i,j-1)!=0 || ((gmst.level.g(i+1,j)!=0) != (gmst.level.g(i-1,j)!=0) ) ))
    //         o=2;
    //       else if (gmst.level.g(i,j-1)!=0 && !(gmst.level.g(i,j+1)!=0 || ((gmst.level.g(i+1,j)!=0) != (gmst.level.g(i-1,j)!=0) ) ))
    //         o=1;
    //       else if ((gmst.level.g(i,j-1)!=0) == (gmst.level.g(i,j+1)!=0) && (gmst.level.g(i-1,j)!=0) == (gmst.level.g(i+1,j)!=0) && (gmst.level.g(i,j-1)!=0) != (gmst.level.g(i-1,j)!=0))
    //         o=0;
    //       else if (gmst.level.g(i+1,j)!=0||gmst.level.g(i-1,j)!=0||gmst.level.g(i,j+1)!=0||gmst.level.g(i,j-1)!=0)
    //         o = 5;
    //       else if ((((gmst.level.g(i+1,j+1)!=0)?1:0)+((gmst.level.g(i-1,j+1)!=0)?1:0)+((gmst.level.g(i+1,j-1)!=0)?1:0)+((gmst.level.g(i-1,j-1)!=0)?1:0)) > 1)
    //         o = 5;
    //       else if (gmst.level.g(i+1,j+1)!=0)
    //         o = 6;
    //       else if (gmst.level.g(i-1,j+1)!=0)
    //         o = 7;
    //       else if (gmst.level.g(i+1,j-1)!=0)
    //         o = 8;
    //       else if (gmst.level.g(i-1,j-1)!=0)
    //         o = 9;
    //       else
    //         o = 0;
    //
    //
    //       context.drawImage(spsheet,0,o*spsize,spsize+2,spsize+2,(i-pl.pos.x)*plsize+(canvas.width/2)-1,(j-pl.pos.y)*plsize+(canvas.height/2)-1,plsize+2,plsize+2);
    //   }
    //
    //
    //
    //
    // context.fillStyle = 'blue';
    // context.beginPath();
    // context.rect((canvas.width/2)-plsize/2,(canvas.height/2)-plsize/2,plsize,plsize);//characters[mee.char],0,mee.anim*spsize,spsize,spsize
    // context.fill();
    //
    // context.fillStyle = 'black';
    // context.font = "16px Verdana";
    // context.fillText("FPS:"+Math.floor(1/dt),10,18);
  }



  let v:vec = new vec(0,0);
  {
    if (keys.up)
      v.y++;
    if (keys.down)
      v.y--;
    if (keys.left)
      v.x--;
    if (keys.right)
      v.x++;

    if (v.lensq() > 0.1)
      v = v.norm().smul(dt*8);
  }
  let steps:number = Math.ceil(v.len()*2.0+0.1);
  let va:vec = v.sdiv(steps);
  for (let i:number = 0 ; i < steps ; i++){
    pl.pos=pl.pos.add(va);

    if (gmst.level.g(Math.floor(pl.pos.x-0.495),Math.floor(pl.pos.y))<=0)
      pl.pos.x = Math.floor(pl.pos.x)+0.505;
    if (gmst.level.g(Math.floor(pl.pos.x+0.495),Math.floor(pl.pos.y))<=0)
      pl.pos.x = Math.floor(pl.pos.x)+0.495;
    if (gmst.level.g(Math.floor(pl.pos.x),Math.floor(pl.pos.y+0.495))<=0)
      pl.pos.y = Math.floor(pl.pos.y)+0.495;
    if (gmst.level.g(Math.floor(pl.pos.x),Math.floor(pl.pos.y-0.495))<=0)
      pl.pos.y = Math.floor(pl.pos.y)+0.505;

    if (gmst.level.g(Math.floor(pl.pos.x-0.495),Math.floor(pl.pos.y-0.495))<=0)
      if (Math.abs(pl.pos.y-(Math.floor(pl.pos.y)+0.5)) < Math.abs(pl.pos.x-(Math.floor(pl.pos.x)+0.5)) )
        pl.pos.y = Math.floor(pl.pos.y)+0.505;
      else
        pl.pos.x = Math.floor(pl.pos.x)+0.505;
    if (gmst.level.g(Math.floor(pl.pos.x+0.495),Math.floor(pl.pos.y-0.495))<=0)
      if (Math.abs(pl.pos.y-(Math.floor(pl.pos.y)+0.5)) < Math.abs(pl.pos.x-(Math.floor(pl.pos.x)+0.5)) )
        pl.pos.y = Math.floor(pl.pos.y)+0.505;
      else
        pl.pos.x = Math.floor(pl.pos.x)+0.495;
    if (gmst.level.g(Math.floor(pl.pos.x-0.495),Math.floor(pl.pos.y+0.495))<=0)
      if (Math.abs(pl.pos.y-(Math.floor(pl.pos.y)+0.5)) < Math.abs(pl.pos.x-(Math.floor(pl.pos.x)+0.5)) )
        pl.pos.y = Math.floor(pl.pos.y)+0.495;
      else
        pl.pos.x = Math.floor(pl.pos.x)+0.505;
    if (gmst.level.g(Math.floor(pl.pos.x+0.495),Math.floor(pl.pos.y+0.495))<=0)
      if (Math.abs(pl.pos.y-(Math.floor(pl.pos.y)+0.5)) < Math.abs(pl.pos.x-(Math.floor(pl.pos.x)+0.5)) )
        pl.pos.y = Math.floor(pl.pos.y)+0.495;
      else
        pl.pos.x = Math.floor(pl.pos.x)+0.495;




  }




  pkeys=keys;
  lastUpdateTime=currentTime;



},0)
