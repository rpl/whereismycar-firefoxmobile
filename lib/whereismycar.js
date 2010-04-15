var document, deck, container, FennecBrowser, FennecBrowserUI, 
    getdirections_panel, leave_panel, getdirections_data, leave_data;

var app_prefix = "whereismycar-";

var leave_module = require('whereismycar-leave');
var getdirections_module = require('whereismycar-getdirections');

var geo_allowed = false;

exports.Whereismycar = {
		init: function (fennec_document, fennec_browser, fennec_browser_ui) {
				document = fennec_document;
				FennecBrowser = fennec_browser;
				FennecBrowserUI = fennec_browser_ui;
				deck = this._dom_select(app_prefix+"deck");
				container = this._dom_select(app_prefix+"container");

				getdirections_panel = this._get_xul("getdirections");
				getdirections_data = this._get_xul("getdirections-data");
				leave_panel = this._get_xul("leave");
				leave_data = this._get_xul("leave-data");

				leave_module.init(leave_panel,leave_data);
				getdirections_module.init(getdirections_panel,getdirections_data);
		}, 

		log: function(text) {
				console.log(app_prefix+"log: "+text);
		},

		show: function () {
				this._set_current_deck("loading");
				this._set_container_visibility(true);

				if(!this.isGeoAllowed()) {
						this._set_current_deck("geowarn");
						return;
				}

				if(leave_module.getSavedPosition()) {
						this._set_current_deck("getdirections");
						getdirections_module.render();
				}
				else {
						this._set_current_deck("leave");
						leave_module.render();
				}
		},

		setGeoAllowed: function () {
				geo_allowed = true;
				this.show();
		},

		isGeoAllowed: function () {
				return geo_allowed;
		},

		save: function () {
				leave_module.save();
				this._set_current_deck("getdirections");
				// BUGFIX: saving a new position need a redraw
				getdirections_module.render();
		},

		done: function () {
				leave_module.done();
				this._set_current_deck("leave");
				leave_module.render();
		},

		hide: function () {
				this._set_container_visibility(false);
		},
  
		_set_current_deck: function (panel) {
				return deck.selectedPanel = this._dom_select(app_prefix + panel);        
		},

		_get_xul: function (panel) {
				return this._dom_select(app_prefix + panel);        
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