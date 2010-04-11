exports.getStaticMap = function getStaticMap(from, to) {
		var url;

		console.log("enter");
		if (to) {
				url = "http://maps.google.com/maps/api/staticmap?center="+
						to.latitude+","+to.longitude+
						"&markers=color:red|label:"+to.label+"|"+
						to.latitude+","+to.longitude+
						"&markers=color:green|label:"+from.label+"|"+
						from.latitude+","+from.longitude+
						"&zoom=18&size=256x512&maptype=roadmap&sensor=true&mobile=true";
		}
		else {
				url = "http://maps.google.com/maps/api/staticmap?center="+
						from.latitude+","+from.longitude+
						"&markers=color:green|label:+"+from.label+"|"+
						from.latitude+","+from.longitude+
						"&zoom=18&size=256x512&maptype=roadmap&sensor=true&mobile=true";				
		}

		console.log("return");
		return url;
}

exports.getInteractiveMap = function getInteractiveMap(from, to) {
    var url;
		if (to) {
        url = "http://maps.google.com/maps?saddr="+  
						from.latitude+","+from.longitude+
						+"&daddr="+ to.latitude+","+to.longitude +
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
    url = "http://maps.google.com/maps?saddr="+  
				from.latitude+","+from.longitude+
				+"&daddr="+ to.latitude+","+to.longitude +
				"&dirflg=w&output=embed&sensor=true&mobile=true&pw=2";
		
		return url;
}