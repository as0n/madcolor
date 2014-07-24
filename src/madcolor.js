madcolor = (function() {
	var defOptions = {
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
			parser : function(el) { if (el === "true") return true; if (el === "false") return false; return null; }
		},
		showHexCode : {
			default : true,
			attr : "mc-show-hexcode",
			parser : function(el) { if (el === "true") return true; if (el === "false") return false; return null; }
		},
		colorRange : {
			default : 255,
			attr : "mc-color-range",
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

		while (Color.list.length < options.listSize) Color.list.push(Color.random(options.colorRange));

		function setColor(col) {
			var s = col.toString();
			if (options.showHexCode) pHexCode.textContent = s;
			el.style.backgroundColor = s;
		}

		function colorUpdate() {
			Color.list.shift();
			Color.list.push(Color.random(options.colorRange));
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