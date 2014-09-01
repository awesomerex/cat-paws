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

function drawEntities(context, entities) {
	entities.sort(function(a, b) {
		return b.y - a.y;
	});
	for (var i in entities) {
		if (entities.hasOwnProperty(i)) {
			console.log("drawing");
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
	scene.leftPawOffsetX = -182;
	// var leftPawOffsetY = 258;
	// var rightPawOffsetX = 201;
	// var rightPawOffsetY = 301;

	scene.leftPaw = new Splat.AnimatedEntity(-300,0,rightPaw.width, rightPaw.height, rightPaw,0,0);
	scene.rightPaw = new Splat.AnimatedEntity(500,0,leftPaw.width, leftPaw.height, leftPaw,0,0);

	scene.leftHit = new Splat.Entity(scene.leftPaw.x, scene.leftPaw.y, 182, 258);
	scene.rightHit = new Splat.Entity(scene.rightPaw.x, scene.rightPaw.y, 201, 301);



	scene.drawables = [
	scene.leftPaw,
	scene.rightPaw
	];
}, function() {
	// simulation
	this.leftPaw.x = game.mouse.x - 650;
	this.leftPaw.y = game.mouse.y;
	this.rightPaw.x = game.mouse.x + 75;
	this.rightPaw.y = game.mouse.y;

	this.leftHit.x = this.leftPaw.x + this.leftPaw.width + this.leftPawOffsetX;
	this.rightHit.x = this.rightPaw.x;
}, function(context) {
	// draw
	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, canvas.width, canvas.height);

	var drawables = this.drawables.slice(0);
	drawEntities(context, drawables);

	context.strokeRect(this.leftHit.x, this.leftHit.y, this.leftHit.width, this.leftHit.height);
	context.strokeRect(this.rightHit.x, this.rightHit.y, this.rightHit.width, this.rightHit.height);
	context.fillStyle = "#07B4F2F";


}));

game.scenes.switchTo("loading");
