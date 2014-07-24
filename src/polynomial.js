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