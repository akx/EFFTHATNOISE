var Noise = (function() {
	function processToken(stack, bit) {
		var m, a, b;
		if(bit == "") return;
		if(bit == "t" || bit == "r" || bit == "b" || bit == "f" || bit == "x") return stack.push(bit);
		if(bit == "sin" || bit == "cos") return stack.push(bit + "(" + (stack.pop() || 0) + ")");
		if(bit == "_") return stack.push("(0|(" + (stack.pop() || 0) + "))");
		if(bit == "~") return stack.push("(~(" + (stack.pop() || 0) + "))");
		if(bit == "w") return stack.push("((" + (stack.pop() || 0) + ")&0xFF)");
		if(m=(/^0?b([01]+)$/.exec(bit))) return stack.push(parseInt(m[1], 2));
		if(m=(/^0?x([0-9a-f]+)$/.exec(bit))) return stack.push(parseInt(m[1], 16));
		if(m=(/^(-?[0-9]+)$/.exec(bit))) return stack.push(parseInt(m[1], 10));
		if(m=(/^(-?[0-9]+\.[0-9]+)$/.exec(bit))) return stack.push(parseFloat(m[1]));
		if(/^[-+\/*%&^|<>]/.exec(bit) || bit == "<<" || bit == ">>" || bit == ">>>") {
			b = stack.pop() || 0;
			a = stack.pop() || 0;
			if(bit == "<") return stack.push("min(" + a + ", " + b + ")");
			if(bit == ">") return stack.push("max(" + a + ", " + b + ")");
			return stack.push("(" + a + " " + bit + " " + b + ")");
		}
	}

	function compile(source) {
		var stack = [];
		var bits = source.split(/\s+/);
		while(bits.length) {
			processToken(stack, bits.shift());
		}
		return stack.shift() || "0";
	};

	var Noise = function (inField, outField, callback) {
		var source = unescape(location.hash.replace("#", "")) || window.localStorage.getItem("NOISE") || inField.value;
		var compiled = null;
		inField.value = source;
		var _compile = function () {
			source = inField.value;
			localStorage.setItem("NOISE", source);
			compiled = compile(source);
			outField.value = compiled;
			if(callback) callback(compiled);
			location.hash = escape(source);
		};
		inField.addEventListener("input", _compile, false);
		_compile();
	};

	return Noise;

}());
