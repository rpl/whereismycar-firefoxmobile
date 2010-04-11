var xul_node;
var xml_node;
var parser = require('domparser').DOMParser;

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

exports.render = function _render() {
		var self = this;
		require("geolocation").getCurrentPosition(function _callback(position) {
				console.log("GEORENDERING...");

				var TO = require("whereismycar-leave").getSavedPosition();

				var xmldata = <data/>;

				var offline_image = "chrome://whereismycar/skin/images/loading_map.png";

				// 40.347509,18.160529   //position.coords.latitude,
        // 40.3506226,18.1598256 //position.coords.longitude
				var from = {
						label: "Y",
						latitude: 40.347509, 
						longitude: 18.160529
				};

				var to = {
								label: "C",
								latitude: TO.coords.latitude,
								longitude: TO.coords.longitude
				};

				console.log("PRIMA:"+JSON.stringify(from)+"-"
										+JSON.stringify(to));
				try {
				var dir_data = require('maps').getDirection(from,to);
				}
				catch(e) {
						console.log("ERROR: "+e);
				}

				var online_image = require('maps').getStaticMap(from,to);
				
				from.label = "You";
				to.label = "Your Car";

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


				