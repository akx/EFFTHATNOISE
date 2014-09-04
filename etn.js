(function() {
	var eff = new Eff(document.getElementById("c"));
	eff.start();

	var setNoise = function (compiled) {
		var fun = null;
		try {
			fun = new Function("env", "with(env)return " + compiled + ";");
		} catch (e) {
			console.log(e);
		}
		if (fun) eff.setFun(fun);
	};

	var noise = new Noise(
		document.getElementById("inp"),
		document.getElementById("outp"),
		setNoise
	);
}());
