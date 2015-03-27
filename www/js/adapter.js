
var baseUrl = "http://esprit-solutions.com/apps/NewsWear/";
var feedUrl = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=";

isEmpty = function (data) {
    if (data == undefined || data == null)
        return true;
    return false;
}
dataStorage = {
    get: function (key) {
        return localStorage[key];
    },
    set: function (key, data) {
        localStorage[key] = data;
    }
}
api = {
}
api.SYNC = 1;
api.REMOTE = 2;
api.dataStatus = {};
api.dataStatus.NO_DATA_EXIST = 1;
api.dataStatus.EXPIRED_DATA = 2;
api.process = function (options) {

    if (options.status == api.REMOTE) {
        //invoke the remote API to refresh UI
        api.invoke(options.request).done(function (data) {
            options.validData(data);
            if (data != null && data != "  " && options.storeInLocalStorage==true)
                dataStorage.set(options.method, JSON.stringify(data))
        }).fail(function (jqxhr, textStatus) {
            api.errorHandler(jqxhr, textStatus)
        });
    }

    else {
        if (dataStorage.get(options.method) != undefined) {
            //get Data from localstorage if exist to Draw UI
            if (options.localData)
                options.localData(JSON.parse(dataStorage.get(options.method)));
        }
        //invoke the remote API to refresh UI
        api.invoke(options.request).done(function (data) {
            debugger
            if (!data.responseStatus) { //in case you are in normal requests
                if (options.validData) {
                    options.validData(data);
                    if (data != null)
                        dataStorage.set(options.method, JSON.stringify(data))
                }
            }
            else {
                if (data.responseStatus == 200) { //in case of google feed api requests
                    if (options.validData) {
                        options.validData(data.responseData);
                        if (data != null)
                            dataStorage.set(options.method, JSON.stringify(data))
                    }
                }
                else {
                    var jqxhr = {};
                    jqxhr.status = data.responseStatus;
                    jqxhr.expired = true;
                    var textStatus = data.responseDetails;
                    api.errorHandler(jqxhr, textStatus, options.method)
                }
            }
        }).fail(function (jqxhr, textStatus) {
            api.errorHandler(jqxhr, textStatus, options.method)
        });
    }
}
api.invoke = function (options) {
    return $.ajax(options)
}
api.errorHandler = function (jqXHR, exception, key) {
    if (jqXHR.expired) {
        //in case feeds are out of date
        window.plugins.toast.showShortBottom("Sorry feeds are out of date, Try again later")
    }
    if (dataStorage.get(key) == undefined) {
        if (jqXHR.status === 0) {
            navigator.notification.alert('Not connected to working internet, Check your network settings', function () {
                navigator.app.exitApp();
            }, "Warning");
        } else if (jqXHR.status == 404) {
            navigator.notification.alert('Requested page not found. [404]', function () {
                navigator.app.exitApp();
            }, "Warning");
        } else if (jqXHR.status == 500) {
            navigator.notification.alert('Internal Server Error [500].', function () {
                navigator.app.exitApp();
            }, "Warning");
        } else if (exception === 'parsererror') {
            navigator.notification.alert('Requested JSON parse failed.', function () {
                navigator.app.exitApp();
            }, "Warning");
        } else if (exception === 'timeout') {
            navigator.notification.alert('Time out error.', function () {
                navigator.app.exitApp();
            }, "Warning");
        } else if (exception === 'abort') {
            navigator.notification.alert('Ajax request aborted.', function () {
                navigator.app.exitApp();
            }, "Warning");
        } else {
            navigator.notification.alert('Uncaught Error.n' + jqXHR.responseText, function () {
                navigator.app.exitApp();
            }, "Warning");
        }
    }
}