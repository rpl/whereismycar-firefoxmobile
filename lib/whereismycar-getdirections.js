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
				var TO = require("whereismycar-leave").getSavedPosition();

				var xmldata = <data/>;

				var offline_image = "chrome://whereismycar/skin/images/loading_map.png";

				var from = {
						label: "F",
						latitude: position.coords.latitude, 
						longitude: position.coords.longitude
				};

				var to = {
								label: "T",
								latitude: TO.coords.latitude,
								longitude: TO.coords.longitude
				};

				var dir_data;

				try {
						dir_data = require('maps').getDirection(from,to);
				}
				catch(e) {
						dir_data = {
								distance: "ERROR",
								direction: "ERROR"
						}
				}

				var online_image = require('maps').getStaticMap(from,to);
				
				from.label = "From: You";
				to.label = "To: Your Car";

				var interactive_map_cmd = "Whereismycar._open_in_tab('"+
						require('maps').getInteractiveMap(from,to)+"');";

				var print_directions_cmd = "Whereismycar._open_in_tab('"+
						require('maps').getDirections(from,to)+"');";

				xmldata.position = <directions>
						<map>
  						<static-map-url value={online_image}/>
  						<interactive-map-cmd value={interactive_map_cmd}/>
						  <print-directions-cmd value={print_directions_cmd}/>
						</map>
						<from>
						  <address value={position.address.street + ", " + 
						                position.address.streetNumber}/>
							<city value={position.address.city}/>
							<country value={position.address.countryCode}/>
							<latlong value={from.latitude + ", " +
													  from.longitude}/>
						  <distance value={dir_data.distance}/>
  						<direction value={dir_data.direction}/>
						</from>
						<to>
						  <address value={TO.address.street + ", " + 
						                TO.address.streetNumber}/>
							<city value={TO.address.city}/>
							<country value={TO.address.countryCode}/>
							<latlong value={to.latitude + ", " +
													  to.longitude}/>
							<note value="blah blah blah"/>
						</to>
				</directions>;
								

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


				