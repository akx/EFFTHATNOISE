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

	var inp = document.getElementById("inp");

	inp.addEventListener("keyup", function(event) {
		if(event.keyCode == 13) eff.reset();
	}, false);

	var noise = new Noise(
		inp,
		document.getElementById("outp"),
		setNoise
	);
}());
