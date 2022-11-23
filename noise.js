var Noise = (function () {
  var variables = "tbfxylgq".split("");
  var functions_1 = "sin cos tan abs tick tock".split(" ");
  var functions_0 = "r".split(" ");
  function processToken(stack, bit) {
    var m,
      a,
      b,
      inv = false,
      op;
    if (bit === "") return;
    if (variables.indexOf(bit) > -1) return stack.push(bit);
    if (functions_1.indexOf(bit) > -1)
      return stack.push(bit + "(" + (stack.pop() || 0) + ")");
    if (functions_0.indexOf(bit) > -1) return stack.push(bit + "()");
    if (bit == "_") return stack.push("(0|(" + (stack.pop() || 0) + "))");
    if (bit == "~") return stack.push("(~(" + (stack.pop() || 0) + "))");
    if (bit == "w") return stack.push("((" + (stack.pop() || 0) + ")&0xFF)");
    if ((m = /^0?b([01]+)$/.exec(bit))) return stack.push(parseInt(m[1], 2));
    if ((m = /^0?x([0-9a-f]+)$/.exec(bit)))
      return stack.push(parseInt(m[1], 16));
    if ((m = /^(-?[0-9]+)$/.exec(bit))) return stack.push(parseInt(m[1], 10));
    if ((m = /^(-?[0-9]+\.[0-9]+)$/.exec(bit)))
      return stack.push(parseFloat(m[1]));
    if (/^\./.exec(bit)) {
      inv = true;
      bit = bit.substr(1);
    }
    if (
      /^[-+\/*%&^|<>]/.exec(bit) ||
      bit == "<<" ||
      bit == ">>" ||
      bit == ">>>"
    ) {
      op = bit;
      b = stack.pop() || 0;
      a = stack.pop() || 0;
      if (inv) {
        m = b;
        b = a;
        a = m;
      }
      if (op == "<") return stack.push("min(" + a + ", " + b + ")");
      if (op == ">") return stack.push("max(" + a + ", " + b + ")");
      return stack.push("(" + a + " " + op + " " + b + ")");
    }
  }

  function compile(source) {
    if (/^!/.test(source)) return source.substr(1);
    var stack = [];
    var bits = source.split(/\s+/);
    while (bits.length) {
      processToken(stack, bits.shift());
    }
    return stack.shift() || "0";
  }

  var Noise = function (inField, outField, callback) {
    var source =
      unescape(location.hash.replace("#", "")) ||
      window.localStorage.getItem("NOISE") ||
      inField.value;
    var compiled = null;
    inField.value = source;
    var _compile = function () {
      source = inField.value;
      localStorage.setItem("NOISE", source);
      compiled = compile(source);
      outField.value = compiled;
      if (callback) callback(compiled);
      location.hash = escape(source);
    };
    inField.addEventListener("input", _compile, false);
    _compile();
  };

  return Noise;
})();
