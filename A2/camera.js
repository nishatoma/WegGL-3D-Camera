/*
Name: Nisha Shlaymoon
Student Number: 213-415-864
Partner: Michael Founk
Student Number: 213641204
*/
var cameraLookFrom = vec3(4.0, 3.0, 8.0);
var cameraLookAt = vec3(0.0, 0.0, 0.0);
var cameraLookUp = vec3(0.0, 1.0, 0.0);
var fovY = 50;
var near = .1;
var far = 100;
//--------------------------------------
// CameraLookUp must be tracked with cameraLookFrom
// Otherwise it looks wrong when we load the camera controls
cameraLookUpnew = add(cameraLookFrom, cameraLookUp);
//--------------------------------------
var cameraVerticies;
var cameraBufferID;
//--------------------------------------
// Origins depending on quadrant we're in
var originX2 = 225;	// quadrant 2
var originY2 = 150;	// quadrant 2
var originX3 = 225;	// quadrant 3
var originY3 = 450;	// quadrant 3
var originX4 = 675;	// quadrant 4
var originY4 = 450;	// quadrant 4
//--------------------------------------
// To check when mouse is clicked and held down
var mouseDown;
var mouseUp = true;
var vec1;
// Used for incrementing y for screen zoom
var currentPosition = 0;
//--------------------------------------
// Scaling points
var scaleX = 14.7;
var scaleY = 15.0;
// When the mouse button is held down
function mouseButtonDown(x, y) {
    // change FoV by -1 or +1 depending on
    // which direction the mouse scrolls in
    var fovDist = 1.2;
    var quad = getQuad(x, y);
    // Prevent from calculating distance 
    // When we already locked in the mouse
    if (mouseUp == true && quad != 1) {
        vec1 = returnVec(x, y, quad);
        mouseUp = false;
    }
    // Whenever the mouseButtonDown method is executed,
    // This statement will be true.
    mouseDown = true;
    if (mouseDown) {
        if (quad != 1) {
            computeOrigin(x, y, quad, vec1);
        } else {
            if (y > currentPosition) {
                fovY += fovDist;
                if (fovY > 90) {
                    fovY = 90;
                }
            } else {
                fovY -= fovDist;
                if (fovY < 20) {
                    fovY = 20;
                }
            }
            currentPosition = y;
        }
    }
}
//--------------------------------------
function mouseButtonUp(x, y) {
    // When we let go of the mouse,
    // The mouse down event dies
    mouseUp = true;
    mouseDown = false;
}
//--------------------------------------
function mouseMove(x, y) {
    // your code goes here
    if (mouseDown) {
        mouseButtonDown(x, y);
    }
    document.getElementById("ScreenInfo").innerHTML = "(" + x + ", " + y + ")";
}
//--------------------------------------
function initCamera() {
    // your code goes here
    cameraBufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cameraBufferID);
    gl.bufferData(gl.ARRAY_BUFFER, 4 * 64, gl.STATIC_DRAW);
}
//--------------------------------------
// returns a 3-D vector that is used
// to represent the vector that is following
// the mouse pointer, given the points x,y
// quadrant and an initial vector.
function computeCameraOrientation(x, y, quad, vec) {
    if (quad == 2) {
        x -= originX2;
        y -= originY2;
        vec[0] = (1 / scaleX) * x;
        vec[1] = (-1 / scaleY) * y;
        if (vec == cameraLookFrom) {
            cameraLookUpnew[0] = vec[0] + cameraLookUp[0];
            cameraLookUpnew[1] = vec[1] + cameraLookUp[1];
            cameraLookUpnew[2] = vec[2] + cameraLookUp[2];
        }
    } else if (quad == 3) {
        x -= originX3;
        y -= originY3;
        vec[0] = (1 / scaleX) * x;
        vec[2] = (1 / scaleY) * y;
        if (vec == cameraLookFrom) {
            cameraLookUpnew[0] = vec[0] + cameraLookUp[0];
            cameraLookUpnew[1] = vec[1] + cameraLookUp[1];
            cameraLookUpnew[2] = vec[2] + cameraLookUp[2];
        }
    } else if (quad == 4) {
        x -= originX4;
        y -= originY4;
        vec[2] = (-1 / scaleX) * x;
        vec[1] = (-1 / scaleY) * y;
        if (vec == cameraLookFrom) {
            cameraLookUpnew[0] = vec[0] + cameraLookUp[0];
            cameraLookUpnew[1] = vec[1] + cameraLookUp[1];
            cameraLookUpnew[2] = vec[2] + cameraLookUp[2];
        }
    }
    return vec;
}
//--------------------------------------
// Draws the camera controls based on the
// camera control vectors provided.
function drawCameraControls() {
    // your code goes here
    gl.depthRange(0, 0.001);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    var cameraBuffer = [];
    gl.uniform4fv(objectColor, orange);
    if (cameraLookUpnew[0] == cameraLookFrom[0] && cameraLookUpnew[1] == cameraLookFrom[1]) {
        cameraLookUpnew[0] += 0.00001;
        cameraLookUpnew[1] += 0.00001;
    }
    cameraBuffer.push(cameraLookAt);
    cameraBuffer.push(cameraLookFrom);
    cameraBuffer.push(cameraLookUpnew);
    cameraLookUp = subtract(cameraLookUpnew, cameraLookFrom);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(cameraBuffer));
    gl.lineWidth(2);
    gl.drawArrays(gl.LINE_STRIP, 0, cameraBuffer.length);
    gl.lineWidth(3);
}
//--------------------------------------
// Determines the current quadrant the mouse is on
function getQuad(x, y) {
    var quad;
    if ((x > 0 && x < 450) && (y > 0 && y < 300)) {
        quad = 2;
    } else if ((x > 0 && x < 450) && (y > 300 && y < 600)) {
        quad = 3;
    } else if ((x > 450 && x < 898) && (y > 300 && y < 598)) {
        quad = 4;
    } else {
        quad = 1;
    }
    return quad;
}
//--------------------------------------
// Calculates the distance between 2 points
// In the 2D plane
function getDistance(x1, y1, x2, y2) {
    var a = 0.0;
    var b = 0.0;
    a = x1 - x2;
    b = y1 - y2;
    return Math.sqrt(a * a + b * b);
}
//--------------------------------------
// compute the relative origin depending on
// the quadrant we are in
function computeOrigin(x, y, quad, vec) {

    switch (quad) {
        case 2:
            vec = computeCameraOrientation(x, y, quad, vec);
            break;
        case 3:
            vec = computeCameraOrientation(x, y, quad, vec);
            break;
        case 4:
            vec = computeCameraOrientation(x, y, quad, vec);
            break;
    }
}
//--------------------------------------
// Returns the vector we work with depending
// on which is the closest to the mouse pointer
// Either returns: cameraLookAt, cameraLookFrom
// or cameraLookUp
function returnVec(x, y, quad) {
    var vecReturned;
    var vec = vec3(0, 0, 0);
    var d1 = 0.0;
    var d2 = 0.0;
    var d3 = 0.0
    var smallest = 0.0;
    switch (quad) {
        case 2:
            vec = computeCameraOrientation(x, y, quad, vec);
            d1 = getDistance(vec[0], vec[1], cameraLookAt[0], cameraLookAt[1]);
            d2 = getDistance(vec[0], vec[1], cameraLookFrom[0], cameraLookFrom[1]);
            d3 = getDistance(vec[0], vec[1], cameraLookUpnew[0], cameraLookUpnew[1]);
            smallest = minOfThree(d1, d2, d3);
            vecReturned = getClosestVector(d1, d2, d3, smallest);
            break;
        case 3:
            vec = computeCameraOrientation(x, y, quad, vec);
            d1 = getDistance(vec[0], vec[2], cameraLookAt[0], cameraLookAt[2]);
            d2 = getDistance(vec[0], vec[2], cameraLookFrom[0], cameraLookFrom[2]);
            d3 = getDistance(vec[0], vec[2], cameraLookUpnew[0], cameraLookUpnew[2]);
            smallest = minOfThree(d1, d2, d3);
            vecReturned = getClosestVector(d1, d2, d3, smallest);
            break;
        case 4:
            vec = computeCameraOrientation(x, y, quad, vec);
            d1 = getDistance(vec[2], vec[1], cameraLookAt[2], cameraLookAt[1]);
            d2 = getDistance(vec[2], vec[1], cameraLookFrom[2], cameraLookFrom[1]);
            d3 = getDistance(vec[2], vec[1], cameraLookUpnew[2], cameraLookUpnew[1]);
            smallest = minOfThree(d1, d2, d3);
            vecReturned = getClosestVector(d1, d2, d3, smallest);
            break;
    }
    return vecReturned;
}
//--------------------------------------
// Returns the smallest point out of 3 given points
function minOfThree(a, b, c) {
    var min = 0.0;
    min = Math.min(Math.min(a, b), c);
    return min;
}
//--------------------------------------
// return the vector that is closest to the
// current mouse point
function getClosestVector(d1, d2, d3, smallest, quad) {
    var vecReturned = vec3(0.0, 0.0, 0.0);
    if (d1 == smallest) {
        vecReturned = cameraLookAt;
    } else if (d2 == smallest) {
        vecReturned = cameraLookFrom;
    } else {
        vecReturned = cameraLookUpnew;
    }
    return vecReturned;
}
//--------------------------------------
//--------------------------------------