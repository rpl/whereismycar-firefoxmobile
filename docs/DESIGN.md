# DESIGN Document: 'Where Is My Car?' for Firefox Mobile

"Where is my car?" is a very simple Firefox Mobile extension
developed on the new Jetpack Framework.

When you leave your car, you can mark the point on firefox mobile
and get directions info later thanks to Google Maps.

## Roadmap

### Round 1

#### Coding

XUL panels:

* whereismycar-leave
* whereismycar-getdirections

Jetpack modules:

* geolocation
* maps
* whereismycar-leave
  * get the whereismycar-leave xul and xml template DOM nodes
  * run a geolocation request
  * OK: fill whereismycar-leave template and call a xul template rebuild
  * ERROR: show an error message
  * ONLINE: generate a google maps static map url
  * OFFLINE: show a fallback image
  * LEAVE_BUTTON: save position
  * CANCEL_BUTTON: exit without save

Current Step:

* integrate geolocation into getdirection panel

Next Steps:

* integrate maps into getdirections panel

Done Steps:

* planning
* bootstrap whereismycar-leave panel
* bootstrap whereismycar-getdirections panel
* bootstrap geolocation
* integrate geolocation into leave panel
* integrate maps into leave panel
* bootstrap maps module

#### Design

##### User Interaction Workflow

Leave car:
* start extension
* decode your current position
* view your current position
* add a note (optional)
* add a photo (optional)

Get Directions:
* start extension
* existent leave point -> get directions
* decode your current position and compute linear distance (and linear direction?)
* view embedded google maps with walk directions and marker points
* open google maps directions in a new tab (optional)

##### Get Directions from Google Maps

Google Maps parameters Docs

* http://mapki.com/wiki/Google_Map_Parameters

Only embeddable map 

* http://maps.google.com/maps?saddr=40.702147,-74.015794&daddr=40.718217,-73.998284&dirflg=w&output=embed

Only Directions text

* http://maps.google.com/maps?saddr=40.702147,-74.015794&daddr=40.718217,-73.998284&dirflg=w&output=mobile

Print Directions View

* http://maps.google.com/maps?saddr=40.702147,-74.015794&daddr=40.718217,-73.998284&dirflg=w&pw=2

