


const socket:any = io();



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
  dot(t:vec):number {
    return t.x*this.x+t.y*this.y;
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
var directions:vec[] = [new vec(0,1),new vec(0,-1),new vec(-1,0),new vec(1,0)];
var dangles:number[] = [0,Math.PI,Math.PI*0.5,Math.PI*1.5];
class player {
  pos:vec;
  hp:number;
  items:number[];
  dir:number;
  maini:number;
  offi:number;

  hlen:number;
  swanim:number;
  stun:number;

  name:string;
  outfit:number;
  points:number;
  team:any;

  constructor(name = "loading...",points=0){
    this.pos = new vec(10,980);
    this.hp=100;
    // this.items=[1,0,0,13,
    //             12,11,10,9,
    //             1,6,7,8,
    //             5,2,3,4];
    this.items=[0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0];
    this.dir = 0;
    this.hlen = 0;
    this.name = name;
    this.maini=0;
    this.offi=1;
    this.swanim=-1;
    this.stun=-1;
    this.outfit=0;
    this.points=points;
    this.team=null;


  }
  checkdef(){
    let t = 1;
    switch(this.items[2]){
      case 7:t+=0.3;break;
      case 8:t+=0.6;break;
      case 9:t+=1.0;break;
    }
    switch(this.items[3]){
      case 7:t+=0.3;break;
      case 8:t+=0.6;break;
      case 9:t+=1.0;break;
    }
    return t;
  }
  checkspd(){
    let t = 1;
    switch(this.items[2]){
      case 10:t+=0.2;break;
      case 11:t+=0.4;break;
    }
    switch(this.items[3]){
      case 10:t+=0.2;break;
      case 11:t+=0.4;break;
    }
    return t;
  }
  checkreg(){
    let t = 0;
    switch(this.items[2]){
      case 12:t+=1;break;
      case 13:t+=3;break;
    }
    switch(this.items[3]){
      case 12:t+=1;break;
      case 13:t+=3;break;
    }
    return t;
  }

}



var pl:player = new player(prompt("Enter a name", ""));
if (pl.name == ""){
  switch (Math.floor(Math.random()*3)){
    case 0:pl.name = "I have no name :(";break;
    case 1:pl.name = "A person that didn't input a name";break;
    case 2:pl.name = "My mind is blank";break;
    default:pl.name = "Hmmm this name should've been impossible to get randomly";break;
  }

}
class vertbuf{
    vbo:any;
    vsize:number;

}

class chest{
  pos:vec;
  id:number;
  constructor(pos,id){
    this.pos=pos;
    this.id=id;
  }

}
class shad{
  prog:any;
  constructor(v,f){
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, loadtxt(v,'text/plain'));
    gl.compileShader(vertShader);

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, loadtxt(f,'text/plain'));
    gl.compileShader(fragShader);

    this.prog = gl.createProgram();
    gl.attachShader(this.prog, vertShader);
    gl.attachShader(this.prog, fragShader);
    gl.linkProgram(this.prog);

    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);
    gl.detachShader(this.prog,vertShader);
    gl.detachShader(this.prog,fragShader);
  }

}
class gamestate {


  level:array2d<number>;
  chunks:array2d<vertbuf>;
  chests:chest[];
  shader:shad;
  tshader:shad;
  tex:any;
  chesttex:any;

  ochestvbo:any;
  cchestvbo:any;


