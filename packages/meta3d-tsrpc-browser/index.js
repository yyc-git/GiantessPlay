/*!
 * TSRPC Browser v3.4.18
 * -----------------------------------------
 * Copyright (c) King Wang.
 * MIT License
 * https://github.com/k8w/tsrpc-browser
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('k8w-extend-native');
require('core-js/modules/es.object.to-string.js');
require('core-js/modules/es.regexp.to-string.js');
require('core-js/modules/es.number.max-safe-integer.js');
require('core-js/modules/es.number.constructor.js');
require('core-js/modules/es.regexp.exec.js');
require('core-js/modules/es.regexp.test.js');
require('core-js/modules/es.array.iterator.js');
require('core-js/modules/es.array-buffer.slice.js');
require('core-js/modules/es.typed-array.uint8-array.js');
require('core-js/modules/esnext.typed-array.at.js');
require('core-js/modules/es.typed-array.copy-within.js');
require('core-js/modules/es.typed-array.every.js');
require('core-js/modules/es.typed-array.fill.js');
require('core-js/modules/es.typed-array.filter.js');
require('core-js/modules/es.typed-array.find.js');
require('core-js/modules/es.typed-array.find-index.js');
require('core-js/modules/es.typed-array.for-each.js');
require('core-js/modules/es.typed-array.includes.js');
require('core-js/modules/es.typed-array.index-of.js');
require('core-js/modules/es.typed-array.iterator.js');
require('core-js/modules/es.typed-array.join.js');
require('core-js/modules/es.typed-array.last-index-of.js');
require('core-js/modules/es.typed-array.map.js');
require('core-js/modules/es.typed-array.reduce.js');
require('core-js/modules/es.typed-array.reduce-right.js');
require('core-js/modules/es.typed-array.reverse.js');
require('core-js/modules/es.typed-array.set.js');
require('core-js/modules/es.typed-array.slice.js');
require('core-js/modules/es.typed-array.some.js');
require('core-js/modules/es.typed-array.sort.js');
require('core-js/modules/es.typed-array.subarray.js');
require('core-js/modules/es.typed-array.to-locale-string.js');
require('core-js/modules/es.typed-array.to-string.js');
require('core-js/modules/es.array.from.js');
require('core-js/modules/es.string.iterator.js');
require('core-js/modules/es.number.parse-int.js');
require('core-js/modules/es.array.join.js');
require('core-js/modules/es.string.match.js');
require('core-js/modules/es.function.name.js');
require('core-js/modules/es.json.stringify.js');
require('core-js/modules/es.promise.js');
require('core-js/modules/es.regexp.constructor.js');
require('core-js/modules/es.regexp.sticky.js');
require('core-js/modules/web.dom-collections.for-each.js');
require('core-js/modules/es.array.filter.js');
require('core-js/modules/es.object.keys.js');
require('core-js/modules/es.array.find-index.js');
require('core-js/modules/es.array.splice.js');
require('core-js/modules/es.array.slice.js');
require('core-js/modules/es.array.find.js');
require('core-js/modules/es.string.ends-with.js');
require('core-js/modules/es.array.includes.js');
require('core-js/modules/es.string.includes.js');
require('core-js/modules/es.string.starts-with.js');
require('core-js/modules/es.typed-array.int8-array.js');
require('core-js/modules/es.typed-array.int16-array.js');
require('core-js/modules/es.typed-array.int32-array.js');
require('core-js/modules/es.typed-array.uint16-array.js');
require('core-js/modules/es.typed-array.uint32-array.js');
require('core-js/modules/es.typed-array.float32-array.js');
require('core-js/modules/es.typed-array.float64-array.js');
require('core-js/modules/es.array.map.js');
require('core-js/modules/es.object.assign.js');
require('core-js/modules/es.array.index-of.js');
require('core-js/modules/web.dom-collections.iterator.js');
require('core-js/modules/es.array-buffer.constructor.js');
require('core-js/modules/es.array-buffer.is-view.js');
require('core-js/modules/web.url.to-json.js');
require('core-js/modules/es.object.entries.js');
require('core-js/modules/es.number.is-integer.js');
require('core-js/modules/es.object.get-prototype-of.js');
require('core-js/modules/es.parse-int.js');
var tsrpcProto = require('tsrpc-proto');
var tslib = require('tslib');
var tsrpcBaseClient = require('tsrpc-base-client');

/**
 * @internal
 */
