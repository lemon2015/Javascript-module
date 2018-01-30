/**
 * Created by mark on 18-1-10.
 */
!function (e) {
    function t(e) {
        e = e || window.location.href;
        var t = e.substring(e.lastIndexOf("?") + 1);
        t.lastIndexOf("#") >= 0 && (t = t.substring(0, t.lastIndexOf("#")));
        for (var n = t.split("&"), a = {}, i = 0; i < n.length; i++) {
            var o = n[i], l = o.substring(0, o.indexOf("=")), r = o.substring(o.indexOf("=") + 1);
            /^-?(\d+)(\.\d+)?$/.test(r) ? a[l] = Number(r) : "true" === r ? a[l] = !0 : "false" === r ? a[l] = !1 : a[l] = r
        }
        return a
    }

    var n, a, i, o, l, r, c = 40, s = navigator.userAgent.indexOf("Mobile") >= 0, d = s ? 1 : 3,
        b = '<li><div class="bubble-box" id="bubble-box"> <div class="bubble-header" id="bubble-header"><img src="{0}" /></div><div class="bubble-content" id="bubble-content" style="{1}" ><span class="bubble-custom-name">{2}</span><span class="bubble-req-time">{3}</span><p  style="max-height:77px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;margin-top:10px;margin-bottom:5px;">{4}</p></div></div></li>',
        u = {}, g = t() || {};
    !function (e) {
        switch (e) {
            case"en":
                u = {
                    L0001: "today",
                    L0002: "yestoday",
                    L0003: "[photo]",
                    L0004: "[voice]",
                    L0005: "[send a message to you]"
                };
                break;
            default:
                u = {L0001: "今天", L0002: "昨天", L0003: "[图片]", L0004: "[语音]", L0005: "[给您发送了一条新消息]"}
        }
    }(g.lan);
    var f = function (e, t, n) {
        e.addEventListener ? e.addEventListener(t, n, !0) : e.attachEvent("on" + t, n)
    }, p = function (e, t) {
        var n = /\{\d+\}/g, a = 0;
        return n.test(e) && "[object Array]" === Object.prototype.toString.call(t) ? e.replace(n, function () {
            var e = t[a++];
            return e
        }) : e
    }, w = function (e, t) {
        var n, a = new Date(t);
        if (t) {
            var i = new Date, o = Math.abs(i.getDate() - a.getDate()),
                l = a.getHours() > 9 ? a.getHours() : "0" + a.getHours(),
                r = a.getMinutes() > 9 ? a.getMinutes() : "0" + a.getMinutes(), c = a.getFullYear();
            switch (o) {
                case 0:
                    n = p("{0} {1}:{2}", [u.L0001, l, r]);
                    break;
                case 1:
                    n = p("{0} {1}:{2}", [u.L0002, l, r]);
                    break;
                default:
                    n = p("{0} {1}:{2}", [c, l, r])
            }
        }
        return n
    }, h = function () {
        i = document.getElementById("clearBtn"), l = document.getElementById("bubble-wrap"), o = document.getElementById("wapClearBtn")
    }, m = function () {
        var e = document.getElementById("bubble-wrap"), t = e.getElementsByTagName("li");
        if (t && t.length > 0) {
            s && (document.getElementById("wapClearBtn").style.display = "block");
            for (var i = 0; i < t.length; i++)t[i].style.height = t[i].childNodes[0].offsetHeight + "px";
            switch (i) {
                case 1:
                    a = 20;
                    break;
                case 2:
                    a = 40;
                    break;
                case 3:
                    a = 60;
                    break;
                default:
                    a = 0
            }
            n = s ? document.getElementById("bubble-wrap").offsetHeight + a + "px" : document.getElementById("bubble-wrap").offsetHeight + a + c + "px"
        } else n = 0;
        window !== window.parent && window.parent.postMessage(JSON.stringify({
            type: "bubble.frameHeight",
            data: n
        }), "*")
    }, y = function (e) {
        var t = "";
        e = e.childNodes || e;
        for (var n = 0; n < e.length; n++)t += 1 != e[n].nodeType ? e[n].nodeValue : y(e[n].childNodes);
        return t
    }, v = function (e) {
        var t = e;
        return e.indexOf("webchat_img_upload") >= 0 ? t = u.L0003 : e.indexOf("webchat_voice_upload") >= 0 ? t = u.L0004 : (e.indexOf("/>") >= 0 || e.indexOf("</") >= 0) && (t = u.L0005), r || (r = document.createElement("div")), r.innerHTML = t, t = y(r)
    }, x = function (e) {
        window.parent !== window && parent.postMessage(JSON.stringify({
            type: "bubble.customBtn",
            data: e
        }), "*"), e.content = v(e.content);
        var t = document.createElement("div"), n = "";
        s && (n = "width:70%;max-width:70%;"), t.innerHTML = p(b, [e.header, n, e.name, w(+new Date, e.t), e.content]);
        var a = t.getElementsByTagName("li")[0], i = l.children;
        if (i && i.length >= d && (l.removeChild(l.children[0]), s))for (var o = 0; o < i.length; o++)l.removeChild(l.children[0]);
        l.appendChild(a);
        try {
            var r = a.childNodes[0].childNodes[2];
            f(r, "click", O)
        } catch (c) {
        }
        S.set(e), m()
    }, O = function () {
        window !== window.parent && window.parent.postMessage(JSON.stringify({type: "bubble.clickMsg"}), "*")
    }, S = {
        set: function (e) {
            if (window.localStorage) {
                var t = window.localStorage.getItem("bubbleData");
                t = JSON.parse(t) || [], t && (t && t.length >= d && t.shift(0), s && (t = []), t.push(e), t = JSON.stringify(t));
                try {
                    window.localStorage.setItem("bubbleData", t)
                } catch (n) {
                }
            }
        }, get: function (e) {
            if (window.localStorage) {
                var t = window.localStorage.getItem(e);
                if ("string" == typeof t)try {
                    t = JSON.parse(t) || []
                } catch (n) {
                } else"object" == typeof t && (t = t || []);
                for (var a = 0; a < t.length; a++) {
                    var i = document.createElement("div"), o = "";
                    s && (o = "width:70%;max-width:70%;"), i.innerHTML = p(b, [t[a].header, o, t[a].name, w(+new Date, t[a].t), t[a].content]);
                    var r = i.getElementsByTagName("li")[0];
                    l.appendChild(r);
                    try {
                        var c = r.childNodes[0].childNodes[2];
                        f(c, "click", O)
                    } catch (n) {
                    }
                    m()
                }
            }
        }
    }, N = function (e) {
        var t = [];
        if ("string" == typeof e.data)try {
            t = JSON.parse(e.data)
        } catch (n) {
        } else"object" == typeof e.data && (t = e.data);
        switch (t.type) {
            case"bubble.onDefalutMsg":
                m();
                break;
            case"bubble.reviceMsg":
                x(t.data);
                break;
            case"bubble.expand":
                I()
        }
    }, B = function () {
        if (window.localStorage) {
            var e = window.localStorage.getItem("bubbleData");
            e = JSON.parse(e), e && e.length > 0 && (clearBtn.style.filter = "Alpha(Opacity=100)", clearBtn.style.opacity = "1")
        }
    }, L = function () {
        if (window.localStorage) {
            var e = window.localStorage.getItem("bubbleData");
            e = JSON.parse(e), e && e.length > 0 && (clearBtn.style.filter = "Alpha(Opacity=0)", clearBtn.style.opacity = "0")
        }
    }, k = function () {
        clearBtn.style.backgroundPosition = "0 -272px"
    }, E = function () {
        clearBtn.style.backgroundPosition = "0 -170px"
    }, I = function () {
        if (window.localStorage) {
            try {
                window.localStorage.setItem("bubbleData", "[]")
            } catch (e) {
            }
            S.get("bubbleData");
            var t = l.children.length;
            if (t > 0) {
                for (var n = 0; n < t; n++)l.removeChild(l.children[0]);
                m()
            }
        }
        window !== window.parent && window.parent.postMessage(JSON.stringify({type: "bubble.removeAll"}), "*")
    }, M = function () {
        f(window, "message", N), f(document, "mouseover", B), f(document, "mouseleave", L), f(i, "mouseenter", k), f(i, "mouseleave", E), f(i, "click", I), f(o, "click", I)
    }, D = function () {
        if (S.get("bubbleData"), s) {
            i.style.display = "none";
            var e = document.body.offsetWidth;
            e >= 300 && e < 340 ? o.style.right = "8px" : e >= 340 && e < 360 ? o.style.right = "22px" : e >= 360 && (o.style.right = "33px")
        } else o.style.display = "none"
    }, H = function () {
        h(), M(), D()
    };
    H()
}();