  update(){

    for (let it : number = 0 ; it < 50 ; it++)
      for (let jt : number = 0 ; jt < 50 ; jt++){
        let data:number[] = [];
        for (let i : number = 1+it*20 ; i < 1+(it+1)*20 ; i++)
          for (let j : number = 1+jt*20 ; j < 1+(jt+1)*20  ; j++){

              let o:number = 5;
              if (this.level.g(i,j)>0)
                o=14;
              else if (this.level.g(i,j)==0){
                if (this.level.g(i+1,j)!=0&&this.level.g(i,j+1)!=0&&this.level.g(i-1,j)!=0&&this.level.g(i,j-1)!=0)
                  o=5;
                else if (this.level.g(i+1,j)!=0 && !(this.level.g(i-1,j)!=0 || ((this.level.g(i,j+1)!=0) != (this.level.g(i,j-1)!=0) ) ))
                  o=4;
                else if (this.level.g(i-1,j)!=0 && !(this.level.g(i+1,j)!=0 || ((this.level.g(i,j+1)!=0) != (this.level.g(i,j-1)!=0) ) ))
                  o=3;
                else if (this.level.g(i,j+1)!=0 && !(this.level.g(i,j-1)!=0 || ((this.level.g(i+1,j)!=0) != (this.level.g(i-1,j)!=0) ) ))
                  o=2;
                else if (this.level.g(i,j-1)!=0 && !(this.level.g(i,j+1)!=0 || ((this.level.g(i+1,j)!=0) != (this.level.g(i-1,j)!=0) ) ))
                  o=1;
                else if ((this.level.g(i,j-1)!=0) == (this.level.g(i,j+1)!=0) && (this.level.g(i-1,j)!=0) == (this.level.g(i+1,j)!=0) && (this.level.g(i,j-1)!=0) != (this.level.g(i-1,j)!=0))
                  o=0;
                else if (this.level.g(i+1,j)!=0||this.level.g(i-1,j)!=0||this.level.g(i,j+1)!=0||this.level.g(i,j-1)!=0){
                  if (this.level.g(i+1,j)!=0&&this.level.g(i,j+1)!=0 && !(this.level.g(i,j-1)!=0||this.level.g(i-1,j)!=0 ))
                    o = 13;
                  else if (this.level.g(i-1,j)!=0&&this.level.g(i,j+1)!=0 && !(this.level.g(i,j-1)!=0||this.level.g(i+1,j)!=0 ))
                    o = 12;
                  else if (this.level.g(i+1,j)!=0&&this.level.g(i,j-1)!=0 && !(this.level.g(i,j+1)!=0||this.level.g(i-1,j)!=0 ))
                    o = 11;
                  else if (this.level.g(i-1,j)!=0&&this.level.g(i,j-1)!=0 && !(this.level.g(i,j+1)!=0||this.level.g(i+1,j)!=0 ))
                    o = 10;
                  else
                    o = 5;
                }
                else if ((((this.level.g(i+1,j+1)!=0)?1:0)+((this.level.g(i-1,j+1)!=0)?1:0)+((this.level.g(i+1,j-1)!=0)?1:0)+((this.level.g(i-1,j-1)!=0)?1:0)) > 1)
                  o = 5;
                else if (this.level.g(i+1,j+1)!=0)
                  o = 6;
                else if (this.level.g(i-1,j+1)!=0)
                  o = 7;
                else if (this.level.g(i+1,j-1)!=0)
                  o = 8;
                else if (this.level.g(i-1,j-1)!=0)
                  o = 9;
                else
                  o = 0;

              }else if (this.level.g(i+1,j)>=0&&this.level.g(i,j+1)>=0&&this.level.g(i-1,j)>=0&&this.level.g(i,j-1)>=0)
                o=5;
              else if (this.level.g(i+1,j)>=0 && !(this.level.g(i-1,j)>=0 || ((this.level.g(i,j+1)>=0) != (this.level.g(i,j-1)>=0) ) ))
                o=4;
              else if (this.level.g(i-1,j)>=0 && !(this.level.g(i+1,j)>=0 || ((this.level.g(i,j+1)>=0) != (this.level.g(i,j-1)>=0) ) ))
                o=3;
              else if (this.level.g(i,j+1)>=0 && !(this.level.g(i,j-1)>=0 || ((this.level.g(i+1,j)>=0) != (this.level.g(i-1,j)>=0) ) ))
                o=2;
              else if (this.level.g(i,j-1)>=0 && !(this.level.g(i,j+1)>=0 || ((this.level.g(i+1,j)>=0) != (this.level.g(i-1,j)>=0) ) ))
                o=1;
              else if ((this.level.g(i,j-1)>=0) == (this.level.g(i,j+1)>=0) && (this.level.g(i-1,j)>=0) == (this.level.g(i+1,j)>=0) && (this.level.g(i,j-1)>=0) != (this.level.g(i-1,j)>=0))
                o=0;
              else if (this.level.g(i+1,j)>=0||this.level.g(i-1,j)>=0||this.level.g(i,j+1)>=0||this.level.g(i,j-1)>=0){
                if (this.level.g(i+1,j)>=0&&this.level.g(i,j+1)>=0 && !(this.level.g(i,j-1)>=0||this.level.g(i-1,j)>=0 ))
                  o = 13;
                else if (this.level.g(i-1,j)>=0&&this.level.g(i,j+1)>=0 && !(this.level.g(i,j-1)>=0||this.level.g(i+1,j)>=0 ))
                  o = 12;
                else if (this.level.g(i+1,j)>=0&&this.level.g(i,j-1)>=0 && !(this.level.g(i,j+1)>=0||this.level.g(i-1,j)>=0 ))
                  o = 11;
                else if (this.level.g(i-1,j)>=0&&this.level.g(i,j-1)>=0 && !(this.level.g(i,j+1)>=0||this.level.g(i+1,j)>=0 ))
                  o = 10;
                else
                  o = 5;
              }
              else if ((((this.level.g(i+1,j+1)>=0)?1:0)+((this.level.g(i-1,j+1)>=0)?1:0)+((this.level.g(i+1,j-1)>=0)?1:0)+((this.level.g(i-1,j-1)>=0)?1:0)) > 1)
                o = 5;
              else if (this.level.g(i+1,j+1)>=0)
                o = 6;
              else if (this.level.g(i-1,j+1)>=0)
                o = 7;
              else if (this.level.g(i+1,j-1)>=0)
                o = 8;
              else if (this.level.g(i-1,j-1)>=0)
                o = 9;
              else
                o = 0;
              let id = Math.abs(this.level.g(i,j));
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
          gl.bindBuffer(gl.ARRAY_BUFFER,this.chunks.g(it,jt).vbo);
          gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
          this.chunks.g(it,jt).vsize=data.length/4;

        }
        gl.bindBuffer(gl.ARRAY_BUFFER,null);





  }

  constructor(){
    this.level = new array2d(1002);
    this.chunks = new array2d(50);
    let js = loadJSON("static/level.json");
    let inc = 0;
    for (let i:number = 0 ; i < 1002 ; i++)
      for (let j:number = 0 ; j < 1002 ; j++){
        this.level.s(i,j,-1);
      }
    for (let i:number = 1 ; i < 1001 ; i++){
      for (let j:number = 1 ; j < 1001 ; j++){
        this.level.s(i,j,js["tiles"][inc]);
        inc++;
      }
    }
    for (let i : number = 0 ; i < 50 ; i++)
      for (let j : number = 0 ; j < 50 ; j++){
        this.chunks.s(i,j,new vertbuf);
        this.chunks.g(i,j).vbo=gl.createBuffer();
        //this.vao=gl.createVertexArray();
        //gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.chunks.g(i,j).vbo);
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,0,0]),gl.STATIC_DRAW);this.chunks.g(i,j).vsize=0;
      }
    // gl.vertexAttribPointer(0, 2, gl.FLOAT, false, sizeof(1.1)*4, sizeof(1.1)*0);
    // gl.enableVertexAttribArray(0);
    // gl.vertexAttribPointer(1, 2, gl.FLOAT, false, sizeof(1.1)*4, sizeof(1.1)*2);
    // gl.enableVertexAttribArray(1);

    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    this.shader = new shad('static/world.vert','static/world.frag');
    this.tshader = new shad('static/world.vert','static/transparent.frag');



    this.update();
    this.tex = loadTexture('static/img/tiles.png');
    this.chesttex = loadTexture('static/img/chest.png');

    this.ochestvbo=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,this.ochestvbo);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,1.01,0.99, 1,0,1.99,0.99, 0,1,1.01,0.01,  1,1,1.99,0.01, 1,0,1.99,0.99, 0,1,1.01,0.01]),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);

    this.cchestvbo=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,this.cchestvbo);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,0.01,0.99, 1,0,0.99,0.99, 0,1,0.01,0.01,  1,1,0.99,0.01, 1,0,0.99,0.99, 0,1,0.01,0.01]),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);


    for (let i:number = 0 ;i < js["hpaths"].length ; i++)
      this.level.s(js["hpaths"][i]["x"]+1,js["hpaths"][i]["y"],1);
    this.chests=[];
    for (let i:number = 0 ;i < js["chests"].length ; i++)
      this.chests.push(new chest(new vec(js["chests"][i]["x"]+1,js["chests"][i]["y"]),js["chests"][i]["id"]))


  }
  render(){
    gl.useProgram(this.shader.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.uniform2f(gl.getUniformLocation(this.shader.prog,'off'),-pl.pos.x,-pl.pos.y);
    gl.uniform2f(gl.getUniformLocation(this.shader.prog,'scl'),(1/12)*(canvas.height/canvas.width),1/12);
    gl.uniform2i(gl.getUniformLocation(this.shader.prog,'spnum'),15,3);

    let stop:number = pl.pos.y-13;
    let sbottom:number = pl.pos.y+13;
    let sleft:number = pl.pos.x-13/(canvas.height/canvas.width);
    let sright:number = pl.pos.x+13/(canvas.height/canvas.width);
    for (let i : number = 0 ; i < 50 ; i++)
      for (let j : number = 0 ; j < 50 ; j++){
        if (!(i*20 > sright ||
                             (i+1)*20 < sleft ||
                             j*20 > sbottom ||
                             (j+1)*20 < stop)){
          gl.bindBuffer(gl.ARRAY_BUFFER,this.chunks.g(i,j).vbo);
          let t:any = gl.getUniformLocation(this.shader.prog,'i');
          gl.vertexAttribPointer(t, 4, gl.FLOAT, false,0, 0);
          gl.enableVertexAttribArray(t);
      // gl.vertexAttribPointer(t2, 2, gl.FLOAT, false, 8*4, 8*2);
      // gl.enableVertexAttribArray(t2);


          gl.drawArrays(gl.TRIANGLES,0,this.chunks.g(i,j).vsize);
        }
      }
      gl.useProgram(this.tshader.prog);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.chesttex);
      gl.uniform2f(gl.getUniformLocation(this.tshader.prog,'scl'),(1/12)*(canvas.height/canvas.width),1/12);
      gl.uniform2i(gl.getUniformLocation(this.tshader.prog,'spnum'),2,1);
      for (let i = 0; i<this.chests.length;i++){
        let x = this.chests[i].pos.x;
        let y = this.chests[i].pos.y;

        if (!(x > sright ||
           (x+1) < sleft ||
           y > sbottom ||
           (y+1) < stop)){
          gl.bindBuffer(gl.ARRAY_BUFFER,(this.chests[i].id>0)?this.cchestvbo:this.ochestvbo);
          let t:any = gl.getUniformLocation(this.tshader.prog,'i');
          gl.vertexAttribPointer(t, 4, gl.FLOAT, false,0, 0);
          gl.enableVertexAttribArray(t);

          gl.uniform2f(gl.getUniformLocation(this.tshader.prog,'off'),x-pl.pos.x,y-pl.pos.y);


          gl.drawArrays(gl.TRIANGLES,0,6);
        }

      }

      gl.bindBuffer(gl.ARRAY_BUFFER,null);
      gl.useProgram(null);

  }


}

