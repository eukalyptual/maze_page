// console.log("canvas.js loaded");

var canvas = document.querySelector('canvas');
var mazeX = 10;
var mazeY = 10;
var ca = window.innerHeight * 0.8
if (window.innerWidth < window.innerHeight) {
	ca = window.innerWidth * 0.8
}

canvas.width = ca * 1.025;
canvas.height = ca * 1.025;
var margin = ((window.innerWidth - ca) / 2);
canvas.style.marginLeft = margin + "px";
canvas.style.marginRight = margin + "px";

var boxX = ca / mazeX;
var boxY = ca / mazeY;
var c = canvas.getContext('2d');

class Vertex {
	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
	}

	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.stroke();
		c.fill();
	};
}

class Box {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw() {
		c.beginPath();
		c.rect(this.x, this.y, this.width, this.height);
		c.stroke();
		c.fill();
	};
}

class st_line {
	constructor(p1, p2) {
		this.m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
		this.c = p1[1] - this.m * p1[0];
	}

	func(x) {
		return this.m * x[0] + this.c - x[1];
	}

	same_side(p1, p2) {
		return this.func(p1) * this.func(p2) > 0;
	}
}

class Area {
	constructor(A, C) {
		this.A = A;
		this.B = [(A[0] + A[1] + C[0] - C[1]) / 2, (-A[0] + A[1] + C[0] + C[1]) / 2];
		this.C = C;
		this.D = [(A[0] - A[1] + C[0] + C[1]) / 2, (A[0] + A[1] - C[0] + C[1]) / 2];
		this.M = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
		// console.log(this.M)
		this.lines = [
			new st_line(this.A, this.B),
			new st_line(this.B, this.C),
			new st_line(this.C, this.D),
			new st_line(this.D, this.A)
		];
	};

	on(P) {
		for (var i = 0; i < this.lines.length; i++) {
			// console.log(i)
			if (!this.lines[i].same_side(P, this.M)) {
				// console.log("false")
				return false;
			}
		}
		return true;
	}
}

class Edge {
	constructor(p1, p2, outer = false) {
		this.p1 = [p1.x, p1.y];
		this.p2 = [p2.x, p2.y];
		// console.log("hi", this.p1, this.p2)
		this.outer = outer;
		this.show = false;
		this.area = new Area(this.p1, this.p2);
	}

	draw() {
		this.show = true;
		c.beginPath();
		c.moveTo(this.p1[0], this.p1[1]);
		c.lineTo(this.p2[0], this.p2[1]);
		c.fillStyle = this.color;
		c.stroke();
		c.fill();
	};
}

function px(x) { return x * boxX + ca * 0.0125 }
function py(x) { return x * boxY + ca * 0.0125 }
function pxinv(x) { return (x - ca * 0.0125) / boxX }
function pyinv(x) { return (x - ca * 0.0125) / boxY }
// c.fillRect(100, 100, 100, 100);

var vertices = {};
var edges = {};
var boxes = {};

// function sleep(ms) {
// 	return new Promise(
// 	  resolve => setTimeout(resolve, ms)
// 	);
//   }

function start_box() {
	c.fillStyle = "rgba(0, 255, 125, 1)";
	c.fillRect(px(0), py(0), boxX, boxY);
	c.fillStyle = "rgba(0, 0, 0, 1)";
	c.font = boxY/2.75 + "px Arial";
	c.fillText("Start", px(0.1), py(0.6), boxX);
}

function draw_guide_boxes_vertices(v) {
	c.strokeStyle = "rgba(0, 0, 0, 0.1)";
	for (let i = 0; i < mazeX + 1; i++) {
		for (let j = 0; j < mazeY + 1; j++) {
			if (mazeX - i && mazeY - j) {
				c.strokeRect(px(i), py(j), boxX, boxY);
			};
			cn = new Vertex(px(i), py(j), Math.min(boxX, boxY) / 15);
			if(v){vertices["V_" + i + "_" + j] = cn;};
			cn.draw();
		}
	}
}

function draw_edges() {
	c.strokeStyle = "rgba(0, 0, 0, 1)";
	for (let j = 0; j <= mazeY; j++) {
		for (let i = 0; i <= mazeX; i++) {
			// console.log(i, j)
			if (mazeX - i) {
				bl = new Edge(vertices["V_" + i + "_" + j], vertices["V_" + (i + 1) + "_" + j]);
				edges["E[V_" + i + "_" + j + "][V_" + (i + 1) + "_" + j + "]"] = bl;
				if (j == 0 || j == mazeY) {
					bl.draw();
					bl.outer = true;
				}
				// console.log(1)
				// await sleep(100);
			}
			if (mazeY - j) {
				bb = new Edge(vertices["V_" + i + "_" + j], vertices["V_" + i + "_" + (j + 1)]);
				edges["E[V_" + i + "_" + j + "][V_" + i + "_" + (j + 1) + "]"] = bb;
				if (i == 0 || i == mazeX) {
					bb.draw();
					bb.outer = true;
				}
				// console.log(1)
				// await sleep(100);
			}
		}
	}
}

function reset() {
	start_box();
	draw_guide_boxes_vertices(true);
	draw_edges();
}

function rebuild() {
	c.clearRect(0, 0, ca * 1.025, ca * 1.025);
	// reset();
	start_box();
	draw_guide_boxes_vertices(false);

	c.strokeStyle = "rgba(0, 0, 0, 1)";
	for (var i in edges) {
		if(edges[i].show){
			edges[i].draw();
		}
	}
}

reset();

console.log(Object.keys(edges).length);

// console.log(new Area([0, 0], [0, 1]).in([0.001, 0.99]));

canvas.addEventListener("click",
	function (event) {
		// console.log(event);
		// console.log(event.x, event.y);
		var x = event.offsetX;
		var y = event.offsetY;
		for (let i in edges) {
			let edge = edges[i];
			if (!edge.outer) {
				if (edges[i].area.on([x, y])) {
					// console.log(i)
					if (!edges[i].show) { edges[i].draw(); }
					else {
						edges[i].show = false;
						rebuild();
					}
				}

			}
		}
	}
);