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
var player = /** @class */ (function () {
    function player() {
        this.pos = new vec(10, 980);
    }
    return player;
}());
var pl = new player();
var vertbuf = /** @class */ (function () {
    function vertbuf() {
    }
    return vertbuf;
}());
var gamestate = /** @class */ (function () {
    function gamestate() {
        this.level = new array2d(1002);
        this.chunks = new array2d(50);
        var js = loadJSON("static/level.json");
        var inc = 0;
        for (var i = 0; i < 1002; i++)
            for (var j = 0; j < 1002; j++) {
                this.level.s(i, j, -1);
            }
        for (var i = 1; i < 1001; i++) {
            for (var j = 1; j < 1001; j++) {
                this.level.s(i, j, js["tiles"][inc]);
                inc++;
            }
        }
        for (var i = 0; i < 50; i++)
            for (var j = 0; j < 50; j++) {
                this.chunks.s(i, j, new vertbuf);
                this.chunks.g(i, j).vbo = gl.createBuffer();
                //this.vao=gl.createVertexArray();
                //gl.bindVertexArray(this.vao);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.chunks.g(i, j).vbo);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0]), gl.STATIC_DRAW);
                this.chunks.g(i, j).vsize = 0;
            }
        // gl.vertexAttribPointer(0, 2, gl.FLOAT, false, sizeof(1.1)*4, sizeof(1.1)*0);
        // gl.enableVertexAttribArray(0);
        // gl.vertexAttribPointer(1, 2, gl.FLOAT, false, sizeof(1.1)*4, sizeof(1.1)*2);
        // gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, loadtxt('static/world.vert', 'text/plain'));
        gl.compileShader(vertShader);
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, loadtxt('static/world.frag', 'text/plain'));
        gl.compileShader(fragShader);
        this.shader = gl.createProgram();
        gl.attachShader(this.shader, vertShader);
        gl.attachShader(this.shader, fragShader);
        gl.linkProgram(this.shader);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        gl.detachShader(this.shader, vertShader);
        gl.detachShader(this.shader, fragShader);
        this.update();
        this.tex = loadTexture('static/test.png');
    }
    gamestate.prototype.update = function () {
        for (var it = 0; it < 50; it++)
            for (var jt = 0; jt < 50; jt++) {
                var data = [];
                for (var i = 1 + it * 20; i < 1 + (it + 1) * 20; i++)
                    for (var j = 1 + jt * 20; j < 1 + (jt + 1) * 20; j++) {
                        var o = 5;
                        if (this.level.g(i, j) > 0)
                            o = 10;
                        else if (this.level.g(i + 1, j) > 0 && this.level.g(i, j + 1) > 0 && this.level.g(i - 1, j) > 0 && this.level.g(i, j - 1) > 0)
                            o = 5;
                        else if (this.level.g(i + 1, j) > 0 && !(this.level.g(i - 1, j) > 0 || ((this.level.g(i, j + 1) > 0) != (this.level.g(i, j - 1) > 0))))
                            o = 4;
                        else if (this.level.g(i - 1, j) > 0 && !(this.level.g(i + 1, j) > 0 || ((this.level.g(i, j + 1) > 0) != (this.level.g(i, j - 1) > 0))))
                            o = 3;
                        else if (this.level.g(i, j + 1) > 0 && !(this.level.g(i, j - 1) > 0 || ((this.level.g(i + 1, j) > 0) != (this.level.g(i - 1, j) > 0))))
                            o = 2;
                        else if (this.level.g(i, j - 1) > 0 && !(this.level.g(i, j + 1) > 0 || ((this.level.g(i + 1, j) > 0) != (this.level.g(i - 1, j) > 0))))
                            o = 1;
                        else if ((this.level.g(i, j - 1) > 0) == (this.level.g(i, j + 1) > 0) && (this.level.g(i - 1, j) > 0) == (this.level.g(i + 1, j) > 0) && (this.level.g(i, j - 1) > 0) != (this.level.g(i - 1, j) > 0))
                            o = 0;
                        else if (this.level.g(i + 1, j) > 0 || this.level.g(i - 1, j) > 0 || this.level.g(i, j + 1) > 0 || this.level.g(i, j - 1) > 0)
                            o = 5;
                        else if ((((this.level.g(i + 1, j + 1) > 0) ? 1 : 0) + ((this.level.g(i - 1, j + 1) > 0) ? 1 : 0) + ((this.level.g(i + 1, j - 1) > 0) ? 1 : 0) + ((this.level.g(i - 1, j - 1) > 0) ? 1 : 0)) > 1)
                            o = 5;
                        else if (this.level.g(i + 1, j + 1) > 0)
                            o = 6;
                        else if (this.level.g(i - 1, j + 1) > 0)
                            o = 7;
                        else if (this.level.g(i + 1, j - 1) > 0)
                            o = 8;
                        else if (this.level.g(i - 1, j - 1) > 0)
                            o = 9;
                        else
                            o = 0;
                        var id = Math.abs(this.level.g(i, j)) - 1;
                        data.push(i);
                        data.push(j);
                        data.push(o + 0.01);
                        data.push(id + 0.01);
                        data.push(i);
                        data.push(j + 1);
                        data.push(o + 0.01);
                        data.push(id + 0.99);
                        data.push(i + 1);
                        data.push(j);
                        data.push(o + 0.99);
                        data.push(id + 0.01);
                        data.push(i + 1);
                        data.push(j + 1);
                        data.push(o + 0.99);
                        data.push(id + 0.99);
                        data.push(i + 1);
                        data.push(j);
                        data.push(o + 0.99);
                        data.push(id + 0.01);
                        data.push(i);
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
        gl.useProgram(this.shader);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.uniform2f(gl.getUniformLocation(this.shader, 'off'), -pl.pos.x, -pl.pos.y);
        gl.uniform2f(gl.getUniformLocation(gmst.shader, 'scl'), (1 / 10) * (canvas.height / canvas.width), 1 / 10);
        gl.uniform2i(gl.getUniformLocation(this.shader, 'spnum'), 11, 2);
        var stop = pl.pos.y - 11;
        var sbottom = pl.pos.y + 11;
        var sleft = pl.pos.x - 11 / (canvas.height / canvas.width);
        var sright = pl.pos.x + 11 / (canvas.height / canvas.width);
        for (var i = 0; i < 50; i++)
            for (var j = 0; j < 50; j++) {
                if (!(i * 20 > sright ||
                    (i + 1) * 20 < sleft ||
                    j * 20 > sbottom ||
                    (j + 1) * 20 < stop)) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.chunks.g(i, j).vbo);
                    var t = gl.getUniformLocation(this.shader, 'i');
                    gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(t);
                    // gl.vertexAttribPointer(t2, 2, gl.FLOAT, false, 8*4, 8*2);
                    // gl.enableVertexAttribArray(t2);
                    gl.drawArrays(gl.TRIANGLES, 0, this.chunks.g(i, j).vsize);
                }
            }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    };
    return gamestate;
}());
var gmst = new gamestate();
var keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    main: false,
    off: false,
    block: false,
    inv: false,
    friend: false
};
var pkeys = {
    up: false,
    down: false,
    left: false,
    right: false,
    main: false,
    off: false,
    block: false,
    inv: false,
    friend: false
};
var isMobile = !!(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
var ongoingTouches = [];
if (isMobile) {
    function toggleFullScreen() {
        var doc = window.document;
        var docEl = doc.documentElement;
        var requestFullScreen = docEl["requestFullscreen"] || docEl["mozRequestFullScreen"] || docEl["webkitRequestFullScreen"] || docEl["msRequestFullscreen"];
        var cancelFullScreen = doc["exitFullscreen"] || doc["mozCancelFullScreen"] || doc["webkitExitFullscreen"] || doc["msExitFullscreen"];
        if (!doc["fullscreenElement"] && !doc["mozFullScreenElement"] && !doc["webkitFullscreenElement"] && !doc["msFullscreenElement"]) {
            requestFullScreen.call(docEl);
        }
        else {
            cancelFullScreen.call(doc);
        }
    }
    toggleFullScreen();
    window.addEventListener("load", function () {
        // Set a timeout...
        setTimeout(function () {
            // Hide the address bar!
            window.scrollTo(0, 1);
        }, 0);
    });
    function handleStart(e) { ongoingTouches = e.touches; }
    function handleEnd(e) { ongoingTouches = e.touches; }
    function handleCancel(e) { ongoingTouches = e.touches; }
    function handleMove(e) { ongoingTouches = e.touches; }
    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchmove", handleMove, false);
}
else {
    document.addEventListener('keydown', function (event) {
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
            case 32: // X
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
    document.addEventListener('keyup', function (event) {
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
            case 32: // X
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
}
var spsize = 64;
var lastUpdateTime = performance.now();
var plvbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
function updatefunc() {
    var currentTime = performance.now();
    var dt = (currentTime - lastUpdateTime) / 1000.0;
    {
        if (canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
        gl.clearColor(0.23137, 0.23137, 0.23137, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gmst.render();
        gl.useProgram(gmst.shader);
        gl.bindBuffer(gl.ARRAY_BUFFER, plvbo);
        var t = gl.getUniformLocation(gmst.shader, 'i');
        gl.vertexAttribPointer(t, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(t);
        gl.uniform2f(gl.getUniformLocation(gmst.shader, 'off'), -0.5, -0.5);
        gl.uniform2f(gl.getUniformLocation(gmst.shader, 'scl'), (1 / 10) * (canvas.height / canvas.width), 1 / 10);
        gl.uniform2i(gl.getUniformLocation(gmst.shader, 'spnum'), 11, 2);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }
    var v = new vec(0, 0);
    if (isMobile) {
        for (var i = 0; i < ongoingTouches.length; i += 1) {
            if (ongoingTouches[i].pageX < canvas.width / 2) {
                v = v.add(new vec(ongoingTouches[i].pageX - canvas.width / 4, -(ongoingTouches[i].pageY - canvas.height / 2)));
            }
        }
    }
    else {
        if (keys.up)
            v.y++;
        if (keys.down)
            v.y--;
        if (keys.left)
            v.x--;
        if (keys.right)
            v.x++;
    }
    if (v.lensq() > 0.1)
        v = v.norm().smul(dt * 8);
    var steps = Math.ceil(v.len() * 2.0 + 0.1);
    var va = v.sdiv(steps);
    for (var i_1 = 0; i_1 < steps; i_1++) {
        pl.pos = pl.pos.add(va);
        if (gmst.level.g(Math.floor(pl.pos.x - 0.495), Math.floor(pl.pos.y)) <= 0)
            pl.pos.x = Math.floor(pl.pos.x) + 0.505;
        if (gmst.level.g(Math.floor(pl.pos.x + 0.495), Math.floor(pl.pos.y)) <= 0)
            pl.pos.x = Math.floor(pl.pos.x) + 0.495;
        if (gmst.level.g(Math.floor(pl.pos.x), Math.floor(pl.pos.y + 0.495)) <= 0)
            pl.pos.y = Math.floor(pl.pos.y) + 0.495;
        if (gmst.level.g(Math.floor(pl.pos.x), Math.floor(pl.pos.y - 0.495)) <= 0)
            pl.pos.y = Math.floor(pl.pos.y) + 0.505;
        if (gmst.level.g(Math.floor(pl.pos.x - 0.495), Math.floor(pl.pos.y - 0.495)) <= 0)
            if (Math.abs(pl.pos.y - (Math.floor(pl.pos.y) + 0.5)) < Math.abs(pl.pos.x - (Math.floor(pl.pos.x) + 0.5)))
                pl.pos.y = Math.floor(pl.pos.y) + 0.505;
            else
                pl.pos.x = Math.floor(pl.pos.x) + 0.505;
        if (gmst.level.g(Math.floor(pl.pos.x + 0.495), Math.floor(pl.pos.y - 0.495)) <= 0)
            if (Math.abs(pl.pos.y - (Math.floor(pl.pos.y) + 0.5)) < Math.abs(pl.pos.x - (Math.floor(pl.pos.x) + 0.5)))
                pl.pos.y = Math.floor(pl.pos.y) + 0.505;
            else
                pl.pos.x = Math.floor(pl.pos.x) + 0.495;
        if (gmst.level.g(Math.floor(pl.pos.x - 0.495), Math.floor(pl.pos.y + 0.495)) <= 0)
            if (Math.abs(pl.pos.y - (Math.floor(pl.pos.y) + 0.5)) < Math.abs(pl.pos.x - (Math.floor(pl.pos.x) + 0.5)))
                pl.pos.y = Math.floor(pl.pos.y) + 0.495;
            else
                pl.pos.x = Math.floor(pl.pos.x) + 0.505;
        if (gmst.level.g(Math.floor(pl.pos.x + 0.495), Math.floor(pl.pos.y + 0.495)) <= 0)
            if (Math.abs(pl.pos.y - (Math.floor(pl.pos.y) + 0.5)) < Math.abs(pl.pos.x - (Math.floor(pl.pos.x) + 0.5)))
                pl.pos.y = Math.floor(pl.pos.y) + 0.495;
            else
                pl.pos.x = Math.floor(pl.pos.x) + 0.495;
    }
    pkeys = keys;
    lastUpdateTime = currentTime;
    requestAnimationFrame(updatefunc);
}
requestAnimationFrame(updatefunc);