var gmst:gamestate = new gamestate();


socket.emit('n',pl);

setInterval(function() {
    socket.emit('u', pl);
}, 1000 / 30);

var oplayers:any;
var opltemp:any = {};
socket.on('s', function(players) {
  oplayers = players;
});


var chatelements:any[] = [document.getElementById('ctxt0'),document.getElementById('ctxt1'),document.getElementById('ctxt2'),document.getElementById('ctxt3'),document.getElementById('ctxt4')];
var boardelements:any[] = [document.getElementById('board0'),document.getElementById('board1'),document.getElementById('board2'),document.getElementById('board3'),document.getElementById('board4')];

var cnewtime=-1;

function chat(message) {
   for (var i = 4 ; i > 0 ; i --)
   {
   		chatelements[i].innerHTML=chatelements[i-1].innerHTML;
   }
   chatelements[0].innerHTML=message;
   cnewtime = 1.5;
}
socket.on('c', chat);

socket.on('chg',function(ch) {
  for (let i in pl.items){
    if (pl.items[i]==0){
      pl.items[i]=ch['v'];
      break;
    }
  }
});
socket.on('chr',function(ch) {
  for (let i in gmst.chests)
    gmst.chests[i].id = Math.abs(gmst.chests[i].id);

});
socket.on('dmg',function(dmg,from) {

  if (pl.stun < 0.0){
    pl.stun = 1.7;
    pl.hp-=dmg/pl.checkdef();
    if (pl.hp <= 0){
      socket.emit('pt',from,socket.id)
    }
  }
});
socket.on('point',function() {
  pl.points++;
});

