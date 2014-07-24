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