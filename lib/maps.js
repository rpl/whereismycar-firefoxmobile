exports.getAddress = function getAddress(latitude, longitude, callback) {
  var url = "http://maps.google.com/maps/api/geocode/json?latlng="

		url += latitude+","+longitude+"&sensor=true";
	
		var req = new (require('xhr').XMLHttpRequest);
		req.open("GET", url);
    req.onreadystatechange = function() {
				if (req.readyState == 4) {
						if (req.status == 200) {
								if (req.responseText) {
									  callback(JSON.parse(req.responseText));
								}
						} else {
								require('notify-service').show("ERROR: error resolving your address");
						}
				}
    };
		req.send(null);
}

exports.getStaticMap = function getStaticMap(from, to) {
		var url;

		if (to) {
				url = "http://maps.google.com/maps/api/staticmap?center="+
						to.latitude+","+to.longitude+
						"&markers=color:red|label:"+to.label+"|"+
						to.latitude+","+to.longitude+
						"&markers=color:green|label:"+from.label+"|"+
						from.latitude+","+from.longitude+
						"&zoom=16&size=256x512&maptype=roadmap&sensor=true&mobile=true";
		}
		else {
				url = "http://maps.google.com/maps/api/staticmap?center="+
						from.latitude+","+from.longitude+
						"&markers=color:green|label:+"+from.label+"|"+
						from.latitude+","+from.longitude+
						"&zoom=16&size=256x512&maptype=roadmap&sensor=true&mobile=true";				
		}

		return url;
}

exports.getInteractiveMap = function getInteractiveMap(from, to) {
    var url;
		if (to) {
        url = "http://maps.google.com/maps?saddr="+  
						from.latitude+","+from.longitude+
						"&daddr="+ to.latitude+","+to.longitude +
						"&dirflg=w&output=embed&sensor=true&mobile=true";
		}
		else {
				url = "http://maps.google.com/maps?q="+from.label+"@"+
						from.latitude+","+from.longitude+
						"&output=embed&sensor=true&mobile=true";
		}
		
		return url;
}

exports.getDirections = function getDirections(from, to) {
    var url = "http://maps.google.com/maps?saddr="+  
				from.latitude+","+from.longitude+
				"&daddr="+ to.latitude+","+to.longitude +
				"&dirflg=w&output=mobile&sensor=true&mobile=true";

		return url;
}

exports.getDirection = function _getDirection(from, to) {
		var distance = this.getDistance(from,to);
		var lat1 = from.latitude;
		var lon1 = from.longitude;
		var lat2 = to.latitude;
		var lon2 = to.longitude

		if(distance<5) {
				return {
						direction: "ARRIVED",
						distance: distance
				}
		}
		else {
				return {
						direction: bearingToCardinalPoints(bearing(lat1,lon1,lat2,lon2)),
						distance: distance
				}
		}
}

exports.getDistance = function _getDistance(from, to) {
		var lat1 = from.latitude;
		var lon1 = from.longitude;
		var lat2 = to.latitude;
		var lon2 = to.longitude

		return distVincenty(lat1,lon1,lat2,lon2);
}

function bearingToCardinalPoints(bearing) {
		var cardinal_points = [
				{ min: 0, max: 22.5, label: "N" },
				{ min: 22.5, max: 67.5, label: "NE" },
				{ min: 67.5, max: 122.5, label: "E" },
				{ min: 112.5, max: 157.5, label: "SE" },
				{ min: 157.5, max: 202.5, label: "S" },
				{ min: 202.5, max: 247.5, label: "SW" },
				{ min: 247.5, max: 292.5, label: "W" },
				{ min: 292.5, max: 337.5, label: "NW" },
				{ min: 337.5, max: 360.1, label: "N" }
		];

		if(bearing <=0 && bearing > 360) return "ERROR";
		
		for each(var i in cardinal_points) {
				if(bearing>=i.min && bearing<i.max) 
						return i.label;
		}
}

function bearing(lat1,lon1,lat2,lon2) {
		var R = 6371;
		var radlat1 = toRad(lat1);
		var radlat2 = toRad(lat2);
		var dLon = toRad(lon2-lon1);

		var y = Math.sin(dLon) * Math.cos(lat2);
		var x = Math.cos(lat1)*Math.sin(lat2) -
        Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
		var brng = Math.atan2(y, x);
  
		return (toDeg(brng)+360) % 360;
}

toRad = function(number) {  // convert degrees to radians
		return number * Math.PI / 180;
}

toDeg = function(number) {
    return number * 180 / Math.PI;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Vincenty Inverse Solution of Geodesics on the Ellipsoid (c) Chris Veness 2002-2010             */
/*                                                                                                */
/* from: Vincenty inverse formula - T Vincenty, "Direct and Inverse Solutions of Geodesics on the */
/*       Ellipsoid with application of nested equations", Survey Review, vol XXII no 176, 1975    */
/*       http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

/**
 * Calculates geodetic distance between two points specified by latitude/longitude using 
 * Vincenty inverse formula for ellipsoids
 *
 * @param   {Number} lat1, lon1: first point in decimal degrees
 * @param   {Number} lat2, lon2: second point in decimal degrees
 * @returns (Number} distance in metres between points
 */
function distVincenty(lat1, lon1, lat2, lon2) {
		var a = 6378137, b = 6356752.3142,  f = 1/298.257223563;  // WGS-84 ellipsoid params
		var L = toRad(lon2-lon1);
		var U1 = Math.atan((1-f) * Math.tan(toRad(lat1)));
		var U2 = Math.atan((1-f) * Math.tan(toRad(lat2)));
		var sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
		var sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
  
		var lambda = L, lambdaP, iterLimit = 100;
		do {
				var sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
				var sinSigma = Math.sqrt((cosU2*sinLambda) * (cosU2*sinLambda) + 
																 (cosU1*sinU2-sinU1*cosU2*cosLambda) * 
																 (cosU1*sinU2-sinU1*cosU2*cosLambda));
				if (sinSigma==0) return 0;  // co-incident points
				var cosSigma = sinU1*sinU2 + cosU1*cosU2*cosLambda;
				var sigma = Math.atan2(sinSigma, cosSigma);
				var sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
				var cosSqAlpha = 1 - sinAlpha*sinAlpha;
				var cos2SigmaM = cosSigma - 2*sinU1*sinU2/cosSqAlpha;
				if (isNaN(cos2SigmaM)) cos2SigmaM = 0;  // equatorial line: cosSqAlpha=0 (§6)
				var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
				lambdaP = lambda;
				lambda = L + (1-C) * f * sinAlpha *
						(sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));
		} while (Math.abs(lambda-lambdaP) > 1e-12 && --iterLimit>0);
		
		if (iterLimit==0) return NaN  // formula failed to converge

		var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
		var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
		var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
		var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
																								 B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
		var s = b*A*(sigma-deltaSigma);
		
		s = s.toFixed(3); // round to 1mm precision
		return s;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
