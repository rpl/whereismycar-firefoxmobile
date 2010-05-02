var geo_service = Cc["@mozilla.org/geolocation;1"].
		getService(Ci.nsIDOMGeoGeolocation); 

var extra_geo_options = {
		timeout: 10000  // NOTE: usefull to emulate geolocation errors
}

exports.getCurrentPosition = function(callback) {
		geo_service.getCurrentPosition(function _callback(position) {
        try {
						callback(positionToJSON(position));
        }
				catch (e) {
						console.log("whereismycar/geolocation.js: "+e);
						require('notify-service').show("ERROR: position processing");
        }
		}, function _errback(position_error) {
        console.log("whereismycar/geolocation.js GEOERROR("+position_error.code+"): "+position_error.message);
				var error = "ERROR: Unable to get your current position";
				require('notify-service').show(error);
		}, extra_geo_options); 
}

function positionToJSON(position) {
    var coords = position.coords;
    var address = null;

		if(position.address)
				address = formatMozGeoAddress(position.address);
		else
				address = "UNKNOWN";

		return {
				timestamp: position.timestamp,
				coords: jsonize(coords, [
						"latitude", "longitude", "altitude",
						"accuracy", "altitudeAccuracy",
						"heading", "speed" ]),
				address: address
		}
}


function formatMozGeoAddress(address) {
  return <>
    {address.street}, {address.streetNumber} {address.city} ({address.countryCode})
  </>.toString().trim();
}

function jsonize(object, keys) {
		var json = {};

    // BUGFIX: GPSD provider can't resolve address info
    // so withous a connection it could be null
    if(!object) 
				object = {};

    // BUGFIX: assign unknown as value of unexistent properties 
		keys.forEach(function(i) {
				if(object[i])
						json[i] = object[i].toString();
        else
            json[i] = "unknown";
		});

		return json;
}