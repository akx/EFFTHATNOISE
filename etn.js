(function () {
  var audio = new AudioContext();
  var eff = new Eff(audio, document.getElementById("c"));

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

  inp.addEventListener(
    "click",
    function (event) {
      if (audio.state !== "running") {
        audio.resume();
      }
      eff.start();
    },
    false
  );

  inp.addEventListener(
    "keyup",
    function (event) {
      if (event.keyCode == 13) eff.reset();
    },
    false
  );

  document.addEventListener(
    "keyup",
    function (event) {
      eff.setQ(event.keyCode);
    },
    false
  );

  var noise = new Noise(inp, document.getElementById("outp"), setNoise);

  inp.title =
    "VARIABLES: t = time, b = realtime, r = noise, f = buffer pos (int), g = buffer pos (0..1), x = mouse x (0..1), y = mouse y (0..1), l = last value generated, q = last keycode\n" +
    "1-ARG FUNCS: tick = generate tick pulse every t == N. tock = generate square wave with frequency N. sin. cos. tan.\n" +
    "OPERATORS: + - * / << >> >>> & | ^ _ < > (prefix with . for operand transpose)\n";
})();
