var Whereismycar_jetpack = {}
var Whereismycar;

function load() {
    Components.utils.import("resource://whereismycar/jetpack/loader.jsm", Whereismycar_jetpack);

		Whereismycar = Whereismycar_jetpack.loader.require("whereismycar").Whereismycar;
		Whereismycar.init(document, Browser, BrowserUI);
}

window.addEventListener("load", load, true);
