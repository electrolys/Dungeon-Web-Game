var socket = io();


// Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileAjaxSync(filePath, mimeType)
{
  var xmlhttp=new XMLHttpRequest();
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
  var json = loadTextFileAjaxSync(filePath, "application/json");
  // Parse json
  return JSON.parse(json);
}


var keysdown = {
  up: false,
  down: false,
  left: false,
  right: false,
  switch: false,
  pup: false,
  pdown: false,
  pleft: false,
  pright: false,
  pswitch: false
}
var mee = {
    x  : 0.0,
    y  : 0.0,
    xv : 0.0,
    yv : 0.0,
	hp : 100.0,
    mxhp : 100.0,
	dir : false,
	score : 0,
	name : "loading...",
	anim : 0,
	char : 0
}

function intersectRect(r1, r2) {
  return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}




//function collidepl(pl,pl2){
//    collide(pl,{top:pl2.y-0.5,bottom:pl2.y+0.5,right:pl2.x+0.5,left:pl2.x-0.5})
//}

var isMobile = !!(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
var ongoingTouches = [];
var canvas = document.getElementById('canvas');




if (isMobile){
	function handleStart(e) {ongoingTouches = e.touches;}
	function handleEnd(e)   {ongoingTouches = e.touches;}
	function handleCancel(e){ongoingTouches = e.touches;}
	function handleMove(e)  {ongoingTouches = e.touches;}
	canvas.addEventListener("touchstart", handleStart, false);
	canvas.addEventListener("touchend", handleEnd, false);
	canvas.addEventListener("touchcancel", handleCancel, false);
	canvas.addEventListener("touchmove", handleMove, false);
}
else{
	document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
    case 37: // <-

		if (!event.repeat)
		keysdown.left = true;
		break;
	case 38:
        if (!event.repeat)
		keysdown.up = true;
        break;
    case 39: // ->

		if (!event.repeat)
		keysdown.right = true;
      break;
    case 40: // ->

		if (!event.repeat)
		keysdown.down = true;
      break;
    case 90: // X
      if (!event.repeat)
		keysdown.use = true;
      break;
    case 32:// X
      if (!event.repeat)
		keysdown.use = true;
      break;
	case 88:
		if (!event.repeat)
		keysdown.switch = true;
		break;
	}
	});
	document.addEventListener('keyup', function(event) {
	  switch (event.keyCode) {
      case 37:
            if (!event.repeat)
			keysdown.left = false;
            break;
	  case 38:
            if (!event.repeat)
			keysdown.up = false;
            break;
      case 39:
            if (!event.repeat)
			keysdown.right = false;
            break;
      case 40:
            if (!event.repeat)
			keysdown.down = false;
            break;
      case 90:
            if (!event.repeat)
			keysdown.use = false;
            break;
      case 32:
            if (!event.repeat)
			keysdown.use = false;
            break;
	  case 88:
			if (!event.repeat)
			keysdown.switch = false;
			break;
	  }
	});
}

socket.emit('n');


socket.on('score', function(id) {
	if (id == socket.id)
		mee.score+=1;
}
)
socket.on('kick', function(id) {
	if (id == mee.name){
		window.close();
	}
}
)



setInterval(function() {
    socket.emit('u', mee);
}, 1000 / 30);






canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

var cplayers;
socket.on('s', function(players) {
    cplayers = players;
	for (var id in cplayers) {
        if (id != socket.id){
			var player = cplayers[id] || {};
			for (var i = 0; i < player.pjs.length; i++) {
				if (intersectRect({top:mee.y-0.5,bottom:mee.y+0.5,right:mee.x+0.5,left:mee.x-0.5},
					{top:player.pjs[i].y-player.pjs[i].height,bottom:player.pjs[i].y+player.pjs[i].height,right:player.pjs[i].x+player.pjs[i].width,left:player.pjs[i].x-player.pjs[i].width})){
					if (hit <= 0.0){
						mee.hp-=player.pjs[i].atk;
						hit = 0.3;
						if (mee.hp <= 0.0){
							socket.emit('d',id);
						}
					}
				}
			}
		}
	}
});

