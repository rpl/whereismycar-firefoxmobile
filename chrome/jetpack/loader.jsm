var EXPORTED_SYMBOLS=["loader"];

var MY_ID="whereismycar@alcacoop.it";

function getJetpackLoader() {
  return Components.classes["@mozilla.org/harness-service;1?id="+MY_ID].
    getService().wrappedJSObject.loader;
}

var loader = getJetpackLoader();
