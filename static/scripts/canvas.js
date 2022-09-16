var canvas = document.querySelector('canvas');
var mazeX = 10;
var mazeY = 10;
var ca = Math.min(window.innerHeight, window.innerWidth) * 0.8
console.log(ca)

canvas.width = ca * 1.025;
canvas.height = ca * 1.025;
// var margin = ((window.innerWidth/2 - ca) / 2);
// canvas.style.marginLeft = margin + "px";
// canvas.style.marginRight = margin + "px";

var boxX = ca / mazeX;
var boxY = ca / mazeY;
var c = canvas.getContext('2d');




var mode = false
var start = "B_0_0";
var end = "";

var vertices = {};
var edges = {};
var boxes = {};



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
		// console.log(x, y, width, height)
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.is_end = false;
	}

	draw() {
		c.strokeRect(this.x, this.y, this.width, this.height);
	};

	make_end() {
		this.is_end = true;
		c.fillStyle = "rgba(255, 0, 0, 0.9)";
		c.fillRect(this.x, this.y, this.width, this.height);
		c.fillStyle = "rgba(255, 255, 255, 1)";
		// c.font = boxY / 2.75 + "px Arial";
		c.fillText("End", this.x + px(0.05), this.y + py(0.5), boxX);
	}
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

// function sleep(ms) {
// 	return new Promise(
// 	  resolve => setTimeout(resolve, ms)
// 	);
//   }

function start_box() {
	c.fillStyle = "rgba(0, 255, 125, 1)";
	c.fillRect(px(0), py(0), boxX, boxY);
	c.fillStyle = "rgba(0, 0, 0, 1)";
	c.font = boxY / 2.75 + "px Arial";
	c.fillText("Start", px(0.1), py(0.6), boxX);
}

// function end_box()

function draw_guide_boxes_vertices(v) {
	c.strokeStyle = "rgba(0, 0, 0, 0.1)";
	for (let i = 0; i < mazeX + 1; i++) {
		for (let j = 0; j < mazeY + 1; j++) {
			if (mazeX - i && mazeY - j) {
				b = new Box(px(i), py(j), boxX, boxY);
				b.draw();
				boxes["B_" + i + "_" + j] = b;
			};
			cn = new Vertex(px(i), py(j), Math.min(boxX, boxY) / 100);
			if (v) { vertices["V_" + i + "_" + j] = cn; };
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
	c.clearRect(0, 0, ca * 1.025, ca * 1.025);
	c.fillStyle = "rgba(255, 255, 255, 1)";
	c.fillRect(0, 0, ca * 1.025, ca * 1.025);
	vertices = {};
	edges = {};
	boxes = {};
	end = "";
	start_box();
	draw_guide_boxes_vertices(true);
	draw_edges();
	edges["E[V_1_0][V_1_1]"].draw();
}

function rebuild() {
	c.clearRect(0, 0, ca * 1.025, ca * 1.025);
	// reset();
	start_box();
	draw_guide_boxes_vertices(false);

	c.strokeStyle = "rgba(0, 0, 0, 1)";
	for (var i in edges) {
		if (edges[i].show) {
			edges[i].draw();
		}
	}
}

function get_state() {
	let edges_ = {};
	for (var i in edges) {
		if (edges[i].show) {
			edges_[i] = 1;
		}
		else {
			edges_[i] = 0;
		}
	}
	return {
		edges: edges_,
		end: end
	};
}

function get_evaluated() {
	if (end == "") {
		alert("You need to set an end position before submission!");
	}
	else {
		let url = "/evaluate";
		let dataSend = get_state();
		let spinner = "Result&emsp;<div class='spinner-border text-success' role='status'><span class='sr-only'></span></div>";
		document.getElementById("score").innerHTML = ""
		document.getElementById("result").innerHTML = spinner;
		let xml = new XMLHttpRequest();
		xml.open("POST", url, true);
		xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xml.onload = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
				document.getElementById("score").innerHTML = "Score: " + JSON.parse(this.responseText).score;
				document.getElementById("result").innerHTML = "Result";
			}
		}
		xml.send(JSON.stringify(dataSend));
	}
}

function download_maze(){
	data = get_state();
	const blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
	console.log("download_maze called");
	const href = URL.createObjectURL(blob);

	document.getElementById("download_href").href=href
}

function toggle_end_button() {
	let end_toggle_button = document.getElementById("put_end");
	if (mode) {
		end_toggle_button.innerHTML = "Set End Position";
	}
	else {
		end_toggle_button.innerHTML = "Put More Barriers";
	}
	mode = !mode
}

/////////////////////////////////////////////
/// start calling the functions from here // 
///////////////////////////////////////////


reset();

canvas.addEventListener("click",
	function (event) {
		var x = event.offsetX;
		var y = event.offsetY;
		if (mode) {
			endnew = "B_" + Math.floor(pxinv(x)) + "_" + Math.floor(pxinv(y));
			if (endnew != start) {
				if (end != "") {
					rebuild();
					boxes[end].is_end = false;
				}
				end = endnew;
				boxes[end].make_end();
			};
		}
		else {
			for (let i in edges) {
				let edge = edges[i];
				if (!edge.outer) {
					if (edges[i].area.on([x, y])) {
						if (!edges[i].show) { edges[i].draw(); }
						else {
							edges[i].show = false;
							rebuild();
							if (end != "") {
								boxes[end].make_end();
							}
						}
					}

				}
			}
		}
	}
);

document.getElementById("put_end").addEventListener("click", toggle_end_button);

document.getElementById("reset").addEventListener("click", reset);

document.getElementById("send").addEventListener("click", get_evaluated)

document.getElementById("download").addEventListener("click", download_maze)

// get_evaluated(get_state(), "/evaluate");

