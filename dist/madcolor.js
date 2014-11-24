function rand(n) {
	return Math.floor(Math.random()*n);
}

function int2hex(n) {
	var s = n.toString(16);
	while (s.length < 2) s = "0"+s;
	return s;
}

function Color(r, g, b) {
	this.r = Math.min(Math.max(Math.round(r), 0), 255);
	this.g = Math.min(Math.max(Math.round(g), 0), 255);
	this.b = Math.min(Math.max(Math.round(b), 0), 255);
}

Color.random = function(min, max) {
	return new Color(min + rand(max-min), min + rand(max-min), min + rand(max-min));
};

Color.randomSat = function() {
	return Color.fromHSV(rand(360), 1, 1);
};

Color.HSVMat = function(c, x, i) {
	return [
		[c, x, 0],
		[x, c, 0],
		[0, c, x],
		[0, x, c],
		[x, 0, c],
		[c, 0, x]
	][i];
};

Color.fromHSV = function(h, s, v) {
	var C = v*s,
		m = v - C,
		H = (h % 360)/60,
		X = C*(1 - Math.abs((H%2) - 1)),
		mat = Color.HSVMat(C, X, Math.floor(H));
	return new Color(Math.round((mat[0]+m)*255), Math.round((mat[1]+m)*255), Math.round((mat[2]+m)*255));
};

Color.prototype.toString = function() {
	var res = "#"+int2hex(this.r)+int2hex(this.g)+int2hex(this.b);
	if (res.indexOf('-') != -1 || res.length != 7) console.error("r : "+this.r+" / g : "+this.g+" / b : "+this.b+" -> "+res);
	return res;
};

Color.prototype.toHSV = function() {
	var M = Math.max(this.r, Math.max(this.g, this.b)),
		m = Math.min(this.r, Math.min(this.g, this.b)),
		C = M - m,
		H = M == this.r ? ((this.g - this.b)/C)%6 :
			M == this.g ? (this.b - this.r)/C + 2 :
			(this.r - this.g)/C + 4,
		h = 60*H;
	return {
		h : (h+360)%360,
		s : C/M,
		v : M/255
	};
};
function Polynomial(args) {
	this.coefs = [];
	if (arguments[0] instanceof Array) {
		this.coefs = arguments[0];
	}
	else for (var i = 0; i<arguments.length; i++) {
		this.coefs.push(arguments[i]);
	}
}

Polynomial.evaluate = function(coefs, x) {
	if (coefs.length === 0) return 0;
	return coefs.shift() + x*Polynomial.evaluate(coefs, x);
};

Polynomial.lagrange = function(points) { // points = [[0,2], [1,5], [12,pi], ...]
	var res = new Polynomial();
	for (var j = 0; j<points.length; j++) {
		var prod = new Polynomial(1),
			pj = points[j];
		for (var i = 0; i<points.length; i++) {
			var pi = points[i];
			if (i != j) {
				var p = new Polynomial(-pi[0], 1).lin(1/(pj[0] - pi[0]));
				prod = prod.mult(p);
			}
		}
		res = res.add(prod.lin(pj[1]));
	}
	return res;
};

Polynomial.prototype.coef = function(idx) {
	return this.coefs[idx] || 0;
};

Polynomial.prototype.calc = function(x) {
	return Polynomial.evaluate(this.coefs.slice(), x);
};

Polynomial.prototype.add = function(p) {
	var t = Math.max(this.coefs.length, p.coefs.length),
		res = [];
	for (var i = 0; i<t; i++) {
		res.push(this.coef(i) + p.coef(i));
	}
	return new Polynomial(res);
};

Polynomial.prototype.lin = function(a) {
	var res = [];
	for (var i = 0; i<this.coefs.length; i++) res.push(a*this.coef(i));
	return new Polynomial(res);
};

Polynomial.prototype.mult = function(p) {
	var t = this.coefs.length + p.coefs.length - 1,
		res = [];
	for (var i = 0; i<t; i++) {
		res[i] = 0;
		for (var j = 0; j<=i; j++) {
			res[i] += this.coef(j)*p.coef(i-j);
		}
	}
	return new Polynomial(res);
};

Polynomial.prototype.deriv = function() {
	return new Polynomial(this.coefs.slice(1));
};

