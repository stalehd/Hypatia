/*
    Hypatia: Interpolation (ugly version)
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

function TwoDArray() {
    this.value = [];
}

TwoDArray.prototype.set = function(x, y, value) {
    if (this.value[y] == undefined) {
        this.value[y] = [];
    }
    this.value[y][x] =value;
};

TwoDArray.prototype.get = function(x, y) {
    return this.value[y][x];
};

TwoDArray.prototype.getArray = function() {
    return this.value;
};

// See http://en.wikipedia.org/wiki/Bilinear_interpolation
function bilinerInterpolation(x, y, x1, y1, x2, y2, x1y1, x2y1, x1y2, x2y2) {
    return 1 / ((x2 - x1) * (y2 - y1))
        * (x1y1 * (x2 - x) * (y2 - y)
            + x2y1 * (x - x1) * (y2 - y)
            + x1y2 * (x2 - x) * (y - y1)
            + x2y2 * (x - x1) * (y - y1));
}

// Add points (x1, y1) ... (x2, y2) and interpolate points inbetween
function addAndInterpolate(dataToInterpolate, x1, y1, x1y1, x2y1, x1y2, x2y2, multiplier) {
    var x2 = x1 + multiplier + 1;
    var y2 = y1 + multiplier + 1;

    var currentY = y1;
    // Add the first row with x1y1 and x2y1
    dataToInterpolate.set(x1, y1, x1y1);
    var currentX = x1;
    for (var i = 1; i <= multiplier; i++) {
        currentX = x1 + i;
        var value = bilinerInterpolation(currentX, currentY, x1, y1, x2, y2, x1y1, x2y1, x1y2, x2y2);
        dataToInterpolate.set(currentX, currentY, value);
    }
    dataToInterpolate.set(currentX + 1, currentY, x2y1);

    // Add the n rows next
    currentY++;
    for (var j = 1; j <= multiplier; j++) {
        for (var i = 0; i < (multiplier + 2); i++) {
            currentX = x1 + i;
            var value = bilinerInterpolation(currentX, currentY, x1, y1, x2, y2, x1y1, x2y1, x1y2, x2y2);
            dataToInterpolate.set(currentX, currentY, value);
        }
        currentY++;
    }
    // add the last row with x1y2, x2y2
    dataToInterpolate.set(x1, currentY, x1y2);
    for (var i = 1; i <= multiplier; i++) {
        currentX = x1 + i;
        var value = bilinerInterpolation(currentX, currentY, x1, y1, x2, y2, x1y1, x2y1, x1y2, x2y2);
        dataToInterpolate.set(currentX, currentY, value);
    }
    dataToInterpolate.set(x2, y2, x2y2);

    return { x: x2, y: y2 };
}

function expandAndInterpolate(data, multiplier) {
    var interpolated = new TwoDArray();

    var currentY = 0;
    for (var y = 1; y < data.length; y++) {
        var currentX = 0;
        var maxY = 0;
        for (var x = 1; x < data[y].length; x++) {
            var newPos = addAndInterpolate(interpolated, currentX, currentY, data[y-1][x-1], data[y-1][x], data[y][x-1], data[y][x], multiplier);
            currentX = newPos.x + 1;
            maxY = newPos.y;
        }
        currentY = maxY + 1;
    }

    //interpolated.dump();
    return interpolated.getArray();
}
