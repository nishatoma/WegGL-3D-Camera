var modelBufferID;
var modelBuffer;

var red = vec4(1,0,0,1);
var green = vec4(0,1,0,1);
var blue = vec4(0,0,1,1);
var yellow = vec4(1, 1, 0, 1);
var orange = vec4(0, 1, 0.7, 1);

var ModelViewStack = [];

function pushModelView()
{
	ModelViewStack.push(modelViewMatrix);
}

function popModelView()
{
	modelViewMatrix = ModelViewStack.pop();
}

function sendModelView()
{
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
}


function initScene()
{
	modelBufferID = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, modelBufferID);
	gl.bufferData(gl.ARRAY_BUFFER, 16*64, gl.STATIC_DRAW);	
}

function drawScene()
{
    gl.depthRange(0.003, 1.01);
	gl.bindBuffer(gl.ARRAY_BUFFER, modelBufferID);
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	gl.uniform4fv(objectColor, green);
	drawGround();
	
	pushModelView();
	modelViewMatrix = mult(modelViewMatrix, scalem(0.5, 0.5, 0.5));
	modelViewMatrix = mult(modelViewMatrix, translate(0, 1, 0));
	sendModelView();
	gl.uniform4fv(objectColor, yellow);
	drawCube();
	
	pushModelView();
	modelViewMatrix = mult(modelViewMatrix, translate(4, 0, 0));
	sendModelView();
	gl.uniform4fv(objectColor, red);
	drawCube();
	popModelView();
	
	pushModelView();
	modelViewMatrix = mult(modelViewMatrix, translate(-4, 0, 0));
	sendModelView();
	gl.uniform4fv(objectColor, blue);
	drawCube();
	popModelView();
	
	popModelView();
}

function drawGround()
{
	modelBuffer = [];
	modelBuffer.push(vec4(-5, -0.01, -5));
	modelBuffer.push(vec4(5, -0.01, -5));
	modelBuffer.push(vec4(5, -0.01, 5));
	modelBuffer.push(vec4(-5, -0.01, 5));
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(modelBuffer));
	gl.drawArrays(gl.TRIANGLE_FAN, 0, modelBuffer.length);
}

function drawCube()
{
	var verticies = [vec4(-1, -1, -1), vec4(-1, -1, 1), vec4(-1, 1, -1), vec4(-1, 1, 1),
					vec4(1, -1, -1), vec4(1, -1, 1), vec4(1, 1, -1), vec4(1, 1, 1)]; 
	var whatType = gl.TRIANGLE_FAN;
	modelBuffer = [];
	modelBuffer.push(verticies[0]);
	modelBuffer.push(verticies[1]);
	modelBuffer.push(verticies[3]);
	modelBuffer.push(verticies[2]);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(modelBuffer));
	gl.drawArrays(whatType, 0, modelBuffer.length);
	modelBuffer = [];
	modelBuffer.push(verticies[5]);
	modelBuffer.push(verticies[4]);
	modelBuffer.push(verticies[6]);
	modelBuffer.push(verticies[7]);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(modelBuffer));
	gl.drawArrays(whatType, 0, modelBuffer.length);
	modelBuffer = [];
	modelBuffer.push(verticies[1]);
	modelBuffer.push(verticies[5]);
	modelBuffer.push(verticies[7]);
	modelBuffer.push(verticies[3]);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(modelBuffer));
	gl.drawArrays(whatType, 0, modelBuffer.length);
	modelBuffer = [];
	modelBuffer.push(verticies[4]);
	modelBuffer.push(verticies[0]);
	modelBuffer.push(verticies[2]);
	modelBuffer.push(verticies[6]);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(modelBuffer));
	gl.drawArrays(whatType, 0, modelBuffer.length);
	modelBuffer = [];
	modelBuffer.push(verticies[2]);
	modelBuffer.push(verticies[3]);
	modelBuffer.push(verticies[7]);
	modelBuffer.push(verticies[6]);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(modelBuffer));
	gl.drawArrays(whatType, 0, modelBuffer.length);
	modelBuffer = [];
	modelBuffer.push(verticies[1]);
	modelBuffer.push(verticies[0]);
	modelBuffer.push(verticies[4]);
	modelBuffer.push(verticies[5]);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(modelBuffer));
	gl.drawArrays(whatType, 0, modelBuffer.length);
}