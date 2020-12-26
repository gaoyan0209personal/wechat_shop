module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1608953236715, function(require, module, exports) {

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = exports.instance = exports.Gaxios = void 0;
const gaxios_1 = require("./gaxios");
Object.defineProperty(exports, "Gaxios", { enumerable: true, get: function () { return gaxios_1.Gaxios; } });
var common_1 = require("./common");
Object.defineProperty(exports, "GaxiosError", { enumerable: true, get: function () { return common_1.GaxiosError; } });
/**
 * The default instance used when the `request` method is directly
 * invoked.
 */
exports.instance = new gaxios_1.Gaxios();
/**
 * Make an HTTP request using the given options.
 * @param opts Options for the request
 */
async function request(opts) {
    return exports.instance.request(opts);
}
exports.request = request;
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./gaxios":1608953236716,"./common":1608953236717}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236716, function(require, module, exports) {

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gaxios = void 0;
const extend_1 = __importDefault(require("extend"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const querystring_1 = __importDefault(require("querystring"));
const is_stream_1 = __importDefault(require("is-stream"));
const common_1 = require("./common");
const retry_1 = require("./retry");
/* eslint-disable @typescript-eslint/no-explicit-any */
const fetch = hasFetch() ? window.fetch : node_fetch_1.default;
function hasWindow() {
    return typeof window !== 'undefined' && !!window;
}
function hasFetch() {
    return hasWindow() && !!window.fetch;
}
let HttpsProxyAgent;
function loadProxy() {
    const proxy = process.env.HTTPS_PROXY ||
        process.env.https_proxy ||
        process.env.HTTP_PROXY ||
        process.env.http_proxy;
    if (proxy) {
        HttpsProxyAgent = require('https-proxy-agent');
    }
    return proxy;
}
loadProxy();
function skipProxy(url) {
    var _a;
    const noProxyEnv = (_a = process.env.NO_PROXY) !== null && _a !== void 0 ? _a : process.env.no_proxy;
    if (!noProxyEnv) {
        return false;
    }
    const noProxyUrls = noProxyEnv.split(',');
    const parsedURL = new URL(url);
    return !!noProxyUrls.find(url => {
        if (url.startsWith('*.') || url.startsWith('.')) {
            url = url.replace('*', '');
            return parsedURL.hostname.endsWith(url);
        }
        else {
            return url === parsedURL.origin || url === parsedURL.hostname;
        }
    });
}
// Figure out if we should be using a proxy. Only if it's required, load
// the https-proxy-agent module as it adds startup cost.
function getProxy(url) {
    // If there is a match between the no_proxy env variables and the url, then do not proxy
    if (skipProxy(url)) {
        return undefined;
        // If there is not a match between the no_proxy env variables and the url, check to see if there should be a proxy
    }
    else {
        return loadProxy();
    }
}
class Gaxios {
    /**
     * The Gaxios class is responsible for making HTTP requests.
     * @param defaults The default set of options to be used for this instance.
     */
    constructor(defaults) {
        this.agentCache = new Map();
        this.defaults = defaults || {};
    }
    /**
     * Perform an HTTP request with the given options.
     * @param opts Set of HTTP options that will be used for this HTTP request.
     */
    async request(opts = {}) {
        opts = this.validateOpts(opts);
        return this._request(opts);
    }
    async _defaultAdapter(opts) {
        const fetchImpl = opts.fetchImplementation || fetch;
        const res = (await fetchImpl(opts.url, opts));
        const data = await this.getResponseData(opts, res);
        return this.translateResponse(opts, res, data);
    }
    /**
     * Internal, retryable version of the `request` method.
     * @param opts Set of HTTP options that will be used for this HTTP request.
     */
    async _request(opts = {}) {
        try {
            let translatedResponse;
            if (opts.adapter) {
                translatedResponse = await opts.adapter(opts, this._defaultAdapter.bind(this));
            }
            else {
                translatedResponse = await this._defaultAdapter(opts);
            }
            if (!opts.validateStatus(translatedResponse.status)) {
                throw new common_1.GaxiosError(`Request failed with status code ${translatedResponse.status}`, opts, translatedResponse);
            }
            return translatedResponse;
        }
        catch (e) {
            const err = e;
            err.config = opts;
            const { shouldRetry, config } = await retry_1.getRetryConfig(e);
            if (shouldRetry && config) {
                err.config.retryConfig.currentRetryAttempt = config.retryConfig.currentRetryAttempt;
                return this._request(err.config);
            }
            throw err;
        }
    }
    async getResponseData(opts, res) {
        switch (opts.responseType) {
            case 'stream':
                return res.body;
            case 'json': {
                let data = await res.text();
                try {
                    data = JSON.parse(data);
                }
                catch (_a) {
                    // continue
                }
                return data;
            }
            case 'arraybuffer':
                return res.arrayBuffer();
            case 'blob':
                return res.blob();
            default:
                return res.text();
        }
    }
    /**
     * Validates the options, and merges them with defaults.
     * @param opts The original options passed from the client.
     */
    validateOpts(options) {
        const opts = extend_1.default(true, {}, this.defaults, options);
        if (!opts.url) {
            throw new Error('URL is required.');
        }
        // baseUrl has been deprecated, remove in 2.0
        const baseUrl = opts.baseUrl || opts.baseURL;
        if (baseUrl) {
            opts.url = baseUrl + opts.url;
        }
        opts.paramsSerializer = opts.paramsSerializer || this.paramsSerializer;
        if (opts.params && Object.keys(opts.params).length > 0) {
            let additionalQueryParams = opts.paramsSerializer(opts.params);
            if (additionalQueryParams.startsWith('?')) {
                additionalQueryParams = additionalQueryParams.slice(1);
            }
            const prefix = opts.url.includes('?') ? '&' : '?';
            opts.url = opts.url + prefix + additionalQueryParams;
        }
        if (typeof options.maxContentLength === 'number') {
            opts.size = options.maxContentLength;
        }
        if (typeof options.maxRedirects === 'number') {
            opts.follow = options.maxRedirects;
        }
        opts.headers = opts.headers || {};
        if (opts.data) {
            if (is_stream_1.default.readable(opts.data)) {
                opts.body = opts.data;
            }
            else if (typeof opts.data === 'object') {
                opts.body = JSON.stringify(opts.data);
                // Allow the user to specifiy their own content type,
                // such as application/json-patch+json; for historical reasons this
                // content type must currently be a json type, as we are relying on
                // application/x-www-form-urlencoded (which is incompatible with
                // upstream GCP APIs) being rewritten to application/json.
                //
                // TODO: refactor upstream dependencies to stop relying on this
                // side-effect.
                if (!opts.headers['Content-Type'] ||
                    !opts.headers['Content-Type'].includes('json')) {
                    opts.headers['Content-Type'] = 'application/json';
                }
            }
            else {
                opts.body = opts.data;
            }
        }
        opts.validateStatus = opts.validateStatus || this.validateStatus;
        opts.responseType = opts.responseType || 'json';
        if (!opts.headers['Accept'] && opts.responseType === 'json') {
            opts.headers['Accept'] = 'application/json';
        }
        opts.method = opts.method || 'GET';
        const proxy = getProxy(opts.url);
        if (proxy) {
            if (this.agentCache.has(proxy)) {
                opts.agent = this.agentCache.get(proxy);
            }
            else {
                opts.agent = new HttpsProxyAgent(proxy);
                this.agentCache.set(proxy, opts.agent);
            }
        }
        return opts;
    }
    /**
     * By default, throw for any non-2xx status code
     * @param status status code from the HTTP response
     */
    validateStatus(status) {
        return status >= 200 && status < 300;
    }
    /**
     * Encode a set of key/value pars into a querystring format (?foo=bar&baz=boo)
     * @param params key value pars to encode
     */
    paramsSerializer(params) {
        return querystring_1.default.stringify(params);
    }
    translateResponse(opts, res, data) {
        // headers need to be converted from a map to an obj
        const headers = {};
        res.headers.forEach((value, key) => {
            headers[key] = value;
        });
        return {
            config: opts,
            data: data,
            headers,
            status: res.status,
            statusText: res.statusText,
            // XMLHttpRequestLike
            request: {
                responseURL: res.url,
            },
        };
    }
}
exports.Gaxios = Gaxios;
//# sourceMappingURL=gaxios.js.map
}, function(modId) { var map = {"./common":1608953236717,"./retry":1608953236718}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236717, function(require, module, exports) {

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaxiosError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
class GaxiosError extends Error {
    constructor(message, options, response) {
        super(message);
        this.response = response;
        this.config = options;
        this.code = response.status.toString();
    }
}
exports.GaxiosError = GaxiosError;
//# sourceMappingURL=common.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236718, function(require, module, exports) {

// Copyright 2018 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRetryConfig = void 0;
async function getRetryConfig(err) {
    var _a;
    let config = getConfig(err);
    if (!err || !err.config || (!config && !err.config.retry)) {
        return { shouldRetry: false };
    }
    config = config || {};
    config.currentRetryAttempt = config.currentRetryAttempt || 0;
    config.retry =
        config.retry === undefined || config.retry === null ? 3 : config.retry;
    config.httpMethodsToRetry = config.httpMethodsToRetry || [
        'GET',
        'HEAD',
        'PUT',
        'OPTIONS',
        'DELETE',
    ];
    config.noResponseRetries =
        config.noResponseRetries === undefined || config.noResponseRetries === null
            ? 2
            : config.noResponseRetries;
    // If this wasn't in the list of status codes where we want
    // to automatically retry, return.
    const retryRanges = [
        // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
        // 1xx - Retry (Informational, request still processing)
        // 2xx - Do not retry (Success)
        // 3xx - Do not retry (Redirect)
        // 4xx - Do not retry (Client errors)
        // 429 - Retry ("Too Many Requests")
        // 5xx - Retry (Server errors)
        [100, 199],
        [429, 429],
        [500, 599],
    ];
    config.statusCodesToRetry = config.statusCodesToRetry || retryRanges;
    // Put the config back into the err
    err.config.retryConfig = config;
    // Determine if we should retry the request
    const shouldRetryFn = config.shouldRetry || shouldRetryRequest;
    if (!(await shouldRetryFn(err))) {
        return { shouldRetry: false, config: err.config };
    }
    // Calculate time to wait with exponential backoff.
    // If this is the first retry, look for a configured retryDelay.
    const retryDelay = config.currentRetryAttempt ? 0 : (_a = config.retryDelay) !== null && _a !== void 0 ? _a : 100;
    // Formula: retryDelay + ((2^c - 1 / 2) * 1000)
    const delay = retryDelay + ((Math.pow(2, config.currentRetryAttempt) - 1) / 2) * 1000;
    // We're going to retry!  Incremenent the counter.
    err.config.retryConfig.currentRetryAttempt += 1;
    // Create a promise that invokes the retry after the backOffDelay
    const backoff = new Promise(resolve => {
        setTimeout(resolve, delay);
    });
    // Notify the user if they added an `onRetryAttempt` handler
    if (config.onRetryAttempt) {
        config.onRetryAttempt(err);
    }
    // Return the promise in which recalls Gaxios to retry the request
    await backoff;
    return { shouldRetry: true, config: err.config };
}
exports.getRetryConfig = getRetryConfig;
/**
 * Determine based on config if we should retry the request.
 * @param err The GaxiosError passed to the interceptor.
 */
function shouldRetryRequest(err) {
    const config = getConfig(err);
    // node-fetch raises an AbortError if signaled:
    // https://github.com/bitinn/node-fetch#request-cancellation-with-abortsignal
    if (err.name === 'AbortError') {
        return false;
    }
    // If there's no config, or retries are disabled, return.
    if (!config || config.retry === 0) {
        return false;
    }
    // Check if this error has no response (ETIMEDOUT, ENOTFOUND, etc)
    if (!err.response &&
        (config.currentRetryAttempt || 0) >= config.noResponseRetries) {
        return false;
    }
    // Only retry with configured HttpMethods.
    if (!err.config.method ||
        config.httpMethodsToRetry.indexOf(err.config.method.toUpperCase()) < 0) {
        return false;
    }
    // If this wasn't in the list of status codes where we want
    // to automatically retry, return.
    if (err.response && err.response.status) {
        let isInRange = false;
        for (const [min, max] of config.statusCodesToRetry) {
            const status = err.response.status;
            if (status >= min && status <= max) {
                isInRange = true;
                break;
            }
        }
        if (!isInRange) {
            return false;
        }
    }
    // If we are out of retry attempts, return
    config.currentRetryAttempt = config.currentRetryAttempt || 0;
    if (config.currentRetryAttempt >= config.retry) {
        return false;
    }
    return true;
}
/**
 * Acquire the raxConfig object from an GaxiosError if available.
 * @param err The Gaxios error with a config object.
 */
function getConfig(err) {
    if (err && err.config && err.config.retryConfig) {
        return err.config.retryConfig;
    }
    return;
}
//# sourceMappingURL=retry.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1608953236715);
})()
//# sourceMappingURL=index.js.map