var xul_node;
var xml_node;
var parser = require('domparser').DOMParser;
var POSITION;

var prefSrv = require("preferences-service");
var saved_position_pref = "extensions.alcacoop.whereismycar.saved_position";

exports.getSavedPosition = function _get_saved_position() {
		try {
				POSITION = JSON.parse(prefSrv.get(saved_position_pref));
		}
		catch (e) {
				console.log(e);
				POSITION = null;
		}
		return POSITION;
}

exports.init = function _init(xul, xml_data) {
		xul_node = xul;
		xml_node = xml_data;
}

exports.save = function _save() {
		console.log("SAVING: "+JSON.stringify(POSITION));
		prefSrv.set(saved_position_pref, JSON.stringify(POSITION));
		return POSITION;
}

exports.done = function _done() {
		console.log("CLEANING OLD SAVED POSITION");
		prefSrv.set(saved_position_pref, "");
		POSITION = null;
}

exports.render = function _render() {
		var self = this;
		require("geolocation").getCurrentPosition(function _callback(position) {
				console.log("GEORENDERING...");

				POSITION = position;

				var xmldata = <data/>;

				var offline_image = "chrome://whereismycar/skin/images/loading_map.png";

				var online_image = require('maps').getStaticMap({
						label: "C",
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
				});

				var interactive_map_cmd = "Whereismycar._open_in_tab('"+
						require('maps').getInteractiveMap({
								label: "Your Car",
								latitude: position.coords.latitude,
								longitude: position.coords.longitude								
						})+"');";

				xmldata.position = <position>
						<address value={position.address.street + ", " + 
						                position.address.streetNumber}/>
						<city value={position.address.city}/>
						<country value={position.address.countryCode}/>
						<latlong value={position.coords.latitude + ", " +
													  position.coords.longitude}/>
						<note value="blah blah blah"/>
						<static-map-url value={online_image}/>
						<interactive-map-cmd value={interactive_map_cmd}/>
				</position>;

				fillTemplate(xmldata.toXMLString(), xml_node, xul_node);
		});
}

function fillTemplate(xml_string, dst_node, xul) {
		var doc = parser.parseFromString(xml_string, "text/xml");
		var src = doc.getElementsByTagName("data")[0];

		// NOTE: remove old data
		while(dst_node.hasChildNodes()) {
				dst_node.removeChild(xml_node.lastChild);
		}
		// NOTE: add new data
		while(src.hasChildNodes()) {
				dst_node.appendChild(src.firstChild);
		}

		// NOTE: rebuild xul from new data
		xul_node.builder.rebuild();
}


				