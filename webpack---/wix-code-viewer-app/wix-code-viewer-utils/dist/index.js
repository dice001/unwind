! function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.wixCodeViewerUtils = t() : e.wixCodeViewerUtils = t()
}("undefined" != typeof self ? self : this, function() {
    return function(e) {
        var t = {};

        function r(n) {
            if (t[n]) return t[n].exports;
            var o = t[n] = {
                i: n,
                l: !1,
                exports: {}
            };
            return e[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports
        }
        return r.m = e, r.c = t, r.d = function(e, t, n) {
            r.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: n
            })
        }, r.r = function(e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }, r.t = function(e, t) {
            if (1 & t && (e = r(e)), 8 & t) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var n = Object.create(null);
            if (r.r(n), Object.defineProperty(n, "default", {
                    enumerable: !0,
                    value: e
                }), 2 & t && "string" != typeof e)
                for (var o in e) r.d(n, o, function(t) {
                    return e[t]
                }.bind(null, o));
            return n
        }, r.n = function(e) {
            var t = e && e.__esModule ? function() {
                return e.default
            } : function() {
                return e
            };
            return r.d(t, "a", t), t
        }, r.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, r.p = "", r(r.s = 0)
    }([function(e, t, r) {
        "use strict";
        var n = r(1).buildNamespacesMap;
        e.exports = {
            buildNamespacesMap: n
        }
    }, function(e, t, r) {
        "use strict";
        var n = r(2).createWixFetch;
        e.exports = {
            buildNamespacesMap: function(e, t) {
                var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function(e) {
                    return e
                };
                return Object.keys(e).reduce(function(t, n) {
                    var o = e[n];
                    switch (n) {
                        case "events":
                            break;
                        case "user":
                            t["wix-users"] = r(o);
                            break;
                        case "wixEvents":
                            t["wix-events"] = r(o);
                            break;
                        default:
                            t["wix-" + n] = r(o)
                    }
                    return t
                }, {
                    "wix-fetch": r(n(t))
                })
            }
        }
    }, function(e, t, r) {
        "use strict";
        var n = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var r = arguments[t];
                for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
            }
            return e
        };
        e.exports = {
            createWixFetch: function(e) {
                return {
                    fetch: e,
                    getJSON: function(t) {
                        var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                            o = n({}, r, {
                                method: "GET",
                                headers: n({
                                    Accept: "application/json"
                                }, r.headers)
                            });
                        return e(t, o).then(function(e) {
                            return e.json()
                        })
                    }
                }
            }
        }
    }])
});