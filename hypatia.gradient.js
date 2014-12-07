/*
    Hypatia: Gradient, interpolation and heatmap demo
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

Hypatia.Gradients = Hypatia.Gradients || {};

Hypatia.Gradients.GRAYSCALE = {
    rOffset: 0,
    gOffset: 0,
    bOffset: 0,
    rFunc: Math.cos,
    gFunc: Math.cos,
    bFunc: Math.cos,
    startAngle: Math.PI,
    endAngle: 0
};

Hypatia.Gradients.REDGREENBLUE = {
    rOffset: Math.PI/2,
    gOffset: 4*Math.PI/3,
    bOffset: -Math.PI/2,
    rFunc: Math.sin,
    gFunc: Math.cos,
    bFunc: Math.sin,
    startAngle: Math.PI,
    endAngle: 0,
};

Hypatia.Gradients.OILYCHROME =  {
    rOffset: 0,
    gOffset: Math.PI/3,
    bOffset: 2 * Math.PI/3,
    rFunc: Math.cos,
    bFunc: Math.cos,
    gFunc: Math.cos,
    startAngle: 0,
    endAngle: Math.PI*5
};

Hypatia.Gradients.DESERT =  {
    rOffset: 0,
    gOffset: Math.PI/3,
    bOffset: 2 * Math.PI/3,
    rFunc: Math.sin,
    bFunc: Math.sin,
    gFunc: Math.sin,
    startAngle: 0,
    endAngle: Math.PI
};

Hypatia.Gradient = function(params) {
    if (!params) {
        params = Hypatia.Gradients.GRAYSCALE;
    }
    this.params = params;
}

/**
 * Generate gradient by taking a little trip around the
 * color circle. Fidlle with the angle and offsets to
 * generate different gradients.
 */
Hypatia.Gradient.prototype.getColors = function(numElements) {
    if (!numElements) {
        numElements = 16;
    }
    function colorToText(color) {
        var ret = new Number(color | 0x1000000);
        return '#' + ret.toString(16).substr(1,7);
    }

    var gradient = new Array();

    var delta = (this.params.endAngle - this.params.startAngle) / numElements;
    var angle = this.params.startAngle;

    for (var i = 0; i < numElements; i++) {
        var rIntensity = Math.round(this.params.rFunc(angle + this.params.rOffset) * 127 + 128, 0);
        var gIntensity = Math.round(this.params.gFunc(angle + this.params.gOffset) * 127 + 128, 0);
        var bIntensity = Math.round(this.params.bFunc(angle + this.params.bOffset) * 127 + 128, 0);
        var color = rIntensity << 16 | gIntensity << 8 | bIntensity;
        gradient.push(colorToText(color));
        angle += delta;
    }
    return gradient;
}