var plsize =0;

var characters = [
	new Image(),
	new Image(),
	new Image(),
	new Image(),
	new Image(),
	new Image(),
	new Image(),
	new Image(),
	new Image(),
	new Image(),
	new Image(),
	new Image(),
    new Image(),
	new Image(),
	new Image(),
    new Image(),
	new Image(),
	new Image(),
	new Image()
];


characters[0].src = 'static/img/man1.png';
characters[1].src = 'static/img/man2.png';
characters[2].src = 'static/img/man3.png';

characters[3].src = 'static/img/girl1.png'
characters[4].src = 'static/img/girl2.png'

characters[5].src = 'static/img/bike.png';
characters[6].src = 'static/img/bike2.png';

characters[7].src = 'static/img/bot.png';
characters[8].src = 'static/img/pinkbot.png';

characters[9].src = 'static/img/dog.png'
characters[10].src = 'static/img/technopig.png'
characters[11].src = 'static/img/dreamy.png'
characters[12].src = 'static/img/annoyingdog.png'

characters[13].src = 'static/img/duane.png'
characters[14].src = 'static/img/leenk.png'
characters[15].src = 'static/img/markio.png'
characters[16].src = 'static/img/looogi.png'
characters[17].src = 'static/img/MRLoogi.png'
characters[18].src = 'static/img/kirbo.png'

var spsize;
spsize = 64;

var cool = 0.0;

var chat = ["","","","",""];

socket.on('c', function(message) {
   for (var i = 4 ; i > 0 ; i --)
   {
   		chat[i]=chat[i-1]
   } 
   chat[0]=message;
});

var gcol = function(rect){
	if (rect)
		return "rgb("+rect["colr"].toString()+","+rect["colg"].toString()+","+rect["colb"].toString()+")";
	else 
		return "blue";
}

