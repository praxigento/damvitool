/*global angular, isc, alert */

var authMod = angular.module('prxgtAuth', ['ngRoute', 'ngResource', 'ng-isc']);

var url_login = 'proxy/login';
var url_logout = 'proxy/logout';

authMod.factory('Login', ['$resource', function ($resource) {
    'use strict';

    return $resource(url_login, {}, {query: {method: 'POST'}, isArray: true});
}]);

authMod.factory('Logout', ['$resource', function ($resource) {
    'use strict';

    return $resource(url_logout, {}, {query: {method: 'POST'}, isArray: true});
}]);

function showLogin(Login, $rootScope, $q) {
    'use strict';

    var deferred = $q.defer();
    isc.showLoginDialog(function (credentials, dialogCallback) {
        if (credentials === null) {
            return; // dismissed
        }

        var reject = function () {
            dialogCallback(false);
            //deferred.reject();
        };

        // send credentials
        var res = Login.query({username: credentials.username, password: credentials.password}, function () {
            if (res.code && res.code !== 200) {
                reject();
            } else {
                $rootScope.currentUser = {username: res.username, sessionId: res.sessionId};
                dialogCallback(true);
                deferred.resolve();
            }
        }, function (err) {
            reject();
        });
    });
    return deferred.promise;
}

authMod.run(function ($rootScope, Login, Logout, $q, $location, $timeout, $route) {
    'use strict';

    $rootScope.isLoggedIn = function () {
        return (!!$rootScope.currentUser);
    };

    $rootScope.login = function () {
        return showLogin(Login, $rootScope, $q);
    };

    $rootScope.logout = function () {
        Logout.query({}, function () {
            $rootScope.currentUser = null;
            $location.path('/');

            // update elements dependent from isLoggedIn function
            $timeout(function () {
                $rootScope.$digest();
            });
        });
    };

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        var requireLogin = next.data && next.data.requireLogin;
        if (requireLogin && !$rootScope.currentUser) {
            event.preventDefault();

            var url = $location.path();
            showLogin(Login, $rootScope, $q)
                .then(function () {
                    if ($location.path() === url) {
                        $route.reload();
                    } else {
                        return $location.path(url);
                    }
                });
        }
    });
});

authMod.config(function ($httpProvider) {
    'use strict';

    $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
        var Login, $rootScope, $http, Base64;

        // this trick must be done so that we don't receive
        // `Uncaught Error: [$injector:cdep] Circular dependency found`
        $timeout(function () {
            Login = $injector.get('Login');
            $rootScope = $injector.get('$rootScope');
            $http = $injector.get('$http');
            Base64 = $injector.get('Base64');
        });

        return {
            request: function (config) {
                if ($rootScope && $rootScope.currentUser) {
                    var u = $rootScope.currentUser;
                    config.headers.Authorization = 'Basic ' + Base64.encode(u.username + ':' + u.sessionId);
                }
                return config;
            },
            responseError: function (rejection) {
                if (rejection.status !== 403 || rejection.config.url === url_login || rejection.config.url === url_logout) {
                    return rejection;
                }

                var deferred = $q.defer();

                showLogin(Login, $rootScope, $q)
                    .then(function () {
                        deferred.resolve($http(rejection.config));
                    });

                return deferred.promise;
            }
        };
    });
});

authMod.factory('Base64', function () {
    'use strict';

    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});
