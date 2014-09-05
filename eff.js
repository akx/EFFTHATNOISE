var Eff = (function() {
	function hsvToRgb(h, s, v) {
	    h = h / 360 * 6;

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
	};

	var isin = function(a) { return 255 * Math.sin(a * 6.282); };
	var icos = function(a) { return 255 * Math.cos(a * 6.282); };

	var Eff = function(canvas) {
		var audio = new AudioContext();
		var spn = audio.createScriptProcessor(0, 1);
		spn.bufferSize = 512;
		var t = 0, x = 0;
		var fun = function() { return 0; };
		if(canvas) {
			canvas.width = spn.bufferSize;
			canvas.height = 256;
			var ctx = canvas.getContext("2d"), imageData;
			ctx.fillStyle = "rgba(0,0,0,0.1)";
		}

		window.addEventListener("mousemove", function(event) {
			x = event.clientX / window.innerWidth;
		}, false);

		var hue = 0;

		spn.onaudioprocess = function(event) {
			var n = event.outputBuffer.length;
			var out0 = event.outputBuffer.getChannelData(0);
			if(canvas) {
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			}

			var rgb = hsvToRgb(hue, 1, 1);

			var env = {
				sin: isin,
				cos: icos,
				min: Math.min,
				max: Math.max,
				x: x
			};

			for(var i = 0; i < n; i++) {
				env.t = t;
				env.r = 0 | (Math.random() * 255);
				env.b = audio.currentTime * 100;
				env.f = i;
				var sam = fun(env) & 0xFF;
				out0[i] = ((sam & 0xFF) - 127) / 255.0;
				t++;
				if(canvas) {
					var off = (sam * canvas.width * 4 + i * 4);
					imageData.data[off] = rgb.r;
					imageData.data[off + 1] = rgb.g;
					imageData.data[off + 2] = rgb.b;
				}
				hue += sam;
			}
			hue %= 360;
			if(canvas) ctx.putImageData(imageData, 0, 0);
		};

		this.start = function() { spn.connect(audio.destination); };
		this.stop = function() { spn.disconnect(audio.destination); };
		this.setFun = function(f) { fun = f; };
		this.reset = function() { t = 0; hue = 0; };
	};
	return Eff;
}());
