/*
    Hypatia: Heartbeat
    Copyright (C) 2014 Ståle Dahl <stalehd@gmail.com>

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

var Hypatia = Hypatia || {};

Hypatia.Heartbeat = function(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.delta = 4;
    this.backgroundColor = '#000000';
    this.foregroundColor = '#00ff00';
    this.beatPositions = new Array();
    this.beatWidth = this.height/6;
    this.lineWidth = 2;
};

Hypatia.Heartbeat.prototype.setLineWidth = function(w) {
    this.lineWidth = w;
};

Hypatia.Heartbeat.prototype.setBackgroundColor = function(c) {
    this.backgroundColor = c;
};

Hypatia.Heartbeat.prototype.setLineColor = function(c) {
    this.foregroundColor = c;
};

Hypatia.Heartbeat.prototype.moveBeats = function() {
    for (var i = 0; i < this.beatPositions.length; i++) {
        this.beatPositions[i] += this.delta;
    }
};

Hypatia.Heartbeat.prototype.expireBeats = function() {
    this.beatPositions.filter(function(v) {
        return v < this.width;
    });
};

function doAnimation(hb, context) {
    var animationFunc = function() {
        hb.moveBeats();
        hb.drawBeats(context, hb.foregroundColor);
        hb.expireBeats();
        requestAnimationFrame(animationFunc);
    };
    requestAnimationFrame(animationFunc);
}

Hypatia.Heartbeat.prototype.start = function() {
    // start the heart beats
    var context = this.canvas.getContext('2d');
    doAnimation(this, context);
};
Hypatia.Heartbeat.prototype.drawBeats = function(context, color) {
    context.fillStyle = this.backgroundColor;
    context.fillRect(0,0,this.width, this.height);

    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = this.lineWidth;
    context.moveTo(0, this.height/2);

    var inc = this.beatWidth / 3;
    var amplitude = this.height / 3;

    for (var i = this.beatPositions.length - 1; i >= 0; i--) {
        var beatStart = this.beatPositions[i];
        context.lineTo(beatStart, this.height/2);
        context.lineTo(beatStart + inc, this.height/2 -  amplitude);
        context.lineTo(beatStart + inc * 1.5, this.height/2 + amplitude/2);
        context.lineTo(beatStart + inc * 2, this.height/2);
    }

    context.lineTo(this.width, this.height/2);
    context.stroke();
};

Hypatia.Heartbeat.prototype.beat = function() {
    if (this.beatPositions.length > 0 && this.beatPositions[this.beatPositions.length - 1] < 0) {
        return;
    }
    this.beatPositions.push(-this.beatWidth);
};
