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

	inp.title =
	"VARIABLES: t = time, b = realtime, r = noise, f = buffer pos (int), g = buffer pos (0..1), x = mouse x (0..1), y = mouse y (0..1), l = last value\n" +
	"1-ARG FUNCS: tick = generate tick pulse every t == N. tock = generate square wave with frequency N. sin. cos. tan.\n" +
	"OPERATORS: + - * / << >> >>> & | ^ _ < > (prefix with . for operand transpose)\n";
}());