socket.on('swanim',function(from) {
  if (!opltemp[from])
    opltemp[from]={};
  opltemp[from].swanim=0.12;
});



var keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  main: false,
  off:false,
  inv:false,
}
var pkeys = {
  up: false,
  down: false,
  left: false,
  right: false,
  main: false,
  off:false,
  inv:false,
}

var isMobile = !!(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
var ongoingTouches = [];


document.body.addEventListener('click', function(e) {

  var plsizeh = 1/2;
  var plsize = canvas.height/12;
  var x = (e.clientX-canvas.width/2)/plsize+pl.pos.x;
  var y = (e.clientY-canvas.height/2)/plsize+pl.pos.y;
  for (let i in oplayers){
    if (x>oplayers[i].pos.x-plsizeh && x<oplayers[i].pos.x+plsizeh && y>oplayers[i].pos.y-plsizeh && y<oplayers[i].pos.y+plsizeh){
      if (oplayers[i].team!=null)
        chat(oplayers[i].name+" on team: "+oplayers.team+" ("+oplayers[i].points+")");
      else
        chat(oplayers[i].name+" ("+oplayers[i].points+")");
    }
  }


},false);
// document.body.addEventListener('contextmenu', function(e) {
//   alert("You've tried to open context menu"); //here you draw your own menu
//   e.preventDefault();
// }, false);





if (isMobile){

  function handleStart(e) {ongoingTouches = e.touches;e.preventDefault();}
	function handleEnd(e)   {ongoingTouches = e.touches;}
	function handleCancel(e){ongoingTouches = e.touches;}
	function handleMove(e)  {ongoingTouches = e.touches;e.preventDefault();}
	canvas.addEventListener("touchstart", handleStart, false);
	canvas.addEventListener("touchend", handleEnd, false);
	canvas.addEventListener("touchcancel", handleCancel, false);
	canvas.addEventListener("touchmove", handleMove, false);
}else{
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
      case 88:
        if (!event.repeat)
          keys.off = true;
        break;
      case 67:
        if (!event.repeat)
          keys.inv = true;
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
      case 88:
        if (!event.repeat)
          keys.off = false;
        break;
      case 67:
        if (!event.repeat)
          keys.inv = false;
        break;
    }
  });
}


