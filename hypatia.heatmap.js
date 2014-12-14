/*
    Hypatia: Heatmap
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

Hypatia.HeatmapDEFAULTS = {
    minValue: 0,
    maxValue: 100,
    showGrid: true,
    gradient: [
        '#000000', '#111111', '#222222', '#333333',
        '#444444', '#555555', '#666666', '#777777',
        '#888888', '#999999', '#AAAAAA', '#BBBBBB',
        '#CCCCCC', '#DDDDDD', '#EEEEEE', '#FFFFFF' ]
};


Hypatia.Heatmap = function(params) {
    this.gradient = params.gradient || Hypatia.HeatmapDEFAULTS.gradient;
    this.width = params.width || 100;
    this.height = params.height || 100;
    this.minValue = params.minValue || Hypatia.HeatmapDEFAULTS.minValue;
    this.maxValue = params.maxValue || Hypatia.HeatmapDEFAULTS.maxValue;
    this.showGrid = params.showGrid;
    this.canvasElementId = params.canvasElementId;
}

Hypatia.Heatmap.prototype.valueToColor = function(value) {
    var range = this.maxValue - this.minValue;
    var colorDelta = range/this.gradient.length;
    var index = Math.floor(value/colorDelta);
    index = Math.min(this.gradient.length - 1, index);
    index = Math.max(0, index);
    return this.gradient[index];
};

Hypatia.Heatmap.prototype.drawGrid = function(context, data) {
    var height = data.length;
    var width = data[0].length;

    var deltaX = this.width / width;
    var deltaY = this.height / height;
    var y = 0;
    for (var i = 0; i < data.length; i++) {
        var x = 0;
        for (var j = 0; j < data[i].length; j++) {
            context.strokeStyle = '#333333';
            context.strokeRect(x, y, deltaX, deltaY);
            x += deltaX;
        }
        y += deltaY;
    }
}
Hypatia.Heatmap.prototype.draw = function(data) {
    var context = document.getElementById(this.canvasElementId).getContext('2d');

    var height = data.length;
    var width = data[0].length;

    var deltaX = Math.ceil(this.width / width);
    var deltaY = Math.ceil(this.height / height);

    var y = 0;
    for (var i = 0; i < data.length; i++) {
        var x = 0;
        for (var j = 0; j < data[i].length; j++) {
            var color = this.valueToColor(data[i][j]);
            context.fillStyle = color;
            context.fillRect(x, y, deltaX, deltaY);
            x += deltaX;
        }
        y += deltaY;
    }

    if (this.showGrid) {
        this.drawGrid(context, data);
    }
};
