var geo_service = Cc["@mozilla.org/geolocation;1"].
		getService(Ci.nsIDOMGeoGeolocation); 

var extra_geo_options = {
				timeout: 5000  // NOTE: usefull to emulate geolocation errors
}

exports.getCurrentPosition = function(callback) {
		geo_service.getCurrentPosition(function _callback(position) {
				callback(positionToJSON(position));
		}, function _errback(position_error) {
				var error = position_error.message ? position_error.message : 
						"ERROR: Unable to get your current position";
				require('notify-service').show(error);
		}); 
}

function positionToJSON(position) {
		return {
				timestamp: position.timestamp,
				coords: jsonize(position.coords, [
						"latitude", "longitude", "altitude",
						"accuracy", "altitudeAccuracy",
						"heading", "speed" ]),
				address: jsonize(position.address, [
						"streetNumber", "street",	"premises",
						"city", "county", "region", "country",
						"countryCode", "postalCode" ])
		}
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