var HttpProxy = /** @class */ (function () {
    function HttpProxy() {
    }
    HttpProxy.prototype.fetch = function (options) {
        var _this = this;
        var _a;
        var rs;
        var promise = new Promise(function (_rs) {
            rs = _rs;
        });
        var xhr = new XMLHttpRequest();
        if (typeof navigator !== 'undefined' && ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.userAgent) === null || _a === void 0 ? void 0 : _a.indexOf('MSIE 8.0;')) > -1) {
            //IE8 不支持onload onabort onerror事件
            xhr.onreadystatechange = function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    if (xhr.readyState == 4) {
                        //Network Error
                        if (xhr.status == 0 || (xhr.response == null && xhr.responseText == null)) {
                            rs({
                                isSucc: false,
                                err: new tsrpcProto.TsrpcError('Network Error', {
                                    type: tsrpcProto.TsrpcError.Type.NetworkError,
                                    httpCode: xhr.status
                                })
                            });
                            return [2 /*return*/];
                        }
                        //IE9 wrongURL 会返回12029
                        if (xhr.status == 12029) {
                            rs({
                                isSucc: false,
                                err: new tsrpcProto.TsrpcError({
                                    message: 'Network Error',
                                    type: tsrpcProto.TsrpcError.Type.NetworkError,
                                    httpCode: xhr.status
                                })
                            });
                            return [2 /*return*/];
                        }
                        // Res
                        rs({
                            isSucc: true,
                            res: options.responseType === 'text' ? xhr.responseText : new Uint8Array(xhr.response)
                        });
                    }
                    return [2 /*return*/];
                });
            }); };
        }
        else {
            xhr.onerror = function () {
                rs({
                    isSucc: false,
                    err: new tsrpcProto.TsrpcError({
                        message: 'Network Error',
                        type: tsrpcProto.TsrpcError.Type.NetworkError,
                        httpCode: xhr.status
                    })
                });
            };
            // 有的平台 超时不触发onerror
            xhr.ontimeout = function () {
                rs({
                    isSucc: false,
                    err: new tsrpcProto.TsrpcError({
                        message: 'Request Timeout',
                        type: tsrpcProto.TsrpcError.Type.NetworkError,
                        code: 'TIMEOUT'
                    })
                });
            };
            // Res
            xhr.onload = function () { return tslib.__awaiter(_this, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    if (xhr.status === 200 || xhr.status === 500) {
                        rs({
                            isSucc: true,
                            res: xhr.response && (options.responseType === 'text' ? xhr.responseText : new Uint8Array(xhr.response))
                        });
                    }
                    else {
                        rs({
                            isSucc: false,
                            err: new tsrpcProto.TsrpcError({
                                message: 'HTTP Error ' + xhr.status,
                                type: tsrpcProto.TsrpcError.Type.ServerError,
                                httpCode: xhr.status
                            })
                        });
                    }
                    return [2 /*return*/];
                });
            }); };
            var transportOptions_1 = options.transportOptions;
            if (!!transportOptions_1.onProgress) {
                xhr.upload.onprogress = function (e) {
                    var _a;
                    (_a = transportOptions_1.onProgress) === null || _a === void 0 ? void 0 : _a.call(transportOptions_1, e.loaded / e.total);
                };
            }
        }
        xhr.open(options.method, options.url, true);
        if (options.headers) {
            for (var key in options.headers) {
                xhr.setRequestHeader(key, options.headers[key]);
            }
        }
        xhr.responseType = options.responseType;
        var timeout = options.timeout;
        if (timeout) {
            xhr.timeout = timeout;
        }
        xhr.send(options.data);
        var abort = xhr.abort.bind(xhr);
        return {
            promise: promise,
            abort: abort
        };
    };
    return HttpProxy;
}());

/**
 * HTTP Client for TSRPC.
 * It uses XMLHttpRequest to send requests.
 * @typeParam ServiceType - `ServiceType` from generated `proto.ts`
 */
