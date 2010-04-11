exports.show = show;

function show(message) {
    // We need some kind of title to get around bug 538028.
    const DEFAULT_TITLE = "Where is my car?";

    try {
        var classObj = Cc["@mozilla.org/alerts-service;1"];
        var alertService = classObj.getService(Ci.nsIAlertsService);

        alertService.showAlertNotification(null, DEFAULT_TITLE, message);
        return true;
    } catch (e) {
        // Looks like the alert service isn't supported on our
        // platform, so we'll use a nasty modal dialog.
        try {
						var classObj = Cc["@mozilla.org/embedcomp/prompt-service;1"];
						var promptService = classObj.getService(Ci.nsIPromptService);

						promptService.alert(null, DEFAULT_TITLE, message);
						return true;
        } catch (e) {
						console.exception(e);
						return false;
        }
    }
}
