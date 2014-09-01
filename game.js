"use strict";

var Splat = require("splatjs");
var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
		"left-paw": "img/paw-left.png",
		"right-paw": "img/paw-right.png"
	},
	"sounds": {
	},
	"fonts": {
	},
	"animations": {
		"left-paw": {
			"strip": "img/paw-left.png",
			"frames": 1,
			"msPerFrame": 100
		},
		"right-paw": {
			"strip": "img/paw-right.png",
			"frames": 1,
			"msPerFrame": 100
		}
	}
};

var game = new Splat.Game(canvas, manifest);

function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow((x1 - x2),2) + Math.pow((y1 - y2), 2));
}

function drawCircle(context, color, radius, strokeColor, strokeSize, x, y) {
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI, false);
	context.fillStyle = color;
	context.fill();
	context.lineWidth = strokeSize;
	context.strokeStyle = strokeColor;
	context.stroke();
}

function drawEntities(context, entities) {
	entities.sort(function(a, b) {
		return b.y - a.y;
	});
	for (var i in entities) {
		if (entities.hasOwnProperty(i)) {
			entities[i].draw(context);
  		}
	}
}

// function centerText(context, text, offsetX, offsetY) {
// 	var w = context.measureText(text).width;
// 	var x = offsetX + (canvas.width / 2) - (w / 2) | 0;
// 	var y = offsetY | 0;
// 	context.fillText(text, x, y);
// }

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// initialization
	var scene = this;
	var leftPaw = game.animations.get("left-paw");
	var rightPaw = game.animations.get("right-paw");

	scene.leftPaw = new Splat.AnimatedEntity(-300,0,rightPaw.width, rightPaw.height, rightPaw,-432,-104);
	scene.leftPaw.radius = 100;
	scene.leftPaw.draw = function(context){
		Splat.AnimatedEntity.prototype.draw.call(this, context);
		drawCircle(context, "rgba(0,0,255,"+this.alpha+")", this.radius, "rgba(0,0,255,1)", 1, this.x, this.y);
	};
	scene.rightPaw = new Splat.AnimatedEntity(500,0,leftPaw.width, leftPaw.height, leftPaw,-125,-121);
	scene.rightPaw.radius = 100;
	scene.rightPaw.draw = function(context){
		Splat.AnimatedEntity.prototype.draw.call(this, context);
		drawCircle(context, "rgba(0,0,255,"+this.alpha+")", this.radius, "rgba(0,0,255,1)", 1, this.x, this.y);
	};

	scene.laser = new Splat.Entity(canvas.width/2, canvas.height/2, 0, 0);
	scene.laser.radius = 100;
	scene.laser.draw = function(context){
		drawCircle(context, "rgba(255,0,0,.4)", this.radius, "rgba(255,0,0,1)", 1, this.x, this.y);
	};

	scene.leftPaw.alpha = ".3";
	scene.rightPaw.alpha = ".3";
	scene.drawables = [
	scene.leftPaw,
	scene.rightPaw,
	scene.laser
	];
}, function() {
	// simulation
	this.leftPaw.x = game.mouse.x - 200;
	this.leftPaw.y = game.mouse.y;
	this.rightPaw.x = game.mouse.x + 200;
	this.rightPaw.y = game.mouse.y;


	if (distance(this.laser.x, this.laser.y, this.leftPaw.x, this.leftPaw.y) < this.laser.radius + this.leftPaw.radius){
		this.leftPaw.alpha = "1";
	}else{
		this.leftPaw.alpha = ".3";
	}
	if (distance(this.laser.x, this.laser.y, this.rightPaw.x, this.rightPaw.y) < this.laser.radius + this.rightPaw.radius){
		this.rightPaw.alpha = "1";
	}else{
		this.rightPaw.alpha = ".3";
	}
}, function(context) {
	// draw
	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, canvas.width, canvas.height);

	var drawables = this.drawables.slice(0);
	drawEntities(context, drawables);


}));

game.scenes.switchTo("loading");
