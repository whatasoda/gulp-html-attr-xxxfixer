"use strict";
var through = require("through2");
var cheerio = require("cheerio");
var PluginError = require("plugin-error");
var PLUGIN_NAME = 'gulp-html-attr-xxxfixer';
function HTMLAttrXXXfixer(rules) {
    var _rules = rules.map(function (rule) {
        var name = rule.attrName;
        var prefix = rule.prefix || '';
        var suffix = rule.suffix || '';
        var filter = function (value) { return ((rule.pattern ? rule.pattern.test(value) : true) &&
            (rule.filter ? rule.filter(value) : true)); };
        return { name: name, prefix: prefix, suffix: suffix, filter: filter };
    });
    return through.obj(function (file, encoding, callback) {
        if (file.isNull())
            return callback(null, file);
        if (file.isStream())
            return this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
        if (!file.isBuffer())
            return this.emit('error', new PluginError(PLUGIN_NAME, 'Unsupported file type!'));
        var $ = cheerio.load(file.contents.toString('utf-8'), {
            decodeEntities: false,
        });
        _rules.forEach(function (_a) {
            var name = _a.name, prefix = _a.prefix, suffix = _a.suffix, filter = _a.filter;
            return $("[" + name + "]").each(function (index, elem) {
                var $elem = $(elem);
                var value = $elem.attr(name);
                if (!(value && filter(value)))
                    return;
                $elem.attr(name, prefix + value + suffix);
            });
        });
        file.contents = new Buffer($.html());
        callback(null, file);
    });
}
HTMLAttrXXXfixer.prefix = function (prefix, attrNames) {
    return attrNames.map(function (name) { return ({ attrName: name, prefix: prefix }); });
};
HTMLAttrXXXfixer.suffix = function (suffix, attrNames) {
    return attrNames.map(function (name) { return ({ attrName: name, suffix: suffix }); });
};
(function (HTMLAttrXXXfixer) {
})(HTMLAttrXXXfixer || (HTMLAttrXXXfixer = {}));
module.exports = HTMLAttrXXXfixer;