setInterval(function() {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (isMobile)
    plsize = canvas.height/16;
    else
    plsize = canvas.height/24;
    var trectangle = {top:(-canvas.height/2/plsize+mee.y)-0.3,bottom:(canvas.height/2/plsize+mee.y)+0.3,left:(-canvas.width/2/plsize+mee.x)-0.3,right:(canvas.width/2/plsize+mee.x)+0.3};

	



	context.drawImage(characters[mee.char],0,mee.anim*spsize,spsize,spsize,(canvas.width/2)-plsize/2,(canvas.height/2)-plsize/2,plsize,plsize);

	var tpls = 0;

	for (var id in cplayers) {
        tpls++;
		if (id != socket.id){
			var player = cplayers[id] || {};
			
            //context.fillStyle = 'red';
            //context.beginPath();
            //context.rect(((player.x-mee.x)*plsize+canvas.width/2)-plsize/2,((player.y-mee.y)*plsize+canvas.height/2)-plsize/2,plsize,plsize);
            //context.fill();
			context.fillStyle = 'red';
			context.font = "16px Verdana";
			context.fillText(Math.floor(player.hp)+"/"+Math.floor(player.mxhp), ((player.x-mee.x)*plsize+canvas.width/2)-plsize/2,((player.y-mee.y)*plsize+canvas.height/2)-plsize/2);
			context.fillStyle = 'rgb(255, 153, 0)';
			context.font = "16px Verdana";
			context.fillText(player.score, ((player.x-mee.x)*plsize+canvas.width/2)-plsize/2,(((player.y-mee.y)*plsize-15)+canvas.height/2)-plsize/2);
			context.fillStyle = 'black';
			context.font = "16px Verdana";
			context.fillText(player.name, ((player.x-mee.x)*plsize+canvas.width/2)-plsize/2,(((player.y-mee.y)*plsize-30)+canvas.height/2)-plsize/2);
			if (intersectRect(trectangle,{top:player.y-0.5,bottom:player.y+0.5,right:player.x+0.5,left:player.x-0.5})){
				context.drawImage(characters[player.char],0,player.anim*spsize,spsize,spsize,((player.x-mee.x)*plsize+canvas.width/2)-plsize/2,((player.y-mee.y)*plsize+canvas.height/2)-plsize/2,plsize,plsize);
			}else
				{
					var num = Math.min(Math.max(0.1*Math.sqrt((player.x-mee.x)*(player.x-mee.x)+(player.y-mee.y)*(player.y-mee.y)),1),8);
					context.fillStyle = 'white';
					context.beginPath();
					context.arc(Math.max(Math.min(((player.x-mee.x)*plsize+canvas.width/2),canvas.width),0),Math.max(Math.min(((player.y-mee.y)*plsize+canvas.height/2),canvas.height),0), plsize/(0.4*num), 0, 2 * Math.PI);
					context.fill();
					context.fillStyle = 'red';
					context.beginPath();
					context.arc(Math.max(Math.min(((player.x-mee.x)*plsize+canvas.width/2),canvas.width),0),Math.max(Math.min(((player.y-mee.y)*plsize+canvas.height/2),canvas.height),0), plsize/(0.7*num), 0, 2 * Math.PI);
					context.fill();

				}
        }else {
        	var player = cplayers[id] || {};
        	
        }
    }


//	var count = 0;
//	for (var i = 0 ; i < itemtypes.length ; i++)
//		if (itemtypes[i].stk)
//			count+=1;
//	context.fillStyle = 'rgba(125, 125, 125,0.5)';
//    context.beginPath();
//    context.rect( 4,0,16*16,count*16+8);
//    context.fill();

    context.font = "16px Verdana";
	context.fillStyle = 'rgba(125, 125, 125,0.5)';
    context.beginPath();
    context.rect( canvas.width-Math.max(context.measureText("<"+mee.name+">        ").width,context.measureText("<"+"            "+">        ").width),0,Math.max(context.measureText("<"+mee.name+">       ").width,context.measureText("<"+"            "+">       ").width ) , 4*16+8);
    context.fill();

	//context.fillStyle = 'blue';
    //context.beginPath();
    //context.rect((canvas.width/2)-plsize/2,(canvas.height/2)-plsize/2,plsize,plsize);
    //context.fill();


	var temppl = [];
	for (var id in cplayers)
		temppl.push(cplayers[id]);
	temppl.sort(function(a,b){return b.score-a.score;})

	context.fillStyle = 'blue';
	context.font = "16px Verdana";
	context.fillText("CD:"+Math.max(Math.floor(cool*10),0), (canvas.width)-context.measureText("CD:"+Math.max(Math.floor(cool*10),0)+"  ").width,64);
	context.fillStyle = 'red';
	context.font = "16px Verdana";
	context.fillText("HP:"+Math.floor(mee.hp)+"/"+Math.floor(mee.mxhp), (canvas.width)-context.measureText("HP:"+Math.floor(mee.hp)+"/"+Math.floor(mee.mxhp)+"  ").width,48);
	context.fillStyle = 'rgba(255, 153, 0,255)';
	context.font = "16px Verdana";
	context.fillText("score:"+mee.score, (canvas.width)-context.measureText("score:"+mee.score+"  ").width,32);
	context.fillStyle = 'black';
	context.font = "16px Verdana";
	context.fillText("<"+mee.name+">", (canvas.width)-context.measureText("<"+mee.name+">  ").width,16);
	context.fillStyle = 'rgba(0,0,0,0.6)';
	context.fillText("online:"+tpls, 8,canvas.height-16);
	context.fillText(chat[0], 8,canvas.height-68);
	context.fillText(chat[1], 8,canvas.height-84);
	context.fillText(chat[2], 8,canvas.height-100);
	context.fillText(chat[3], 8,canvas.height-116);
	context.fillText(chat[4], 8,canvas.height-132);
	context.fillStyle = 'rgba(0,0,0,0.6)';
	if (temppl[0])
	context.fillText("1st [ "+temppl[0].name+":"+temppl[0].score+" ]", (canvas.width)-context.measureText("1st [ "+temppl[0].name+":"+temppl[0].score+" ]  ").width,canvas.height-48);
	if (temppl[1])
	context.fillText("2nd [ "+temppl[1].name+":"+temppl[1].score+" ]", (canvas.width)-context.measureText("2nd [ "+temppl[1].name+":"+temppl[1].score+" ]  ").width,canvas.height-32);
	if (temppl[2])
	context.fillText("3rd [ "+temppl[2].name+":"+temppl[2].score+" ]", (canvas.width)-context.measureText("3rd [ "+temppl[2].name+":"+temppl[2].score+" ]  ").width,canvas.height-16);

//	context.fillStyle = 'black';
//	var index = 0;
//	for (var i = 0 ; i < itemtypes.length ; i++){
//        var lvl = itemlvls(itemtypes[i]);
//        var prefix = "";    
//        if (lvl != 1){
//            prefix = lvlnames[(4-itemtypes[i].upamnt)+lvl-1];
//        }
//            
//	
//        if (i == sitm){
//			if (itemtypes[i].stk){
//				context.fillText(">"+prefix+itemtypes[i].name+((itemtypes[i].stk>1)?":"+itemtypes[i].stk:"")+"<", 8,16+index*16);
//				index+=1;
//			}
//		}
//		else
//			if (itemtypes[i].stk){
//
//				context.fillText(prefix+itemtypes[i].name+((itemtypes[i].stk>1)?":"+itemtypes[i].stk:""), 8,16+index*16);
//				index+=1;
//			}
//	}

	if (isMobile){
		context.fillStyle = 'black';
		context.font = "80px Verdana";
		context.fillText("<", 0,canvas.height-80);
		context.fillStyle = 'black';
		context.font = "80px Verdana";
		context.fillText(">", 80,canvas.height-80);
		context.fillStyle = 'black';
		context.font = "80px Verdana";
		context.fillText("C", canvas.width-240,canvas.height-80);
		context.fillStyle = 'black';
		context.font = "80px Verdana";
		context.fillText("X", canvas.width-160,canvas.height-80);
		context.fillStyle = 'black';
		context.font = "80px Verdana";
		context.fillText("Z", canvas.width-80,canvas.height-80);
	}

}, 1000/60);

