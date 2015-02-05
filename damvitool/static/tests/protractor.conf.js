/*global exports, by, isc, window*/
exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        'e2e.spec.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:8000/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    },

    //seleniumServerJar: '../../../node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar',
    //seleniumArgs: ['-userExtensions ./selenium-smartclient-ext.js', '-debug'],

    onPrepare: function () {
        by.addLocator('scLocator', function (scLocator) {
            var target;
            // support scLocators with the direct ID of the widget specified
            if (scLocator.indexOf("/") === -1) {
                //LOG.debug("Using ID locator");
                scLocator = scLocator.replace(/'/g, "");
                scLocator = scLocator.replace(/"/g, "");

                var scObj = window[scLocator];
                if (scObj === null) {
                    //LOG.info("Unable to locate SC object with ID " + idLocator);
                    return null;
                }
                // else {
                //    LOG.debug('Found SC object ' + scObj);
                //}

                scLocator = "//" + scObj.getClassName() + "[ID=\"" + scLocator + "\"]";
                //LOG.debug("Using SC Locator " + scLocator);
                target = isc.AutoTest.seleniumExecute("getElement", scLocator);
                //LOG.info("Returning " + description + " :: " + target + " for SC locator " + scLocator);
                return target;
            }
            //var autWindow = this.getAutWindow();

            target = isc.AutoTest.seleniumExecute("getElement", scLocator);
            //LOG.debug("Returning " + description + " :: " + target + " for SC locator " + scLocator);
            return target;
        });
    }
};
