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
				this._set_current_deck("loading");
				this._set_container_visibility(true);

				if(require('whereismycar-leave').getSavedPosition()) {
						var getdirections_panel = this._set_current_deck("getdirections");
				}
				else {
						var leave_panel = this._set_current_deck("leave");
						var leave_data = this._dom_select("whereismycar-leave-data");
						require('whereismycar-leave').init(leave_panel,leave_data);
						require('whereismycar-leave').render();
				}
		},

		save: function () {
				require('whereismycar-leave').save();
				this._set_current_deck("getdirections");
		},

		done: function () {
				require('whereismycar-leave').done();
				this._set_current_deck("leave");
				require('whereismycar-leave').render();
		},

		hide: function () {
				this._set_container_visibility(false);
		},
  
		_set_current_deck: function (panel) {
				return deck.selectedPanel = this._dom_select(app_prefix + panel);        
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