//var sfoot = new Audio('static/sound/foot.mp3');
//var spunch = new Audio('static/sound/punch.mp3');
//var sjump = new Audio('static/sound/jump.mp3');
//var sslide = new Audio('static/sound/slide.mp3');
//sfoot.volume = 0.4;
//spunch.volume = 0.2;
//sjump.volume = 0.2;
//sslide.volume = 0.2;



var startgame = false;



var lastUpdateTime = performance.now();

var animspd = 0;
var animtime = 0.1;
var punchanim = -0.1;
//var knx = 0;
//var kny = 0;


//var pslide = false;
//var djump = false;
//sslide.loop = true;
function checkFlag() {
    if(startgame == false) {
       window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
    } else {
    document.getElementById('startbutton').remove();
    lastUpdateTime = performance.now();
      setInterval(function() {
  mee.score = Math.max(0,mee.score);
  mee.hp = Math.min(mee.mxhp,mee.hp);

//  if ((((jump.left&& mee.dir) || (jump.right&& !mee.dir))&&mee.yv>0.1) && !pslide){
//    if (!isMobile)
//    sslide.play();
//
//  }
//  if ((!(((jump.left&& mee.dir) || (jump.right&& !mee.dir))&&mee.yv>0.1))&&pslide){
//    if (!isMobile)
//    sslide.pause();
//  }
//  pslide = ((jump.left&& mee.dir) || (jump.right&& !mee.dir))&&mee.yv>0.1;
	var currentTime = performance.now();
    var dt = (currentTime - lastUpdateTime)/1000.0;
	animtime+=dt;
	punchanim-=dt;

//	if (animtime>(1.0/animspd)){
//		if (mee.anim == 0)
//			mee.anim = 2;
//		else if (mee.anim == 2)
//			mee.anim = 0;
//		if (mee.anim == 1)
//			mee.anim = 3;
//		else if (mee.anim == 3)
//			mee.anim = 1;
//
//		if (mee.anim == 10){
//			mee.anim = 12;
//
//        }
//		else if (mee.anim == 12)
//			mee.anim = 10;
//
//		if (mee.anim == 11){
//			mee.anim = 13;
//        }
//		else if (mee.anim == 13)
//			mee.anim = 11;
//		animtime = 0;
//	}

	if (mee.hp <= 0)
		{
			mee = {
				x  : 0.0,
				y  : 0.0,
				xv : 0.0,
				yv : 0.0,
				hp : 100.0,
                mxhp : 100.0,
				dir : false,
				score : mee.score-5,
				name : mee.name,
				anim : 0,
				char : mee.char
			};
			itemtypes[0].stk=1;
			for (var i = 1 ; i < itemtypes.length ; i++){
				itemtypes[i].stk = 0;
                for (var j = 0 ; j < itemtypes[i].upamnt ; j++)
                    itemtypes[i].upgrades[j] = false;
			}
			sitm = 0;
		}

    const spd = 10;
	cool-=dt;

	if (isMobile){
		keysdown.up     = false;
		keysdown.left   = false;
		keysdown.right  = false;
        keysdown.down  = false;
		keysdown.use    = false;
		keysdown.switch = false;
		for (var i = 0 ; i < ongoingTouches.length ; i += 1){
			if (ongoingTouches[i].pageX<80)
				keysdown.left = true;
			else if (ongoingTouches[i].pageX<160){
				keysdown.up = true;
			}
            else if (ongoingTouches[i].pageX<240){
				keysdown.down = true;
			}
            else if (ongoingTouches[i].pageX<320){
				keysdown.right = true;
			}
			else if (ongoingTouches[i].pageX<canvas.width-80){
				keysdown.switch = true;
			}
			else{
				keysdown.use = true;
			}
		}
	}
    

    {
        var x = 0.0;
        var y = 0.0;
        if (keysdown.right)
            x+=1.0;
        if (keysdown.left)
            x-=1.0;
        if (keysdown.up)
            y-=1.0;
        if (keysdown.down)
            y+=1.0;

        var d = Math.sqrt(x*x+y*y);
        if (d > 0.1){
            x = x/d;
            y = y/d;
            mee.x+=x*dt;
            mee.y+=y*dt;
        }
        

    }

	keysdown.pup = keysdown.up;
	keysdown.pleft = keysdown.left;
	keysdown.pright = keysdown.right;
    keysdown.pdown = keysdown.down;
	keysdown.puse = keysdown.use;
	keysdown.pswitch = keysdown.switch;



    var steps = Math.floor(Math.sqrt(mee.xv*dt*mee.xv*dt+mee.yv*dt*mee.yv*dt)*8.0)+1;
    var altdt = dt/steps;
    //console.log(1.0/dt);
    
    
    for (var it = 0; it < steps; it++) {
        //for (var id in cplayers) {
        //    if (id != socket.id){
        //        collidepl(mee,cplayers[id]);
        //    }
        //}
        
        var plrect = {top:mee.y-0.5,bottom:mee.y+0.5,right:mee.x+0.5,left:mee.x-0.5};
		if (Math.abs(mee.xv) > 0.001)
            mee.x += mee.xv*altdt;
        if (Math.abs(mee.yv) > 0.001)
            mee.y += mee.yv*altdt;
        
        
		
        
	
    }
    
    //for (var id in cplayers) {
    //    if (id != socket.id){
    //        collidepl(mee,cplayers[id]);
    //    }
    //}
    

    const f = 3;
	


	if (punchanim>0.0){
		if (mee.dir){
			mee.anim=14;
		}else{
			mee.anim=15;
		}
	}


    lastUpdateTime = currentTime;

}, 1000/60);
    }
}

checkFlag();
