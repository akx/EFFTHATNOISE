var Eff = (function () {
  "use strict";
  function hsvToRgb(h, s, v) {
    h = (h / 360) * 6;

    var i = Math.floor(h),
      f = h - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s),
      mod = i % 6,
      r = [v, q, p, p, t, v][mod],
      g = [t, v, v, q, p, p][mod],
      b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
  }

  var isin = function (a) {
    return 255 * Math.sin(a * 6.282);
  };
  var icos = function (a) {
    return 255 * Math.cos(a * 6.282);
  };
  var itan = function (a) {
    return 255 * Math.tan(a * 6.282);
  };
  var tick = function (a) {
    return this.t % (0 | a) === 0 ? 1 : 0;
  };
  var tock = function (a) {
    a = 0 | a;
    return this.t % a < a / 2 ? 1 : 0;
  };

  class Eff {
    constructor(audio, canvas) {
      this.canvas = canvas;
      this.audio = audio;
      this.started = false;
      const spn = audio.createScriptProcessor(4096, 0, 1);
      this.fun = function () {
        return 0;
      };
      this.spn = spn;
      if (canvas) {
        canvas.width = 1024;
        canvas.height = 256;
        var ctx = canvas.getContext("2d"),
          imageData;
        ctx.fillStyle = "rgba(0,0,0,0.1)";
      }

      window.addEventListener(
        "mousemove",
        function (event) {
          env.x = event.clientX / window.innerWidth;
          env.y = event.clientY / window.innerHeight;
        },
        false
      );

      var hue = 0;

      var env = {
        sin: isin,
        cos: icos,
        tan: itan,
        abs: Math.abs,
        min: Math.min,
        max: Math.max,
        r: function () {
          return 0 | (Math.random() * 255);
        },
        l: 0,
        t: 0,
        x: 0,
        y: 0,
        dc: 0,
        q: 0,
        bOffset: 0,
      };
      env.tick = tick.bind(env);
      env.tock = tock.bind(env);
      this.env = env;

      const process = (event) => {
        var i;
        var n = event.outputBuffer.length;
        var chans = [];
        var sam;
        var bsam;
        var rgb;
        var imageData;
        var fun = this.fun;
        for (i = 0; i < event.outputBuffer.numberOfChannels; i++)
          chans.push(event.outputBuffer.getChannelData(i));
        if (canvas) {
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }

        rgb = hsvToRgb(hue, 1, 1);
        env.b = (audio.currentTime - env.bOffset) * 100;
        var dc = 0;

        for (i = 0; i < n; i++) {
          env.f = i;
          env.g = i / n;
          sam = env.l = fun(env) & 0xff;
          bsam = ((sam & 0xff) - 127) / 255.0;
          dc += bsam;
          for (var c = 0; c < chans.length; c++) chans[c][i] = bsam - env.dc;
          env.t++;
          if (canvas) {
            var off =
              sam * canvas.width * 4 + (0 | ((i / n) * canvas.width)) * 4;
            imageData.data[off] = rgb.r;
            imageData.data[off + 1] = rgb.g;
            imageData.data[off + 2] = rgb.b;
          }
          hue += sam;
        }
        env.dc = (dc / n + env.dc * 4) / 5.0;
        hue %= 360;
        if (canvas) ctx.putImageData(imageData, 0, 0);
      };
      spn.addEventListener("audioprocess", process, false);
    }

    start = () => {
      if (!this.started) {
        this.spn.connect(this.audio.destination);
        this.started = true;
      }
    };
    stop = () => {
      if (this.started) {
        this.spn.disconnect(this.audio.destination);
        this.started = false;
      }
    };
    setFun = (f) => {
      this.fun = f;
    };
    reset = () => {
      this.hue = 0;
      Object.assign(this.env, {
        t: 0,
        l: 0,
        dc: 0,
        bOffset: this.audio.currentTime,
      });
    };
    setQ = (q) => {
      this.env.q = 0 | q;
    };
  }

  return Eff;
})();