var HttpClient = /** @class */ (function (_super) {
    tslib.__extends(HttpClient, _super);
    function HttpClient(proto, options) {
        var httpProxy = new HttpProxy;
        return _super.call(this, proto, httpProxy, tslib.__assign(tslib.__assign({}, defaultHttpClientOptions), options)) || this;
    }
    HttpClient.prototype.callApi = function (apiName, req, options) {
        if (options === void 0) { options = {}; }
        return _super.prototype.callApi.call(this, apiName, req, options);
    };
    HttpClient.prototype.sendMsg = function (msgName, msg, options) {
        if (options === void 0) { options = {}; }
        return _super.prototype.sendMsg.call(this, msgName, msg, options);
    };
    return HttpClient;
}(tsrpcBaseClient.BaseHttpClient));
var defaultHttpClientOptions = tslib.__assign(tslib.__assign({}, tsrpcBaseClient.defaultBaseHttpClientOptions), { customObjectIdClass: String });

/**
 * @internal
 */
var WebSocketProxy = /** @class */ (function () {
    function WebSocketProxy(caUrl) {
        this.caUrl = caUrl;
    }
    WebSocketProxy.prototype.connect = function (server, protocols) {
        var _this = this;
        if (this.caUrl) {
            // @ts-ignore
            this._ws = new WebSocket(server, protocols, this.caUrl);
        }
        else {
            this._ws = new WebSocket(server, protocols);
        }
        this._ws.binaryType = 'arraybuffer';
        this._ws.onopen = this.options.onOpen;
        this._ws.onerror = this.options.onError;
        this._ws.onclose = function (e) {
            _this.options.onClose(e.code, e.reason);
            _this._ws = undefined;
        };
        this._ws.onmessage = function (e) {
            var _a;
            if (e.data instanceof ArrayBuffer) {
                _this.options.onMessage(new Uint8Array(e.data));
            }
            else if (typeof e.data === 'string') {
                _this.options.onMessage(e.data);
            }
            else {
                (_a = _this.options.logger) === null || _a === void 0 ? void 0 : _a.warn('[Unresolved Recv]', e.data);
            }
        };
    };
    WebSocketProxy.prototype.close = function (code, reason) {
        var _a;
        (_a = this._ws) === null || _a === void 0 ? void 0 : _a.close(code, reason);
        this._ws = undefined;
    };
    WebSocketProxy.prototype.send = function (data) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var sendData, buf;
            return tslib.__generator(this, function (_a) {
                try {
                    sendData = void 0;
                    if (typeof data === 'string') {
                        sendData = data;
                    }
                    else {
                        buf = data;
                        if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
                            sendData = buf.buffer;
                        }
                        else {
                            sendData = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
                        }
                    }
                    this._ws.send(sendData);
                    return [2 /*return*/, {}];
                }
                catch (err) {
                    return [2 /*return*/, {
                            err: new tsrpcProto.TsrpcError('Network Error', {
                                code: 'SEND_BUF_ERR',
                                type: tsrpcProto.TsrpcError.Type.NetworkError,
                                innerErr: err
                            })
                        }];
                }
                return [2 /*return*/];
            });
        });
    };
    return WebSocketProxy;
}());

/**
 * Client for TSRPC WebSocket Server.
 * @typeParam ServiceType - `ServiceType` from generated `proto.ts`
 */
var WsClient = /** @class */ (function (_super) {
    tslib.__extends(WsClient, _super);
    function WsClient(proto, options) {
        var wsp = new WebSocketProxy(options === null || options === void 0 ? void 0 : options.caUrl);
        return _super.call(this, proto, wsp, tslib.__assign(tslib.__assign({}, defaultWsClientOptions), options)) || this;
    }
    return WsClient;
}(tsrpcBaseClient.BaseWsClient));
var defaultWsClientOptions = tslib.__assign(tslib.__assign({}, tsrpcBaseClient.defaultBaseWsClientOptions), { customObjectIdClass: String });

exports.HttpClient = HttpClient;
exports.WsClient = WsClient;
Object.keys(tsrpcProto).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
        enumerable: true,
        get: function () { return tsrpcProto[k]; }
    });
});
