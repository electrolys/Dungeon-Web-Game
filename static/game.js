var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var socket = io();
function loadtxt(filePath, mimeType) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    if (mimeType != null) {
        if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType(mimeType);
        }
    }
    xmlhttp.send();
    if (xmlhttp.status == 200) {
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
var vec = /** @class */ (function () {
    function vec(x, y) {
        this.x = x;
        this.y = y;
    }
    vec.prototype.add = function (t) {
        return new vec(this.x + t.x, this.y + t.y);
    };
    vec.prototype.sub = function (t) {
        return new vec(this.x - t.x, this.y - t.y);
    };
    vec.prototype.mul = function (t) {
        return new vec(this.x * t.x, this.y * t.y);
    };
    vec.prototype.div = function (t) {
        return new vec(this.x / t.x, this.y / t.y);
    };
    vec.prototype.smul = function (t) {
        return new vec(this.x * t, this.y * t);
    };
    vec.prototype.sdiv = function (t) {
        return new vec(this.x / t, this.y / t);
    };
    vec.prototype.lensq = function () {
        return this.x * this.x + this.y * this.y;
    };
    vec.prototype.len = function () {
        return Math.sqrt(this.lensq());
    };
    vec.prototype.dot = function (t) {
        return t.x * this.x + t.y * this.y;
    };
    vec.prototype.norm = function () {
        return this.sdiv(this.len());
    };
    return vec;
}());
var sarray = /** @class */ (function (_super) {
    __extends(sarray, _super);
    function sarray(length) {
        return _super.call(this, length) || this;
    }
    return sarray;
}(Array));
var array2d = /** @class */ (function () {
    function array2d(sz) {
        this.sz = sz;
        this.data = new sarray(sz * sz);
    }
    array2d.prototype.g = function (i, j) { return this.data[i + j * this.sz]; };
    array2d.prototype.s = function (i, j, v) { this.data[i + j * this.sz] = v; };
    return array2d;
}());
var canvas = document.getElementById('canvas');
var gl = canvas.getContext('experimental-webgl', { preserveDrawingBuffer: false });
function loadTexture(url) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    var level = 0;
    var internalFormat = gl.RGBA;
    var width = 1;
    var height = 1;
    var border = 0;
    var srcFormat = gl.RGBA;
    var srcType = gl.UNSIGNED_BYTE;
    var pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
    var image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    };
    image.src = url;
    return texture;
}
// var context:any = canvas.getContext('2d');
var directions = [new vec(0, 1), new vec(0, -1), new vec(-1, 0), new vec(1, 0)];
var dangles = [0, Math.PI, Math.PI * 0.5, Math.PI * 1.5];
var player = /** @class */ (function () {
    function player(name, points, team) {
        if (name === void 0) { name = "loading..."; }
        if (points === void 0) { points = 0; }
        if (team === void 0) { team = null; }
        this.pos = new vec(10, 980);
        this.cam = new vec(10, 980);
        this.hp = 100;
        // this.items=[1,0,0,13,
        //             12,11,10,9,
        //             1,6,7,8,
        //             5,2,3,4];
        this.items = [0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0];
        this.dir = 0;
        this.hlen = 0;
        this.hlens = 0;
        this.name = name;
        this.maini = 0;
        this.offi = 1;
        this.swanim = -1;
        this.stun = -1;
        this.outfit = 0;
        this.points = points;
        this.team = team;
    }
    player.prototype.checkdef = function () {
        var t = 1;
        switch (this.items[2]) {
            case 7:
                t += 0.6;
                break;
            case 8:
                t += 1.0;
                break;
            case 9:
                t += 1.5;
                break;
        }
        switch (this.items[3]) {
            case 7:
                t += 0.6;
                break;
            case 8:
                t += 1.0;
                break;
            case 9:
                t += 1.5;
                break;
        }
        return t;
    };
    player.prototype.checkspd = function () {
        var t = 1;
        switch (this.items[2]) {
            case 10:
                t += 0.2;
                break;
            case 11:
                t += 0.4;
                break;
        }
        switch (this.items[3]) {
            case 10:
                t += 0.2;
                break;
            case 11:
                t += 0.4;
                break;
        }
        return t;
    };
    player.prototype.checkreg = function () {
        var t = 0;
        switch (this.items[2]) {
            case 12:
                t += 1;
                break;
            case 13:
                t += 3;
                break;
        }
        switch (this.items[3]) {
            case 12:
                t += 1;
                break;
            case 13:
                t += 3;
                break;
        }
        return t;
    };
    return player;
}());
var pl = new player(prompt("Controls:\nWASD/Arrows - Move\nShift/Z - use left green slot item\nSpace/X - use right green slot item\nBlue slots are for passive items\n(armor,shoes,hats)\n\nEnter a name:", ""));
if (pl.name == "") {
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            pl.name = "I have no name :(";
            break;
        case 1:
            pl.name = "A person that didn't input a name";
            break;
        case 2:
            pl.name = "My mind is blank";
            break;
        default:
            pl.name = "Hmmm this name should've been impossible to get randomly";
            break;
    }
}
var vertbuf = /** @class */ (function () {
    function vertbuf() {
    }
    return vertbuf;
}());
var chest = /** @class */ (function () {
    function chest(pos, id) {
        this.pos = pos;
        this.id = id;
    }
    return chest;
}());
var shad = /** @class */ (function () {
    function shad(v, f) {
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, loadtxt(v, 'text/plain'));
        gl.compileShader(vertShader);
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, loadtxt(f, 'text/plain'));
        gl.compileShader(fragShader);
        this.prog = gl.createProgram();
        gl.attachShader(this.prog, vertShader);
        gl.attachShader(this.prog, fragShader);
        gl.linkProgram(this.prog);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        gl.detachShader(this.prog, vertShader);
        gl.detachShader(this.prog, fragShader);
    }
    return shad;
}());
var gamestate = /** @class */ (function () {
    function gamestate() {
        this.level = new array2d(1002);
        this.chunks = new array2d(50);
        var js = loadJSON("static/level.json");
        var inc = 0;
        for (var i_1 = 0; i_1 < 1002; i_1++)
            for (var j = 0; j < 1002; j++) {
                this.level.s(i_1, j, -1);
            }
        for (var i_2 = 1; i_2 < 1001; i_2++) {
            for (var j = 1; j < 1001; j++) {
                this.level.s(i_2, j, js["tiles"][inc]);
                inc++;
            }
        }
        for (var i_3 = 0; i_3 < 50; i_3++)
            for (var j = 0; j < 50; j++) {
                this.chunks.s(i_3, j, new vertbuf);
                this.chunks.g(i_3, j).vbo = gl.createBuffer();
                //this.vao=gl.createVertexArray();
                //gl.bindVertexArray(this.vao);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.chunks.g(i_3, j).vbo);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0]), gl.STATIC_DRAW);
                this.chunks.g(i_3, j).vsize = 0;
            }
        // gl.vertexAttribPointer(0, 2, gl.FLOAT, false, sizeof(1.1)*4, sizeof(1.1)*0);
        // gl.enableVertexAttribArray(0);
        // gl.vertexAttribPointer(1, 2, gl.FLOAT, false, sizeof(1.1)*4, sizeof(1.1)*2);
        // gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.shader = new shad('static/world.vert', 'static/world.frag');
        this.tshader = new shad('static/world.vert', 'static/transparent.frag');
        this.update();
        this.tex = loadTexture('static/img/tiles.png');
        this.chesttex = loadTexture('static/img/chest.png');
        this.ochestvbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.ochestvbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1.01, 0.99, 1, 0, 1.99, 0.99, 0, 1, 1.01, 0.01, 1, 1, 1.99, 0.01, 1, 0, 1.99, 0.99, 0, 1, 1.01, 0.01]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.cchestvbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cchestvbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0.01, 0.99, 1, 0, 0.99, 0.99, 0, 1, 0.01, 0.01, 1, 1, 0.99, 0.01, 1, 0, 0.99, 0.99, 0, 1, 0.01, 0.01]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        for (var i_4 = 0; i_4 < js["hpaths"].length; i_4++)
            this.level.s(js["hpaths"][i_4]["x"] + 1, js["hpaths"][i_4]["y"], 1);
        this.chests = [];
        for (var i_5 = 0; i_5 < js["chests"].length; i_5++)
            this.chests.push(new chest(new vec(js["chests"][i_5]["x"] + 1, js["chests"][i_5]["y"]), js["chests"][i_5]["id"]));
    }
    gamestate.prototype.update = function () {
        for (var it = 0; it < 50; it++)
            for (var jt = 0; jt < 50; jt++) {
                var data = [];
                for (var i_6 = 1 + it * 20; i_6 < 1 + (it + 1) * 20; i_6++)
                    for (var j = 1 + jt * 20; j < 1 + (jt + 1) * 20; j++) {
                        var o = 5;
                        if (this.level.g(i_6, j) > 0)
                            o = 14;
                        else if (this.level.g(i_6, j) == 0) {
                            if (this.level.g(i_6 + 1, j) != 0 && this.level.g(i_6, j + 1) != 0 && this.level.g(i_6 - 1, j) != 0 && this.level.g(i_6, j - 1) != 0)
                                o = 5;
                            else if (this.level.g(i_6 + 1, j) != 0 && !(this.level.g(i_6 - 1, j) != 0 || ((this.level.g(i_6, j + 1) != 0) != (this.level.g(i_6, j - 1) != 0))))
                                o = 4;
                            else if (this.level.g(i_6 - 1, j) != 0 && !(this.level.g(i_6 + 1, j) != 0 || ((this.level.g(i_6, j + 1) != 0) != (this.level.g(i_6, j - 1) != 0))))
                                o = 3;
                            else if (this.level.g(i_6, j + 1) != 0 && !(this.level.g(i_6, j - 1) != 0 || ((this.level.g(i_6 + 1, j) != 0) != (this.level.g(i_6 - 1, j) != 0))))
                                o = 2;
                            else if (this.level.g(i_6, j - 1) != 0 && !(this.level.g(i_6, j + 1) != 0 || ((this.level.g(i_6 + 1, j) != 0) != (this.level.g(i_6 - 1, j) != 0))))
                                o = 1;
                            else if ((this.level.g(i_6, j - 1) != 0) == (this.level.g(i_6, j + 1) != 0) && (this.level.g(i_6 - 1, j) != 0) == (this.level.g(i_6 + 1, j) != 0) && (this.level.g(i_6, j - 1) != 0) != (this.level.g(i_6 - 1, j) != 0))
                                o = 0;
                            else if (this.level.g(i_6 + 1, j) != 0 || this.level.g(i_6 - 1, j) != 0 || this.level.g(i_6, j + 1) != 0 || this.level.g(i_6, j - 1) != 0) {
                                if (this.level.g(i_6 + 1, j) != 0 && this.level.g(i_6, j + 1) != 0 && !(this.level.g(i_6, j - 1) != 0 || this.level.g(i_6 - 1, j) != 0))
                                    o = 13;
                                else if (this.level.g(i_6 - 1, j) != 0 && this.level.g(i_6, j + 1) != 0 && !(this.level.g(i_6, j - 1) != 0 || this.level.g(i_6 + 1, j) != 0))
                                    o = 12;
                                else if (this.level.g(i_6 + 1, j) != 0 && this.level.g(i_6, j - 1) != 0 && !(this.level.g(i_6, j + 1) != 0 || this.level.g(i_6 - 1, j) != 0))
                                    o = 11;
                                else if (this.level.g(i_6 - 1, j) != 0 && this.level.g(i_6, j - 1) != 0 && !(this.level.g(i_6, j + 1) != 0 || this.level.g(i_6 + 1, j) != 0))
                                    o = 10;
                                else
                                    o = 5;
                            }
                            else if ((((this.level.g(i_6 + 1, j + 1) != 0) ? 1 : 0) + ((this.level.g(i_6 - 1, j + 1) != 0) ? 1 : 0) + ((this.level.g(i_6 + 1, j - 1) != 0) ? 1 : 0) + ((this.level.g(i_6 - 1, j - 1) != 0) ? 1 : 0)) > 1)
                                o = 5;
                            else if (this.level.g(i_6 + 1, j + 1) != 0)
                                o = 6;
                            else if (this.level.g(i_6 - 1, j + 1) != 0)
                                o = 7;
                            else if (this.level.g(i_6 + 1, j - 1) != 0)
                                o = 8;
                            else if (this.level.g(i_6 - 1, j - 1) != 0)
                                o = 9;
                            else
                                o = 0;
                        }
                        else if (this.level.g(i_6 + 1, j) >= 0 && this.level.g(i_6, j + 1) >= 0 && this.level.g(i_6 - 1, j) >= 0 && this.level.g(i_6, j - 1) >= 0)
                            o = 5;
                        else if (this.level.g(i_6 + 1, j) >= 0 && !(this.level.g(i_6 - 1, j) >= 0 || ((this.level.g(i_6, j + 1) >= 0) != (this.level.g(i_6, j - 1) >= 0))))
                            o = 4;
                        else if (this.level.g(i_6 - 1, j) >= 0 && !(this.level.g(i_6 + 1, j) >= 0 || ((this.level.g(i_6, j + 1) >= 0) != (this.level.g(i_6, j - 1) >= 0))))
                            o = 3;
                        else if (this.level.g(i_6, j + 1) >= 0 && !(this.level.g(i_6, j - 1) >= 0 || ((this.level.g(i_6 + 1, j) >= 0) != (this.level.g(i_6 - 1, j) >= 0))))
                            o = 2;
                        else if (this.level.g(i_6, j - 1) >= 0 && !(this.level.g(i_6, j + 1) >= 0 || ((this.level.g(i_6 + 1, j) >= 0) != (this.level.g(i_6 - 1, j) >= 0))))
                            o = 1;
                        else if ((this.level.g(i_6, j - 1) >= 0) == (this.level.g(i_6, j + 1) >= 0) && (this.level.g(i_6 - 1, j) >= 0) == (this.level.g(i_6 + 1, j) >= 0) && (this.level.g(i_6, j - 1) >= 0) != (this.level.g(i_6 - 1, j) >= 0))
                            o = 0;
                        else if (this.level.g(i_6 + 1, j) >= 0 || this.level.g(i_6 - 1, j) >= 0 || this.level.g(i_6, j + 1) >= 0 || this.level.g(i_6, j - 1) >= 0) {
                            if (this.level.g(i_6 + 1, j) >= 0 && this.level.g(i_6, j + 1) >= 0 && !(this.level.g(i_6, j - 1) >= 0 || this.level.g(i_6 - 1, j) >= 0))
                                o = 13;
                            else if (this.level.g(i_6 - 1, j) >= 0 && this.level.g(i_6, j + 1) >= 0 && !(this.level.g(i_6, j - 1) >= 0 || this.level.g(i_6 + 1, j) >= 0))
                                o = 12;
                            else if (this.level.g(i_6 + 1, j) >= 0 && this.level.g(i_6, j - 1) >= 0 && !(this.level.g(i_6, j + 1) >= 0 || this.level.g(i_6 - 1, j) >= 0))
                                o = 11;
                            else if (this.level.g(i_6 - 1, j) >= 0 && this.level.g(i_6, j - 1) >= 0 && !(this.level.g(i_6, j + 1) >= 0 || this.level.g(i_6 + 1, j) >= 0))
                                o = 10;
                            else
                                o = 5;
                        }
                        else if ((((this.level.g(i_6 + 1, j + 1) >= 0) ? 1 : 0) + ((this.level.g(i_6 - 1, j + 1) >= 0) ? 1 : 0) + ((this.level.g(i_6 + 1, j - 1) >= 0) ? 1 : 0) + ((this.level.g(i_6 - 1, j - 1) >= 0) ? 1 : 0)) > 1)
                            o = 5;
                        else if (this.level.g(i_6 + 1, j + 1) >= 0)
                            o = 6;
                        else if (this.level.g(i_6 - 1, j + 1) >= 0)
                            o = 7;
                        else if (this.level.g(i_6 + 1, j - 1) >= 0)
                            o = 8;
                        else if (this.level.g(i_6 - 1, j - 1) >= 0)
                            o = 9;
                        else
                            o = 0;
                        var id = Math.abs(this.level.g(i_6, j));
                        data.push(i_6);
                        data.push(j);
                        data.push(o + 0.01);
                        data.push(id + 0.01);
                        data.push(i_6);
                        data.push(j + 1);
                        data.push(o + 0.01);
                        data.push(id + 0.99);
                        data.push(i_6 + 1);
                        data.push(j);
                        data.push(o + 0.99);
                        data.push(id + 0.01);
                        data.push(i_6 + 1);
                        data.push(j + 1);
                        data.push(o + 0.99);
                        data.push(id + 0.99);
                        data.push(i_6 + 1);
                        data.push(j);
                        data.push(o + 0.99);
                        data.push(id + 0.01);
                        data.push(i_6);
                        data.push(j + 1);
                        data.push(o + 0.01);
                        data.push(id + 0.99);
                    }
                gl.bindBuffer(gl.ARRAY_BUFFER, this.chunks.g(it, jt).vbo);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
                this.chunks.g(it, jt).vsize = data.length / 4;
            }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    gamestate.prototype.render = function () {
        gl.useProgram(this.shader.prog);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.uniform2f(gl.getUniformLocation(this.shader.prog, 'off'), -pl.cam.x, -pl.cam.y);
        gl.uniform2f(gl.getUniformLocation(this.shader.prog, 'scl'), (1 / 8) * (canvas.height / canvas.width), 1 / 8);
        gl.uniform2i(gl.getUniformLocation(this.shader.prog, 'spnum'), 15, 3);
        var stop = pl.cam.y - 13;
        var sbottom = pl.cam.y + 13;
        var sleft = pl.cam.x - 13 / (canvas.height / canvas.width);
        var sright = pl.cam.x + 13 / (canvas.height / canvas.width);
        for (var i_7 = 0; i_7 < 50; i_7++)
            for (var j = 0; j < 50; j++) {
                if (!(i_7 * 20 > sright ||
                    (i_7 + 1) * 20 < sleft ||
                    j * 20 > sbottom ||
                    (j + 1) * 20 < stop)) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.chunks.g(i_7, j).vbo);
                    var t = gl.getUniformLocation(this.shader.prog, 'i');
                    gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(t);
                    // gl.vertexAttribPointer(t2, 2, gl.FLOAT, false, 8*4, 8*2);
                    // gl.enableVertexAttribArray(t2);
                    gl.drawArrays(gl.TRIANGLES, 0, this.chunks.g(i_7, j).vsize);
                }
            }
        gl.useProgram(this.tshader.prog);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.chesttex);
        gl.uniform2f(gl.getUniformLocation(this.tshader.prog, 'scl'), (1 / 8) * (canvas.height / canvas.width), 1 / 8);
        gl.uniform2i(gl.getUniformLocation(this.tshader.prog, 'spnum'), 2, 1);
        for (var i_8 = 0; i_8 < this.chests.length; i_8++) {
            var x = this.chests[i_8].pos.x;
            var y = this.chests[i_8].pos.y;
            if (!(x > sright ||
                (x + 1) < sleft ||
                y > sbottom ||
                (y + 1) < stop)) {
                gl.bindBuffer(gl.ARRAY_BUFFER, (this.chests[i_8].id > 0) ? this.cchestvbo : this.ochestvbo);
                var t = gl.getUniformLocation(this.tshader.prog, 'i');
                gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(t);
                gl.uniform2f(gl.getUniformLocation(this.tshader.prog, 'off'), x - pl.cam.x, y - pl.cam.y);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    };
    return gamestate;
}());
var gmst = new gamestate();
socket.emit('n', pl);
setInterval(function () {
    socket.emit('u', pl);
}, 1000 / 30);
var oplayers;
var opltemp = {};
socket.on('s', function (players) {
    oplayers = players;
});
var chatelements = [document.getElementById('ctxt0'), document.getElementById('ctxt1'), document.getElementById('ctxt2'), document.getElementById('ctxt3'), document.getElementById('ctxt4')];
var boardelements = [document.getElementById('board0'), document.getElementById('board1'), document.getElementById('board2'), document.getElementById('board3'), document.getElementById('board4')];
var cnewtime = -1;
function chat(message) {
    for (var i = 4; i > 0; i--) {
        chatelements[i].innerHTML = chatelements[i - 1].innerHTML;
    }
    chatelements[0].innerHTML = message;
    cnewtime = 1.5;
}
socket.on('c', chat);
socket.on('chg', function (ch) {
    for (var i_9 in pl.items) {
        if (pl.items[i_9] == 0) {
            pl.items[i_9] = ch;
            break;
        }
    }
});
socket.on('g', function (item) {
    for (var i_10 in pl.items) {
        if (pl.items[i_10] == 0) {
            pl.items[i_10] = item;
            break;
        }
    }
});
socket.on('chr', function (ch) {
    for (var i_11 in gmst.chests)
        gmst.chests[i_11].id = Math.abs(gmst.chests[i_11].id);
});
socket.on('dmg', function (dmg, from) {
    if (pl.stun < 0.0) {
        pl.stun = 1.7;
        pl.hp -= Math.ceil(dmg / pl.checkdef());
        if (pl.hp <= 0) {
            socket.emit('pt', from, socket.id, pl.items);
        }
    }
});
socket.on('point', function (inv) {
    pl.points++;
    for (var i_12 = 0; i_12 < inv.length; i_12++)
        if (inv[i_12] != 0)
            for (var j = 0; j < pl.items.length; j++)
                if (pl.items[j] == 0) {
                    pl.items[j] = inv[i_12];
                    break;
                }
});
socket.on('swanim', function (from) {
    if (!opltemp[from])
        opltemp[from] = {};
    opltemp[from].swanim = 0.12;
});
var keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    main: false,
    off: false,
    inv: false
};
var pkeys = {
    up: false,
    down: false,
    left: false,
    right: false,
    main: false,
    off: false,
    inv: false
};
var isMobile = !!(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
var ongoingTouches = [];
canvas.addEventListener('click', function (e) {
    console.log("hmm");
    var plsizeh = 1 / 2;
    var plsize = canvas.height / 16;
    var x = (e.clientX - canvas.width / 2) / plsize + pl.pos.x;
    var y = (e.clientY - canvas.height / 2) / plsize + pl.pos.y;
    for (var i_13 in oplayers) {
        if (x > oplayers[i_13].pos.x - plsizeh && x < oplayers[i_13].pos.x + plsizeh && y > oplayers[i_13].pos.y - plsizeh && y < oplayers[i_13].pos.y + plsizeh) {
            if (oplayers[i_13].team != null) {
                chat(oplayers[i_13].name + " : " + oplayers[i_13].team + " (" + oplayers[i_13].points + ")");
            }
            else {
                chat(oplayers[i_13].name + " (" + oplayers[i_13].points + ")");
            }
        }
    }
}, false);
// document.body.addEventListener('contextmenu', function(e) {
//   alert("You've tried to open context menu"); //here you draw your own menu
//   e.preventDefault();
// }, false);
if (isMobile) {
    function handleStart(e) { ongoingTouches = e.touches; e.preventDefault(); }
    function handleEnd(e) { ongoingTouches = e.touches; }
    function handleCancel(e) { ongoingTouches = e.touches; }
    function handleMove(e) { ongoingTouches = e.touches; e.preventDefault(); }
    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchmove", handleMove, false);
}
else {
    document.addEventListener('keydown', function (event) {
        switch (event.keyCode) {
            case 37:
            case 65:
                if (!event.repeat)
                    keys.left = true;
                break;
            case 38:
            case 87:
                if (!event.repeat)
                    keys.up = true;
                break;
            case 39: // ->
            case 68:
                if (!event.repeat)
                    keys.right = true;
                break;
            case 40: // ->
            case 83:
                if (!event.repeat)
                    keys.down = true;
                break;
            case 90: // X
            case 16:
                if (!event.repeat)
                    keys.main = true;
                break;
            case 88:
            case 32:
                if (!event.repeat)
                    keys.off = true;
                break;
        }
    });
    document.addEventListener('keyup', function (event) {
        switch (event.keyCode) {
            case 37:
            case 65:
                if (!event.repeat)
                    keys.left = false;
                break;
            case 38:
            case 87:
                if (!event.repeat)
                    keys.up = false;
                break;
            case 39: // ->
            case 68:
                if (!event.repeat)
                    keys.right = false;
                break;
            case 40: // ->
            case 83:
                if (!event.repeat)
                    keys.down = false;
                break;
            case 90: // X
            case 16:
                if (!event.repeat)
                    keys.main = false;
                break;
            case 88:
            case 32:
                if (!event.repeat)
                    keys.off = false;
                break;
        }
        if (event.keyCode == 32)
            event.preventDefault();
    });
}
function createButton(func, style, v, d) {
    if (v === void 0) { v = ""; }
    if (d === void 0) { d = document.body; }
    var button = document.createElement("input");
    button.type = "button";
    button.value = v;
    button.onclick = func;
    button.style = style;
    d.appendChild(button);
    return button;
}
function createButtoni(func, style) {
    var button = document.createElement("input");
    button.type = "image";
    button.onclick = func;
    button.alt = 'an item button';
    button.value = ' ';
    button.src = " ";
    button.style = style;
    document.body.appendChild(button);
    return button;
}
var invfocus = -1;
var itemgraphics = ["static/img/items/nullitem.png", "static/img/items/hookshot.png", "static/img/items/sword0.png", "static/img/items/sword1.png", "static/img/items/sword2.png", "static/img/items/sword3.png", "static/img/items/sword4.png", "static/img/items/armor0.png", "static/img/items/armor1.png", "static/img/items/armor2.png", "static/img/items/boots0.png", "static/img/items/boots1.png", "static/img/items/hat0.png", "static/img/items/hat1.png"];
var invdisp;
var trashbutton;
var hptext = document.getElementById('hp');
var nametext = document.getElementById('name');
var pointtext = document.getElementById('points');
var teamtext = document.getElementById('team');
if (isMobile) {
    invdisp = [
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 0;
            else {
                var t = pl.items[0];
                pl.items[0] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid green;position: absolute; left: 16px; top: 16px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 1;
            else {
                var t = pl.items[1];
                pl.items[1] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid green;position: absolute; left: 50px; top: 16px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 2;
            else {
                var t = pl.items[2];
                pl.items[2] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid blue;position: absolute; left: 84px; top: 16px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 3;
            else {
                var t = pl.items[3];
                pl.items[3] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid blue;position: absolute; left: 118px; top: 16px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 4;
            else {
                var t = pl.items[4];
                pl.items[4] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 152px; top: 16px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 5;
            else {
                var t = pl.items[5];
                pl.items[5] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 186px; top: 16px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 6;
            else {
                var t = pl.items[6];
                pl.items[6] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 220px; top: 16px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 7;
            else {
                var t = pl.items[7];
                pl.items[7] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 254px; top: 16px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 8;
            else {
                var t = pl.items[8];
                pl.items[8] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 16px; top: 50px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 9;
            else {
                var t = pl.items[9];
                pl.items[9] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 50px; top: 50px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 10;
            else {
                var t = pl.items[10];
                pl.items[10] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 84px; top: 50px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 11;
            else {
                var t = pl.items[11];
                pl.items[11] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 118px; top: 50px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 12;
            else {
                var t = pl.items[12];
                pl.items[12] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 152px; top: 50px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 13;
            else {
                var t = pl.items[13];
                pl.items[13] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 186px; top: 50px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 14;
            else {
                var t = pl.items[14];
                pl.items[14] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 220px; top: 50px;width:32px; height:32px;"),
        createButtoni(function () {
            if (invfocus == -1)
                invfocus = 15;
            else {
                var t = pl.items[15];
                pl.items[15] = pl.items[invfocus];
                pl.items[invfocus] = t;
                invfocus = -1;
            }
        }, "outline:2px solid black;position: absolute; left: 254px; top: 50px;width:32px; height:32px;")
    ];
    trashbutton = createButtoni(function () {
        if (invfocus != -1) {
            pl.items[invfocus] = 0;
            invfocus = -1;
        }
    }, "position: absolute; left: 352px; top: 16px;width:32px; height:32px;");
    document.getElementById('teammembers').style.cssText = "width: 50px; height: 100px; line-height: 1em; overflow:scroll; border: thin #000 solid; padding: 5px;position:absolute;left:288px;top:16px";
    for (var i = 0; i < chatelements.length; i++) {
        chatelements[i].style.fontSize = "7px";
        chatelements[i].style.right = "8px";
        chatelements[i].style.left = null;
        chatelements[i].style.bottom = (i * 8 + 36).toString() + "px";
    }
    for (var i = 0; i < boardelements.length; i++) {
        boardelements[i].style.fontSize = "7px";
        boardelements[i].style.top = (i * 8 + 36).toString() + "px";
    }
    hptext.style.fontSize = "9px";
    nametext.style.fontSize = "9px";
    pointtext.style.fontSize = "9px";
    teamtext.style.fontSize = "9px";
    hptext.style.bottom = "0px";
    nametext.style.bottom = "9px";
    pointtext.style.bottom = "18px";
    teamtext.style.bottom = "27px";
    document.getElementById('chatbox').style.cssText = "position: absolute; z-index: 1; right: 66px; bottom: 100px; font-size:14px;height:14px;width:50px;";
    document.getElementById('chatconfirm').style.cssText = "position: absolute; z-index: 1; right: 8px;font-size:14px; bottom: 100px; width:50px; height:20px;";
}
else {
    invdisp = [
        createButtoni(function () { if (invfocus == -1)
            invfocus = 0;
        else {
            var t = pl.items[0];
            pl.items[0] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid green;position: absolute; left: 32px; top: 32px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 1;
        else {
            var t = pl.items[1];
            pl.items[1] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid green;position: absolute; left: 102px; top: 32px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 2;
        else {
            var t = pl.items[2];
            pl.items[2] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid blue;position: absolute; left: 172px; top: 32px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 3;
        else {
            var t = pl.items[3];
            pl.items[3] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid blue;position: absolute; left: 242px; top: 32px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 4;
        else {
            var t = pl.items[4];
            pl.items[4] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 32px; top: 102px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 5;
        else {
            var t = pl.items[5];
            pl.items[5] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 102px; top: 102px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 6;
        else {
            var t = pl.items[6];
            pl.items[6] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 172px; top: 102px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 7;
        else {
            var t = pl.items[7];
            pl.items[7] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 242px; top: 102px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 8;
        else {
            var t = pl.items[8];
            pl.items[8] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 32px; top: 172px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 9;
        else {
            var t = pl.items[9];
            pl.items[9] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 102px; top: 172px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 10;
        else {
            var t = pl.items[10];
            pl.items[10] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 172px; top: 172px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 11;
        else {
            var t = pl.items[11];
            pl.items[11] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 242px; top: 172px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 12;
        else {
            var t = pl.items[12];
            pl.items[12] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 32px; top: 242px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 13;
        else {
            var t = pl.items[13];
            pl.items[13] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 102px; top: 242px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 14;
        else {
            var t = pl.items[14];
            pl.items[14] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 172px; top: 242px;width:64px; height:64px;"),
        createButtoni(function () { if (invfocus == -1)
            invfocus = 15;
        else {
            var t = pl.items[15];
            pl.items[15] = pl.items[invfocus];
            pl.items[invfocus] = t;
            invfocus = -1;
        } }, "outline:6px solid black;position: absolute; left: 242px; top: 242px;width:64px; height:64px;")
    ];
    trashbutton = createButtoni(function () { if (invfocus != -1) {
        pl.items[invfocus] = 0;
        invfocus = -1;
    } }, "position: absolute; left: 32px; top: 312px;width:64px; height:64px;");
}
trashbutton.src = "static/img/items/trash.png";
var allyelements = {};
function cally(id) {
    allyelements[id] = createButton(new Function("if (invfocus!=-1){socket.emit('give',pl.items[invfocus],'" + id + "') ;pl.items[invfocus]=0;invfocus=-1; }"), "", oplayers[id].name, document.getElementById('teammembers'));
}
function dally(id) {
    allyelements[id].remove();
    delete allyelements[id];
}
//var givebutton:any = createButton(function(){pl.maini=3},"position: absolute; left: 128px; top: 112px;","give");
var spsize = 64;
var lastUpdateTime = performance.now();
var plvbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.01, 0.01, 0.5, -0.5, 0.99, 0.01, -0.5, 0.5, 0.01, 0.99, 0.5, 0.5, 0.99, 0.99, 0.5, -0.5, 0.99, 0.01, -0.5, 0.5, 0.01, 0.99]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
var dynshad = new shad('static/dynamic.vert', 'static/transparent.frag');
function trect(at, ab, al, ar, bt, bb, bl, br) {
    return !(bl > ar ||
        br < al ||
        bb > at ||
        bt < ab);
}
function sword(dmg) {
    var v = pl.pos.add(directions[pl.dir].smul(1.5));
    for (var i_14 in oplayers) {
        if (i_14 != socket.id && trect(v.y + 2, v.y - 2, v.x - 2, v.x + 2, oplayers[i_14]["pos"]["y"] + 0.5, oplayers[i_14]["pos"]["y"] - 0.5, oplayers[i_14]["pos"]["x"] - 0.5, oplayers[i_14]["pos"]["x"] + 0.5)) {
            if (oplayers[i_14].team == null || oplayers[i_14].team != pl.team)
                socket.emit('atk', dmg, i_14, socket.id);
        }
    }
    socket.emit('sw', socket.id);
    pl.swanim = 0.12;
}
var swipetex = loadTexture('static/img/swipe.png');
var touchtex = loadTexture('static/img/touch.png');
var buttontex = loadTexture('static/img/button.png');
var pltextures = [loadTexture('static/img/pl/player0.png'), loadTexture('static/img/pl/armoredegg.png')];
var stuneffect = 0;
var regtime = 0;
var dt;
var passivemode = 0; //0 - speed , 1 - protection , 2 - healing "for mobile only"
function updatefunc() {
    var currentTime = performance.now();
    dt = (currentTime - lastUpdateTime) / 1000.0;
    regtime += dt;
    if (regtime > 3.0) {
        pl.hp += pl.checkreg();
        regtime -= 3.0;
    }
    if (pl.hp > 100) {
        pl.hp = 100;
    }
    if (pl.team != null) {
        pl.team = pl.team.replace(' ', '');
    }
    if (pl.team != null)
        if (pl.team.length < 1)
            pl.team = null;
    {
        if (canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
        gl.clearColor(0.23137, 0.23137, 0.23137, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        {
            var t = pl.pos.add(directions[pl.dir].smul(pl.hlen));
            var f = 1 - Math.pow(0.01, dt);
            pl.cam = new vec(pl.cam.x + (t.x - pl.cam.x) * f, pl.cam.y + (t.y - pl.cam.y) * f);
        }
        gmst.render();
        gl.useProgram(dynshad.prog);
        if ((Math.round(stuneffect * 5)) % 2 == 0 || !(pl.stun > 0)) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, pltextures[pl.outfit]);
            gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
            var t = gl.getUniformLocation(dynshad.prog, 'i');
            gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(t);
            gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'off'), pl.pos.x - pl.cam.x, pl.pos.y - pl.cam.y);
            gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'scl'), (1 / 8) * (canvas.height / canvas.width), 1 / 8);
            gl.uniform2i(gl.getUniformLocation(dynshad.prog, 'spnum'), 1, 2);
            gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'lscl'), 1, -1);
            gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'uvoff'), 0, ((Math.round(pl.pos.x) + Math.round(pl.pos.y)) % 2) ? 0 : 1);
            gl.uniform1f(gl.getUniformLocation(dynshad.prog, 'angle'), 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        stuneffect += dt;
        stuneffect = stuneffect % 20;
        for (var id in oplayers) {
            if (id != socket.id) {
                if ((Math.round(stuneffect * 5)) % 2 == 0 || !(oplayers[id].stun > 0)) {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, pltextures[oplayers[id].outfit]);
                    gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
                    var t = gl.getUniformLocation(dynshad.prog, 'i');
                    gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(t);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'off'), oplayers[id].pos.x - pl.cam.x, oplayers[id].pos.y - pl.cam.y);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'scl'), (1 / 8) * (canvas.height / canvas.width), 1 / 8);
                    gl.uniform2i(gl.getUniformLocation(dynshad.prog, 'spnum'), 1, 2);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'lscl'), 1, -1);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'uvoff'), 0, ((Math.round(oplayers[id].pos.x) + Math.round(oplayers[id].pos.y)) % 2) ? 1 : 0);
                    gl.uniform1f(gl.getUniformLocation(dynshad.prog, 'angle'), 0);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);
                }
                if (opltemp[id] && opltemp[id].swanim > 0) {
                    gl.useProgram(dynshad.prog);
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, swipetex);
                    gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
                    var t = gl.getUniformLocation(dynshad.prog, 'i');
                    gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(t);
                    {
                        var v_1 = directions[oplayers[id].dir].smul(1.5);
                        gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'off'), oplayers[id].pos.x - pl.cam.x + v_1.x, oplayers[id].pos.y - pl.cam.y + v_1.y);
                    }
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'scl'), (1 / 8) * (canvas.height / canvas.width), (1 / 8));
                    gl.uniform2i(gl.getUniformLocation(dynshad.prog, 'spnum'), 1, 1);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'lscl'), 4, -4);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'uvoff'), 0, 0);
                    gl.uniform1f(gl.getUniformLocation(dynshad.prog, 'angle'), dangles[oplayers[id].dir]);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);
                }
                if (opltemp[id] && opltemp[id].swanim > 0)
                    opltemp[id].swanim -= dt;
            }
        }
        if (pl.swanim > 0) {
            gl.useProgram(dynshad.prog);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, swipetex);
            gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
            var t = gl.getUniformLocation(dynshad.prog, 'i');
            gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(t);
            {
                var v_2 = directions[pl.dir].smul(1.5).add(pl.pos).sub(pl.cam);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'off'), v_2.x, v_2.y);
            }
            gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'scl'), (1 / 8) * (canvas.height / canvas.width), (1 / 8));
            gl.uniform2i(gl.getUniformLocation(dynshad.prog, 'spnum'), 1, 1);
            gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'lscl'), 4, -4);
            gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'uvoff'), 0, 0);
            gl.uniform1f(gl.getUniformLocation(dynshad.prog, 'angle'), dangles[pl.dir]);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        if (pl.hlen >= 0.1) {
            gl.useProgram(dynshad.prog);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, gmst.chesttex);
            gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
            var t = gl.getUniformLocation(dynshad.prog, 'i');
            gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(t);
            var v_3 = pl.pos.add(directions[pl.dir].smul(pl.hlen)).sub(pl.cam);
            gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'off'), v_3.x, v_3.y);
            gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'scl'), (1 / 8) * (canvas.height / canvas.width), 1 / 8);
            gl.uniform2i(gl.getUniformLocation(dynshad.prog, 'spnum'), 2, 1);
            gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'lscl'), 0.3, 0.3);
            gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'uvoff'), 0, 0);
            gl.uniform1f(gl.getUniformLocation(dynshad.prog, 'angle'), 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
        gl.useProgram(null);
    }
    if (pl.hp <= 0)
        pl = new player(pl.name, Math.max(pl.points - 5, 0), pl.team);
    for (var i_15 = 0; i_15 < invdisp.length; i_15++) {
        if (i_15 == invfocus) {
            invdisp[i_15].style.zIndex = 102;
            invdisp[i_15].style.outlineColor = 'red';
        }
        else {
            if (i_15 < 2) {
                invdisp[i_15].style.zIndex = 101;
                invdisp[i_15].style.outlineColor = 'green';
            }
            else if (i_15 < 4) {
                invdisp[i_15].style.zIndex = 101;
                invdisp[i_15].style.outlineColor = 'blue';
            }
            else {
                invdisp[i_15].style.zIndex = 100;
                invdisp[i_15].style.outlineColor = 'black';
            }
        }
        invdisp[i_15].src = itemgraphics[pl.items[i_15]];
    }
    hptext.innerHTML = "HP : " + Math.floor(pl.hp).toString() + " / 100";
    nametext.innerHTML = "Name : " + pl.name;
    pointtext.innerHTML = "Points : " + pl.points.toString();
    if (pl.team == null)
        teamtext.innerHTML = '';
    else
        teamtext.innerHTML = "Team : " + pl.team;
    if (cnewtime > 0) {
        cnewtime -= dt;
        if (isMobile)
            chatelements[0].style.fontSize = (7 + cnewtime * 3).toString() + 'px';
        else
            chatelements[0].style.fontSize = (14 + cnewtime * 4).toString() + 'px';
    }
    else if (isMobile)
        chatelements[0].style.fontSize = '7px';
    else
        chatelements[0].style.fontSize = '14px';
    {
        var t = [];
        for (var i_16 in oplayers) {
            if (oplayers[i_16].team == null) {
                t.push(oplayers[i_16]);
            }
            else {
                var b_1 = true;
                for (var j = 0; j < t.length; j++)
                    if (t[j].team == oplayers[i_16].team) {
                        t[j].points += oplayers[i_16].points;
                        b_1 = false;
                        break;
                    }
                if (b_1)
                    t.push({ 'name': '[' + oplayers[i_16].team + ']', 'team': oplayers[i_16].team, 'points': oplayers[i_16].points });
            }
        }
        t.sort(function (a, b) { return a.points - b.points; });
        for (var i_17 = 0; i_17 < 5; i_17++) {
            var s = void 0;
            if (i_17 < t.length) {
                s = t[i_17].name;
                s += ": " + t[i_17].points.toString();
            }
            else {
                s = "";
            }
            boardelements[i_17].innerHTML = s;
        }
        for (var i_18 in oplayers) {
            if (allyelements[i_18]) {
                if (oplayers[i_18].team == null || oplayers[i_18].team != pl.team || i_18 == socket.id)
                    dally(i_18);
                else
                    allyelements[i_18].value = oplayers[i_18].name + "\n(" + oplayers[i_18].points + ")" + " HP: " + oplayers[i_18].hp + "/100";
            }
            else if (oplayers[i_18].team != null && oplayers[i_18].team == pl.team && i_18 != socket.id)
                cally(i_18);
        }
        for (var i_19 in allyelements) {
            if (!oplayers[i_19]) {
                dally(i_19);
            }
        }
    }
    pl.swanim -= dt;
    if (pl.swanim < -0.1)
        pl.swanim = -1;
    pl.stun -= dt;
    if (pl.stun < 0.0)
        pl.stun = -1;
    var v = new vec(0, 0);
    if (pl.hlen < 0.1) {
        if (pl.swanim < 0.0 && pl.stun < 1.2) {
            if (isMobile) {
                keys.main = false;
                keys.off = false;
                for (var i_20 = 0; i_20 < ongoingTouches.length; i_20 += 1) {
                    if (ongoingTouches[i_20].pageX < canvas.width / 2) {
                        var tt = (new vec(ongoingTouches[i_20].pageX - canvas.width / 4, -(ongoingTouches[i_20].pageY - (canvas.height * 4 / 6)))).norm();
                        v = v.add(new vec(Math.round(tt.x), Math.round(tt.y)));
                    }
                    else if (ongoingTouches[i_20].pageX < canvas.width * 3 / 4) {
                        keys.main = true;
                    }
                    else {
                        keys.off = true;
                    }
                }
            }
            if (keys.up)
                v.y++;
            if (keys.down)
                v.y--;
            if (keys.left)
                v.x--;
            if (keys.right)
                v.x++;
            if (keys.main && !pkeys.main) {
                switch (pl.items[0]) {
                    case 1:
                        pl.hlen = 0.5;
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
            if (keys.off && !pkeys.off) {
                switch (pl.items[1]) {
                    case 1:
                        pl.hlen = 0.5;
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
            if (v.lensq() > 0.1) {
                v = v.norm();
                if (v.dot(directions[2]) > v.dot(directions[0]) - 0.01 && v.dot(directions[2]) > v.dot(directions[1]) - 0.01 && v.dot(directions[2]) > v.dot(directions[3]) - 0.01)
                    pl.dir = 2;
                if (v.dot(directions[3]) > v.dot(directions[0]) - 0.01 && v.dot(directions[3]) > v.dot(directions[1]) - 0.01 && v.dot(directions[3]) > v.dot(directions[2]) - 0.01)
                    pl.dir = 3;
                if (v.dot(directions[0]) > v.dot(directions[1]) - 0.01 && v.dot(directions[0]) > v.dot(directions[2]) - 0.01 && v.dot(directions[0]) > v.dot(directions[3]) - 0.01)
                    pl.dir = 0;
                if (v.dot(directions[1]) > v.dot(directions[0]) - 0.01 && v.dot(directions[1]) > v.dot(directions[2]) - 0.01 && v.dot(directions[1]) > v.dot(directions[3]) - 0.01)
                    pl.dir = 1;
                if (isMobile) {
                    var vt = (new vec(-1 / 2, -1 / 3)).add(v.mul(new vec(0.2 * (canvas.height / canvas.width), 0.2)));
                    gl.useProgram(dynshad.prog);
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, touchtex);
                    gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
                    var t = gl.getUniformLocation(dynshad.prog, 'i');
                    gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(t);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'off'), vt.x, vt.y);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'scl'), 1, 1);
                    gl.uniform2i(gl.getUniformLocation(dynshad.prog, 'spnum'), 1, 1);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'lscl'), 0.1 * (canvas.height / canvas.width), -0.1);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'uvoff'), 0, 0);
                    gl.uniform1f(gl.getUniformLocation(dynshad.prog, 'angle'), 0);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);
                    vt = (new vec(-1 / 2, -1 / 3));
                    gl.useProgram(dynshad.prog);
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, touchtex);
                    gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
                    t = gl.getUniformLocation(dynshad.prog, 'i');
                    gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(t);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'off'), vt.x, vt.y);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'scl'), 1, 1);
                    gl.uniform2i(gl.getUniformLocation(dynshad.prog, 'spnum'), 1, 1);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'lscl'), 0.07 * (canvas.height / canvas.width), -0.07);
                    gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'uvoff'), 0, 0);
                    gl.uniform1f(gl.getUniformLocation(dynshad.prog, 'angle'), 0);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                    gl.bindBuffer(gl.ARRAY_BUFFER, null);
                }
                v = v.smul(dt * 8 * pl.checkspd());
            }
            else if (isMobile) {
                var vt = (new vec(-1 / 2, -1 / 3));
                gl.useProgram(dynshad.prog);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, touchtex);
                gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
                var t = gl.getUniformLocation(dynshad.prog, 'i');
                gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(t);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'off'), vt.x, vt.y);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'scl'), 1, 1);
                gl.uniform2i(gl.getUniformLocation(dynshad.prog, 'spnum'), 1, 1);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'lscl'), 0.1 * (canvas.height / canvas.width), -0.1);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'uvoff'), 0, 0);
                gl.uniform1f(gl.getUniformLocation(dynshad.prog, 'angle'), 0);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
            }
            if (isMobile) {
                var vt = (new vec(5 / 8, -1 / 2));
                gl.useProgram(dynshad.prog);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, buttontex);
                gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
                var t = gl.getUniformLocation(dynshad.prog, 'i');
                gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(t);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'off'), vt.x, vt.y);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'scl'), 1, 1);
                gl.uniform2i(gl.getUniformLocation(dynshad.prog, 'spnum'), 1, 1);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'lscl'), 0.3 * (canvas.height / canvas.width), -0.3);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'uvoff'), 0, 0);
                gl.uniform1f(gl.getUniformLocation(dynshad.prog, 'angle'), 0);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
            }
            if (isMobile) {
                var vt = (new vec(3 / 8, -1 / 2));
                gl.useProgram(dynshad.prog);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, buttontex);
                gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
                var t = gl.getUniformLocation(dynshad.prog, 'i');
                gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(t);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'off'), vt.x, vt.y);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'scl'), 1, 1);
                gl.uniform2i(gl.getUniformLocation(dynshad.prog, 'spnum'), 1, 1);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'lscl'), 0.3 * (canvas.height / canvas.width), -0.3);
                gl.uniform2f(gl.getUniformLocation(dynshad.prog, 'uvoff'), 0, 0);
                gl.uniform1f(gl.getUniformLocation(dynshad.prog, 'angle'), 0);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
            }
        }
    }
    else {
        var p = pl.pos.add(directions[pl.dir].smul(pl.hlen));
        if (gmst.level.g(Math.floor(p.x), Math.floor(p.y)) < 0) {
            v.x = directions[pl.dir].x * 15 * dt;
            v.y = directions[pl.dir].y * 15 * dt;
            pl.hlen -= dt * 15;
        }
        else {
            var steps_1 = Math.ceil(dt * 40 + 0.1);
            for (var i_21 = 0; i_21 < steps_1; i_21++) {
                pl.hlen += 18 * (dt / steps_1);
                p = pl.pos.add(directions[pl.dir].smul(pl.hlen));
                if (gmst.level.g(Math.floor(p.x), Math.floor(p.y)) < 0) {
                    break;
                }
            }
        }
        if (pl.hlen > 15)
            pl.hlen = 0;
    }
    var steps = Math.ceil(v.len() * 2.0 + 0.1);
    var va = v.sdiv(steps);
    var b = false;
    for (var i_22 = 0; i_22 < steps; i_22++) {
        pl.pos = pl.pos.add(va);
        if (gmst.level.g(Math.floor(pl.pos.x - 0.495), Math.floor(pl.pos.y)) < 0) {
            pl.pos.x = Math.floor(pl.pos.x) + 0.505;
            b = true;
        }
        if (gmst.level.g(Math.floor(pl.pos.x + 0.495), Math.floor(pl.pos.y)) < 0) {
            pl.pos.x = Math.floor(pl.pos.x) + 0.495;
            b = true;
        }
        if (gmst.level.g(Math.floor(pl.pos.x), Math.floor(pl.pos.y + 0.495)) < 0) {
            pl.pos.y = Math.floor(pl.pos.y) + 0.495;
            b = true;
        }
        if (gmst.level.g(Math.floor(pl.pos.x), Math.floor(pl.pos.y - 0.495)) < 0) {
            pl.pos.y = Math.floor(pl.pos.y) + 0.505;
            b = true;
        }
        if (gmst.level.g(Math.floor(pl.pos.x - 0.495), Math.floor(pl.pos.y - 0.495)) < 0) {
            if (Math.abs(pl.pos.y - (Math.floor(pl.pos.y) + 0.5)) < Math.abs(pl.pos.x - (Math.floor(pl.pos.x) + 0.5)))
                pl.pos.y = Math.floor(pl.pos.y) + 0.505;
            else
                pl.pos.x = Math.floor(pl.pos.x) + 0.505;
            b = true;
        }
        if (gmst.level.g(Math.floor(pl.pos.x + 0.495), Math.floor(pl.pos.y - 0.495)) < 0) {
            if (Math.abs(pl.pos.y - (Math.floor(pl.pos.y) + 0.5)) < Math.abs(pl.pos.x - (Math.floor(pl.pos.x) + 0.5)))
                pl.pos.y = Math.floor(pl.pos.y) + 0.505;
            else
                pl.pos.x = Math.floor(pl.pos.x) + 0.495;
            b = true;
        }
        if (gmst.level.g(Math.floor(pl.pos.x - 0.495), Math.floor(pl.pos.y + 0.495)) < 0) {
            if (Math.abs(pl.pos.y - (Math.floor(pl.pos.y) + 0.5)) < Math.abs(pl.pos.x - (Math.floor(pl.pos.x) + 0.5)))
                pl.pos.y = Math.floor(pl.pos.y) + 0.495;
            else
                pl.pos.x = Math.floor(pl.pos.x) + 0.505;
            b = true;
        }
        if (gmst.level.g(Math.floor(pl.pos.x + 0.495), Math.floor(pl.pos.y + 0.495)) < 0) {
            if (Math.abs(pl.pos.y - (Math.floor(pl.pos.y) + 0.5)) < Math.abs(pl.pos.x - (Math.floor(pl.pos.x) + 0.5)))
                pl.pos.y = Math.floor(pl.pos.y) + 0.495;
            else
                pl.pos.x = Math.floor(pl.pos.x) + 0.495;
            b = true;
        }
        if (gmst.level.g(Math.floor(pl.pos.x), Math.floor(pl.pos.y)) < 0) {
            pl.pos.y += 0.5;
        }
        if (pl.hlen < 0.1)
            if (gmst.level.g(Math.floor(pl.pos.x), Math.floor(pl.pos.y)) == 0) {
                pl.hp -= 15;
                pl.pos = new vec(10, 980);
                if (pl.hp <= 0)
                    socket.emit('chat', "< " + pl.name + " > succumbed in the void");
            }
        {
            var t = false;
            for (var i_23 in pl.items)
                if (pl.items[i_23] == 0)
                    t = true;
            if (t)
                for (var c in gmst.chests) {
                    if (gmst.chests[c].id > 0) {
                        if (Math.floor(pl.pos.x) == gmst.chests[c].pos.x && Math.floor(pl.pos.y) == gmst.chests[c].pos.y) {
                            socket.emit('ch', { 'id': c, 'v': gmst.chests[c].id }, socket.id);
                            gmst.chests[c].id = -gmst.chests[c].id;
                        }
                    }
                }
        }
    }
    if (b) {
        pl.hlen = 0;
    }
    pkeys = Object.assign({}, keys);
    ;
    lastUpdateTime = currentTime;
    requestAnimationFrame(updatefunc);
}
requestAnimationFrame(updatefunc);