Polynomial.prototype.int = function(c) {
	var coefs = [c];
	for (var i = 0; i<this.coefs.length; i++) coefs.push(this.coefs[i]);
	return new Polynomial(coefs);
};
madcolor = (function() {
	var parseBool = function(el) { if (el === "true") return true; if (el === "false") return false; return null; },
		defOptions = {
			colorPeriod : {
				default : 2,
				attr : "mc-color-period",
				parser : parseFloat
			},
			displayPeriod : {
				default : 0.2,
				attr : "mc-display-period",
				parser : parseFloat
			},
			listSize : {
				default : 5,
				attr : "mc-list-size",
				parser : parseInt
			},
			showMap : {
				default : true,
				attr : "mc-show-map",
				parser : parseBool
			},
			showHexCode : {
				default : true,
				attr : "mc-show-hexcode",
				parser : parseBool
			},
			colorRangeMax : {
				default : 255,
				attr : "mc-color-range-max",
				parser : parseInt
			},
			colorRangeMin : {
				default : 0,
				attr : "mc-color-range-min",
				parser : parseInt
			}
		};

	Color.list = [];

	Polynomial.fromColorList = function(list, offset) {
		var rp = [],
			gp = [],
			bp = [];
		for (var i = 0; i<list.length; i++) {
			rp.push([i-offset, list[i].r]);
			gp.push([i-offset, list[i].g]);
			bp.push([i-offset, list[i].b]);
		}
		return {
			r : Polynomial.lagrange(rp),
			g : Polynomial.lagrange(gp),
			b : Polynomial.lagrange(bp)
		};
	};

	function apply(el, opt) {
		var options = {},
			poly = {
				r : null,
				g : null,
				b : null
			},
			pHexCode,
			cnvsSet, cnvsBg, cnvsTrace,
			ctxBg, ctxTrace,
			cnvsHeight, cnvsWidth,
			lastColorUpdate,
			lastX, lastY;

		if (!opt) opt = {};
		for (var key in defOptions) {
			options[key] = (opt[key]!==undefined) ? opt[key] : defOptions[key].default;
		}

		var listOffset = Math.floor(options.listSize/2);

		el.style.transitionDuration = options.displayPeriod+"s";

		if (options.showHexCode) {
			pHexCode = document.createElement("p");
			pHexCode.className = "caption hexCode";
			el.appendChild(pHexCode);
		}
		if (options.showMap) {
			var container = document.createElement("div");
			container.className = "caption map";
			cnvsSet = document.createElement("div");
			cnvsSet.id = "canvaslist";
			container.appendChild(cnvsSet);
			el.appendChild(container);
			cnvsHeight = cnvsSet.clientHeight;
			cnvsWidth = cnvsSet.clientWidth;

			cnvsBg = document.createElement("canvas");
			ctxBg = cnvsBg.getContext("2d");
			cnvsTrace = document.createElement("canvas");
			ctxTrace = cnvsTrace.getContext("2d");

			cnvsTrace.height = cnvsBg.height = cnvsHeight;
			cnvsTrace.width = cnvsBg.width = cnvsWidth;
			ctxTrace.fillStyle = ctxTrace.strokeStyle = "#ffffff";
			ctxTrace.lineWidth = 2;

			cnvsSet.appendChild(cnvsBg);
			cnvsSet.appendChild(cnvsTrace);

			for (var i = 0; i<cnvsWidth; i++) {
				for (var j = 0; j<cnvsHeight; j++) {
					var h = Math.round(i*360/cnvsWidth),
						v = 1 - j/cnvsHeight;
					ctxBg.fillStyle = Color.fromHSV(h, 1, v).toString();
					ctxBg.fillRect(i, j, 1, 1);
				}
			}
		}

		while (Color.list.length < options.listSize) Color.list.push(Color.random(options.colorRangeMin, options.colorRangeMax));

		function setColor(col) {
			var s = col.toString();
			if (options.showHexCode) pHexCode.textContent = s;
			el.style.backgroundColor = s;
		}

		function colorUpdate() {
			Color.list.shift();
			Color.list.push(Color.random(options.colorRangeMin, options.colorRangeMax));
			poly = Polynomial.fromColorList(Color.list, listOffset);
			lastColorUpdate = new Date();
		}

		function display() {
			var t = (new Date() - lastColorUpdate)/(options.colorPeriod*1000),
				col = new Color(poly.r.calc(t), poly.g.calc(t), poly.b.calc(t));
			setColor(col);

			if (options.showMap) {
				var imgdata = ctxTrace.getImageData(0,0,cnvsWidth,cnvsHeight),
					hsv = col.toHSV(),
					x = (hsv.h/360)*cnvsWidth,
					y = (1 - hsv.v)*cnvsHeight;

				// Fade-out old points ...
				for (var i = 0; i<imgdata.data.length/4; i++) imgdata.data[4*i+3] = Math.max(0, imgdata.data[4*i+3]-10);

				ctxTrace.clearRect(0,0,cnvsWidth,cnvsHeight);
				ctxTrace.putImageData(imgdata, 0, 0);

				ctxTrace.beginPath();
				ctxTrace.moveTo(lastX, lastY);
				ctxTrace.lineTo(x, y);
				ctxTrace.stroke();

				lastX = x;
				lastY = y;
			}
		}

		colorUpdate();
		setInterval(colorUpdate, options.colorPeriod*1000);
		setInterval(display, options.displayPeriod*1000);
	}

	var targets = document.getElementsByClassName('mc');
	for (var i = 0; i<targets.length; i++) {
		var el = targets[i],
			opts = {},
			val;

		for (var key in defOptions) {
			val = el.getAttribute(defOptions[key].attr);
			if (val) opts[key] = defOptions[key].parser(val);
		}

		apply(targets[i], opts);
	}

	apply.color = Color;
	return apply;
})();