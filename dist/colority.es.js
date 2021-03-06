function colority(imageURL, callback, options) {
    var _this = this;
    if (!(this instanceof colority))
        return new colority(imageURL, callback, options);
    this.imageURL = imageURL;
    this.options = {};
    this.callback = function () { };
    if (options === undefined) {
        this.callback = callback;
    }
    else {
        this.options = callback;
        this.callback = options;
    }
    preload(this.imageURL, function (image) {
        var context = getContext(image.naturalWidth, image.naturalHeight);
        context.drawImage(image, 0, 0);
        var imageData = context.getImageData(0, 0, image.naturalWidth, image.naturalHeight).data;
        var colors = {};
        var results = [];
        transformColors(imageData, _this.options.skip || 10, function (rgb) { return colors[rgb] = rgb in colors ? colors[rgb] + 1 : 1; });
        mapColors(colors, function (key, value) {
            results.push({
                color: key,
                count: value
            });
        });
        _this.callback(results.sort(function (a, b) { return b.count - a.count; }).map(function (result) { return result.color; }));
    });
}
function preload(imageURL, done) {
    var image = new Image();
    image.crossOrigin = '*';
    image.src = imageURL;
    image.addEventListener('load', function () { return done(image); });
    image.addEventListener('error', function () { return done(image); });
}
function getContext(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas.getContext('2d');
}
function transformColors(data, skip, callback) {
    for (var i = 0; i < data.length; i += 4 * skip) {
        callback("rgb(" + data[i] + "," + data[i + 1] + "," + data[i + 2] + ")");
    }
}
function mapColors(data, callback) {
    for (var key in data) {
        callback(key, data[key]);
    }
}

export default colority;
//# sourceMappingURL=colority.es.js.map