function createButton(func,style,v=""):any {
    var button:any = document.createElement("input");
    button.type = "button";
    button.value = v;
    button.onclick = func;
    button.style = style;
    document.body.appendChild(button);
    return button;
}
function createButtoni(func,style):any {
    var button:any = document.createElement("input");
    button.type = "image";
    button.onclick = func;
    button.alt = 'an item button';
    button.value = ' ';
    button.src = " ";
    button.style = style;
    document.body.appendChild(button);
    return button;
}
var invfocus:number = -1;
var itemgraphics:string[] = ["static/img/items/nullitem.png","static/img/items/hookshot.png","static/img/items/sword0.png","static/img/items/sword1.png","static/img/items/sword2.png","static/img/items/sword3.png","static/img/items/sword4.png","static/img/items/armor0.png","static/img/items/armor1.png","static/img/items/armor2.png","static/img/items/boots0.png","static/img/items/boots1.png","static/img/items/hat0.png","static/img/items/hat1.png"];
var invdisp:any[] = [
  createButtoni(function(){if (invfocus==-1)invfocus=0;else {let t = pl.items[0]; pl.items[0]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; } },"outline:6px solid green;position: absolute; left: 32px; top: 32px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=1;else {let t = pl.items[1]; pl.items[1]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid green;position: absolute; left: 102px; top: 32px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=2;else {let t = pl.items[2]; pl.items[2]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid blue;position: absolute; left: 172px; top: 32px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=3;else {let t = pl.items[3]; pl.items[3]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid blue;position: absolute; left: 242px; top: 32px;width:64px; height:64px;"),

  createButtoni(function(){if (invfocus==-1)invfocus=4;else {let t = pl.items[4]; pl.items[4]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 32px; top: 102px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=5;else {let t = pl.items[5]; pl.items[5]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 102px; top: 102px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=6;else {let t = pl.items[6]; pl.items[6]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 172px; top: 102px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=7;else {let t = pl.items[7]; pl.items[7]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 242px; top: 102px;width:64px; height:64px;"),


  createButtoni(function(){if (invfocus==-1)invfocus=8;else {let t = pl.items[8]; pl.items[8]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 32px; top: 172px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=9;else {let t = pl.items[9]; pl.items[9]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 102px; top: 172px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=10;else {let t = pl.items[10]; pl.items[10]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 172px; top: 172px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=11;else {let t = pl.items[11]; pl.items[11]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 242px; top: 172px;width:64px; height:64px;"),

  createButtoni(function(){if (invfocus==-1)invfocus=12;else {let t = pl.items[12]; pl.items[12]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 32px; top: 242px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=13;else {let t = pl.items[13]; pl.items[13]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 102px; top: 242px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=14;else {let t = pl.items[14]; pl.items[14]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 172px; top: 242px;width:64px; height:64px;"),
  createButtoni(function(){if (invfocus==-1)invfocus=15;else {let t = pl.items[15]; pl.items[15]=pl.items[invfocus]; pl.items[invfocus]=t;invfocus=-1; }},"outline:6px solid black;position: absolute; left: 242px; top: 242px;width:64px; height:64px;")
];

var trashbutton:any = createButtoni(function(){if (invfocus!=-1){pl.items[invfocus]=0;invfocus=-1;}},"position: absolute; left: 32px; top: 312px;width:64px; height:64px;");
trashbutton.src = "static/img/items/trash.png";
//var givebutton:any = createButton(function(){pl.maini=3},"position: absolute; left: 128px; top: 112px;","give");


var spsize = 64;
var lastUpdateTime:any = performance.now();

var hptext:any = document.getElementById('hp');
var nametext:any = document.getElementById('name');
var pointtext:any = document.getElementById('points');
var teamtext:any = document.getElementById('team');

var plvbo:any=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,plvbo);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-0.5,-0.5,0.01,0.01, 0.5,-0.5,0.99,0.01, -0.5,0.5,0.01,0.99,  0.5,0.5,0.99,0.99, 0.5,-0.5,0.99,0.01, -0.5,0.5,0.01,0.99]),gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER,null);


var dynshad:shad = new shad('static/dynamic.vert','static/transparent.frag');



function trect(at,ab,al,ar, bt,bb,bl,br) {
  return !(bl > ar ||
           br < al ||
           bb > at ||
           bt < ab);
}

function sword(dmg){
  let v = pl.pos.add(directions[pl.dir].smul(1.5));

  for (let i in oplayers){
    if (i!=socket.id && trect(v.y+2,v.y-2,v.x-2,v.x+2,oplayers[i]["pos"]["y"]+0.5,oplayers[i]["pos"]["y"]-0.5,oplayers[i]["pos"]["x"]-0.5,oplayers[i]["pos"]["x"]+0.5)){
      if (oplayers[i].team==null || oplayers[i].team!=pl.team)
        socket.emit('atk',dmg,i,socket.id);

    }
  }
  socket.emit('sw',socket.id);
  pl.swanim = 0.12;

}

var swipetex = loadTexture('static/img/swipe.png');
var pltextures:string[] = [loadTexture('static/img/pl/player0.png'),loadTexture('static/img/pl/armoredegg.png')];

var stuneffect:number = 0;
var regtime:number = 0;
function updatefunc() {
  var currentTime:any = performance.now();
  var dt:number = (currentTime - lastUpdateTime)/1000.0;
  regtime+=dt;
  if (regtime>3.0){
    pl.hp+=pl.checkreg();
    regtime-=3.0;
  }
  if (pl.hp>100){
    pl.hp=100;
  }

  {
    if (canvas.width != window.innerWidth || canvas.height != window.innerHeight){
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0,0,canvas.width,canvas.height);
    }
    gl.clearColor(0.23137,0.23137,0.23137,1);
    gl.clear(gl.COLOR_BUFFER_BIT);


    gmst.render();
    gl.useProgram(dynshad.prog);
    if ((Math.round(stuneffect*5))%2==0 || !(pl.stun > 0)){
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pltextures[pl.outfit]);

      gl.bindBuffer(gl.ARRAY_BUFFER,plvbo);
      let t:any = gl.getUniformLocation(dynshad.prog,'i');
      gl.vertexAttribPointer(t, 4, gl.FLOAT, false,0, 0);
      gl.enableVertexAttribArray(t);

      gl.uniform2f(gl.getUniformLocation(dynshad.prog,'off'),0,0);
      gl.uniform2f(gl.getUniformLocation(dynshad.prog,'scl'),(1/12)*(canvas.height/canvas.width),1/12);
      gl.uniform2i(gl.getUniformLocation(dynshad.prog,'spnum'),1,2);

      gl.uniform2f(gl.getUniformLocation(dynshad.prog,'lscl'),1,-1);
      gl.uniform2f(gl.getUniformLocation(dynshad.prog,'uvoff'),0,((Math.round(pl.pos.x)+Math.round(pl.pos.y))%2)?0:1);
      gl.uniform1f(gl.getUniformLocation(dynshad.prog,'angle'),0);

      gl.drawArrays(gl.TRIANGLES,0,6);
      gl.bindBuffer(gl.ARRAY_BUFFER,null);
    }


    stuneffect += dt;
    stuneffect = stuneffect%20;
    for (let id in oplayers){
      if (id != socket.id){
        if ((Math.round(stuneffect*5))%2==0 || !(oplayers[id].stun > 0)){
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, pltextures[oplayers[id].outfit]);

          gl.bindBuffer(gl.ARRAY_BUFFER,plvbo);
          let t:any = gl.getUniformLocation(dynshad.prog,'i');
          gl.vertexAttribPointer(t, 4, gl.FLOAT, false,0, 0);
          gl.enableVertexAttribArray(t);

          gl.uniform2f(gl.getUniformLocation(dynshad.prog,'off'),oplayers[id].pos.x-pl.pos.x,oplayers[id].pos.y-pl.pos.y);
          gl.uniform2f(gl.getUniformLocation(dynshad.prog,'scl'),(1/12)*(canvas.height/canvas.width),1/12);
          gl.uniform2i(gl.getUniformLocation(dynshad.prog,'spnum'),1,2);

          gl.uniform2f(gl.getUniformLocation(dynshad.prog,'lscl'),1,-1);
          gl.uniform2f(gl.getUniformLocation(dynshad.prog,'uvoff'),0,((Math.round(oplayers[id].pos.x)+Math.round(oplayers[id].pos.y))%2)?1:0);
          gl.uniform1f(gl.getUniformLocation(dynshad.prog,'angle'),0);

          gl.drawArrays(gl.TRIANGLES,0,6);
          gl.bindBuffer(gl.ARRAY_BUFFER,null);
        }
        if (opltemp[id] && opltemp[id].swanim > 0){

          gl.useProgram(dynshad.prog);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, swipetex);

          gl.bindBuffer(gl.ARRAY_BUFFER,plvbo);
          let t:any = gl.getUniformLocation(dynshad.prog,'i');
          gl.vertexAttribPointer(t, 4, gl.FLOAT, false,0, 0);
          gl.enableVertexAttribArray(t);
          {
            let v = directions[oplayers[id].dir].smul(1.5);
            gl.uniform2f(gl.getUniformLocation(dynshad.prog,'off'),oplayers[id].pos.x-pl.pos.x+v.x,oplayers[id].pos.y-pl.pos.y+v.y);
          }
          gl.uniform2f(gl.getUniformLocation(dynshad.prog,'scl'),(1/12)*(canvas.height/canvas.width),(1/12));
          gl.uniform2i(gl.getUniformLocation(dynshad.prog,'spnum'),1,1);

          gl.uniform2f(gl.getUniformLocation(dynshad.prog,'lscl'),4,-4);
          gl.uniform2f(gl.getUniformLocation(dynshad.prog,'uvoff'),0,0);
          gl.uniform1f(gl.getUniformLocation(dynshad.prog,'angle'),dangles[oplayers[id].dir]);

          gl.drawArrays(gl.TRIANGLES,0,6);
          gl.bindBuffer(gl.ARRAY_BUFFER,null);
        }
        if (opltemp[id] && opltemp[id].swanim>0)
          opltemp[id].swanim-=dt;
      }
    }

    if (pl.swanim > 0){

      gl.useProgram(dynshad.prog);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, swipetex);

      gl.bindBuffer(gl.ARRAY_BUFFER,plvbo);
      let t:any = gl.getUniformLocation(dynshad.prog,'i');
      gl.vertexAttribPointer(t, 4, gl.FLOAT, false,0, 0);
      gl.enableVertexAttribArray(t);
      {
        let v = directions[pl.dir].smul(1.5);
        gl.uniform2f(gl.getUniformLocation(dynshad.prog,'off'),v.x,v.y);
      }
      gl.uniform2f(gl.getUniformLocation(dynshad.prog,'scl'),(1/12)*(canvas.height/canvas.width),(1/12));
      gl.uniform2i(gl.getUniformLocation(dynshad.prog,'spnum'),1,1);

      gl.uniform2f(gl.getUniformLocation(dynshad.prog,'lscl'),4,-4);
      gl.uniform2f(gl.getUniformLocation(dynshad.prog,'uvoff'),0,0);
      gl.uniform1f(gl.getUniformLocation(dynshad.prog,'angle'),dangles[pl.dir]);

      gl.drawArrays(gl.TRIANGLES,0,6);
      gl.bindBuffer(gl.ARRAY_BUFFER,null);
    }

    if (pl.hlen>=0.1){
      gl.useProgram(dynshad.prog);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, gmst.chesttex);

      gl.bindBuffer(gl.ARRAY_BUFFER,plvbo);
      let t:any = gl.getUniformLocation(dynshad.prog,'i');
      gl.vertexAttribPointer(t, 4, gl.FLOAT, false,0, 0);
      gl.enableVertexAttribArray(t);

      gl.uniform2f(gl.getUniformLocation(dynshad.prog,'off'),pl.hlen*directions[pl.dir].x,pl.hlen*directions[pl.dir].y);
      gl.uniform2f(gl.getUniformLocation(dynshad.prog,'scl'),(1/12)*(canvas.height/canvas.width),1/12);
      gl.uniform2i(gl.getUniformLocation(dynshad.prog,'spnum'),2,1);

      gl.uniform2f(gl.getUniformLocation(dynshad.prog,'lscl'),0.3,0.3);
      gl.uniform2f(gl.getUniformLocation(dynshad.prog,'uvoff'),0,0);
      gl.uniform1f(gl.getUniformLocation(dynshad.prog,'angle'),0);

      gl.drawArrays(gl.TRIANGLES,0,6);
      gl.bindBuffer(gl.ARRAY_BUFFER,null);
    }

    gl.useProgram(null);
  }


  if (pl.hp <= 0){
    pl = new player(pl.name,Math.max(pl.points-5,0));
  }
  for (let i=0 ; i < invdisp.length ; i++){
      if (i==invfocus){
        invdisp[i].style.zIndex = 102;
        invdisp[i].style.outlineColor = 'red';
      }else{

        if (i < 2){
          invdisp[i].style.zIndex = 101;
          invdisp[i].style.outlineColor = 'green';
        }else if (i<4){
          invdisp[i].style.zIndex = 101;
          invdisp[i].style.outlineColor = 'blue';
        }else{
          invdisp[i].style.zIndex = 100;
          invdisp[i].style.outlineColor = 'black';
        }
      }
      invdisp[i].src=itemgraphics[pl.items[i]];
  }

  hptext.innerHTML = "HP : "+Math.floor(pl.hp).toString()+" / 100";
  nametext.innerHTML = "Name : " + pl.name;
  pointtext.innerHTML = "Points : " + pl.points.toString();

  if (pl.team==null)
    teamtext.innerHTML = '';
  else
    teamtext.innerHTML = "Team : " + pl.team;

  if (cnewtime>0){
    cnewtime-=dt;
    chatelements[0].style.fontSize = (14+cnewtime*4).toString()+'px';
  }
  else chatelements[0].style.fontSize = '14px';


  {
    let t = [];
    for (let i in oplayers){
      t.push(oplayers[i]);
    }
    t.sort(function(a,b){return a.points-b.points;});
    for (let i = 0 ; i < 5 ; i++){
      let s;
      if (i < t.length){
        s = t[i].name ;
        if (t[i].team!=null) s+= " ("+t[i].team+")";
        s+=": " + t[i].points.toString();
      }else{
        s="";
      }
      boardelements[i].innerHTML=s;



    }

  }

  pl.swanim-=dt;
  if (pl.swanim < -0.1)pl.swanim=-1;

  pl.stun-=dt;
  if (pl.stun < 0.0)pl.stun=-1;

  let v:vec = new vec(0,0);
  if (pl.hlen < 0.1){
    if (pl.swanim < 0.0 && pl.stun < 1.2){
    if (isMobile){
      for (let i = 0 ; i < ongoingTouches.length ; i += 1){
  			if (ongoingTouches[i].pageX<canvas.width/2){
          v = v.add(new vec(ongoingTouches[i].pageX-canvas.width/4,-(ongoingTouches[i].pageY-canvas.height/2)));

        }
      }
    }else{
      if (keys.up)
        v.y++;
      if (keys.down)
        v.y--;
      if (keys.left)
        v.x--;
      if (keys.right)
        v.x++;
      if (keys.main&&!pkeys.main){
        switch (pl.items[0]){
          case 1:
            pl.hlen=0.5;
            break;
          case 2:
            if (pl.swanim < -0.1)
              sword(5);
            break;
          case 3:
            if (pl.swanim < -0.1)
              sword(10);
            break;
          case 4:
            if (pl.swanim < -0.1)
              sword(20);
            break;
          case 5:
            if (pl.swanim < -0.1)
              sword(35);
            break;
          case 6:
            if (pl.swanim < -0.1)
              sword(50);
            break;

        }
      }
      if (keys.off&&!pkeys.off){
        switch (pl.items[1]){
          case 1:
            pl.hlen=0.5;
            break;
          case 2:
            if (pl.swanim < -0.1)
              sword(5);
            break;
          case 3:
            if (pl.swanim < -0.1)
              sword(10);
            break;
          case 4:
            if (pl.swanim < -0.1)
              sword(20);
            break;
          case 5:
            if (pl.swanim < -0.1)
              sword(35);
            break;
          case 6:
            if (pl.swanim < -0.1)
              sword(50);
            break;

        }

      }
    }
    if (v.lensq() > 0.1){
      v = v.norm();
      if (v.dot(directions[2]) >  v.dot(directions[0])-0.01 && v.dot(directions[2]) >  v.dot(directions[1])-0.01 && v.dot(directions[2]) >  v.dot(directions[3])-0.01)
        pl.dir=2;
      if (v.dot(directions[3]) >  v.dot(directions[0])-0.01 && v.dot(directions[3]) >  v.dot(directions[1])-0.01 && v.dot(directions[3]) >  v.dot(directions[2])-0.01)
        pl.dir=3;
      if (v.dot(directions[0]) >  v.dot(directions[1])-0.01 && v.dot(directions[0]) >  v.dot(directions[2])-0.01 && v.dot(directions[0]) >  v.dot(directions[3])-0.01)
        pl.dir=0;
      if (v.dot(directions[1]) >  v.dot(directions[0])-0.01 && v.dot(directions[1]) >  v.dot(directions[2])-0.01 && v.dot(directions[1]) >  v.dot(directions[3])-0.01)
        pl.dir=1;


      v = v.smul(dt*8*pl.checkspd());
    }
    if (gmst.level.g(Math.floor(pl.pos.x),Math.floor(pl.pos.y))==0){
      pl.hp=-1;
    }
    let t:boolean = false;
    for (let i in pl.items)
      if (pl.items[i]==0)
        t = true;

    if (t)
      for (let c in gmst.chests){
        if (gmst.chests[c].id >0){
          if (Math.floor(pl.pos.x)==gmst.chests[c].pos.x && Math.floor(pl.pos.y) == gmst.chests[c].pos.y ){
            socket.emit('ch',{'id':c,'v':gmst.chests[c].id},socket.id);
            gmst.chests[c].id=-gmst.chests[c].id;
          }
        }
      }
  }
  }else{
    let p = pl.pos.add(directions[pl.dir].smul(pl.hlen));
    if (gmst.level.g(Math.floor(p.x),Math.floor(p.y))<0){
      v.x=directions[pl.dir].x*15*dt;v.y=directions[pl.dir].y*15*dt;
      pl.hlen-=dt*15;
    }else{
      let steps:number = Math.ceil(dt*40+0.1);
      for (let i:number = 0 ; i < steps; i++){
        pl.hlen+=30*(dt/steps);
        p=pl.pos.add(directions[pl.dir].smul(pl.hlen));
        if (gmst.level.g(Math.floor(p.x),Math.floor(p.y))<0){
          break;
        }

      }
    }
    if (pl.hlen > 10)
      pl.hlen=0;



  }



  let steps:number = Math.ceil(v.len()*2.0+0.1);
  let va:vec = v.sdiv(steps);
  let b:boolean = false;
  for (let i:number = 0 ; i < steps ; i++){
    pl.pos=pl.pos.add(va);

    if (gmst.level.g(Math.floor(pl.pos.x-0.495),Math.floor(pl.pos.y))<0){
      pl.pos.x = Math.floor(pl.pos.x)+0.505;
      b=true;
    }
    if (gmst.level.g(Math.floor(pl.pos.x+0.495),Math.floor(pl.pos.y))<0){
      pl.pos.x = Math.floor(pl.pos.x)+0.495;
      b=true;
    }
    if (gmst.level.g(Math.floor(pl.pos.x),Math.floor(pl.pos.y+0.495))<0){
      pl.pos.y = Math.floor(pl.pos.y)+0.495;
      b=true;
    }
    if (gmst.level.g(Math.floor(pl.pos.x),Math.floor(pl.pos.y-0.495))<0){
      pl.pos.y = Math.floor(pl.pos.y)+0.505;
      b=true;
    }

    if (gmst.level.g(Math.floor(pl.pos.x-0.495),Math.floor(pl.pos.y-0.495))<0){
      if (Math.abs(pl.pos.y-(Math.floor(pl.pos.y)+0.5)) < Math.abs(pl.pos.x-(Math.floor(pl.pos.x)+0.5)) )
        pl.pos.y = Math.floor(pl.pos.y)+0.505;
      else
        pl.pos.x = Math.floor(pl.pos.x)+0.505;
      b=true;
    }
    if (gmst.level.g(Math.floor(pl.pos.x+0.495),Math.floor(pl.pos.y-0.495))<0){
      if (Math.abs(pl.pos.y-(Math.floor(pl.pos.y)+0.5)) < Math.abs(pl.pos.x-(Math.floor(pl.pos.x)+0.5)) )
        pl.pos.y = Math.floor(pl.pos.y)+0.505;
      else
        pl.pos.x = Math.floor(pl.pos.x)+0.495;
      b=true;
    }
    if (gmst.level.g(Math.floor(pl.pos.x-0.495),Math.floor(pl.pos.y+0.495))<0){
      if (Math.abs(pl.pos.y-(Math.floor(pl.pos.y)+0.5)) < Math.abs(pl.pos.x-(Math.floor(pl.pos.x)+0.5)) )
        pl.pos.y = Math.floor(pl.pos.y)+0.495;
      else
        pl.pos.x = Math.floor(pl.pos.x)+0.505;
      b=true;
    }
    if (gmst.level.g(Math.floor(pl.pos.x+0.495),Math.floor(pl.pos.y+0.495))<0){
      if (Math.abs(pl.pos.y-(Math.floor(pl.pos.y)+0.5)) < Math.abs(pl.pos.x-(Math.floor(pl.pos.x)+0.5)) )
        pl.pos.y = Math.floor(pl.pos.y)+0.495;
      else
        pl.pos.x = Math.floor(pl.pos.x)+0.495;
      b=true;
    }

    if (gmst.level.g(Math.floor(pl.pos.x),Math.floor(pl.pos.y))<0){
      pl.pos.y+=0.5;
    }

  }
  if (b){
    pl.hlen = 0;
  }



  pkeys=Object.assign({}, keys);;
  lastUpdateTime=currentTime;



  requestAnimationFrame(updatefunc);
}requestAnimationFrame(updatefunc);
