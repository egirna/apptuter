var NativeBridge = {
    openUrl: function (url, target, options) {
        window.open(url, target, options);
    },
    alert: function(message, alertCallback, title, buttons){
        if (navigator.notification) {
            navigator.notification.alert(message, alertCallback, title, buttons)
        }
        else
            alert(message);
    },
    toastshort: function (message) {
        if (window.plugins && window.plugins.toast)
            window.plugins.toast.showShortBottom(message);
        else
            NativeBridge.alert(message);
    },
    deviceInfo: function () {
        deviceInformation = {};
        if (window.device) {
            deviceInformation.uuid = device.uuid;
            deviceInformation.model = device.model;
            deviceInformation.platform = device.platform;
            deviceInformation.version = device.version;
        }
        else {
            deviceInformation.uuid = "WebApp";
            deviceInformation.model = "WebApp";
            deviceInformation.platform = "WebApp";
            deviceInformation.version = "WebApp";
        }
        return deviceInformation;
    },
    closeApp: function () {
        if (navigator.app)
            navigator.app.exit();
        else
            window.close();
    },
    //ImageCaching
    useCachedFile: function (url, id,originalUrl) {
        if (id != null)
            var imgObj = $("[img-obj='" + id + "']");
        else
            var imgObj = $("[img-src='" + originalUrl + "']");

        $(imgObj).find('img').attr('src', 'components/imageCacheJs/placeholder.GIF');
        ImgCache.isCached(
                 url, function (path, success) {
                    if (success) {
                        // already cached
                        console.log("used from cache");
                        ImgCache.getCachedFileURL(path, function (img_src, file_url) {
                            console.log("found in cache");
                            $(imgObj).find('img').attr('src', file_url);
                        })
                    } else {
                        // not there, need to cache the image
                        ImgCache.cacheFile(url, function () {
                            $(imgObj).find('img').attr('src',  url);
                        }, function () {
                            $(imgObj).find('img').attr('src', url);
                        });
                    }
                });
    }
}