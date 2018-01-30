/**
 * bw8chatInit v1.1
 * by mark 2018-01-10
 * 更新内容：
 * 1.增加function内部严格模式声明
 * 2.取消重复3次设定GNWebChat公共属性,改为初始化设定一次
 * 3.取消冗余正则转移字符：.
 * 4.取消冗余的GNWebChat.bw8JQuery $简写
 */
var GNWebChat = {
    bw8ChatHttpPrefix: null,
    bw8ChatHttpRootPrefix: null,
    bw8ChatHttpChatPrefix: null,
    bw8JQuery: null,
    bw8ChatOnlineObj: null,
    bw8ChatClientSiteIsHttps: "https:" === document.location.protocol ? true : false,
    bw8ChatHost: null,
    bw8ChatCDNHost: "dev.bangwo8.com",
    gnway_loadCssJsPkg: function (tp, url, fun) {
        "use strict";
        var nowDate = new Date();
        // var version = "" + nowDate.getFullYear() + nowDate.getMonth();
        var version = nowDate.getTime();
        if (url.indexOf("?") === -1) {
            url += "?v=std-" + version;
        } else {
            url += "&v=std-" + version;
        }
        var _doc = document.getElementsByTagName("head")[0];
        var js = null;
        if (tp === "css") {
            js = document.createElement("link");
            js.setAttribute("rel", "stylesheet");
            js.setAttribute("type", "text/css");
            js.setAttribute("href", url);
        } else {
            js = document.createElement("script");
            js.setAttribute("type", "text/javascript");
            js.setAttribute("src", url);
            js.setAttribute("charset", "gb2312");
        }
        js.caller = this;
        _doc.appendChild(js);
        if (!/*@cc_on!@*/0) {
            js.onload = function () {
                if (typeof(fun) !== "undefined") {
                    fun();
                }
            };
        } else {
            js.onreadystatechange = function () {
                if (js.readyState === "loaded" || js.readyState === "complete") {
                    if (typeof(fun) !== "undefined") {
                        fun();
                    }
                }
            };
        }
    },
    gnway_initBW8JQuery: function () {
        "use strict";
        GNWebChat.bw8JQuery = jQuery.noConflict();
        window.self.jQuery = window.self.jQueryOther;
        GNWebChat.gnway_detectCssJsPkg();
    },
    gnway_getHttpPrefix: function () {
        "use strict";
        var tagObjs = document.getElementsByTagName("script");
        for (var tagIdx in tagObjs) {
            if (typeof(tagObjs[tagIdx].getAttribute) === "undefined") {
                continue;
            }
            var tagSrc = tagObjs[tagIdx].getAttribute("src");
            if (tagSrc !== null && tagSrc.indexOf("chatInit") !== -1) {
                GNWebChat.bw8ChatHttpPrefix = tagSrc.replace(/chatInit[^.]*\.js.*$/, "");
                var myUrlArr = tagSrc.match(/(http|https):\/\/([^\/]*)/i);
                if (myUrlArr !== null) {
                    GNWebChat.bw8ChatHost = myUrlArr[2];
                }
                break;
            }
        }
        if (GNWebChat.bw8ChatClientSiteIsHttps) {
            GNWebChat.bw8ChatHttpPrefix = "https://" + GNWebChat.bw8ChatCDNHost + "/osp2016/chat/js/";
            GNWebChat.bw8ChatHttpRootPrefix = "https://" + GNWebChat.bw8ChatHost + "/";
            GNWebChat.bw8ChatHttpChatPrefix = "https://" + GNWebChat.bw8ChatHost + "/osp2016/chat/"
        } else {
            GNWebChat.bw8ChatHttpPrefix = "http://" + GNWebChat.bw8ChatCDNHost + "/osp2016/chat/js/";
            GNWebChat.bw8ChatHttpRootPrefix = "http://" + GNWebChat.bw8ChatHost + "/";
            GNWebChat.bw8ChatHttpChatPrefix = "http://" + GNWebChat.bw8ChatHost + "/osp2016/chat/"
        }
        return true;
    },
    gnway_detectCssJsPkg: function () {
        "use strict";
        if (GNWebChat.bw8JQuery === null) {
            window.self.jQueryOther = window.self.jQuery;
            GNWebChat.gnway_loadCssJsPkg("js", GNWebChat.bw8ChatHttpPrefix + "jquery-1.9.1.min.js", GNWebChat.gnway_initBW8JQuery);
            return;
        }
        if (typeof(gnway_bw8ChatReady) === "undefined") {
            GNWebChat.gnway_loadCssJsPkg("js", GNWebChat.bw8ChatHttpPrefix + "chatCore.js", GNWebChat.gnway_detectCssJsPkg);
            return;
        }
        return true;
    },
    gnway_init:function(){
        "use strict";
        GNWebChat.gnway_getHttpPrefix();
        if (GNWebChat.bw8ChatHttpPrefix === null) {
            return;
        }
        GNWebChat.gnway_detectCssJsPkg();
    }
};
GNWebChat.gnway_init();



