/**
 * Created by mark on 18-1-10.
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    /**
     * Created by gouding on 16/4/18.
     */

    var Comm = {
        //上一个访问的url链接
        preURLLink: document.referrer,
        /**
         decode
         **/
        decodeUrl: function(str) {
            if (typeof str === 'string') {
                return decodeURIComponent(str);
            } else {
                return undefined;
            }

        },
        /**
         * 将url里面query字符串转换成对象
         */
        getQueryParam: function(href) {
            href = href || document.location.href;
            var queryString = href.substring(href.lastIndexOf("?") + 1);
            if (queryString.lastIndexOf("#") >= 0) {
                queryString = queryString.substring(0, queryString.lastIndexOf("#"));
            }
            var list = queryString.split("&");
            var param = {};
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                try {
                    var key = item.substring(0, item.indexOf("="));
                    var value = item.substring(item.indexOf("=") + 1);
                    if (key.length == 0) {
                        continue;
                    }

                    if (/^-?(\d+)(\.\d+)?$/.test(value)) {
                        if (("" + value).length > 10) {
                            param[key] = "" + value;
                        } else {
                            param[key] = Number(value);
                        }
                    } else if (value === 'true') {
                        param[key] = true;
                    } else if (value === 'false') {
                        param[key] = false;
                    } else {
                        param[key] = Comm.decodeUrl(value);
                    }
                } catch (e) {
                    continue;
                }
            }
            return param;
        },
        //传入文本把url筛选出来
        getUrlRegex: function(strMsg) {
            strMsg = strMsg.replace(/&amp;/g, '&');
            strMsg = strMsg.replace(/&amp/g, '&');
            var res = '';
            var wordArrs = strMsg.split(/\s+/);
            for (var i = 0; i < wordArrs.length; i++) {
                var tmp = (function(str) {
                    var regExp = /((https?|ftp|news):\/\/)?([a-zA-Z]([a-z0-9A-Z\-]*[\.])+([a-zA-Z]{2}|(aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)(:[0-9]{1,4})?)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(:[0-9]{1,4})?)(\/[a-zA-Z0-9_%=#\-\.~]+)*(\/([a-zA-Z0-9%=#_\-\.]*)(\?[a-zA-Z0-9+_/\-\.#%=&]*)?)?(#[a-zA-Z][a-zA-Z0-9_]*)?$/;
                    //若未开头 需要添加
                    if (str.match(regExp)) {
                        var regExp1 = /(https?):\/\/([a-zA-Z]([a-z0-9A-Z\-]*[\.])+([a-zA-Z]{2}|(aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)(:[0-9]{1,4})?)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(:[0-9]{1,4})?)(\/[a-zA-Z0-9_%=#\-\.~]+)*(\/([a-zA-Z0-9%=#_\-\.]*)(\?[a-zA-Z0-9+_/\-\.#%=&]*)?)?(#[a-zA-Z][a-zA-Z0-9_]*)?$/;
                        if (!str.match(regExp1)) {
                            str = '<a href="http://' + str + '" target="_blank">' + str + '</a>';
                        } else
                            str = '<a href="' + str + '" target="_blank">' + str + '</a>';
                    }
                    return str + ' ';

                })(wordArrs[i]);
                res += tmp;
            }
            return res;
        },
        getNewUrlRegex: function(strMsg) {
            strMsg = strMsg.replace(/&amp;/g, '&');
            strMsg = strMsg.replace(/&amp/g, '&');
            var res = '';
            var wordArrs = strMsg.split(/\s+/);
            for (var i = 0; i < wordArrs.length; i++) {
                var tmp = (function(str) {
                    var regExp = /^(((https?):\/\/)|(www))[a-zA-Z0-9_\-]+((\.(com|cn|org))|(:[0-9]{2,4}))?(:[0-9]{2,4})?([:\/\?\.&\-=a-zA-Z0-9;#%_]+)?$/g;
                    //是否能匹配出url 此处确对匹配
                    if (str.match(regExp)) {
                        //判断是否添加 http 标签
                        if (!str.match(regExp)) {
                            str = '<a href="http://' + str + '" target="_blank">' + str + '</a>';
                        } else {
                            str = '<a href="' + str + '" target="_blank">' + str + '</a>';
                        }
                    }
                    else {
                        var regExp1 = /((www.)|((https?):\/\/))[a-zA-Z0-9_\-]+((\.(com|cn|org))|(:[0-9]{2,4}))?(:[0-9]{2,4})?([:\/\?\.&\-=a-zA-Z0-9;#%_]+)?/g;
                        var regArr = str.match(regExp1);
                        var ret = regArr;
                        if (regArr && regArr.length > 0) {
                            //取出第一项的匹配
                            var indexNo = str.indexOf(regArr[0]);
                            //是否有 http开头
                            var isHttpNo = regArr[0].indexOf('http');
                            if (isHttpNo >= 0) {
                                ret = '<a href="' + regArr[0] + '" target="_blank">' + regArr[0] + '</a>';
                            } else {
                                ret = '<a href="http://' + regArr[0] + '" target="_blank">' + regArr[0] + '</a>';
                            }
                            //拼url
                            // var _str;
                            if (indexNo === 0) {
                                str = ret + str.substring(regArr[0].length, str.length);
                            } else {
                                var _str1 = str.substring(0, indexNo);
                                var _str2 = _str1 + regArr[0];
                                var _str3 = str.substring(_str2.length, str.length);
                                str = _str1 + ret + _str3;
                            }
                        }
                    }
                    return str + ' ';

                })(wordArrs[i]);
                res += tmp;
            }
            return res;
        },
        //str 系统提示语  args 组装数据  isFormat 是否需要组装
        format: function(str, args, isFormat) {
            if (isFormat) {
                var result;
                if (typeof(args) == "object") {
                    for (var key in args) {
                        var reg = '{' + key + '}';
                        result = str.replace(reg, args[key]);
                    }
                } else {
                    for (var i = 0; i < args.length; i++) {
                        if (args[i] == undefined) {
                            return "";
                        } else {
                            var reg = '{' + i + '}';
                            result = str.replace(reg, args[i]);
                        }
                    }
                }
                return result;
            } else {
                return str;
            }
        },
        //判断浏览器是否支持某个事件
        detectEventSupport: function(eventName) {
            var tempElement = document.createElement('div'),
                isSupported;
            eventName = 'on' + eventName;
            isSupported = (eventName in tempElement); // 使用第一种方式
            // 如果第一种方式行不通，那就来看看它是不是已知事件类型
            if (!isSupported) {
                tempElement.setAttribute(eventName, 'xxx');
                isSupported = typeof tempElement[eventName] === 'function';
            }
            // 清除掉动态创建的元素，以便内存回收
            tempElement = null;
            // 返回检测结果
            return isSupported;
        }
    };
    module.exports = Comm;

},{}],2:[function(require,module,exports){
    module.exports={
        "errorlogPath": "log.sobot.com/errorlog/"
    }

},{}],3:[function(require,module,exports){
    var initConfig = function(pageType) {
        //引用外部js
        var Comm = require('./comm.js');
        var Promise = require('./util/promise.js');
        var initText = require("./initText.js");
        var outerPromise = new Promise();
        //api接口
        var api = {
            config_url: '/chat/user/config.action',
            init_url: '/chat/user/init.action',
            active_url: '/chat/user/productRecommend.action'
        };
        var isMobile = window.navigator.userAgent.indexOf("Mobile") >= 0;
        //存储数据对象
        var That = {};
        That.cacheInfo = {};

        That.cacheInfo.flags = {
            status: 'enabled',
            isLoaded: false,
            pageNow: 1,
            pageSize: 20,
            moreHistroy: false,
            isConnected: false, // 是否已建立会话连接
            isEnableManual: false, // 客服是否可用
            isEnableOnInput: true, // 是否可以显示客服输入状态
            isGetCustomConfig: false, // 设的一个标识用来判断是否是否已走getCustomConfig
            isEnableBigImg: true, // 默认可以放大图片
            isPeopleModel: false, // 人工模式是否可用
            isWaitModel: false, // 是否处于等待模式
            isTimeLine: false, // 是否显示时间线，默认不显示
            isUserTalked: false, // 是否已聊过
            isSurveyed: false, // 是否已评价
            isKeepSessions: false, // 是否保持会话
            isOutOneMinute: false // 是否已超时一分钟
        };
        //是否开启系统提示语
        var isLanOpen = true,
            lanType = 'CN';
        var params = Comm.getQueryParam();
        //初始化配置信息
        var config = {
            //FIXME 初始化url参数
            initParams: function() {

                var that = That.cacheInfo.urlParams = {};
                var _urlParams = Comm.getQueryParam();
                if (_urlParams) {
                    for (var item in _urlParams) {
                        that[item] = _urlParams[item];
                    }
                }

                //FIXME 语言设置
                if (That.cacheInfo.urlParams.lan) {
                    var lan = That.cacheInfo.urlParams.lan;
                    switch (lan) {
                        //默认为中文 0   英文 1
                        case 'en':
                            That.cacheInfo.urlParams.lanFlag = 1;
                            break;
                        default:
                            That.cacheInfo.urlParams.lanFlag = 0;
                            break;
                    }
                }


            },
            //FIXME 初始化UA参数
            initUA: function() {
                var that = That.cacheInfo.UAInfo = {};
                // FIXME 是否添加魅族机器'mz'还需验证。
                var uaList = ['mz', 'xiaomi', 'android', 'ipad', 'iphone'],
                    pcUaList = ['windows', 'linux', 'mac'],
                    uaListLen = uaList.length,
                    pcUaListLen = pcUaList.length,
                    userAgent = navigator.userAgent.toLowerCase(),
                    uaWidth = $(window).width(),
                    uaHeight = $(window).height(),
                    uaIndex = 0,
                    iphoneVersion = 'iphone-5',
                    returnUA = '';
                that.uaHeight = uaHeight;
                // 先取手机端UA
                for (var i = 0,
                         item = ''; i < uaListLen; i++) {
                    if (returnUA.length) {
                        break;
                    }
                    item = uaList[i];
                    // FIXME 是否需要通过正则来匹配，避免贪婪导致的识别错误
                    // 或者处理UA阶段会把iPhone、iPod touch等都识别为iPhone，然后再通过widht&height来区分版本
                    uaIndex = userAgent.indexOf(item);
                    // 1.需要识别iphone版本
                    if (item === 'iphone' && uaIndex > 0) {
                        // 依据宽高来判断iPhone版本
                        // 返回iPhone版本
                        if (uaWidth > 310 && uaWidth < 320) {
                            uaWidth = 1;
                        }
                        if (uaWidth > 365 && uaWidth < 385) {
                            uaWidth = 2;
                        }
                        if (uaWidth > 404 && uaWidth < 424) {
                            uaWidth = 3;
                        }
                        switch (uaWidth) {
                            case 1:
                                iphoneVersion = 'iphone-5';
                                // iPhone 4 (4, 4S) && iPhone 5 (5c, 5s)
                                break;
                            case 2:
                                iphoneVersion = 'iphone-6';
                                // iPhone 6
                                break;
                            case 3:
                                iphoneVersion = 'iphone-6+';
                                // iPhone 6+
                                break;
                        }
                        // 定义全局的iphoneVersion
                        that.iphoneVersion = iphoneVersion;
                        that.UA = item;
                        break;
                    }
                    // 2.识别其他机器
                    if (uaIndex > 0) {
                        that.UA = item;
                        break;
                    }
                }
                // 再取PC端UA
                if (uaIndex <= 0) {
                    for (var i = 0,
                             item = ''; i < pcUaListLen; i++) {
                        item = pcUaList[i];
                        uaIndex = userAgent.indexOf(item);

                        if (uaIndex > 0) {
                            that.UA = 'pc';
                            break;
                        }
                    }
                }
            },
            //FIXME 初始化浏览器信息
            initBrowser: function() {
                var that = That.cacheInfo.browser = {};
                var browserList = ['mqqbrowser', // QQ浏览器(注意mqqbrowser和qq的顺序)
                        'qq', // 手机qq
                        'micromessenger', // 微信浏览器
                        'ucbrowser', // UC浏览器(注意ucbrowser和safari的顺序)
                        'miuibrowser', // 小米浏览器
                        'safari', // Safari浏览器
                        'opera mobi', // Opera浏览器
                        'opera mini', // Opera Mini浏览器
                        'firefox' // Firefox浏览器
                    ],
                    browserListLen = browserList.length,
                    userAgent = navigator.userAgent.toLowerCase(),
                    uaIndex = 0;

                for (var i = 0,
                         item = ''; i < browserListLen; i++) {
                    item = browserList[i];
                    uaIndex = userAgent.indexOf(item);
                    if (uaIndex > 0) {
                        that.browser = item;
                        return;
                        //  return item;
                    }
                }
            },
            //FIXME 初始化语言设置
            initLanguage: function() {
                var that = That.cacheInfo.language = {};
                //如果打开就显示系统提示
                if (isLanOpen) {
                    that.open = true;

                } else {
                    that.open = false;
                }
            },
            //FIXME 初始化Event类型
            initEventType: function() {
                var that = That.cacheInfo.eventType = {};
                if (That.cacheInfo.UAInfo.UA == 'xiaomi') {
                    //小米是mousedown事件
                    that.type = 'mousedown';
                    //  return 'mousedown';
                } else if (That.cacheInfo.UAInfo.UA != 'pc') {
                    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
                        hasTouch = 'ontouchstart' in window && !isTouchPad;
                    that.type = hasTouch ? 'touchstart' : 'mousedown';
                    //  return hasTouch ? 'touchstart' : 'mousedown';
                } else {
                    that.type = 'click';
                    //  return 'click';
                }
            },
            //FIXME 初始化用户信息
            initUserInfo: function() {
                //工单来源，0客服提交，1 PC普通用户留言提交，2 H5普通用户留言提交，3普通用户微信提交，4普通用户APP提交
                // 用户来源，PC 0,微信 1 ,APP 2,WAP 4
                var oSource = isMobile ? 4 : 0, // 用户来源 0：PC 1：微信 2：APP 3：微博 4：WAP
                    urlParams = Comm.getQueryParam();
                var sourceData = urlParams['source'];
                if (typeof sourceData == 'number') {
                    oSource = sourceData;
                }
                //console.log(urlParams);
                That.cacheInfo.userInfo = {
                    source: oSource,
                    tel: urlParams['tel'] ? urlParams['tel'] : '',
                    uname: urlParams['uname'] ? urlParams['uname'] : '',
                    partnerId: urlParams['partnerId'] ? urlParams['partnerId'] + "" : '',
                    email: urlParams['email'] ? urlParams['email'] : '',
                    visitUrl: urlParams['visitUrl'] ? urlParams['visitUrl'] : Comm.preURLLink,
                    visitTitle: urlParams['visitTitle'] ? urlParams['visitTitle'] : '',
                    // face : urlParams['face'] ? urlParams['face'] : getHanderImg(),//默认用户头像
                    face: urlParams['face'] ? urlParams['face'] : '', //默认用户头像
                    back: urlParams['back'] ? urlParams['back'] : '',
                    realname: urlParams['realname'] ? urlParams['realname'] : '',
                    weibo: urlParams['weibo'] ? urlParams['weibo'] : '',
                    weixin: urlParams['weixin'] ? urlParams['weixin'] : '',
                    qq: urlParams['qq'] ? urlParams['qq'] : '',
                    sex: urlParams['sex'] ? urlParams['sex'] : urlParams['sex'] === 0 ? 0 : '',
                    birthday: urlParams['birthday'] ? urlParams['birthday'] : '',
                    remark: urlParams['remark'] ? urlParams['remark'] : '',
                    color: urlParams['color'] ? urlParams['color'] : '', //FIXME  默认优先从配置中取主题色
                    modulType: urlParams['modulType'] ? urlParams['modulType'] : '', //FIXME 默认优先客服模式从配置中取
                    params: urlParams['params'] ? urlParams['params'] : '', //FIXME 自定义字段
                    lastCid: urlParams['cid'] ? urlParams['cid'] : '', //cid
                    customerFields: urlParams['customerFields'] ? urlParams['customerFields'] : '' //用户自定义字段
                };
            },
            //FIXME 初始化SysNum系统 id
            initSysNum: function() {
                That.cacheInfo.sysNum = Comm.getQueryParam()['sysNum'];
            }
        };

        var judgeEnviroment = function() {
            var promise = new Promise();
            setTimeout(promise.resolve, 0);
            return promise;
        };

        var getLeaveMessage = function(params, global) {
            //console.log(params);
            var arr = ['leaveMessage.html'];
            var count = 0;
            var obj = {};
            for (var el in params) {
                obj[el] = params[el];
            }
            obj['uid'] = global.apiInit.uid;
            obj['uname'] = global.apiInit.uname;

            for (var el in obj) {
                var value = encodeURIComponent(obj[el]);
                if (value.length > 50) {
                    continue;
                }
                if (count == 0) {
                    arr.push("?");
                } else {
                    arr.push("&");
                }
                arr.push(el + "=" + value);
                count++;
            }
            var str = arr.join("");
            return str;
        };

        var decodeURL = function(str) {
            if (str === undefined || str === null || str !== str) {
                return '';
            }
            try {
                return decodeURIComponent(str);
            } catch (e) {
                return '';
            }
        }
        //promise方法
        var promiseHandler = function() {
            judgeEnviroment().then(function(value, promise) {
                var promise = promise || new Promise();
                config.initUA();
                config.initParams();
                config.initLanguage();
                config.initSysNum();
                config.initBrowser();
                config.initUserInfo();
                config.initEventType();
                $.ajax({
                    type: "post",
                    url: api.config_url,
                    dataType: "json",
                    data: {
                        sysNum: That.cacheInfo.sysNum,
                        source: That.cacheInfo.userInfo.source,
                        lanFlag: That.cacheInfo.urlParams.lanFlag || 0,
                        robotFlag: params.robotFlag || ""
                    },
                    success: (function(data) {
                        //FIXME  在此判断客服模式
                        var mType = That.cacheInfo.userInfo.modulType;
                        var mColor = That.cacheInfo.userInfo.color;
                        if (typeof mType == 'number' && (mType >= 1 && mType <= 4)) { //现在模式只有1到4共四个等级
                            mType = Math.floor(mType);
                            data.type = mType;
                        }
                        //颜色只能传#666 或 #ffddaa
                        var _color;
                        var testColor = /^(([a-fA-F0-9]{3})|([a-fA-F0-9]{6}))$/;
                        if (mColor) {
                            _color = decodeURIComponent(mColor);
                            if (testColor.test(_color)) {
                                data.color = '#' + _color;
                            }
                        }
                        That.cacheInfo.userInfo.color = data.color;
                        That.cacheInfo.apiConfig = data;
                        ////后台设置初始化
                        // console.log(That.cacheInfo);
                        //默认为中文 0   英文 1
                        if (!That.cacheInfo.urlParams.lanFlag) {
                            if (That.cacheInfo.apiConfig.lan) {
                                That.cacheInfo.urlParams.lanFlag = That.cacheInfo.apiConfig.lan
                                That.cacheInfo.urlParams.lan = "en"
                            }
                        }

                        //FIXME 初始化机器人回答语后面显示转人工按钮,先取url里面，没有再取后台
                        var manualTypeObj = {},
                            manualTypeAry = [];
                        if (typeof params.manualType === "string") {
                            manualTypeAry = params.manualType.split(",");
                        } else if (typeof That.cacheInfo.apiConfig.manualType === "string") {
                            manualTypeAry = That.cacheInfo.apiConfig.manualType.split(",");
                        }
                        manualTypeObj.direct = manualTypeAry[0];
                        manualTypeObj.under = manualTypeAry[1];
                        manualTypeObj.guide = manualTypeAry[2];
                        manualTypeObj.unknow = manualTypeAry[3];
                        That.cacheInfo.urlParams.manualTypeObj = manualTypeObj;

                        //机器人遇到未知显示转人工按钮
                        if (typeof params.artificial !== "undefined") {
                            That.cacheInfo.urlParams.chatConnectButton = params.artificial;
                        } else {
                            That.cacheInfo.urlParams.chatConnectButton = That.cacheInfo.apiConfig.chatConnectButton;
                        }
                        if (typeof params.tranFlag !== 'number') {
                            That.cacheInfo.urlParams.tranFlag = 0;
                        } else {
                            That.cacheInfo.urlParams.tranFlag = params.tranFlag;
                        }
                        if (typeof params.artificialCount !== "undefined") {
                            That.cacheInfo.urlParams.manualBtnCount = params.artificialCount;
                        } else {
                            That.cacheInfo.urlParams.manualBtnCount = That.cacheInfo.apiConfig.manualBtnCount;
                        }
                        var urlpar = window.location.href.split("?")[1];
                        var urlafter = "";

                        //第三方url,不能将sysNum带过去
                        var reg = /sysNum=(\w){1,100}(&)?/;
                        if (reg.test(urlpar)) {
                            var regAry = reg.exec(urlpar);
                            urlpar = urlpar.replace(regAry[0], "");
                        };
                        //console.log(urlpar);
                        if (typeof params.wurl !== "undefined") {
                            if (params.wurl.split("?")[1]) {
                                urlafter = "?" + params.wurl.split("?")[1] + "&" + urlpar;
                                That.cacheInfo.urlParams.wurl = params.wurl.split("?")[0] + urlafter;
                            } else {
                                urlafter = "?" + urlpar;
                                That.cacheInfo.urlParams.wurl = params.wurl + urlafter;
                            }
                        } else {
                            if (That.cacheInfo.apiConfig.wurl.split("?")[1]) {
                                //console.log(2);
                                urlafter = "?" + That.cacheInfo.apiConfig.wurl.split("?")[1] + "&" + urlpar;
                                That.cacheInfo.urlParams.wurl = That.cacheInfo.apiConfig.wurl.split("?")[0] + urlafter;
                            } else {
                                //console.log(3);
                                urlafter = "?" + urlpar;
                                That.cacheInfo.urlParams.wurl = That.cacheInfo.apiConfig.wurl + urlafter;
                            }
                        }
                        // console.log(That.cacheInfo.apiConfig.leaveCustomUrl + urlafter);

                        if (typeof params.leaveCustomUrl !== "undefined") {
                            if (params.leaveCustomUrl.split("?")[1]) {
                                urlafter = "?" + params.leaveCustomUrl.split("?")[1] + "&" + urlpar;
                                That.cacheInfo.urlParams.leaveCustomUrl = params.leaveCustomUrl.split("?")[0] + urlafter;
                            } else {
                                urlafter = "?" + urlpar;
                                That.cacheInfo.urlParams.leaveCustomUrl = params.leaveCustomUrl + urlafter;
                            }
                        } else {
                            if (That.cacheInfo.apiConfig.leaveCustomUrl && That.cacheInfo.apiConfig.leaveCustomUrl.split("?")[1]) {
                                urlafter = "?" + That.cacheInfo.apiConfig.leaveCustomUrl.split("?")[1] + "&" + urlpar;
                                That.cacheInfo.urlParams.leaveCustomUrl = That.cacheInfo.apiConfig.leaveCustomUrl.split("?")[0] + urlafter;
                            } else {
                                urlafter = "?" + urlpar;
                                That.cacheInfo.urlParams.leaveCustomUrl = That.cacheInfo.apiConfig.leaveCustomUrl + urlafter;
                            }
                        }

                        //转人工按钮打开方式(wurlOpenStyle)
                        //转人工按钮打开方式(新窗口打开还是当前页打开，小浮窗里面只能在新窗口打开，设计如此)
                        if (typeof params.wurlOpenStyle !== "undefined") {
                            That.cacheInfo.urlParams.wurlOpenStyle = params.wurlOpenStyle;
                        } else {
                            That.cacheInfo.urlParams.wurlOpenStyle = true;
                        }
                        //转人工第三方开关
                        if (typeof params.isCustomSysFlag !== "undefined" && params.wurl) {
                            That.cacheInfo.urlParams.isCustomSysFlag = params.isCustomSysFlag;
                        } else {
                            That.cacheInfo.urlParams.isCustomSysFlag = That.cacheInfo.apiConfig.isCustomSysFlag;
                        }
                        //留言的打开方式
                        if (typeof params.isLeaveCustomSysFlag !== "undefined") {
                            That.cacheInfo.urlParams.isLeaveCustomSysFlag = params.isLeaveCustomSysFlag;
                        } else {
                            That.cacheInfo.urlParams.isLeaveCustomSysFlag = That.cacheInfo.apiConfig.isLeaveCustomSysFlag;
                        }
                        //留言第三方开关
                        // if (typeof params.isLeaveCustomSysFlag !== "undefined" && params.leaveCustomUrl) {
                        //     That.cacheInfo.urlParams.leaveWurl = params.leaveCustomUrl;
                        // } else {
                        //     That.cacheInfo.urlParams.leaveWurl = That.cacheInfo.apiConfig.leaveCustomUrl;
                        // }
                        //msgflag控制窗体中和结束会话的留言,0开启，1关闭
                        if (typeof params.msgflag !== "undefined") {
                            That.cacheInfo.urlParams.msgflag = params.msgflag;
                        } else {
                            That.cacheInfo.urlParams.msgflag = That.cacheInfo.apiConfig.msgflag;
                        }
                        //ismessageflag按制输入框中的留言,0关闭，1开启
                        if (typeof params.isMessageFlag !== "undefined") {
                            That.cacheInfo.urlParams.isMessageFlag = params.isMessageFlag;
                        } else {
                            That.cacheInfo.urlParams.isMessageFlag = That.cacheInfo.apiConfig.isMessageFlag;
                        }
                        // alert(typeof params.satDegree_A);
                        //满意度开关，false为关闭
                        if (typeof params.satDegree_A !== "undefined") {
                            That.cacheInfo.urlParams.satDegree_A = params.satDegree_A;
                        } else {
                            That.cacheInfo.urlParams.satDegree_A = true; //That.cacheInfo.apiConfig.satDegree_A;
                        }
                        //输入框的满意度开关
                        if (typeof params.isFeedBackFlag !== "undefined") {
                            That.cacheInfo.urlParams.isFeedBackFlag = params.isFeedBackFlag;
                        } else {
                            That.cacheInfo.urlParams.isFeedBackFlag = That.cacheInfo.apiConfig.isFeedBackFlag;
                        }
                        //智齿logo
                        if (typeof params.powered !== "undefined") {
                            That.cacheInfo.urlParams.designButton = params.powered;
                        } else {
                            That.cacheInfo.urlParams.designButton = That.cacheInfo.apiConfig.designButton;
                        }
                        //留言是否显示邮箱  0 不显示  1显示。ticketStartWay 1 邮箱发起方式 2 手机号发起方式
                        if (typeof params.emailShowFlag !== "undefined" && That.cacheInfo.apiConfig.ticketStartWay != 1) {
                            That.cacheInfo.urlParams.emailShowFlag = params.emailShowFlag;
                        } else {
                            That.cacheInfo.urlParams.emailShowFlag = That.cacheInfo.apiConfig.emailShowFlag;
                        }
                        //留言中邮箱是否为必填字段  0 选填   1必填 。ticketStartWay 1 邮箱发起方式 2 手机号发起方式
                        if (typeof params.emailFlag !== "undefined" && That.cacheInfo.apiConfig.ticketStartWay != 1) {
                            That.cacheInfo.urlParams.emailFlag = params.emailFlag;
                        } else {
                            That.cacheInfo.urlParams.emailFlag = That.cacheInfo.apiConfig.emailFlag;
                        }
                        //留言是否显示手机号  0 不显示  1显示。 ticketStartWay 1 邮箱发起方式 2 手机号发起方式
                        if (typeof params.telShowFlag !== "undefined" && That.cacheInfo.apiConfig.ticketStartWay != 2) {
                            That.cacheInfo.urlParams.telShowFlag = params.telShowFlag;
                        } else {
                            That.cacheInfo.urlParams.telShowFlag = That.cacheInfo.apiConfig.telShowFlag;
                        }
                        //留言手机号是否为必填字段  0 选填   1必填。ticketStartWay 1 邮箱发起方式 2 手机号发起方式
                        if (typeof params.telFlag !== "undefined" && That.cacheInfo.apiConfig.ticketStartWay != 2) {
                            That.cacheInfo.urlParams.telFlag = params.telFlag;
                        } else {
                            That.cacheInfo.urlParams.telFlag = That.cacheInfo.apiConfig.telFlag;
                        };
                        /*判断手机号和邮箱 二者必选其一*/
                        // if ((!That.cacheInfo.urlParams.telShowFlag && !That.cacheInfo.urlParams.emailShowFlag) || (That.cacheInfo.urlParams.telShowFlag && !That.cacheInfo.urlParams.telFlag && That.cacheInfo.urlParams.emailShowFlag && !That.cacheInfo.urlParams.emailFlag) || (That.cacheInfo.urlParams.telShowFlag && !That.cacheInfo.urlParams.telFlag && !That.cacheInfo.urlParams.emailShowFlag) || (!That.cacheInfo.urlParams.telShowFlag && That.cacheInfo.urlParams.emailShowFlag && !That.cacheInfo.urlParams.emailFlag)) {
                        //     That.cacheInfo.urlParams.emailFlag = 1;
                        //     That.cacheInfo.urlParams.emailShowFlag = 1;
                        // }
                        // 是否显示附件  0 不显示  1显示
                        //if (typeof params.enclosureShowFlag !== "undefined") {
                        //That.cacheInfo.urlParams.enclosureShowFlag = params.enclosureShowFlag;
                        //} else {
                        That.cacheInfo.urlParams.enclosureShowFlag = That.cacheInfo.apiConfig.enclosureShowFlag;
                        //}
                        //附件是否为必填字段  0 选填  1 必填
                        if (typeof params.enclosureFlag !== "undefined") {
                            That.cacheInfo.urlParams.enclosureFlag = params.enclosureFlag;
                        } else {
                            That.cacheInfo.urlParams.enclosureFlag = That.cacheInfo.apiConfig.enclosureFlag;
                        }
                        //机器人顶踩开关  0 关闭  1开启
                        if (typeof params.realuateFlag !== "undefined") {
                            That.cacheInfo.urlParams.realuateFlag = params.realuateFlag;
                        } else {
                            That.cacheInfo.urlParams.realuateFlag = That.cacheInfo.apiConfig.realuateFlag;
                        }
                        //配置机器人欢迎语
                        if (typeof params.robotHelloWord !== "undefined") {
                            That.cacheInfo.urlParams.robotHelloWord = params.robotHelloWord;
                        } else {
                            That.cacheInfo.urlParams.robotHelloWord = That.cacheInfo.apiConfig.robotHelloWord;
                        }
                        //配置人工欢迎语
                        if (typeof params.adminHelloWord !== "undefined") {
                            That.cacheInfo.urlParams.adminHelloWord = params.adminHelloWord;
                        } else {
                            That.cacheInfo.urlParams.adminHelloWord = That.cacheInfo.apiConfig.adminHelloWord;
                        }
                        //配置人工超时提示语
                        if (typeof params.adminTipWord !== "undefined") {
                            That.cacheInfo.urlParams.adminTipWord = params.adminTipWord;
                        } else {
                            That.cacheInfo.urlParams.adminTipWord = That.cacheInfo.apiConfig.adminTipWord;
                        }
                        //配置用户提示语
                        if (typeof params.userTipWord !== "undefined") {
                            That.cacheInfo.urlParams.userTipWord = params.userTipWord;
                        } else {
                            That.cacheInfo.urlParams.userTipWord = That.cacheInfo.apiConfig.userTipWord;
                        }
                        //配置转人工不在线提示语
                        if (typeof params.adminNonelineTitle !== "undefined") {
                            That.cacheInfo.urlParams.adminNonelineTitle = params.adminNonelineTitle;
                        } else {
                            That.cacheInfo.urlParams.adminNonelineTitle = That.cacheInfo.apiConfig.adminNonelineTitle;
                        }
                        //配置点击技能组转人工留言会添加groupId参数
                        if (typeof params.leaveMsgSendGroupIdFlag !== "undefined") {
                            That.cacheInfo.urlParams.leaveMsgSendGroupIdFlag = params.leaveMsgSendGroupIdFlag;
                        } else {
                            That.cacheInfo.urlParams.leaveMsgSendGroupIdFlag = That.cacheInfo.apiConfig.leaveMsgSendGroupIdFlag;
                        }
                        //配置留言中问题类型的开关
                        if (typeof params.ticketTypeFlag !== "undefined") {
                            That.cacheInfo.urlParams.ticketTypeFlag = params.ticketTypeFlag;
                        } else {
                            That.cacheInfo.urlParams.ticketTypeFlag = That.cacheInfo.apiConfig.ticketTypeFlag;
                        }
                        //配置留言中问题类型的企业自己设置的类型（留言中问题类型关闭的时候）
                        if (typeof params.ticketTypeId !== "undefined") {
                            That.cacheInfo.urlParams.ticketTypeId = params.ticketTypeId;
                        } else {
                            That.cacheInfo.urlParams.ticketTypeId = That.cacheInfo.apiConfig.ticketTypeId;
                        }

                        promise.resolve();
                    })
                });
                return promise;
            })
                .then(function(value, promise) {
                    var promise = promise || new Promise(),
                        params = That.cacheInfo.urlParams;
                    if (params.rput === 1) {
                        $.ajax({
                            type: 'get',
                            url: api.active_url,
                            dataType: 'json',
                            timeout: 1000 * 3,
                            data: {
                                sysNum: params.sysNum,
                                partnerId: params.partnerId || '',
                                rpuc: params.rpuc || ''
                            },
                            success: function(ret) {
                                if (ret && ret.status === 'ok') {
                                    That.cacheInfo.activeData = ret;
                                    promise.resolve(ret.params);
                                } else
                                    promise.resolve();
                            }
                        })
                    } else {
                        promise.resolve();
                    }
                    return promise;
                })
                .then(function(value, promise) {
                    // console.log(value);
                    var params = '';
                    if (Object.prototype.toString.call(value) === '[object Object]') {
                        params = JSON.stringify(value);
                    }
                    $.ajax({
                        type: "post",
                        url: api.init_url,
                        dataType: "json",
                        data: {
                            'ack': 1,
                            sysNum: decodeURL(That.cacheInfo.sysNum),
                            source: decodeURL(That.cacheInfo.userInfo.source),
                            'chooseAdminId': That.cacheInfo.urlParams.aid || '',
                            'tranFlag': That.cacheInfo.urlParams.tranFlag,
                            'groupId': decodeURL(That.cacheInfo.urlParams.groupId) || '',
                            partnerId: decodeURL('' + That.cacheInfo.userInfo.partnerId),
                            tel: decodeURL(That.cacheInfo.userInfo.tel),
                            email: decodeURL(That.cacheInfo.userInfo.email),
                            uname: decodeURL(That.cacheInfo.userInfo.uname),
                            visitTitle: decodeURL(That.cacheInfo.userInfo.visitTitle),
                            visitUrl: decodeURL(That.cacheInfo.userInfo.visitUrl),
                            face: decodeURL(That.cacheInfo.userInfo.face),
                            realname: decodeURL(That.cacheInfo.userInfo.realname),
                            weibo: decodeURL(That.cacheInfo.userInfo.weibo),
                            weixin: decodeURL(That.cacheInfo.userInfo.weixin),
                            qq: decodeURL(That.cacheInfo.userInfo.qq),
                            sex: decodeURL(That.cacheInfo.userInfo.sex),
                            birthday: decodeURL(That.cacheInfo.userInfo.birthday),
                            remark: decodeURL(That.cacheInfo.userInfo.remark),
                            params: decodeURL(params || That.cacheInfo.userInfo.params),
                            isReComment: decodeURL(1),
                            customerFields: decodeURL(That.cacheInfo.userInfo.customerFields), //用户自定义字段
                            visitStartTime: decodeURL(That.cacheInfo.urlParams.visitStartTime || '') //该值是从js组件的load接口拿到再通过init回传给后端
                            //lastCid:defaultcodeURL(That.cacheInfo.userInfo.lastCid)
                        },
                        success: function(res) {
                            var data = res.data ? res.data : res;
                            That.cacheInfo.apiInit = data;
                            initText(That.cacheInfo);
                            if (That.cacheInfo.urlParams.msgflag == 0 || That.cacheInfo.urlParams.isMessageFlag == 1) {
                                var url = getLeaveMessage(That.cacheInfo.urlParams, That.cacheInfo);
                                var lan = That.cacheInfo.language.lan;
                                if (isMobile) {
                                    That.cacheInfo.apiConfig.leaveMsg = lan['L10024'].replace("{0}", url).replace("{1}", url);
                                } else {
                                    That.cacheInfo.apiConfig.leaveMsg = lan['L10039'];
                                }
                                That.cacheInfo.apiConfig.leaveMsgUrl = url;
                            } else {
                                That.cacheInfo.apiConfig.leaveMsg = '';
                            }


                            That.cacheInfo.pageType = pageType;
                            outerPromise.resolve(That.cacheInfo);
                        }
                    });
                });
        };

        var init = function() {
            promiseHandler();
        };
        init();
        return outerPromise;

    };
    module.exports = initConfig;
},{"./comm.js":1,"./initText.js":4,"./util/promise.js":31}],4:[function(require,module,exports){
    var localeFactory = require("./locale.js");

    var initHTML = function(locale) {
        var classList = ['.js-text-return-btn', '.js-text-pulldown', '.js-text-transfer-btn', '.js-text-sendBtn', '.js-text-upload-btn', '.js-text-comment-btn', '.js-text-satisfition-btn', '.js-text-conversation-btn', '.js-text-submit-btn', '.js-text-success-btn', '.js-text-contact', '.js-text-ok-btn'];
        for (var i = 0; i < classList.length; i++) {
            var item = classList[i];
            var $elm = $(item);
            var text = locale.html['HTML_MSG0' + i];
            $elm.text(text).attr("placeholder", text);
        }
        $('.js-text-tel').html(locale.html['HTML_MSG' + 18]);
        //112以上是pc
        var classListPc = ['.js-pulldown-text', '.js-text-chatSwitch', '.js-text-send', '.js-text-satisfaction', '.js-text-newMessage', '.js-text-leaveMessage'];
        for (var i = 0; i < classListPc.length; i++) {
            var item = classListPc[i];
            var $elm = $(item);
            var text = locale.html['HTML_MSG01' + (i + 12)];
            $elm.text(text);
        }

    };


    function initText(global) {
        var locale = localeFactory(global);
        initHTML(locale);
        global.language.lan = locale.system;
        global.language.text = locale.text;
    }


    module.exports = initText;

},{"./locale.js":6}],5:[function(require,module,exports){
    /**
     * Detect.js: User-Agent Parser
     * https://github.com/darcyclarke/Detect.js
     * Dual licensed under the MIT and GPL licenses.
     *
     * @version 2.2.2
     * @author Darcy Clarke
     * @url https://darcyclarke.me
     * @createdat Mon Oct 26 2015 08:21:54 GMT-0200 (Horário brasileiro de ver?o)
     *
     * Based on UA-Parser (https://github.com/tobie/ua-parser) by Tobie Langel
     *
     * Example Usage:
     * var agentInfo = detect.parse(navigator.userAgent);
     * console.log(agentInfo.browser.family); // Chrome
     *
     */
    (function(root, undefined) {
        // Shim Array.prototype.map if necessary
        // Production steps of ECMA-262, Edition 5, 15.4.4.19
        // Reference: https://es5.github.com/#x15.4.4.19
        if (!Array.prototype.map) {
            Array.prototype.map = function(callback, thisArg) {
                var T, A, k;
                if (this == null) {
                    throw new TypeError(" this is null or not defined");
                }
                // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
                var O = Object(this);
                // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
                // 3. Let len be ToUint32(lenValue).
                var len = O.length >>> 0;
                // 4. If IsCallable(callback) is false, throw a TypeError exception.
                // See: https://es5.github.com/#x9.11
                if (typeof callback !== "function") {
                    throw new TypeError(callback + " is not a function");
                }
                // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (thisArg) {
                    T = thisArg;
                }
                // 6. Let A be a new array created as if by the expression new Array(len) where Array is
                // the standard built-in constructor with that name and len is the value of len.
                A = new Array(len);
                // 7. Let k be 0
                k = 0;
                // 8. Repeat, while k < len
                while (k < len) {
                    var kValue, mappedValue;
                    // a. Let Pk be ToString(k).
                    //   This is implicit for LHS operands of the in operator
                    // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                    //   This step can be combined with c
                    // c. If kPresent is true, then
                    if (k in O) {
                        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                        kValue = O[k];
                        // ii. Let mappedValue be the result of calling the Call internal method of callback
                        // with T as the this value and argument list containing kValue, k, and O.
                        mappedValue = callback.call(T, kValue, k, O);
                        // iii. Call the DefineOwnProperty internal method of A with arguments
                        // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                        // and false.
                        // In browsers that support Object.defineProperty, use the following:
                        // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });
                        // For best browser support, use the following:
                        A[k] = mappedValue;
                    }
                    // d. Increase k by 1.
                    k++;
                }
                // 9. return A
                return A;
            };
        }
        // Detect
        var detect = root.detect = function() {
            // Context
            var _this = function() {};
            // Regexes
            var regexes = {
                browser_parsers: [{
                    regex: "^(Opera)/(\\d+)\\.(\\d+) \\(Nintendo Wii",
                    family_replacement: "Wii",
                    manufacturer: "Nintendo"
                }, {
                    regex: "(SeaMonkey|Camino)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
                    family_replacement: "Camino",
                    other: true
                }, {
                    regex: "(Pale[Mm]oon)/(\\d+)\\.(\\d+)\\.?(\\d+)?",
                    family_replacement: "Pale Moon (Firefox Variant)",
                    other: true
                }, {
                    regex: "(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)",
                    family_replacement: "Firefox Mobile"
                }, {
                    regex: "(Fennec)/(\\d+)\\.(\\d+)(pre)",
                    family_replacment: "Firefox Mobile"
                }, {
                    regex: "(Fennec)/(\\d+)\\.(\\d+)",
                    family_replacement: "Firefox Mobile"
                }, {
                    regex: "Mobile.*(Firefox)/(\\d+)\\.(\\d+)",
                    family_replacement: "Firefox Mobile"
                }, {
                    regex: "(Namoroka|Shiretoko|Minefield)/(\\d+)\\.(\\d+)\\.(\\d+(?:pre)?)",
                    family_replacement: "Firefox ($1)"
                }, {
                    regex: "(Firefox)/(\\d+)\\.(\\d+)(a\\d+[a-z]*)",
                    family_replacement: "Firefox Alpha"
                }, {
                    regex: "(Firefox)/(\\d+)\\.(\\d+)(b\\d+[a-z]*)",
                    family_replacement: "Firefox Beta"
                }, {
                    regex: "(Firefox)-(?:\\d+\\.\\d+)?/(\\d+)\\.(\\d+)(a\\d+[a-z]*)",
                    family_replacement: "Firefox Alpha"
                }, {
                    regex: "(Firefox)-(?:\\d+\\.\\d+)?/(\\d+)\\.(\\d+)(b\\d+[a-z]*)",
                    family_replacement: "Firefox Beta"
                }, {
                    regex: "(Namoroka|Shiretoko|Minefield)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)?",
                    family_replacement: "Firefox ($1)"
                }, {
                    regex: "(Firefox).*Tablet browser (\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "MicroB",
                    tablet: true
                }, {
                    regex: "(MozillaDeveloperPreview)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)?"
                }, {
                    regex: "(Flock)/(\\d+)\\.(\\d+)(b\\d+?)",
                    family_replacement: "Flock",
                    other: true
                }, {
                    regex: "(RockMelt)/(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Rockmelt",
                    other: true
                }, {
                    regex: "(Navigator)/(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Netscape"
                }, {
                    regex: "(Navigator)/(\\d+)\\.(\\d+)([ab]\\d+)",
                    family_replacement: "Netscape"
                }, {
                    regex: "(Netscape6)/(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Netscape"
                }, {
                    regex: "(MyIBrow)/(\\d+)\\.(\\d+)",
                    family_replacement: "My Internet Browser",
                    other: true
                }, {
                    regex: "(Opera Tablet).*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                    family_replacement: "Opera Tablet",
                    tablet: true
                }, {
                    regex: "(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)",
                    family_replacement: "Opera Mobile"
                }, {
                    regex: "Opera Mobi",
                    family_replacement: "Opera Mobile"
                }, {
                    regex: "(Opera Mini)/(\\d+)\\.(\\d+)",
                    family_replacement: "Opera Mini"
                }, {
                    regex: "(Opera Mini)/att/(\\d+)\\.(\\d+)",
                    family_replacement: "Opera Mini"
                }, {
                    regex: "(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                    family_replacement: "Opera"
                }, {
                    regex: "(OPR)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                    family_replacement: "Opera"
                }, {
                    regex: "(webOSBrowser)/(\\d+)\\.(\\d+)",
                    family_replacement: "webOS"
                }, {
                    regex: "(webOS)/(\\d+)\\.(\\d+)",
                    family_replacement: "webOS"
                }, {
                    regex: "(wOSBrowser).+TouchPad/(\\d+)\\.(\\d+)",
                    family_replacement: "webOS TouchPad"
                }, {
                    regex: "(luakit)",
                    family_replacement: "LuaKit",
                    other: true
                }, {
                    regex: "(Lightning)/(\\d+)\\.(\\d+)([ab]?\\d+[a-z]*)",
                    family_replacement: "Lightning",
                    other: true
                }, {
                    regex: "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+(?:pre)?) \\(Swiftfox\\)",
                    family_replacement: "Swiftfox",
                    other: true
                }, {
                    regex: "(Firefox)/(\\d+)\\.(\\d+)([ab]\\d+[a-z]*)? \\(Swiftfox\\)",
                    family_replacement: "Swiftfox",
                    other: true
                }, {
                    regex: "rekonq",
                    family_replacement: "Rekonq",
                    other: true
                }, {
                    regex: "(conkeror|Conkeror)/(\\d+)\\.(\\d+)\\.?(\\d+)?",
                    family_replacement: "Conkeror",
                    other: true
                }, {
                    regex: "(konqueror)/(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Konqueror",
                    other: true
                }, {
                    regex: "(WeTab)-Browser",
                    family_replacement: "WeTab",
                    other: true
                }, {
                    regex: "(Comodo_Dragon)/(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Comodo Dragon",
                    other: true
                }, {
                    regex: "(YottaaMonitor)",
                    family_replacement: "Yottaa Monitor",
                    other: true
                }, {
                    regex: "(Kindle)/(\\d+)\\.(\\d+)",
                    family_replacement: "Kindle"
                }, {
                    regex: "(Symphony) (\\d+).(\\d+)",
                    family_replacement: "Symphony",
                    other: true
                }, {
                    regex: "Minimo",
                    family_replacement: "Minimo",
                    other: true
                }, {
                    regex: "(Edge)/(\\d+)\\.(\\d+)",
                    family_replacement: "Edge"
                }, {
                    regex: "(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Chrome Mobile"
                }, {
                    regex: "(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Chrome Mobile iOS"
                }, {
                    regex: "(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile",
                    family_replacement: "Chrome Mobile"
                }, {
                    regex: "(chromeframe)/(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Chrome Frame"
                }, {
                    regex: "(UC Browser)(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "UC Browser",
                    other: true
                }, {
                    regex: "(SLP Browser)/(\\d+)\\.(\\d+)",
                    family_replacement: "Tizen Browser",
                    other: true
                }, {
                    regex: "(Epiphany)/(\\d+)\\.(\\d+).(\\d+)",
                    family_replacement: "Epiphany",
                    other: true
                }, {
                    regex: "(SE 2\\.X) MetaSr (\\d+)\\.(\\d+)",
                    family_replacement: "Sogou Explorer",
                    other: true
                }, {
                    regex: "(Pingdom.com_bot_version_)(\\d+)\\.(\\d+)",
                    family_replacement: "PingdomBot",
                    other: true
                }, {
                    regex: "(facebookexternalhit)/(\\d+)\\.(\\d+)",
                    family_replacement: "FacebookBot"
                }, {
                    regex: "(Twitterbot)/(\\d+)\\.(\\d+)",
                    family_replacement: "TwitterBot"
                }, {
                    regex: "(AdobeAIR|Chromium|FireWeb|Jasmine|ANTGalio|Midori|Fresco|Lobo|PaleMoon|Maxthon|Lynx|OmniWeb|Dillo|Camino|Demeter|Fluid|Fennec|Shiira|Sunrise|Chrome|Flock|Netscape|Lunascape|WebPilot|NetFront|Netfront|Konqueror|SeaMonkey|Kazehakase|Vienna|Iceape|Iceweasel|IceWeasel|Iron|K-Meleon|Sleipnir|Galeon|GranParadiso|Opera Mini|iCab|NetNewsWire|ThunderBrowse|Iron|Iris|UP\\.Browser|Bunjaloo|Google Earth|Raven for Mac)/(\\d+)\\.(\\d+)\\.(\\d+)"
                }, {
                    regex: "(Bolt|Jasmine|IceCat|Skyfire|Midori|Maxthon|Lynx|Arora|IBrowse|Dillo|Camino|Shiira|Fennec|Phoenix|Chrome|Flock|Netscape|Lunascape|Epiphany|WebPilot|Opera Mini|Opera|NetFront|Netfront|Konqueror|Googlebot|SeaMonkey|Kazehakase|Vienna|Iceape|Iceweasel|IceWeasel|Iron|K-Meleon|Sleipnir|Galeon|GranParadiso|iCab|NetNewsWire|Iron|Space Bison|Stainless|Orca|Dolfin|BOLT|Minimo|Tizen Browser|Polaris)/(\\d+)\\.(\\d+)"
                }, {
                    regex: "(iRider|Crazy Browser|SkipStone|iCab|Lunascape|Sleipnir|Maemo Browser) (\\d+)\\.(\\d+)\\.(\\d+)"
                }, {
                    regex: "(iCab|Lunascape|Opera|Android|Jasmine|Polaris|BREW) (\\d+)\\.(\\d+)\\.?(\\d+)?"
                }, {
                    regex: "(Android) Donut",
                    v2_replacement: "2",
                    v1_replacement: "1"
                }, {
                    regex: "(Android) Eclair",
                    v2_replacement: "1",
                    v1_replacement: "2"
                }, {
                    regex: "(Android) Froyo",
                    v2_replacement: "2",
                    v1_replacement: "2"
                }, {
                    regex: "(Android) Gingerbread",
                    v2_replacement: "3",
                    v1_replacement: "2"
                }, {
                    regex: "(Android) Honeycomb",
                    v1_replacement: "3"
                }, {
                    regex: "(IEMobile)[ /](\\d+)\\.(\\d+)",
                    family_replacement: "IE Mobile"
                }, {
                    regex: "(MSIE) (\\d+)\\.(\\d+).*XBLWP7",
                    family_replacement: "IE Large Screen"
                }, {
                    regex: "(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)"
                }, {
                    regex: "(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*)?"
                }, {
                    regex: "(Obigo)InternetBrowser",
                    other: true
                }, {
                    regex: "(Obigo)\\-Browser",
                    other: true
                }, {
                    regex: "(Obigo|OBIGO)[^\\d]*(\\d+)(?:.(\\d+))?",
                    other: true
                }, {
                    regex: "(MAXTHON|Maxthon) (\\d+)\\.(\\d+)",
                    family_replacement: "Maxthon",
                    other: true
                }, {
                    regex: "(Maxthon|MyIE2|Uzbl|Shiira)",
                    v1_replacement: "0",
                    other: true
                }, {
                    regex: "(PLAYSTATION) (\\d+)",
                    family_replacement: "PlayStation",
                    manufacturer: "Sony"
                }, {
                    regex: "(PlayStation Portable)[^\\d]+(\\d+).(\\d+)",
                    manufacturer: "Sony"
                }, {
                    regex: "(BrowseX) \\((\\d+)\\.(\\d+)\\.(\\d+)",
                    other: true
                }, {
                    regex: "(POLARIS)/(\\d+)\\.(\\d+)",
                    family_replacement: "Polaris",
                    other: true
                }, {
                    regex: "(Embider)/(\\d+)\\.(\\d+)",
                    family_replacement: "Polaris",
                    other: true
                }, {
                    regex: "(BonEcho)/(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Bon Echo",
                    other: true
                }, {
                    regex: "(iPod).+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Mobile Safari",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPod).*Version/(\\d+)\\.(\\d+)",
                    family_replacement: "Mobile Safari",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPod)",
                    family_replacement: "Mobile Safari",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPhone).*Version/(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Mobile Safari",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPhone).*Version/(\\d+)\\.(\\d+)",
                    family_replacement: "Mobile Safari",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPhone)",
                    family_replacement: "Mobile Safari",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPad).*Version/(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Mobile Safari",
                    tablet: true,
                    manufacturer: "Apple"
                }, {
                    regex: "(iPad).*Version/(\\d+)\\.(\\d+)",
                    family_replacement: "Mobile Safari",
                    tablet: true,
                    manufacturer: "Apple"
                }, {
                    regex: "(iPad)",
                    family_replacement: "Mobile Safari",
                    tablet: true,
                    manufacturer: "Apple"
                }, {
                    regex: "(AvantGo) (\\d+).(\\d+)",
                    other: true
                }, {
                    regex: "(Avant)",
                    v1_replacement: "1",
                    other: true
                }, {
                    regex: "^(Nokia)",
                    family_replacement: "Nokia Services (WAP) Browser",
                    manufacturer: "Nokia"
                }, {
                    regex: "(NokiaBrowser)/(\\d+)\\.(\\d+).(\\d+)\\.(\\d+)",
                    manufacturer: "Nokia"
                }, {
                    regex: "(NokiaBrowser)/(\\d+)\\.(\\d+).(\\d+)",
                    manufacturer: "Nokia"
                }, {
                    regex: "(NokiaBrowser)/(\\d+)\\.(\\d+)",
                    manufacturer: "Nokia"
                }, {
                    regex: "(BrowserNG)/(\\d+)\\.(\\d+).(\\d+)",
                    family_replacement: "NokiaBrowser",
                    manufacturer: "Nokia"
                }, {
                    regex: "(Series60)/5\\.0",
                    v2_replacement: "0",
                    v1_replacement: "7",
                    family_replacement: "NokiaBrowser",
                    manufacturer: "Nokia"
                }, {
                    regex: "(Series60)/(\\d+)\\.(\\d+)",
                    family_replacement: "Nokia OSS Browser",
                    manufacturer: "Nokia"
                }, {
                    regex: "(S40OviBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Nokia Series 40 Ovi Browser",
                    manufacturer: "Nokia"
                }, {
                    regex: "(Nokia)[EN]?(\\d+)",
                    manufacturer: "Nokia"
                }, {
                    regex: "(PlayBook).+RIM Tablet OS (\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Blackberry WebKit",
                    tablet: true,
                    manufacturer: "Nokia"
                }, {
                    regex: "(Black[bB]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)",
                    family_replacement: "Blackberry WebKit",
                    manufacturer: "RIM"
                }, {
                    regex: "(Black[bB]erry)\\s?(\\d+)",
                    family_replacement: "Blackberry",
                    manufacturer: "RIM"
                }, {
                    regex: "(OmniWeb)/v(\\d+)\\.(\\d+)",
                    other: true
                }, {
                    regex: "(Blazer)/(\\d+)\\.(\\d+)",
                    family_replacement: "Palm Blazer",
                    manufacturer: "Palm"
                }, {
                    regex: "(Pre)/(\\d+)\\.(\\d+)",
                    family_replacement: "Palm Pre",
                    manufacturer: "Palm"
                }, {
                    regex: "(Links) \\((\\d+)\\.(\\d+)",
                    other: true
                }, {
                    regex: "(QtWeb) Internet Browser/(\\d+)\\.(\\d+)",
                    other: true
                }, {
                    regex: "(Silk)/(\\d+)\\.(\\d+)(?:\\.([0-9\\-]+))?",
                    other: true,
                    tablet: true
                }, {
                    regex: "(AppleWebKit)/(\\d+)\\.?(\\d+)?\\+ .* Version/\\d+\\.\\d+.\\d+ Safari/",
                    family_replacement: "WebKit Nightly"
                }, {
                    regex: "(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?.*Safari/",
                    family_replacement: "Safari"
                }, {
                    regex: "(Safari)/\\d+"
                }, {
                    regex: "(OLPC)/Update(\\d+)\\.(\\d+)",
                    other: true
                }, {
                    regex: "(OLPC)/Update()\\.(\\d+)",
                    v1_replacement: "0",
                    other: true
                }, {
                    regex: "(SEMC\\-Browser)/(\\d+)\\.(\\d+)",
                    other: true
                }, {
                    regex: "(Teleca)",
                    family_replacement: "Teleca Browser",
                    other: true
                }, {
                    regex: "Trident(.*)rv.(\\d+)\\.(\\d+)",
                    family_replacement: "IE"
                }, {
                    regex: "(MSIE) (\\d+)\\.(\\d+)",
                    family_replacement: "IE"
                }],
                os_parsers: [{
                    regex: "(Android) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+))?"
                }, {
                    regex: "(Android)\\-(\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+))?"
                }, {
                    regex: "(Android) Donut",
                    os_v2_replacement: "2",
                    os_v1_replacement: "1"
                }, {
                    regex: "(Android) Eclair",
                    os_v2_replacement: "1",
                    os_v1_replacement: "2"
                }, {
                    regex: "(Android) Froyo",
                    os_v2_replacement: "2",
                    os_v1_replacement: "2"
                }, {
                    regex: "(Android) Gingerbread",
                    os_v2_replacement: "3",
                    os_v1_replacement: "2"
                }, {
                    regex: "(Android) Honeycomb",
                    os_v1_replacement: "3"
                }, {
                    regex: "(Silk-Accelerated=[a-z]{4,5})",
                    os_replacement: "Android"
                }, {
                    regex: "(Windows Phone 6\\.5)"
                }, {
                    regex: "(Windows (?:NT 5\\.2|NT 5\\.1))",
                    os_replacement: "Windows XP"
                }, {
                    regex: "(XBLWP7)",
                    os_replacement: "Windows Phone OS"
                }, {
                    regex: "(Windows NT 6\\.1)",
                    os_replacement: "Windows 7"
                }, {
                    regex: "(Windows NT 6\\.0)",
                    os_replacement: "Windows Vista"
                }, {
                    regex: "(Windows 98|Windows XP|Windows ME|Windows 95|Windows CE|Windows 7|Windows NT 4\\.0|Windows Vista|Windows 2000)"
                }, {
                    regex: "(Windows NT 6\\.4|Windows NT 10\\.0)",
                    os_replacement: "Windows 10"
                }, {
                    regex: "(Windows NT 6\\.2)",
                    os_replacement: "Windows 8"
                }, {
                    regex: "(Windows Phone 8)",
                    os_replacement: "Windows Phone 8"
                }, {
                    regex: "(Windows NT 5\\.0)",
                    os_replacement: "Windows 2000"
                }, {
                    regex: "(Windows Phone OS) (\\d+)\\.(\\d+)"
                }, {
                    regex: "(Windows ?Mobile)",
                    os_replacement: "Windows Mobile"
                }, {
                    regex: "(WinNT4.0)",
                    os_replacement: "Windows NT 4.0"
                }, {
                    regex: "(Win98)",
                    os_replacement: "Windows 98"
                }, {
                    regex: "(Tizen)/(\\d+)\\.(\\d+)",
                    other: true
                }, {
                    regex: "(Mac OS X) (\\d+)[_.](\\d+)(?:[_.](\\d+))?",
                    manufacturer: "Apple"
                }, {
                    regex: "(?:PPC|Intel) (Mac OS X)",
                    manufacturer: "Apple"
                }, {
                    regex: "(CPU OS|iPhone OS) (\\d+)_(\\d+)(?:_(\\d+))?",
                    os_replacement: "iOS",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPhone|iPad|iPod); Opera",
                    os_replacement: "iOS",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPad); Opera",
                    tablet: true,
                    manufacturer: "Apple"
                }, {
                    regex: "(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)",
                    os_replacement: "iOS",
                    manufacturer: "Apple"
                }, {
                    regex: "(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                    os_replacement: "Chrome OS"
                }, {
                    regex: "(Debian)-(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                    other: true
                }, {
                    regex: "(Linux Mint)(?:/(\\d+))?",
                    other: true
                }, {
                    regex: "(Mandriva)(?: Linux)?/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                    other: true
                }, {
                    regex: "(Symbian[Oo][Ss])/(\\d+)\\.(\\d+)",
                    os_replacement: "Symbian OS"
                }, {
                    regex: "(Symbian/3).+NokiaBrowser/7\\.3",
                    os_replacement: "Symbian^3 Anna"
                }, {
                    regex: "(Symbian/3).+NokiaBrowser/7\\.4",
                    os_replacement: "Symbian^3 Belle"
                }, {
                    regex: "(Symbian/3)",
                    os_replacement: "Symbian^3"
                }, {
                    regex: "(Series 60|SymbOS|S60)",
                    os_replacement: "Symbian OS"
                }, {
                    regex: "(MeeGo)",
                    other: true
                }, {
                    regex: "Symbian [Oo][Ss]",
                    os_replacement: "Symbian OS"
                }, {
                    regex: "(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                    os_replacement: "BlackBerry OS",
                    manufacturer: "RIM"
                }, {
                    regex: "(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                    os_replacement: "BlackBerry OS",
                    manufacturer: "RIM"
                }, {
                    regex: "(RIM Tablet OS) (\\d+)\\.(\\d+)\\.(\\d+)",
                    os_replacement: "BlackBerry Tablet OS",
                    tablet: true,
                    manufacturer: "RIM"
                }, {
                    regex: "(Play[Bb]ook)",
                    os_replacement: "BlackBerry Tablet OS",
                    tablet: true,
                    manufacturer: "RIM"
                }, {
                    regex: "(Black[Bb]erry)",
                    os_replacement: "Blackberry OS",
                    manufacturer: "RIM"
                }, {
                    regex: "(webOS|hpwOS)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?",
                    os_replacement: "webOS"
                }, {
                    regex: "(SUSE|Fedora|Red Hat|PCLinuxOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)",
                    other: true
                }, {
                    regex: "(SUSE|Fedora|Red Hat|Puppy|PCLinuxOS|CentOS)/(\\d+)\\.(\\d+)\\.(\\d+)",
                    other: true
                }, {
                    regex: "(Ubuntu|Kindle|Bada|Lubuntu|BackTrack|Red Hat|Slackware)/(\\d+)\\.(\\d+)"
                }, {
                    regex: "(Windows|OpenBSD|FreeBSD|NetBSD|Ubuntu|Kubuntu|Android|Arch Linux|CentOS|WeTab|Slackware)"
                }, {
                    regex: "(Linux|BSD)",
                    other: true
                }],
                mobile_os_families: ["Windows Phone 6.5", "Windows CE", "Symbian OS"],
                device_parsers: [{
                    regex: "HTC ([A-Z][a-z0-9]+) Build",
                    device_replacement: "HTC $1",
                    manufacturer: "HTC"
                }, {
                    regex: "HTC ([A-Z][a-z0-9 ]+) \\d+\\.\\d+\\.\\d+\\.\\d+",
                    device_replacement: "HTC $1",
                    manufacturer: "HTC"
                }, {
                    regex: "HTC_Touch_([A-Za-z0-9]+)",
                    device_replacement: "HTC Touch ($1)",
                    manufacturer: "HTC"
                }, {
                    regex: "USCCHTC(\\d+)",
                    device_replacement: "HTC $1 (US Cellular)",
                    manufacturer: "HTC"
                }, {
                    regex: "Sprint APA(9292)",
                    device_replacement: "HTC $1 (Sprint)",
                    manufacturer: "HTC"
                }, {
                    regex: "HTC ([A-Za-z0-9]+ [A-Z])",
                    device_replacement: "HTC $1",
                    manufacturer: "HTC"
                }, {
                    regex: "HTC-([A-Za-z0-9]+)",
                    device_replacement: "HTC $1",
                    manufacturer: "HTC"
                }, {
                    regex: "HTC_([A-Za-z0-9]+)",
                    device_replacement: "HTC $1",
                    manufacturer: "HTC"
                }, {
                    regex: "HTC ([A-Za-z0-9]+)",
                    device_replacement: "HTC $1",
                    manufacturer: "HTC"
                }, {
                    regex: "(ADR[A-Za-z0-9]+)",
                    device_replacement: "HTC $1",
                    manufacturer: "HTC"
                }, {
                    regex: "(HTC)",
                    manufacturer: "HTC"
                }, {
                    regex: "SonyEricsson([A-Za-z0-9]+)/",
                    device_replacement: "Ericsson $1",
                    other: true,
                    manufacturer: "Sony"
                }, {
                    regex: "Android[\\- ][\\d]+\\.[\\d]+\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; WOWMobile (.+) Build"
                }, {
                    regex: "Android[\\- ][\\d]+\\.[\\d]+\\.[\\d]+; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
                }, {
                    regex: "Android[\\- ][\\d]+\\.[\\d]+\\-update1\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
                }, {
                    regex: "Android[\\- ][\\d]+\\.[\\d]+\\; [A-Za-z]{2}\\-[A-Za-z]{2}\\; (.+) Build"
                }, {
                    regex: "Android[\\- ][\\d]+\\.[\\d]+\\.[\\d]+; (.+) Build"
                }, {
                    regex: "NokiaN([0-9]+)",
                    device_replacement: "Nokia N$1",
                    manufacturer: "Nokia"
                }, {
                    regex: "Nokia([A-Za-z0-9\\v-]+)",
                    device_replacement: "Nokia $1",
                    manufacturer: "Nokia"
                }, {
                    regex: "NOKIA ([A-Za-z0-9\\-]+)",
                    device_replacement: "Nokia $1",
                    manufacturer: "Nokia"
                }, {
                    regex: "Nokia ([A-Za-z0-9\\-]+)",
                    device_replacement: "Nokia $1",
                    manufacturer: "Nokia"
                }, {
                    regex: "Lumia ([A-Za-z0-9\\-]+)",
                    device_replacement: "Lumia $1",
                    manufacturer: "Nokia"
                }, {
                    regex: "Symbian",
                    device_replacement: "Nokia",
                    manufacturer: "Nokia"
                }, {
                    regex: "(PlayBook).+RIM Tablet OS",
                    device_replacement: "Blackberry Playbook",
                    tablet: true,
                    manufacturer: "RIM"
                }, {
                    regex: "(Black[Bb]erry [0-9]+);",
                    manufacturer: "RIM"
                }, {
                    regex: "Black[Bb]erry([0-9]+)",
                    device_replacement: "BlackBerry $1",
                    manufacturer: "RIM"
                }, {
                    regex: "(Pre)/(\\d+)\\.(\\d+)",
                    device_replacement: "Palm Pre",
                    manufacturer: "Palm"
                }, {
                    regex: "(Pixi)/(\\d+)\\.(\\d+)",
                    device_replacement: "Palm Pixi",
                    manufacturer: "Palm"
                }, {
                    regex: "(Touchpad)/(\\d+)\\.(\\d+)",
                    device_replacement: "HP Touchpad",
                    manufacturer: "HP"
                }, {
                    regex: "HPiPAQ([A-Za-z0-9]+)/(\\d+).(\\d+)",
                    device_replacement: "HP iPAQ $1",
                    manufacturer: "HP"
                }, {
                    regex: "Palm([A-Za-z0-9]+)",
                    device_replacement: "Palm $1",
                    manufacturer: "Palm"
                }, {
                    regex: "Treo([A-Za-z0-9]+)",
                    device_replacement: "Palm Treo $1",
                    manufacturer: "Palm"
                }, {
                    regex: "webOS.*(P160UNA)/(\\d+).(\\d+)",
                    device_replacement: "HP Veer",
                    manufacturer: "HP"
                }, {
                    regex: "(Kindle Fire)",
                    manufacturer: "Amazon"
                }, {
                    regex: "(Kindle)",
                    manufacturer: "Amazon"
                }, {
                    regex: "(Silk)/(\\d+)\\.(\\d+)(?:\\.([0-9\\-]+))?",
                    device_replacement: "Kindle Fire",
                    tablet: true,
                    manufacturer: "Amazon"
                }, {
                    regex: "(iPad) Simulator;",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPad);",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPod);",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPhone) Simulator;",
                    manufacturer: "Apple"
                }, {
                    regex: "(iPhone);",
                    manufacturer: "Apple"
                }, {
                    regex: "Nexus\\ ([A-Za-z0-9\\-]+)",
                    device_replacement: "Nexus $1"
                }, {
                    regex: "acer_([A-Za-z0-9]+)_",
                    device_replacement: "Acer $1",
                    manufacturer: "Acer"
                }, {
                    regex: "acer_([A-Za-z0-9]+)_",
                    device_replacement: "Acer $1",
                    manufacturer: "Acer"
                }, {
                    regex: "Amoi\\-([A-Za-z0-9]+)",
                    device_replacement: "Amoi $1",
                    other: true,
                    manufacturer: "Amoi"
                }, {
                    regex: "AMOI\\-([A-Za-z0-9]+)",
                    device_replacement: "Amoi $1",
                    other: true,
                    manufacturer: "Amoi"
                }, {
                    regex: "Asus\\-([A-Za-z0-9]+)",
                    device_replacement: "Asus $1",
                    manufacturer: "Asus"
                }, {
                    regex: "ASUS\\-([A-Za-z0-9]+)",
                    device_replacement: "Asus $1",
                    manufacturer: "Asus"
                }, {
                    regex: "BIRD\\-([A-Za-z0-9]+)",
                    device_replacement: "Bird $1",
                    other: true
                }, {
                    regex: "BIRD\\.([A-Za-z0-9]+)",
                    device_replacement: "Bird $1",
                    other: true
                }, {
                    regex: "BIRD ([A-Za-z0-9]+)",
                    device_replacement: "Bird $1",
                    other: true
                }, {
                    regex: "Dell ([A-Za-z0-9]+)",
                    device_replacement: "Dell $1",
                    manufacturer: "Dell"
                }, {
                    regex: "DoCoMo/2\\.0 ([A-Za-z0-9]+)",
                    device_replacement: "DoCoMo $1",
                    other: true
                }, {
                    regex: "([A-Za-z0-9]+)\\_W\\;FOMA",
                    device_replacement: "DoCoMo $1",
                    other: true
                }, {
                    regex: "([A-Za-z0-9]+)\\;FOMA",
                    device_replacement: "DoCoMo $1",
                    other: true
                }, {
                    regex: "vodafone([A-Za-z0-9]+)",
                    device_replacement: "Huawei Vodafone $1",
                    other: true
                }, {
                    regex: "i\\-mate ([A-Za-z0-9]+)",
                    device_replacement: "i-mate $1",
                    other: true
                }, {
                    regex: "Kyocera\\-([A-Za-z0-9]+)",
                    device_replacement: "Kyocera $1",
                    other: true
                }, {
                    regex: "KWC\\-([A-Za-z0-9]+)",
                    device_replacement: "Kyocera $1",
                    other: true
                }, {
                    regex: "Lenovo\\-([A-Za-z0-9]+)",
                    device_replacement: "Lenovo $1",
                    manufacturer: "Lenovo"
                }, {
                    regex: "Lenovo\\_([A-Za-z0-9]+)",
                    device_replacement: "Lenovo $1",
                    manufacturer: "Levovo"
                }, {
                    regex: "LG/([A-Za-z0-9]+)",
                    device_replacement: "LG $1",
                    manufacturer: "LG"
                }, {
                    regex: "LG-LG([A-Za-z0-9]+)",
                    device_replacement: "LG $1",
                    manufacturer: "LG"
                }, {
                    regex: "LGE-LG([A-Za-z0-9]+)",
                    device_replacement: "LG $1",
                    manufacturer: "LG"
                }, {
                    regex: "LGE VX([A-Za-z0-9]+)",
                    device_replacement: "LG $1",
                    manufacturer: "LG"
                }, {
                    regex: "LG ([A-Za-z0-9]+)",
                    device_replacement: "LG $1",
                    manufacturer: "LG"
                }, {
                    regex: "LGE LG\\-AX([A-Za-z0-9]+)",
                    device_replacement: "LG $1",
                    manufacturer: "LG"
                }, {
                    regex: "LG\\-([A-Za-z0-9]+)",
                    device_replacement: "LG $1",
                    manufacturer: "LG"
                }, {
                    regex: "LGE\\-([A-Za-z0-9]+)",
                    device_replacement: "LG $1",
                    manufacturer: "LG"
                }, {
                    regex: "LG([A-Za-z0-9]+)",
                    device_replacement: "LG $1",
                    manufacturer: "LG"
                }, {
                    regex: "(KIN)\\.One (\\d+)\\.(\\d+)",
                    device_replacement: "Microsoft $1"
                }, {
                    regex: "(KIN)\\.Two (\\d+)\\.(\\d+)",
                    device_replacement: "Microsoft $1"
                }, {
                    regex: "(Motorola)\\-([A-Za-z0-9]+)",
                    manufacturer: "Motorola"
                }, {
                    regex: "MOTO\\-([A-Za-z0-9]+)",
                    device_replacement: "Motorola $1",
                    manufacturer: "Motorola"
                }, {
                    regex: "MOT\\-([A-Za-z0-9]+)",
                    device_replacement: "Motorola $1",
                    manufacturer: "Motorola"
                }, {
                    regex: "Philips([A-Za-z0-9]+)",
                    device_replacement: "Philips $1",
                    manufacturer: "Philips"
                }, {
                    regex: "Philips ([A-Za-z0-9]+)",
                    device_replacement: "Philips $1",
                    manufacturer: "Philips"
                }, {
                    regex: "SAMSUNG-([A-Za-z0-9\\-]+)",
                    device_replacement: "Samsung $1",
                    manufacturer: "Samsung"
                }, {
                    regex: "SAMSUNG\\; ([A-Za-z0-9\\-]+)",
                    device_replacement: "Samsung $1",
                    manufacturer: "Samsung"
                }, {
                    regex: "Softbank/1\\.0/([A-Za-z0-9]+)",
                    device_replacement: "Softbank $1",
                    other: true
                }, {
                    regex: "Softbank/2\\.0/([A-Za-z0-9]+)",
                    device_replacement: "Softbank $1",
                    other: true
                }, {
                    regex: "(hiptop|avantgo|plucker|xiino|blazer|elaine|up.browser|up.link|mmp|smartphone|midp|wap|vodafone|o2|pocket|mobile|pda)",
                    device_replacement: "Generic Smartphone"
                }, {
                    regex: "^(1207|3gso|4thp|501i|502i|503i|504i|505i|506i|6310|6590|770s|802s|a wa|acer|acs\\-|airn|alav|asus|attw|au\\-m|aur |aus |abac|acoo|aiko|alco|alca|amoi|anex|anny|anyw|aptu|arch|argo|bell|bird|bw\\-n|bw\\-u|beck|benq|bilb|blac|c55/|cdm\\-|chtm|capi|comp|cond|craw|dall|dbte|dc\\-s|dica|ds\\-d|ds12|dait|devi|dmob|doco|dopo|el49|erk0|esl8|ez40|ez60|ez70|ezos|ezze|elai|emul|eric|ezwa|fake|fly\\-|fly\\_|g\\-mo|g1 u|g560|gf\\-5|grun|gene|go.w|good|grad|hcit|hd\\-m|hd\\-p|hd\\-t|hei\\-|hp i|hpip|hs\\-c|htc |htc\\-|htca|htcg)",
                    device_replacement: "Generic Feature Phone"
                }, {
                    regex: "^(htcp|htcs|htct|htc\\_|haie|hita|huaw|hutc|i\\-20|i\\-go|i\\-ma|i230|iac|iac\\-|iac/|ig01|im1k|inno|iris|jata|java|kddi|kgt|kgt/|kpt |kwc\\-|klon|lexi|lg g|lg\\-a|lg\\-b|lg\\-c|lg\\-d|lg\\-f|lg\\-g|lg\\-k|lg\\-l|lg\\-m|lg\\-o|lg\\-p|lg\\-s|lg\\-t|lg\\-u|lg\\-w|lg/k|lg/l|lg/u|lg50|lg54|lge\\-|lge/|lynx|leno|m1\\-w|m3ga|m50/|maui|mc01|mc21|mcca|medi|meri|mio8|mioa|mo01|mo02|mode|modo|mot |mot\\-|mt50|mtp1|mtv |mate|maxo|merc|mits|mobi|motv|mozz|n100|n101|n102|n202|n203|n300|n302|n500|n502|n505|n700|n701|n710|nec\\-|nem\\-|newg|neon)",
                    device_replacement: "Generic Feature Phone"
                }, {
                    regex: "^(netf|noki|nzph|o2 x|o2\\-x|opwv|owg1|opti|oran|ot\\-s|p800|pand|pg\\-1|pg\\-2|pg\\-3|pg\\-6|pg\\-8|pg\\-c|pg13|phil|pn\\-2|pt\\-g|palm|pana|pire|pock|pose|psio|qa\\-a|qc\\-2|qc\\-3|qc\\-5|qc\\-7|qc07|qc12|qc21|qc32|qc60|qci\\-|qwap|qtek|r380|r600|raks|rim9|rove|s55/|sage|sams|sc01|sch\\-|scp\\-|sdk/|se47|sec\\-|sec0|sec1|semc|sgh\\-|shar|sie\\-|sk\\-0|sl45|slid|smb3|smt5|sp01|sph\\-|spv |spv\\-|sy01|samm|sany|sava|scoo|send|siem|smar|smit|soft|sony|t\\-mo|t218|t250|t600|t610|t618|tcl\\-|tdg\\-|telm|tim\\-|ts70|tsm\\-|tsm3|tsm5|tx\\-9|tagt)",
                    device_replacement: "Generic Feature Phone"
                }, {
                    regex: "^(talk|teli|topl|tosh|up.b|upg1|utst|v400|v750|veri|vk\\-v|vk40|vk50|vk52|vk53|vm40|vx98|virg|vite|voda|vulc|w3c |w3c\\-|wapj|wapp|wapu|wapm|wig |wapi|wapr|wapv|wapy|wapa|waps|wapt|winc|winw|wonu|x700|xda2|xdag|yas\\-|your|zte\\-|zeto|aste|audi|avan|blaz|brew|brvw|bumb|ccwa|cell|cldc|cmd\\-|dang|eml2|fetc|hipt|http|ibro|idea|ikom|ipaq|jbro|jemu|jigs|keji|kyoc|kyok|libw|m\\-cr|midp|mmef|moto|mwbp|mywa|newt|nok6|o2im|pant|pdxg|play|pluc|port|prox|rozo|sama|seri|smal|symb|treo|upsi|vx52|vx53|vx60|vx61|vx70|vx80|vx81|vx83|vx85|wap\\-|webc|whit|wmlb|xda\\-|xda\\_)",
                    device_replacement: "Generic Feature Phone"
                }, {
                    regex: "(bot|borg|google(^tv)|yahoo|slurp|msnbot|msrbot|openbot|archiver|netresearch|lycos|scooter|altavista|teoma|gigabot|baiduspider|blitzbot|oegp|charlotte|furlbot|http%20client|polybot|htdig|ichiro|mogimogi|larbin|pompos|scrubby|searchsight|seekbot|semanticdiscovery|silk|snappy|speedy|spider|voila|vortex|voyager|zao|zeal|fast\\-webcrawler|converacrawler|dataparksearch|findlinks)",
                    device_replacement: "Spider"
                }],
                mobile_browser_families: ["Firefox Mobile", "Opera Mobile", "Opera Mini", "Mobile Safari", "webOS", "IE Mobile", "Playstation Portable", "Nokia", "Blackberry", "Palm", "Silk", "Android", "Maemo", "Obigo", "Netfront", "AvantGo", "Teleca", "SEMC-Browser", "Bolt", "Iris", "UP.Browser", "Symphony", "Minimo", "Bunjaloo", "Jasmine", "Dolfin", "Polaris", "BREW", "Chrome Mobile", "Chrome Mobile iOS", "UC Browser", "Tizen Browser"]
            };
            // Parsers
            _this.parsers = ["device_parsers", "browser_parsers", "os_parsers", "mobile_os_families", "mobile_browser_families"];
            // Types
            _this.types = ["browser", "os", "device"];
            // Regular Expressions
            _this.regexes = regexes || function() {
                    var results = {};
                    _this.parsers.map(function(parser) {
                        results[parser] = [];
                    });
                    return results;
                }();
            // Families
            _this.families = function() {
                var results = {};
                _this.types.map(function(type) {
                    results[type] = [];
                });
                return results;
            }();
            // Utility Variables
            var ArrayProto = Array.prototype,
                ObjProto = Object.prototype,
                FuncProto = Function.prototype,
                nativeForEach = ArrayProto.forEach,
                nativeIndexOf = ArrayProto.indexOf;
            // Find Utility
            var find = function(ua, obj) {
                var ret = {};
                for (var i = 0; i < obj.length; i++) {
                    ret = obj[i](ua);
                    if (ret) {
                        break;
                    }
                }
                return ret;
            };
            // Remove Utility
            var remove = function(arr, props) {
                each(arr, function(obj) {
                    each(props, function(prop) {
                        delete obj[prop];
                    });
                });
            };
            // Contains Utility
            var contains = function(obj, target) {
                var found = false;
                if (obj == null) return found;
                if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
                found = any(obj, function(value) {
                    return value === target;
                });
                return found;
            };
            // Each Utility
            var each = forEach = function(obj, iterator, context) {
                if (obj == null) return;
                if (nativeForEach && obj.forEach === nativeForEach) {
                    obj.forEach(iterator, context);
                } else if (obj.length === +obj.length) {
                    for (var i = 0, l = obj.length; i < l; i++) {
                        iterator.call(context, obj[i], i, obj);
                    }
                } else {
                    for (var key in obj) {
                        if (_.has(obj, key)) {
                            iterator.call(context, obj[key], key, obj);
                        }
                    }
                }
            };
            // Extend Utiltiy
            var extend = function(obj) {
                each(slice.call(arguments, 1), function(source) {
                    for (var prop in source) {
                        obj[prop] = source[prop];
                    }
                });
                return obj;
            };
            // Check String Utility
            var check = function(str) {
                return !!(str && typeof str != "undefined" && str != null);
            };
            // To Version String Utility
            var toVersionString = function(obj) {
                var output = "";
                obj = obj || {};
                if (check(obj)) {
                    if (check(obj.major)) {
                        output += obj.major;
                        if (check(obj.minor)) {
                            output += "." + obj.minor;
                            if (check(obj.patch)) {
                                output += "." + obj.patch;
                            }
                        }
                    }
                }
                return output;
            };
            // To String Utility
            var toString = function(obj) {
                obj = obj || {};
                var suffix = toVersionString(obj);
                if (suffix) suffix = " " + suffix;
                return obj && check(obj.family) ? obj.family + suffix : "";
            };
            // Parse User-Agent String
            _this.parse = function(ua) {
                // Parsers Utility
                var parsers = function(type) {
                    return _this.regexes[type + "_parsers"].map(function(obj) {
                        var regexp = new RegExp(obj.regex),
                            rep = obj[(type === "browser" ? "family" : type) + "_replacement"],
                            major_rep = obj.major_version_replacement;

                        function parser(ua) {
                            var m = ua.match(regexp);
                            if (!m) return null;
                            var ret = {};
                            ret.family = (rep ? rep.replace("$1", m[1]) : m[1]) || "other";
                            ret.major = parseInt(major_rep ? major_rep : m[2]) || null;
                            ret.minor = m[3] ? parseInt(m[3]) : null;
                            ret.patch = m[4] ? parseInt(m[4]) : null;
                            ret.tablet = obj.tablet;
                            ret.man = obj.manufacturer || null;
                            return ret;
                        }
                        return parser;
                    });
                };
                // User Agent
                var UserAgent = function() {};
                // Browsers Parsed
                var browser_parsers = parsers("browser");
                // Operating Systems Parsed
                var os_parsers = parsers("os");
                // Devices Parsed
                var device_parsers = parsers("device");
                // Set Agent
                var a = new UserAgent();
                // Remember the original user agent string
                a.source = ua;
                // Set Browser
                a.browser = find(ua, browser_parsers);
                if (check(a.browser)) {
                    a.browser.name = toString(a.browser);
                    a.browser.version = toVersionString(a.browser);
                } else {
                    a.browser = {};
                }
                // Set OS
                a.os = find(ua, os_parsers);
                if (check(a.os)) {
                    a.os.name = toString(a.os);
                    a.os.version = toVersionString(a.os);
                } else {
                    a.os = {};
                }
                // Set Device
                a.device = find(ua, device_parsers);
                if (check(a.device)) {
                    a.device.name = toString(a.device);
                    a.device.version = toVersionString(a.device);
                } else {
                    a.device = {
                        tablet: false,
                        family: "Other"
                    };
                }
                // Determine Device Type
                var mobile_agents = {};
                var mobile_browser_families = _this.regexes.mobile_browser_families.map(function(str) {
                    mobile_agents[str] = true;
                });
                var mobile_os_families = _this.regexes.mobile_os_families.map(function(str) {
                    mobile_agents[str] = true;
                });
                // Is Spider
                if (a.browser.family === "Spider") {
                    a.device.type = "Spider";
                } else if (a.browser.tablet || a.os.tablet || a.device.tablet) {
                    a.device.type = "Tablet";
                } else if (mobile_agents.hasOwnProperty(a.browser.family)) {
                    a.device.type = "Mobile";
                } else {
                    a.device.type = "Desktop";
                }
                // Determine Device Manufacturer
                a.device.manufacturer = a.browser.man || a.os.man || a.device.man || null;
                // Cleanup Objects
                remove([a.browser, a.os, a.device], ["tablet", "man"]);
                // Return Agent
                return a;
            };
            // Return context
            return _this;
        }();
        // Export the Underscore object for **Node.js** and **"CommonJS"**,
        // backwards-compatibility for the old `require()` API. If we're not
        // CommonJS, add `_` to the global object via a string identifier
        // the Closure Compiler "advanced" mode. Registration as an AMD
        // via define() happens at the end of this file
        if (typeof exports !== "undefined") {
            if (typeof module !== "undefined" && module.exports) {
                exports = module.exports = detect;
            }
            exports.detect = detect;
        }
    })(window);
},{}],6:[function(require,module,exports){
    var zhCh = require("./locale/zh-cn.json");
    var en = require("./locale/en.json");
    var list = ['zh-cn', 'en'];

    function LanguageFactory(global) {
        var lan = global.urlParams.lan || 'zh-cn';
        var flag = false;
        for (var i = 0; i < list.length; i++) {
            if (list[i] == lan) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            lan = 'zh-cn';
        }
        switch (lan) {
            case 'zh-cn':
                return zhCh;
                break;
            case 'en':
                return en;
                break;
        }
    };

    module.exports = LanguageFactory;

},{"./locale/en.json":7,"./locale/zh-cn.json":8}],7:[function(require,module,exports){
    module.exports={
        "html": {
            "HTML_MSG00": "Back",
            "HTML_MSG01": "Load more record",
            "HTML_MSG02": "Manual",
            "HTML_MSG03": "Send",
            "HTML_MSG04": "Photos",
            "HTML_MSG05": "Feedback",
            "HTML_MSG06": "Feedback",
            "HTML_MSG07": "Continue",
            "HTML_MSG08": "Submit",
            "HTML_MSG09": "The email has been sent successfully",
            "HTML_MSG010": "The team will contact you soon",
            "HTML_MSG011": "OK",
            "HTML_MSG0112": "Load more record",
            "HTML_MSG0113": "Manual",
            "HTML_MSG0114": "Send",
            "HTML_MSG0115": "Feedback",
            "HTML_MSG0116": "Continue",
            "HTML_MSG0117": "Email",
            "HTML_MSG0118": "Tel"
        },
        "system": {
            "L10001": "Sorry, the team is not in service right now ",
            "L10002": "{0} is at your service ",
            "L10003": "Conversation has ended temporarily,{0} ",
            "L10004": "Please wait, there are {0} people in need of service before you ",
            "L10005": "You haven't been talking for long time ",
            "L10006": "<a href=\"javascript: window.location.reload();\">Continue</a> ",
            "L10007": "Conversation with {0} has been ended temporarily {1} ",
            "L10008": "Conversation with {0} has been ended temporarily {1} ",
            "L10009": "Conversation with {0} has been ended temporarily ",
            "L10010": "Conversation has been ended temporarily.{0} ",
            "L10011": "{0} You have opened a new window {1}",
            "L10012": "No more record",
            "L10013": "Sorry, the team is not in service right now ",
            "L10014": "Image size can not exceed 5M",
            "L10015": "This file type is not supported",
            "L10016": "Loading...",
            "L10017": "Loading...",
            "L10018": "Load more record",
            "L10019": "{0} is at your service",
            "L10020": "{0} is typing",
            "L10021": "Conversation with {0} has been ended temporarily",
            "L10022": "{0} You can also get replies by<a href=\"javascript: void(0);\" id=\"systemMsgLeaveMessage\"> email </a>",
            "L10023": "{0} <span  id=\"systemMsgLeaveMsg\">Please wait...</span>",
            "L10024": "You can also get replies by <a class=\"leave-msg-btn\" href=\"{0}\" data-href=\"{1}\"> email </a>",
            "L10025": "Service Unavailable",
            "L10026": "Waiting",
            "L10027": "Sorry, the team is not in service right now",
            "L10028": "Conversation with {0} has been ended temporarily",
            "L10029": "You haven't been talking for long time",
            "L10030": "You've opened a new window",
            "L10031": "Conversation has been ended temporarily",
            "L10032": "Please try to describe your problem in other ways",
            "L10033": "This file type is not supported",
            "L10034": "Image size can not exceed 5M",
            "L10035": "Please try another browser",
            "L10036": "Sending...",
            "L10037": "Thank you",
            "L10038": "Failure, please try again",
            "L10039": " You can also get replies by<a class=\"leave-msg-btn js-leaveMessage\" href=\"javascript:void(0);\" > email </a>"
        },
        "text": {
            "T0000": "Cancel",
            "T0001": "OK",
            "T0002": "Load more record",
            "T0003": "Loading····",
            "T0004": "No more record",
            "T0005": "Yes",
            "T0006": "No",
            "T0010": "What do you need?",
            "T0011": "Today",
            "T0012": "Customer Support_",
            "T0013": "Yesterday",
            "T0020": "Customer Service is typing",
            "T0021": "Are you satisfied with our service?",
            "T0022": "Are you satisfied with our service?",
            "T0023": "Send a massage",
            "T0024": "Please wait...",
            "T0025": "We've received your feedback",
            "T0026": "You need to ask questions before feedback",
            "T0027": "What is the problem?",
            "T0028": "Tell us your suggestion",
            "T0029": "Submit",
            "T0030": "Email",
            "T0031": "Sending···",
            "T0032": "Thank you",
            "T0033": "Failure, please try again",
            "T0034": "Email@domain.com (required)",
            "T0035": "Email doesn't look quite right",
            "T0036": "Email doesn't look quite right",
            "T0037": "The description is needed",
            "T0038": "Continue",
            "T0039": "Submit email",
            "T0040": "Email",
            "T0041": "Yes",
            "T0042": "No",
            "T0043": "Feedback",
            "T0044": "Tel",
            "T0045": "tel is not correct",
            "T0046": " (required)",
            "T0047": "",
            "T0048": "Send a massage",
            "T0049": "qq Face",
            "T0050": "upload",
            "T0051": "Email",
            "T0052": "Feedback",
            "T0053": "Email@domain.com (required)",
            "T0054": "telphone(required)",
            "T0055": "telphone(optional)",
            "T0056": "The email has been sent successfully",
            "T0057": "Powered by Sobot",
            "T0058": " new messages",
            "T0059": "new messages",
            "T0060": "Manual",
            "T0061": "Company:",
            "T0062": "Email:",
            "T0063": "serviceNo:",
            "T0064": "Name:",
            "T0065": "Remark:",
            "T0066": "Tel:",
            "T0067": "phone:",
            "T0068": "open",
            "T0069": "close",
            "T0070": "Thank You",
            "T0071": "Sorry",
            "T0072": "Session end",
            "T0073": "Error",
            "T0074": "Already evaluated",
            "T0075": "Upload Error",
            "T0076": "Please Upload Files",
            "T0077": "Maximum upload file size",
            "T0078": "Upload file is not supported",
            "T0079": "Image size can not exceed 5M",
            "T0080": "Please Upload Image",
            "T0081": "This file type is not supported",
            "T0082": "file size can not exceed 20M",
            "T0083": "upload...",
            "T0084": "upload failed",
            "T0085": "upload attachments",
            "T0086": "Maximum upload 5",
            "T0087": "Confirm closing?",
            "T0088": "Ignore upload failed files?",
            "T0089": "Continue",
            "T0090": "Uploading",
            "T0091": "Ignore upload failed Images?",
            "T0092": "Email@domain.com(optional)",
            "T0093": "Feedback",
            "T0094": "Tell us about your problems?",
            "T0095": "Submit",
            "T0096": "Feedback",
            "T0097": "Not evaluate",
            "T0098": "Whether to solve the problem?",
            "T0099": "title",
            "T0100": "abstract",
            "T0101": "label",
            "T0102": "url",
            "T0103": "Please rate the service",
            "T0104": "Please choose tag",
            "T0105": "evaluate can't be blank",
            "T0106": "Has your question been resolved?",
            "T0107":"Your evaluation will make us do better",
            "T0108":"Please Fill ",
            "T0109":"Types",
            "T0110":"Problem Description",
            "T0111":"close",
            "T0112":"Return",
            "T0113":"Choose minutes",
            "T0114":"Choose hours",
            "T0115":"hours",
            "T0116":"minutes",
            "T0117":"Please fill in the description of the problem",
            "T0118":"Select",
            "T0119":"Customer is typing"

        }
    }

},{}],8:[function(require,module,exports){
    module.exports={
        "html": {
            "HTML_MSG00": "返回",
            "HTML_MSG01": "下拉显示更多",
            "HTML_MSG02": "转人工",
            "HTML_MSG03": " 发 送 ",
            "HTML_MSG04": "图片",
            "HTML_MSG05": "评价",
            "HTML_MSG06": "满意度评价",
            "HTML_MSG07": "新会话",
            "HTML_MSG08": "提交",
            "HTML_MSG09": "留言成功",
            "HTML_MSG010": "我们将很快联系您",
            "HTML_MSG011": "好的",
            "HTML_MSG0112": "点击加载历史记录",
            "HTML_MSG0113": "转人工服务",
            "HTML_MSG0114": "发送",
            "HTML_MSG0115": "满意度",
            "HTML_MSG0116": "继续会话",
            "HTML_MSG0117": "留言",
            "HTML_MSG0118": "手机"
        },
        "system": {
            "L10001": "暂时无法转接人工客服",
            "L10002": "您好,客服{0}接受了您的请求",
            "L10003": "您已经与服务器断开连接,{0}",
            "L10004": "排队中，您在队伍中的第{0}个",
            "L10005": "您在思考人生？有问题请随时提问哦",
            "L10006": "<a href=\"javascript: window.location.reload();\">重新接入</a>",
            "L10007": "{0}有事离开了{1}",
            "L10008": "您与{0}的会话已结束{1}",
            "L10009": "{0}结束了本次会话",
            "L10010": "您长时间没有说话，本次会话已结束。{0}",
            "L10011": "{0}您已打开新聊天窗口{1}",
            "L10012": "没有更多记录",
            "L10013": "抱歉，您无法接入在线客服",
            "L10014": "图片过大",
            "L10015": "格式不支持",
            "L10016": "正在加载...",
            "L10017": "正在加载...",
            "L10018": "下拉显示更多",
            "L10019": "客服{0}发起了会话",
            "L10020": "{0}正在输入",
            "L10021": "本次会话结束{0}",
            "L10022": "{0} 您可以<a href=\"javascript: void(0);\" id=\"systemMsgLeaveMessage\"> 留言 </a>",
            "L10023": "{0} <span  id=\"systemMsgLeaveMsg\">请等待</span>",
            "L10024": "您可以<a class=\"leave-msg-btn\" href=\"#0\"  data-href=\"{1}\"> 留言 </a>",
            "L10025": "暂无客服在线",
            "L10026": "排队中",
            "L10027": "暂无人工客服在线",
            "L10028": "您与{0}的会话已经结束",
            "L10029": "您已经很长时间未说话了哟，有问题尽管咨询",
            "L10030": "您已打开新窗口，刷新可继续会话",
            "L10031": "您已长时间未说话，系统自动关闭本次会话，刷新可继续会话",
            "L10032": "非常对不起哦，不知道怎么回答这个问题呢，我会努力学习的。",
            "L10033": "请上传正确的图片格式",
            "L10034": "图片不能大于5M",
            "L10035": "抱歉，此浏览器不支持上传图片！",
            "L10036": "正在发送，请稍候...",
            "L10037": "谢谢您的反馈",
            "L10038": "提交失败!请重试",
            "L10039": " 您可以<a class=\"leave-msg-btn js-leaveMessage\" href=\"javascript:void(0);\" > 留言 </a>"

        },
        "text": {
            "T0000": "取消",
            "T0001": "确定",
            "T0002": "下拉加载更多",
            "T0003": "加载中····",
            "T0004": "没有更多",
            "T0005": "是",
            "T0006": "否",
            "T0010": "选择要咨询的内容",
            "T0011": "今天",
            "T0012": "咨询客服—",
            "T0013": "昨天",
            "T0020": "客服正在输入···",
            "T0021": "是否解决了您的问题？",
            "T0022": "客服评价",
            "T0023": "请简要描述您的问题",
            "T0024": "排队中，请稍后····",
            "T0025": "您的评价已成功提交",
            "T0026": "咨询后才能评价服务质量",
            "T0027": "存在以下哪些问题：",
            "T0028": " 欢迎给我们服务提建议~",
            "T0029": "提交评价",
            "T0030": "留言",
            "T0031": "正在发送",
            "T0032": "谢谢您的反馈",
            "T0033": "提交失败!请重试",
            "T0034": "邮箱 （必填）",
            "T0035": "请填写邮箱",
            "T0036": "邮箱格式错误",
            "T0037": "请填写问题描述！",
            "T0038": "开始咨询",
            "T0039": "提交留言",
            "T0040": "请您留言",
            "T0041": "已解决",
            "T0042": "未解决",
            "T0043": "评价",
            "T0044": "手机",
            "T0045": "手机号格式不正确",
            "T0046": "（必填）",
            "T0047": "（选填）",
            "T0048": "请简要描述您的问题...",
            "T0049": "表情",
            "T0050": "上传文件",
            "T0051": "留言",
            "T0052": "满意度",
            "T0053": "邮箱",
            "T0054": "手机",
            "T0055": "手机（选填）",
            "T0056": "您的留言已成功提交",
            "T0057": "Powered by 智齿科技",
            "T0058": " 条新消息",
            "T0059": "以下为未读消息",
            "T0060": "转人工服务",
            "T0061": "公司：",
            "T0062": "邮箱：",
            "T0063": "工号：",
            "T0064": "姓名：",
            "T0065": "备注：",
            "T0066": "手机：",
            "T0067": "电话：",
            "T0068": "展开",
            "T0069": "收起",
            "T0070": "感谢您的反馈",
            "T0071": "很抱歉没能帮到您",
            "T0072": "会话结束后无法反馈",
            "T0073": "提交失败请稍后重试",
            "T0074": "已评价过该词条",
            "T0075": "上传失败！",
            "T0076": "请上传附件!",
            "T0077": "已达到最大上传附件数量",
            "T0078": "不支持上传此格式文件,您可以将文件打包为zip或者rar格式文件上传",
            "T0079": "图片大小不能超过5MB",
            "T0080": "请上传图片",
            "T0081": "请上传正确的图片格式",
            "T0082": "文件大小不能超过20MB",
            "T0083": "上传中...",
            "T0084": "上传失败",
            "T0085": "上传附件",
            "T0086": "最多上传5个附件",
            "T0087": "您的留言尚未提交，确认关闭？",
            "T0088": "提交将自动忽略上传失败的附件",
            "T0089": "仍然提交",
            "T0090": "有文件正在上传，无法提交",
            "T0091": "提交将自动忽略上传失败的图片",
            "T0092": "邮箱（选填）",
            "T0093": "邀请您对本次服务进行评价",
            "T0094": "告诉我们您遇到的问题？",
            "T0095": "提交",
            "T0096": "请您对本次服务进行评价",
            "T0097": "暂不评价",
            "T0098": "是否解决了您的问题？",
            "T0099": "标题",
            "T0100": "摘要",
            "T0101": "标签",
            "T0102": "链接",
            "T0103": "请您对本次服务进行评分",
            "T0104":"请至少选择一个标签",
            "T0105":"请填写评价详情",
            "T0106":"是否解决了您的问题？",
            "T0107":"您的评价会让我们做得更好",
            "T0108":"请填写",
            "T0109":"问题类型",
            "T0110":"问题描述",
            "T0111":"关闭",
            "T0112":"上一级",
            "T0113":"选择分钟",
            "T0114":"选择小时",
            "T0115":"时",
            "T0116":"分",
            "T0117":"请填写问题类型！",
            "T0118":"请选择",
            "T0119": "正在输入···"












        }

    }

},{}],9:[function(require,module,exports){
    var that = {};

    var state;
    var listener = require('../util/listener.js');
    that.setCurrentState = function(s) {
        state = s;
        listener.trigger("core.statechange", state);
    };

    that.getCurrentState = function() {
        return state;
    };

    module.exports = that;
},{"../util/listener.js":29}],10:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    var HumanFirst = function(global) {
        var listener = require("../util/listener.js");
        var Promise = require('../util/promise.js');
        var DateUtil = require('../util/date.js');
        var Robot = require('../socket/robot.js');
        var modeState = require('./currentState.js');
        var $ajax = require("../util/monitAjax.js")(global);
        var WebSocket = require('../socket/websocket.js');
        var Rolling = require('../socket/rolling.js');
        var transfer = require('./transfer.js');
        var initSession = require('./initsession.js');
        var socketFactory = require('../socket/socketfactory.js');
        var leaveMessageStr = global.apiConfig.leaveMsg;
        var language = global.language.lan;
        var queueing = false;
        var manager,
            tempManager;

        /**
         * 人工优先  转人工失败的情况下，需要显示机器人引导语
         **/
        var initRobotGuide = function() {
            if (global.apiConfig.guideFlag && global.apiInit.ustatus != 1 && global.apiConfig.type != 2) { //当为机器人的时候再判断引导问题
                $.ajax({
                    type: "post",
                    url: '/chat/user/robotGuide.action',
                    dataType: "json",
                    data: {
                        uid: global.apiInit.uid,
                        robotFlag: global.urlParams.robotFlag || ""
                    },
                    success: function(ret) {
                        var date = ret.data.ts ? new Date(ret.data.ts) : new Date();
                        date = new Date(date.getTime() + 10 * 10000);
                        var dateStr = DateUtil.formatDate(date, true);
                        var msg = ret.data.answer || '';
                        // msg = msg + '<a href="https://www.baidu.com">百度</a>';
                        if (msg.indexOf('<a') >= 0) {
                            msg = msg.replace(/<a/g, '<a target="_blank"');
                        }
                        var dataList = [];
                        dataList.push({
                            'type': "robot",
                            'answerType': "welcome-sugguestions",
                            "date": dateStr,
                            'content': [{
                                'senderName': global.apiConfig.robotName,
                                'senderType': 3, //3欢迎语支持引导问题
                                'msg': msg,
                                'stripe': "",
                                /*ret.data.stripe*/
                                'list': ret.data.suggestions,
                                'ts': dateStr
                            }]
                        });
                        listener.trigger("core.initsession", dataList);
                    }
                });
            }
        };

        var initHumanSession = function(value, ret, word) {
            var success = !!word;
            var face = (!!word) ? ret.aface : global.apiConfig.robotLogo;
            var name = (!!word) ? ret.aname : global.apiConfig.robotName;
            var word = word || global.urlParams.robotHelloWord;
            var curStatus = global.apiInit.ustatus == -2 ? 1 : 0;
            //-2为排队中
            if (!value) {
                value = [];
            }
            var now = new Date();
            var obj = {
                "date": DateUtil.formatDate(now),
                "content": [{
                    // 'senderType' : (!!word) ? 2 : 1,
                    'senderType': curStatus ? 1 : (!!word) ? 2 : 1,
                    't': +now,
                    'msg': word,
                    'ts': DateUtil.formatDate(now, true),
                    'senderFace': face,
                    'senderName': name
                }]
            };
            modeState.setCurrentState("human");
            value.push(obj);
            setTimeout(function() {
                listener.trigger("core.initsession", value);
            }, 0);
        };

        var initRobotSession = function(value, promise) {
            if (!value) {
                value = [];
            }
            var now = new Date();
            var obj = {
                "date": DateUtil.formatDate(now),
                "content": [{
                    'senderType': 1,
                    't': +now,
                    'msg': global.urlParams.robotHelloWord,
                    'ts': DateUtil.formatDate(now, true),
                    'senderFace': global.apiConfig.robotLogo,
                    'senderName': global.apiConfig.robotName
                }]
            };
            if(global.apiInit.ustatus!=-1)
                value.push(obj);
            if (manager) {
                manager.destroy();
            }
            manager = new Robot(global);
            modeState.setCurrentState("robot");
            setTimeout(function() {
                listener.trigger("core.initsession", value);
            }, 0);
        };

        var transferFail = function(init, promise) {
            if (!init)
                return;
            var value = [];
            var now = new Date();
            var obj = {
                "date": DateUtil.formatDate(now),
                "content": [{
                    'senderType': 1,
                    't': +now,
                    'msg': global.urlParams.robotHelloWord,
                    'ts': DateUtil.formatDate(now, true),
                    'senderFace': global.apiConfig.robotLogo,
                    'senderName': global.apiConfig.robotName
                }]
            };
            modeState.setCurrentState("robot");
            if (manager) {
                manager.destroy();
            }
            manager = new Robot(global);
            initSession(global, promise, false).then(function(value) {
                value.push(obj);
                listener.trigger("core.initsession", value);
            });

        };

        var queueWait = function(ret, init, value) {
            var str = language['L10004'].replace("{0}", ret.count);
            queueing = true;
            if (init) {
                initRobotGuide();
                initHumanSession(value, ret, null);
                setTimeout(function() {
                    //msgflag,0开启，1关闭
                    if (!global.urlParams.msgflag) {
                        ret.content = str + " " + leaveMessageStr;
                    } else {
                        ret.content = str;
                    }
                    if (ret.status == 7) {
                        ret.content = ret.msg;
                    };
                    listener.trigger("core.system", {
                        'type': 'system',
                        'status': 'queue',
                        'data': ret
                    });
                }, 1);
            } else {
                //msgflag,0开启，1关闭
                if (!global.urlParams.msgflag) {
                    ret.content = str + " " + leaveMessageStr;
                } else {
                    ret.content = str;
                }
                if (ret.status == 7) {
                    ret.content = ret.msg;
                };
                listener.trigger("core.system", {
                    'type': 'system',
                    'status': 'queue',
                    'data': ret
                });
            }
            if (manager) {
                manager.destroy();
            }
            if (!tempManager && ret.status != 7) {
                tempManager = socketFactory(ret, global);
                tempManager.start();
            }
            manager = new Robot(global);
            modeState.setCurrentState("robot");
            if (ret.status != 7) {
                listener.trigger("core.sessionclose", -3);
            }
        };

        var onReceive = function(data) {
            var list = data.list || [];
            for (var i = 0,
                     len = list.length; i < len; i++) {
                var item = list[i];
                var ret = item;
                if (item.type === 200) {
                    if (manager && tempManager) {
                        manager.destroy();
                        manager = tempManager;
                        tempManager = null;
                    }
                    modeState.setCurrentState('human');
                    listener.trigger("core.system", {
                        'type': 'system',
                        'status': "transfer",
                        'data': {
                            'content': language['L10002'].replace("{0}", ret.aname)
                        }
                    });
                    if (ret.serviceInfo.adminHelloWord) {
                        global.urlParams.adminHelloWord = ret.serviceInfo.adminHelloWord;
                    }
                    ret.content = global.urlParams.adminHelloWord;
                    listener.trigger("core.system", {
                        'type': 'human',
                        'data': ret
                    });

                    listener.trigger("core.buttonchange", {
                        'type': 'transfer',
                        'action': 'hide'
                    });
                    break;
                }
            }
        };

        var serverOffline = function(ret, init, value) {
            listener.trigger("core.buttonchange", {
                'type': 'transfer',
                'action': 'show'
            });
            if (init) {
                initRobotGuide();
                initRobotSession(value, ret, null);
                setTimeout(function() {
                    //ret.content = global.apiConfig.adminNonelineTitle + leaveMessageStr;
                    //msgflag,0开启，1关闭
                    if (!global.urlParams.msgflag) {
                        ret.content = global.urlParams.adminNonelineTitle + " " + leaveMessageStr;
                    } else {
                        ret.content = global.urlParams.adminNonelineTitle;
                    }
                    listener.trigger("core.system", {
                        'type': 'system',
                        'status': 'offline',
                        'data': ret
                    });
                }, 1);
            } else {
                if (manager) {
                    manager.destroy();
                }
                manager = new Robot(global);
                modeState.setCurrentState("robot");
                //msgflag,0开启，1关闭
                if (!global.urlParams.msgflag) {
                    ret.content = global.urlParams.adminNonelineTitle + leaveMessageStr;
                } else {
                    ret.content = global.urlParams.adminNonelineTitle;
                }
                listener.trigger("core.system", {
                    'type': 'system',
                    'status': 'offline',
                    'data': ret
                });
            }
        };

        var blackListCallback = function(ret, init) {
            //ret.content = language['L10001'] + ' ' + leaveMessageStr;
            //msgflag,0开启，1关闭
            if (!global.urlParams.msgflag) {
                ret.content = language['L10001'] + ' ' + leaveMessageStr;
            } else {
                ret.content = language['L10001'];
            }
            manager = new Robot(global);
            modeState.setCurrentState("robot");
            listener.trigger("core.system", {
                'type': 'system',
                'status': 'blacklist',
                'data': ret
            });
            if (init) {
                initRobotSession();
            }
        };

        var transferSuccess = function(groupId, promise, init) {
            var init = !!init;
            initSession(global, promise, true).then(function(value, promise) {
                var way;
                if (tempManager) {
                    way = tempManager.type == 'websocket' ? 8 : 1;
                } else {
                    way = 1;
                }
                //判断是否是主动邀请的转人工
                var urlParams = global.urlParams;
                var url = '/chat/user/chatconnect.action';
                var reqParams = {
                    'sysNum': global.sysNum,
                    'uid': global.apiInit.uid,
                    'chooseAdminId': global.urlParams.aid || '',
                    'tranFlag': global.urlParams.tranFlag,
                    'way': way,
                    'current': queueing,
                    'groupId': groupId || ''
                };
                if (urlParams.autoManual && urlParams.aid) {
                    url = '/chat/user/invite.action';
                    reqParams.aid = urlParams.aid;
                }
                $ajax({
                    'url': url,
                    'type': 'post',
                    'dataType': 'json',
                    'data': reqParams,
                    'success': function(ret) {
                        global.urlParams.leaveMsgGroupId = groupId;
                        if (ret.status == -1) {
                            listener.trigger("core.sessionclose", 7);
                            return;
                        }
                        //[0:排队，2：无客服在线，3：黑名单或机器人超时下线，1：成功]
                        if (ret.status == 2) {
                            //暂无客服在线
                            serverOffline(ret, init, value);
                        } else if (ret.status == 0 || ret.status == 7) {
                            //排队
                            queueWait(ret, init, value);
                        } else if (ret.status == 1) {
                            if (window.parent && window.postMessage && global.urlParams.from == 'iframe') {
                                window.parent.postMessage(JSON.stringify({
                                    'name': 'manual',
                                    'status': 'success'
                                }), "*");
                            }
                            queueing = false;
                            if (ret.adminHelloWord) {
                                global.urlParams.adminHelloWord = ret.adminHelloWord;
                            };
                            if (init) {
                                initHumanSession(value, ret, global.urlParams.adminHelloWord);
                                listener.trigger("core.transfersuccess", {
                                    'data': ret
                                });
                            } else {
                                listener.trigger("core.system", {
                                    'type': 'system',
                                    'status': "transfer",
                                    'data': {
                                        'content': language['L10002'].replace("{0}", ret.aname)
                                    }
                                });
                                listener.trigger("core.transfersuccess", {
                                    'data': ret
                                });
                                ret.content = global.urlParams.adminHelloWord;
                                listener.trigger("core.system", {
                                    'type': 'human',
                                    'status': "transfer",
                                    'data': ret
                                });
                            }
                            if (manager) {
                                manager.destroy();
                            }
                            manager = socketFactory(ret, global);
                            manager.start();
                            modeState.setCurrentState("human");
                            listener.trigger("core.buttonchange", {
                                'type': 'transfer',
                                'action': 'hide'
                            });
                        } else if (ret.status == 3) {
                            listener.trigger("core.sessionclose", 7);
                            blackListCallback(ret, init);
                        } else if (ret.status == 6) {
                            delete global.urlParams.aid;
                            listener.trigger("core.grouplist");
                        }
                    },
                    'fail': function() {}
                });
            });

        };

        var transferConnect = function(value, promise, init) {
            var init = !!init;
            var promise = new Promise();
            transfer(global, promise, queueing).then(function(groupId) {
                transferSuccess(groupId, null, init);
            }, function() {
                transferFail(init, promise);
            });
            return promise;

        };

        var getWelcome = function(value, promise) {
            var promise = promise || new Promise();
            if (!value) {
                value = [];
            }
            var now = new Date();
            var obj = {
                "date": DateUtil.formatDate(now),
                "content": [{
                    'senderType': 2,
                    't': +now,
                    'msg': global.urlParams.adminHelloWord,
                    'ts': DateUtil.formatDate(now, true)
                }]
            };
            setTimeout(function() {
                promise.resolve(value);
            }, 0);
            return promise;
        };

        var parseDOM = function() {};

        var bindListener = function() {
            listener.on("sendArea.artificial", transferConnect);
            listener.on("core.onreceive", onReceive);
        };

        var initPlugins = function() {
            var status = global.apiInit.ustatus;
            //queueing = (status == -2);
            if (status == 0 || status == 1 || status == -2) {
                transferConnect(null, null, true);
            } else if (status == -1) {
                initSession(global).then(initRobotSession);
            }
        };

        var init = function() {
            parseDOM();
            bindListener();
            initPlugins();
        };

        init();

        this.getWelcome = function() {};

    };

    module.exports = HumanFirst;
},{"../socket/robot.js":21,"../socket/rolling.js":22,"../socket/socketfactory.js":23,"../socket/websocket.js":24,"../util/date.js":25,"../util/listener.js":29,"../util/monitAjax.js":30,"../util/promise.js":31,"./currentState.js":9,"./initsession.js":12,"./transfer.js":19}],11:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    function HumanOnly(global) {
        var listener = require("../util/listener.js");
        var Promise = require('../util/promise.js');
        var DateUtil = require('../util/date.js');
        var $ajax = require("../util/monitAjax.js")(global);
        var Robot = require('../socket/robot.js');
        var WebSocket = require('../socket/websocket.js');
        var setCurrentState = require('./currentState.js');
        var Rolling = require('../socket/rolling.js');
        var modeState = require('./currentState.js');
        var transfer = require('./transfer.js');
        var initSession = require('./initsession.js');
        var socketFactory = require('../socket/socketfactory.js');
        var leaveMessageStr = global.apiConfig.leaveMsg;
        var language = global.language.lan;
        var manager = null;
        var queueing = false;

        var initHumanSession = function(value, ret, word) {
            var success = !!word;
            var face = (!!word) ? ret.aface : global.apiConfig.robotLogo;
            var name = (!!word) ? ret.aname : global.apiConfig.robotName;
            var word = word || global.urlParams.robotHelloWord;
            var curStatus = global.apiInit.ustatus == -2 ? 1 : 0;
            //-2为排队中
            if (!value) {
                value = [];
            }
            var now = new Date();
            var obj = {
                "date": DateUtil.formatDate(now),
                "content": [{
                    // 'senderType' : (!!word) ? 2 : 1,
                    'senderType': curStatus ? 1 : (!!word) ? 2 : 1,
                    't': +now,
                    'msg': word,
                    'ts': DateUtil.formatDate(now, true),
                    'senderFace': face,
                    'senderName': name
                }]
            };
            value.push(obj);
            setTimeout(function() {
                listener.trigger("core.initsession", value);
            }, 0);
        };

        var transferConnect = function(value, promise, init) {
            var init = !!init;
            var promise = new Promise();
            transfer(global, promise, queueing).then(function(groupId) {
                transferSuccess(groupId, null, init);
            }, transferFail);
            return promise;

        };

        var onReceive = function(data) {
            var list = data.list || [];
            for (var i = 0,
                     len = list.length; i < len; i++) {
                var item = list[i];
                var ret = item;
                if (item.type === 200) {
                    setCurrentState.setCurrentState('human');
                    listener.trigger("core.system", {
                        'type': 'system',
                        'status': "transfer",
                        'data': {
                            'content': language['L10002'].replace("{0}", ret.aname)
                        }
                    });
                    //ret.content = global.urlParams.adminHelloWord;
                    if (ret.serviceInfo.adminHelloWord) {
                        global.urlParams.adminHelloWord = ret.serviceInfo.adminHelloWord;
                    };
                    ret.content = global.urlParams.adminHelloWord;
                    listener.trigger("core.system", {
                        'type': 'human',
                        'data': ret
                    });
                    listener.trigger("core.buttonchange", {
                        'type': 'transfer',
                        'action': 'hide'
                    });
                    break;
                }
            }
        };
        var transferFail = function() {
            if (false) {
                var value = [];
                var now = new Date();
                var obj = {
                    "date": DateUtil.formatDate(now),
                    "content": [{
                        'senderType': 1,
                        't': +now,
                        'msg': global.urlParams.robotHelloWord,
                        'ts': DateUtil.formatDate(now, true),
                        'senderFace': global.apiConfig.robotLogo,
                        'senderName': global.apiConfig.robotName
                    }]
                };
                value.push(obj);
                manager = new Robot(global);
                modeState.setCurrentState("robot");
            }
            setTimeout(function() {
                listener.trigger("core.sessionclose", -1);
            }, 0);
        };

        var queueWait = function(ret, init, value) {
            var str = language['L10004'].replace("{0}", ret.count);
            queueing = true;
            if (manager) {
                manager.destroy();
            }
            manager = socketFactory(ret, global);
            manager.start();
            if (init) {
                // initHumanSession(value,ret,null);
                listener.trigger("core.initsession", value);
                setTimeout(function() {
                    //msgflag,0开启，1关闭
                    if (!global.urlParams.msgflag) {
                        ret.content = str + " " + leaveMessageStr;
                    } else {
                        ret.content = str;
                    }
                    ret.aname = language['L10026'];
                    listener.trigger("core.system", {
                        'type': 'system',
                        'status': 'queue',
                        'data': ret
                    });
                    listener.trigger("core.sessionclose", -2);
                }, 1);
            } else {
                //msgflag,0开启，1关闭
                if (!global.urlParams.msgflag) {
                    ret.content = str + " " + leaveMessageStr;
                } else {
                    ret.content = str;
                }
                ret.aname = '排队中';
                listener.trigger("core.system", {
                    'type': 'system',
                    'status': 'queue',
                    'data': ret
                });
                listener.trigger("core.sessionclose", -2);
            }
        };
        var serverOffline = function(ret, init, value) {
            if (manager) {
                manager.destroy();
            }
            if (!global.urlParams.msgflag) {
                ret.content = global.urlParams.adminNonelineTitle + ' ' + leaveMessageStr;
            } else {
                ret.content = global.urlParams.adminNonelineTitle;
            }
            //ret.content = global.urlParams.adminNonelineTitle + ' ' + leaveMessageStr;
            listener.trigger("core.buttonchange", {
                'type': 'transfer',
                'action': 'hide',
                'data': ret
            });
            if (init) {
                setTimeout(function() {
                    listener.trigger("core.sessionclose", -1);
                }, 1);
            } else {
                listener.trigger("core.sessionclose", -1);
            }
        };

        var blackListCallback = function(ret, init) {

            //msgflag,0开启，1关闭
            if (!global.urlParams.msgflag) {
                ret.content = global.urlParams.adminNonelineTitle + ' ' + leaveMessageStr;
            } else {
                ret.content = global.urlParams.adminNonelineTitle;
            }
            ret.aname = language['L10025'];
            listener.trigger("core.system", {
                'type': 'system',
                'status': 'blacklist',
                'data': ret,
                'moduleType': "humanOnly"
            });
            listener.trigger("core.sessionclose", -1);
        };
        var transferSuccess = function(groupId, promise, init) {
            var init = !!init;
            initSession(global, promise).then(function(value, promise) {
                //判断是否是主动邀请的转人工
                var urlParams = global.urlParams;
                var url = '/chat/user/chatconnect.action';
                var reqParams = {
                    'sysNum': global.sysNum,
                    'chooseAdminId': global.urlParams.aid || '',
                    'tranFlag': global.urlParams.tranFlag,
                    'uid': global.apiInit.uid,
                    'way': 1,
                    'current': queueing,
                    'groupId': groupId || ''
                };
                if (urlParams.autoManual && urlParams.aid) {
                    url = '/chat/user/invite.action';
                    reqParams.aid = urlParams.aid;
                }
                $ajax({
                    'url': url,
                    'type': 'post',
                    'dataType': 'json',
                    'data': reqParams,
                    'success': function(ret) {
                        global.urlParams.leaveMsgGroupId = groupId;
                        if (ret.status == -1) {
                            listener.trigger("core.sessionclose", 7);
                            return;
                        }
                        //[0:排队，2：无客服在线，3：黑名单或机器人超时下线，1：成功]
                        if (ret.status == 2) {
                            //暂无客服在线
                            serverOffline(ret, init, value);
                        } else if (ret.status == 0) {
                            //排队
                            // console.log(ret,0);
                            queueWait(ret, init, value);
                        } else if (ret.status == 1) {
                            if (window.parent && window.postMessage && global.urlParams.from == 'iframe') {
                                window.parent.postMessage(JSON.stringify({
                                    'name': 'manual',
                                    'status': 'success'
                                }), "*");
                            }
                            if (ret.adminHelloWord) {
                                global.urlParams.adminHelloWord = ret.adminHelloWord;
                            };
                            if (init) {
                                initHumanSession(value, ret, global.urlParams.adminHelloWord);
                                listener.trigger("core.transfersuccess", {
                                    'data': ret
                                });
                            } else {
                                listener.trigger("core.system", {
                                    'type': 'system',
                                    'status': "transfer",
                                    'data': {
                                        'content': language['L10002'].replace("{0}", ret.aname)
                                    }
                                });
                                listener.trigger("core.transfersuccess", {
                                    'data': ret
                                });
                                ret.content = global.urlParams.adminHelloWord;
                                listener.trigger("core.system", {
                                    'type': 'human',
                                    'status': "transfer",
                                    'data': ret
                                });
                            }
                            if (manager) {
                                manager.destroy();
                            }
                            manager = socketFactory(ret, global);
                            modeState.setCurrentState("human");
                            manager.start();
                            listener.trigger("core.buttonchange", {
                                'type': 'transfer',
                                'action': 'hide'
                            });
                        } else if (ret.status == 3) {
                            blackListCallback(ret, init);
                        } else if (ret.status == 6) {
                            delete global.urlParams.aid;
                            listener.trigger("core.grouplist");
                        } else if (ret.status == 7) {
                            ret.content = ret.msg;
                            listener.trigger("core.system", {
                                "type": "system",
                                "status": "queue",
                                "data": ret
                            });
                        }
                    },
                    'fail': function() {}
                });
            });

        };

        var parseDOM = function() {
            listener.on("sendArea.artificial", transferConnect);
        };

        var bindListener = function() {
            listener.on("core.onreceive", onReceive);
        };

        var initPlugins = function() {
            var status = global.apiInit.ustatus;
            //queueing = (status == -2);
            if (status == 0 || status == 1 || status == -2) {
                transferConnect(null, null, true);
            }
        };

        var init = function() {
            parseDOM();
            bindListener();
            initPlugins();
        };

        init();
    };

    module.exports = HumanOnly;
},{"../socket/robot.js":21,"../socket/rolling.js":22,"../socket/socketfactory.js":23,"../socket/websocket.js":24,"../util/date.js":25,"../util/listener.js":29,"../util/monitAjax.js":30,"../util/promise.js":31,"./currentState.js":9,"./initsession.js":12,"./transfer.js":19}],12:[function(require,module,exports){
//会话判断
    var Promise = require('../util/promise.js');
    var dateUtil = require("../util/date.js");
    var global, ignoreSuggetion;
    var offlineMessageCache = require("./offlineMessage.js")
    var $ajax;
    var initSessions = function(global, promise) {
        var promise = promise || new Promise();
        //拉取会话记录
        if (global.apiInit.ustatus == 0) {
            setTimeout(function() {
                promise.resolve([]);
            }, 0);
        } else {
            $.ajax({
                type: "post",
                url: '/chat/user/getChatDetailByCid.action',
                dataType: "json",
                data: {
                    cid: global.apiInit.cid,
                    uid: global.apiInit.uid
                },
                success: function(data) {
                    console.log(data);
                    promise.resolve(data);
                }
            });
        }

        return promise;
    };


    var initOfflineMessage = function(dataList, promise) {
        var promise = promise || new Promise();
        $.ajax({
            'url': '/chat/msgOffline/queryOfflineMsg.action',
            'dataType': 'json',
            'type': 'GET',
            'data': {
                'uid': global.apiInit.uid
            },
            'success': function(ret) {
                var firstChild;
                if (ret.length > 0) {
                    for (var i = 0; i < ret.length; i++) {
                        var list = ret[i].content || [];
                        for (var j = 0; j < list.length; j++) {
                            var item = list[j];
                            if (j == 0) {
                                firstChild = item;
                            }
                            offlineMessageCache[item.msgId] = true;
                            item.msgType = "offline";
                            if (item.senderType === null) {
                                //离线消息当做客服发送的消息处理
                                item.senderType = 2;

                            }
                            if (!item.msg) {
                                item.msg = "";
                            }
                        }
                    }
                    var date = firstChild.t ? new Date(firstChild.t) : new Date();
                    date = new Date(date.getTime() + 10 * 10000);
                    var dateStr = dateUtil.formatDate(date, true);
                    dataList.push({
                        'type': "offline-seperator",
                        "date": "",
                        'content': [{
                            'senderType': -1,
                            'msg': '',
                            'ts': firstChild ? firstChild.ts : dateStr,
                            't': firstChild ? firstChild.t : +new Date()
                        }]
                    });
                }
                var list = dataList.concat(ret);
                promise.resolve(list);
            }
        });
        return promise;
    };

//获取关联问题
    var initSugguestions = function(dataList, promise) {
        var promise = promise || new Promise();
        if (ignoreSuggetion) {
            setTimeout(function() {
                promise.resolve(dataList);
            }, 0);
            return;
        }
        var msg = [];
        var moduleType;
        if (global.urlParams.moduleType !== undefined) {
            moduleType = global.urlParams.moduleType;
        }
        if (moduleType === undefined) {
            moduleType = global.apiConfig.type;
        }
        //当会话进行中 不出引导关联问题  机器人&人工都一样 denzel
        if (global.apiConfig.guideFlag && global.apiInit.ustatus != 1 && global.apiInit.ustatus != -1 && moduleType != 2) {
            $.ajax({
                type: "post",
                url: '/chat/user/robotGuide.action',
                dataType: "json",
                data: {
                    uid: global.apiInit.uid,
                    robotFlag: global.urlParams.robotFlag || ""
                },
                success: function(ret) {
                    var date = ret.data.ts ? new Date(ret.data.ts) : new Date();
                    date = new Date(date.getTime() + 10 * 10000);
                    var dateStr = dateUtil.formatDate(date, true);
                    var msg = ret.data.answer || '';
                    // msg = msg + '<a href="https://www.baidu.com">百度</a>';
                    if (msg.indexOf('<a') >= 0) {
                        msg = msg.replace(/<a/g, '<a target="_blank"');
                    }
                    dataList.push({
                        'type': "robot",
                        'answerType': "welcome-sugguestions",
                        "date": dateStr,
                        'content': [{
                            'senderName': global.apiConfig.robotName,
                            'senderType': 3, //3欢迎语支持引导问题
                            'msg': msg,
                            'stripe': "",
                            /*ret.data.stripe*/
                            'list': ret.data.suggestions,
                            'ts': dateStr
                        }]
                    });
                    promise.resolve(dataList);
                }
            });
        } else {
            promise.resolve(dataList);
        }
        return promise;
    }


    module.exports = function(g, promise, ignore) {
        global = g;
        $ajax = require("../util/monitAjax.js")(global);
        ignoreSuggetion = ignore;
        return initSessions(global).then(initOfflineMessage).then(initSugguestions);
    };
},{"../util/date.js":25,"../util/monitAjax.js":30,"../util/promise.js":31,"./offlineMessage.js":14}],13:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    var manager = null;
    var errorlogFun = require("../util/errorlog.js");
    var QUFENQI_COMPANYID = 'a2a01f79faed48489058af7eabaafc1c';

    function ModeEntranceFactroy(global) {
        var ROBOT_FIRST = 3,
            HUMAN_FIRST = 4,
            ROBOT_ONLY = 1,
            HUMAN_ONLY = 2;
        var type,
            params,
            moduleType;
        var humanFirst = require('./humanfirst.js');
        var robotFirst = require('./robotfirst.js');
        var robotOnly = require('./robotonly.js');
        var humanOnly = require('./humanonly.js');
        var Comm = require('../comm.js');
        params = Comm.getQueryParam();
        //ulr参数优先

        if (params.moduleType >= 1 && params.moduleType <= 4) {
            moduleType = params.moduleType;
        } else {
            moduleType = global.apiConfig.type;
        }
        if (!!manager) {
            return manager;
        }
        //针对趣分期单独做的监控
        if ((moduleType == HUMAN_FIRST || moduleType == HUMAN_ONLY) && global.apiInit.pid === QUFENQI_COMPANYID) {
            errorlogFun.specialError('qufenqi_human_first', 'mode', {
                'url': location.href,
                'moduleType': moduleType,
                'uid': global.apiInit.uid
            }, global);
        }
        switch (moduleType) {
            case ROBOT_FIRST:
                manager = new robotFirst(global);
                break;
            case HUMAN_FIRST:
                manager = new humanFirst(global);
                break;
            case ROBOT_ONLY:
                manager = new robotOnly(global);
                break;
            case HUMAN_ONLY:
                manager = new humanOnly(global);
                break;
        }
        return manager;
    };

    module.exports = ModeEntranceFactroy;
},{"../comm.js":1,"../util/errorlog.js":26,"./humanfirst.js":10,"./humanonly.js":11,"./robotfirst.js":16,"./robotonly.js":17}],14:[function(require,module,exports){
    module.exports = {};

},{}],15:[function(require,module,exports){
    var offlineCache = require("./offlineMessage.js");

    function Filter(arr) {
        var count = 0;
        for (var el in offlineCache) {
            if (!offlineCache.hasOwnProperty(el)) {
                continue;
            }
            count++;
        }
        if (count == 0)
            return;
        for (var i = 0; i < arr.length; i++) {
            var list = [];
            for (var j = 0; j < arr[i].content.length; j++) {
                var item = arr[i].content[j];
                if (!offlineCache[item.msgId]) {
                    list.push(item);
                } else {
                    delete offlineCache[item.msgId];
                }
            }
            arr[i].content = list;
        }

    };


    module.exports = Filter;

},{"./offlineMessage.js":14}],16:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    var RobotFirst = function(global) {
        var listener = require("../util/listener.js");
        var Promise = require('../util/promise.js');
        var DateUtil = require('../util/date.js');
        var Robot = require('../socket/robot.js');
        var setCurrentState = require('./currentState.js');
        var WebSocket = require('../socket/websocket.js');
        var Rolling = require('../socket/rolling.js');
        var transfer = require('./transfer.js');
        var initSession = require('./initsession.js');
        var $ajax = require("../util/monitAjax.js")(global);
        var socketFactory = require('../socket/socketfactory.js');
        var leaveMessageStr = global.apiConfig.leaveMsg;
        var _self = this;
        var manager,
            tempManager;
        var language = global.language.lan;
        var queueing = false;
        var outerPromise = new Promise();
        var count = 0;
        var parseDOM = function() {
            $transferBtn = $(".temp_test");
        };

        var getWelcome = function(value, promise) {
            var promise = promise || new Promise();
            initSession(global, promise).then(function(value, promise) {
                if (!value) {
                    value = [];
                }
                var now = new Date();
                var obj = {
                    "date": DateUtil.formatDate(now),
                    "content": [{
                        'senderType': 1,
                        't': +now,
                        'msg': global.urlParams.robotHelloWord,
                        'ts': DateUtil.formatDate(now, true),
                        'senderFace': global.apiConfig.robotLogo,
                        'senderName': global.apiConfig.robotName
                    }]
                };

                value.push(obj);
                setTimeout(function() {
                    listener.trigger("core.initsession", value);
                }, 0);
                return promise;
            });
            return promise;
        };
        var initHumanSession = function(word, ret) {
            var face = (!!word) ? ret.aface : global.apiConfig.robotLogo;
            var name = (!!word) ? ret.aname : global.apiConfig.robotName;
            var word = word || global.urlParams.robotHelloWord;
            var curStatus = global.apiInit.ustatus == -2 ? 1 : 0;
            //-2为排队中
            initSession(global).then(function(value, promise) {
                if (!value) {
                    value = [];
                }
                var now = new Date();
                var obj = {
                    "date": DateUtil.formatDate(now),
                    "content": [{
                        // 'senderType' : (!!word) ? 2 : 1,
                        'senderType': curStatus ? 1 : (!!word) ? 2 : 1,
                        't': +now,
                        'msg': word,
                        'ts': DateUtil.formatDate(now, true),
                        'senderFace': face,
                        'senderName': name
                    }]
                };
                // value.push(obj);//会话进行中不出机器人欢迎语 denzel
                setTimeout(function() {
                    listener.trigger("core.initsession", value);
                }, 0);
                return promise;
            });

        };
        /**
         * 客服已离线
         */
        var serverOffline = function(ret, init) {
            if (init) {
                initHumanSession(null, ret);
                setTimeout(function() {
                    //msgflag,0开启，1关闭
                    if (!global.urlParams.msgflag) {
                        ret.content = global.urlParams.adminNonelineTitle + leaveMessageStr;
                    } else {
                        ret.content = global.urlParams.adminNonelineTitle;
                    }
                    //ret.content = global.urlParams.adminNonelineTitle + leaveMessageStr;
                    listener.trigger("core.system", {
                        'type': 'system',
                        'status': 'offline',
                        'data': ret
                    });
                }, 1);
            } else {
                //msgflag,0开启，1关闭
                if (!global.urlParams.msgflag) {
                    ret.content = global.urlParams.adminNonelineTitle + leaveMessageStr;
                } else {
                    ret.content = global.urlParams.adminNonelineTitle;
                }
                //ret.content = global.urlParams.adminNonelineTitle + leaveMessageStr;
                listener.trigger("core.system", {
                    'type': 'system',
                    'status': 'offline',
                    'data': ret
                });
            }
            setCurrentState.setCurrentState('robot');
        };

        var queueWait = function(ret, init) {
            var str = language['L10004'].replace("{0}", ret.count);
            queueing = true;
            if (!tempManager) {
                tempManager = socketFactory(ret, global);
                tempManager.start();
            }

            if (manager) {
                manager.destroy();
            }
            manager = new Robot(global);
            if (init) {
                initHumanSession(null, ret);
                //console.log(global);

                setTimeout(function() {
                    //msgflag,0开启，1关闭
                    if (!global.urlParams.msgflag) {
                        ret.content = str + " " + leaveMessageStr;
                    } else {
                        ret.content = str;
                    }

                    listener.trigger("core.system", {
                        'type': 'system',
                        'status': "queue",
                        'data': ret
                    });
                }, 1);
            } else {
                //msgflag,0开启，1关闭
                if (!global.urlParams.msgflag) {
                    ret.content = str + " " + leaveMessageStr;
                } else {
                    ret.content = str;
                }
                listener.trigger("core.system", {
                    'type': 'system',
                    'status': "queue",
                    'data': ret
                });
            }
            setCurrentState.setCurrentState("robot");
        };

        var transferHumanSucess = function(ret, init) {
            if (manager) {
                manager.destroy();
            }
            if (window.parent && window.postMessage && global.urlParams.from == 'iframe') {
                window.parent.postMessage(JSON.stringify({
                    'name': 'manual',
                    'status': 'success'
                }), "*");
            }
            queueing = false;
            if (window.parent && window.postMessage) {
                window.parent.postMessage(JSON.stringify({
                    'type': 'manual',
                    'status': 'success'
                }), "*");
            }
            manager = socketFactory(ret, global);
            manager.start();
            setCurrentState.setCurrentState('human');
            if (ret.adminHelloWord) {
                global.urlParams.adminHelloWord = ret.adminHelloWord;
            };
            if (init) {
                initHumanSession(global.urlParams.adminHelloWord, ret);
                listener.trigger("core.transfersuccess", {
                    'data': ret
                });
            } else {
                listener.trigger("core.system", {
                    'type': 'system',
                    'status': "transfer",
                    'data': {
                        'content': language['L10002'].replace("{0}", ret.aname)
                    }
                });
                listener.trigger("core.transfersuccess", {
                    'data': ret
                });
                ret.content = global.urlParams.adminHelloWord;
                listener.trigger("core.system", {
                    'type': 'human',
                    'data': ret
                });
            }

            listener.trigger("core.buttonchange", {
                'type': 'transfer',
                'action': 'hide'
            });
        };

        var blackListCallback = function(ret, init) {
            //ret.content = language['L10001'] + ' ' + leaveMessageStr;
            //msgflag,0开启，1关闭
            if (!global.urlParams.msgflag) {
                ret.content = language['L10001'] + ' ' + leaveMessageStr;
            } else {
                ret.content = language['L10001'];
            }
            listener.trigger("core.system", {
                'type': 'system',
                'status': 'blacklist',
                'data': ret
            });
            if (init) {
                initRobotSession();
            }
        };
        /**
         *
         * @param {Object} init 是通过事件点击触发，还是自动触发
         */
        var transferBtnClickHandler = function(evt, init) {
            var init = !!init;
            transfer(global, null, queueing).then(function(groupId, promise) {
                var way;
                if (tempManager) {
                    way = tempManager.type == 'websocket' ? 8 : 1;
                } else {
                    way = 1;
                }
                //判断是否是主动邀请的转人工
                var urlParams = global.urlParams;
                var url = '/chat/user/chatconnect.action';
                var reqParams = {
                    'sysNum': global.sysNum,
                    'uid': global.apiInit.uid,
                    'chooseAdminId': global.urlParams.aid || '',
                    'tranFlag': global.urlParams.tranFlag,
                    'way': way,
                    'current': queueing,
                    'groupId': groupId || ''
                };
                if (urlParams.autoManual && urlParams.aid) {
                    url = '/chat/user/invite.action';
                    reqParams.aid = urlParams.aid;
                }
                $ajax({
                    'url': url,
                    'type': 'post',
                    'dataType': 'json',
                    'data': reqParams,
                    'success': function(ret) {
                        if (ret.status == -1) {
                            listener.trigger("core.sessionclose", 7);
                            return;
                        }
                        count++;
                        if (count > 6) {
                            return;
                        }
                        global.urlParams.leaveMsgGroupId = groupId;
                        //[0:排队，2：无客服在线，3：黑名单或机器人超时下线，1：成功]
                        if (ret.status == 2) {
                            serverOffline(ret, init);
                            //暂无客服在线
                        } else if (ret.status == 0) {
                            //排队
                            queueWait(ret, init);
                        } else if (ret.status == 1) {
                            transferHumanSucess(ret, init);
                        } else if (ret.status == 3) {
                            //机器人超时下线
                            listener.trigger("core.sessionclose", 7);
                            blackListCallback(ret, init);
                        } else if (ret.status == 6) {
                            delete global.urlParams.aid;
                            listener.trigger("core.grouplist");
                        } else if (ret.status == 7) {
                            ret.content = ret.msg;
                            listener.trigger("core.system", {
                                "type": "system",
                                "status": "queue",
                                "data": ret
                            });
                        }
                    },
                    'fail': function() {}
                });

            }, function() {

            });

        };

        var initRobotSession = function(value, promise) {
            if (!value) {
                value = [];
            }
            var now = new Date();
            var obj = {
                "date": DateUtil.formatDate(now),
                "content": [{
                    'senderType': 1,
                    't': +now,
                    'msg': global.urlParams.robotHelloWord,
                    'ts': DateUtil.formatDate(now, true),
                    'senderFace': global.apiConfig.robotLogo,
                    'senderName': global.apiConfig.robotName
                }]
            };
            // value.push(obj);//会话进行中不出机器人欢迎语 denzel
            setTimeout(function() {
                listener.trigger("core.initsession", value);
            }, 0);
            manager = new Robot(global);
            setCurrentState.setCurrentState('robot');
        };
        var onReceive = function(data) {
            var list = data.list || [];
            for (var i = 0,
                     len = list.length; i < len; i++) {
                var item = list[i];
                var ret = item;
                if (item.type === 200) {
                    if (manager && tempManager) {
                        manager.destroy();
                        manager = tempManager;
                        tempManager = null;
                    }

                    setCurrentState.setCurrentState('human');
                    listener.trigger("core.system", {
                        'type': 'system',
                        'status': "transfer",
                        'data': {
                            'content': language['L10002'].replace("{0}", ret.aname)
                        }
                    });
                    if (ret.serviceInfo.adminHelloWord) {
                        global.urlParams.adminHelloWord = ret.serviceInfo.adminHelloWord;
                    }
                    ret.content = global.urlParams.adminHelloWord;
                    listener.trigger("core.system", {
                        'type': 'human',
                        'data': ret
                    });
                    listener.trigger("core.buttonchange", {
                        'type': 'transfer',
                        'action': 'hide'
                    });
                    break;
                }
            }
        };
        var bindListener = function() {
            listener.on("sendArea.artificial", transferBtnClickHandler);
            listener.on("core.onreceive", onReceive);
        };

        var initPlugins = function() {
            listener.trigger("core.buttonchange", {
                'type': 'transfer',
                'action': 'show'
            });
            var status = global.apiInit.ustatus;
            //首先发送机器人欢迎语
            //queueing == status == -2;
            // 0 没有会话保持 1 转人工成功 -2 表示正在排队 -1 会话已结束
            // console.log(status);
            if (status == 0) {
                manager = new Robot(global);
                getWelcome();
                setCurrentState.setCurrentState('robot');
            } else {
                if (status == 1 || status == -2) {
                    transferBtnClickHandler(null, true);
                } else if (status == -1) {
                    initSession(global).then(initRobotSession);
                }
            }

        };

        var init = function() {
            parseDOM();
            bindListener();
            initPlugins();
        };

        init();
    };

    module.exports = RobotFirst;
},{"../socket/robot.js":21,"../socket/rolling.js":22,"../socket/socketfactory.js":23,"../socket/websocket.js":24,"../util/date.js":25,"../util/listener.js":29,"../util/monitAjax.js":30,"../util/promise.js":31,"./currentState.js":9,"./initsession.js":12,"./transfer.js":19}],17:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    var RobotFirst = function(global) {
        var listener = require("../util/listener.js");
        var Promise = require('../util/promise.js');
        var DateUtil = require('../util/date.js');
        var Robot = require('../socket/robot.js');
        var modeState = require('./currentState.js');
        var WebSocket = require('../socket/websocket.js');
        var Rolling = require('../socket/rolling.js');
        var transfer = require('./transfer.js');
        var initSession = require('./initsession.js');
        var leaveMessageStr = global.apiConfig.leaveMsg;
        var socketFactory = require('../socket/socketfactory.js');
        var $ajax = require("../util/monitAjax.js")(global);
        var language = global.language.lan;
        var _self = this;
        var manager, tempManager;
        var queueing = false;
        var serverOffline = function(ret, init, value) {
            if (manager) {
                manager.destroy();
            }
            ret.content = language['L10027'] + ' ' + leaveMessageStr;
            listener.trigger("core.buttonchange", {
                'type': 'transfer',
                'action': 'hide',
                'data': ret
            });
            if (init) {
                setTimeout(function() {
                    listener.trigger("core.sessionclose", -1);
                }, 1);
            } else {
                listener.trigger("core.sessionclose", -1);
            }
        };

        var initHumanSession = function(value, ret, word) {
            var success = !!word;
            var face = (!!word) ? ret.aface : global.apiConfig.robotLogo;
            var name = (!!word) ? ret.aname : global.apiConfig.robotName;
            var word = word || global.urlParams.robotHelloWord;
            var curStatus = global.apiInit.ustatus == -2 ? 1 : 0;
            //-2为排队中
            if (!value) {
                value = [];
            }
            var now = new Date();
            var obj = {
                "date": DateUtil.formatDate(now),
                "content": [{
                    // 'senderType' : (!!word) ? 2 : 1,
                    'senderType': curStatus ? 1 : (!!word) ? 2 : 1,
                    't': +now,
                    'msg': word,
                    'ts': DateUtil.formatDate(now, true),
                    'senderFace': face,
                    'senderName': name
                }]
            };
            value.push(obj);
            setTimeout(function() {
                listener.trigger("core.initsession", value);
            }, 0);
        };
        var blackListCallback = function(ret, init) {
            //msgflag,0开启，1关闭
            if (!global.urlParams.msgflag) {
                ret.content = language['L10001'] + ' ' + leaveMessageStr;
            } else {
                ret.content = language['L10001']
            }
            ret.aname = language['L10025'];
            listener.trigger("core.system", {
                'type': 'system',
                'status': 'blacklist',
                'data': ret
            });
            listener.trigger("core.sessionclose", -1);
        };
        var queueWait = function(ret, init, value) {
            var str = language['L10004'].replace("{0}", ret.count);
            queueing = true;
            if (manager) {
                manager.destroy();
            }
            manager = socketFactory(ret, global);
            manager.start();
            if (init) {
                // initHumanSession(value,ret,null);
                setTimeout(function() {
                    //msgflag,0开启，1关闭
                    if (!global.urlParams.msgflag) {
                        ret.content = str + " " + leaveMessageStr;
                    } else {
                        ret.content = str;
                    }
                    ret.aname = language['L10026'];
                    listener.trigger("core.system", {
                        'type': 'system',
                        'status': 'queue',
                        'data': ret
                    });
                    listener.trigger("core.sessionclose", -2);
                }, 1);
            } else {
                //msgflag,0开启，1关闭
                if (!global.urlParams.msgflag) {
                    ret.content = str + " " + leaveMessageStr;
                } else {
                    ret.content = str;
                }
                ret.aname = language['L10026'];
                listener.trigger("core.system", {
                    'type': 'system',
                    'status': 'queue',
                    'data': ret
                });
                listener.trigger("core.sessionclose", -2);
            }
        };

        var getWelcome = function(value, promise) {
            var promise = promise || new Promise();
            initSession(global, promise).then(function(value, promise) {
                if (!value) {
                    value = [];
                }
                var now = new Date();
                var obj = {
                    "date": DateUtil.formatDate(now),
                    "content": [{
                        'senderType': 1,
                        't': +now,
                        'msg': global.urlParams.robotHelloWord,
                        'ts': DateUtil.formatDate(now, true),
                        'senderFace': global.apiConfig.robotLogo,
                        'senderName': global.apiConfig.robotName
                    }]
                };
                value.push(obj);
                setTimeout(function() {
                    listener.trigger("core.initsession", value);
                }, 0);
                return promise;
            });
            return promise;
        };

        var transferFail = function() {
            if (false) {
                var value = [];
                var now = new Date();
                var obj = {
                    "date": DateUtil.formatDate(now),
                    "content": [{
                        'senderType': 1,
                        't': +now,
                        'msg': global.urlParams.robotHelloWord,
                        'ts': DateUtil.formatDate(now, true),
                        'senderFace': global.apiConfig.robotLogo,
                        'senderName': global.apiConfig.robotName
                    }]
                };
                value.push(obj);
                manager = new Robot(global);
                modeState.setCurrentState("robot");
            }
            setTimeout(function() {
                listener.trigger("core.sessionclose", -1);
            }, 0);
        };
        var transferSuccess = function(groupId, promise, init) {
            var init = !!init;
            initSession(global, promise).then(function(value, promise) {
                var way;
                if (tempManager) {
                    way = tempManager.type == 'websocket' ? 8 : 1;
                } else {
                    way = 1;
                }
                //判断是否是主动邀请的转人工
                var urlParams = global.urlParams;
                var url = '/chat/user/chatconnect.action';
                var reqParams = {
                    'sysNum': global.sysNum,
                    'uid': global.apiInit.uid,
                    'chooseAdminId': global.urlParams.aid || '',
                    'tranFlag': global.urlParams.tranFlag,
                    'way': way,
                    'current': queueing,
                    'groupId': groupId || ''
                };
                if (urlParams.autoManual && urlParams.aid) {
                    url = '/chat/user/invite.action';
                    reqParams.aid = urlParams.aid;
                }
                $ajax({
                    'url': url,
                    'type': 'post',
                    'dataType': 'json',
                    'data': reqParams,
                    'success': function(ret) {
                        if (ret.status == -1) {
                            listener.trigger("core.sessionclose", 7);
                            return;
                        }
                        //[0:排队，2：无客服在线，3：黑名单或机器人超时下线，1：成功]
                        if (ret.status == 2) {
                            //暂无客服在线
                            serverOffline(ret, init, value);

                        } else if (ret.status == 0) {
                            //排队
                            // console.log(ret,0);
                            global.urlParams.groupId = groupId;
                            queueWait(ret, init, value);
                        } else if (ret.status == 1) {
                            if (window.parent && window.postMessage && global.urlParams.from == 'iframe') {
                                window.parent.postMessage(JSON.stringify({
                                    'name': 'manual',
                                    'status': 'success'
                                }), "*");
                            }
                            if (init) {
                                initHumanSession(value, ret, global.urlParams.adminHelloWord);
                                listener.trigger("core.transfersuccess", {
                                    'data': ret
                                });
                            } else {
                                listener.trigger("core.system", {
                                    'type': 'system',
                                    'status': "transfer",
                                    'data': {
                                        'content': language['L10002'].replace("{0}", ret.aname)
                                    }
                                });
                                listener.trigger("core.transfersuccess", {
                                    'data': ret
                                });
                                ret.content = global.urlParams.adminHelloWord;
                                listener.trigger("core.system", {
                                    'type': 'human',
                                    'status': "transfer",
                                    'data': ret
                                });
                            }
                            if (manager) {
                                manager.destroy();
                            }
                            manager = socketFactory(ret, global);
                            modeState.setCurrentState("human");
                            manager.start();
                            if (window.parent && window.postMessage) {
                                window.parent.postMessage(JSON.stringify({
                                    'type': 'manual',
                                    'status': 'success'
                                }), "*");
                            }
                            listener.trigger("core.buttonchange", {
                                'type': 'transfer',
                                'action': 'hide'
                            });
                        } else if (ret.status == 3) {
                            listener.trigger("core.sessionclose", 7);
                            blackListCallback(ret, init);
                        } else if (ret.status == 6) {
                            delete global.urlParams.aid;
                            listener.trigger("core.grouplist");
                        }
                    },
                    'fail': function() {}
                });
            });

        };

        var transferConnect = function(value, promise, init) {
            var init = !!init;
            var promise = new Promise();
            transfer(global, promise, queueing).then(function() {
                transferSuccess(null, null, init);
            }, transferFail);
            return promise;

        };

        var initRobotSession = function(value, promise) {
            if (!value) {
                value = [];
            }
            var now = new Date();
            var obj = {
                "date": DateUtil.formatDate(now),
                "content": [{
                    'senderType': 1,
                    't': +now,
                    'msg': global.urlParams.robotHelloWord,
                    'ts': DateUtil.formatDate(now, true),
                    'senderFace': global.apiConfig.robotLogo,
                    'senderName': global.apiConfig.robotName
                }]
            };
            // value.push(obj);
            setTimeout(function() {
                listener.trigger("core.initsession", value);
            }, 0);
        };

        var parseDOM = function() {};

        var bindListener = function() {};

        var initPlugins = function() {
            var status = global.apiInit.ustatus;
            //首先发送机器人欢迎语
            if (status == 0) {
                setTimeout(function() {
                    listener.trigger("core.buttonchange", {
                        'type': 'transfer',
                        'action': 'hide'
                    });
                }, 5);
                manager = new Robot(global);
                modeState.setCurrentState("robot");
                getWelcome();
            } else if (status == -1) {
                setTimeout(function() {
                    listener.trigger("core.buttonchange", {
                        'type': 'transfer',
                        'action': 'hide'
                    });
                }, 5);
                manager = new Robot(global);
                modeState.setCurrentState("robot");
                initSession(global).then(initRobotSession);
            } else {
                transferConnect(null, null, true);
            }
        };

        var init = function() {
            parseDOM();
            bindListener();
            initPlugins();
        };

        init();

    };

    module.exports = RobotFirst;
},{"../socket/robot.js":21,"../socket/rolling.js":22,"../socket/socketfactory.js":23,"../socket/websocket.js":24,"../util/date.js":25,"../util/listener.js":29,"../util/monitAjax.js":30,"../util/promise.js":31,"./currentState.js":9,"./initsession.js":12,"./transfer.js":19}],18:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    var that = {};
    var groupTemplate = '<div class="shadow-layer">'+
        '<div class="group-outer">'+
        '<div class="group-title">'+
        '{{= it.languageText.T0010}}'+
        '</div>'+
        '<div class="group-main">'+
        '<ul class="clearfix">'+
        '{{  for(var i=0;i<it.list.length;i++){ }}'+
        '{{ var item = it.list[i];}}'+
        '<li class="js-item" data-id="{{=item.groupId}}">'+
        '{{=item.recGroupName}}'+
        '</li>'+
        '{{  } }}'+
        '</ul>'+
        '</div>'+
        '<div class="group-footer js-cancel-btn">'+
        '{{=it.languageText.T0000}}'+
        '</div>'+
        '</div>'+
        '</div>'+
        '';
    var groupTemplatePC = '<div class="group-layer js-group-layer"></div>'+
        '<div class="group-outer js-group-outer">'+
        '<p class="group-title">'+
        '{{= it.languageText.T0010}}'+
        '<span class="close_button js-cancel-btn js-group-cancel"></span>'+
        '</p>'+
        '<div class="group-main">'+
        '<ul class="clearfix">'+
        '{{  for(var i=0;i<it.list.length;i++){ }}'+
        '{{ var item = it.list[i];}}'+
        '<li class="js-item" data-id="{{=item.groupId}}">'+
        '{{=item.recGroupName}}'+
        '</li>'+
        '{{  } }}'+
        '</ul>'+
        '</div>'+
        '<div class="group-footer">'+
        '<p class="group-commit js-group-commit">{{=it.languageText.T0038}}</p>'+
        '</div>'+
        '</div>'+
        '';
    that.groupTemplate =groupTemplate;
    that.groupTemplatePC =groupTemplatePC;
    module.exports = that;

},{}],19:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    function transfer(global, promise, queueing) {
        var Promise = require('../util/promise.js');
        var promise = promise || new Promise();
        var template = require('./template.js');
        var language = global.language.lan;
        var languageText = global.language.text;
        var layer;
        var isMobile = window.navigator.userAgent.indexOf("Mobile") >= 0;
        var $ajax = require("../util/monitAjax.js")(global);
        var h5ChatShowGroups = function(ret) {
            var _html = doT.template(template.groupTemplate)({
                'list': ret,
                'languageText': languageText
            });
            var layer = $(_html);
            $(".js-wrapBox").append(layer);
            layer.delegate(".js-item", 'click', function(e) {
                var elm = e.currentTarget;
                var groupId = $(elm).attr("data-id");
                promise.resolve(groupId);
                layer.remove();
            });
            layer.find(".js-cancel-btn").on("click", function() {
                promise.reject();
                layer.remove();
            });
            //分组颜色
            $('.js-item').css('background-color', global.apiConfig.color);
            $('.js-cancel-btn').css('color', global.apiConfig.color);
        };
        var pcChatShowGroups = function(ret) {
            var color = global.apiConfig.color;
            var _html = doT.template(template.groupTemplatePC)({
                'list': ret,
                'languageText': languageText
            });
            var layer = $(_html);
            $(".js-mainBox").append(layer);
            $(".js-group-outer").animate({ right: '0' });
            var $outer = $(".js-group-outer");
            $outer.click(function() {

            })
            $outer.delegate(".js-item", 'click', function(e) {
                var elm = e.currentTarget;
                var groupId = $(elm).attr("data-id");
                $(elm).css({
                    'border-color': color,
                    'color': color
                }).siblings().css({
                    'border-color': '',
                    'color': ''
                })
                $(".js-group-commit").attr("data-id", groupId).css({ "background": global.apiConfig.color, "color": "#fff" });
                e.stopPropagation();
            });
            //仅人工模式下点取消结束会话
            layer.delegate(".js-cancel-btn", 'click', function(e) {
                promise.reject();
                $(".js-group-outer").animate({ right: '-390px' }, function() {
                    layer.remove();
                });
            });
            layer.on('click', function(e) {

                //promise.reject();
                //layer.remove();
            });
            //鼠标滑过事件做不了
            /*layer.delegate(".js-item",'hover', function(e) {
             $(this).css({"border":"1px solid "+global.apiConfig.color,"color":global.apiConfig.color})
             .siblings().css({"border":"1px solid #e0e9e8","color":"#555556"});
             });*/
            layer.delegate(".js-group-commit", 'click', function(e) {
                var elm = e.currentTarget;
                e.stopPropagation();
                var groupId = $(elm).attr("data-id") || "";
                if (groupId) {
                    promise.resolve(groupId);
                    layer.remove();
                }
            });
            $(".js-cancel-btn").on("click", function() {
                $(".js-group-outer").animate({ right: '-390px' }, function() {
                    layer.remove();
                });
            });
            $(".js-group-layer").on("click", function() {
                $(".js-group-outer").animate({ right: '-390px' }, function() {
                    promise.reject();
                    layer.remove();
                });
            });
            /*  $(".js-mainBox").delegate(".js-item", "click", function(){
             $(this).css({"border":"1px solid"+color,"color":color}).siblings().css({"border":"1px solid #e0e9e8","color":"#555556"})
             })*/

        };

        var init = function() {
            var groupId = global.urlParams.groupId || '';
            var urlParams = global.urlParams;

            if (urlParams.aid && typeof urlParams.tranFlag == 'number') {
                setTimeout(function() {
                    promise.resolve(groupId);
                }, 0);
            } else if (urlParams.autoManual && urlParams.aid) {
                //如果是主动邀请的，则不需要选择分类
                setTimeout(function() {
                    promise.resolve(groupId);
                }, 0);
            } else if (global.apiInit.ustatus !== 0 && global.apiInit.ustatus !== -1) {
                //存在会话保持
                setTimeout(function() {
                    promise.resolve(groupId);
                }, 0);
            } else if (queueing) {
                //正在排队
                setTimeout(function() {
                    promise.resolve(groupId);
                }, 0);
            } else if (global.apiConfig.groupflag === 0) {
                setTimeout(function() {
                    promise.resolve(groupId);
                }, 0);
            } else if (global.urlParams.groupId && global.urlParams.groupId.length) {
                //参数中配置了groupId
                setTimeout(function() {
                    promise.resolve(groupId);
                }, 0);
            } else {
                $ajax({
                    'url': '/chat/user/getGroupList.action',
                    'dataType': 'json',
                    'type': 'get',
                    'data': {
                        'companyId': global.apiInit.pid,
                        'source': global.userInfo.source
                    },
                    'success': function(ret) {
                        if (ret.length == 1) {
                            var item = ret[0];
                            promise.resolve(item.groupId);
                        }else if(ret.length == 0){
                            promise.resolve(groupId);
                        } else {
                            if (global.pageType === "pc") {
                                pcChatShowGroups(ret);
                            } else {
                                h5ChatShowGroups(ret);
                            }

                        }
                    },
                    'fail': function() {}
                });
            }
        };

        init();

        return promise;
    }

    module.exports = transfer;

},{"../util/monitAjax.js":30,"../util/promise.js":31,"./template.js":18}],20:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    var listener = require('../util/listener.js');
    var currentStatusFun = require("../mode/currentState.js");
    var socketFactory = require("./socketfactory.js");

    function HearBeat(global) {
        var timer;
        var DURATION = 20 * 1000;
        var timer;
        var $ajax = require("../util/monitAjax.js")(global);
        listener.on("core.sessionclose", function(data) {
            if (data !== -2 && data !== -3) {
                clearInterval(timer);
            }
        });
        var start = function() {
            $ajax({
                'url': '/chat/user/msgt.action',
                'type': 'post',
                'dataType': 'json',
                'data': {
                    'uid': global.apiInit.uid,
                    'pid': global.apiInit.pid
                },
                'success': function(ret) {
                    if (ret && ret.ustatus == 0 && currentStatusFun.getCurrentState() == 'human') {
                        listener.trigger("core.sessionclose", 4);
                    }
                    var isReady = socketFactory.isReady();
                    if (isReady) {
                        var socketType = socketFactory().getType() === 'rolling' ? 1 : 8;
                        if (socketType !== ret.way) {
                            listener.trigger("core.sessionclose", 4);
                        }
                    }
                },
                'error': function(ret) {
                    var img = new Image();
                    img.src = "images/static/errorlog.png?t=" + (+new Date()) + "&response=" + encodeURIComponent(ret.response) + "&status=" + ret.status + "&statusText=" + encodeURIComponent(ret.statusText) + "&timeout=" + ret.timeout + "&from=heartbeat_user";
                }
            });
        };
        setTimeout(function() {
            start();
            timer = setInterval(start, DURATION);
        }, DURATION);

    }

    module.exports = HearBeat;
},{"../mode/currentState.js":9,"../util/listener.js":29,"../util/monitAjax.js":30,"./socketfactory.js":23}],21:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    function Robot(global) {
        var _self = this;
        var listener = require('../util/listener.js');
        var socketType = 'robot';
        var question = false;
        var $ajax = require("../util/monitAjax.js")(global);
        var errorlogFun = require("../util/errorlog.js");
        var DIRECT_SEND = 1,
            SUGGESTION_SEND = 2;
        // var firstMsgTime=0;
        var parseDOM = function() {};

        var createToken = function(data) {
            return data.uid + "" + data.date;
        };

        var onSuggestionSend = function(args) {

        };

        var onsend = function(args) {
            var data = args[0];
            if (data.currentStatus !== 'robot') {
                return;
            }
            var token = createToken(data);
            var content = data.answer.replace(/(^\s+|\s+$)/g, '');
            if (!/^\d+$/.test(content)) {
                question = false;
            }
            if (data.requestType == 'question') {
                question = true;
            }
            // if(!firstMsgTime){
            //      firstMsgTime=+new Date();
            //      console.log("第一条消息time:"+firstMsgTime);
            //      listener.trigger("core.firstMsgTime", firstMsgTime);
            // }
            if (!data.answer) {
                //记录异常情况
                errorlogFun.specialError("question_blank", 'common_robot', data, global);
            }
            $ajax({
                'url': '/chat/user/robotsend.action',
                'data': 'type',
                'data': {
                    'requestText': JSON.stringify(data.requestText) || data.answer,
                    'question':(typeof data.multiDiaQuestion=='object'?JSON.stringify(data.multiDiaQuestion):data.multiDiaQuestion)||data.answer,
                    'sysNum': global.sysNum,
                    'uid': global.apiInit.uid,
                    'cid': global.apiInit.cid,
                    'source': global.userInfo.source,
                    'questionFlag': data.questionFlag===2? data.questionFlag:(question ? 1 : 0),
                    'lanFlag': global.urlParams.lanFlag || 0,
                    'robotFlag': global.urlParams.robotFlag || ''
                },
                'type': 'post',
                'success': function(ret) {
                    //var item = JSON.parse(ret);
                    var item =typeof ret ==='object'? ret : JSON.parse(ret);
                    if (item.answerType == 4) {
                        question = true;
                    }
                    listener.trigger("core.onreceive", {
                        'list': [item],
                        'type': socketType
                    });
                    listener.trigger("core.msgresult", {
                        'msgId': data.dateuid,
                        'result': 'success'
                    });
                    //机器人自动结束会话
                    if (item.ustatus === 0) {
                        listener.trigger("core.sessionclose", 8);
                    }
                },
                'error': function(ret) {
                    listener.trigger("core.msgresult", {
                        'msgId': data.dateuid,
                        'result': 'fail'
                    });
                }
            });
            question = false;
        };

        var destroy = function() {
            listener.off("sendArea.send", onsend);
        };

        var bindListener = function() {
            listener.on("sendArea.send", onsend);
            listener.on("sendArea.sendSugguestions", onsend);
            listener.on("multiConv.send",onsend);//多轮会话
        };
        var init = function() {
            parseDOM();
            bindListener();
        };

        this.destroy = destroy;

        init();
    };

    module.exports = Robot;
},{"../util/errorlog.js":26,"../util/listener.js":29,"../util/monitAjax.js":30}],22:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    var HearBeat = require("./heartbeat.js");

    function Rolling(puid, pu, global) {
        this.puid = puid;
        var listener = require('../util/listener.js');
        var $ajax = require("../util/monitAjax.js")(global);
        var errorlogFun = require("../util/errorlog.js");
        var socketType = 'human';
        var timer;
        var ROLE_USER = 0;
        var messageCache = {};
        var language = global.language.lan;
        var _self = this;
        var onSend = function(args, retry) {
            var retry = retry || 0;
            var data = args[0];
            if (data.currentStatus !== 'human') {
                return;
            }
            if (!data.date) {
                data.ts = +new Date();
            } else {
                data.ts = data.date;
            }
            $ajax({
                'url': '/chat/user/chatsend.action',
                'data': {
                    'puid': puid,
                    'cid': data.cid,
                    'uid': data.uid,
                    'content': data.answer
                },
                'dataType': 'json',
                'type': "POST",
                'success': function(ret) {
                    listener.trigger("core.msgresult", {
                        'msgId': data.dateuid,
                        'result': 'success'
                    });
                },
                'error': function(ret) {
                    if (retry >= 3) {
                        listener.trigger("core.msgresult", {
                            'msgId': data.dateuid,
                            'result': 'fail'
                        });
                    } else {
                        setTimeout(function() {
                            onSend([data], retry + 1);
                        }, 1000);
                    }
                }
            });
        };

        var destroy = function() {
            clearInterval(timer);
        };

        var messageConfirm = function(list) {
            var arr = [];
            for (var i = 0,
                     len = list.length; i < len; i++) {
                var item = list[i];
                var obj = {
                    'type': 300,
                    'utype': ROLE_USER,
                    'cid': item.cid,
                    'uid': item.uid,
                    'msgId': item.msgId
                };
                arr.push(obj);
            }
            if (arr.length <= 0 || !JSON.stringify)
                return;
            $ajax({
                'url': '/chat/user/msg/ack.action',
                'dataType': 'json',
                'data': {
                    'content': JSON.stringify(arr),
                    'tnk': +new Date()
                },
                'type': 'POST'
            });
        };

        var getMessage = function() {
            $ajax({
                'url': '/chat/user/msg.action',
                'dataType': 'json',
                'data': {
                    'puid': puid,
                    'uid': global.apiInit.uid,
                    "token": +new Date()

                },
                'type': "get",
                success: function(ret) {
                    if (ret && ret.length) {
                        try {
                            var arr = [];
                            var messageArr = [];
                            for (var i = 0; i < ret.length; i++) {
                                var item = JSON.parse(ret[i]);

                                if (!item.msgId) {
                                    item.msgId = (+new Date()) + Math.random().toString(36).substr(2) + item.type;
                                }
                                if (messageCache[item.msgId]) {
                                    continue;
                                }
                                messageCache[item.msgId] = true;

                                arr.push(item);
                                if (item.type === 202) {
                                    messageArr.push(item);
                                }
                                if (item.type === 204) {
                                    var str = language['L10028'].replace("{0}", item.aname);
                                    listener.trigger("core.sessionclose", item.status);
                                    if (item.status == 2 || item.status == 4) {
                                        listener.trigger("core.system", {
                                            'type': 'system',
                                            'status': 'kickout',
                                            'data': {
                                                // 'content': "您与客服" + item.aname + "的会话已经关闭"
                                                'content': str
                                            }
                                        });
                                    }
                                }
                            }
                            if (window.parent && global.urlParams.from === 'iframe' && messageArr.length > 0 && window.postMessage) {
                                window.parent.postMessage(JSON.stringify({
                                    'name': "zhichiReceive",
                                    'data': messageArr
                                }), "*");
                            }
                            messageConfirm(arr);
                            listener.trigger("core.onreceive", {
                                'type': socketType,
                                'list': arr
                            });
                        } catch (e) {
                            // console.log(e);
                            errorlogFun.runtimeError(e, 'onreceive.rolling', {
                                'type': socketType,
                                'list': arr
                            }, global);
                        }
                    }
                },
                error: function(ret, err) {
                    var img = new Image();
                    img.src = "images/static/errorlog.png?t=" + (+new Date()) + "&e=" + encodeURIComponent(err) + "&reponse=" + ret.responseText + "&uid=" + global.apiInit.uid;
                }
            });
            //timer = setTimeout(getMessage, 1500);
        };

        var bindListener = function() {
            listener.on("sendArea.send", onSend);
        };


        var initPlugins = function() {
            //getMessage();
            setInterval(getMessage, 1500);
            HearBeat(global);
        };
        var init = function() {
            bindListener();
            initPlugins();
        };
        init();
        this.getType = function() {
            return _self.type;
        }
        this.type = "rolling";
        this.destroy = destroy;
        this.start = getMessage;
    }

    module.exports = Rolling;
},{"../util/errorlog.js":26,"../util/listener.js":29,"../util/monitAjax.js":30,"./heartbeat.js":20}],23:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    var manager = null;
    var TIME_LIMIE = 5 * 1000 * 60;
    var isReady = false;
    var socketFactory = function(ret, global) {
        if (!!manager) {
            return manager;
        }
        var socketError = +new Date();
        if (window.localStorage) {
            socketError = +window.localStorage.getItem("websocketerror");
        }
        var websocketOk = true;
        if (socketError) {
            websocketOk = (+new Date() - socketError) > TIME_LIMIE;
        }
        var WebSocket = require('../socket/websocket.js');
        var Rolling = require('../socket/rolling.js');
        var urlList = ret['wslink.bak'];
        urlList.push(ret['wslink.default']);
        var url = ret['wslink.default'];
        if (window.WebSocket && websocketOk && (url.indexOf("ws:") >= 0 || url.indexOf("wss:") >= 0)) {
            manager = new WebSocket(ret.puid, urlList, url, global);
        } else {
            manager = new Rolling(ret.puid, ret['wslink.default'], global);
        }
        isReady = true;
        return manager;
    };
    socketFactory.isReady = function() {
        return isReady;
    }
    module.exports = socketFactory;
},{"../socket/rolling.js":22,"../socket/websocket.js":24}],24:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    var HearBeat = require("./heartbeat.js");

    function ZcWebSocket(puid, urlList, url, global) {
        this.puid = puid;
        var index = Math.floor(Math.random() * urlList.length);
        var socketType = 'human';
        var messageCache = {};
        var listener = require('../util/listener.js');
        var errorLogFun = require("../util/errorlog.js");
        var dateUtil = require('../util/date.js');
        var websocket;
        var CLOSE_DURATION = 1000 * 15;
        var SOCKET_TYPE_WEBSOCKET = 8;
        var timer, closeTimer;
        var language = global.language.lan;
        var _self = this;
        this.channelId = Math.random().toString(32).substr(2);
        //被踢下线
        var kickout = false;
        var connRetryTime = 0,
            sendCount = 0,
            receiveCount = 0;
        var connStartTime = new Date();
        var TIMEOUT_DURATION = 5 * 1000;
        var ROLE_USER = 0;

        var retryList = {};

        var retry = function() {
            var now = +new Date();
            for (var el in retryList) {
                var item = retryList[el];
                if (now - item.sendTime >= TIMEOUT_DURATION) {
                    delete retryList[el];
                    listener.trigger("core.msgresult", {
                        'msgId': item.dateuid,
                        'result': 'fail'
                    });
                }
            }
        };

        var onSend = function(data) {
            var item = data;
            if (Object.prototype.toString.call(data).indexOf("Array") >= 0) {
                item = data[0];
            }
            if (item.currentStatus !== 'human') {
                return;
            }
            var d = !!item.date ? new Date(item.date) : new Date();
            item.t = +d;
            item.ts = dateUtil.formatDate(d, true);
            item.type = 103;
            item.msgId = item['dateuid'];
            item.sendTime = item.date;
            item.channelId = _self.channelId;
            item.content = item.answer;
            item.uname = global.userInfo.uname;
            var $div = $("<div></div>");
            $div.text(item.uname);
            item.uname = $div.html();
            item.face = global.userInfo.face;
            retryList[item.msgId] = item;
            sendCount++;
            websocket.send(JSON.stringify(item));
        };

        var ackConfirmMessageHandler = function(data) {
            listener.trigger("core.msgresult", {
                'msgId': data.msgId,
                'result': 'success'
            });
            delete retryList[data.msgId];
        };

        var commonMessageHandler = function(data) {
            listener.trigger("core.onreceive", {
                'type': socketType,
                'list': [data]
            });
        };
        var systemMessageHandler = function(data) {
            var str = language['L10028'].replace("{0}", data.aname);
            if (data.type == 204) {
                listener.trigger("core.sessionclose", data.status);
                // 2、4、6都算是正常离线，不需要重新连接
                kickout = (data.status % 2 == 0);
                websocket.close();
                if (data.status == 2 || data.status == 4) {
                    listener.trigger("core.system", {
                        'type': 'system',
                        'status': 'kickout',
                        'data': {
                            'content': str
                        }
                    });
                }
            }
            listener.trigger("core.onreceive", {
                'type': socketType,
                'list': [data]
            });
        };

        var messageConfirm = function(data) {
            if (data.type == 301) {
                return;
            }
            var obj = {
                'type': 300,
                'msgId': data.msgId,
                'utype': ROLE_USER,
                'data': [data],
                'channelId': _self.channelId
            };
            try {
                websocket.send(JSON.stringify(obj));
            } catch (e) {

            }
        };



        var onMessage = function(evt) {
            if (evt.data === 'pong') {
                clearTimeout(closeTimer);
                closeTimer = setTimeout(function() {
                    websocket.close();
                }, CLOSE_DURATION);
                return;
            }
            receiveCount++;
            var data = JSON.parse(evt.data);
            if (messageCache[data.msgId + "_" + data.type]) {
                return;
            }
            var arr = [];
            if (data.type === 202) {
                arr.push(data);
            }
            if (window.top && global.urlParams.from === 'iframe' && arr.length > 0) {
                window.top.postMessage(JSON.stringify({
                    'name': "zhichiReceive",
                    'data': arr
                }), "*");
            }
            messageConfirm(data);
            if (!data.msgId) {
                data.msgId = +new Date() + Math.random().toString(36).substr(2) + data.type;
            }
            messageCache[data.msgId + "_" + data.type] = data;
            try {
                if (data.type == 301) {
                    ackConfirmMessageHandler(data);
                } else if (data.type == 202) {
                    commonMessageHandler(data);
                } else {
                    systemMessageHandler(data);
                }
            } catch (e) {
                errorLogFun.runtimeError(e, 'receive.websocket', data, global);
            }
        };

        var reConnect = function() {
            if (connRetryTime++ >= 3) {
                var str = language['L10003'].replace("{0}", '');
                listener.trigger("core.system", {
                    'type': 'system',
                    'status': 'kickout',
                    'data': {
                        // 'content': "与服务器连接中断"
                        'content': str
                    }
                });
                listener.trigger("core.sessionclose", -4);
                return;
            }
            setTimeout(function() {
                var index = Math.floor(Math.random() * urlList.length);
                websocket = new WebSocket(url);
                websocket.onerror = onError;
                websocket.onopen = onOpen;
                websocket.onclose = onClose;
                websocket.onmessage = onMessage;
            }, 5000);
        };
        var onClosed = function(e) {
            // errorLogFun.specialError("websocket.close", 'websocket', {
            //     'wasClean': e.wasClean,
            //     'code': e.code,
            //     'reason': e.reason
            // }, global);
            if (window.localStorage && !kickout) {
                try {
                    window.localStorage.setItem("websocketerror", +new Date());
                } catch (e) {
                    errorLogFun.runtimeError(e, 'localStorage error', data, global);
                }
            }
            if (!kickout) {
                reConnect();
            }
        };

        var onOpen = function() {
            timer = setInterval(function() {
                websocket.send("ping");
            }, 5 * 1000);
            if (window.localStorage) {
                window.localStorage.removeItem("websocketerror")
            }
            var start = {
                "t": ROLE_USER,
                "u": global.apiInit.uid,
                'puid': puid,
                's': global.sysNum,
                'ts': +new Date()
            };
            var count = 0;
            for (var el in retryList) {
                count++;
            }
            connRetryTime = 0;
            websocket.send(JSON.stringify(start));
            for (var el in retryList) {
                var msg = retryList[el];
                websocket.send(JSON.stringify(msg));
            }
            setInterval(retry, 1000);
        };

        var onClose = function(e) {
            onClosed(e);
            clearTimeout(timer);
        };

        var onError = function(e) {
            // errorLogFun.specialError("websocket.close", 'websocket', {
            //     'wasClean': e.wasClean,
            //     'code': e.code,
            //     'reason': e.reason
            // }, global);
        };

        var bindListener = function() {
            websocket.onerror = onError;
            websocket.onopen = onOpen;
            websocket.onclose = onClose;
            websocket.onmessage = onMessage;
            listener.on("sendArea.send", onSend);
        };

        var init = function() {
            bindListener();
        };

        var destroy = function() {
            if (websocket) {
                websocket.close()
                clearTimeout(timer);
            }
        };

        var start = function() {
            websocket = new WebSocket(url);
            init();
            HearBeat(global);
        };



        var stop = function() {};
        this.getType = function() {
            return _self.type;
        }
        this.type = "websocket";
        this.destroy = destroy;
        this.start = start;
        this.stop = stop;
    };

    module.exports = ZcWebSocket;

},{"../util/date.js":25,"../util/errorlog.js":26,"../util/listener.js":29,"./heartbeat.js":20}],25:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    var dateUtil = {};

    var formatNum = function(num) {
        return (num >= 10) ? num + "" : "0" + num;
    };

    var formatTime = function(date) {
        var f = formatNum;
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var arr = [f(hour),f(minutes),f(seconds)];
        return arr.join(":");
    };

    var formatDate = function(date,showTime) {
        var f = formatNum;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var arr = [f(year),f(month),f(day)];
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var arr2 = [f(hour),f(minutes),f(seconds)];
        return arr.join("-") + ( !showTime ? "" : " " + formatTime(date));
    };
    dateUtil.formatTime = formatTime;
    dateUtil.formatDate = formatDate;
    module.exports = dateUtil;

},{}],26:[function(require,module,exports){
    var that = {};
    var globalConfig = require("../config/config.json");
    var detect = require("../lib/detect.js");
    var encode = encodeURIComponent;
    var clientType = !!/Mobile/.test(window.navigator.userAgent) ? 'wap' : 'pc';
    var ua;

    var runtimeError = function(e, from, data, global) {
        var img = new Image();
        var queryString = "error=" + encode(e.toString());
        queryString += "&stack=" + encode(e.stack);
        queryString += "&from=" + from;
        queryString += "&os=" + ua.os.family;
        queryString += "&osVersion=" + ua.os.version;
        queryString += "&browser=" + ua.browser.family;
        queryString += "&browserVersion=" + ua.browser.version;
        queryString += "&type=" + clientType;
        queryString += "&uid=" + global.apiInit.uid;
        queryString += "&data=" + encode(JSON.stringify(data));
        queryString += "&pid=" + global.apiInit.pid;
        img.src = "//" + globalConfig.errorlogPath + "runtime?" + queryString;
    };


    var specialError = function(type, from_type, params, global) {
        var img = new Image();
        var queryStringArr = [];
        $.ajax({
            'url': '//' + globalConfig.errorlogPath + "special",
            'type': 'post',
            'dataType': 'json',
            'data': {
                'errorType': type,
                'from_type': from_type,
                'data': encode(JSON.stringify(params)),
                'pid': global.apiInit.pid,
                'type': clientType
            }
        });
    };


    var overTimeError = function(ret, url, data, time, reqType, global) {
        var img = new Image();
        var queryStringArr = [];
        queryStringArr.push("url=" + encode(url));
        queryStringArr.push("data=" + encode(JSON.stringify(data)));
        queryStringArr.push("pid=" + global.apiInit.pid);
        queryStringArr.push("duration=" + encode(time));
        queryStringArr.push("uid=" + encode(global.apiInit.uid));
        queryStringArr.push("type=" + clientType);
        queryStringArr.push("reqType=" + reqType);
        var queryString = queryStringArr.join("&");
        img.src = "//" + globalConfig.errorlogPath + "overtime?" + queryString;
    };

    var networkError = function(ret, url, data, reqType, global) {
        var img = new Image();
        var queryStringArr = [];
        queryStringArr.push("status=" + ret.status);
        queryStringArr.push("statusText=" + ret.statusText);
        queryStringArr.push("url=" + encode(url));
        queryStringArr.push("data=" + encode(JSON.stringify(data)));
        queryStringArr.push("pid=" + global.apiInit.pid);
        queryStringArr.push("responseText=" + encode(ret.responseText));
        queryStringArr.push("type=" + clientType);
        queryStringArr.push("uid=" + encode(global.apiInit.uid));
        queryStringArr.push("reqType=" + reqType);
        var queryString = queryStringArr.join("&");
        img.src = "//" + globalConfig.errorlogPath + "network?" + queryString;
    };
    (function() {
        var userAgent = window.navigator.userAgent;
        ua = detect.parse(userAgent);

    })();
    that.networkError = networkError;
    that.runtimeError = runtimeError;
    that.overTimeError = overTimeError;
    that.specialError = specialError;
    that.init = function() {};
    that.getFlag = function() {
        return false;
    }
    module.exports = that;

},{"../config/config.json":2,"../lib/detect.js":5}],27:[function(require,module,exports){
    function format(obj, depth) {
        var depth = depth || 0;
        var TAB = 4;
        if (typeof obj !== 'object') {
            throw 'not a json';
        }
        var type = Object.prototype.toString.call(obj);
        var str = '';
        if (/Array/.test(type)) {
            str = '[';
            var arr = [];
            for (var i = 0; i < obj.length; i++) {
                var item = obj[i];

                if (typeof item === 'object') {
                    try {
                        arr.push(format(item, depth));
                    } catch (e) {
                        continue;
                    }
                } else {
                    arr.push(item.toString());
                }
            }
            return str + arr.join(", ") + "]";
        } else if (/Object/.test(type)) {
            var tab = '',
                curTab = '';
            var arr = [],
                s;

            str = "{";
            var index = 0;
            for (var el in obj) {
                if (!obj.hasOwnProperty(el)) {
                    continue;
                }
                if (typeof obj[el] === 'number') {
                    s = "";
                    if (index > 0) {
                        s += ",";
                    }
                    s += "\"" + el + '":' + obj[el];
                    arr.push(s);
                } else if (typeof obj[el] === 'boolean') {
                    s = '';
                    if (index > 0) {
                        s += ",";
                    }
                    s += "\"" + el + '":' + obj[el];
                    // console.log('s', s);
                    arr.push(s);
                } else if (typeof obj[el] === 'string') {
                    s = '';
                    if (index > 0) {
                        s += ",";
                    }
                    s += "\"" + el + "\":\"" + obj[el] + "\"";
                    arr.push(s);
                } else if (typeof obj[el] === 'object') {
                    s = '';
                    try {
                        if (index > 0) {
                            s += ",";
                        }
                        s += "\"" + el + "\":" + format(obj[el], depth + 1);
                        arr.push(s);
                    } catch (e) {
                        continue;
                    }
                }
                index++;
            }
            str += arr.join("" + tab) + "" + curTab + "}";
            return (str);
        } else {
            throw 'not a json';
        }
    };

    module.exports = format;

},{}],28:[function(require,module,exports){
    var formatJSON = require("./formatJSON.js");

    function init() {

        var parse = function(str) {
            var obj;
            try {
                obj = eval("(" + str + ")");
            } catch (e) {}
            return obj;
        };


        var stringify = function(obj) {
            if(obj){
                var str = formatJSON(obj, 0);
                return str;
            }else{
                return '';
            }
        };
        if (!window.JSON) {
            window.JSON = {
                'parse': parse,
                'stringify': stringify
            };
        }
    };

    module.exports = init;

},{"./formatJSON.js":27}],29:[function(require,module,exports){
    /**
     * @author Treagzhao
     */
    var that = {};
    var cache = {};
    var trigger = function(channel,data) {
        if(cache[channel]) {
            for(var i = 0,
                    len = cache[channel].length;i < len;i++) {
                var listener = cache[channel][i];
                listener(data);
            }
        }
    };

    var on = function(channel,fn) {
        if(!cache[channel]) {
            cache[channel] = [];
        }
        var exists = false;
        var list = cache[channel];
        for(var i = 0,
                len = list.length;i < len;i++) {
            if(list[i] == fn) {
                exists = true;
                break;
            }
        }
        if(!exists) {
            cache[channel].push(fn);
        }
    };

    var off = function(channel,fn) {
        if(fn && typeof fn === 'function') {
            var list = cache[channel];
            if(list && list.length) {
                for(var len = list.length,
                        i = len - 1;i >= 0;i--) {
                    var listener = list[i];
                    if(listener == fn) {
                        list.splice(i,1);
                        break;
                    }
                }
            }
        } else {
            delete cache[channel];
        }
    };

    that.on = on;
    that.off = off;
    that.trigger = trigger;

    module.exports = that;

},{}],30:[function(require,module,exports){
    module.exports = function(global) {
        if (!global) {
            throw 'global is not defined';
        }
        return function(opts) {
            var TIMEOUT_DURATION = 5000;
            var errorLogFun = require("./errorlog.js");
            var that = {};

            var spec = $.extend({
                'url': '',
                'data': {}
            }, opts);
            var startDate = new Date();

            if (spec.success) {
                that.successCallback = spec.success;
                delete spec.success;
            }
            if (spec.fail) {
                that.failCallback = spec.fail;
                delete spec.fail;
            }
            if (spec.error) {
                that.failCallback = spec.error;
                delete spec.error;
            }
            var url = spec.url;
            var params = spec.data;
            spec.success = function(ret) {
                var endTime = new Date();
                var duration = (new Date() - startDate);
                if (duration >= TIMEOUT_DURATION) {
                    errorLogFun.overTimeError(ret, url, params, duration, spec.type, global);
                }
                that.successCallback && that.successCallback(ret);
            };
            spec.error = function(ret) {
                errorLogFun.networkError(ret, url, params, spec.type, global);
                that.failCallback && that.failCallback(ret);
            };
            $.ajax(spec);
            that.success = function(cbk) {
                that.successCallback = cbk;
                return that;
            }

            that.fail = function(cbk) {
                that.failCallback = cbk;
                return that;
            }
            return that;
        };
    }

},{"./errorlog.js":26}],31:[function(require,module,exports){
    function Promise() {
        var list = [];
        var _self = this;
        this.resolve = function(value) {
            var item = list.shift();
            item && item.success && typeof item.success === 'function' && item.success(value, _self);
        };
        this.reject = function(value) {
            var item = list.shift();
            item && item.fail && typeof item.fail === 'function' && item.fail(value, _self);
        };
        this.then = function(successCbk, failCbk) {
            list.push({
                'success': successCbk,
                'fail': failCbk
            });
            return _self;
        }
    };

    Promise.when = function(cbk) {
        return cbk();
    }


    module.exports = Promise;

},{}],32:[function(require,module,exports){
    var Core = function(window) {
        var promise = require('../../../common/initConfig.js')("wap");
        var ManagerFactory = require('../../../common/mode/mode.js');
        var manager;
        // require('../../../common/util/baiduLog.js')();
        require("../../../common/util/initJSON.js")();
        var heartBeat = require('../../../common/socket/heartbeat.js');
        var $evtDom;
        var global;
        var listener = require('../../../common/util/listener.js');

        var parseDOM = function() {};

        var bindListener = function() {
            listener.on("system.send", function(data) {});
        };

        var initPlugins = function() {
            manager = ManagerFactory(global);
            // initWap = initWap(global);
        };

        //FIXME 通过initConfig初始化后再针对H5进行配置
        var init = function() {
            parseDOM();
            bindListener();
            initPlugins();
        };
        promise.then(function(data) {
            $(".white-layer").remove();
            $(document.body).trigger("core.onload", [{
                data: data
            }]);
            global = data;
            listener.trigger('core.onload', [global]);
            init();
        });
    };
    module.exports = Core;

},{"../../../common/initConfig.js":3,"../../../common/mode/mode.js":13,"../../../common/socket/heartbeat.js":20,"../../../common/util/initJSON.js":28,"../../../common/util/listener.js":29}],
    33:[function(require,module,exports){
    (function(node) {
        var core = require('./core/core.js')(window, "wap");
        var listMsg = require('./listMsg/main.js');
        var sendArea = require('./sendArea/index.js');
        require('./fun/closesession.js');
        var parseDOM = function() {

        };

        var initPlugins = function() {
            listMsg();
            //会话列表
            sendArea(window);
        };
        var bindListener = function() {
            $(window).on("resize", function(e) {});
        };

        var init = function() {
            parseDOM();
            initPlugins();
            //$(document.body).append('<iframe style="display:none;" src="https://apptry.evertb.com/zc.html"></iframe>');
        };
        init();
    })(document.body);
},
        {"./core/core.js":32,"./fun/closesession.js":34,"./listMsg/main.js":38,"./sendArea/index.js":57}],34:[function(require,module,exports){
    /*(function() {
     var listener = require('../../../common/util/listener.js');
     var endSessionHandler=function(status){
     var status = ret;
     switch(status) {
     case -1:
     //alert('仅人工模式，转人工失败');
     break;
     case 1://客服自己离线了
     case 2://客服把你T了
     case 3://客服把你拉黑了
     case 4://长时间不说话
     case 6://有新窗口打开
     $chatArea.removeClass("hideChatArea").addClass("showChatArea");
     $keepSession.hide();
     $endSession.show();
     autoSizePhone();
     sessionEnd=true;
     break;
     }
     };
     var bindListener = function() {
     listener.on("core.sessionclose",endSessionHandler);
     };

     var init = function() {
     bindListener();
     };

     init();
     })();
     */
},{}],35:[function(require,module,exports){
// @author denzelj  170109

    var EvaluateRobot = function(global, node) {
        var $node = node;
        var cid = global.apiInit.cid,
            uid = global.apiInit.uid;

        var api = {
            'iEvaluate': '/chat/user/rbAnswerComment.action' //机器人评价
        };
        var language = global.language.lan,
            languageText = global.language.text;

        //顶踩事件
        var onTapEvaluate = function(e) {
            var $evt = $(e.target);
            var $parent = $evt.parents('.js-msgOuter');
            var type = $evt.attr('data-id')
            if (type == 1 || type == -1) {
                var docId = $parent.attr('data-docid'),
                    docName = $parent.attr('data-docname'),
                    robotFlag = $parent.attr('data-robotflag'),
                    msgId = $parent.attr('data-msgid');
                var data = {
                    uid: uid,
                    cid: cid,
                    docId: docId,
                    docName: docName,
                    status: type,
                    robotFlag: robotFlag,
                    msgId: msgId
                };
                $.ajax({
                    type: "post",
                    url: api.iEvaluate,
                    dataType: "json",
                    data: data,
                    success: function(ret) {
                        $evt.parents('.js-evaluate-wrap').find('.js-tap-evaluate').addClass('hide').siblings('.js-evaluated-outer').addClass('show');
                        //ustatus-用户状态  -1 与机器人  1 与人工  0 未建立会话
                        // status-响应状态(1-成功，0-失败)
                        if (ret && ret.status) {
                            switch (ret.status) {
                                case 1: //评价成功
                                    if (type == 1)
                                        $evt.siblings('.js-evaluated-outer').text(languageText['T0070']);
                                    else if (type == -1)
                                        $evt.siblings('.js-evaluated-outer').text(languageText['T0071']);
                                    break;
                                case 2: //已评价
                                    $evt.siblings('.js-evaluated-outer').text(languageText['T0074']);
                                    break;
                                case -1: //评价失败
                                    $evt.siblings('.js-evaluated-outer').text(languageText['T0073']);
                                    break;
                            }
                        } else {
                            $evt.siblings('.js-evaluated-outer').text(languageText['T0072']);
                        }
                    }
                });
            }
        };
        var bindListener = function() {
            $node.delegate('.js-tap-evaluate', 'touchend', onTapEvaluate);
        }
        var init = function() {
            bindListener();
        };

        init();
    }

    module.exports = EvaluateRobot;

},{}],36:[function(require,module,exports){
//denzel 20170227
    var mutex = true;
    var Goods = function(global, myScroll) {

        var UpdateChatMsgHandler = require('./updateChatMsg.js'),
            msgTemplate = require('./template.js'),
            listener = require("../../../common/util/listener.js");

        var language = global.language.lan,
            languageText = global.language.text;

        var cid = global.apiInit.cid,
            uid = global.apiInit.uid;

        var cacheGoodsInfo; //存储用户商品信息

        updateChatMsgHandler = UpdateChatMsgHandler(global, myScroll);
        // 1 标题  tite_info
        // 2 页面地址  url_inof
        // 3 摘要 abstract_info
        // 4 标签 label_info
        // 5 缩略图 thumbnail_info
        var updateChatMsgHandler; //更新消息对象
        var urlParams = {
            title_info: decodeURIComponent(global.urlParams.title_info || ''),
            url_info: decodeURIComponent(global.urlParams.url_info || ''),
            abstract_info: decodeURIComponent(global.urlParams.abstract_info || ''),
            label_info: decodeURIComponent(global.urlParams.label_info ? global.urlParams.label_info : ''),
            thumbnail_info: decodeURIComponent(global.urlParams.thumbnail_info || '')
            //https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1488261383650&di=2380758f1022811e34b360b5ffd393f4&imgtype=0&src=http%3A%2F%2Fwww.dabaoku.com%2Fsucaidatu%2Fdongwu%2Fchongwujingling%2F953838.JPG
        };

        var forMatText = {
            'title_info': languageText['T0099'],
            'abstract_info': languageText['T0100'],
            'label_info': languageText['T0101'],
            'url_info': languageText['T0102']
        };

        //dom
        var $node,
            $goodsWrap,
            $goodsDetail,
            $goodsTitle,
            $goodsAbstract,
            $goodsSend,
            $goodsThum,
            $goodsLabel;
        /** 1 标题+地址+摘要+标签+缩略图
         *  2 标题+地址+摘要+标签
         *  3 标题+地址+缩略图+摘要
         *  4 标题+地址+缩略图+标签
         *  5 标题+地址+缩略图
         *  6 标题+地址+摘要
         *  7 标题+地址+标签
         *  8 标题+地址
         **/
        var status = 0; //状态值  0 代表不显示
        if (urlParams.title_info && urlParams.url_info) {
            if (urlParams.abstract_info && urlParams.label_info && urlParams.thumbnail_info) {
                status = 1;
            } else if (urlParams.abstract_info && urlParams.label_info) {
                status = 2;
            } else if (urlParams.thumbnail_info && urlParams.abstract_info) {
                status = 3;
            } else if (urlParams.thumbnail_info && urlParams.label_info) {
                status = 4;
            } else if (urlParams.thumbnail_info) {
                status = 5;
            } else if (urlParams.abstract_info) {
                status = 6;
            } else if (urlParams.label_info) {
                status = 7;
            } else {
                status = 8;
            }
        } else {
            status = 0;
        }

        var stringFormat = function(str, args) {
            var index = 0,
                reg = /{\d+}/g;
            return str.replace(reg, function(e) {
                var res = args[index++];
                return res;
            });
        };
        //判断展现形式
        var goodsSwitchServ = function() {
            // status = 5;
            switch (status) {
                case 1:
                    break;
                case 2:
                    $goodsThum.remove();
                    $goodsDetail.addClass('width');
                    $goodsTitle.addClass('margin-left');
                    $goodsAbstract.addClass('margin-left');
                    $goodsLabel.addClass('margin-left');
                    break;
                case 3:
                    $goodsLabel.remove();
                    break;
                case 4:
                    $goodsAbstract.remove();
                    break;
                case 5:
                    $goodsLabel.remove();
                    $goodsAbstract.remove();
                    break;
                case 6:
                    $goodsThum.remove();
                    $goodsLabel.remove();
                    $goodsDetail.addClass('width');
                    break;
                case 7:
                    $goodsThum.remove();
                    $goodsAbstract.remove();
                    $goodsDetail.addClass('width');
                    break;
                case 8:
                    $goodsThum.remove();
                    $goodsAbstract.remove();
                    $goodsLabel.remove();
                    $goodsDetail.addClass('width');
                    break;
                default:
                    return;
            }
            $goodsWrap.addClass('show');
        };

        var forMatMsg = function(args) {
            args = args || [];
            var str = '[{0}]{0}',
                retStr = [],
                retText = [];

            for (var i = 0; i < args.length; i++) {
                retStr.push(str);
                retText.push(forMatText[args[i]], urlParams[args[i]]);
            }
            retStr = retStr.join('<br />');
            return stringFormat(retStr, retText);
        };
        //获取点击商品信息后的消息体
        var getAnswerServ = function() {
            var ret = '';
            switch (status) {
                case 1:
                case 2:
                    ret = forMatMsg(['title_info', 'abstract_info', 'label_info', 'url_info']);
                    break;
                case 3:
                case 6:
                    ret = forMatMsg(['title_info', 'abstract_info', 'url_info']);
                    break;
                case 4:
                case 7:
                    ret = forMatMsg(['title_info', 'label_info', 'url_info']);
                    break;
                case 5:
                case 8:
                    ret = forMatMsg(['title_info', 'url_info']);
                    break;
            }
            return ret;
        };

        //发送商品信息
        var onGoodsSendHandler = function(e) {
            if (e && $(e.target).hasClass('js-goods-send')) {
                var tStr = +new Date();
                var date = uid + tStr;
                setTimeout(function() {
                    var res = getAnswerServ();
                    listener.trigger('sendArea.send', [{
                        'answer': res || '',
                        'uid': uid,
                        'cid': cid,
                        'dateuid': date,
                        'date': tStr,
                        'token': "",
                        'sendAgain': false,
                        'currentStatus': 'human'
                    }]);
                }, 200);
            }
        };
        var parseDom = function() {
            var data = {
                'title': urlParams.title_info,
                'url': urlParams.url_info,
                'abstract': urlParams.abstract_info,
                'label': urlParams.label_info,
                'thum': urlParams.thumbnail_info
            };
            var ret = doT.template(msgTemplate.goods1Html);
            var html = ret(data);
            updateChatMsgHandler.appendGoods(html);
            $node = $('.js-chatPanelList');
            $goodsWrap = $node.find('.js-goods-wrap');
            $goodsDetail = $node.find('.js-goods-detail');
            $goodsTitle = $node.find('.js-goods-title');
            $goodsLabel = $node.find('.js-goods-label');
            $goodsSend = $node.find('.js-goods-send');
            $goodsThum = $node.find('.js-goods-thum');
            $goodsAbstract = $node.find('.js-goods-abstract');

            //设置颜色
            $goodsLabel.css('color', global.apiConfig.color);
            $goodsSend.css('background-color', global.apiConfig.color);
        };
        var bindListener = function() {
            $node.delegate($goodsSend, 'touchend', onGoodsSendHandler);
        };
        var initPlugsin = function() {
            goodsSwitchServ();
        };
        var init = function() {
            parseDom();
            bindListener();
            initPlugsin();
        };
        if (mutex) {
            mutex = false;
            init();
        }
    };
    module.exports = Goods;

},{"../../../common/util/listener.js":29,"./template.js":50,"./updateChatMsg.js":54}],37:[function(require,module,exports){
    var LoadHistoryHandler = function(global, myScroll) {

        var That = {};

        //缺省图片库
        var imgHanlder = {
            userLogo: '//img.sobot.com/console/common/face/user.png'
        };
        //dom 元素
        var chatPanelList,
            scrollChatList;

        var language = global.language.lan,
            languageText = global.language.text;

        var Comm = require('../../../common/comm.js');
        var msgTemplate = require('./template.js');
        var QQFace = require('../util/qqFace.js')();
        var TimeLineHandler = require('./timeLineHandler.js');
        var multiTemplate = require('./multiTemplate.js');
        var multiConvItem = require('./multiConvItem')(global, myScroll);

        var localData = {}; //存储本地临时数据用

        var timeLineHandler;

        var noteFlag = true;

        var initOfflineMessageBubble = function(count) {
            if (count < 10)
                return;
            var spanHtml = doT.template(msgTemplate.offlineMessageTipBubble)({
                'count': count,
                'msgTxt': languageText['T0058']
            });
            var $span = $(spanHtml);
            if (global.urlParams.back == 1 && global.urlParams.from !== 'iframe') {
                $span.css("top", 50);
            }
            $(".js-wrapper").append($span);
            $span.on('click', function() {
                $span.remove();
                $(".js-textarea").blur();
                if ($(".seperator-line").length > 0) {
                    setTimeout(function() {
                        var top = $(".seperator-line").offset().top - $(".js-chatMsgList").offset().top;
                        myScroll.scrollTo(-top);
                    }, 1000);
                }
            });
        };
        //展示历史记录 type 用于判断加载第一页数据
        //isFirstData 是否是刚进入页面
        var loadHistory = function(data, isFirstData, cbk, goodsFlag) {
            var comf,
                sysHtml = '',
                dataLen = data.length,
                item = '',
                itemLan = 0,
                itemChild = '',
                msgHtml = '',
                userLogo = '',
                customLogo = '',
                oldTime = '', //上一次时间
                tempHtml = '',
                imgStatus = '', //消息是否为图片
                reg = /target="_self"/g;
            var htmlTags = ['<a', '<img', '<audio', '<frame', '<video'];
            var offlineMessageCount = 0;
            if (data && data.length > 0) {
                for (var i = 0; i < dataLen; i++) {
                    item = data[i].content;
                    itemLan = item.length;
                    for (var j = 0; j < itemLan; j++) {
                        itemChild = item[j];
                        imgStatus = '';
                        var index = -1;
                        var res;
                        var htmlMutex = false;
                        if (itemChild.msgType != 9 && itemChild.msgType != 10) {
                            itemChild.msg = itemChild.msg + '';
                            index = itemChild.msg.indexOf('uploadedFile');
                            htmlTags.forEach(function(item) {
                                if (itemChild.msg.indexOf(item) >= 0) {
                                    htmlMutex = true;
                                }
                            });
                        }
                        if (itemChild.msgType == 'offline') {
                            offlineMessageCount++;
                        }
                        if (index >= 0) {
                            //图片，文件 上传
                            if (itemChild.msg.indexOf('<img') >= 0) {
                                res = itemChild.msg;
                            } else {
                                res = $('<div></div>').html(itemChild.msg).text();
                            }
                        } else if (htmlMutex) {
                            //富文本
                            res = itemChild.msg;
                            if (itemChild.msg.indexOf('audio') >= 0) {
                                //发送语音
                                res = '<div class="audio">' + itemChild.msg + '</div>';
                            }
                        } else {
                            if (itemChild.msgType != 9 && itemChild.msgType != 10)
                                res = Comm.getNewUrlRegex(itemChild.msg);
                        }
                        //判断加载是否是图片
                        if (res.indexOf('webchat_img_upload') >= 0) {
                            imgStatus = "imgStatus";
                        }
                        if (itemChild.senderType == -1) {
                            //离线消息分割线
                            itemChild.msgTxt = languageText['T0059'];
                            msgHtml = doT.template(msgTemplate.seperatorTemplate)(itemChild);
                        } else if (itemChild.senderType === 0) {
                            //-------客户---------
                            if (itemChild.msgType === 10) {
                                //多轮会话
                                var multiData;
                                if (typeof itemChild.msg === 'object') {
                                    multiData = (itemChild.msg.interfaceRetList || itemChild.msg.inputContentList) || [];
                                    res = multiData[0].title || '';
                                } else {
                                    res = itemChild.msg;
                                }
                            }
                            var _img;
                            if (global.userInfo.face) {
                                _img = global.userInfo.face;
                            } else {
                                //senderFace 传入有可能是"null"字符串 比较诡异
                                _img = itemChild.senderFace && itemChild.senderFace != 'null' ? itemChild.senderFace : imgHanlder.userLogo;
                            }
                            comf = $.extend({
                                'userLogo': _img,
                                'userMsg': QQFace.analysisRight(res),
                                'date': itemChild.t,
                                'imgStatus': imgStatus,
                                'msgLoading': global.MSGSTATUSCLASS.MSG_SERVED //历史记录 标记发送成功
                            });
                            msgHtml = doT.template(msgTemplate.rightMsg)(comf);
                        } else if (itemChild.senderType == 3) { //欢迎语支持引导问题
                            comf = $.extend({
                                'customLogo': itemChild.senderFace && itemChild.senderFace != 'null' ? itemChild.senderFace : global.apiConfig.robotLogo,
                                'customName': itemChild.senderName,
                                'list': itemChild.list,
                                'isHistory': false,
                                'stripe': itemChild.stripe,
                                'answer': itemChild.msg
                            });
                            localData.sugguestionHTML = doT.template(msgTemplate.listSugguestionsMsg)(comf);
                        } else {
                            //----机器人 客服------
                            if (itemChild.msgType === 9) {
                                var tempFlag = false;
                                var multiData = itemChild.msg;
                                var temp = multiTemplate['temp' + (multiData.template + 1)];
                                var htmlFn = '',
                                    htmlStr = '';
                                if (multiData.interfaceRetList) {
                                    //接口
                                    htmlFn = doT.template(temp);
                                    htmlStr = htmlFn(multiData);
                                    tempFlag = false;
                                    switch (multiData.retCode) {
                                        case '000000':
                                            switch (multiData.template) {
                                                case 0:
                                                case 2:
                                                    tempFlag = true;
                                                    multiData.answer = multiData.remindQuestion || multiData.answerStrip;
                                                    break;
                                                case 1:
                                                case 3:
                                                case 4:
                                                    tempFlag = false;
                                                    multiData.answer =htmlStr;
                                                    break;
                                            }

                                            break;
                                        case '000001':
                                            multiData.answer = multiData.retErrorMsg;
                                            htmlStr = multiData.remindQuestion;
                                            tempFlag = false;
                                            break;
                                        case '000002':
                                            multiData.answer = multiData.remindQuestion;
                                            htmlStr = multiData.remindQuestion;
                                            tempFlag = false;
                                            break;
                                    }
                                    msgHtml = multiConvItem.htmlFormat(multiData, htmlStr, tempFlag, true);
                                } else if (multiData.inputContentList) {
                                    //填写
                                    htmlFn = doT.template(multiTemplate.temp2_manual);
                                    htmlStr = htmlFn(multiData);
                                    multiData.answer = htmlStr;
                                    msgHtml = multiConvItem.htmlFormat(multiData, htmlStr, false, true);
                                } else {
                                    multiData.answer = multiData.remindQuestion || multiData.answerStrip || multiData.retErrorMsg;
                                    msgHtml = multiConvItem.htmlFormat(multiData, multiData.answer, false, true);
                                }
                            } else {
                                comf = $.extend({
                                    'customLogo': itemChild.senderFace && itemChild.senderFace != 'null' ? itemChild.senderFace : global.apiConfig.robotLogo,
                                    'customName': itemChild.senderName,
                                    'customMsg': QQFace.analysis(res, global),
                                    'imgStatus': imgStatus,
                                    'date': itemChild.t
                                });
                                msgHtml = doT.template(msgTemplate.leftMsg)(comf);
                            }
                        }
                        if (itemChild.senderType != 3) { //引导语不需要加时间线和追加html
                            msgHtml = timeLineHandler.getTimeLine(data, itemChild.ts, oldTime) + msgHtml;
                            oldTime = itemChild.ts;
                            tempHtml = (tempHtml + msgHtml).replace(reg, 'target="_blank"');
                        }
                    }
                }
                initOfflineMessageBubble(offlineMessageCount);
                updateChatList(tempHtml, isFirstData, goodsFlag);
                multiConvItem.resizeWidth($('.js-chatMsgList'));//计算宽度
            } else {
                //没有更多消息
                if (isFirstData) {
                    updateChatList('', true, false);
                }
                global.flags.moreHistroy = false;
            }
            cbk && cbk();
        };
        var sugMutex = true;
        //更新聊天信息列表
        var updateChatList = function(tmpHtml, isFirstData, goodsFlag) {
            var _chatPanelList = chatPanelList,
                _chatPanelChildren = _chatPanelList.children();
            if (_chatPanelChildren && _chatPanelChildren.length && !goodsFlag) {
                chatPanelList.children().first().before(tmpHtml);
            } else {
                chatPanelList.append(tmpHtml);
            }
            //刷新
            //首次进入加载记录
            if (isFirstData & global.apiInit.ustatus!=-1) {
                if (global.apiConfig.announceMsgFlag) {
                    var _msg = global.apiConfig.announceMsg || '期待最新公告';
                    var note = $('.chatMsgList').find('.js-notice');
                    if (note.length <= 0) {
                        if (global.apiConfig.announceTopFlag) {
                            //置顶
                            var notice = $('.js-notice'),
                                noticeMsg = $('.js-notice-msg'),
                                btn = $('.js-status-btn'),
                                dropdown = $('.js-pullDown'),
                                dropwdownTitle = $('.js-pullDownLabel');
                            notice.css('display', 'block');
                            dropdown.css('height', 100);
                            dropwdownTitle.css('margin-top', 60);
                            if (global.urlParams.back) {
                                //back=1
                                $('.js-notice').css('top', 50);
                            }
                            noticeMsg.html(_msg);
                            if (global.apiConfig.announceClickUrl && global.apiConfig.announceClickFlag) {
                                noticeMsg.attr("href", global.apiConfig.announceClickUrl);
                            }
                            notice.find('img').hide();
                            notice.on('click', function(e) {
                                var el = $(e.currentTarget),
                                    h = 60;
                                if (noticeMsg.hasClass('expand')) {
                                    noticeMsg.removeClass('expand')
                                    btn.addClass('collpase');
                                    notice.find('img').show();
                                    notice.addClass('scroll');
                                    h = 'auto';
                                    btn.text('收起');
                                } else {
                                    noticeMsg.addClass('expand');
                                    btn.removeClass('collpase');
                                    notice.find('img').hide();
                                    notice.removeClass('scroll');
                                    h = 60;
                                    btn.text('展开');
                                }
                                el.css('height', h);
                            });
                        } else {
                            //嵌入聊天内容
                            _msg = _msg.replace(/<a/g, '<a target="_blank"');
                            comf = $.extend({
                                'msg': _msg
                            });
                            var _h = doT.template(msgTemplate.noteTemp)(comf);
                            if ($('.js-chatPanelList .msgwrap')[0])
                                $('.js-chatPanelList .msgwrap').eq($('.msgwrap').length - 1).before(_h);
                            else
                                $('.js-chatPanelList').before(_h);
                            var styles = window.getComputedStyle($('.js-note-msg')[0], null);
                            var lineHeight = parseInt(styles.lineHeight, 10);
                            var height = parseInt(styles.height, 10);
                            var lineCount = Math.round(height / lineHeight);
                            if (lineCount > 5) {
                                //显示展开按钮
                                $('.js-note-msg').addClass('mui-ellipsis-5');
                                $('.js-flips').addClass('show');
                                $('.js-notice').addClass('padding-bottom');
                            } else {
                                $('.js-flips').removeClass('show');
                            }
                        }
                    }
                }

                //if (chatPanelList.children().length <= 3 && localData.sugguestionHTML && global.apiConfig.announceMsgFlag) {
                //只有欢迎语 添加时间线
                // var tmsg = timeLineHandler.getTimeLine(null, new Date(), false, true);
                // chatPanelList.append(tmsg);
                //}
                var _last = $('.js-chatPanelList > :last-child');
                _last.after(localData.sugguestionHTML || '');
                if (sugMutex) {
                    if (!_last.hasClass('sysData')) {
                        var tmsg = timeLineHandler.getTimeLine(null, new Date(), false, true);
                        chatPanelList.append(tmsg);
                    }
                    $('.js-chatPanelList  > div:last-child').after(localData.sugguestionHTML || ''); //引导语
                }
                sugMutex = false;
                myScroll.myRefresh();
            } else {
                // return;
                setTimeout(function() {
                    var _y = -($(scrollChatList).height() - global.scrollerInitHeight);
                    if (isFirstScroll) {
                        isFirstScroll = false;
                        defaultHeight = global.scrollerInitHeight;
                    }
                    currentHeight = -($(scrollChatList).height() - defaultHeight);
                    myScroll.scroll.scrollTo(0, _y - 50);
                    myScroll.scroll.maxScrollY = currentHeight - 50;
                    global.scrollerInitHeight = $(scrollChatList).height();
                    myScroll.myRefresh();
                }, 1500);
            }
        };

        var currentHeight, //当前高度
            defaultHeight, //默认高度
            isFirstScroll = true;

        That.loadHistory = loadHistory;

        var parseDom = function() {
            chatPanelList = $('.js-chatPanelList');
            scrollChatList = $('.js-scroller');
        };
        var initPlugins = function() {
            timeLineHandler = TimeLineHandler(global, myScroll);
        };
        var init = function() {
            parseDom();
            initPlugins();
        };
        init();
        return That;
    };
    module.exports = LoadHistoryHandler;
},{"../../../common/comm.js":1,"../util/qqFace.js":66,"./multiConvItem":42,"./multiTemplate.js":43,"./template.js":50,"./timeLineHandler.js":52}],38:[function(require,module,exports){
    /*
     * @author denzel
     */
    var ListMsgHandler = function() {
        var global,
            scrollHanlder;

        var language, languageText;
        var Comm = require('../../../common/comm.js');
        var fnEvent = require('../../../common/util/listener.js');
        var msgTemplate = require('./template.js');
        var ManagerFactory = require('../../../common/mode/mode.js');
        var Promise = require('../../../common/util/promise.js');
        var theme = require('./theme.js');
        var Scroll = require('./scroll.js');
        var QQFace = require('../util/qqFace.js')();
        var MessageHandler = require('./msghandler.js');
        var manualHandler = require('./manualHandler.js');
        var TimeLineHandler = require('./timeLineHandler.js');
        var unReadHandler = require('./unReadHandler.js');
        var LoadHistoryHandler = require('./loadHistoryHandler.js');
        var UpdateChatMsgHandler = require('./updateChatMsg.js');
        var NoticeHandler = require('./noticeHandler.js');
        var PushGoodsInfo = require('./pushGoodsInfo.js');

        var evaluateRobot = require('./evaluateRobot.js');

        var systemHandler, //系统模块
            timeLineHandler,
            loadHistoryHandler,
            updateChatMsgHandler,
            noticeHandler, //消息通告
            messageHandler, //消息模块
            pushGoodsInfo; //主动营销场景

        //消息状态-类
        var MSGSTATUSCLASS = {
            MSG_LOADING: 'msg-loading', //正在发送
            MSG_LSSUED: 'msg-lssued', //已发送
            MSG_SERVED: 'msg-served', //已送达
            MSG_FAIL: 'msg-fail', //发送失败
            MSG_CLOSE: 'msg-close', //关闭发送  图片仅有
            MSG_SENDAGAIN: 'msg-sendAgain' //重发图片
        };

        // queue:用户排除中  offline:客服不在线  blacklist:被拉黑
        var sysMsgList = ['queue', 'offline', 'blacklist', 'evaluated', 'firstEvaluate']; //用于系统提示管理的状态码

        //Dom元素
        var topTitleBar, //顶部栏
            userChatBox, //用户聊天内容背景色
            chatMsgList, //聊天窗体
            wrapScroll, //滚动窗体
            scrollChatList, //滚动区域
            pullDown, //下拉刷新
            chatPanelList, //滚动列表
            progress, //进度条
            shadowLayer, //上传图片蒙板
            wrapBox; //页面
        //api接口
        // var api = {
        //     url_keepDetail: '/chat/user/getChatDetailByCid.action',
        //     url_detail: '/chat/user/chatdetail.action'
        // };
        //缺省图片库
        var imgHanlder = {
            userLogo: '//img.sobot.com/console/common/face/user.png'
        };
        //初始化 scroll组件
        var initScroll = function() {
            scrollHanlder.scroll.on("scroll", function() {
                var scroll = this;
                var y = scroll.y,
                    maxY = scroll.maxScrollY - y;

                if ($(".seperator-line").length <= 0) return;
                var top = $(".seperator-line").offset().top - $(".js-chatMsgList").offset().top;
                var limitTop = 10;
                if (global.urlParams.back == 1 && global.urlParams.from !== 'iframe') {
                    limitTop = 35;
                }
                if (Math.abs(y) <= top - limitTop) {
                    $(".offline-message-bubble").remove();
                }
            });
            scrollHanlder.scroll.on('slideDown', onPullDown);
            global.flags.moreHistroy = true;
        };

        //下拉刷新
        var onPullDown = function() {
            scrollHanlder.pullDown(function(data) {
                $(".seperator-line").remove();
                if (data.length > 0) {
                    loadHistoryHandler.loadHistory(data, 0);
                    setTimeout(function() {
                        $(pullDown).removeClass('loading');
                        $(pullDown).text(languageText['T0002']);
                    }, 800);
                    global.flags.moreHistroy = true;
                } else {
                    //没有历史记录
                    global.flags.moreHistroy = false;
                }
            });
        };

        //设置title值
        var settingTitle = function(ret) {
            //titleFlag  1 企业名称 （默认）  2 固定文案  3 客服昵称 （人工、机器人）
            var _jsTitleFlag = global.urlParams.titleFlag || 1,
                _jsTitle = global.urlParams.customTitle || ret.senderName;
            var _title;
            switch (_jsTitleFlag) {
                case 1:
                    _title = global.apiConfig.companyName;
                    break;
                case 2:
                    _title = _jsTitle;
                    break;
                case 3:
                    _title = ret.senderName;
                    break;
                default:
                    _title = global.apiConfig.companyName;
                    break;
            }
            $('.js-title').text(_title);
            // document.title = languageText['T0012'] + global.apiConfig.companyName;   //不加前缀 "咨询客服-"
            document.title = _title;
        }
        var timer;
        //加欢迎语
        var getHello = function(data) {
            //判断智能机器人还是人工客服 1 robot 2 human
            //主动营销场景——客户push特定URL带入营销商品信息
            var status = global.apiInit.ustatus,
                robotFlag = false;
            data.forEach(function(item) {
                if (item.content[0].senderType === 1) {
                    robotFlag = true;
                }
            });
            if (global.urlParams.rput == '1') {
                // if (status === 0 && global.urlParams.rput == '1') {
                pushGoodsInfo.loaded(function(flag) { //是否有添加主动商品信息  1 表示有添加
                    helloFn(data, flag);
                });
            } else {
                helloFn(data, 0);
            }
        };
        var helloFn = function(data, flag) {
            if (data && data.length) {
                var _data = data[data.length - 1].content[0];
                global.currentState = _data.senderType;
                settingTitle(_data);
                //FIXME 获取最后一条客服聊天消息 机器人 OR  人工客服
                global.apiConfig.customInfo = {
                    type: "human",
                    data: {
                        aface: _data.senderFace,
                        aname: _data.senderName,
                        content: "",
                        status: 1
                    }
                };
            }
            loadHistoryHandler.loadHistory(data, 1, function() {
                global.scrollerInitHeight = scrollChatList.height();
            }, flag);
        }
        //处理页面导航条 IFrame
        var initHaderBar = function($node) {
            if (global.urlParams.from && global.urlParams.from === 'iframe') {
                $node.find('.js-back').addClass('is-pc');
                $node.find('.js-title').addClass('is-pc');
                $node.find('.js-collapse').addClass('show');
                $node.find('.js-header-back').css({ 'height': '44px' });
                $node.find('.js-wrapper').css({ 'top': '44px' });
            }
        };
        //折叠聊天窗体
        var onCollapseWindow = function() {
            if (window.parent !== window)
                window.parent.postMessage(JSON.stringify({
                    name: 'chat_collapseWindow',
                    data: ''
                }), '*');
        };
        /********************************************************************************/
        /*************************************基本配置**********************************/
        /********************************************************************************/
        //core加载完成
        var onCoreOnload = function(data) {
            global = data[0];
            global.keywordManager = [];
            global.keyword = sysMsgList;
            global.MSGSTATUSCLASS = MSGSTATUSCLASS; //发送消息的状态码
            global.msgSendACK = global.msgSendACK || [];
            language = global.language.lan;
            languageText = global.language.text;
            initConfig(); //配置参数
        };
        //初始化h5页面配置信息
        var initConfig = function() {
            theme(global, wrapBox); //主题设置
            scrollHanlder = Scroll(global, wrapBox); //初始化scroll
            global.scrollerInitHeight = scrollChatList.height(); //获取滚动scroll初始化高度
            initScroll(); //初始化&配置scroll
            messageHandler = MessageHandler(global, scrollHanlder);
            timeLineHandler = TimeLineHandler(global); //时间显示相关
            loadHistoryHandler = LoadHistoryHandler(global, scrollHanlder);
            updateChatMsgHandler = UpdateChatMsgHandler(global, scrollHanlder);
            noticeHandler = NoticeHandler(global, scrollHanlder);
            pushGoodsInfo = PushGoodsInfo(global, scrollHanlder);
            unReadHandler(global, scrollHanlder); //未读消息
            manualHandler(global, scrollHanlder); //转人工相关
            initHaderBar($('.js-wrapBox')); //若是 iframe 则对导航条进行处理
            evaluateRobot(global, wrapBox); //评价机器人
        };
        //初始化Dom
        var parseDOM = function() {
            topTitleBar = $('.js-header-back');
            userChatBox = $('.js-userMsgOuter');
            chatMsgList = $('.js-chatMsgList');
            wrapScroll = $('.js-wrapper');
            pullDown = $('.js-pullDownLabel');
            chatPanelList = $('.js-chatPanelList');
            wrapBox = $('.js-wrapBox');
            scrollChatList = $('.js-scroller');
        };
        var bindListener = function() {
            fnEvent.on('core.onload', onCoreOnload);
            fnEvent.on('core.initsession', getHello); //机器人欢迎语 调历史渲染接口
            $('.js-header-back .js-collapse').on('click', onCollapseWindow);
            document.addEventListener('touchmove', function(e) {
                // console.log(e.path);
                //解决评价不能滑动问题
                var evaFlag = 1;
                for (var i = 0; i < e.path.length; i++) {
                    // console.log($(e.path[i]));
                    // console.log($(".js-layer"));
                    if ($(e.path[i])[0] == $(".js-layer")[0]) {
                        evaFlag = 0;
                    }
                };
                if (evaFlag) {
                    e.preventDefault();
                }
            }, false); //android7.0 解决滑动卡顿的问题
        };
        var init = function() {
            parseDOM();
            bindListener();
        };
        init();
    };
    module.exports = ListMsgHandler;

},{"../../../common/comm.js":1,"../../../common/mode/mode.js":13,"../../../common/util/listener.js":29,"../../../common/util/promise.js":31,"../util/qqFace.js":66,"./evaluateRobot.js":35,"./loadHistoryHandler.js":37,"./manualHandler.js":39,"./msghandler.js":40,"./noticeHandler.js":44,"./pushGoodsInfo.js":46,"./scroll.js":47,"./template.js":50,"./theme.js":51,"./timeLineHandler.js":52,"./unReadHandler.js":53,"./updateChatMsg.js":54}],39:[function(require,module,exports){
    var ManualHandler = function(global, myScroll) {
        var fnEvent = require('../../../common/util/listener.js');
        var msgTemplate = require('./template.js');
        var QQFace = require('../util/qqFace.js')();
        var Comm = require('../../../common/comm.js');
        var UpdateChatMsgHandler = require('./updateChatMsg.js');
        var SysMsgChannelHandler = require('./sysMsgChannelHandler.js');
        var goodsHandler = require('./goodsShow.js');

        var updateChatMsgHandler, //更新消息对象

            sysMsgChannelHandler;

        var language = global.language.lan,
            languageText = global.language.text;

        var defFace = '//img.sobot.com/console/common/face/admin.png';

        var settingTitle = function(ret) {
            var til;
            if (global.apiConfig.type == 2) { //仅人工  L10026 排队中   L10025 暂无客服在线
                switch (ret.status) {
                    case 'kickout':
                        til = language['L10025'];
                        break;
                    case 'offline':
                        til = language['L10025'];
                        break;
                    case 'queue':
                        til = language['L10026'];
                        break;
                    default:
                        til = language['L10025'];
                        break;
                }
            } else {
                til = global.apiConfig.robotName;
            }

            var name = ret.data.aname || til; //客服昵称
            //titleFlag  1 企业名称 （默认）  2 固定文案  3 客服昵称 （人工、机器人）
            var _jsTitleFlag = global.urlParams.titleFlag || 1,
                _jsTitle = global.urlParams.customTitle || name;
            var _title;
            switch (_jsTitleFlag) {
                case 1:
                    _title = global.apiConfig.companyName;
                    break;
                case 2:
                    _title = _jsTitle;
                    break;
                case 3:
                    _title = name;
                    break;
                default:
                    _title = global.apiConfig.companyName;
                    break;
            }
            $('.js-title').text(_title);
            document.title = _title;
            // $('.js-manual-remove').remove();
            $('.js-left-msg').removeClass('show-manual-service');
        }

        //转人工

        var onManualServ = function(data) {
            if (data.type != 'system') {
                var face = data.data.aface || defFace;
                if (data.data) {
                    global.apiConfig.customInfo = {
                        type: "human",
                        data: {
                            aface: face,
                            aname: data.data.aname,
                            content: "",
                            status: 1
                        }
                    };
                }
            } else if (data.type === 'system' && global.apiConfig.type === 2 && global.urlParams.msgflag === 0) {
                //msgflag 0 开启   1关闭
                if (data.status === 'blacklist') {
                    //拉黑
                    $(".js-leaveMsgBtn").trigger("click");
                }
                if (data.status === 'queue') {
                    $(document.body).trigger('listMsg-queue');
                }
            }
            // else if (data.type === 'system' && data.status === 'blacklist' && global.apiConfig.type === 2 && global.urlParams.msgflag == 0) {
            //     //拉黑用户 仅人工  开启留言
            //     $(".js-leaveMsgBtn").trigger("click"); //跳转到留言页  仅人工
            // } else if (data.type === 'system' && data.status === 'queue' && global.apiConfig.type === 2) {
            //     $(document.body).trigger('listMsg-queue');
            // }
            var til;
            switch (data.status) {
                case 'kickout':
                    til = language['L10025'];
                    break;
                case 'offline':
                    til = language['L10025'];
                    break;
                case 'queue':
                    til = language['L10026'];
                    break;
                case 'transfer':
                    $('.js-manual-remove').css('opacity', '0').removeClass('js-artificial'); //转人工成功后 移除转人工按钮
                    break;
                default:
                    til = global.apiConfig.type == 4 ? language['L10026'] : language['L10025'];
                    break;
            }
            var name = data.data.aname || til;
            $('.js-title').text(name);
            document.title = languageText['T0012'] + global.apiConfig.companyName;
            setTimeout(function() { sysMsgChannelHandler.onJoinHTML(data); }, 300);
            settingTitle(data);
            if (data.type && data.type === 'human')
                goodsHandler(global, myScroll); //在聊天页给用户展示商品详情
        };
        // goodsHandler(global, myScroll,$('.js-goods-wrap')); //在聊天页给用户展示商品详情
        //仅人工 客服不在线
        var onButtonChange = function(data) {
            if (data && data.data) {
                //FIXME 1：仅人工 客服不在线 开启留言功能 直接跳转留言页 2：若排除则继续当前页排除 3：技能组大于1时先弹技能组 再走1 || 2
                if (data.data.status == 2 && !global.apiConfig.groupflag && !global.apiConfig.msgflag) {
                    $(".js-endSession .js-leaveMsgBtn").trigger("click");
                    //window.location.href = global.apiConfig.leaveMsgUrl;//跳转到留言页
                }
                $('.js-title').text(language['L10025']);
                document.title = languageText['T0012'] + global.apiConfig.companyName;
                var data = { type: 'system', status: 'hunmanonly', data: { content: data.data.content, status: 0 } };
                sysMsgChannelHandler.onJoinHTML(data);
            }
            if (data && data.type == 'transfer' && data.action == 'hide') {
                goodsHandler(global, myScroll); //在聊天页给用户展示商品详情
            }
        };
        var bindListener = function() {
            fnEvent.on('core.system', onManualServ); //转人工事件
            fnEvent.on('core.buttonchange', onButtonChange); //仅人工 且客服不在线
        };
        var initPlugins = function() {
            updateChatMsgHandler = UpdateChatMsgHandler(global, myScroll);
            sysMsgChannelHandler = SysMsgChannelHandler(global, myScroll);
        };
        var init = function() {
            bindListener();
            initPlugins();
        };
        init();
    };
    module.exports = ManualHandler;

},{"../../../common/comm.js":1,"../../../common/util/listener.js":29,"../util/qqFace.js":66,"./goodsShow.js":36,"./sysMsgChannelHandler.js":49,"./template.js":50,"./updateChatMsg.js":54}],40:[function(require,module,exports){
    /*
     * @author denzel
     */
//msgBind 展示消息到列表
    var SysmsgHandler = function(global, myScroll) {

        var local = {}, //本地方法管理类
            imgHandler = {}; //本地图片方法管理类
        var msgTemplate = require('./template.js');
        var QQFace = require('../util/qqFace.js')();
        var Comm = require('../../../common/comm.js');
        var fnEvent = require('../../../common/util/listener.js');
        var SendMsgChannelHandler = require('./sendMsgChannelHandler.js');
        var SysMsgChannelHander = require('./sysMsgChannelHandler.js');
        var UpdateChatMsgHandler = require('./updateChatMsg.js');
        var pushEvaHandler = require('./pushEvaHandler.js');
        var MultiConv = require('./multiConv.js');    //多轮会话
        //管理类 - 对象
        var sendMsgChannelHandler,
            updateChatMsgHandler,
            sysMsgChannelHandler,
            multiConvHandler;

        //Dom元素
        var chatPanelList, //滚动列表
            topTitleBar, //顶部栏
            wrapScroll, //滚动窗体
            chatMsgList; //最外层滚动列表

        var evaluateFlag = false; //是否显示评价机器人按钮


        //定义变量
        var isUploadImg = true, //是否为上传图片操作
            scrollTimer, //实时定位接收的消息到最底端
            autoTimer, //输入框高度延迟处理 解决与弹出键盘冲突
            sendTime = 0, //发达消息超时时间 默认为0
            isOnlySideOutTimeFlag = 0, //0 客服  1 用户 2 都开启  3 都关闭
            uploadImgHandler = {}; //上传图片token 判断是否发送或上传成功
        wurl = "";
        //超时提示
        var overtimer, //超时提示时间任务
            overtimeTask = {
                overtimeDaley: 0, //超时提示时间
                lastMsgType: 0 //最后一句是谁发送的  0 表示客服  1 表示用户
            };

        var sugguestionsTimer; //相关搜索时间任务
        var language = global.language.lan,
            languageText = global.language.text;
        var sys = {};
        sys.config = {};
        // sys.config.msgSendACK = []; //填装发送消息的容器 用于与消息确认匹配
        sys.config.uploadImgToken = ''; //锁定当前上传图片唯一标识
        // sys.config.currentState = ''; //当前聊天对象状态  1 智能机器人  2人工客服

        //消息状态-类
        var MSGSTATUSCLASS = {
            MSG_LOADING: 'msg-loading', //正在发送
            MSG_LSSUED: 'msg-lssued', //已发送
            MSG_SERVED: 'msg-served', //已送达
            MSG_FAIL: 'msg-fail', //发送失败
            MSG_CLOSE: 'msg-close', //关闭发送  图片仅有
            MSG_SENDAGAIN: 'msg-sendAgain' //重发图片
        };
        //系统提示
        var sysPromptLan = {
            L0001: language['L10028'],
            L0002: language['L10029'],
            L0003: language['L10030'],
            L0004: language['L10031']
        };
        var adminMsg = global.urlParams.adminTipWord; //客服提示语
        var adminDaley = global.apiConfig.adminTipTime * 1000 * 60; //客服超时时间
        /**
         * 处理接收到的消息
         * @return {[type]} [description]
         */
        var reviceMsgHandler = function(data) {
            //FIXME 接收人工工作台消息
            var _type = data.type;
            var _list = data.list;
            for (var i = 0; i < _list.length; i++) {
                var _data = _list[i];
                //判断类型 robot human
                if (_type == 'robot') {
                    //判断多轮会话  15 多轮会话开始  15_1 进行中  15_2 正常结束   15_3 异常结束
                    // _data.answerType='15';
                    if (_data.answerType.indexOf('15') >= 0) {
                        multiConvHandler.fn(_data);
                    } else {
                        //FIXME 机器人类型  answerType=4 相关搜索
                        if ((_data.sugguestions || []).length > 0) {
                            //相关搜索
                            local.sugguestionsSearch(_data, false);
                        } else {
                            sysMsgChannelHandler.onMsgFromCustom('robot', _data);
                        }
                    }
                } else {
                    //FIXME 客服类型
                    switch (_data.type) {
                        case -110:
                            local.unReadMessage(_data);
                            break;
                        case 202:
                            //客服发来消息
                            sysMsgChannelHandler.onMsgFromCustom('human', _data);
                            break;
                        case 204:
                            //会话结束
                            local.sessionCloseHander(_data);
                            break;
                        case 205:
                            //客服正在输入
                            sysMsgChannelHandler.onSysMsgShow(_data.content, _data.type);
                            break;
                        case 209:
                            //推送评价
                            pushEvaHandler(global, window, _data)
                            break;
                    }
                }
            }
        };

        /********************************************************************************/
        /****************************本地处理消息类*****************************************/
        /********************************************************************************/
        local = {
            wurlHandler: function(data) {
                wurl = data.wurl;
            },
            //发送消息
            onSendMsg: function(data) {
                if (data && data[0].answer.indexOf('&nbsp;') >= 0) {
                    var msg = data[0].answer;
                    msg = msg.replace(/&nbsp;/g, ' ');
                    msg = msg.replace(/\s+/g, ' ');
                    data[0].answer = msg;
                }
                //开启用户超时
                switch (isOnlySideOutTimeFlag) {
                    case 0: //客服开启
                        overtimeTask.lastMsgType = 1; //最后一条为用户回复
                        if (global.currentState == 2) {
                            local.msgOvertimeTask(); //转人工后才计时
                        }
                        break;
                    case 1: //用户开启
                        clearInterval(overtimer);
                        break;
                    case 2: //都开启
                        overtimeTask.lastMsgType = 1; //最后一条为用户回复
                        overtimeTask.overtimeDaley = 0; //重置超时提示时间为0
                        if (global.currentState == 2) {
                            local.msgOvertimeTask(); //转人工后才计时
                        }
                        break;
                }
                if (data[0].sendAgain) {
                    //消息重发
                    var oDiv = $('#userMsg' + data[0].dateuid).parents('div.rightMsg');
                    chatPanelList.append(oDiv);
                } else {
                    //非图片
                    if (data[0]['token'] == '') {
                        // msgBind(0, data);
                        sendMsgChannelHandler.onSendMsg(data);
                    }
                }
            },
            //接收回复
            onReceive: function(data) {
                //判断当前聊天状态
                if (data.type === 'robot') {
                    global.currentState = 1;
                    //机器人离线判断 0
                    if (data.list[0].ustatus === 0) {
                        var _data = {
                            type: 'system',
                            status: 'robotoffline',
                            data: {
                                content: sysPromptLan.L0004,
                                status: 0
                            }
                        };
                        sysMsgChannelHandler.onJoinHTML(_data);
                        fnEvent.trigger('listMsg.robotAutoOffLine', 7); //弹起新会话按钮
                        return;
                    }
                } else if (data.type === 'human') {
                    switch (isOnlySideOutTimeFlag) {
                        case 0: //客服开启
                            clearInterval(overtimer);
                            break;
                        case 1: //用户开启
                            overtimeTask.lastMsgType = 0; //最后一条为客服回复
                            global.currentState = 2;
                            local.msgOvertimeTask(); //计时
                            break;
                        case 2: //都开启
                            overtimeTask.lastMsgType = 0; //最后一条为客服回复
                            overtimeTask.overtimeDaley = 0; //重置超时提示时间为0
                            global.currentState = 2;
                            local.msgOvertimeTask(); //计时
                            break;
                    }
                    //用户 客服超时提示语
                    if (data && data.list.length > 0) {
                        for (var i = 0, _list = data.list; i < _list.length; i++) {
                            var _data = _list[i];
                            if (_data.type == 204 && window.parent !== window) {
                                window.parent.postMessage(JSON.stringify({
                                    "name": "closeSession",
                                    "data": data,
                                    'status': data.status
                                }), "*");
                            }
                            //转接成功或邀请成功替换超时提示语
                            if (_data.type == 210 || _data.type == 200) {
                                if (_data.serviceInfo.serviceOutDoc) {
                                    adminMsg = _data.serviceInfo.serviceOutDoc; //客服提示语
                                }
                                if (_data.serviceInfo.serviceOutTime && _data.serviceInfo.serviceOutDoc) {
                                    adminDaley = _data.serviceInfo.serviceOutTime * 1000 * 60;
                                }
                            }
                            if (_data.type == 202 || _data.type == 210) { //202 客服发的消息   210 转接用户
                                global.apiConfig.customInfo = {
                                    type: "human",
                                    data: {
                                        aface: _data.aface ? _data.aface : _data.face,
                                        aname: _data.aname ? _data.aname : _data.name,
                                        content: "",
                                        status: 1
                                    }
                                };
                            } else if (_data.type === 201) {
                                //更新用户排队消息
                                var $queue = $('.queue');
                                var _a = $queue.find('a').attr('href');
                                $queue.find('span').html('排队中，您在队伍中的第' + _data.count + '个 您可以<a class="leave-msg-btn" href=' + _a + '>留言<a>');
                            }
                        }
                    }
                }
                reviceMsgHandler(data);
                //接收消息 实时滚动到最底部  主要用于解决接收大图片页面不能定位到最底端
                clearInterval(scrollTimer);
                scrollTimer = setTimeout(function() {
                    fnEvent.trigger('listMsg.realScrollBottom');
                }, 500);

            },
            //消息确认方法
            msgReceived: function(data) {
                // console.log('msgReceived');
                var sendType, //发送类型
                    answer; //发送内容
                var isMsgId = global.msgSendACK.indexOf(data.msgId);
                if (isMsgId >= 0) {
                    if (data.result == 'success') {
                        //判断图片是否上传成功
                        if (uploadImgHandler[data.msgId]) {
                            // console.log('图片上传成功');
                            clearInterval(uploadImgHandler[data.msgId]);
                            local.maskLayer($('#userMsg' + data.msgId), false);
                        }
                        global.msgSendACK.splice(isMsgId, 1); //从数组中删除
                        $('#userMsg' + data.msgId).removeClass('error msg-loading msg-fail msg-close msg-sendAgain').addClass('msg-served');
                    } else {
                        //发送失败 图片  文字 两种判断
                        if ($('#userMsg' + data.msgId).hasClass('msg')) {
                            //文字
                            $('#userMsg' + data.msgId).removeClass('msg-loading').addClass('error msg-fail');
                        } else {
                            //图片
                            $('#userMsg' + data.msgId).removeClass('msg-close').addClass('error msg-fail');
                        }
                    }
                }
            },
            maskLayer: function(ele, showMaskLayer) {
                if (ele && showMaskLayer) {
                    ele.parents('div.rightMsg').find('.js-shadowLayer').removeClass('hide');
                    ele.parents('div.rightMsg').find('.js-progressLayer').removeClass('hide');
                } else {
                    ele.parents('div.rightMsg').find('.js-shadowLayer').addClass('hide');
                    ele.parents('div.rightMsg').find('.js-progressLayer').addClass('hide');
                }
            },
            //消息重发
            onMsgSendAgain: function() {
                // console.log('消息重发');
                var that = $(this);
                var sendType, //发送类型
                    answer, //发送内容
                    isImgUploadSuccess = true; //是否上传成功
                var msgId = that.attr('id').substr(7, that.attr('id').length);
                //判断当前消息是否满足重发条件 error
                if (that.hasClass('error')) {
                    //消息重发
                    //重发显示到最后一条
                    var oDiv = that.parents('div.rightMsg');
                    chatPanelList.append(oDiv);
                    //判断当前是图片重发   文字重发
                    if (that.hasClass('msg')) {
                        //文字
                        sendType = 'msg';
                        that.removeClass('error msg-fail').addClass('msg-loading');
                        answer = that.prev().text().trim();
                    } else {
                        //发送失败关闭蒙层  DENZEL
                        local.maskLayer(that, false);
                        // local.maskLayer(that, true);
                        //图片
                        sendType = 'img';
                        that.removeClass('error msg-fail').addClass('msg-close close'); //图片重发过程可点击取消
                        //FIXME 判断图片是否上传成功，若成功则只需重发图片，若不成功则需重新上传一次
                        var $p = that.prev().find('p');
                        if ($p.find('img').hasClass('uploadedFile')) {
                            isImgUploadSuccess = true;
                            answer = $p.html();
                        } else {
                            isImgUploadSuccess = false;
                            var base64 = $p.find('img').attr('src');
                            fnEvent.trigger('listMsg.imgUploadAgain', { 'base64': base64, 'token': msgId });
                        }
                    }
                    //重发消息
                    if (isImgUploadSuccess) {
                        fnEvent.trigger('sendArea.send', [{
                            'answer': answer,
                            'uid': global.apiInit.uid,
                            'cid': global.apiInit.cid,
                            'dateuid': msgId,
                            'currentState': global.currentState == 1 ? 'robot' : 'human',
                            'date': +new Date(),
                            'token': msgId,
                            'sendAgain': true //是否重发
                        }]);
                    }
                } else if (that.hasClass('close')) {
                    //点击关闭按钮 重新发送
                    that.removeClass('close msg-close').addClass('msg-fail error');
                    fnEvent.trigger('leftMsg.closeUploadImg', msgId);
                    //发送失败去掉蒙层
                    local.maskLayer(that, false);
                }
            },
            //相关搜索方法
            sugguestionsSearch: function(data, isHistory) {
                //显示评价机器人按钮  同意||反对
                if (data.answerType == '9' || data.answerType == '12') {
                    if (global.urlParams.evaluateFlag == 1 || global.urlParams.evaluateFlag == 0) {
                        evaluateFlag = !!global.urlParams.evaluateFlag;
                    } else {
                        evaluateFlag = !!(global.apiConfig.realuateFlag || 0);
                    }
                }
                var msgHtml = language['L10032'];
                if (data) {
                    var list = data.sugguestions;
                    var _answer = '';
                    if (data.answer) {
                        //因为历史记录和当前会话推送消息体不一样
                        if (Object.prototype.toString.call(data.answer) == '[object Object]') {
                            _answer = data.answer.msg;
                        } else {
                            _answer = data.answer;
                        }
                    }
                    var isShowManualBtn = false;
                    // if (global.apiConfig.type != 1) {
                    isShowManualBtn = sysMsgChannelHandler.onManualBtnShow(data);
                    // }
                    // console.log(wurl);
                    var comf = $.extend({
                        customLogo: global.apiConfig.robotLogo,
                        customName: global.apiConfig.robotName,
                        list: list,
                        isHistory: isHistory,
                        stripe: data.stripe,
                        answer: _answer,
                        manualTitle: languageText['T0060'],
                        showArtificial: isShowManualBtn,
                        wurl: wurl,
                        evaluateFlag: evaluateFlag, //是否显示机器人评价按钮
                        docId: data.docId,
                        docName: data.question,
                        robotFlag: data.robotFlag,
                        msgId: data.msgId
                    });
                    evaluateFlag = false;
                    msgHtml = doT.template(msgTemplate.listSugguestionsMsg)(comf);
                }
                updateChatMsgHandler.updateChatMsg(msgHtml);
            },
            //相关搜索答案点击事件
            onSugguestionsEvent: function() {
                var $this = $(this);
                var _txt = $this.text();
                var requestText = $this.attr('data-docid');
                if (_txt) {
                    //获取点击内容
                    var _msg = _txt.substr(0, _txt.indexOf('.')).trim();
                    var _data = [{
                        'answer': _msg,
                        'uid': global.apiInit.uid,
                        'cid': global.apiInit.cid,
                        'currentStatus': global.currentState == 2 ? 'human' : 'robot',
                        'requestType': 'question',
                        'token': '',
                        'requestText': requestText ? requestText : '', //点击相关搜索 要传入docid
                        'dateuid': global.apiInit.uid + +new Date(),
                        'sendAgain': false //是否重发
                    }];
                    clearInterval(sugguestionsTimer);
                    sugguestionsTimer = setTimeout(function() {
                        try {
                            fnEvent.trigger('sendArea.sendSugguestions', _data);
                        } catch (e) {
                            console.log(e);
                        }
                        local.onSendMsg(_data);
                        // msgBind(0, _data); //发送消息
                    }, 500);
                }
            },
            //处理未读消息
            unReadMessage: function(data) {
                var outerHTML = doT.template(msgTemplate.seperatorTemplate)({
                    't': '',
                    'msgTxt': languageText['T0059']
                });
                updateChatMsgHandler.updateChatMsg(outerHTML);
            },
            //会话结束判断
            // 1：人工客服离线导致用户下线
            // 2：被客服移除
            // 3：被列入黑单
            // 4：长时间不说话
            // 6：有新窗口打开
            sessionCloseHander: function(data) {
                clearInterval(overtimer); //停止超时提示任务
                var msg = '';
                if (data) {
                    switch (data.status) {
                        case 1:
                            msg = Comm.format(sysPromptLan.L0001, [data.aname], true);
                            break;
                        case 2:
                            // msg = Comm.format(sysPromptLan.L0001,[data.aname],true);
                            break;
                        case 3:
                            msg = Comm.format(sysPromptLan.L0001, [data.aname], true);
                            break;
                        case 4:
                            // msg = Comm.format($(global.apiConfig.userOutWord).text(), [data.aname], false);
                            msg = Comm.format(global.apiConfig.userOutWord, [data.aname], false);
                            break;
                        case 6:
                            msg = Comm.format(sysPromptLan.L0003, [data.aname], false);
                            break;
                    }
                }
                var tp = +new Date();
                var comf = $.extend({
                    sysMsg: msg,
                    sysMsgSign: tp,
                    date: tp
                });
                var outerHTML = doT.template(msgTemplate.sysMsg)(comf);
                updateChatMsgHandler.updateChatMsg(outerHTML);
            },
            //FIXME 超时提示语在收到对方下条提示语之前，当前只提示一次，直到用户下线为止
            msgOvertimeTask: function() {
                clearInterval(overtimer);
                //判断最后一条消息来源
                var userMsg = global.urlParams.userTipWord; //用户提示语
                var userDaley = global.apiConfig.userTipTime * 1000 * 60; //用户超时时间


                overtimer = setInterval(function() {
                    var _msg, _daley;
                    if (overtimeTask.lastMsgType == 1) { //取相反的值
                        //客服
                        _msg = adminMsg;
                        _daley = adminDaley;
                    } else if (overtimeTask.lastMsgType == 0) {
                        //用户
                        _msg = userMsg;
                        _daley = userDaley;
                    }
                    // console.log(overtimeTask.overtimeDaley);
                    if (overtimeTask.overtimeDaley * 1000 >= _daley) {
                        clearInterval(overtimer);
                        overtimeTask.overtimeDaley = 0; //超时时间重置为0
                        global.apiConfig.customInfo.data.content = _msg; //超时提示语
                        sysMsgChannelHandler.onJoinHTML(global.apiConfig.customInfo);
                    }
                    overtimeTask.overtimeDaley += 1; //超时时间
                }, 1000);
            },
            receiveAdminTipWord: function(data) {
                if (data.data.serviceOutDoc) {
                    adminMsg = data.data.serviceOutDoc; //客服提示语
                }
                if (data.data.serviceOutTime && data.data.serviceOutDoc) {
                    adminDaley = data.data.serviceOutTime * 1000 * 60;
                }
            },
            //输入栏高度变化设置
            onAutoSize: function(node) {
                clearInterval(autoTimer);
                autoTimer = setTimeout(function() {
                    var offsetTop = node.offset().top - $(topTitleBar).height();
                    scrollWrapHeight = offsetTop; //盒子高度
                    $(wrapScroll).height(offsetTop);
                    myScroll.myRefresh(); //刷新
                }, 300);
            },
            //正在输入处理
            onBeingInput: function() {
                var _t = setInterval(function() {
                    $('.input205').remove();
                    // myScroll.myRefresh(); //刷新
                }, 5 * 1000); //每隔5秒处理正在输入提示消息
            },
            //加载历史记录蒙板
            isLoadingHistoryMask: function() {
                var mask = '<div class="js-loadingHistoryMask loadingHistoryMask"><i></i></div>';
                $(document.body).append(mask);
                var $i = $('.js-loadingHistoryMask i');
                var $body = $(document.body);
                $i.offset({ top: ($body.height() - $i.height()) / 2, left: ($body.width() - $i.width()) / 2 });
            },
            onLoadingHistoryMask: function(e) {
                e.stopPropagation();
                e.preventDefault();
            },
            hideKeyboard: function(e) {

                $(".js-textarea").blur();
                if (window.localStorage) {
                    var _type = window.localStorage.getItem('inputStatus');
                    if (_type && _type == 'focus') {
                        setTimeout(function() { //uc iphone  不支持blur事件
                            var _input = $('<input class="js-cache-input" />');
                            $(document.body).append(_input);
                            _input.focus();
                            $(document.body).find('.js-cache-input').remove();
                        }, .2 * 1000);
                    }
                }
                //TODO  iframe里 该方法不能正常执行
                if (global.urlParams.from != 'iframe') {
                    fnEvent.trigger('listMsg.hideKeyboard', scrollWrapHeight);
                }
            },
            onSendAreaSysMsg: function(data) {
                sysMsgChannelHandler.onJoinHTML(data);
            }
        };
        var hideTimer;

        /********************************************************************************/
        /****************************本地图片处理消息类*************************************/
        /********************************************************************************/
        imgHandler = {
            //上传图片
            onUpLoadImg: function(data) {
                (function(timer) {
                    sendTime = 0;
                    uploadImgHandler[timer] = setInterval(function() {
                        if (sendTime >= 60) { //发送超过60秒判断上传失败
                            clearInterval(uploadImgHandler[timer]);
                            var $uid = $('#userMsg' + timer);
                            $uid.removeClass('close msg-close').addClass('error msg-fail');
                            //发送失败去掉蒙层
                            local.maskLayer($uid, false);
                            fnEvent.trigger('leftMsg.closeUploadImg', timer);
                        }
                        sendTime += 1;
                    }, 1000);
                })(data[0]['token']);
                imgHandler.startUploadImg(data);
            },
            startUploadImg: function(data) {
                global.uploadImgToken = data[0]['token'];
                global.msgSendACK.push(global.uploadImgToken); //暂存发送消息id
                comf = $.extend({
                    userLogo: userLogo,
                    uploadImg: data[0]['result'],
                    progress: 0,
                    //DENZEL
                    msgLoading: global.MSGSTATUSCLASS.MSG_LOADING,
                    // msgLoading: global.MSGSTATUSCLASS.MSG_CLOSE,
                    token: data[0]['token'],
                    date: data[0]['date']
                });
                msgHtml = doT.template(msgTemplate.rightImg)(comf);
                updateChatMsgHandler.updateChatMsg(msgHtml);
            },
            onUpLoadImgProgress: function(ret) {
                var data = ret.percentage;
                var token = ret.token;
                var $shadowLayer,
                    $progress,
                    $progressLayer;
                if (isUploadImg) {
                    $shadowLayer = $('#img' + token).find('.js-shadowLayer');
                    $progress = $('#progress' + token);
                    $progressLayer = $progress.parent('.js-progressLayer');
                }
                //蒙版高度随百分比改变
                $progress.text(data + '%');
                var floatData = data / 100; //获取小数
                if (floatData >= 1) {
                    //DENZEL
                    // $('#userMsg' + token).removeClass('error msg-loading msg-fail msg-close msg-sendAgain').addClass('msg-served');
                    isUploadImg = true; //开启上传图片
                    //DENZEL
                    local.maskLayer($('#userMsg' + token), false);
                    // $progress.remove();
                    // $shadowLayer.remove();
                    myScroll.myRefresh(); //刷新
                }
            },
            //回传图片路径地址
            onUploadImgUrl: function(data) {
                //FIXME 若是回传上传图片路径则不需要追加消息到聊天列表 直接去替换img即可
                var token = data[0]['token'];
                var img = data[0]['answer'];
                var $div = $('#img' + token);
                var $img = $div.find('p img');
                //DENZEL
                $img.attr('src', img).addClass('uploadedFile');
                // $img.attr('src', img);
                global.uploadImgToken = ''; //置空 一个流程完成
                local.maskLayer($('#userMsg' + token), false);
                //DNEZEL
                // $('#userMsg' + token).remove();
            },
            //图片展示
            onShowImg: function() {
                var that = $(this);
                var comf = $.extend({
                    // msg:'https://www.3987.com/ps/uploadfile/2013/0327/20130327045318527.jpg'
                    msg: that.attr('src')
                });
                var tmpHtml = doT.template(msgTemplate.showMsgLayer)(comf);
                $(document.body).append(tmpHtml);

                $('.js-showMsgLayer').animate({ 'transform': 'scale(1)', 'opacity': '1' }, 300, function() {
                    var $layer = $('.js-showMsgLayer');
                    var $img = $('.js-showMsgLayer').find('img');
                    setTimeout(function() {
                        $img.css({ 'margin-top': ($layer.height() - $img.height()) / 2 + 'px', 'opacity': '1' });
                    }, 100);
                });
                $('.js-showMsgLayer').on('click', function() {
                    $(this).animate({ 'opacity': '0' }, 300, function() {
                        $(this).remove();
                    });
                });
            }
        };

        var userLogo = global.userInfo.face || '//img.sobot.com/console/common/face/user.png';

        var outTimeTask = function() {
            // global.apiConfig.adminOutFlag = 1;
            // global.apiConfig.userOutFlag = 1;
            if (global.apiConfig.adminOutFlag && global.apiConfig.userOutFlag) {
                isOnlySideOutTimeFlag = 2;
            } else if (!global.apiConfig.adminOutFlag && !global.apiConfig.userOutFlag) {
                isOnlySideOutTimeFlag = 3;
            } else if (global.apiConfig.userOutFlag) {
                isOnlySideOutTimeFlag = 1;
            } else if (global.apiConfig.adminOutFlag) {
                isLoadingHistoryMask = 0;
            }
            //判断是否需要超时提示
            if (isOnlySideOutTimeFlag == 2 || isOnlySideOutTimeFlag == 1) {
                var _timer = setInterval(function() {
                    //若是人工则开始计算超时时间
                    if (global.currentState == 2) {
                        overtimeTask.lastMsgType = 0; //默认为最后一条为客服所发
                        local.msgOvertimeTask();
                        clearInterval(_timer);
                    }
                }, 1000);
            }
        }
        var parseDOM = function() {
            chatPanelList = $('.js-chatPanelList');
            topTitleBar = $('.js-header-back');
            wrapScroll = $('.js-wrapper');
            chatMsgList = $('.js-chatMsgList');
        };
        var bindListener = function() {
            fnEvent.on('sendArea.send', local.onSendMsg); //发送内容
            fnEvent.on('core.onreceive', local.onReceive); //接收回复
            fnEvent.on('core.msgresult', local.msgReceived); //消息确认收到通知
            //接收转人工成功后的信息
            fnEvent.on("core.transfersuccess", local.receiveAdminTipWord);
            fnEvent.on('sendArea.sendAreaSystemMsg', local.onSendAreaSysMsg); //输入框相关提示系统消息

            fnEvent.on('sendArea.createUploadImg', imgHandler.onUpLoadImg); //发送图片
            fnEvent.on('sendArea.uploadImgProcess', imgHandler.onUpLoadImgProgress); //上传进度条
            fnEvent.on('sendArea.uploadImgUrl', imgHandler.onUploadImgUrl); //回传图片路径

            // chatMsgList.on('click', local.hideKeyboard); //隐藏键盘
            chatMsgList.on('touchstart', local.hideKeyboard); //滑动隐藏键盘
            fnEvent.on('sendArea.autoSize', local.onAutoSize); //窗体聊天内容可视范围

            $(document.body).delegate('.js-loadingHistoryMask', 'touchmove', local.onLoadingHistoryMask);
            //第三方跳转处理
            fnEvent.on("sendArea.wurlHandler", local.wurlHandler);
            //FIXME EVENT
            $('.js-chatPanelList').delegate('.js-answerBtn', 'click', local.onSugguestionsEvent); //相关搜索答案点击事件
            $('.js-chatPanelList').delegate('.js-msgStatus', 'click', local.onMsgSendAgain); //消息重发
            $('.js-chatPanelList').delegate('.js-msgOuter img', 'click', imgHandler.onShowImg); //图片展示
        };
        var initPlagsin = function() {
            sendMsgChannelHandler = SendMsgChannelHandler(global, myScroll);
            sysMsgChannelHandler = SysMsgChannelHander(global, myScroll);
            updateChatMsgHandler = UpdateChatMsgHandler(global, myScroll);
            multiConvHandler =  MultiConv(global,'.js-chatMsgList',myScroll);    //多轮会话模块
            local.onBeingInput(); //正在输入处理
            local.isLoadingHistoryMask();
            outTimeTask(); //超时应用
        };
        var init = function() {
            parseDOM();
            bindListener();
            initPlagsin();
        };
        init();
    };
    module.exports = SysmsgHandler;
},{"../../../common/comm.js":1,"../../../common/util/listener.js":29,"../util/qqFace.js":66,"./multiConv.js":41,"./pushEvaHandler.js":45,"./sendMsgChannelHandler.js":48,"./sysMsgChannelHandler.js":49,"./template.js":50,"./updateChatMsg.js":54}],41:[function(require,module,exports){
//denzel 20171127
    var MultiConv = function(global, node, myScroll) {
        var node = $(node);
        var multiData = {};
        var That = {};
        var currentConvId; //当前多轮会话id

        var timer; //防止连续点击

        var multiTemplate = require('./multiTemplate.js'),
            msgTemplate = require('./template.js'),
            listener = require('../../../common/util/listener.js'),
            sendMsgChannelHandler = require('./sendMsgChannelHandler.js')(global, myScroll),
            multiConvItem = require('./multiConvItem.js')(global, node, myScroll);
        var clickItem; //可点击的项

        //聊天进入到多轮会话
        That.fn = function(data) {
            //获取多轮会话数据
            var htmlFn = '',
                htmlStr = '';
            multiData = data.multiDiaRespInfo;
            currentConvId = multiData.conversationId;
            //判断来源是接口获取或者填写选项
            if (multiData.inputContentList) {
                multiData.inputContentList = multiData.inputContentList.split(',').splice(0, 9).join(',');
                // 填写选项
                htmlFn = doT.template(multiTemplate.temp2_manual);
                htmlStr = htmlFn(multiData);
                multiData.answer = htmlStr;
                multiConvItem.htmlFormat(multiData, htmlStr, false);
            } else if (multiData.interfaceRetList) {
                //接口获取
                multiData.interfaceRetList = multiData.interfaceRetList.splice(0, 9);
                htmlFn = doT.template(multiTemplate['temp' + (multiData.template + 1)]);
                htmlStr = htmlFn(multiData);
                var tempFlag = (multiData.template == 0 || multiData.template == 2) ? true : false;
                //接口获取 15 进入多轮会话  151 多轮会话进行中  152 多轮会话正常结束   153  多轮会话异常退出
                switch (data.answerType) {
                    case '15':
                    case '151':
                        multiData.answer = tempFlag ? multiData.remindQuestion : htmlStr;
                        break;
                    case '152':
                        multiData.answer = tempFlag ? multiData.answerStrip : htmlStr;
                        currentConvId = ''; //会话结束则清空当前多轮wfytid
                        break;
                    case '153':
                        multiData.answer = multiData.retErrorMsg;
                        tempFlag = false;
                        currentConvId = ''; //会话结束则清空当前多轮wfytid
                        break;
                }
                multiConvItem.htmlFormat(multiData, htmlStr, tempFlag);
            } else {
                //输入超长或类型不符等
                switch (multiData.retCode) {
                    case '000000':
                        multiData.answer = multiData.remindQuestion;
                        multiConvItem.htmlFormat(multiData, multiData.remindQuestion, false);
                        break;
                    case '000001':
                        multiData.answer = multiData.retErrorMsg;
                        currentConvId = ''; //会话结束则清空当前多轮wfytid
                        multiConvItem.htmlFormat(multiData, multiData.retErrorMsg, false);
                        break;
                    case '000002':
                        multiData.answer = multiData.retErrorMsg;
                        // currentConvId = '';
                        multiConvItem.htmlFormat(multiData, multiData.retErrorMsg, false);
                        break;
                    default:
                        multiData.answer = multiData.retErrorMsg;
                        currentConvId = '';
                        multiConvItem.htmlFormat(multiData, multiData.retErrorMsg, false);
                        break;
                }
            }
        };



        //手动填写
        var manualClickFn = function(el) {
            var template = 1;
            var questionFlag = 2; //多轮会话
            var requestText = {};
            // requestText[multiData.outPutParamList] = el.text();
            requestText[el.attr('data-output')] = el.text();
            requestText.level = Number(el.attr('data-level'));
            requestText.conversationId = multiData.conversationId;
            var ret = [{
                questionFlag: 2,
                requestText: requestText,
                answer: el.text(),
                currentStatus: 'robot',
                dateuid: global.apiInit.uid + +new Date(),
                uid: global.apiInit.uid,
                cid: global.apiInit.cid,
                sendAgain: false
            }];
            return ret;
        };
        //接口获取
        var autoClickFn = function(el) {
            var template = el.attr('data-temp');
            // var itemData = multiData.interfaceRetList[el.index()];
            var itemData = JSON.parse(el.attr('data-content'));
            var question = {
                "interfaceRetList": [itemData],
                "template": Number(template)
            };
            var title = '';
            if (Number(template) === 1) {
                try {
                    title = question.interfaceRetList[0].title;
                } catch (e) {
                    console.log('params title error...');
                }
            }
            // var outPutParamListStr = multiData.outPutParamList;
            var outPutParamListStr = el.attr('data-param');
            var outPutParamListArr = [];
            var outData = {};
            (outPutParamListStr.split('#') || []).forEach(function(item) {
                outData[item] = itemData[item];
            });
            outData['level'] = Number(el.attr('data-level'));
            outData['conversationId'] = multiData.conversationId;
            //requestText ==requestText  question==answer
            var ret = [{
                answer: Number(template) == 1 ? title : JSON.stringify(question),
                requestText: outData,
                questionFlag: 2,
                currentStatus: 'robot', //必传机器人
                dateuid: global.apiInit.uid + +new Date(),
                uid: global.apiInit.uid,
                cid: global.apiInit.cid,
                sendAgain: false
            }];
            return ret;
        };
        //点击多轮选项
        var clickItemFn = function(evn) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                var that = $(evn.currentTarget);
                var ret; //最终结果
                var flag = false;
                //判断是否是当前多轮会话
                var oId = that.attr('data-id')
                if (oId === currentConvId) {
                    if (that.attr('data-type') === 'manual') {
                        //手动填写
                        ret = manualClickFn(that);
                    } else {
                        ret = autoClickFn(that);
                    }
                    try {
                        var _data = ret[0];
                        if (_data.answer.indexOf('{') >= 0) {
                            flag = true;
                            _data.text = JSON.parse(_data.answer).interfaceRetList[0].title;
                        }
                    } catch (e) {

                    }
                    listener.trigger('multiConv.send', ret);
                    sendMsgChannelHandler.onSendMsg(ret, flag); //true表示页面渲染时显示text 不显示answer
                } else {
                    node.find('li[data-id="' + oId + '"]').css('background-color', '#f8f8f8');
                }
            }, 1000 * .5); //0.5秒内不可二次点击
        };
        var bindListener = function() {
            multiConvItem.resizeWidth();
        };
        var initPlugins = function() {};
        var parseDom = function() {
            node.delegate('.js-multi-item', 'click', clickItemFn);
        };
        var init = function() {
            parseDom();
            bindListener();
            initPlugins();
        };
        init();
        return That;
    };

    module.exports = MultiConv;
},{"../../../common/util/listener.js":29,"./multiConvItem.js":42,"./multiTemplate.js":43,"./sendMsgChannelHandler.js":48,"./template.js":50}],42:[function(require,module,exports){
    var MultiConvItem = function(global, node, myScroll) {
        var that = {};
        var QQFace = require('../util/qqFace.js')(),
            sysMsgChannelHander = require('./sysMsgChannelHandler.js')(global, myScroll),
            updateChatMsgHandler = require('./updateChatMsg.js')(global, myScroll),
            msgTemplate = require('./template.js'),
            listener = require('../../../common/util/listener.js'),
            Comm = require('../../../common/comm.js');
        var language = global.language.lan,
            languageText = global.language.text;
        //第三方跳转
        var wurl = "",
            wurlOpenStyle = false;
        var wurlHandler = function(data) {
            wurl = data.wurl;
            wurlOpenStyle = data.wurlOpenStyle;
        };
        //多轮会话机器人返回数据
        that.htmlFormat = function(multiData, htmlStr, tempFlag, isHistoryFlag) {
            var htmlTags = ['<a', '<img', '<frame', '<audio', '<video', '<iframe', '<IFRAME', '<EMBED', '<embed'],
                htmlMutex = false,
                evaluateFlag = false,
                showArtificial = false;
            var logo, name, msg;
            msg = QQFace.analysis(multiData.answer || ''); //过滤表情;
            var ret = sysMsgChannelHander.onManualBtnShow(multiData) || [];
            showArtificial = ret[0] || false;
            evaluateFlag = ret[1] || false;
            logo = global.apiConfig.robotLogo;
            name = global.apiConfig.robotName;
            var index = msg.indexOf('webchat_img_upload');
            var res,
                imgStatus;
            //判断是否是富文本
            if (index >= 0) {
                imgStatus = 'imgStatus';
                res = msg;
            }
            htmlTags.forEach(function(item) {
                if (msg.indexOf(item) >= 0) {
                    htmlMutex = true;
                }
            });
            if (htmlMutex) {
                res = msg;
            } else {
                res = Comm.getNewUrlRegex(msg);
            }
            var comf = {
                customLogo: logo,
                customName: name,
                customMsg: res,
                manualTitle: languageText['T0060'],
                imgStatus: imgStatus,
                date: +new Date(),
                showArtificial: showArtificial,
                wurl: wurl,
                wurlOpenStyle: wurlOpenStyle,
                evaluateFlag: evaluateFlag, //是否显示机器人评价按钮
                docId: multiData.docId,
                docName: multiData.question,
                robotFlag: multiData.robotFlag,
                msgId: multiData.msgId
            }
            var tempFn = doT.template(msgTemplate.leftMsg);
            var tempHtml = tempFn(comf) + (tempFlag ? htmlStr : '');
            if (isHistoryFlag) {
                return tempHtml;
            }
            updateChatMsgHandler.updateChatMsg(tempHtml);
            that.resizeWidth();
        };
        //计算各个模板的内容宽度
        that.resizeWidth = function(el) {
            //模板一适配
            node = el || node;
            var width = node.width();
            var p1_1w = width - 100,
                p1_2w = width - 100,
                p1_3w = width - 190;
            var el = node.find('.temp1 .content');
            el.find('.title').css('max-width', p1_1w);
            el.find('.sub-title').css('max-width', p1_2w);
            el.find('.describe').css('max-width', p1_3w);
            //模板三
            var el3 = node.find('.temp3 .content');
            p3_2w = width - 100;
            p3_title = width - 150;
            el3.find('.multi-msg').css('max-width', p3_2w);
            el3.find('.multi-title').css('max-width', p3_title);
        };
        var bindListener = function() {
            listener.on("sendArea.wurlHandler", wurlHandler);
        };
        var init = function() {
            bindListener();
        }
        init();
        return that;
    };
    module.exports = MultiConvItem;
},{"../../../common/comm.js":1,"../../../common/util/listener.js":29,"../util/qqFace.js":66,"./sysMsgChannelHandler.js":49,"./template.js":50,"./updateChatMsg.js":54}],43:[function(require,module,exports){
    var template = {};

    template.temp1_old = '<ul class="template-conv template-conv-item temp1">'+
        ' <li class="item">'+
        '<img src="https://img.sobot.com/console/common/face/robot.png">'+
        '<div class="content">'+
        '<p>变形金刚III</p>'+
        '<p>主演有斯皮尔博格，李连杰</p>'+
        '<p>评分：8.5</p>'+
        '</div>'+
        '</li>'+
        '</ul>';

    template.temp1 =  '{{if(it.retCode==="000000"){ }}' +
        '<ul class="template-conv temp1">'+
        '{{for(var i=0;i<it.interfaceRetList.length;i++){ }}'+
        '{{var data = it.interfaceRetList[i];}}'+
        '<li class="item js-multi-item" data-param="{{=it.outPutParamList}}" data-content=\'{{=JSON.stringify(data)}}\' data-level="{{=it.level}}" data-id="{{=it.conversationId}}" data-temp="{{=it.template}}">'+
        '<a href="{{=it.endFlag?(data.anchor||("javascript:void(0);")):"javascript:void(0);"}}" target="_blank">'+
        '{{if(data.thumbnail){ }}'+
        '<img class="temp1-img" src="{{=data.thumbnail}}">'+
        '{{ }else{ }}'+
        '<span class="temp1-img" style="display: inline-block;"></span>'+
        '{{ } }}'+
        '</a>'+
        '<div class="content">'+
        '<a href="{{=it.endFlag?(data.anchor||("javascript:void(0);")):"javascript:void(0);"}}" target="_blank"><span class="title m_item">{{=data.title||""}}</span></a>'+
        '<span class="sub-title m_item">{{=data.summary||""}}</span>'+
        '<span class="describe m_item">{{=data.label||""}}</span>'+
        '</div>'+
        '<i class="tag">{{=data.tag||""}}</i>'+
        '</li>'+
        '{{ } }}'+
        '</ul>'+
        '{{ }else{ }}'+
        '<div class="template-conv template-conv-item">'+
        '<div class="error">'+
        '{{=it.retErrorMsg||""}}'+
        '</div>'+
        '</div>'+
        '{{ } }}';


    template.temp2 = '<div class="multi-conv-temp2 template-conv-item temp2">'+
        '{{if(it.retCode==="000000"){ }}'+
        '<h1>{{=(it.remindQuestion||it.answerStrip)}}</h1>'+
        '<ul>'+
        '{{for(var i=0;i<it.interfaceRetList.length;i++){ }}'+
        '{{var data = it.interfaceRetList[i];}}'+
        '<li data-param="{{=it.outPutParamList}}" data-content=\'{{=JSON.stringify(data)}}\' data-level="{{=it.level}}" class="js-multi-item" data-id="{{=it.conversationId}}" data-temp="{{=it.template}}">'+
        '<a class="temp-a" href="{{=it.endFlag?(data.anchor||("javascript:void(0);")):"javascript:void(0);"}}">'+
        '{{=data.title||""}}</a></li>'+
        '{{ } }}'+
        '</ul>'+
        '{{ }else{ }}'+
        '<div class="error">'+
        '<div class="error">'+
        '{{=it.retErrorMsg||""}}'+
        '</div>'+
        '</div>'+
        '{{ } }}'+
        '</div>';

    template.temp2_manual = '<div class="multi-conv-temp2 template-conv-item temp2">'+
        '{{if(it.retCode==="000000"){ }}'+
        '<h1>{{=(it.remindQuestion||it.answerStrip)}}</h1>'+
        '<ul>'+
        '{{for(var i=0;i<it.inputContentList.split(",").length;i++){ }}'+
        '{{var data = it.inputContentList.split(",")[i];}}'+
        '<li data-output="{{=it.outPutParamList}}" data-content="{{=data}}" data-level="{{=it.level}}" data-id="{{=it.conversationId}}" data-type="manual" class="js-multi-item">{{=data||""}}</li>'+
        '{{ } }}'+
        '</ul>'+
        '{{ }else{ }}'+
        '<div class="error">'+
        '{{=it.retErrorMsg||""}}'+
        '</div>'+
        '{{ } }}'+
        '</div>';

    template.temp3 = '<div class="multi-conv-temp3 template-conv-item temp3">'+
        '{{if(it.retCode==="000000"){ }}'+
        '<ul>'+
        '{{for(var i=0;i<it.interfaceRetList.length;i++) { }}'+
        '{{var data = it.interfaceRetList[i];}}'+
        '<li data-param="{{=it.outPutParamList}}" data-content=\'{{=JSON.stringify(data)}}\' data-level="{{=it.level}}" class="js-multi-item" data-id="{{=it.conversationId}}" data-temp="{{=it.template}}">'+
        '<a href="{{=it.endFlag?(data.anchor||("javascript:void(0);")):"javascript:void(0);"}}">'+
        '{{if(data.thumbnail){ }}'+
        '<img src="{{=data.thumbnail}}">'+
        '{{  } }}'+
        '<div class="content">'+
        '<span class="multi-title">{{=data.title||""}}</span>'+
        '<p class="multi-msg">{{=data.summary}}</p>'+
        '</div>'+
        '<span class="tags">{{=data.tag||""}}</span>'+
        '</a>'+
        '</li>'+
        '{{ } }}'+
        '</ul>'+
        '{{ }else{ }}'+
        '<div class="error">'+
        '{{=it.retErrorMsg||"--"}}'+
        '</div>'+
        '{{ } }}'+
        '</div> ';

    template.temp4 = '<div class="multi-conv-temp4 template-conv-item temp4">'+
        '{{if(it.retCode==="000000"){ }}'+
        '{{var data=it.interfaceRetList.length>0?it.interfaceRetList[0]:[];}}'+
        '{{if(data.thumbnail){ }}'+
        '<img class="temp4-img" src="{{=data.thumbnail}}">'+
        '{{ } }}'+
        '<div class="content">'+
        '<span class="title">{{=data.title||""}}</span>'+
        '<p class="describe">{{=data.summary||""}}</p>'+
        '<a href="{{=data.anchor||"javascript:void(0);"}}" class="check-detail" target="_blank">查看详情 &gt;</a>'+
        '</div>'+
        '{{ }else{ }} '+
        '<div class="error">'+
        '{{=it.retErrorMsg||""}}'+
        '</div>'+
        '{{ } }}'+
        '</div>';

    template.temp5 = '<div><p>{{=it.answerStrip||""}}</p><p>{{=it.interfaceRetList[0].title}}</p></div';


    module.exports = template;


},{}],44:[function(require,module,exports){
    var NoticeHandler = function(global, myScroll) {

        var fnEvent = require('../../../common/util/listener.js');
        var msgTemplate = require('./template.js');
        var QQFace = require('../util/qqFace.js')();
        var Comm = require('../../../common/comm.js');
        var UpdateChatMsgHandler = require('./updateChatMsg.js');
        var SysMsgChannelHandler = require('./sysMsgChannelHandler.js');

        //Dom元素
        var chatPanelList;

        var language = global.language.lan,
            languageText = global.language.text;

        var msgOuter = {
            L001: '收起',
            L002: '展开'
        };

        //展开  折叠
        var onFlips = function() {
            var $this = $(this);
            if ($this.hasClass('expand')) {
                $('.js-note-msg').removeClass('mui-ellipsis-5');
                $this.addClass('collapse').removeClass('expand').text(msgOuter.L001);
            } else {
                $this.addClass('expand').removeClass('collapse').text(msgOuter.L002);
                $('.js-note-msg').addClass('mui-ellipsis-5');
            }
            myScroll.myRefresh();
        };

        //计算行数
        var countLines = function(ele) {
            var styles = window.getComputedStyle(ele[0], null);
            var lh = parseInt(styles.lineHeight, 10);
            var h = parseInt(styles.height, 10);
            var lc = Math.round(h / lh);
            // console.log('line count:', lc, 'line-height:', lh, 'height:', h);
            return lc;
        }
        var parseDom = function() {
            chatPanelList = $('.js-chatPanelList');
        }
        var bindListener = function() {
            chatPanelList.on('click', '.js-flips', onFlips);
        };
        var initPlugins = function() {};
        var init = function() {
            parseDom();
            bindListener();
            initPlugins();
        };
        init();

    };
    module.exports = NoticeHandler;

},{"../../../common/comm.js":1,"../../../common/util/listener.js":29,"../util/qqFace.js":66,"./sysMsgChannelHandler.js":49,"./template.js":50,"./updateChatMsg.js":54}],45:[function(require,module,exports){
    /*
     * @author daijm
     */
    var pushEvaHandler = function(global, window,_data) {
        var listener = require('../../../common/util/listener.js');
        var template = require('./template.js');
        var showTip = require('../util/showTip.js');
        var $ajax = require("../../../common/util/monitAjax.js")(global);
        var $outerNode,
            isRepeat = true,
            score = 0,
            config = {},
            solved = 1;
        var language = global.language.lan,
            languageText = global.language.text,
            color = global.userInfo.color ? global.userInfo.color : global.apiConfig.color;
        var humanChooseStar = function() {
            $aLi = $outerNode.find("#pushStar li");
            var iStar = 0;
            for (var i = 1; i <= $aLi.length; i++) {
                $aLi[i - 1].index = i;
                //点击后进行评分处理
                $($aLi[i - 1]).bind("click", function() {
                    iStar = this.index;
                    fnPoint(iStar);
                    switch (iStar) {
                        case 1: //一星
                        case 2: //二星
                        case 3: //三星
                        case 4: //四星
                            score = iStar;
                            underFiveStarHandler();
                            if (score > 2 && !$outerNode.find(".js-unSolved").hasClass("unsolveActive") && config[0].isQuestionFlag === 1) {

                                $outerNode.find(".js-solved").addClass("solveActive");
                                $outerNode.find(".js-solved").css({ "background": color, "border": "1px solid " + color });
                                $outerNode.find(".js-unSolved").css({ "background": "#fff", "border": "1px solid #d6dbe5" });
                                $outerNode.find(".js-unSolved").removeClass("unsolveActive");
                            };
                            break;
                        case 5: //五星
                            score = 5;
                            if (!$outerNode.find(".js-unSolved").hasClass("unsolveActive") && config[0].isQuestionFlag === 1) {
                                $outerNode.find(".js-solved").addClass("solveActive");
                                $outerNode.find(".js-solved").css({ "background": color, "border": "1px solid " + color });
                                $outerNode.find(".js-unSolved").css({ "background": "#fff", "border": "1px solid #d6dbe5" });
                                $outerNode.find(".js-unSolved").removeClass("unsolveActive");
                                solved=1;
                            }else if($outerNode.find(".js-unSolved").hasClass("unsolveActive")&& config[0].isQuestionFlag === 1){
                                solved=0;

                            };
                            commitEvaluate();
                            $outerNode.undelegate();
                            // $outerNode.find(".js-solved").addClass("solveActive");
                            // $outerNode.find(".js-solved").css({ "background": color, "border": "1px solid " + color });
                            // $outerNode.find(".js-unSolved").remove();
                            break;
                    }

                })
            }
        };
        var underFiveStarHandler = function() {
            var solveActive = 0;
            if ($outerNode.find(".js-solved").hasClass("solveActive")) {
                solveActive = 1;
            } else if ($outerNode.find(".js-unSolved").hasClass("unsolveActive")) {
                solveActive = 2;
            } else {
                solveActive = 0;
            };
            var conf = {
                "score": score,
                //0为推送评价
                "sourceType": 0,
                "commentType": 0,
                "from": "push",
                "solveActive": solveActive
            };
            listener.trigger("listMsg.toDetailEvaluate", conf);
        };
        var fnPoint = function(iArg) {
            //分数赋值
            for (var i = 0; i < $aLi.length; i++) {
                $aLi[i].className = i < iArg ? "on" : "";
            }

        };
        // var closePushEvaHandler = function() {
        //     $outerNode.find(".js-toDetailEvaluate").css("display", "none");
        //     $outerNode.find(".js-commit").css("display", "none");
        //     $outerNode.find(".js-commited").css("display", "block");
        //     // $outerNode.find("#pushStar li").unbind();
        // };
        // var lowFourStarHandler = function() {
        //     $outerNode.find('.js-toDetailEvaluate').css("display", "block");
        // };
        // var fiveStarHandler = function() {
        //     $outerNode.find('.js-toDetailEvaluate').css("display", "none");
        // };
        var commitEvaluate = function() {
            if (isRepeat) {
                isRepeat = false;
                if (config[0].isQuestionFlag != 1) {
                    solved = -1;
                }

                $.ajax({
                    type: "post",
                    url: "/chat/user/comment.action",
                    dataType: "json",
                    data: {
                        cid: global.apiInit.cid,
                        visitorId: global.apiInit.uid,
                        score: score,
                        tag: "",
                        remark: "",
                        solved: solved,
                        //0,邀请评价，1为主动评价
                        commentType: 0,
                        //邀请评价只能为人工
                        type: 1
                    },
                    success: function(req) {
                        if (req.status === 1) {
                            //closePushEvaHandler();
                            var conf = {
                                'language': language,
                                'languageText': languageText
                            };
                            $outerNode.find("#pushStar li").unbind();
                            $outerNode.find(".js-moregood").html(languageText['T0025']);
                            //var evamsgHtml = doT.template(template.evamsgHtml)(conf);
                            // $(".js-wrapBox").append(evamsgHtml);
                            //推送系统消息
                            // var evaluateSystem = { type: 'system', status: 'evaluate', data: { content: languageText['T0025'] } }
                            // listener.trigger('sendArea.sendAreaSystemMsg', evaluateSystem);
                            showTipObj.show(languageText['T0032']);
                        } else {
                            var conf = {
                                'language': language,
                                'languageText': languageText
                            };
                            //var evamsgHtml2 = doT.template(template.evamsgHtml2)(conf);
                            //$(".js-wrapBox").append(evamsgHtml2);
                            showTipObj.show(languageText['T0033']);
                            // setTimeout(function() {
                            //     $('.js-evamsg').remove();
                            // }, 3000);
                        }
                    },
                    //请检查网络链接
                    error: function() {
                        //Alert.hide();
                        var conf = {
                            'language': language,
                            'languageText': languageText
                        };
                        //var evamsgHtml2 = doT.template(template.evamsgHtml2)(conf);
                        //$(".js-mainBox").append(evamsgHtml2);
                        showTipObj.show(languageText['T0032']);
                        // setTimeout(function() {
                        //     $('.js-evamsg').remove();
                        // }, 3000)
                    }
                });

            }
            setTimeout(function() {
                isRepeat = true;
            }, 4000)
        };
        var reTopushEavHandler = function() {
            humanChooseStar();
        };
        var receiveDetailEavHandler = function(data) {
            $aLi = $outerNode.find("#pushStar li");
            var iStar = data.score,
                solved = data.solved;
            if (solved == 1) {
                $outerNode.find(".js-unSolved").removeClass("unsolveActive");
                $outerNode.find(".js-unSolved").css({ "background": "#fff", "border": "1px solid #d6dbe5" });
                $outerNode.find(".js-solved").css({ "background": color, "border": "1px solid " + color });
                $outerNode.find(".js-solved").removeClass("defaultSolveActive").addClass("solveActive");
            } else if (solved == 0) {
                $outerNode.find(".js-solved").removeClass("solveActive");
                $outerNode.find(".js-solved").css({ "background": "#fff", "border": "1px solid #d6dbe5" });
                $outerNode.find(".js-unSolved").addClass("unsolveActive");
                $outerNode.find(".js-unSolved").css({ "background": color, "border": "1px solid " + color });
            }
            fnPoint(iStar);

            $outerNode.undelegate();
            $outerNode.find("#pushStar li").unbind();
            $outerNode.find(".js-moregood").html(languageText['T0025']);
        };

        //初始化Dom
        var parseDOM = function() {
            $mainBox = $(".js-mainBox");
            $chatPanelList = $(".js-chatPanelList");
        };
        var bindListener = function() {
            //跳至侧边评价窗口
            $outerNode.delegate(".js-commit", "click", commitEvaluate);
            //listener.on('listMsg.closePushEva', closePushEvaHandler);
            //接收大窗口评价内容
            listener.on('sendArea.toPushEav', receiveDetailEavHandler);
            //从大窗评价点叉退出，还可以操作系统消息的评价；
            listener.on('sendArea.reTopushEav', reTopushEavHandler);
            $outerNode.delegate(".js-solved", "click", function() {
                if (!$(this).hasClass("solveActive")) {
                    $(this).addClass("solveActive");
                    $(this).css({ "background": color, "border": "1px solid " + color });
                    $outerNode.find(".unsolveActive").css({ "background": "#fff", "border": "1px solid #d6dbe5" });
                    $outerNode.find(".js-unSolved").removeClass("unsolveActive");
                };
                solved = 1;
            });
            $outerNode.delegate(".js-unSolved", "click", function() {
                if (!$(this).hasClass("unsolveActive")) {
                    $(this).addClass("unsolveActive");
                    $(this).css({ "background": color, "border": "1px solid " + color });
                    $outerNode.find(".solveActive").css({ "background": "#fff", "border": "1px solid #d6dbe5" });
                    $outerNode.find(".js-solved").removeClass("solveActive");
                }
                solved = 0;
            });
        };
        var initConfig = function() {
            $ajax({
                type: "get",
                url: "/chat/user/satisfactionMessage.action",
                dataType: "json",
                data: {
                    uid: global.apiInit.uid
                },
                success: function(req) {
                    if (req.status === 1) {
                        config = req.data;
                        //吐司提示
                        showTipObj = showTip(global);
                        if ($chatPanelList.find(".js-zhichipushEva")) {
                            $chatPanelList.find(".js-zhichipushEva").remove();
                        };
                        var subName=_data.aname.length>4?_data.aname.substr(0,4)+'...':_data.aname
                        var conf = {
                            "config": config,
                            "language": language,
                            "languageText": languageText,
                            "subName":subName
                        };
                        var _html = doT.template(template.pushEvaMsg)(conf);
                        $outerNode = $(_html);
                        $chatPanelList.append($outerNode);
                        humanChooseStar();
                        listener.trigger("listMsg.scrollToBottom");
                        bindListener();
                    };
                },
                //请检查网络链接
                error: function() {
                    showTip.show('请检查网络链接');
                }
            });


        }
        var init = function() {
            parseDOM();
            initConfig();
        };
        init();
    };
    module.exports = pushEvaHandler;
},{"../../../common/util/listener.js":29,"../../../common/util/monitAjax.js":30,"../util/showTip.js":67,"./template.js":50}],46:[function(require,module,exports){
    var PushGoodsInfo = function(global, myScroll) {
        var That = {};
        var listener = require('../../../common/util/listener.js');
        var msgTemplate = require('./template.js');
        var QQFace = require('../util/qqFace.js')();
        var Comm = require('../../../common/comm.js');
        var UpdateChatMsgHandler = require('./updateChatMsg.js');
        var updateChatMsgHandler;

        //dom
        var node;

        var loaded = function(cbk) {
            var data = global.activeData ? (global.activeData.msg || []) : [];
            data.forEach(function(item) {
                var msg = Comm.getNewUrlRegex(item['content'].trim());
                //FIXME 机器人与人工客服都要进行消息确认
                item.logo = item.logo || 'https://img.sobot.com/console/common/face/admin.png';
                var comf = $.extend({
                    logo: item.logo,
                    name: item.name,
                    content: QQFace.analysisRight(item.content),
                    date: item.msgId,
                    msgId: item.msgId,
                    type: item.type,
                    icon: item.icon,
                    label: item.label,
                    title: item.title,
                    url: item.url
                });
                var msgHtml = doT.template(msgTemplate.leftGoodsMsg)(comf);
                updateChatMsgHandler.updateChatMsg(msgHtml);
            });
            cbk && cbk(1);
        };
        var mutex = true;
        var onOuterFn = function(e) {
            e.stopPropagation();
            // e.preventDefault();
        };
        var t = +new Date();
        var onOuterMFn = function(e) {
            if (+new Date() - t > 100) {
                e = e || event;
                var el = $(e.currentTarget);
                // el.parents('.js-msgOuter').css('border', '1px solid red');
                var url = el.attr('data-url');
                window.location.href = url;
                window.event.returnValue = false;
                // console.log(url);
                // $('.js-textarea').text(url);
                // window.open(url, 'blank');
            }
            t = +new Date();
        };
        var parseDom = function() {
            node = $('.js-chatPanelList');
        };
        var initPlugins = function() {
            updateChatMsgHandler = UpdateChatMsgHandler(global, myScroll);
        };
        var bindListener = function() {
            node.delegate('.js-outer-url', 'touchstart', onOuterFn);
            node.delegate('.js-outer-url', 'click', onOuterMFn);
            // node.delegate('.content-ware-title', 'click', onOuterMFn);
        };
        var init = function() {
            parseDom();
            bindListener();
            initPlugins();
        };
        init();
        That.loaded = loaded;
        return That;
    };
    module.exports = PushGoodsInfo;

},{"../../../common/comm.js":1,"../../../common/util/listener.js":29,"../util/qqFace.js":66,"./template.js":50,"./updateChatMsg.js":54}],47:[function(require,module,exports){
    /*
     * @author denzel
     */
    var ScrollHandler = function(global, node) {
        var offlineMessageFilter = require("../../../common/mode/offlineMessageFilter.js");
        var That = {};
        var pullDown, //下拉刷新
            wrapScroll; //滚动窗体
        var scroll;
        var language = global.language.lan,
            languageText = global.language.text;
        //api接口
        var api = {
            url_queryUserCids: '/chat/user/queryUserCids.action', //查询cid列表  uid  time  [分钟数]
            url_getChatDetailByCid: '/chat/user/getChatDetailByCid.action' //查询历史消息 uid cid
        };
        var cidsList = []; //会话id列表

        //初始化滚动插件
        var initScroll = function() {
            if (scroll) {
                return;
            } else {
                scroll = new IScroll(wrapScroll[0], {
                    // scrollX:true,
                    probeType: 3,
                    tap: true,
                    click: true, // 是否支持点击事件 FIXME 需要设置为TRUE 否则重新接入无法点击
                    mouseWheel: true, // 是否支持鼠标滚轮
                    useTransition: true,
                    preventDefault:true,//默认为true  改这里是为了在多轮会话中支持横向滑动
                    preventDefaultException: {
                        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|P)$/
                    },
                    useTransform: true,
                    snap: false,
                    scrollbars: false, // 是否显示滚动条
                    bounce: true, // 边界反弹
                    momentum: true // 是否惯性滑动
                    //  startY : -300
                });
            }
        };
        //开始下拉刷新
        var scrollStart = function() {
            var y = scroll.y,
                maxY = scroll.maxScrollY - y;
            if (global.flags.moreHistroy) {
                if (y >= 40) {
                    $(pullDown).text(languageText['T0003']);
                    $(pullDown).addClass('loading');
                    return "";
                }
            } else {
                $(pullDown).text(languageText['T0004']);
                $(pullDown).removeClass('loading');
            }
            if ((y < scroll.maxScrollY) && (scroll.pointY < 1)) {
                That.myRefresh();
                return;
            } else if (scroll.y > 0 && (scroll.pointY > window.innerHeight - 1)) {
                That.myRefresh();
                return;
            }
        };

        var isLoadCids = function(cbk) {
            if (pullDown.hasClass('js-get-cids-flag')) {
                pullDown.removeClass('js-get-cids-flag');
                var time = parseInt(global.urlParams.time);
                time = time != time ? 0 : time;
                $.ajax({
                    type: "post",
                    url: api.url_queryUserCids,
                    dataType: "json",
                    data: {
                        uid: global.apiInit.uid,
                        time: time //分钟数
                    },
                    success: function(data) {
                        if (data && data.status) {
                            cidsList = data.cids || [];
                            cbk && cbk();
                        }
                    }
                });
            } else {
                cbk && cbk();
            }
        };

        //下拉刷新
        That.pullDown = function(callback) {
            var child = $('.js-chatPanelList').children().first().attr('date');
            var nexChild = $('.js-chatPanelList').children().eq(1).attr('date');
            var t = child ? child : nexChild;
            //有更多历史记录
            if (scroll.y >= 40) {
                isLoadCids(function(ret) {
                    if (cidsList && cidsList.length > 0) {
                        getChatDetailByCid(callback);
                    } else {
                        global.flags.moreHistroy = false;
                    }
                });
            }
            scrollStart();
            // $('.js-textarea').text('滚动');
        };

        var getChatDetailByCid = function(callback) {
            $.ajax({
                type: "post",
                url: api.url_getChatDetailByCid,
                dataType: "json",
                data: {
                    uid: global.apiInit.uid,
                    cid: cidsList.pop()
                },
                success: function(data) {


                    if (data && data.length > 0) {

                        var arr = offlineMessageFilter(data);
                        callback && callback(data);
                    } else if (cidsList && cidsList.length > 0) {

                        getChatDetailByCid(callback);
                    } else{

                        callback && callback(data);
                    }
                }
            });
        }
        var scrollTo = function(y) {
            scroll.scrollTo(0, y);
        };


        //刷新页面
        That.myRefresh = function() {
            setTimeout(function() {
                scroll.refresh(); //刷新
                scroll.scrollTo(0, scroll.maxScrollY);
            }, 200);
        };
        var parseDom = function() {
            pullDown = $(node).find('.js-pullDownLabel');
            wrapScroll = $('.js-wrapper');
        };
        var bindListener = function() {
            // scroll.on('scroll', scrollStart);
        };
        var init = function() {
            parseDom();
            initScroll();
            bindListener();
        };
        init();
        That.scroll = scroll;
        That.scrollTo = scrollTo;
        return That;
    };
    module.exports = ScrollHandler;

},{"../../../common/mode/offlineMessageFilter.js":15}],48:[function(require,module,exports){
    var SendMsgChannelHandler = function(global,myScroll){

        var That = {};

        var fnEvent = require('../../../common/util/listener.js');
        var msgTemplate = require('./template.js');
        var QQFace = require('../util/qqFace.js')();
        var Comm = require('../../../common/comm.js');
        var UpdateChatMsgHandler = require('./updateChatMsg.js');

        var imgHanlder = {
            userLogo: '//img.sobot.com/console/common/face/user.png'
        };

        var updateChatMsgHandler;

        var userLogo = global.userInfo.face || imgHanlder.userLogo;

        //发送消息
        var onSendMsg = function(data,status){
            var msg;
            if(status){
                msg =Comm.getNewUrlRegex(data[0]['text'].trim());
            }else{
                msg = Comm.getNewUrlRegex(data[0]['answer'].trim());
            }
            //FIXME 机器人与人工客服都要进行消息确认
            global.msgSendACK.push(data[0]['dateuid']); //暂存发送消息id
            var comf = $.extend({
                userLogo: userLogo,
                userMsg: QQFace.analysisRight(msg),
                date: data[0]['date'],
                msgId: data[0]['dateuid'],
                msgLoading: global.MSGSTATUSCLASS.MSG_LOADING //消息确认
            });
            var msgHtml = doT.template(msgTemplate.rightMsg)(comf);
            updateChatMsgHandler.updateChatMsg(msgHtml);
        };
        var initPlugins = function(){
            updateChatMsgHandler = UpdateChatMsgHandler(global,myScroll);
        };
        var bindListener = function(){
            fnEvent.on('sendArea.send',onSendMsg); //发送内容
        };
        var init = function(){
            initPlugins();
        };
        init();
        That.onSendMsg = onSendMsg;
        return That;
    };
    module.exports = SendMsgChannelHandler;

},{"../../../common/comm.js":1,"../../../common/util/listener.js":29,"../util/qqFace.js":66,"./template.js":50,"./updateChatMsg.js":54}],49:[function(require,module,exports){
    var SysMsgChannelHandler = function(global, myScroll) {
        var language = global.language.lan,
            languageText = global.language.text;
        var listener = require("../../../common/util/listener.js");
        var UpdateChatMsgHandler = require('./updateChatMsg.js');
        var Comm = require('../../../common/comm.js');
        var msgTemplate = require('./template.js');
        var QQFace = require('../util/qqFace.js')();
        var fnEvent = require('../../../common/util/listener.js');
        var updateChatMsgHandler;
        var evaluate = require('./evaluateRobot.js');
        var language = global.language.lan,
            languageText = global.language.text;
        var That = {},
            //未知问题次数
            unknowCount = 0,
            wurl = "",
            wurlOpenStyle = false;

        var evaluateFlag = false; //是否显示评价机器人按钮
        //组装 html
        var onJoinHTML = function(data) {
            //系统提示 人工，机器 人欢迎语
            var _type = data.type;
            var _data = data.data;
            //判断是否是系统回复
            if (_type == 'system') {
                // onSysMsgShow(_data.content, data.status);
                onSysMsgShow(_data.content, data.status, _data.status);
            } else {
                //1 机器人  2 客服
                global.currentState = _type == 'robot' ? 1 : 2;
                onMsgFromCustom(_type, _data);
            }
        };

        //是否消息体显示转人工
        var onManualBtnShow = function(data,status) {
            var ret = false;
            evaluateFlag = false;
            //消息类型处理
            switch (data.answerType) {
                //直接回答
                case "1":
                case "9":
                    //问题后追回转人工按钮 非仅机器人
                    if (global.urlParams.manualTypeObj.direct === "1" && global.apiConfig.type != 1) {
                        ret = true;
                    }

                    //显示评价机器人按钮  (同意||反对 )
                    if (global.urlParams.evaluateFlag == 1 || global.urlParams.evaluateFlag == 0) {
                        evaluateFlag = !!global.urlParams.evaluateFlag;
                    } else {
                        evaluateFlag = !!(global.apiConfig.realuateFlag || 0);
                    }
                    break;
                //理解回答
                case "2":
                    //问题后追回转人工按钮
                    if (global.urlParams.manualTypeObj.under === "1" && global.apiConfig.type != 1) {
                        ret = true;
                    }
                    break;
                //未知回答
                case "3":
                    //参数设置遇到未知问题显示转人工按钮
                    if (global.urlParams.chatConnectButton === 1 && global.apiConfig.type != 1) {
                        unknowCount++;

                        if (unknowCount == global.urlParams.manualBtnCount) {
                            listener.trigger('listMsg.showChatSwitch');
                        }
                    }
                    //问题后追回转人工按钮
                    if (global.urlParams.manualTypeObj.unknow === "1" && global.apiConfig.type != 1) {
                        ret = true;
                    }
                    break;
                //引导回答
                case "4":
                    //问题后追回转人工按钮
                    if (global.urlParams.manualTypeObj.guide === "1" && global.apiConfig.type != 1) {
                        ret = true;
                    }
                //本地寒暄
                case 5:
                    break;
                //百科寒暄
                case 6:
                    break;
                //第三方
                case 7:
                    break;
                //互联网百科
                case 8:
                    break;
                //simsimi
                case 9: //关联问题
                    break;
                case 10:
                    break;
                case '11':
                case '12':
                    // case '14':
                    //包含匹配
                    if (global.urlParams.manualTypeObj.guide === "1" && global.apiConfig.type != 1) {
                        ret = true;
                    }
                    //显示评价机器人按钮  (同意||反对)
                    if (global.urlParams.evaluateFlag == 1 || global.urlParams.evaluateFlag == 0) {
                        evaluateFlag = !!global.urlParams.evaluateFlag;
                    } else {
                        evaluateFlag = !!(global.apiConfig.realuateFlag || 0);
                    }
                    break;
            }
            //多轮会话使用
            if(status){
                return [ret,evaluate];
            }
            return ret;
        };
        var wurlHandler = function(data) {
            wurl = data.wurl;
            wurlOpenStyle = data.wurlOpenStyle;
        }


        //来自于客服的消息
        var onMsgFromCustom = function(type, data) {
            var htmlTags = ['<a', '<img', '<frame', '<audio','<video','<iframe','<IFRAME','<EMBED','<embed'],
                htmlMutex = false;
            evaluateFlag = false;
            var logo,
                name,
                msg,
                showArtificial = false;
            if (global.outerFrameStatus == 'collapse') {
                global.unReadCount++;
            }

            if (type == 'robot') {
                msg = QQFace.analysis(data.answer || ''); //过滤表情;
                // msg = data.answer;
                //消息类型处理
                // if (global.apiConfig.type != 1) { //仅机器人的时候不出现转人工
                showArtificial = onManualBtnShow(data);
                // }
                logo = global.apiConfig.robotLogo;
                name = global.apiConfig.robotName;
            } else if (type == 'human') {
                msg = QQFace.analysis(data.content || ''); //过滤表情
                logo = data.aface;
                name = data.aname;
            }
            var index = msg.indexOf('webchat_img_upload');
            var res,
                imgStatus;
            //判断是否是富文本
            if (index >= 0) {
                imgStatus = 'imgStatus';
                res = msg;
            }
            htmlTags.forEach(function(item) {
                if (msg.indexOf(item) >= 0) {
                    htmlMutex = true;
                }
            });
            if (htmlMutex) {
                res = msg;
            } else {
                res = Comm.getNewUrlRegex(msg);
            }
            // if (msg.indexOf('<') >= 0 && msg.indexOf('>') >= 0) {
            //   res = msg;
            // } else {
            //   res = Comm.getNewUrlRegex(msg);
            // }
            var comf = $.extend({
                customLogo: logo,
                customName: name,
                customMsg: res,
                manualTitle: languageText['T0060'],
                imgStatus: imgStatus,
                date: +new Date(),
                showArtificial: showArtificial,
                wurl: wurl,
                wurlOpenStyle: wurlOpenStyle,
                evaluateFlag: evaluateFlag, //是否显示机器人评价按钮
                docId: data.docId,
                docName: data.question,
                robotFlag: data.robotFlag,
                msgId: data.msgId
            });
            var tmpHtml = doT.template(msgTemplate.leftMsg)(comf);
            updateChatMsgHandler.updateChatMsg(tmpHtml);
        };

        //系统消息显示
        var onSysMsgShow = function(msg, status, from) {
            //生成时间戳
            var tp = +new Date();
            var msgTmp = '',
                msgIndex, //消息下标
                msgType; //是否是永驻信息提示
            //是否包含需要处理的系统提示语
            msgIndex = global.keyword.indexOf(status);
            if (msgIndex >= 0) {
                global.keywordManager.push(tp); //用于系统提示判断
                msgType = global.keyword[msgIndex];
            } else if (status == 205) {
                msgTmp = 'input205';
                $('.input205').remove(); //移除class
                if (msg === '') { //客服输入为空或敲回车发送消息
                    return '';
                }
                msg = languageText['T0020'];
            }
            //移除排队信息
            if (status === 'transfer') {
                $('.' + global.keyword[0]).remove();
            };
            // console.log(status)
            // console.log(from);
            //转人工排队已满五秒跳留言
            if (status === 'queue' && from == 7) {
                setTimeout(function() {
                    if (global.urlParams.isLeaveCustomSysFlag) {
                        window.open(global.urlParams.leaveCustomUrl, '_self');
                    }
                    // else {
                    //     console.log(666);
                    //     listener.trigger("sendArea.openleaveMsgPage");
                    // }
                    //  $(document.body).trigger('listMsg-queue');
                }, 5000);
            }

            var comf = $.extend({
                sysMsg: msg,
                sysMsgSign: tp,
                date: tp,
                msgTmp: msgTmp,
                msgType: msgType
            });
            var msgHtml = doT.template(msgTemplate.sysMsg)(comf);
            updateChatMsgHandler.updateChatMsg(msgHtml);
        };
        var initPlugins = function() {
            updateChatMsgHandler = UpdateChatMsgHandler(global, myScroll);
            //第三方跳转处理
            fnEvent.on("sendArea.wurlHandler", wurlHandler);
        };
        var init = function() {
            initPlugins();
        };
        init();
        That.onJoinHTML = onJoinHTML;
        That.onMsgFromCustom = onMsgFromCustom;
        That.onSysMsgShow = onSysMsgShow;
        That.onManualBtnShow = onManualBtnShow;
        return That;
    };
    module.exports = SysMsgChannelHandler;

},{"../../../common/comm.js":1,"../../../common/util/listener.js":29,"../util/qqFace.js":66,"./evaluateRobot.js":35,"./template.js":50,"./updateChatMsg.js":54}],50:[function(require,module,exports){
    /*
     * @author denzel
     */
    var template = {};


    var seperatorTemplate = '' +
        '<div class="seperator-line" date="{{=it.t}}">------&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{=it.msgTxt}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;------</div>' +
        '';

    var leftMsg =
        '<div class="js-left-msg msgwrap leftMsg {{=it.imgStatus}}  {{= it.showArtificial || it.evaluateFlag ? "show-manual-service" : ""}}"  date="{{=it.date}}">' +
        '<div class="header">' +
        '<img src="{{=it.customLogo}}" alt="" />' +
        '</div>' +
        '<p class="r-name">' +
        '{{=it.customName}}' +
        '</p>' +
        '<div class="msgOuter js-msgOuter" data-robotflag="{{=it.robotFlag||""}}" data-msgid="{{=it.msgId || ""}}" data-docid="{{=it.docId||""}}" data-docname="{{=it.docName||""}}" style="position:relative;{{=it.evaluateFlag ? "min-width:50%;" : ""}}" >' +
        '<p>' +
        '{{=it.customMsg}}' +
        '</p>' +
        '{{if(it.showArtificial&&!it.wurl){}}' +
        '<span class="js-artificial js-manual-remove msgArtificial">{{=it.manualTitle}}</span>' +
        '{{}}}' +
        '{{if(it.showArtificial&&it.wurl){ }}' +
        '{{if(it.wurlOpenStyle){ }}' +
        '<a target="_blank" href="{{=it.wurl}}" class="js-manual-remove msgArtificial">{{=it.manualTitle}}</a>' +
        '{{ }else{ }}' +
        '<a target="_parent" href="{{=it.wurl}}" class="js-manual-remove msgArtificial">{{=it.manualTitle}}</a>' +
        '{{ } }}' +
        '{{ } }}' +
        '{{ if(it.evaluateFlag) { }}' +
        '<div class="js-evaluate-wrap evaluate-wrap">' +
        '<a class="js-tap-evaluate com-evaluate up-evaluate" data-id="1"></a>' +
        '<a class="js-tap-evaluate com-evaluate down-evaluate" data-id="-1"></a>' +
        '<span class="js-evaluated-outer evaluated-outer">{{=it.evaluatedOuter||""}}</span>' +
        '</div>' +
        '{{ } }}' +
        '<div style="clear:both"></div>' +
        '</div>' +
        //'<span class="msgStatus statusLeft"></span>'+
        '{{if(it.showArtificial || it.evaluateFlag){}}' +
        '<span class="js-manual-remove msgArtificialDot"></span>' +
        '{{}}}' +
        '</div>';

    var listSugguestionsMsg =
        '<div class="msgwrap leftMsg js-left-msg  {{= it.showArtificial || it.evaluateFlag ? "show-manual-service" : ""}}"" date="{{=it.date}}">' +
        '<div class="header">' +
        '<img src="{{=it.customLogo}}" alt="" />' +
        '</div>' +
        '<p class="r-name">' +
        '{{=it.customName}}' +
        '</p>' +
        '<div class="msgOuter js-msgOuter" data-robotflag="{{=it.robotFlag||""}}" data-msgid="{{=it.msgId || ""}}" data-docid="{{=it.docId||""}}" data-docname="{{=it.docName||""}}">' +
        '<div style="margin-bottom:10px;">' +
        '{{=it.answer?it.answer:""}}' +
        '</div>' +
        '<p>' +
        '{{=it.stripe?it.stripe:""}}' +
        '</p>' +
        '<ul class="sugguestions">' +
        '{{for(var i=0,lan=it.list || [];i<lan.length;i++){ }}' +
        '{{if(it.isHistory){ }}' +
        '<li>' +
        '<a href="#0" class="js-answerBtn" style="color:#596273">{{=i+1}}. {{=it.list[i]}}</a>' +
        '</li>' +
        '{{}else{}}' +
        '<li>' +
        '<a href="#0" class="js-answerBtn" style="color:#596273" data-docid="{{=it.list[i]["docId"]}}">{{=i+1}}. {{=it.list[i]["question"]}}</a>' +
        '</li>' +
        '{{}}}' +
        '{{ } }}' +
        '</ul>' +
        '{{if(it.showArtificial&&!it.wurl){}}' +
        '<span class="js-artificial js-manual-remove msgArtificial">{{=it.manualTitle}}</span>' +
        '{{}}}' +
        '{{if(it.showArtificial&&it.wurl){ }}' +
        '<a href="{{=it.wurl}}" class="js-manual-remove msgArtificial">{{=it.manualTitle}}</a>' +
        '{{ } }}' +
        '{{ if(it.evaluateFlag) { }}' +
        '<div class="js-evaluate-wrap evaluate-wrap">' +
        '<a class="js-tap-evaluate com-evaluate up-evaluate" data-id="1"></a>' +
        '<a class="js-tap-evaluate com-evaluate down-evaluate" data-id="-1"></a>' +
        '<span class="js-evaluated-outer evaluated-outer">{{=it.evaluatedOuter||""}}</span>' +
        '</div>' +
        '{{ } }}' +
        '<div style="clear:both"></div>' +
        '</div>' +
        '</div>' +
        '{{if(it.showArtificial || it.evaluateFlag){}}' +
        '<span class="js-manual-remove msgArtificialDot"></span>' +
        '{{}}}' +
        '</div>';

    var rightMsg =

        '<div class="msgwrap rightMsg {{=it.imgStatus}}" date="{{=it.date}}">' +
        '<div class="header">' +
        '<img src="{{=it.userLogo}}" alt="" />' +
        '</div>' +
        '<div class="msgOuter js-userMsgOuter js-msgOuter">' +
        '<p>' +
        '{{=it.userMsg}}' +
        '</p>' +
        '</div>' +
        '<span id="userMsg{{=it.msgId}}" class="msg js-msgStatus msgStatus statusRight {{=it.msgLoading}}"></span>' +
        '</div>' +
        '</div>';

    var rightImg =
        '<div class="msgwrap rightMsg rightImg" date="{{=it.date}}">' +
        '<div class="header">' +
        '<img src="{{=it.userLogo}}" alt="" />' +
        '</div>' +
        '<div id="img{{=it.token}}" class="msgOuter js-userMsgOuter js-msgOuter">' +
        '<p>' +
        '<img src="{{=it.uploadImg}}"' +
        '</p>' +
        '<div class="shadowLayer js-shadowLayer">' +
        '</div>' +
        '<div class="progressLayer js-progressLayer">' +
        '<span id="progress{{=it.token}}" class="progress js-progress">{{=it.progress}}</span>' +
        '</div>' +
        '</div>' +
        '<span id="userMsg{{=it.token}}" class="img close js-msgStatus msgStatus statusRight {{=it.msgLoading}}"></span>' +
        '</div>' +
        '</div>';

    var systemMsg =
        '<div class="js-sysMsg sysMsg {{=it.msgType}} {{=it.msgTmp}}" id={{=it.sysMsgSign}} date="{{=it.date}}">' +
        '<span class="sysMsgText"> ' +
        '{{=it.sysMsg}}' +
        '</span>' +
        '</div>';


    var systemData =
        '<p class="sysData" date="{{=it.date}}">' +
        '{{=it.sysData}}' +
        '</p>';

    var showMsgLayer =
        '<div class="js-showMsgLayer showMsgLayer">' +
        '<div class="js-msgLayer msgLayer">' +
        '<img src="{{=it.msg}}" />' +
        '</div>' +
        '</div>';

    var zoomImgLayer =
        '<section class="imgzoom_pack">' +
        '<div class="imgzoom_x">X</div>' +
        '<div class="imgzoom_img"><img src="" /></div>' +
        '</section>';

    var offlineMessageTipBubble = '<span class="offline-message-bubble">' +
        '{{=it.count}} {{=it.msgTxt}}' +
        '</span>';


    var noteTemp = '<div class="chatMsgList leftMsg ">' +
        '<div class="js-notice note js-msgOuter">' +
        '<span class="note-icon"></span>' +
        '<div class="js-note-msg note-msg">' +
        '{{=it.msg}}' +
        '</div>' +
        '<span class="js-flips flips expand">展开</span>' +
        '</div>' +
        '</div>';
    var pushEvaMsg = '<div class="js-sysMsg sysMsg zhichipushEva js-zhichipushEva">' +
        '<div class="systemMsg">' +
        '<div class="systemMsgPushEva">' +
        '<div class="pushEvaluate js-pushEvaluate">' +
        '{{if(it.config[0].isQuestionFlag){}}' +
        '<div class="operateType">' +
        '<p class="operateTypeTitle">{{=it.subName}}{{=it.languageText.T0106}}</p>' +
        '<div class="operateTypeBtn">' +
        '<p class="solve solved js-solved defaultSolveActive"><span></span>{{=it.languageText.T0041}}</p>' +
        '<p class="solve unSolved js-unSolved" style="margin-left:25px;"><span></span>{{=it.languageText.T0042}}</p>' +
        '</div>' +
        '</div>' +
        '{{}}}' +
        '<p class="pushEvaTitle">{{=it.subName}}{{=it.languageText.T0093}}</p>' +
        '<div id="pushStar">' +
        '<ul>' +
        '<li><a href="javascript:;">1</a></li>' +
        '<li><a href="javascript:;">2</a></li>' +
        '<li><a href="javascript:;">3</a></li>' +
        '<li><a href="javascript:;">4</a></li>' +
        '<li class="js-commit"><a href="javascript:;">5</a></li>' +
        '</ul>' +
        '</div>' +
        '<p class="moregood js-moregood">{{=it.languageText.T0107}}</p>' +
        // '<div class="btnGroup">'+
        //     '<span class="js-toDetailEvaluate toDetailEvaluate" style="display:none">{{=it.languageText.T0094}}</span>'+
        // '</div>'+
        '</div>' +
        // '<span class="js-commit commit">{{=it.languageText.T0095}}</span>'+
        // '<span class="js-commited commited" style="display:none;"><i class="commitedIco"></i>{{=it.languageText.T0025}}</span>'+
        '</div>' +
        '</div>' +
        '</div>';

    var evamsgHtml =
        '<div class="js-evamsg evamsg"><p>{{=it.language.T0037}}</p></div>';
    var evamsgHtml2 = '<div class="js-showTip showTip" style="color:#cb1f16"><p>{{=it.language.T0038}}</p></div>';

    var evaluateRobotHtml = '{{ if (it.type ==1) { }}' +
        '<div><ul><li><a class="js-evalute-up" href="javascript:;/></li><li><a class="js-evaluate-down" href="javascript:;/></li></ul></div>'
    '{{ } else if (it.type ==2){ }}' +
    '<div><span>{{=it.msgOuter}}</span></div>'
    '{{ } }}';

    var goods1Html = '<div class="js-goods-wrap goods-wrap">' +
        '<div class="js-goods-thum goods-thum">' +
        '<img src="{{=it.thum}}" />' +
        '</div>' +
        '<div class="js-goods-detail goods-detail">' +
        '<p class="js-goods-title goods-title margin-left">{{=it.title}}</p>' +
        '<p class="js-goods-abstract goods-abstract margin-left">{{=it.abstract}}</p>' +
        '<p class="js-goods-label  goods-label margin-left"><span class="rmb-icon"></span>{{=it.label}}</p>' +
        '<button class="js-goods-send  goods-send">发送</button>' +
        '</div>' +
        '</div>';

    var leftGoodsMsg = '<div class="js-left-msg msgwrap leftMsg"  date="{{=it.date}}">' +
        '<div class="header">' +
        '<img src="{{=it.logo}}" alt="" />' +
        '</div>' +
        '<p class="r-name">' +
        '{{=it.name}}' +
        '</p>' +
        '<div class="msgOuter js-msgOuter">' +
        '{{if(it.type===1){ }}'+
        '<p>' +
        '{{=it.content}}' +
        '</p>' +
        '{{ }else{ }}'+
        '<div data-url="{{=it.url}}" class="js-outer-url">'+
        '<div class="content-ware-msg">'+
        '<div class="content-ware-left  content-ware">'+
        '<img src="{{=it.icon}}" />'+
        '</div>'+
        '<div class="content-ware-right conetnt-ware">'+
        '<a href="javascript:;" style="color: #333 !important;display:block;" data-url="{{=it.url}}" class="content-ware-title js-outer-url">'+
        '{{=it.title}}'+
        '</a>'+
        '<a href="javascript:;" style="color: #999999 !important;display:block;" data-url="{{=it.url}}" class="content-ware-detail js-outer-url">'+
        '{{=it.content}}'+
        '</a>'+
        '<a href="javascript:;" data-url="{{=it.url}}" class="content-ware-lable js-outer-url">'+
        '{{=it.label}}'+
        '</a>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '{{ } }}'+
        '<div style="clear:both"></div>' +
        '</div>';

    template.offlineMessageTipBubble = offlineMessageTipBubble;
    template.leftMsg = leftMsg;
    template.rightMsg = rightMsg;
    template.seperatorTemplate = seperatorTemplate;
    template.rightImg = rightImg;
    template.sysMsg = systemMsg;
    template.sysData = systemData;
    template.showMsgLayer = showMsgLayer;
    template.zoomImgLayer = zoomImgLayer;
    template.listSugguestionsMsg = listSugguestionsMsg;
    template.noteTemp = noteTemp;
    template.pushEvaMsg = pushEvaMsg;
    template.evamsgHtml = evamsgHtml;
    template.evamsgHtml2 = evamsgHtml2;
    template.evaluateRobotHtml = evaluateRobotHtml;
    template.goods1Html = goods1Html;
    template.leftGoodsMsg = leftGoodsMsg;

    module.exports = template;

},{}],51:[function(require,module,exports){
    /*
     * @author denzel
     */

//H5聊天页样式及颜色设置

    var Theme = function(global,node){

        var topTitleBar,//顶部返回栏
            userMsgBg,//用户聊天背景
            chatWrap,//聊天窗体
            setStyle,//style css
            companyTitle;//公司名称

        //是否显示顶部状态栏
        var isShowTopTitleBar = function(){
            if(global.userInfo.back && global.userInfo.back == 1) {
                $(topTitleBar).addClass('show');
                $(chatWrap).addClass('addTop');
            } else {
                $(chatWrap).removeClass('addTop');
            }
        };
        //设置主题样式
        var setThemeColor = function(){
            var color = global.userInfo.color?global.userInfo.color: global.apiConfig.color;
            $(setStyle).html('.rightMsg .msgOuter::before{border-color:transparent ' + color + ' !important} '+
                '.rightMsg .msgOuter{background-color:' + color + ' !important}'+
                '.wrap .header-back{background-color:'+color+' !important}'
            );
        };
        //设置客户信息
        var setCustomInfo = function(){
            //配置公司名
            // var title = global.apiConfig.companyName&&global.apiConfig.companyName.length > 12 ? global.apiConfig.companyName.substr(0,12) + '..' : global.apiConfig.companyName
            // var title = global.apiConfig.robotName;
            // companyTitle.text(title);
        };
        var parseDom = function(){
            topTitleBar = node.find('.js-header-back');
            userMsgBg = node.find('.js-userMsgOuter');
            chatWrap = node.find('.js-wrapper');
            setStyle = $('.js-setStyle');
            companyTitle = node.find('.js-title');
        };
        var initPlugins = function(){
            isShowTopTitleBar();
            setThemeColor();
            setCustomInfo();
        };
        var init = function(){
            parseDom();
            initPlugins();
        };
        init();
    };
    module.exports = Theme;

},{}],52:[function(require,module,exports){
    var TimeLineHandler = function(global){

        var That = {};
        var language = global.language.lan,
            languageText = global.language.text;

        var msgTemplate = require('./template.js');

        var getTimeLine = function(data,tp,oldTp,theFirst){
            //时间线显示
            var ret='',//返回结果
                tl,//时间线
                type;//0 当天  1上一天 2更久历史
            if(oldTp){
                var curTime = new Date();
                var _t = Math.abs(curTime - new Date(tp.substr(0,tp.indexOf(' '))))/1000/60/60/24;
                oldTp = oldTp.replace(/-/g,'/');
                tp = tp.replace(/-/g,'/');
                var _m = Math.abs(new Date(oldTp)- new Date(tp))/1000/60;
                if(Number(_m)>1){ //大于一分钟 才有意义继续执行
                    //0 当天  1上一天 2更久历史
                    type = _t<=1 ? 0 : _t>1 && _t<=2 ? 1 : 2;
                    var _date = tp.substring(0,tp.lastIndexOf(':'));
                    var _time = tp.substring(tp.indexOf(' '),tp.lastIndexOf(':'));
                    switch (type) {
                        case 0:
                            tl=  languageText['T0011']+ _time;
                            break;
                        case 1:
                            tl = languageText['T0013']+_time;
                            break;
                        case 2:
                            tl = _date;
                            break;
                    }
                    var comf = $.extend({
                        sysData:tl,
                        date:+new Date()
                    });
                    ret = doT.template(msgTemplate.sysData)(comf);
                }
            }
            //FIXME 首次进入 显示时间线
            if(theFirst){
                var _time = new Date();
                var _hour = _time.getHours()>9?_time.getHours():'0'+_time.getHours();
                var _minutes = _time.getMinutes()>9?_time.getMinutes():'0'+_time.getMinutes();
                var _ret = languageText['T0011']+' '+_hour+':'+_minutes;
                var comf = $.extend({
                    sysData:_ret,
                    date:+_time
                });
                ret = doT.template(msgTemplate.sysData)(comf);
            }
            return ret;
        };

        That.getTimeLine = getTimeLine;
        return That;

    };
    module.exports = TimeLineHandler;

},{"./template.js":50}],53:[function(require,module,exports){
    var UnReadHandler = function(global, myScroll) {

        var fnEvent = require('../../../common/util/listener.js');
        var msgTemplate = require('./template.js');

        var language = global.language.lan,
            languageText = global.language.text;

        global.unReadCount = 0;
        var onPostMessage = function(evt) {
            var data;
            if (typeof evt.data === 'string') {
                try {
                    data = JSON.parse(evt.data);
                } catch (e) {}

            } else {
                data = evt.data;
            }
            if (data.name == 'offlineMessage') {
                if ($(".seperator-line").length == 0) {
                    fnEvent.trigger("core.onreceive", {
                        'type': 'human',
                        'list': [{
                            'type': -110
                        }]
                    });
                }
                data.data.type = 202;
                data.data.msg = data.data.content;
                fnEvent.trigger("core.onreceive", {
                    'type': "human",
                    'list': [data.data]
                });
            }
            if (data.name == "collapse") {
                global.outerFrameStatus = data.name;
                global.unReadCount = 0;
                if ($(".seperator-line").length > 0)
                    $(".seperator-line").remove();
                fnEvent.trigger("core.onreceive", {
                    'type': 'human',
                    'list': [{
                        'type': -110
                    }]
                });
            } else if (data.name == 'expand') {
                global.outerFrameStatus = data.name;
                if (global.unReadCount === 0) {
                    $(".seperator-line").remove();
                    $(".offline-message-bubble").remove();
                } else {
                    initOfflineMessageBubble(global.unReadCount);
                }
            }
        };
        var initOfflineMessageBubble = function(count) {
            if (count < 10)
                return;
            var spanHtml = doT.template(msgTemplate.offlineMessageTipBubble)({
                'count': count,
                'msgTxt': languageText['T0058']
            });
            var $span = $(spanHtml);
            if (global.urlParams.back == 1 && global.urlParams.from !== 'iframe') {
                $span.css("top", 50);
            }
            $(".js-wrapper").append($span);
            $span.on('click', function() {
                $span.remove();
                $(".js-textarea").blur();
                if ($(".seperator-line").length > 0) {
                    setTimeout(function() {
                        var top = $(".seperator-line").offset().top - $(".js-chatMsgList").offset().top;
                        myScroll.scrollTo(-top);
                    }, 1000);
                }
            });
        };
        var bindListener = function() {
            $(window).on("message", onPostMessage);
        };
        var init = function() {
            bindListener();
        };
        init();
    };
    module.exports = UnReadHandler;

},{"../../../common/util/listener.js":29,"./template.js":50}],54:[function(require,module,exports){
    var UpdateChatMsg = function(global, myScroll) {

        var That = {};

        var chatPanelList, //滚动列表
            wrapBox;

        var language = global.language.lan,
            languageText = global.language.text;

        var Comm = require('../../../common/comm.js');
        var fnEvent = require('../../../common/util/listener.js');
        var msgTemplate = require('./template.js');

        //更新聊天记录
        var updateChatMsg = function(tempHtml) {
            if (chatPanelList && chatPanelList.children().length) {
                var lastDom = chatPanelList.children().last();
                var _m = Math.abs(new Date() - new Date(Number(lastDom.attr('date')))) / 1000 / 60;
                //超一分钟 显示 时间线
                if (_m > 1 && !lastDom.hasClass('sysData')) {
                    var _t = new Date();
                    var hour = _t.getHours() >= 10 ? _t.getHours() : '0' + _t.getHours(),
                        minutes = _t.getMinutes() >= 10 ? _t.getMinutes() : '0' + _t.getMinutes(),
                        _time = languageText['T0011'] + ' ' + hour + ':' + minutes;
                    var comf = $.extend({
                        sysData: _time,
                        date: +new Date()
                    });
                    tempHtml = doT.template(msgTemplate.sysData)(comf) + tempHtml;
                }
            }
            chatPanelList.append(tempHtml);
            //FIXME 永存消息只显示最新的一条  当转人工后 需删除排除或不在线提示
            if (global.keywordManager.length > 1) {
                var sign = global.keywordManager.shift();
                $('#' + sign).animate({ 'margin-top': '-30px', opacity: '0' }, 100, function() {
                    $(this).remove();
                });
            }
            if (global.currentState === 2 && global.apiInit.ustatus !== 0) { // 0 是未建立会话
                var sign = global.keywordManager[0];
                var $sign = $('#' + sign);
                if (!$sign.hasClass('firstEvaluate') && !$sign.hasClass('evaluated')) {
                    $sign.animate({ 'margin-top': '-30px', opacity: '0' }, 100, function() {
                        $(this).remove();
                    });
                }
            }
            //FIXME 处理android手机截断聊天内容问题 重新渲染一次
            if (global.UAInfo.UA == 'android') {
                $(wrapBox).css('font-size', '0.99em');
                setTimeout(function() {
                    $(wrapBox).css('font-size', '1em');
                }, 200);
            }
            myScroll.myRefresh(); //刷新
        };
        //显示商品消息
        var appendGoods = function(tempHtml) {
            chatPanelList.append(tempHtml);
            myScroll.myRefresh(); //刷新
        };
        var parseDom = function() {
            chatPanelList = $('.js-chatPanelList');
            wrapBox = $('.js-wrapBox')[0];
        };
        var init = function() {
            parseDom();
        };
        init();

        That.updateChatMsg = updateChatMsg;
        That.appendGoods = appendGoods;

        return That;
    };
    module.exports = UpdateChatMsg;

},{"../../../common/comm.js":1,"../../../common/util/listener.js":29,"./template.js":50}],55:[function(require,module,exports){
    function Adapter(phoneType, browserType, browserInfo) {
        // alert(phoneType);
        // alert(browserType);
        // alert(browserInfo);
        //输入框遮罩只能输入单行，否则出兼容问题
        var isFirstPopInputFlag = true;
        try {
            if (window.localStorage) {
                isFirstPopInputFlag = window.localStorage.getItem('isFirstPopInputFlag')
            }
        } catch (e) {}
        var isInIframe = window.parent !== window;
        if (!isInIframe) {
            //iphone6+下的safri浏览器和qq浏览器和微信浏览器,beequick为爱鲜峰app内嵌浏览器
            if (phoneType == "iphone-6+" && browserInfo.indexOf('11_') == -1) {
                $(".js-chatArea").css({ "top": "277px" });
                setTimeout(function() {
                    $(window).scrollTop('1');
                }, 50)
            } else if (phoneType == "iphone-6+") {
            }
            if (phoneType == "iphone-6+" && browserType == "mqqbrowser") {
                $(".js-chatArea").css({ "top": "273px" });
                setTimeout(function() {
                    $(window).scrollTop('1');
                }, 50)
            }
            if (phoneType == "iphone-6+" && (browserType == "micromessenger" || browserType == "qq") && browserInfo.indexOf('11_') == -1) {
                $(".js-chatArea").css({ "top": "277px" });
                setTimeout(function() {
                    $(window).scrollTop('1');
                }, 50)
            } else if (phoneType == "iphone-6+" && (browserType == "micromessenger" || browserType == "qq")) {
                if (isFirstPopInputFlag == 'true') {
                    $(".js-chatArea").css({ "bottom": "47px" });
                }
            }
            if (phoneType == "iphone-6+" && browserType == "ucbrowser") {
                $(".js-chatArea").css({ "top": "302px" });
                setTimeout(function() {
                    $(window).scrollTop('1');
                }, 50)
            }

            //iphone6特殊浏览器单独处理
            //app的webview

            if (phoneType == "iphone-6" && browserInfo.indexOf('11_') == -1) {
                setTimeout(function() {
                    $(".js-chatArea").css({ "bottom": "0px" });
                    $(window).scrollTop('333');
                }, 400);
            } else if (phoneType == "iphone-6") {
                // alert(1);
            }
            if (phoneType == "iphone-6" && browserType == "safari" && browserInfo.indexOf('11_') == -1) {
                setTimeout(function() {
                    $(".js-chatArea").css({ "bottom": "0px" });
                    $(window).scrollTop('288');
                }, 400);
            } else if (phoneType == "iphone-6" && browserType == "safari") {
                // $('.js-textarea').attr("placeholder", isFirstPopInputFlag);
                if (isFirstPopInputFlag == 'true') {
                    $(".js-chatArea").css({ "bottom": "60px" });
                }
            }
            //微信
            if (phoneType == "iphone-6" && browserType == "micromessenger" && browserInfo.indexOf('11_') == -1) {
                setTimeout(function() {
                    $(".js-chatArea").css({ "bottom": "0px" });
                    $(window).scrollTop('330');
                }, 400);
            } else if (phoneType == "iphone-6" && browserType == "micromessenger") {
                if (isFirstPopInputFlag == 'true') {
                    $(".js-chatArea").css({ "bottom": "70px" });
                }
            }
            if (phoneType == "iphone-6" && browserType == "mqqbrowser" && browserInfo.indexOf('11_') == -1) {
                $(".js-chatArea").css({ "bottom": "-1px" });
                setTimeout(function() {
                    $(window).scrollTop('0');
                }, 50);
            } else if (phoneType == "iphone-6" && browserType == "mqqbrowser") {
                $(".js-chatArea").css({ "bottom": "-1px" });
            }
            if (phoneType == "iphone-6" && browserType == "ucbrowser" && browserInfo.indexOf('11_') == -1) {
                $(".js-chatArea").css({ "bottom": "117px" });
                setTimeout(function() {
                    $(window).scrollTop('0');
                }, 50);
            } else if (phoneType == "iphone-6" && browserType == "ucbrowser") {
                $(".js-chatArea").css({ "bottom": "117px" });
            };

            //iphone5
            if (phoneType == "iphone-5" && browserInfo.indexOf('11_') == -1) {
                $(".js-chatArea").css({ "top": "129px" });
                setTimeout(function() {
                    $(window).scrollTop('1');
                }, 50);
            }
            if (phoneType == "iphone-5" && browserType == "ucbrowser" && browserInfo.indexOf('11_') == -1) {
                $(".js-chatArea").css({ "top": "140px" });
                setTimeout(function() {
                    $(window).scrollTop('1');
                }, 50)
            }
        }
        //华为荣耀6
        if (browserType == "safari" && browserInfo.indexOf('h60_l03') != -1 || browserInfo.indexOf('h60-l03') != -1) {
            $(".js-chatArea").css({ "top": "218px" });
            setTimeout(function() {
                $(window).scrollTop('1');
            }, 50)
        }
        //魅族note2
        if (browserType == "safari" && browserInfo.indexOf('mz-m2') != -1) {
            $(".js-chatArea").css({ "top": "315px" });
            setTimeout(function() {
                $(window).scrollTop('1');
            }, 50)
        }

        //魅族mx5,钉钉浏览器
        if (browserType == "safari" && browserInfo.indexOf('mx5') != -1) {
            $(".js-chatArea").css({ "top": "266px" });
            setTimeout(function() {
                $(window).scrollTop('1');
            }, 50)
        }
        //魅族mx5
        if (browserType == "safari" && browserInfo.indexOf('mz-mx5') != -1) {
            $(".js-chatArea").css({ "top": "338px" });
            setTimeout(function() {
                $(window).scrollTop('1');
            }, 50)
        }
        //小米3
        if (browserType == "miuibrowser" && browserInfo.indexOf('mi 3') != -1) {
            $(".js-chatArea").css({ "top": "253px" });
            setTimeout(function() {
                $(window).scrollTop('1');
            }, 50)
        }
        //小米4
        if (browserType == "miuibrowser" && browserInfo.indexOf('mi 4') != -1) {
            $(".js-chatArea").css({ "top": "241px" });
            setTimeout(function() {
                $(window).scrollTop('1');
            }, 50)
        }
        //小米5
        if (browserType == "miuibrowser" && browserInfo.indexOf('mi 5') != -1) {
            $(".js-chatArea").css({ "top": "286px" });
            setTimeout(function() {
                $(window).scrollTop('1');
            }, 50)
        }
        //小米note
        if (browserType == "miuibrowser" && browserInfo.indexOf('mi note') != -1) {
            $(".js-chatArea").css({ "top": "277px" });
            setTimeout(function() {
                $(window).scrollTop('1');
            }, 50)
        }
        //红米note2
        if (browserType == "miuibrowser" && browserInfo.indexOf('redmi note 2') != -1) {
            $(".js-chatArea").css({ "top": "253px" });
            setTimeout(function() {
                $(window).scrollTop('1');
            }, 50)
        }
        //三星note3的h5demo
        if (browserType == "safari" && browserInfo.indexOf('samsung-sm-n7508v_td') != -1) {
            // $(".js-chatArea").css({ "top": "266px"});
            // setTimeout(function() {
            //     $(window).scrollTop('1');
            // }, 50)
        }
        //huawei
        if (browserType == "safari" && browserInfo.indexOf('huawei nxt-al10') != -1) {
            $(".js-chatArea").css({ "top": "220px" });
            setTimeout(function() {
                $(window).scrollTop('1');
            }, 50)
        }
        //huawei荣耀4x
        if (browserType == "safari" && browserInfo.indexOf('honor_che2-tl00m_td') != -1) {
            $(".js-chatArea").css({ "top": "220px" });
            setTimeout(function() {
                $(window).scrollTop('1');
            }, 50)
        }
        //未验证机型 Vivo  x7
        //有问题机型，因缺机型还未解决
        //魅族pro5(经测试浏览器存在问题)、华为nexus6p、华为荣耀v8(经测试没问题)、谷歌(经测试没问题)、
    }

    module.exports = Adapter;
},{}],56:[function(require,module,exports){
    /**
     * @author daijm
     */
//currentStatus为0则为机器人，为1则为人工
    function evaluate(currentStatus, global, evaType,aname) {
        var template = require('./template.js');
        var Alert = require('../util/alert.js');
        var listener = require("../../../common/util/listener.js");
        var $ajax = require("../../../common/util/monitAjax.js")(global);
        //var Dialog=require('../util/dialog.js');
        var currentStatus = currentStatus;
        var language = global.language.lan;
        var languageText = global.language.text;
        var color = global.urlParams.color || global.userInfo.color;
        color = color.indexOf('#') == 0 ? color : ('#' + color);
        var showTip = require('../util/showTip.js');

        var Alert,
            dialog,
            $outerNode,
            $body;
        var score = 0,
            tag = "",
            remark = "",
            type = "",
            isRepeat = false,
            solved = 1,
            commentType = evaType.commentType === 0 ? evaType.commentType : 1;
        var BASE = 4;
        var config = {};


        //不可多选
        var toggleActive = function() {
            $(this).css({ "color": "#fff", "border": "1px solid " + color, "background": color }).siblings().css({ "color": "#000", "border": "1px solid #c5cecb", "background": "#fff" });
        };
        //可多选
        var toggleActiveRepeat = function() {
            $(this).toggleClass("active")
            if ($(this).hasClass("active")) {
                $(this).css({ "background": color, "border": "1px solid " + color, "color": "#fff" })
            } else {
                $(this).css({ "background": "#fff", "border": "1px solid #c4cdcc", "color": "#686d70" })
            }

        };
        var textareaMaxlen = function(targetID, maxLen) {
            // 限制留言框最大字符数为200
            document.getElementById(targetID).addEventListener('input', function() {
                if (this.value.length > maxLen) {
                    this.value = this.value.substr(0, maxLen);
                }
            }, false);
        };
        var sobotSetInnerStepOneHtml = function() {
            var subName=global.apiConfig.robotName.length>8?global.apiConfig.robotName.substr(0,8)+'...':global.apiConfig.robotName
            var _html = doT.template(template.sobotOne_selfHtml)({
                'config': config,
                'languageText': languageText,
                'robotName':global.apiConfig.robotName,
                'subName':subName
            });
            $outerNode = $(_html);
            $body.append($outerNode);
            $outerNode.find(".js-submit").css("background", color);
            $outerNode.find(".js-solved").addClass("solveActive").css({ "background": color, "border": "1px solid " + color });
        };
        //自定义html添加到弹窗中
        var sobotSetInnerStepTwoHtml = function() {
            var conf = global.apiConfig.robotCommentTitle.split(",");
            var _html = doT.template(template.sobotTwo_selfHtml)({
                'list': conf,
                'languageText': languageText
            });
            $outerNode.find(".js-evaluateDetail").remove();
            $outerNode.find(".js-evaluate").append(_html);
            //$outerNode.find(".situation span").on("click", toggleActiveRepeat);
            $outerNode.find(".js-submit").on("click", EvaluateAjaxHandler);
            textareaMaxlen("js-evaluateInner", 200);

        };
        var humanSetInnerStepOneHtml = function() {
            var subName=aname.length>4?aname.substr(0,4)+'...':aname
            var conf = {
                'languageText': languageText,
                'config': config,
                'subName':subName
            };
            var _html = doT.template(template.humanOne_selfHtml)(conf);
            $outerNode = $(_html);
            $body.append($outerNode);
            $aLi = $("#star li");
            //console.log(evaType);
            if (evaType.from == "push") {
                score = evaType.score;
                var solveActive = evaType.solveActive;
                if (solveActive == 0) {
                    $outerNode.find(".js-solved").addClass("solveActive");
                    $outerNode.find(".js-solved").css({ "background": color, "border": "1px solid " + color });
                } else if (solveActive == 1) {
                    $outerNode.find(".js-solved").addClass("solveActive");
                    $outerNode.find(".js-solved").css({ "background": color, "border": "1px solid " + color });
                    $outerNode.find(".unsolveActive").css({ "background": "#fff", "border": "1px solid #d6dbe5" });
                    $outerNode.find(".js-unSolved").removeClass("unsolveActive");
                } else if (solveActive == 2) {
                    $outerNode.find(".js-unSolved").addClass("unsolveActive");
                    $outerNode.find(".js-unSolved").css({ "background": color, "border": "1px solid " + color });
                    $outerNode.find(".js-solved").css({ "background": "#fff", "border": "1px solid #d6dbe5" });
                    $outerNode.find(".js-solved").removeClass("solveActive");
                };
                humanSetInnerStepTwoHtml(score);
            } else {
                score = 5;
                $outerNode.find(".js-solved").addClass("solveActive").css({ "background": color, "border": "1px solid " + color });
            };
            fnPoint(score);
            $outerNode.find(".js-evaluateTip").html(config[score - 1].scoreExplain);
            $outerNode.find(".js-submit").css("background", color);
            var iStar = 0;
            for (var i = 1; i <= $aLi.length; i++) {
                $aLi[i - 1].index = i;
                //鼠标移过显示分数
                $aLi[i - 1].onmouseover = function() {
                    fnPoint(this.index);
                };
                //鼠标离开后恢复上次评分
                $aLi[i - 1].onmouseout = function() {
                    fnPoint(this.index);
                };
                //点击后进行评分处理
                $($aLi[i - 1]).bind("click", function() {
                    iStar = this.index;
                    switch (iStar) {
                        case 1: //一星
                        case 2: //二星
                        case 3: //三星
                        case 4: //四星
                            score = iStar;
                            humanSetInnerStepTwoHtml(iStar);
                            break;
                        case 5: //五星
                            score = 5;
                            $outerNode.find(".js-evaluateDetail").html("");
                            //alert("感谢您的反馈");
                            //EvaluateAjaxHandler();
                            break;
                    };
                    $outerNode.find(".js-evaluateTip").html(config[score - 1].scoreExplain);

                });
            };

        };
        var humanSetInnerStepTwoHtml = function(iStar) {
            var conf = config[iStar - 1];
            var list = [];
            if (conf.labelName) {
                list = conf.labelName.split(",");
            }
            //去掉空标签
            for (var i = 0; i < list.length; i++) {
                if (list[i] == "") {
                    list.splice(i, 1);
                }
            };
            var _html = doT.template(template.humanTwo_selfHtml)({
                'list': list,
                'conf': conf,
                'languageText': languageText
            });
            $outerNode.find(".js-evaluateDetail").remove();
            $outerNode.find(".js-evaluate").append(_html);
            $outerNode.find(".close_button").click(function() {
                listener.trigger('sendArea.reTopushEav');
            });
            //$outerNode.find(".js-noques").css({ "color": "#fff", "border": "1px solid " + color, "background": color });
            //$outerNode.find(".js-isques").on("click", EvaluateAjaxHandler);
            //$outerNode.find(".wether span").on("click", toggleActive);

            textareaMaxlen("js-evaluateInner", 200);
        };
        var beforeEvaluateAjaxHandler = function() {
            //机器人评价，score为1，则为是，为0则为否
            score = 5;
            EvaluateAjaxHandler();
        };
        var EvaluateAjaxHandler = function() {
            if (isRepeat == false) {
                isRepeat = true;
                var tagArr = [],
                    tagNum = $outerNode.find(".tag").length;
                $outerNode.find(".tag").each(function() {
                    var _val = $(this).html();
                    if ($(this).hasClass("active")) {
                        tagArr.push(_val)
                    }
                });
                //标签是否为必选
                if (currentStatus && tagArr.length == 0 && config[score - 1].isTagMust && score != 5 && tagNum > 0) {
                    showTip.show(languageText['T0104']);
                    setTimeout(function() {
                        isRepeat = false;
                    }, 3000)
                    return;
                };
                tag = tagArr.join(",");
                remark = $outerNode.find(".js-evaluateInner").val() || '';
                if (/^\s+$/g.test(remark)) {
                    remark=""
                }
                //评价详情是否为必选
                if (currentStatus && remark == "" && config[score - 1].isInputMust && score != 5) {
                    showTip.show(languageText['T0105']);
                    setTimeout(function() {
                        isRepeat = false;
                    }, 3000)
                    return;
                }
                if (currentStatus == 1) {
                    if (config[0].isQuestionFlag == 1) {
                        if ($outerNode.find(".js-solved").hasClass("solveActive")) {
                            solved = 1
                        } else {
                            solved = 0
                        }
                    } else {
                        solved = -1
                    }
                } else {
                    if ($outerNode.find(".js-solved").hasClass("solveActive")) {
                        solved = 1;
                        score = 5;
                    } else {
                        solved = 0;
                        score = 0;
                    }
                };
                $.ajax({
                    type: "post",
                    url: "/chat/user/comment.action",
                    dataType: "json",
                    data: {
                        cid: global.apiInit.cid,
                        visitorId: global.apiInit.uid,
                        score: score,
                        tag: tag,
                        solved: solved,
                        remark: remark,
                        type: currentStatus,
                        //0,邀请评价，1为主动评价
                        commentType: commentType
                    },
                    success: function(req) {
                        if (req.status === 1) {
                            //alert("感谢您的反馈");
                            // var conf = {
                            //     'language': language,
                            //     'languageText': languageText
                            // };
                            // var evamsgHtml = doT.template(template.evamsgHtml)(conf);
                            // $body.append(evamsgHtml);
                            showTip.show(languageText['T0032']);

                            //将推送评价的状态返回给系统消息里面的评价
                            var pushEavConf = {
                                "score": score,
                                "solved": solved
                            };
                            listener.trigger('sendArea.toPushEav', pushEavConf);
                            if (evaType) { //&&evaType.sourceType===0
                                listener.trigger("listMsg.closePushEva")
                            }
                            //居中弹窗位置
                            position();
                            setTimeout(function() {
                                $('.js-evamsg').remove();
                            }, 3000);
                            $outerNode.remove();
                        } else {
                            hideDialog();
                            showTip.show(languageText['T0033']);
                            // var conf = {
                            //     'language': language,
                            //     'languageText': languageText
                            // };
                            // var evamsgHtml2 = doT.template(template.evamsgHtml2)(conf);
                            // $body.append(evamsgHtml2);
                            //居中弹窗位置
                            position();
                            // setTimeout(function() {
                            //     $('.js-evamsg').remove();
                            // }, 3000)
                        }
                    },
                    //请检查网络链接
                    error: function() {
                        hideDialog();
                        showTip.show(languageText['T0033']);
                        // var conf = {
                        //     'language': language,
                        //     'languageText': languageText
                        // };
                        // var evamsgHtml2 = doT.template(template.evamsgHtml2)(conf);
                        // $('body').append(evamsgHtml2);
                        //居中弹窗位置
                        position();
                        // setTimeout(function() {
                        //     $('.js-evamsg').remove();
                        // }, 3000)
                    }
                });
                $(".js-endSession span").css("width", "45%");
                setTimeout(function() {
                    isRepeat = false;
                }, 3000)
            }
        };

        var position = function() {
            //居中
            var left, top;
            left = ($(window).width() - 200) / 2 + "px";
            top = ($(window).height() - $(".js-evamsg").height()) / 2 + "px";
            $(".js-evamsg").css({ "left": left, "top": top });
        };
        var fnPoint = function(iArg) { //alert(iArg);
            //分数赋值
            for (var i = 0; i < $aLi.length; i++) {
                $aLi[i].className = i < iArg ? "on" : "";
            }
        };

        var modeAlert = function() {
            Alert.show();
        };
        var hideDialog = function() {
            $outerNode.animate({ "opacity": 0 });
            setTimeout(function() {
                $outerNode.remove();
            }, 1000)
        };
        var bindListener = function() {
            $outerNode.delegate(".js-solved", "click", function() {
                if (!$(this).hasClass("solveActive")) {
                    $(this).addClass("solveActive");
                    $(this).css({ "background": color, "border": "1px solid " + color });
                    $outerNode.find(".unsolveActive").css({ "background": "#fff", "border": "1px solid #d6dbe5" });
                    $outerNode.find(".js-unSolved").removeClass("unsolveActive");
                    if (currentStatus == 0) {
                        $outerNode.find(".js-evaluateDetail").remove();
                    }
                }
            });
            $outerNode.delegate(".js-unSolved", "click", function() {
                if (!$(this).hasClass("unsolveActive")) {
                    $(this).addClass("unsolveActive");
                    $(this).css({ "background": color, "border": "1px solid " + color });
                    $outerNode.find(".solveActive").css({ "background": "#fff", "border": "1px solid #d6dbe5" });
                    $outerNode.find(".js-solved").removeClass("solveActive");
                }
                if (currentStatus == 0) {
                    sobotSetInnerStepTwoHtml()
                }
            });
            $outerNode.delegate(".js-close_button", "click", function() {
                hideDialog();
            });
            $outerNode.delegate(".js-tag", "click", toggleActiveRepeat);
            $outerNode.delegate(".js-submit", "click", EvaluateAjaxHandler);

        };

        var parseDOM = function() {
            $body = $(document.body);
            $evaluate = $(".js-evaluate");
        };
        var init = function() {
            //防止用户快速多次点击弹层
            $('.layer-opacity0').remove();
            parseDOM();

            //机器人评价
            if (currentStatus == 0) {
                sobotSetInnerStepOneHtml();
                //sobotbindListener();
                //人工评价
            } else {
                //humanInitPlugins();
                humanSetInnerStepOneHtml();
                //humanbindListener();
            };
            bindListener();
            //处理其它渠道过来的评价
            // if (evaType.from=="push") {
            //     if (evaType.score) {
            //         score = evaType.score;
            //         humanSetInnerStepTwoHtml();
            //         for (var i = 0; i < score; i++) {
            //             $("#star li").eq(i).addClass("on")
            //         }
            //     }
            // }

        };
        var initConfig = function() {
            showTip = showTip(global);
            $ajax({
                type: "get",
                url: "/chat/user/satisfactionMessage.action",
                dataType: "json",
                data: {
                    uid: global.apiInit.uid
                },
                success: function(req) {
                    // console.log(req);
                    if (req.status === 1) {
                        config = req.data;
                        init();
                    }
                },
                //请检查网络链接
                error: function() {
                    showTip.show('请检查网络链接');
                    setTimeout(function() {
                        $('.js-evamsg').remove();
                    }, 3000)
                }
            });

        };
        initConfig();
        this.modeAlert = modeAlert;
    }

    module.exports = evaluate;
},{"../../../common/util/listener.js":29,"../../../common/util/monitAjax.js":30,"../util/alert.js":60,"../util/showTip.js":67,"./template.js":58}],57:[function(require,module,exports){
    /**
     *
     * @author daijm
     */
    function TextArea(window) {
        // alert(navigator.userAgent);
        //var that = {};
        var global;
        var language, languageText
        var listener = require("../../../common/util/listener.js");
        //表情
        var ZC_Face = require('../util/qqFace.js')();
        //上传附件
        var uploadImgFun = require('./uploadImg.js');
        var getCurrentManualStatus = require("../../../common/mode/currentState.js");
        var uploadImg;
        var browserAdapter = require("./browserAdapter.js");
        //当前状态
        //var CurrentState = require('../../../common/mode/currentState.js');
        //模拟placeholder
        //var placeholder = require('./placeholder.js');
        //输入框遮挡兼容
        //var inputBoxBlock=require("./inputBoxBlock.js");
        var evaluate = require("./evaluate.js");
        /* var inputCache = {};*/
        //模板引擎
        var template = require('./template.js');
        var global;
        var $node, $shadow;
        var currentCid,
            currentUid,
            answer,
            //记住输入框的状态,点击发送后要保持
            focusStatus,
            currentStatus,
            //用户输入的内容在客服提示
            timer,
            //会话是否结束, 用于阻止某些事件
            sessionEnd = false,
            //判断用户是否说过话
            //isSpeak=false,
            //是否评价过 -1表示用户没有说过话，0表示说过话没有评论过，1表示评论过
            isEvaluated = -1,
            isRepeat = false,
            leaveMsgMutex = false;
        //0为机器人，1为人工
        var transferFlag = 0,
            browserType = "",
            phoneType = "",
            phoneTypeFlag = false,
            browserInfo = "",
            eventType = "",
            isQueueFlag = false, //判断是否有排除
            aname = "";
        var oldIsFirstPopInputFlag = true;
        //传给聊天的url
        var statusHandler = function(data) {
            currentStatus = data;
            if (currentStatus == "human") {
                transferFlag = 1;
                $qqFaceTip.removeClass("activehide");
                //上传图片按钮
                $uploadImg.removeClass("activehide");
                //满意度评价
                $satisfaction.removeClass("activehide");
                if (global.apiConfig.type == 1) {
                    $(".js-textarea").attr("placeholder", global.apiConfig.robotDoc)
                } else {
                    //提示文本
                    $(".js-textarea").attr("placeholder", global.apiConfig.customDoc)
                }

            } else if (currentStatus == 'robot') {
                transferFlag = 0;
                $uploadImg.addClass("activehide");
                $satisfaction.removeClass("activehide");
                if (!isQueueFlag) {
                    $(".js-textarea").attr("placeholder", global.apiConfig.robotDoc) //languageText['T0023']
                }
            }
        };


        var onCommentWindowClose = function() {
            $shadow.toggleClass("disabled");
        };

        var onPostMessage = function(evt) {
            var data;
            if (typeof evt.data === 'string') {
                try {
                    data = JSON.parse(evt.data);
                } catch (e) {}
            } else {
                data = evt.data;
            }
            if (data.name === 'zhichiClose') {
                onCommentWindowClose();
                return;
            }
            if (data.type == 'auto') {
                if (getCurrentManualStatus.getCurrentState() == 'human') {
                    return;
                }
                global.urlParams.autoManual = true;
                global.urlParams.aid = data.aid;
                artificialHandler();
            }
        };

        var changeStatusHandler = function(data) {
            //hide,转人工按钮隐藏
            if (data.action == "hide") {
                $artificial.addClass("activehide");
                //解禁输入框
                if (global.apiConfig.type == 1) {
                    $(".js-textarea").attr("placeholder", global.apiConfig.robotDoc).attr("contenteditable", "true")
                } else {
                    $(".js-textarea").attr("placeholder", global.apiConfig.customDoc).attr("contenteditable", "true")
                };
                if ($textarea.text()) {
                    //加号里面有东西就显示，没有不显示
                    $add.addClass("activehide");
                }

            } else {
                $artificial.removeClass("activehide");
                //alert($chatAdd.width());
            }
        }
        //用户输入，工作台提示
        var chatAdminshowtextHandler = function(evt) {
            if (evt && evt.keyCode == 13) {
                return;
            }
            clearInterval(timer);
            timer = setTimeout(function() {
                var content = $textarea.text();
                $.ajax({
                    type: "post",
                    url: "/chat/user/input.action",
                    dataType: "json",
                    data: {
                        cid: currentCid,
                        uid: currentUid,
                        content: content
                    }
                });
            }, 500)
        };
        var showSendBtnHandler = function(evt) {
            //最大输入长度1024
            var str = $textarea.text();
            str = str.trim();
            if (str.length > 1024) {
                $textarea.text(str.substring(0, 1024))
            };
            //判断当前是否为人工模式
            if (transferFlag == 0) {
                robotmodeButton();
            } else {
                manualmodeButton();
                //FIXME  只要建立会话后才会向工作台推用户正在输入内容
                //工作台提示信息
                chatAdminshowtextHandler(evt);
            }
            //实时监测第三方输入法
            //   specialModelshideKeyboardHandler();
        };
        var robotmodeButton = function() {
            var _text = $textarea.text();
            if (_text) {
                //if (phoneTypeFlag == false) {
                $sendBtn.removeClass("activehide");
                $add.addClass("activehide");
                //}
                hideChatAreaHandler();
            } else {
                //if (phoneTypeFlag == false) {
                $sendBtn.addClass("activehide");
                $add.removeClass("activehide");
                //}
                hideChatAreaHandler();
            }
            if (document.activeElement.id == "js-textarea") {
                focusStatus = true;
            }
        };
        var manualmodeButton = function() {
            var _text = $textarea.text();
            if (_text) {
                //if (phoneTypeFlag == false) {
                $sendBtn.removeClass("activehide");
                $add.addClass("activehide");
                //}
            } else {
                //if (phoneTypeFlag == false) {
                $sendBtn.addClass("activehide");
                $add.removeClass("activehide");
                //}
                hideChatAreaHandler();
                // $textarea.blur();
                // $textarea.focus();
            }
            if (document.activeElement.id == "js-textarea") {
                focusStatus = true;
            }
        };
        var onbtnSendHandler = function(evt) {
            var str = $textarea.text();
            str = str.trim();
            //判断输入框是否为空
            if (str.length == 0 || /^\s+$/g.test(str)) {
                $textarea.html("")
                return false;
            } else {
                //过滤表情
                //ZC_Face.analysisRight(str);
                //xss
                var $dom = $('<div></div>').text(str);
                var s = $dom.html();
                //通过textarea.send事件将用户的数据传到显示台
                var date = currentUid + +new Date();
                setTimeout(function() {
                    listener.trigger('sendArea.send', [{
                        'answer': s,
                        'uid': currentUid,
                        'cid': currentCid,
                        'dateuid': date,
                        'date': +new Date(),
                        'token': "",
                        'sendAgain': false,
                        'currentStatus': currentStatus
                    }]);
                }, 200)

            };
            //清空待发送框
            $textarea.html("");
            //发送前是什么状态，发送后就是什么状态
            //获取document上获取焦点的id,当点击回车发送的时候不让它执行blur事件，否则出现兼容问题
            if (evt.keyCode != "13") {
                if (focusStatus) {
                    $add.removeClass("activehide");
                    if (phoneTypeFlag == false && global.urlParams.from != 'iframe') {
                        //如果不是iphone手机，则手动调键盘
                        setTimeout(function() {
                            //$textarea.blur();
                            $textarea.focus();
                        }, 50)
                    };
                    if (phoneTypeFlag && global.urlParams.from == 'iframe') {
                        setTimeout(function() {
                            $(".js-textarea").blur();
                        }, 50)
                        //$textarea.blur();
                    }
                    setTimeout(function() {
                        autoSizePhone();
                    }, 0);
                } else {
                    $add.removeClass("activehide");
                }
            } else {
                $add.removeClass("activehide");
            }
            $sendBtn.addClass("activehide");
            $chatArea.removeClass("showChatEmotion");
            $qqFaceTip.removeClass("qqFaceTiphover");
            autoSizePhone();
            setTimeout(function() {
                clearTimeout(timer);
            }, 100);
            try {
                if (window.localStorage) {
                    window.localStorage.setItem("isFirstPopInputFlag", 'true');
                }

            } catch (e) {}

        };
        var blurHandler = function() {
            //$textarea.remove();
            //$(".js-qqFaceTip").before('<div id="js-textarea" class="textarea js-textarea" placeholder="'+languageText['T0023']+'" contenteditable="true"></div>')
        };
        var showChatAddHandler = function() {
            $(".js-textarea").blur();
            //与键盘优化
            if ($chatArea.hasClass("showChatAdd")) {
                //隐藏
                hideChatAreaHandler();
                //0为机器人模式
                if (transferFlag == 0) {
                    $add.removeClass("activehide")
                    $qqFaceTip.addClass("activehide")
                } else {
                    $add.removeClass("activehide")
                    $qqFaceTip.removeClass("activehide")
                }
                autoSizePhone();
            } else {
                //显示
                $chatArea.addClass("showChatAdd");
                $add.addClass("addhover");
                $chatArea.removeClass("showChatEmotion");
                $qqFaceTip.removeClass("qqFaceTiphover");
                //0为机器人模式
                if (transferFlag == 0) {
                    $qqFaceTip.addClass("activehide")
                } else {
                    $qqFaceTip.removeClass("activehide")
                }
                autoSizePhone();
            }
            focusStatus = false;
        };
        var showChatEmotionHandler = function() {
            $(".js-textarea").blur();
            //与键盘优化
            if ($chatArea.hasClass("showChatEmotion")) {
                //隐藏
                hideChatAreaHandler();
                autoSizePhone();
            } else {
                //显示
                $chatArea.addClass("showChatEmotion");
                $add.removeClass("addhover");
                $chatArea.removeClass("showChatAdd");
                $qqFaceTip.addClass("qqFaceTiphover");
                // $chatAdd.hide();
                //$chatEmotion.css("display", "inline-block");
                if (transferFlag == 0) {
                    $qqFaceTip.addClass("activehide");
                    $add.removeClass("activehide")
                } else {
                    var _text = $textarea.text();
                    //if (phoneTypeFlag == false) {
                    if (_text) {
                        $add.addClass("activehide")
                        $sendBtn.removeClass("activehide")
                    } else {
                        $add.removeClass("activehide")
                        $sendBtn.addClass("activehide");
                    }
                    //}
                }
                autoSizePhone();
            }
            focusStatus = false;
        };
        var hideChatAreaHandler = function() {
            $chatArea.removeClass("showChatAdd");
            $chatArea.removeClass("showChatEmotion");
            $add.removeClass("addhover");
            $qqFaceTip.removeClass("qqFaceTiphover")
            autoSizePhone();
            var _text = $textarea.text();
            if (transferFlag == 0) {
                $qqFaceTip.addClass("activehide");
                //if (phoneTypeFlag == false) {
                if (_text) {
                    $add.addClass("activehide");
                    $sendBtn.removeClass("activehide");
                } else {
                    $add.removeClass("activehide");
                    $sendBtn.addClass("activehide");
                }
                //}
            } else {
                $qqFaceTip.removeClass("activehide");
                //if (phoneTypeFlag == false) {
                if (_text) {
                    $add.addClass("activehide");
                    $sendBtn.removeClass("activehide");
                } else {
                    $add.removeClass("activehide");
                    $sendBtn.addClass("activehide");
                }
                //}
            }
            //输入框遮挡下收起
            inputUPHandler();
            focusStatus = false;
        };
        //表情、加号切换
        var tabChatAreaHandler = function() {
            //当点表情按钮的时候再给加号添加切换卡类名，否则动画效果会被覆盖
            var id = $(this).attr("data-id");
            $(id).removeClass("activehide");
        };
        //定位光标
        var gotoxyHandler = function(data) {
            //表情img标签
            var src = data[0].answer;
            //将新表情追加到待发送框里
            var _html = $textarea.html() + src;
            $textarea.html(_html);
            var textarea = document.getElementById('js-textarea');
            textarea.scrollTop = textarea.scrollHeight;
            //提示文本
            //$textarea.attr("placeholder","当前是人工")
            //显示发送按钮
            manualmodeButton();
            //调整窗体高度
            autoSizePhone();
        };
        //模拟退格(废弃)
        var backDeleteHandler = function() {
            var _html = $textarea.text();
            if (_html.length == 1) {
                _html = "";
            } else {
                _html = $.trim(_html.substring(0, _html.length - 1));
            }
            $textarea.text(_html);
            focusStatus = false
        };
        var onImageUpload = function(data) {
            //通过textarea.send事件将用户的数据传到显示台
            var img = '<img class="webchat_img_upload uploadedFile" src="' + data[0].answer + '" />';
            listener.trigger('sendArea.send', [{
                'answer': img,
                'uid': currentUid,
                'cid': currentCid,
                //时间戳
                'dateuid': data[0].token,
                'date': data[0].date,
                'token': data[0].token,
                //false证明不是重发(仅限图片)
                'sendAgain': false,
                'currentStatus': currentStatus
            }]);
            focusStatus = false;
            //输入框遮挡下收起
            inputUPHandler();
        };
        var artificialHandler = function() {
            $(".js-textarea").blur();
            if (isRepeat == false) {
                isRepeat = true;
                listener.trigger('sendArea.artificial');
                //防止快速点击转人工按钮
                setTimeout(function() {
                    isRepeat = false;
                }, 3000)
            }

            //autoSizePhone();
            focusStatus = false;
        };
        //宽高自适应手机
        var autoSizePhone = function() {
            listener.trigger('sendArea.autoSize', $chatArea);
        };

        //用户排队中。。。
        var onCustomQueue = function() {
            isQueueFlag = true; //正在排队中
            $(".js-textarea").attr("placeholder", global.apiConfig.waitDoc).attr("contenteditable", "true"); //languageText['T0024']
            // leaveMessageBtnClickHandler();
        }

        //结束会话
        var endSessionHandler = function(status) {
            switch (status) {
                case -3: //人工优先模式，转人工失败,有客服排队中
                    $qqFaceTip.addClass("activehide");
                    //$satisfaction.addClass("activehide");
                    break;
                case -2: //仅人工模式，转人工失败,有客服排队中
                    //FIXME  在线用户转接不走此方法  用事件监听 ==> onCustomQueue
                    $(".js-textarea").attr("placeholder", global.apiConfig.waitDoc).attr("contenteditable", "false"); //languageText['T0024']


                    $artificial.addClass("activehide");
                    $qqFaceTip.addClass("activehide");
                    //$satisfaction.addClass("activehide");
                    break;
                case -4: //websocket中断，重连三次关闭
                case -1: //仅人工模式，转人工失败,无客服
                case 1: //客服自己离线了
                case 2: //客服把你T了
                case 3: //客服把你拉黑了
                case 4: //长时间不说话
                case 6: //有新窗口打开
                case 7: //机器人超时下线
                    $(".js-textarea").blur();
                    //为了iphone下的输入框遮挡兼容
                    setTimeout(function() {
                        $(".js-chatArea").css("height", "64px");
                    }, 100)
                    $keepSession.hide();
                    $endSession.show();
                    autoSizePhone();
                    sessionEnd = true;
                    // if (status == -1) { //仅人工模式，转人工失败,无客服
                    //     //移除满意度评价
                    //     $(".js-satisfaction").addClass("activehide");
                    // }

                    if (status == -1 || status == 3) { //仅人工模式，转人工失败,无客服,拉黑
                        //移除满意度评价
                        $(".js-satisfaction").addClass("activehide");
                        if (status == -1 && global.urlParams.msgflag != 1) {
                            //留言跳转第三方开关
                            if (global.urlParams.isLeaveCustomSysFlag) {
                                window.open(global.urlParams.leaveCustomUrl);
                            } else {
                                //留言
                                leaveMessageBtnClickHandler();
                            }
                        }
                    }



                    //评价开关
                    if (!global.urlParams.satDegree_A) {
                        $(".js-endSatisfaction").remove();
                    }
                    //留言开关
                    if (global.apiConfig.msgflag == 1) {
                        $(".js-leaveMsgBtn").addClass("activehide");
                    }
                    //flex兼容处理
                    if ($(".sendarea").css("display") != "flex") {
                        $(".endSession").css({ "display": "inline-block" });
                    };

                    break;
            }
        };
        //重新开始新会话
        var newMessage = function() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                //微信内置浏览器必须使用添加随机数此方法
                var random = +new Date();
                str = window.location.href.replace("#", "").replace(/&autoManual=[^&]+/, '');
                //alert(str)
                window.location.href = str + "&refresh=" + random;
            } else {
                var href = window.location.href;
                href = href.replace(/(&|\?)autoManual=[^&]+/, '').replace(/#[\S]+$/, '');
                href = href.replace(/(&|\?)tnk=[^&]+/, '');
                href += '&tnk=' + (+new Date());
                window.location.href = href;
            }
        };
        var evaluateHandler = function(data) {
            if (isRepeat == false) {
                isRepeat = true;
                $.ajax({
                    type: "post",
                    url: "/chat/user/isComment.action",
                    dataType: "json",
                    data: {
                        cid: global.apiInit.cid,
                        uid: global.apiInit.uid,
                        type: transferFlag
                    },
                    success: function(req) {
                        isEvaluated = req.isComment;
                        //console.log(req.isComment);
                        //1表示评论过
                        if (isEvaluated == 1) {
                            var evaluateSystem = {
                                type: 'system',
                                status: 'evaluated',
                                data: {
                                    content: languageText['T0025']
                                }
                            }
                            listener.trigger('sendArea.sendAreaSystemMsg', evaluateSystem);
                        } else if (isEvaluated == 0) { //0表示说过话没有评论过
                            //防止用户快速多次点击弹层
                            var conf = {};
                            var _html = doT.template(template.layerOpacity0)(conf);
                            $(document.body).append(_html);
                            //评价
                            evaluate(transferFlag, global, data, aname);
                        } else { //-1表示用户没有说过话
                            var evaluateSystem = { type: 'system', status: 'firstEvaluate', data: { content: languageText['T0026'] } }
                            listener.trigger('sendArea.sendAreaSystemMsg', evaluateSystem);
                        }
                        focusStatus = false;
                    }
                });
                //防止快速点击
                setTimeout(function() {
                    isRepeat = false;
                }, 1000)
            }
        };
        var toDetailEvaluate = function(data) {
            //console.log(data);
            evaluateHandler(data);
        };
        var hideKeyboard = function(data) {
            //会话没结束的时候点击屏幕输入框失去焦点
            $(".js-textarea").blur();
            var viewHeight = $(document).height() - $(".sendarea").height();
            if (global.urlParams.back) {
                viewHeight -= 50;

            }
            //data<viewHeight说明当前文本框处于抬起状态
            if (!sessionEnd && data < viewHeight) {
                // TODO  iframe里 该方法不能正常执行
                // alert(data+';'+viewH);
                if (global.urlParams.from == 'iframe') {
                    // setTimeout(function() {
                    //     var _input = $('<input class="js-cache-input" />');
                    //     $(document.body).append(_input);
                    //     _input.focus();
                    //     $(document.body).find('.js-cache-input').remove();
                    // }, 300)
                } else {
                    var _text = $textarea.text();
                    if (transferFlag == 0) {
                        if (_text) {
                            $qqFaceTip.addClass("activehide");
                        } else {
                            $add.removeClass("activehide");
                            $qqFaceTip.addClass("activehide");
                        }
                    } else {
                        if (_text) {
                            $qqFaceTip.removeClass("activehide");
                        } else {
                            $add.removeClass("activehide");
                            $qqFaceTip.removeClass("activehide");
                        }
                    }
                    inputUPHandler();
                    focusStatus = false;
                    autoSizePhone();
                }

            }
            $add.removeClass("addhover");
            $qqFaceTip.removeClass("qqFaceTiphover");
            $chatArea.removeClass("showChatEmotion").removeClass("showChatAdd");

            try {
                if (window.localStorage) {
                    window.localStorage.setItem('isFirstPopInputFlag', 'false');
                }
            } catch (e) {}


        };
        //特殊机型输入框处理，降低
        var specialModelsHandler = function() {

            $(".js-chatArea").css({ "top": "auto", "bottom": "0" });

        };

        var onGroupList = function() {
            setTimeout(function() {
                isRepeat = false;
                artificialHandler()
            }, 10)
        };


        //特殊机型输入框处理，抬高
        var specialModelshideKeyboardHandler = function() { //输入框问题参考网址https://github.com/daijnming/contenteditable/issues
            browserAdapter(phoneType, browserType, browserInfo);
            autoSizePhone();
            //ios11首次弹起输入框标识
        };
        var initHover = function() {
            // $add.on("touchstart", function() {
            //     $(this).addClass("addhover");
            // });
            // $add.on("touchend", function() {
            //     setTimeout(function() {
            //         $add.removeClass("addhover")
            //     }, 300)
            // });
            // $qqFaceTip.on("touchstart", function() {
            //     $(this).addClass("qqFaceTiphover");
            // });
            // $qqFaceTip.on("touchend", function() {
            //     setTimeout(function() {
            //         $qqFaceTip.removeClass("qqFaceTiphover")
            //     }, 300)
            // });
            $uploadImg.on("touchstart", function() {
                $(".uploadImgbg").addClass("uploadImgbgHover");
            });
            $uploadImg.on("touchend", function() {
                setTimeout(function() {
                    $(".uploadImgbg").removeClass("uploadImgbgHover")
                }, 300)
            });
            $satisfaction.on("touchstart", function() {
                $(".satisfactionbg").addClass("satisfactionbgHover");
            });
            $satisfaction.on("touchend", function() {
                setTimeout(function() {
                    $(".satisfactionbg").removeClass("satisfactionbgHover")
                }, 300)
            });
            $leaveMessage.on("touchstart", function() {
                $(".leaveMessagebg").addClass("leaveMessagebgHover");
            });
            $leaveMessage.on("touchend", function() {
                setTimeout(function() {
                    $(".leaveMessagebg").removeClass("leaveMessagebgHover")
                }, 300)
            });

        };
        var flexcompatible = function() {
            $textarea.css({ "width": "70%" });
            $(".endSession span").css({ "display": "inline-block" });
            $(".endSession span").css({ "width": "28%" });
        };
        var inputUPHandler = function() {
            autoSizePhone();
        };
        var noSliding = function() {
            return false;
        }
        var parseDOM = function() {
            $node = $("#chatArea");
            $chatArea = $(".js-chatArea");
            $sendBtn = $(".js-sendBtn");
            $textarea = $(".js-textarea");
            $sendarea = $(".sendarea");
            //转人工按钮
            $artificial = $(".js-artificial")
            $add = $(".js-add");
            $chatAdd = $(".js-chatAdd");
            //上传图片按钮
            $uploadImg = $(".js-uploadImg");
            //表情按钮
            $emotion = $(".js-emotion");
            $chatEmotion = $(".js-chatEmotion");
            $tab = $(".js-tab");
            //会话弹窗
            $keepSession = $(".js-keepSession")
            //结束会话弹窗
            $endSession = $(".js-endSession");
            //新会话
            $newMessage = $(".js-newMessage");
            //评价
            $satisfaction = $(".js-satisfaction");
            //oTxt = document.getElementById("js-textarea");
            //留言按钮
            $leaveMessage = $(".js-leaveMessage");
            //提示
            //$placeholder=$(".js-placeholder");
            $qqFaceTip = $(".qqFaceTip");

        };

        var resizeFrameWidthHandler = function(e) {

            //让iframe宽度变化
            var evt = e || window.event;
            type = evt.type;
            try {
                if (window.localStorage) {
                    window.localStorage.setItem('inputStatus', type);
                }

            } catch (e) {}
            if (window != window.parent) {
                if (type == 'focus')
                    window.parent.postMessage('focus-frame', '*');
                else if (type == 'blur')
                    window.parent.postMessage('blur-frame', '*');
            }
        };

        var leaveMessageBtnClickHandler = function(evt) {
            if (leaveMsgMutex) {
                return;
            }
            leaveMsgMutex = true;
            setTimeout(function() {
                leaveMsgMutex = false;
            }, 500);
            evt && evt.preventDefault();
            if (!$shadow || global.urlParams.leaveMsgSendGroupIdFlag) {
                //var $elm = $(evt.currentTarget);
                var url = global.apiConfig.leaveMsgUrl; //$elm.attr("data-href");
                url = url.replace(/\&back=\d/, '');
                // var color = global.urlParams.color + "" || 'fff';
                var color = global.urlParams.color ? global.urlParams.color : global.apiConfig.color;
                // console.log(color);
                if (color.indexOf("#") < 0) {
                    color = "#" + color;
                };
                url = url + "&uid=" + global.apiInit.uid;
                //在链接后面追加groupId
                if (global.urlParams.leaveMsgSendGroupIdFlag && global.urlParams.leaveMsgGroupId) {
                    url = url + "&leaveMsgGroupId=" + global.urlParams.leaveMsgGroupId
                };
                var _html = doT.template(template.shadowTemplate)({
                    'url': url,
                    'color': color,
                    'title': languageText['T0040']
                });
                $shadow = $(_html);

                $shadow.css({
                    'top': 0
                }).addClass("disabled");
                $(document.body).append($shadow);
                $shadow.find("iframe").css({
                    'height': document.body.clientHeight
                });
                $shadow.find(".close-btn").on("click", function() {});
            } else {
                $shadow.find("iframe")[0].contentWindow.location.reload();
            }
            if ($(".js-chatArea").hasClass("showChatAdd")) {
                showChatAddHandler();
            }
            setTimeout(function() {
                $shadow.toggleClass("disabled");
            }, 10);
        };

        var bindLitener = function() {
            //发送按钮
            $sendBtn.on(eventType, onbtnSendHandler);
            //qq表情
            $emotion.on(eventType, onEmotionClickHandler);
            $(document.body).delegate(".close-btn", 'click', onCommentWindowClose);
            $textarea.on("keyup", showSendBtnHandler);
            $(window).on("message", onPostMessage);
            // 发送消息
            $textarea.on('input', showSendBtnHandler, false);
            listener.on("core.grouplist", onGroupList);
            //$textarea.on("keydown",chatAdminshowtextHandler);
            $textarea.on("focus", hideChatAreaHandler);
            $textarea.on("focus", specialModelshideKeyboardHandler);
            $textarea.on("blur", specialModelsHandler);
            //$(document.body).delegate(".js-textarea", "focus", resizeFrameWidthHandler);
            $textarea.on("focus", resizeFrameWidthHandler);
            $textarea.on('blur', resizeFrameWidthHandler);
            /*******/
            $add.on(eventType, showChatAddHandler);
            $emotion.on(eventType, showChatEmotionHandler);
            //表情、加号切换
            $tab.on(eventType, tabChatAreaHandler)
            //定位光标
            listener.on("sendArea.gotoxy", gotoxyHandler);
            //模拟退格
            listener.on("sendArea.backDelete", backDeleteHandler);
            //发送图片
            listener.on("sendArea.uploadImgUrl", onImageUpload);
            $(window).on("resize", autoSizePhone);
            listener.on("listMsg.hideKeyboard", hideKeyboard);
            listener.on("listMsg.realScrollBottom", autoSizePhone);
            //转人工
            $(document.body).delegate(".js-artificial", eventType, artificialHandler);
            //结束会话
            listener.on("core.sessionclose", endSessionHandler);
            //新会话
            $newMessage.on(eventType, newMessage);
            //评价弹窗
            $satisfaction.on(eventType, evaluateHandler);
            //邀请评价
            listener.on("listMsg.toDetailEvaluate", toDetailEvaluate);
            //禁止滑动输入框
            $chatArea.on('touchmove', noSliding);
            $(".js-noSliding").on('touchmove', noSliding);

            //上传图片收起加号域
            listener.on("sendArea.closeAddarea", hideChatAreaHandler);
            //机器人超时会话
            listener.on("listMsg.robotAutoOffLine", endSessionHandler);
            $(document.body).on('listMsg-queue', onCustomQueue); //用户排队中
            //为了解决输入框遮挡问题
            $textarea.on("blur", function() {
                setTimeout(function() {
                    inputUPHandler();
                }, 50);
            });
            //回车发送
            $textarea.on('keydown', function(evt) {
                if (evt.keyCode == "13") {
                    //iphone人工模式下的回车会执行失焦事件
                    onbtnSendHandler(evt);
                    return false;
                }
            });

            listener.on("listMsg.showChatSwitch", function() {
                $artificial.css("display", "block");
            });
        };


        var onEmotionClickHandler = function() {
            listener.trigger('sendArea.faceShow');
        };
        var initPlugsin = function() { //插件
            //上传图片
            //iphone下用tap事件，输入框不失焦
            eventType = navigator.userAgent.toLowerCase().indexOf("mobile") >= 0 ? 'tap' : 'click';
            phoneTypeFlag = navigator.userAgent.toLowerCase().indexOf("iphone") >= 0 ? true : false;
            //alert(phoneTypeFlag);
            //alert(navigator.userAgent.toLowerCase());
            //判断是否开启咨询总结  只有值为 false 时隐藏 评价按钮
            //alert(global.urlParams.satDegree_A)
            // if (global.urlParams.satDegree_A){
            //      $satisfaction.addClass('show');
            // } else {
            //      $satisfaction.addClass('hide');
            // }
            autoSizePhone();
            if (global.urlParams.autoManual && (global.apiConfig.type == 1 || global.apiConfig.type == 3)) {
                setTimeout(artificialHandler, 100);
            }
        };
        var init = function() {
            //parseDOM();
            initPlugsin();
            bindLitener();
            //初始化按钮
            $qqFaceTip.addClass("activehide");
            $sendBtn.addClass("activehide");
            //hover效果
            initHover();
            //flex兼容处理
            if ($(".sendarea").css("display") != "flex") {
                flexcompatible();
            }
            //加号里面有东西就显示，没有不显示
            // if(!$chatAdd.width()){
            //     $add.addClass("activehide");
            // }
            try {
                if (window.localStorage) {
                    oldIsFirstPopInputFlag = window.localStorage.getItem('isFirstPopInputFlag') || 'true';
                    window.localStorage.setItem("isFirstPopInputFlag", oldIsFirstPopInputFlag);
                }

            } catch (e) {}
        };
        (function() {
            parseDOM();
            //是否隐藏按钮
            listener.on("core.buttonchange", changeStatusHandler);
            //改变当前状态
            listener.on("core.statechange", statusHandler);
            listener.on("sendArea.openleaveMsgPage", leaveMessageBtnClickHandler);
            //刷新，转人工成功
            listener.on("core.transfersuccess", function(data) {
                //人工名字
                aname = data.data.aname;
            });
        })();
        listener.on("core.onload", function(data) {
            global = data[0];
            language = global.language.lan;
            languageText = global.language.text;
            uploadImg = uploadImgFun(global);
            currentUid = global.apiInit.uid;
            currentCid = global.apiInit.cid;
            //留言开关，1开启，0关闭
            if (!global.urlParams.isMessageFlag) {
                $(".js-sendLeaveMessage").remove();
            }
            //上传附件开关，1开启，0关闭
            if (!global.apiConfig.isUploadFlag) {
                $(".js-uploadImg").remove();
            }
            //评价开关
            if (!global.urlParams.isFeedBackFlag) {
                $(".js-sendSatisfaction").remove();
            }
            //转人工的url（需求)
            var wurl = global.urlParams.wurl || "";
            var wurlOpenStyle = global.urlParams.wurlOpenStyle || "";
            if (wurl && global.urlParams.isCustomSysFlag == 1) {
                $artificial.remove();
                if (wurlOpenStyle) {
                    $(".js-textarea").before('<a class="artificial js-sendArtificial" target="_blank" href="' + wurl + '"></a>');
                } else {
                    $(".js-textarea").before('<a class="artificial js-sendArtificial" target="_parent" href="' + wurl + '"></a>');
                }

                $artificial = $(".js-sendArtificial");
                listener.trigger('sendArea.wurlHandler', {
                    "wurl": wurl,
                    "wurlOpenStyle": wurlOpenStyle
                });
            }
            //机器人未知问题显示转人工按钮
            var chatConnectButton = global.urlParams.chatConnectButton;
            if (chatConnectButton == "1") {
                $artificial.css("display", "none");
            }
            //将uid传入上传图片模块
            listener.trigger('sendArea.sendInitConfig', { "uid": currentUid, "sysNum": global.sysNum });
            //获取当前浏览器的版本
            browserType = global.browser.browser;
            phoneType = global.UAInfo.iphoneVersion;
            browserInfo = navigator.userAgent.toLowerCase();
            // alert(browserType);
            // alert(phoneType);
            // alert(browserInfo);
            //isMessageFlag按制输入框中的留言,0关闭，1开启
            if (global.urlParams.isMessageFlag) {
                var hostUrl = global.apiConfig.leaveMsgUrl;
                var conf = $.extend({
                    'hostUrl': hostUrl,
                    'languageText': languageText
                });
                var _html = doT.template(template.leaveMessageBtn)(conf);
                $leaveMessage.append(_html);
            };
            //msgflag控制窗体中和结束会话的留言,0开启，1关闭
            if (!global.urlParams.msgflag) {
                var hostUrl = global.apiConfig.leaveMsgUrl;
                var conf = $.extend({
                    'hostUrl': hostUrl,
                    'languageText': languageText
                });
                var _html2 = doT.template(template.leaveMessageEndBtn)(conf);
                $endSession.append(_html2);
            };
            //留言跳转第三方开关
            if (global.urlParams.isLeaveCustomSysFlag) {
                $(document.body).delegate(".leave-msg-btn", 'click', function() {
                    window.open(global.urlParams.leaveCustomUrl);
                });
                $node.delegate(".js-leaveMsgBtn", 'click', function() {
                    window.open(global.urlParams.leaveCustomUrl);
                });
            } else {
                //留言
                $(document.body).delegate(".leave-msg-btn", 'click', leaveMessageBtnClickHandler);
                $node.delegate(".js-leaveMsgBtn", 'click', leaveMessageBtnClickHandler);
            }

            $(".js-endSession").hide();
            //用户设置样式
            var userColor = global.userInfo.color;
            $sendBtn.css({ "background-color": userColor })
            init();
        });

    }

    module.exports = TextArea;
},{"../../../common/mode/currentState.js":9,"../../../common/util/listener.js":29,"../util/qqFace.js":66,"./browserAdapter.js":55,"./evaluate.js":56,"./template.js":58,"./uploadImg.js":59}],58:[function(require,module,exports){
    /**
     * @author daijm
     */
    var template = {};
    var sobotOne_selfHtml = '<div class="layer js-layer">' +
        '<div class="evamodeDialog js-evamodeDialog">' +
        '<div class="close"><span class="close_button js-close_button">×</span><p class="h1">{{=it.languageText.T0022}}</p></div>' +
        '<div class="model-body">' +
        '<div class="evaluate js-evaluate">' +
        '<div class="operateType">' +
        '<p class="operateTypeTitle">{{=it.subName}}{{=it.languageText.T0098}}</p>' +
        '<div class="operateTypeBtn">' +
        '<p class="solve solved js-solved"><span></span>{{=it.languageText.T0041}}</p>' +
        '<p class="solve unSolved js-unSolved" style="margin-left:25px;"><span></span>{{=it.languageText.T0042}}</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<a class="submit js-submit" href="#">{{=it.languageText.T0029}}</a>' +
        '</div>' +
        '</div>' +
        '</div>';
    var sobotTwo_selfHtml = '<div class="evaluateDetail js-evaluateDetail">' +
        '<p class="h2">{{=it.languageText.T0027}}</p>' +
        '<div class="situation">' +
        '{{for(var i=0;i<it.list.length;i++){}}' +
        '{{if(i%2==0){}}' +
        '<span class="tag js-tag" style="float:left;">' +
        '{{=it.list[i]}}' +
        '</span>' +
        '{{}else{}}' +
        '<span class="tag js-tag" style="float:right">' +
        '{{=it.list[i]}}' +
        '</span>' +
        '{{}}}' +
        '{{}}}' +
        '</div>' +
        '<textarea id="js-evaluateInner" class="js-evaluateInner" placeholder="{{=it.languageText.T0028}}" maxLength="200"></textarea>' +
        '</div>';
    var humanOne_selfHtml = '<div class="layer js-layer">' +
        '<div class="evamodeDialog js-evamodeDialog">' +
        '<div class="close"><span class="close_button js-close_button">×</span><p class="h1">{{=it.languageText.T0022}}</p></div>' +
        '<div class="model-body">' +
        '<div class="evaluate js-evaluate">' +
        '{{if(it.config[0].isQuestionFlag){}}' +
        '<div class="operateType">' +
        '<p class="operateTypeTitle">{{=it.subName}}{{=it.languageText.T0106}}</p>' +
        '<div class="operateTypeBtn">' +
        '<p class="solve solved js-solved"><span></span>{{=it.languageText.T0041}}</p>' +
        '<p class="solve unSolved js-unSolved" style="margin-left:25px;"><span></span>{{=it.languageText.T0042}}</p>' +
        '</div>' +
        '</div>' +
        '{{}}}' +
        '<p class="evaluateTipTitle">{{=it.languageText.T0096}}</p>' +
        '<div id="star">' +
        '<ul>' +
        '<li><a href="javascript:;">1</a></li>' +
        '<li><a href="javascript:;">2</a></li>' +
        '<li><a href="javascript:;">3</a></li>' +
        '<li><a href="javascript:;">4</a></li>' +
        '<li><a href="javascript:;">5</a></li>' +
        '</ul>' +
        '</div>' +
        '<p class="evaluateTip js-evaluateTip"></p>' +
        '</div>' +
        '<a class="submit js-submit" href="#">{{=it.languageText.T0029}}</a>' +
        '</div>' +
        '</div>' +
        '</div>';

    var humanTwo_selfHtml =
        '<div class="evaluateDetail js-evaluateDetail">' +
        '{{if(it.list.length>0){}}' +
        '<p class="h2">{{=it.languageText.T0027}}</p>' +
        '{{}}}' +
        '<div class="situation">' +
        '{{for(var i=0;i<it.list.length;i++){}}' +
        '{{if(i%2==0){}}' +
        '<span class="tag js-tag" style="float:left;">' +
        '{{=it.list[i]}}' +
        '</span>' +
        '{{}else{}}' +
        '<span class="tag js-tag" style="float:right;">' +
        '{{=it.list[i]}}' +
        '</span>' +
        '{{}}}' +
        '{{}}}' +
        '</div>' +
        '<textarea id="js-evaluateInner" class="js-evaluateInner" placeholder="{{=it.conf.inputLanguage||it.languageText.T0028}}{{=it.conf.isInputMust?it.languageText.T0046:it.languageText.T0047}}" maxLength="200"></textarea>' +
        '</div>';
// '</div>';
    var leaveMessageBtn = '<a style="display:block;width:60px;height:60px;" class="js-leaveMsgBtn" data-href="' +
        '{{=it.hostUrl}}' +
        '" href="#0"><i class="leaveMessagebg"></i><p>{{=it.languageText.T0030}}</p></a>';


    var leaveMessageEndBtn = '<span class="span3 js-endLeaveMessage"><a class="js-leaveMsgBtn" data-href="{{=it.hostUrl}}" href="' +
        '#0' +
        '"><i class="icon"></i><p>{{=it.languageText.T0030}}</p></a></span>';


    var waitingUploadImg = '<div class="js-allScreen allScreen"><div class="loadingUploadImg"><i></i><p>{{=it.language.L10036}}</p></div></div>';


    var evamsgHtml = '<div class="js-evamsg evamsg"><p>{{=it.language.L10037}}</p></div>';


    var evamsgHtml2 = '<div class="js-evamsg evamsg" style="color:#cb1f16"><p>{{=it.language.L10038}}</p></div>';


    var layerOpacity0 = '<div class="layer-opacity0"></div>';

    var shadowTemplate = '' +
        '<div class="shadow-layer">' +
        '<div class="shadow-title " style="background-color:#fff;color:#555556;"><div class="js-shadow-title-inner shadow-title-inner">{{=it.title}}</div><div class="close-btn" style="color:#666;">×</div></div>' +
        '<iframe style="position:absolute;top:8%;left:0; border:1px solid white;width:100% !important;height:92%;margin:0;padding:0;" src="{{=it.url}}"></iframe>' +
        '</div>' +
        '';

    template.shadowTemplate = shadowTemplate;
    template.sobotOne_selfHtml = sobotOne_selfHtml;
    template.sobotTwo_selfHtml = sobotTwo_selfHtml;
    template.humanOne_selfHtml = humanOne_selfHtml;
    template.humanTwo_selfHtml = humanTwo_selfHtml;
    template.leaveMessageBtn = leaveMessageBtn;
    template.leaveMessageEndBtn = leaveMessageEndBtn;
    template.evamsgHtml = evamsgHtml;
    template.evamsgHtml2 = evamsgHtml2;
    template.layerOpacity0 = layerOpacity0;
    template.waitingUploadImg = waitingUploadImg;
    module.exports = template;

},{}],59:[function(require,module,exports){
    /**
     *
     * @author daijm
     */
    function uploadImg(global) {
        var language = global.language.lan,
            languageText = global.language.text;
        var listener = require("../../../common/util/listener.js");
        //模板引擎
        var template = require('./template.js');
        var currentUid = "",
            sysNum = "";
        var ua = navigator.userAgent.toLowerCase();
        /*
         //模板引擎
         var template = require('./template.js');*/
        //传给聊天的url
        var parseDOM = function() {};
        var onFormDataUpHandler = function() {
            var oData = new FormData();
            var input = $(".js-upload")[0];
            //创建请求头
            var file = input.files[0];
            //判断上传文件是否为图片,微信和qq浏览器获取不到图片格式
            if ((/^(image)/.test(file.type)||(file.type==""&&(ua.match(/MicroMessenger/i) == "micromessenger")||(ua.match(/QQ/i) == "qq")))&&file.type!="image/tiff") {
                swatting();
                //展示图片之前先隐藏加号
                listener.trigger("sendArea.closeAddarea");
                //创建本地图片数据流
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    var tp = +new Date();
                    var token = currentUid + tp;
                    var fileRead = e.target.result;
                    //alert(fileRead);
                    //展示本地图
                    /*listener.trigger("sendArea.createUploadImg",[{
                     'result' : fileRead,
                     'date':tp,
                     'token':token
                     }]);*/
                    //等待加号关闭，再定位
                    setTimeout(function() {
                        listener.trigger('sendArea.autoSize', $(".js-chatArea"));
                        listener.trigger('sendArea.specialModels');
                    }, 700)
                    setTimeout(function() {
                        oData.append("sysNum", sysNum);
                        //获取扩展名，如果是gif就不让他压缩
                        var etc = fileRead.substring(fileRead.indexOf("data:image/") + 11, fileRead.indexOf(";base64"));
                        //console.log(etc);
                        if (etc == "gif") {
                            $(".js-allScreen").remove();
                            listener.trigger("sendArea.createUploadImg", [{
                                'result': fileRead,
                                'date': tp,
                                'token': token
                            }])
                            oData.append("base64", fileRead);
                            //上传
                            onAjaxUploadUpHandler(oData, tp, token)
                        } else {
                            //this.result 本地图片的数据流
                            lrz(file, {
                                quality: 0.9 //0.7 传4.82M剩于123k
                            }).then(function(results) {
                                listener.trigger("sendArea.createUploadImg", [{
                                    'result': results.base64,
                                    'date': tp,
                                    'token': token
                                }])
                                $(".js-allScreen").remove();
                                // size单位为字节 5M = 5242880
                                if (results.base64Len >= 5242880) {
                                    //图片过大
                                    //alert("图片大于5M");
                                    var imageLarge = { type: 'system', status: 'imageLarge', data: { content: language['L10034'] } }
                                    listener.trigger('sendArea.sendAreaSystemMsg', imageLarge);
                                    return;
                                }
                                oData.append("base64", results.base64);
                                //alert(results.base64);
                                //上传
                                onAjaxUploadUpHandler(oData, tp, token)
                            }).catch(function(err) {
                                console.log(err);
                                console.log('图片压缩失败')
                            }).always(function() {
                                //console.log('不管是成功失败，都会执行')
                            });
                        }
                    }, 1500)
                }

            } else {
                //alert("请上传正确的图片格式");
                var imageError = { type: 'system', status: 'imageError', data: { content: language['L10033'] } }
                listener.trigger('sendArea.sendAreaSystemMsg', imageError);
            }
            //清空文本域
            $(".js-upload").val("");

        }
        var onAjaxUploadUpHandler = function(oData, tp, token) {
            //listener.trigger('sendArea.autoSize',$(".js-chatArea"));
            var oXHR = new XMLHttpRequest();
            oXHR.upload.addEventListener('progress',
                function(e) {
                    if (e.lengthComputable) {
                        var iPercentComplete = Math.round(e.loaded * 100 / e.total);
                        var percentage = iPercentComplete.toString();
                        //console.log(percentage);
                        listener.trigger('sendArea.uploadImgProcess', { "percentage": percentage, "token": token }); //
                    } else {
                        //document.getElementById('progress').innerHTML = '无法计算';
                    }
                }, false);
            oXHR.open('POST', '/chat/webchat/fileuploadBase64.action');
            //console.log("我是base64上传");
            //中止上传
            listener.on('leftMsg.closeUploadImg', function() {
                oXHR.abort();
            })
            oXHR.send(oData);
            oXHR.onreadystatechange = function(req) {
                if (req.target.readyState == 4) {
                    if (req.target.status == 200) {
                        // console.log('base64上传成功');
                        var url = JSON.parse(req.target.response).url;
                        var img = url /*'<img class="webchat_img_upload uploadedFile" src="'+url+'">'*/ ;
                        listener.trigger('sendArea.uploadImgUrl', [{
                            'answer': img,
                            'date': tp,
                            'token': token
                        }]);
                    } else {
                        //alert("error");
                    }
                }
            }

        };
        //重新发送
        var imgUploadAgain = function(data) {
            var oData = new FormData();
            var oXHR = new XMLHttpRequest();
            var tp = +new Date();
            oXHR.upload.addEventListener('progress',
                function(e) {
                    if (e.lengthComputable) {
                        var iPercentComplete = Math.round(e.loaded * 100 / e.total);
                        var percentage = iPercentComplete.toString();
                        //console.log(percentage);
                        listener.trigger('sendArea.uploadImgProcess', { "percentage": percentage, "token": data.token }); //
                    } else {
                        //document.getElementById('progress').innerHTML = '无法计算';
                    }
                }, false);
            oXHR.open('POST', '/chat/webchat/fileuploadBase64.action');
            //中止上传
            listener.on('leftMsg.closeUploadImg', function() {
                oXHR.abort();
            });
            oData.append("sysNum", sysNum);
            oData.append("base64", data.base64);
            oXHR.send(oData);
            oXHR.onreadystatechange = function(req) {
                if (req.target.readyState == 4) {
                    if (req.target.status == 200) {
                        var url = JSON.parse(req.target.response).url;
                        var img = url /*'<img class="webchat_img_upload uploadedFile" src="'+url+'">'*/ ;
                        listener.trigger('sendArea.uploadImgUrl', [{
                            'answer': img,
                            'date': tp,
                            'token': data.token
                        }]);
                    } else {
                        //alert("error");
                    }
                }
            }

        }
        var swatting = function() {

            var conf = {
                'languageText': languageText,
                'language': language
            };
            var _html = doT.template(template.waitingUploadImg)(conf);
            $(document.body).append(_html);
            $('.loadingUploadImg').css("top", (($(document).height() - $('.loadingUploadImg').height()) / 2) + "px");
            $('.loadingUploadImg').css("left", (($(document).width() - $('.loadingUploadImg').width()) / 2) + "px");
        }
        var bindLitener = function() {
            var browserType = navigator.userAgent.toLowerCase();
            //console.log(browserType);
            //mozilla/5.0 (linux; u; android 4.4.4; zh-cn; htc d820mu build/ktu84p) applewebkit/534.30 (khtml, like gecko) version/4.0 mobile safari/534.30
            if (browserType.indexOf("htc") != -1 && browserType.indexOf("safari/534.30") != -1) {
                $(".js-upload").remove();
                $(".js-uploadImg").on("click", function() {
                    var imageLarge = { type: 'system', status: 'imageLarge', data: { content: language['L10035'] } }
                    listener.trigger('sendArea.sendAreaSystemMsg', imageLarge);
                });

            }

            $(".js-upload").on("change", onFormDataUpHandler);
            listener.on('listMsg.imgUploadAgain', imgUploadAgain)

        };

        var initPlugsin = function() { //插件
        };
        var initConfig = function(data) {
            currentUid = data.uid;
            sysNum = data.sysNum;
        };
        var init = function() {
            parseDOM();
            bindLitener();
            initPlugsin();
            listener.on('sendArea.sendInitConfig', initConfig)

        };
        init();

    }

    module.exports = uploadImg;

},{"../../../common/util/listener.js":29,"./template.js":58}],60:[function(require,module,exports){
    /**
     * @author daijm
     */

    function Alert(spec) {
        var Dialog = require('./dialog');
        var _self = this;
        var conf = $.extend({
            'text' : 'TEXT',
            'info' : '',
            "OK" : function(dialog) {
            }
        },spec);
        Dialog.call(this,conf);
        var initAlert = function() {
            var template = require('./template.js');
            var _html = doT.template(template.AlertTemplate)(conf);
            _self.setInner(_html);
        };

        initAlert();
    };

    module.exports = Alert;

},{"./dialog":61,"./template.js":68}],61:[function(require,module,exports){
    /**
     * @author daijm
     */
    function Dialog(spec) {
        var template = require('./template.js');
        var $layer="",
            $AlertTemplate_html="";
        var _self = this;
        //在悬浮窗里面弹窗的位置会靠下
        var _h=0;
        var conf = $.extend({
            "okText" : "确定",
            "title" : "提示",
            'inner' : false,
            "OK" : function() {

            }
        },spec);
        var initDOM = function() {
            $layer = $(template.layer);
            $AlertTemplate_html = doT.template(template.AlertTemplate)(conf);
        };
        var setInner = function(elm) {
            $(".model-body").html(elm);
            position();
        };
        var hide = function(e) {
            //灰层要和内容分开，否则输入框弹起，内容不跟随弹起，导致文本被键盘遮住
            $layer.animate({
                'opacity' : 0
            },300, function() {
                setTimeout(function() {
                    $layer.remove();
                },100);
            });
            $(".js-modeDialog").animate({
                'opacity' : 0
            },300, function() {
                setTimeout(function() {
                    $(".js-modeDialog").remove();
                },100);
            });

        };
        //不可多选
        var toggleActive=function(){
            $(this).addClass("active").siblings().removeClass("active")
        };
        var bindListener = function() {
            //$layer.on("click",hide);
            /*$layer.on("click",function(e) {
             e.stopPropagation();
             });*/
            $(".js-modeDialog").delegate(".close_button",'click',hide);
            $(".wether span").on("click",toggleActive);
        };
        var position =function(){
            //  var phoneFlag = navigator.userAgent.toLowerCase().indexOf("iphone");
            // // console.log(phoneFlag);
            //  if(phoneFlag){
            //      _h=30;
            //  }
            //  //居中
            //  var left,top;
            //  left=($(window).width()-($(window).width()*0.84))/2+"px";
            //  top=($(window).height()-$(".js-modeDialog").height())/2-_h+"px";
            //  $(".js-modeDialog").css({"left":left,"top":top});
            //  //$(".js-modeDialog").css("top",top);
        };
        var show = function() {
            //灰层要和内容分开，否则输入框弹起，内容不跟随弹起，导致文本被键盘遮住
            $(document.body).append($layer);
            $(document.body).append($AlertTemplate_html);
            bindListener();
            position();
        };
        var init = function() {
            initDOM();
        };
        init();

        //this.getOuter = getOuter;
        this.setInner = setInner;
        this.show = show;
        this.hide = hide;
    }

    module.exports = Dialog;

},{"./template.js":68}],62:[function(require,module,exports){
    var that = {};
    that.qqfaceReg =/\/::\)|\/::~|\/::B|\/::\||\/:8-\)|\/::<|\/::\$|\/::X|\/::Z|\/::'\(|\/::-\||\/::@|\/::P|\/::D|\/::O|\/::\(|\/::\+|\/:–b|\/::Q|\/::T|\/:,@P|\/:,@-D|\/::d|\/:,@o|\/::g|\/:\|-\)|\/::!|\/::L|\/::>|\/::,@|\/:,@f|\/::-S|\/:\?|\/:,@x|\/:,@@|\/::8|\/:,@!|\/:!!!|\/:xx|\/:bye|\/:wipe|\/:dig|\/:handclap|\/:&-\(|\/:B-\)|\/:<@|\/:@>|\/::-O|\/:>-\||\/:P-\(|\/::'\||\/:X-\)|\/::\*|\/:@x|\/:8\*|\/:pd|\/:<W>|\/:beer|\/:basketb|\/:oo|\/:coffee|\/:eat|\/:pig|\/:rose|\/:fade|\/:showlove|\/:heart|\/:break|\/:cake|\/:li|\/:bome|\/:kn|\/:footb|\/:ladybug|\/:shit|\/:moon|\/:sun|\/:gift|\/:hug|\/:strong|\/:weak|\/:share|\/:v|\/:@\)|\/:jj|\/:@@|\/:bad|\/:lvu|\/:no|\/:ok|\/:love|\/:<L>|\/:jump|\/:shake|\/:<O>|\/:circle|\/:kotow|\/:turn|\/:skip|\/:oY|\/:#-0|\/:hiphot|\/:kiss|\/:<&|\/:&>|\/微笑|\/撇嘴|\/色|\/发呆|\/得意|\/流泪|\/害羞|\/闭嘴|\/睡|\/大哭|\/尴尬|\/发怒|\/调皮|\/呲牙|\/惊讶|\/难过|\/酷|\/冷汗|\/衰|\/骷髅|\/敲打|\/再见|\/擦汗|\/抠鼻|\/鼓掌|\/糗大了|\/坏笑|\/左哼哼|\/右哼哼|\/哈欠|\/鄙视|\/委屈|\/快哭了|\/阴险|\/亲亲|\/吓|\/可怜|\/抓狂|\/吐|\/偷笑|\/愉快|\/白眼|\/傲慢|\/饥饿|\/困|\/惊恐|\/流汗|\/憨笑|\/悠闲|\/奋斗|\/咒骂|\/疑问|\/嘘|\/晕|\/疯了|\/篮球|\/乒乓|\/咖啡|\/饭|\/猪头|\/玫瑰|\/调谢|\/嘴唇|\/爱心|\/心碎|\/蛋糕|\/闪电|\/炸弹|\/刀|\/足球|\/瓢虫|\/便便|\/月亮|\/太阳|\/礼物|\/拥抱|\/菜刀|\/西瓜|\/啤酒|\/弱|\/握手|\/胜利|\/抱拳|\/勾引|\/拳头|\/差劲|\/爱你|\/NO|\/OK|\/爱情|\/飞吻|\/跳跳|\/强|\/发抖|\/怄火|\/转圈|\/磕头|\/回头|\/跳绳|\/投降|\/激动|\/乱舞|\/献吻|\/左太极|\/右太极|\[微笑\]|\[撇嘴\]|\[色\]|\[发呆\]|\[得意\]|\[流泪\]|\[害羞\]|\[闭嘴\]|\[睡\]|\[大哭\]|\[尴尬\]|\[发怒\]|\[调皮\]|\[呲牙\]|\[惊讶\]|\[难过\]|\[酷\]|\[冷汗\]|\[衰\]|\[骷髅\]|\[敲打\]|\[再见\]|\[擦汗\]|\[抠鼻\]|\[鼓掌\]|\[糗大了\]|\[坏笑\]|\[左哼哼\]|\[右哼哼\]|\[哈欠\]|\[鄙视\]|\[委屈\]|\[快哭了\]|\[阴险\]|\[亲亲\]|\[吓\]|\[可怜\]|\[抓狂\]|\[吐\]|\[偷笑\]|\[愉快\]|\[白眼\]|\[傲慢\]|\[饥饿\]|\[困\]|\[惊恐\]|\[流汗\]|\[憨笑\]|\[悠闲\]|\[奋斗\]|\[咒骂\]|\[疑问\]|\[嘘\]|\[晕\]|\[疯了\]|\[篮球\]|\[乒乓\]|\[咖啡\]|\[饭\]|\[猪头\]|\[玫瑰\]|\[调谢\]|\[嘴唇\]|\[爱心\]|\[心碎\]|\[蛋糕\]|\[闪电\]|\[炸弹\]|\[刀\]|\[足球\]|\[瓢虫\]|\[便便\]|\[月亮\]|\[太阳\]|\[礼物\]|\[拥抱\]|\[菜刀\]|\[西瓜\]|\[啤酒\]|\[弱\]|\[握手\]|\[胜利\]|\[抱拳\]|\[勾引\]|\[拳头\]|\[差劲\]|\[爱你\]|\[NO\]|\[OK\]|\[爱情\]|\[飞吻\]|\[跳跳\]|\[强\]|\[发抖\]|\[怄火\]|\[转圈\]|\[磕头\]|\[回头\]|\[跳绳\]|\[投降\]|\[激动\]|\[乱舞\]|\[献吻\]|\[左太极\]|\[右太极\]/g;

    that.qqfaceReg2 =/\/::\)|\/::~|\/::B|\/::\||\/:8-\)|\/::<|\/::\$|\/::X|\/::Z|\/::'\(|\/::-\||\/::@|\/::P|\/::D|\/::O|\/::\(|\/::\+|\/:–b|\/::Q|\/::T|\/:,@P|\/:,@-D|\/::d|\/:,@o|\/::g|\/:\|-\)|\/::!|\/::L|\/::>|\/::,@|\/:,@f|\/::-S|\/:\?|\/:,@x|\/:,@@|\/::8|\/:,@!|\/:!!!|\/:xx|\/:bye|\/:wipe|\/:dig|\/:handclap|\/:&-\(|\/:B-\)|\/:<@|\/:@>|\/::-O|\/:>-\||\/:P-\(|\/::'\||\/:X-\)|\/::\*|\/:@x|\/:8\*|\/:pd|\/:<W>|\/:beer|\/:basketb|\/:oo|\/:coffee|\/:eat|\/:pig|\/:rose|\/:fade|\/:showlove|\/:heart|\/:break|\/:cake|\/:li|\/:bome|\/:kn|\/:footb|\/:ladybug|\/:shit|\/:moon|\/:sun|\/:gift|\/:hug|\/:strong|\/:weak|\/:share|\/:v|\/:@\)|\/:jj|\/:@@|\/:bad|\/:lvu|\/:no|\/:ok|\/:love|\/:<L>|\/:jump|\/:shake|\/:<O>|\/:circle|\/:kotow|\/:turn|\/:skip|\/:oY|\/:#-0|\/:hiphot|\/:kiss|\/:<&|\/:&>|\/微笑|\/撇嘴|\/色|\/发呆|\/得意|\/流泪|\/害羞|\/闭嘴|\/睡|\/大哭|\/尴尬|\/发怒|\/调皮|\/呲牙|\/惊讶|\/难过|\/酷|\/冷汗|\/衰|\/骷髅|\/敲打|\/再见|\/擦汗|\/抠鼻|\/鼓掌|\/糗大了|\/坏笑|\/左哼哼|\/右哼哼|\/哈欠|\/鄙视|\/委屈|\/快哭了|\/阴险|\/亲亲|\/吓|\/可怜|\/抓狂|\/吐|\/偷笑|\/愉快|\/白眼|\/傲慢|\/饥饿|\/困|\/惊恐|\/流汗|\/憨笑|\/悠闲|\/奋斗|\/咒骂|\/疑问|\/嘘|\/晕|\/疯了|\/篮球|\/乒乓|\/咖啡|\/饭|\/猪头|\/玫瑰|\/调谢|\/嘴唇|\/爱心|\/心碎|\/蛋糕|\/闪电|\/炸弹|\/刀|\/足球|\/瓢虫|\/便便|\/月亮|\/太阳|\/礼物|\/拥抱|\/菜刀|\/西瓜|\/啤酒|\/弱|\/握手|\/胜利|\/抱拳|\/勾引|\/拳头|\/差劲|\/爱你|\/NO|\/OK|\/爱情|\/飞吻|\/跳跳|\/强|\/发抖|\/怄火|\/转圈|\/磕头|\/回头|\/跳绳|\/投降|\/激动|\/乱舞|\/献吻|\/左太极|\/右太极|\[微笑\]|\[撇嘴\]|\[色\]|\[发呆\]|\[得意\]|\[流泪\]|\[害羞\]|\[闭嘴\]|\[睡\]|\[大哭\]|\[尴尬\]|\[发怒\]|\[调皮\]|\[呲牙\]|\[惊讶\]|\[难过\]|\[酷\]|\[冷汗\]|\[衰\]|\[骷髅\]|\[敲打\]|\[再见\]|\[擦汗\]|\[抠鼻\]|\[鼓掌\]|\[糗大了\]|\[坏笑\]|\[左哼哼\]|\[右哼哼\]|\[哈欠\]|\[鄙视\]|\[委屈\]|\[快哭了\]|\[阴险\]|\[亲亲\]|\[吓\]|\[可怜\]|\[抓狂\]|\[吐\]|\[偷笑\]|\[愉快\]|\[白眼\]|\[傲慢\]|\[饥饿\]|\[困\]|\[惊恐\]|\[流汗\]|\[憨笑\]|\[悠闲\]|\[奋斗\]|\[咒骂\]|\[疑问\]|\[嘘\]|\[晕\]|\[疯了\]|\[篮球\]|\[乒乓\]|\[咖啡\]|\[饭\]|\[猪头\]|\[玫瑰\]|\[调谢\]|\[嘴唇\]|\[爱心\]|\[心碎\]|\[蛋糕\]|\[闪电\]|\[炸弹\]|\[刀\]|\[足球\]|\[瓢虫\]|\[便便\]|\[月亮\]|\[太阳\]|\[礼物\]|\[拥抱\]|\[菜刀\]|\[西瓜\]|\[啤酒\]|\[弱\]|\[握手\]|\[胜利\]|\[抱拳\]|\[勾引\]|\[拳头\]|\[差劲\]|\[爱你\]|\[NO\]|\[OK\]|\[爱情\]|\[飞吻\]|\[跳跳\]|\[强\]|\[发抖\]|\[怄火\]|\[转圈\]|\[磕头\]|\[回头\]|\[跳绳\]|\[投降\]|\[激动\]|\[乱舞\]|\[献吻\]|\[左太极\]|\[右太极\]/
    /*that.qqfaceReg =/\/::\)|\/::~|\/::B|\/::\||\/:8-\)|\/::<|\/::\$|\/::X|\/::Z|\/::'\(|\/::-\||\/::@|\/::P|\/::D|\/::O|\/::\(|\/::\+|\/:–b|\/::Q|\/::T|\/:,@P|\/:,@-D|\/::d|\/:,@o|\/::g|\/:\|-\)|\/::!|\/微笑|\/撇嘴|\/色|\/发呆|\/得意|\/流泪|\/害羞|\/闭嘴|\/睡|\/大哭|\/尴尬|\/发怒|\/调皮|\/呲牙|\/惊讶|\/难过|\/酷|\/冷汗|\/抓狂|\/吐|\/偷笑|\/愉快|\/白眼|\/傲慢|\/饥饿|\/困|\/惊恐|\[微笑\]|\[撇嘴\]|\[色\]|\[发呆\]|\[得意\]|\[流泪\]|\[害羞\]|\[闭嘴\]|\[睡\]|\[大哭\]|\[尴尬\]|\[发怒\]|\[调皮\]|\[呲牙\]|\[惊讶\]|\[难过\]|\[酷\]|\[冷汗\]|\[抓狂\]|\[吐\]|\[偷笑\]|\[愉快\]|\[白眼\]|\[傲慢\]|\[饥饿\]|\[困\]|\[惊恐\]/g;
     that.qqfaceReg2 =/\/::\)|\/::~|\/::B|\/::\||\/:8-\)|\/::<|\/::\$|\/::X|\/::Z|\/::'\(|\/::-\||\/::@|\/::P|\/::D|\/::O|\/::\(|\/::\+|\/:–b|\/::Q|\/::T|\/:,@P|\/:,@-D|\/::d|\/:,@o|\/::g|\/:\|-\)|\/::!|\/微笑|\/撇嘴|\/色|\/发呆|\/得意|\/流泪|\/害羞|\/闭嘴|\/睡|\/大哭|\/尴尬|\/发怒|\/调皮|\/呲牙|\/惊讶|\/难过|\/酷|\/冷汗|\/抓狂|\/吐|\/偷笑|\/愉快|\/白眼|\/傲慢|\/饥饿|\/困|\/惊恐|\[微笑\]|\[撇嘴\]|\[色\]|\[发呆\]|\[得意\]|\[流泪\]|\[害羞\]|\[闭嘴\]|\[睡\]|\[大哭\]|\[尴尬\]|\[发怒\]|\[调皮\]|\[呲牙\]|\[惊讶\]|\[难过\]|\[酷\]|\[冷汗\]|\[抓狂\]|\[吐\]|\[偷笑\]|\[愉快\]|\[白眼\]|\[傲慢\]|\[饥饿\]|\[困\]|\[惊恐\]/; */
    module.exports = that;
},{}],63:[function(require,module,exports){
    module.exports=/*{
     "[微笑]": "weixiao",
     "[撇嘴]": "piezui",
     "[色]": "se",
     "[发呆]": "fadai",
     "[得意]": "deyi",
     "[流泪]": "liulei",
     "[害羞]": "haixiu",
     "[闭嘴]": "bizui",
     "[睡]": "shui",
     "[大哭]": "daku",
     "[尴尬]": "ganga",
     "[发怒]": "fanu",
     "[调皮]": "tiaopi",
     "[呲牙]": "ciya",
     "[惊讶]": "jingya",
     "[难过]": "nanguo",
     "[酷]": "ku",
     "[冷汗]": "lenghan",
     "[衰]": "shuai",
     "[骷髅]": "kulou",
     "[敲打]": "qiaoda",
     "[再见]": "zaijian",
     "[擦汗]": "cahan",
     "[抠鼻]": "koubi",
     "[鼓掌]": "guzhang",
     "[糗大了]": "qiudal",
     "[坏笑]": "huaixiao",
     "[左哼哼]": "zuohengheng",
     "[右哼哼]": "youhengheng",
     "[哈欠]": "haqian",
     "[鄙视]": "bishi",
     "[委屈]": "weiqu",
     "[快哭了]": "kuaikul",
     "[阴险]": "yinxian",
     "[亲亲]": "qinqin",
     "[吓]": "xia",
     "[可怜]": "kelian",
     "[抓狂]": "zhuakuang",
     "[吐]": "tu",
     "[偷笑]": "touxiao",
     "[愉快]": "yukuai",
     "[白眼]": "baiyan",
     "[傲慢]": "aoman",
     "[饥饿]": "jie",
     "[困]": "kun",
     "[惊恐]": "jingkong",
     "[流汗]": "liuhan",
     "[憨笑]": "hanxiao",
     "[悠闲]": "youxian",
     "[奋斗]": "fendou",
     "[咒骂]": "zhouma",
     "[疑问]": "yiwen",
     "[嘘]": "xu",
     "[晕]": "yun",
     "[疯了]": "fengl",
     "[篮球]": "lanqiu",
     "[乒乓]": "pingpang",
     "[咖啡]": "kafei",
     "[饭]": "fan",
     "[猪头]": "zhutou",
     "[玫瑰]": "meigui",
     "[调谢]": "diaoxie",
     "[嘴唇]": "zuichun",
     "[爱心]": "aixin",
     "[心碎]": "xinsui",
     "[蛋糕]": "dangao",
     "[闪电]": "shandian",
     "[炸弹]": "zhadan",
     "[刀]": "dao",
     "[足球]": "zuqiu",
     "[瓢虫]": "piaochong",
     "[便便]": "bianbian",
     "[月亮]": "yueliang",
     "[太阳]": "taiyang",
     "[礼物]": "liwu",
     "[拥抱]": "yongbao",
     "[菜刀]": "caidao",
     "[西瓜]": "xigua",
     "[啤酒]": "pijiu",
     "[弱]": "ruo",
     "[握手]": "woshou",
     "[胜利]": "shengli",
     "[抱拳]": "baoquan",
     "[勾引]": "gouyin",
     "[拳头]": "quantou",
     "[差劲]": "chajin",
     "[爱你]": "aini",
     "[NO]": "no_1",
     "[OK]": "ok_1",
     "[爱情]": "aiqing",
     "[飞吻]": "feiwen",
     "[跳跳]": "tiaotiao",
     "[强]": "qiang",
     "[发抖]": "fadou",
     "[怄火]": "ouhuo",
     "[转圈]": "zhuanquan",
     "[磕头]": "ketou",
     "[回头]": "huitou",
     "[跳绳]": "tiaosheng",
     "[投降]": "touxiang",
     "[激动]": "jidong",
     "[乱舞]": "luanwu",
     "[献吻]": "xianwen",
     "[左太极]": "zuotaiji",
     "[右太极]": "youtaiji"
     }*/
        {
            "[微笑]": "weixiao",
            "[撇嘴]": "piezui",
            "[色]": "se",
            "[发呆]": "fadai",
            "[得意]": "deyi",
            "[流泪]": "liulei",
            "[害羞]": "haixiu",
            "[闭嘴]": "bizui",
            "[睡]": "shui",
            "[大哭]": "daku",
            "[尴尬]": "ganga",
            "[发怒]": "fanu",
            "[调皮]": "tiaopi",
            "[呲牙]": "ciya",
            "[惊讶]": "jingya",
            "[难过]": "nanguo",
            "[酷]": "ku",
            "[冷汗]": "lenghan",
            "[抓狂]": "zhuakuang",
            "[吐]": "tu",
            "[偷笑]": "touxiao",
            "[愉快]": "yukuai",
            "[白眼]": "baiyan",
            "[傲慢]": "aoman",
            "[饥饿]": "jie",
            "[困]": "kun",
            "[惊恐]": "jingkong"
        }
},{}],64:[function(require,module,exports){
    module.exports={
        "/::)": "weixiao",
        "/::~": "piezui",
        "/::B": "se",
        "/::|": "fadai",
        "/:8-)": "deyi",
        "/::<": "liulei",
        "/::$": "haixiu",
        "/::X": "bizui",
        "/::Z": "shui",
        "/::'(": "daku",
        "/::-|": "ganga",
        "/::@": "fanu",
        "/::P": "tiaopi",
        "/::D": "ciya",
        "/::O": "jingya",
        "/::(": "nanguo",
        "/::+": "ku",
        "/:–b": "lenghan",
        "/:,@!": "shuai",
        "/:!!!": "kulou",
        "/::Q": "zhuakuang",
        "/::T": "tu",
        "/:,@P": "touxiao",
        "/:,@-D": "yukuai",
        "/::d": "baiyan",
        "/:,@o": "aoman",
        "/::g": "jie",
        "/:|-)": "kun",
        "/::!": "jingkong",
        "/::L": "liuhan",
        "/::>": "hanxiao",
        "/::,@": "youxian",
        "/:,@f": "fendou",
        "/::-S": "zhouma",
        "/:?": "yiwen",
        "/:,@x": "xu",
        "/:,@@": "yun",
        "/::8": "fengl",
        "/:xx": "qiaoda",
        "/:bye": "zaijian",
        "/:wipe": "cahan",
        "/:dig": "koubi",
        "/:handclap": "guzhang",
        "/:&-(": "qiudal",
        "/:B-)": "huaixiao",
        "/:<@": "zuohengheng",
        "/:@>": "youhengheng",
        "/::-O": "haqian",
        "/:>-|": "bishi",
        "/:P-(": "weiqu",
        "/:X-)": "yinxian",
        "/::'|": "kuaikul",
        "/::*": "qinqin",
        "/:@x": "xia",
        "/:8*": "kelian",
        "/:pd": "caidao",
        "/:<W>": "xigua",
        "/:beer": "pijiu",
        "/:basketb": "lanqiu",
        "/:oo": "pingpang",
        "/:coffee": "kafei",
        "/:eat": "fan",
        "/:pig": "zhutou",
        "/:rose": "meigui",
        "/:fade": "diaoxie",
        "/:showlove": "zuichun",
        "/:heart": "aixin",
        "/:break": "xinsui",
        "/:cake": "dangao",
        "/:li": "shandian",
        "/:bome": "zhadan",
        "/:kn": "dao",
        "/:footb": "zuqiu",
        "/:ladybug": "piaochong",
        "/:shit": "bianbian",
        "/:moon": "yueliang",
        "/:sun": "taiyang",
        "/:gift": "liwu",
        "/:hug": "yongbao",
        "/:strong": "qiang",
        "/:weak": "ruo",
        "/:share": "woshou",
        "/:v": "shengli",
        "/:@)": "baoquan",
        "/:jj": "gouyin",
        "/:@@": "quantou",
        "/:bad": "chajin",
        "/:lvu": "aini",
        "/:no": "no_1",
        "/:ok": "ok_1",
        "/:love":"aiqing",
        "/:<L>": "feiwen",
        "/:jump": "tiaotiao",
        "/:shake": "fadou",
        "/:<O>": "ouhuo",
        "/:circle": "zhuanquan",
        "/:kotow": "ketou",
        "/:turn": "huitou",
        "/:skip": "tiaosheng",
        "/:oY": "touxiang",
        "/:#-0": "jidong",
        "/:hiphot": "luanwu",
        "/:kiss": "xianwen",
        "/:<&": "zuotaiji",
        "/:&>": "youtaiji",
        "/微笑": "weixiao",
        "/撇嘴": "piezui",
        "/色": "se",
        "/发呆": "fadai",
        "/得意": "deyi",
        "/流泪": "liulei",
        "/害羞": "haixiu",
        "/闭嘴": "bizui",
        "/睡": "shui",
        "/大哭": "daku",
        "/尴尬": "ganga",
        "/发怒": "fanu",
        "/调皮": "tiaopi",
        "/呲牙": "ciya",
        "/惊讶": "jingya",
        "/难过": "nanguo",
        "/酷": "ku",
        "/冷汗": "lenghan",
        "/衰": "shuai",
        "/骷髅": "kulou",
        "/敲打": "qiaoda",
        "/再见": "zaijian",
        "/擦汗": "cahan",
        "/抠鼻": "koubi",
        "/鼓掌": "guzhang",
        "/糗大了": "qiudal",
        "/坏笑": "huaixiao",
        "/左哼哼": "zuohengheng",
        "/右哼哼": "youhengheng",
        "/哈欠": "haqian",
        "/鄙视": "bishi",
        "/委屈": "weiqu",
        "/快哭了": "kuaikul",
        "/阴险": "yinxian",
        "/亲亲": "qinqin",
        "/吓": "xia",
        "/可怜": "kelian",
        "/抓狂": "zhuakuang",
        "/吐": "tu",
        "/偷笑": "touxiao",
        "/愉快": "yukuai",
        "/白眼": "baiyan",
        "/傲慢": "aoman",
        "/饥饿": "jie",
        "/困": "kun",
        "/惊恐": "jingkong",
        "/流汗": "liuhan",
        "/憨笑": "hanxiao",
        "/悠闲": "youxian",
        "/奋斗": "fendou",
        "/咒骂": "zhouma",
        "/疑问": "yiwen",
        "/嘘": "xu",
        "/晕": "yun",
        "/疯了": "fengl",
        "/篮球": "lanqiu",
        "/乒乓": "pingpang",
        "/咖啡": "kafei",
        "/饭": "fan",
        "/猪头": "zhutou",
        "/玫瑰": "meigui",
        "/调谢": "diaoxie",
        "/嘴唇": "zuichun",
        "/爱心": "aixin",
        "/心碎": "xinsui",
        "/蛋糕": "dangao",
        "/闪电": "shandian",
        "/炸弹": "zhadan",
        "/刀": "dao",
        "/足球": "zuqiu",
        "/瓢虫": "piaochong",
        "/便便": "bianbian",
        "/月亮": "yueliang",
        "/太阳": "taiyang",
        "/礼物": "liwu",
        "/拥抱": "yongbao",
        "/菜刀": "caidao",
        "/西瓜": "xigua",
        "/啤酒": "pijiu",
        "/弱": "ruo",
        "/握手": "woshou",
        "/胜利": "shengli",
        "/抱拳": "baoquan",
        "/勾引": "gouyin",
        "/拳头": "quantou",
        "/差劲": "chajin",
        "/爱你": "aini",
        "/NO": "no_1",
        "/OK": "ok_1",
        "/爱情": "aiqing",
        "/飞吻": "feiwen",
        "/跳跳": "tiaotiao",
        "/强": "qiang",
        "/发抖": "fadou",
        "/怄火": "ouhuo",
        "/转圈": "zhuanquan",
        "/磕头": "ketou",
        "/回头": "huitou",
        "/跳绳": "tiaosheng",
        "/投降": "touxiang",
        "/激动": "jidong",
        "/乱舞": "luanwu",
        "/献吻": "xianwen",
        "/左太极": "zuotaiji",
        "/右太极": "youtaiji",
        "[微笑]": "weixiao",
        "[撇嘴]": "piezui",
        "[色]": "se",
        "[发呆]": "fadai",
        "[得意]": "deyi",
        "[流泪]": "liulei",
        "[害羞]": "haixiu",
        "[闭嘴]": "bizui",
        "[睡]": "shui",
        "[大哭]": "daku",
        "[尴尬]": "ganga",
        "[发怒]": "fanu",
        "[调皮]": "tiaopi",
        "[呲牙]": "ciya",
        "[惊讶]": "jingya",
        "[难过]": "nanguo",
        "[酷]": "ku",
        "[冷汗]": "lenghan",
        "[衰]": "shuai",
        "[骷髅]": "kulou",
        "[敲打]": "qiaoda",
        "[再见]": "zaijian",
        "[擦汗]": "cahan",
        "[抠鼻]": "koubi",
        "[鼓掌]": "guzhang",
        "[糗大了]": "qiudal",
        "[坏笑]": "huaixiao",
        "[左哼哼]": "zuohengheng",
        "[右哼哼]": "youhengheng",
        "[哈欠]": "haqian",
        "[鄙视]": "bishi",
        "[委屈]": "weiqu",
        "[快哭了]": "kuaikul",
        "[阴险]": "yinxian",
        "[亲亲]": "qinqin",
        "[吓]": "xia",
        "[可怜]": "kelian",
        "[抓狂]": "zhuakuang",
        "[吐]": "tu",
        "[偷笑]": "touxiao",
        "[愉快]": "yukuai",
        "[白眼]": "baiyan",
        "[傲慢]": "aoman",
        "[饥饿]": "jie",
        "[困]": "kun",
        "[惊恐]": "jingkong",
        "[流汗]": "liuhan",
        "[憨笑]": "hanxiao",
        "[悠闲]": "youxian",
        "[奋斗]": "fendou",
        "[咒骂]": "zhouma",
        "[疑问]": "yiwen",
        "[嘘]": "xu",
        "[晕]": "yun",
        "[疯了]": "fengl",
        "[篮球]": "lanqiu",
        "[乒乓]": "pingpang",
        "[咖啡]": "kafei",
        "[饭]": "fan",
        "[猪头]": "zhutou",
        "[玫瑰]": "meigui",
        "[调谢]": "diaoxie",
        "[嘴唇]": "zuichun",
        "[爱心]": "aixin",
        "[心碎]": "xinsui",
        "[蛋糕]": "dangao",
        "[闪电]": "shandian",
        "[炸弹]": "zhadan",
        "[刀]": "dao",
        "[足球]": "zuqiu",
        "[瓢虫]": "piaochong",
        "[便便]": "bianbian",
        "[月亮]": "yueliang",
        "[太阳]": "taiyang",
        "[礼物]": "liwu",
        "[拥抱]": "yongbao",
        "[菜刀]": "caidao",
        "[西瓜]": "xigua",
        "[啤酒]": "pijiu",
        "[弱]": "ruo",
        "[握手]": "woshou",
        "[胜利]": "shengli",
        "[抱拳]": "baoquan",
        "[勾引]": "gouyin",
        "[拳头]": "quantou",
        "[差劲]": "chajin",
        "[爱你]": "aini",
        "[NO]": "no_1",
        "[OK]": "ok_1",
        "[爱情]": "aiqing",
        "[飞吻]": "feiwen",
        "[跳跳]": "tiaotiao",
        "[强]": "qiang",
        "[发抖]": "fadou",
        "[怄火]": "ouhuo",
        "[转圈]": "zhuanquan",
        "[磕头]": "ketou",
        "[回头]": "huitou",
        "[跳绳]": "tiaosheng",
        "[投降]": "touxiang",
        "[激动]": "jidong",
        "[乱舞]": "luanwu",
        "[献吻]": "xianwen",
        "[左太极]": "zuotaiji",
        "[右太极]": "youtaiji"
    }
    /*{
     "/::)": "1",
     "/::~": "2",
     "/::B": "3",
     "/::|": "4",
     "/:8-)": "5",
     "/::<": "6",
     "/::$": "7",
     "/::X": "8",
     "/::Z": "9",
     "/::'(": "10",
     "/::-|": "11",
     "/::@": "12",
     "/::P": "13",
     "/::D": "14",
     "/::O": "15",
     "/::(": "16",
     "/::+": "17",
     "/:–b": "18",
     "/::Q": "19",
     "/::T": "20",
     "/:,@P": "21",
     "/:,@-D": "22",
     "/::d": "23",
     "/:,@o": "24",
     "/::g": "25",
     "/:|-)": "26",
     "/::!": "27",
     "/微笑": "1",
     "/撇嘴": "2",
     "/色": "3",
     "/发呆": "4",
     "/得意": "5",
     "/流泪": "6",
     "/害羞": "7",
     "/闭嘴": "8",
     "/睡": "9",
     "/大哭": "10",
     "/尴尬": "11",
     "/发怒": "12",
     "/调皮": "13",
     "/呲牙": "14",
     "/惊讶": "15",
     "/难过": "16",
     "/酷": "17",
     "/冷汗": "18",
     "/抓狂": "19",
     "/吐": "20",
     "/偷笑": "21",
     "/愉快": "22",
     "/白眼": "23",
     "/傲慢": "24",
     "/饥饿": "25",
     "/困": "26",
     "/惊恐": "27",
     "[微笑]": "1",
     "[撇嘴]": "2",
     "[色]": "3",
     "[发呆]": "4",
     "[得意]": "5",
     "[流泪]": "6",
     "[害羞]": "7",
     "[闭嘴]": "8",
     "[睡]": "9",
     "[大哭]": "10",
     "[尴尬]": "11",
     "[发怒]": "12",
     "[调皮]": "13",
     "[呲牙]": "14",
     "[惊讶]": "15",
     "[难过]": "16",
     "[酷]": "17",
     "[冷汗]": "18",
     "[抓狂]": "19",
     "[吐]": "20",
     "[偷笑]": "21",
     "[愉快]": "22",
     "[白眼]": "23",
     "[傲慢]": "24",
     "[饥饿]": "25",
     "[困]": "26",
     "[惊恐]": "27"
     }*/
},{}],65:[function(require,module,exports){
    module.exports={
        "/::)": "1",
        "/::~": "2",
        "/::B": "3",
        "/::|": "4",
        "/:8-)": "5",
        "/::<": "6",
        "/::$": "7",
        "/::X": "8",
        "/::Z": "9",
        "/::'(": "10",
        "/::-|": "11",
        "/::@": "12",
        "/::P": "13",
        "/::D": "14",
        "/::O": "15",
        "/::(": "16",
        "/::+": "17",
        "/:–b": "18",
        "/::Q": "19",
        "/::T": "20",
        "/:,@P": "21",
        "/:,@-D": "22",
        "/::d": "23",
        "/:,@o": "24",
        "/::g": "25",
        "/:|-)": "26",
        "/::!": "27",
        "/微笑": "1",
        "/撇嘴": "2",
        "/色": "3",
        "/发呆": "4",
        "/得意": "5",
        "/流泪": "6",
        "/害羞": "7",
        "/闭嘴": "8",
        "/睡": "9",
        "/大哭": "10",
        "/尴尬": "11",
        "/发怒": "12",
        "/调皮": "13",
        "/呲牙": "14",
        "/惊讶": "15",
        "/难过": "16",
        "/酷": "17",
        "/冷汗": "18",
        "/抓狂": "19",
        "/吐": "20",
        "/偷笑": "21",
        "/愉快": "22",
        "/白眼": "23",
        "/傲慢": "24",
        "/饥饿": "25",
        "/困": "26",
        "/惊恐": "27",
        "[微笑]": "1",
        "[撇嘴]": "2",
        "[色]": "3",
        "[发呆]": "4",
        "[得意]": "5",
        "[流泪]": "6",
        "[害羞]": "7",
        "[闭嘴]": "8",
        "[睡]": "9",
        "[大哭]": "10",
        "[尴尬]": "11",
        "[发怒]": "12",
        "[调皮]": "13",
        "[呲牙]": "14",
        "[惊讶]": "15",
        "[难过]": "16",
        "[酷]": "17",
        "[冷汗]": "18",
        "[抓狂]": "19",
        "[吐]": "20",
        "[偷笑]": "21",
        "[愉快]": "22",
        "[白眼]": "23",
        "[傲慢]": "24",
        "[饥饿]": "25",
        "[困]": "26",
        "[惊恐]": "27"
    }
},{}],66:[function(require,module,exports){
    /**
     *
     * @author daijm
     */

    function ZC_Face() {
        var listener = require("../../../common/util/listener.js");
        var weixinJson = require('./face/weixin.json');
        var weixinSymbol = require('./face/weixinsymbol.json');
        var weixinSymbolRight = require('./face/weixinsymbolRight.json');
        var reg = require('./face/Reg.js');
        //模板引擎
        var template = require('./template.js');
        //show
        var tip = weixinJson,
            //analysis
            tip2 = weixinSymbol,
            tip2Right = weixinSymbolRight,
            qqfaceReg = reg.qqfaceReg,
            qqfaceReg2 = reg.qqfaceReg2;
        var that = {};
        var parseDOM = function() {
            $faceGroup = $(".js-faceGroup");
        };
        var show = function() {
            //集合如果不存在，则创建
            if($('#faceBox').length <= 0) {
                var flag=0;
                //ios下禁止复制粘贴
                // unselectable="on" style="-moz-user-select:none;-webkit-user-select:none;" onselectstart="return false;"
                var str='<div id="faceBox" class="face" unselectable="on" style="-moz-user-select:none;-webkit-user-select:none;" onselectstart="return false;">';
                for(var a in tip) {
                    flag+=1;
                    // if(flag==27){
                    //     var conf=$.extend({
                    //         'flag':flag,
                    //         'a':a
                    //     });
                    //     str += doT.template(template.faceIcoStr)(conf);
                    //     //str+='<span class="faceIco js-faceIco faceIco'+flag+'" data-src="'+a+'" /></span><span class="backDelete"></span>'
                    // }else{
                    if(flag<=21){
                        var conf=$.extend({
                            'flag':flag,
                            'a':a
                        });
                        str += doT.template(template.faceIcoStr)(conf);
                    }
                    // str+='<span class="faceIco js-faceIco faceIco'+flag+'" data-src="'+a+'" /></span>';
                    // }
                };
                str+='</div>'
                $faceGroup.append(str);
                //模拟退格键
                // $(".backDelete").unbind();
                // $(".backDelete").bind("click",function(){
                //     listener.trigger('sendArea.backDelete');
                // });
            }
            sendTotextArea();
        };
        var sendTotextArea = function() {
            $(".js-faceIco").unbind();
            $(".js-faceIco").bind("click", function(e) {
                var elm = e.currentTarget;
                var src = $(elm).attr("data-src");
                var reg = /u([0-9A-Za-z]{5})/;
                listener.trigger('sendArea.gotoxy',[{
                        'answer' : src
                    }]
                );

            });
        };
        //工作台和历史记录发送的消息调用
        var analysis = function(str) {//将文本框内的表情字符转化为表情
            //容错处理，防传null
            if(str) {
                var icoAry = str.match(qqfaceReg);
            } else {
                return false;
            }
            //将匹配到的结果放到icoAry这个数组里面，来获取长度
            if(icoAry) {
                for(var i = 0;i < icoAry.length;i++) {
                    var ico = qqfaceReg2.exec(str);
                    //console.log(ico[0]);
                    var pathname = tip2[ico[0]];
                    //重新匹配到第一个符合条件的表情字符
                    str = str.replace(qqfaceReg2,'<img class="faceimg" src="images/static/' + pathname + '.png" border="0" />');
                    //str = str.replace(qqfaceReg2,'<span class="msgfaceIco faceIco faceIco'+pathname+'" /></span>');

                }
            }
            //console.log(str);
            //listener.trigger('sendArea.sendfaceStr',str)
            return str;
        };
        //聊天页发送的消息调用
        var analysisRight = function(str) {//将文本框内的表情字符转化为表情
            //容错处理，防传null
            if(str) {
                var icoAry = str.match(qqfaceReg);
            } else {
                return false;
            }
            //将匹配到的结果放到icoAry这个数组里面，来获取长度
            if(icoAry) {
                for(var i = 0;i < icoAry.length;i++) {
                    var ico = qqfaceReg2.exec(str);
                    var pathname = tip2Right[ico[0]];
                    //重新匹配到第一个符合条件的表情字符
                    //str = str.replace(qqfaceReg2,'<img class="faceimg" src="' + path + pathname + '.gif" border="0" />');
                    str = str.replace(qqfaceReg2,'<span class="msgfaceIco faceIco faceIco'+pathname+'" /></span>');
                }
            }
            //console.log(str);
            //listener.trigger('sendArea.sendfaceStr',str)
            return str;
        };


        var hasEmotion = function(str) {//将文本框内的表情字符转化为表情
            return this.qqfaceReg.test(str)
        };
        //传给聊天的url

        var bindLitener = function() {
            listener.on("sendArea.faceShow",show);
        };

        var initPlugsin = function() {//插件

        };
        var init = function() {
            parseDOM();
            bindLitener();
            initPlugsin();
        };

        init();
        that.analysis = analysis;
        that.analysisRight = analysisRight;
        return that;
    }

    module.exports = ZC_Face;

},{"../../../common/util/listener.js":29,"./face/Reg.js":62,"./face/weixin.json":63,"./face/weixinsymbol.json":64,"./face/weixinsymbolRight.json":65,"./template.js":68}],67:[function(require,module,exports){
    /**
     *
     * @author daijm
     */
//吐司提示
    function showTip(global) {
        var template = require('./template.js');
        var language = global.language.lan;
        var languageText = global.language.text;
        var that = {};
        var show = function(text) {
            var conf = {};
            conf = {
                'text': text
            };
            var showTipHtml = doT.template(template.showTip)(conf);
            $(".js-wrapBox").append(showTipHtml);
            parseDOM();
            position();
            setTimeout(function() {
                $showTip.remove();
            }, 3000)

        };
        var position = function() {
            var _top = $(".js-wrapBox").height() / 2 - 21;
            var _left = $(".js-wrapBox").width() / 2 - 70;
            $showTip.css({ "top": _top, "left": _left });
        };
        var parseDOM = function() {
            $showTip = $(".js-showTip");
        };
        var bindLitener = function() {

        };
        var init = function() {
            bindLitener();
        };
        init();
        that.show = show;
        return that;
    };


    module.exports = showTip;

},{"./template.js":68}],68:[function(require,module,exports){
    /*
     * @author daijm
     */
    var template = {};

    var layer = '<div class="layer js-layer"></div>';
    var AlertTemplate = '<div class="modeDialog js-modeDialog">'+
        '<div class="close"><span class="close_button">×</span><p class="h1">{{=it.title || "提示"}}</p></div>'+
        '{{ if((it.footer !== false) ) { }}'+
        '<div class="wether">'+
        '<span class="js-isques">'+
        '{{=it.okText || "确定"}}'+
        '</span>'+
        '<span class="js-noques">'+
        '{{=it.cancelText || "取消"}}'+
        '</span>'+
        '</div>'+
        '{{ } }}'+
        '<div class="model-body">'+
        '</div>'+
        '</div>';
    var faceIcoStr= '<span unselectable="on" class="faceIco js-faceIco faceIco'+'{{=it.flag}}'+'" data-src="'+'{{=it.a}}'+'" /></span>';
    var showTip='<div class="js-showTip showTip"><p class="showTipText">'+'{{=it.text}}'+'</p></div>';
    template.layer=layer;
    template.AlertTemplate= AlertTemplate;
    template.faceIcoStr=faceIcoStr;
    template.showTip=showTip;
    module.exports = template;
//var faceIcoStr = '<span unselectable="on" class="faceIco js-faceIco faceIco'+'{{=it.flag}}'+'" data-src="'+'{{=it.a}}'+'" /></span><span class="backDelete"></span>';

},{}]},{},[33])