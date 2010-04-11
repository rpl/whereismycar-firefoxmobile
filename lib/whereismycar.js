var document, deck, container, FennecBrowser, FennecBrowserUI;

var app_prefix = "whereismycar-";

exports.Whereismycar = {
		init: function (fennec_document, fennec_browser, fennec_browser_ui) {
				document = fennec_document;
				FennecBrowser = fennec_browser;
				FennecBrowserUI = fennec_browser_ui;
				deck = this._dom_select(app_prefix+"deck");
				container = this._dom_select(app_prefix+"container");
		}, 

		log: function(text) {
				console.log(app_prefix+"log: "+text);
		},

		show: function () {
				//this._set_current_deck("loading");
				//this._set_current_deck("leave");
				this._set_current_deck("getdirections");
				this._set_container_visibility(true);
        /*
				function showAddress(position) {
						var el = document.getElementById("whereismycar-testlabel");
						var address = <>
								{position.address.street}, {position.address.streetNumber} - {position.address.city} ({position.address.countryCode})
						</>.toString();
						el.value = address;
				}

				require("geolocation").getCurrentPosition(showAddress);
				*/
		},
  
		hide: function () {
				this._set_container_visibility(false);
		},
  
		_set_current_deck: function (panel) {
				deck.selectedPanel = this._dom_select(app_prefix + panel);        
		},
  
		_set_container_visibility: function (visible) {
				FennecBrowserUI.closeAutoComplete();
				container.hidden = !visible;    
		},
  
		_open_in_tab: function (url) {
				FennecBrowser.addTab(url, true);
				FennecBrowser.hideSidebars();
				this.hide();
		},
  
		_dom_select: function (id) {
				return document.getElementById(id);
		}
};