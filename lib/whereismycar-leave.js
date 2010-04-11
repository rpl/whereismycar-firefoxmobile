var xul_node;
var xml_node;
var parser = require('domparser').DOMParser;

exports.init = function _init(xul, xml_data) {
		xul_node = xul;
		xml_node = xml_data;
}

exports.render = function _render() {
		var self = this;
		require("geolocation").getCurrentPosition(function _callback(position) {
				console.log("GEORENDERING...");
				var xmldata = <data/>;

				var offline_image = "chrome://whereismycar/skin/images/loading_map.png";
        var online_image = "http://maps.google.com/maps/api/staticmap?center="+
						position.coords.latitude+","+position.coords.longitude+
						"&markers=color:green|label:C|"+
						position.coords.latitude+","+position.coords.longitude+
						"&zoom=18&size=256x512&maptype=roadmap&sensor=true&mobile=true";

				var interactive_map_cmd = "Whereismycar._open_in_tab('"+
						"http://maps.google.com/maps?q=Your Car@"+
						position.coords.latitude+","+position.coords.longitude+
						"&output=embed&sensor=true&mobile=true"+
						"');";

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


				