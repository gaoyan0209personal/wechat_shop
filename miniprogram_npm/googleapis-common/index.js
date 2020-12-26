module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1608953236766, function(require, module, exports) {

// Copyright 2020 Google LLC
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
var google_auth_library_1 = require("google-auth-library");
Object.defineProperty(exports, "OAuth2Client", { enumerable: true, get: function () { return google_auth_library_1.OAuth2Client; } });
Object.defineProperty(exports, "JWT", { enumerable: true, get: function () { return google_auth_library_1.JWT; } });
Object.defineProperty(exports, "Compute", { enumerable: true, get: function () { return google_auth_library_1.Compute; } });
Object.defineProperty(exports, "UserRefreshClient", { enumerable: true, get: function () { return google_auth_library_1.UserRefreshClient; } });
Object.defineProperty(exports, "DefaultTransporter", { enumerable: true, get: function () { return google_auth_library_1.DefaultTransporter; } });
Object.defineProperty(exports, "GoogleAuth", { enumerable: true, get: function () { return google_auth_library_1.GoogleAuth; } });
var apiIndex_1 = require("./apiIndex");
Object.defineProperty(exports, "getAPI", { enumerable: true, get: function () { return apiIndex_1.getAPI; } });
var apirequest_1 = require("./apirequest");
Object.defineProperty(exports, "createAPIRequest", { enumerable: true, get: function () { return apirequest_1.createAPIRequest; } });
var authplus_1 = require("./authplus");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return authplus_1.AuthPlus; } });
var discovery_1 = require("./discovery");
Object.defineProperty(exports, "Discovery", { enumerable: true, get: function () { return discovery_1.Discovery; } });
var endpoint_1 = require("./endpoint");
Object.defineProperty(exports, "Endpoint", { enumerable: true, get: function () { return endpoint_1.Endpoint; } });
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./apiIndex":1608953236767,"./apirequest":1608953236768,"./authplus":1608953236772,"./discovery":1608953236773,"./endpoint":1608953236774}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236767, function(require, module, exports) {

// Copyright 2020 Google LLC
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
exports.getAPI = void 0;
function getAPI(api, options, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
versions, context) {
    let version;
    if (typeof options === 'string') {
        version = options;
        options = {};
    }
    else if (typeof options === 'object') {
        version = options.version;
        delete options.version;
    }
    else {
        throw new Error('Argument error: Accepts only string or object');
    }
    try {
        const ctr = versions[version];
        const ep = new ctr(options, context);
        return Object.freeze(ep);
    }
    catch (e) {
        throw new Error(`Unable to load endpoint ${api}("${version}"): ${e.message}`);
    }
}
exports.getAPI = getAPI;
//# sourceMappingURL=apiIndex.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236768, function(require, module, exports) {

// Copyright 2020 Google LLC
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
exports.createAPIRequest = void 0;
const google_auth_library_1 = require("google-auth-library");
const qs = require("qs");
const stream = require("stream");
const urlTemplate = require("url-template");
const uuid = require("uuid");
const extend = require("extend");
const isbrowser_1 = require("./isbrowser");
const h2 = require("./http2");
const resolve = require("url");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isReadableStream(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        typeof obj.pipe === 'function' &&
        obj.readable !== false &&
        typeof obj._read === 'function' &&
        typeof obj._readableState === 'object');
}
function getMissingParams(params, required) {
    const missing = new Array();
    required.forEach(param => {
        // Is the required param in the params object?
        if (params[param] === undefined) {
            missing.push(param);
        }
    });
    // If there are any required params missing, return their names in array,
    // otherwise return null
    return missing.length > 0 ? missing : null;
}
function createAPIRequest(parameters, callback) {
    if (callback) {
        createAPIRequestAsync(parameters).then(r => callback(null, r), callback);
    }
    else {
        return createAPIRequestAsync(parameters);
    }
}
exports.createAPIRequest = createAPIRequest;
async function createAPIRequestAsync(parameters) {
    var _a;
    // Combine the GaxiosOptions options passed with this specific
    // API call with the global options configured at the API Context
    // level, or at the global level.
    const options = extend(true, {}, // Ensure we don't leak settings upstream
    ((_a = parameters.context.google) === null || _a === void 0 ? void 0 : _a._options) || {}, // Google level options
    parameters.context._options || {}, // Per-API options
    parameters.options // API call params
    );
    const params = extend(true, {}, // New base object
    options.params, // Combined global/per-api params
    parameters.params // API call params
    );
    options.userAgentDirectives = options.userAgentDirectives || [];
    const media = params.media || {};
    /**
     * In a previous version of this API, the request body was stuffed in a field
     * named `resource`.  This caused lots of problems, because it's not uncommon
     * to have an actual named parameter required which is also named `resource`.
     * This meant that users would have to use `resource_` in those cases, which
     * pretty much nobody figures out on their own. The request body is now
     * documented as being in the `requestBody` property, but we also need to keep
     * using `resource` for reasons of back-compat. Cases that need to be covered
     * here:
     * - user provides just a `resource` with a request body
     * - user provides both a `resource` and a `resource_`
     * - user provides just a `requestBody`
     * - user provides both a `requestBody` and a `resource`
     */
    let resource = params.requestBody;
    if (!params.requestBody &&
        params.resource &&
        (!parameters.requiredParams.includes('resource') ||
            typeof params.resource !== 'string')) {
        resource = params.resource;
        delete params.resource;
    }
    delete params.requestBody;
    let authClient = params.auth || options.auth;
    const defaultMime = typeof media.body === 'string' ? 'text/plain' : 'application/octet-stream';
    delete params.media;
    delete params.auth;
    // Grab headers from user provided options
    const headers = params.headers || {};
    populateAPIHeader(headers);
    delete params.headers;
    // Un-alias parameters that were modified due to conflicts with reserved names
    Object.keys(params).forEach(key => {
        if (key.slice(-1) === '_') {
            const newKey = key.slice(0, -1);
            params[newKey] = params[key];
            delete params[key];
        }
    });
    // Check for missing required parameters in the API request
    const missingParams = getMissingParams(params, parameters.requiredParams);
    if (missingParams) {
        // Some params are missing - stop further operations and inform the
        // developer which required params are not included in the request
        throw new Error('Missing required parameters: ' + missingParams.join(', '));
    }
    // Parse urls
    if (options.url) {
        options.url = urlTemplate.parse(options.url).expand(params);
    }
    if (parameters.mediaUrl) {
        parameters.mediaUrl = urlTemplate.parse(parameters.mediaUrl).expand(params);
    }
    // Rewrite url if rootUrl is globally set
    if (parameters.context._options.rootUrl !== undefined &&
        options.url !== undefined) {
        const path = options.url.slice(parameters.context._options.rootUrl.length);
        options.url = resolve.resolve(parameters.context._options.rootUrl, path);
    }
    // When forming the querystring, override the serializer so that array
    // values are serialized like this:
    // myParams: ['one', 'two'] ---> 'myParams=one&myParams=two'
    // This serializer also encodes spaces in the querystring as `%20`,
    // whereas the default serializer in gaxios encodes to a `+`.
    options.paramsSerializer = params => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
    };
    // delete path params from the params object so they do not end up in query
    parameters.pathParams.forEach(param => delete params[param]);
    // if authClient is actually a string, use it as an API KEY
    if (typeof authClient === 'string') {
        params.key = params.key || authClient;
        authClient = undefined;
    }
    function multipartUpload(multipart) {
        const boundary = uuid.v4();
        const finale = `--${boundary}--`;
        const rStream = new stream.PassThrough({
            flush(callback) {
                this.push('\r\n');
                this.push(finale);
                callback();
            },
        });
        const pStream = new ProgressStream();
        const isStream = isReadableStream(multipart[1].body);
        headers['content-type'] = `multipart/related; boundary=${boundary}`;
        for (const part of multipart) {
            const preamble = `--${boundary}\r\ncontent-type: ${part['content-type']}\r\n\r\n`;
            rStream.push(preamble);
            if (typeof part.body === 'string') {
                rStream.push(part.body);
                rStream.push('\r\n');
            }
            else {
                // Gaxios does not natively support onUploadProgress in node.js.
                // Pipe through the pStream first to read the number of bytes read
                // for the purpose of tracking progress.
                pStream.on('progress', bytesRead => {
                    if (options.onUploadProgress) {
                        options.onUploadProgress({ bytesRead });
                    }
                });
                part.body.pipe(pStream).pipe(rStream);
            }
        }
        if (!isStream) {
            rStream.push(finale);
            rStream.push(null);
        }
        options.data = rStream;
    }
    function browserMultipartUpload(multipart) {
        const boundary = uuid.v4();
        const finale = `--${boundary}--`;
        headers['content-type'] = `multipart/related; boundary=${boundary}`;
        let content = '';
        for (const part of multipart) {
            const preamble = `--${boundary}\r\ncontent-type: ${part['content-type']}\r\n\r\n`;
            content += preamble;
            if (typeof part.body === 'string') {
                content += part.body;
                content += '\r\n';
            }
        }
        content += finale;
        options.data = content;
    }
    if (parameters.mediaUrl && media.body) {
        options.url = parameters.mediaUrl;
        if (resource) {
            params.uploadType = 'multipart';
            const multipart = [
                { 'content-type': 'application/json', body: JSON.stringify(resource) },
                {
                    'content-type': media.mimeType || (resource && resource.mimeType) || defaultMime,
                    body: media.body,
                },
            ];
            if (!isbrowser_1.isBrowser()) {
                // gaxios doesn't support multipart/related uploads, so it has to
                // be implemented here.
                multipartUpload(multipart);
            }
            else {
                browserMultipartUpload(multipart);
            }
        }
        else {
            params.uploadType = 'media';
            Object.assign(headers, { 'content-type': media.mimeType || defaultMime });
            options.data = media.body;
        }
    }
    else {
        options.data = resource || undefined;
    }
    options.headers = extend(true, options.headers || {}, headers);
    options.params = params;
    if (!isbrowser_1.isBrowser()) {
        options.headers['Accept-Encoding'] = 'gzip';
        options.userAgentDirectives.push({
            product: 'google-api-nodejs-client',
            version: pkg.version,
            comment: 'gzip',
        });
        const userAgent = options.userAgentDirectives
            .map(d => {
            let line = `${d.product}/${d.version}`;
            if (d.comment) {
                line += ` (${d.comment})`;
            }
            return line;
        })
            .join(' ');
        options.headers['User-Agent'] = userAgent;
    }
    // By default gaxios treats any 2xx as valid, and all non 2xx status
    // codes as errors.  This is a problem for HTTP 304s when used along
    // with an eTag.
    if (!options.validateStatus) {
        options.validateStatus = status => {
            return (status >= 200 && status < 300) || status === 304;
        };
    }
    // Retry by default
    options.retry = options.retry === undefined ? true : options.retry;
    delete options.auth; // is overridden by our auth code
    // Perform the HTTP request.  NOTE: this function used to return a
    // mikeal/request object. Since the transition to Axios, the method is
    // now void.  This may be a source of confusion for users upgrading from
    // version 24.0 -> 25.0 or up.
    if (authClient && typeof authClient === 'object') {
        if (options.http2) {
            const authHeaders = await authClient.getRequestHeaders(options.url);
            const mooOpts = Object.assign({}, options);
            mooOpts.headers = Object.assign(mooOpts.headers, authHeaders);
            return h2.request(mooOpts);
        }
        else {
            return authClient.request(options);
        }
    }
    else {
        return new google_auth_library_1.DefaultTransporter().request(options);
    }
}
/**
 * Basic Passthrough Stream that records the number of bytes read
 * every time the cursor is moved.
 */
class ProgressStream extends stream.Transform {
    constructor() {
        super(...arguments);
        this.bytesRead = 0;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _transform(chunk, encoding, callback) {
        this.bytesRead += chunk.length;
        this.emit('progress', this.bytesRead);
        this.push(chunk);
        callback();
    }
}
function populateAPIHeader(headers) {
    // TODO: we should eventually think about adding browser support for this
    // populating the gl-web header (web support should also be added to
    // google-auth-library-nodejs).
    if (!isbrowser_1.isBrowser()) {
        headers['x-goog-api-client'] = `gdcl/${pkg.version} gl-node/${process.versions.node}`;
    }
}
//# sourceMappingURL=apirequest.js.map
}, function(modId) { var map = {"./isbrowser":1608953236769,"./http2":1608953236770,"../../package.json":1608953236771}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236769, function(require, module, exports) {

// Copyright 2020 Google LLC
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
exports.isBrowser = void 0;
function isBrowser() {
    return typeof window !== 'undefined';
}
exports.isBrowser = isBrowser;
//# sourceMappingURL=isbrowser.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236770, function(require, module, exports) {

// Copyright 2020 Google LLC
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
exports.closeSession = exports.request = exports.sessions = void 0;
const http2 = require("http2");
const zlib = require("zlib");
const url_1 = require("url");
const qs = require("qs");
const extend = require("extend");
const stream_1 = require("stream");
const util = require("util");
const process = require("process");
const common_1 = require("gaxios/build/src/common");
const { HTTP2_HEADER_CONTENT_ENCODING, HTTP2_HEADER_CONTENT_TYPE, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS, } = http2.constants;
const DEBUG = !!process.env.HTTP2_DEBUG;
/**
 * List of sessions current in use.
 * @private
 */
exports.sessions = {};
let warned = false;
/**
 * Public method to make an http2 request.
 * @param config - Request options.
 */
async function request(config) {
    // Make sure users know this API is unstable
    if (!warned) {
        const message = `
      The HTTP/2 API in googleapis is unstable! This is an early implementation
      that should not be used in production.  It may change in unpredictable
      ways. Please only use this for experimentation.
    `;
        process.emitWarning(message, 'GOOG_HTTP2');
        warned = true;
    }
    const opts = extend(true, {}, config);
    opts.validateStatus = opts.validateStatus || validateStatus;
    opts.responseType = opts.responseType || 'json';
    const url = new url_1.URL(opts.url);
    // Check for an existing session to this host, or go create a new one.
    const sessionData = _getClient(url.host);
    // Since we're using this session, clear the timeout handle to ensure
    // it stays in memory and connected for a while further.
    if (sessionData.timeoutHandle !== undefined) {
        clearTimeout(sessionData.timeoutHandle);
    }
    // Assemble the querystring based on config.params.  We're using the
    // `qs` module to make life a little easier.
    let pathWithQs = url.pathname;
    if (config.params && Object.keys(config.params).length > 0) {
        const q = qs.stringify(opts.params);
        pathWithQs += `?${q}`;
    }
    // Assemble the headers based on basic HTTP2 primitives (path, method) and
    // custom headers sent from the consumer.  Note: I am using `Object.assign`
    // here making the assumption these objects are not deep.  If it turns out
    // they are, we may need to use the `extend` npm module for deep cloning.
    const headers = Object.assign({}, opts.headers, {
        [HTTP2_HEADER_PATH]: pathWithQs,
        [HTTP2_HEADER_METHOD]: config.method || 'GET',
    });
    // NOTE: This is working around an upstream bug in `apirequest.ts`. The
    // request path assumes that the `content-type` header is going to be set in
    // the underlying HTTP Client. This hack provides bug for bug compatability
    // with this bug in gaxios:
    // https://github.com/googleapis/gaxios/blob/master/src/gaxios.ts#L202
    if (!headers[HTTP2_HEADER_CONTENT_TYPE]) {
        if (opts.responseType !== 'text') {
            headers[HTTP2_HEADER_CONTENT_TYPE] = 'application/json';
        }
    }
    const res = {
        config,
        request: {},
        headers: [],
        status: 0,
        data: {},
        statusText: '',
    };
    const chunks = [];
    const session = sessionData.session;
    let req;
    return new Promise((resolve, reject) => {
        try {
            req = session
                .request(headers)
                .on('response', headers => {
                res.headers = headers;
                res.status = Number(headers[HTTP2_HEADER_STATUS]);
                let stream = req;
                if (headers[HTTP2_HEADER_CONTENT_ENCODING] === 'gzip') {
                    stream = req.pipe(zlib.createGunzip());
                }
                if (opts.responseType === 'stream') {
                    res.data = stream;
                    resolve(res);
                    return;
                }
                stream
                    .on('data', d => {
                    chunks.push(d);
                })
                    .on('error', err => {
                    reject(err);
                    return;
                })
                    .on('end', () => {
                    const buf = Buffer.concat(chunks);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let data = buf;
                    if (buf) {
                        if (opts.responseType === 'json') {
                            try {
                                data = JSON.parse(buf.toString('utf8'));
                            }
                            catch (_a) {
                                data = buf.toString('utf8');
                            }
                        }
                        else if (opts.responseType === 'text') {
                            data = buf.toString('utf8');
                        }
                        else if (opts.responseType === 'arraybuffer') {
                            data = buf.buffer;
                        }
                        res.data = data;
                    }
                    if (!opts.validateStatus(res.status)) {
                        let message = `Request failed with status code ${res.status}. `;
                        if (res.data && typeof res.data === 'object') {
                            const body = util.inspect(res.data, { depth: 5 });
                            message = `${message}\n'${body}`;
                        }
                        reject(new common_1.GaxiosError(message, opts, res));
                    }
                    resolve(res);
                    return;
                });
            })
                .on('error', e => {
                reject(e);
                return;
            });
        }
        catch (e) {
            closeSession(url);
            reject(e);
        }
        res.request = req;
        // If data was provided, write it to the request in the form of
        // a stream, string data, or a basic object.
        if (config.data) {
            if (config.data instanceof stream_1.Stream) {
                config.data.pipe(req);
            }
            else if (typeof config.data === 'string') {
                const data = Buffer.from(config.data);
                req.end(data);
            }
            else if (typeof config.data === 'object') {
                const data = JSON.stringify(config.data);
                req.end(data);
            }
        }
        // Create a timeout so the Http2Session will be cleaned up after
        // a period of non-use. 500 milliseconds was chosen because it's
        // a nice round number, and I don't know what would be a better
        // choice. Keeping this channel open will hold a file descriptor
        // which will prevent the process from exiting.
        sessionData.timeoutHandle = setTimeout(() => {
            closeSession(url);
        }, 500);
    });
}
exports.request = request;
/**
 * By default, throw for any non-2xx status code
 * @param status - status code from the HTTP response
 */
function validateStatus(status) {
    return status >= 200 && status < 300;
}
/**
 * Obtain an existing h2 session or go create a new one.
 * @param host - The hostname to which the session belongs.
 */
function _getClient(host) {
    if (!exports.sessions[host]) {
        if (DEBUG) {
            console.log(`Creating client for ${host}`);
        }
        const session = http2.connect(`https://${host}`);
        session
            .on('error', e => {
            console.error(`*ERROR*: ${e}`);
            delete exports.sessions[host];
        })
            .on('goaway', (errorCode, lastStreamId) => {
            console.error(`*GOAWAY*: ${errorCode} : ${lastStreamId}`);
            delete exports.sessions[host];
        });
        exports.sessions[host] = { session };
    }
    else {
        if (DEBUG) {
            console.log(`Used cached client for ${host}`);
        }
    }
    return exports.sessions[host];
}
async function closeSession(url) {
    const sessionData = exports.sessions[url.host];
    if (!sessionData) {
        return;
    }
    const { session } = sessionData;
    delete exports.sessions[url.host];
    if (DEBUG) {
        console.error(`Closing ${url.host}`);
    }
    session.close(() => {
        if (DEBUG) {
            console.error(`Closed ${url.host}`);
        }
    });
    setTimeout(() => {
        if (session && !session.destroyed) {
            if (DEBUG) {
                console.log(`Forcing close ${url.host}`);
            }
            if (session) {
                session.destroy();
            }
        }
    }, 1000);
}
exports.closeSession = closeSession;
//# sourceMappingURL=http2.js.map
}, function(modId) { var map = {"http2":1608953236770}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236771, function(require, module, exports) {
module.exports = {
  "_from": "googleapis-common@^4.4.1",
  "_id": "googleapis-common@4.4.3",
  "_inBundle": false,
  "_integrity": "sha512-W46WKCk3QtlCCfmZyQIH5zxmDOyeV5Qj+qs7nr2ox08eRkEJMWp6iwv542R/PsokXaGUSrmif4vCC4+rGzRSsQ==",
  "_location": "/googleapis-common",
  "_phantomChildren": {},
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "googleapis-common@^4.4.1",
    "name": "googleapis-common",
    "escapedName": "googleapis-common",
    "rawSpec": "^4.4.1",
    "saveSpec": null,
    "fetchSpec": "^4.4.1"
  },
  "_requiredBy": [
    "/googleapis"
  ],
  "_resolved": "https://registry.npmjs.org/googleapis-common/-/googleapis-common-4.4.3.tgz",
  "_shasum": "a2063adf17b14501a5f426b9cb0685496d835b7d",
  "_spec": "googleapis-common@^4.4.1",
  "_where": "D:\\WeChatProjects\\miniprogram-4\\node_modules\\googleapis",
  "author": {
    "name": "Google LLC"
  },
  "bugs": {
    "url": "https://github.com/googleapis/nodejs-googleapis-common/issues"
  },
  "bundleDependencies": false,
  "dependencies": {
    "extend": "^3.0.2",
    "gaxios": "^4.0.0",
    "google-auth-library": "^6.0.0",
    "qs": "^6.7.0",
    "url-template": "^2.0.8",
    "uuid": "^8.0.0"
  },
  "deprecated": false,
  "description": "A common tooling library used by the googleapis npm module. You probably don't want to use this directly.",
  "devDependencies": {
    "@compodoc/compodoc": "^1.1.9",
    "@microsoft/api-documenter": "^7.8.10",
    "@microsoft/api-extractor": "^7.8.10",
    "@types/execa": "^0.9.0",
    "@types/extend": "^3.0.1",
    "@types/mocha": "^8.0.0",
    "@types/mv": "^2.1.0",
    "@types/ncp": "^2.0.1",
    "@types/nock": "^10.0.3",
    "@types/proxyquire": "^1.3.28",
    "@types/qs": "^6.5.3",
    "@types/sinon": "^9.0.4",
    "@types/tmp": "0.2.0",
    "@types/url-template": "^2.0.28",
    "@types/uuid": "^8.0.0",
    "c8": "^7.0.0",
    "codecov": "^3.5.0",
    "execa": "^4.0.0",
    "gts": "^2.0.0",
    "http2spy": "^2.0.0",
    "is-docker": "^2.0.0",
    "karma": "^5.0.0",
    "karma-chrome-launcher": "^3.0.0",
    "karma-coverage": "^2.0.0",
    "karma-firefox-launcher": "^1.1.0",
    "karma-mocha": "^2.0.0",
    "karma-remap-coverage": "^0.1.5",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-webpack": "^4.0.2",
    "linkinator": "^2.0.0",
    "mocha": "^8.0.0",
    "mv": "^2.1.1",
    "ncp": "^2.0.0",
    "nock": "^13.0.0",
    "null-loader": "^4.0.0",
    "proxyquire": "^2.1.3",
    "puppeteer": "^5.0.0",
    "sinon": "^9.0.2",
    "tmp": "^0.2.0",
    "ts-loader": "^8.0.0",
    "typescript": "^3.8.3",
    "webpack": "^4.35.0",
    "webpack-cli": "^4.0.0"
  },
  "engines": {
    "node": ">=10.10.0"
  },
  "files": [
    "build/src",
    "!build/src/**/*.map"
  ],
  "homepage": "https://github.com/googleapis/nodejs-googleapis-common#readme",
  "keywords": [],
  "license": "Apache-2.0",
  "main": "build/src/index.js",
  "name": "googleapis-common",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/googleapis/nodejs-googleapis-common.git"
  },
  "scripts": {
    "api-documenter": "api-documenter yaml --input-folder=temp",
    "api-extractor": "api-extractor run --local",
    "benchmark": "node build/benchmark/bench.js",
    "browser-test": "karma start",
    "clean": "gts clean",
    "compile": "tsc -p .",
    "docs": "compodoc src/",
    "docs-test": "linkinator docs",
    "fix": "gts fix",
    "lint": "gts check",
    "prebenchmark": "npm run compile",
    "precompile": "gts clean",
    "predocs-test": "npm run docs",
    "prelint": "cd samples; npm link ../; npm install",
    "prepare": "npm run compile",
    "presystem-test": "npm run compile",
    "pretest": "npm run compile",
    "samples-test": "mocha build/samples-test",
    "system-test": "c8 mocha build/system-test --timeout 600000",
    "test": "c8 mocha build/test",
    "webpack": "webpack"
  },
  "types": "build/src/index.d.ts",
  "version": "4.4.3"
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236772, function(require, module, exports) {

// Copyright 2020 Google LLC
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
exports.AuthPlus = void 0;
const google_auth_library_1 = require("google-auth-library");
class AuthPlus extends google_auth_library_1.GoogleAuth {
    constructor() {
        super(...arguments);
        this.JWT = google_auth_library_1.JWT;
        this.Compute = google_auth_library_1.Compute;
        this.OAuth2 = google_auth_library_1.OAuth2Client;
        this.GoogleAuth = google_auth_library_1.GoogleAuth;
    }
    /**
     * Override getClient(), memoizing an instance of auth for
     * subsequent calls to getProjectId().
     */
    async getClient(options) {
        this._cachedAuth = new google_auth_library_1.GoogleAuth(options);
        return this._cachedAuth.getClient();
    }
    getProjectId(callback) {
        if (callback) {
            return this._cachedAuth
                ? this._cachedAuth.getProjectId(callback)
                : super.getProjectId(callback);
        }
        else {
            return this._cachedAuth
                ? this._cachedAuth.getProjectId()
                : super.getProjectId();
        }
    }
}
exports.AuthPlus = AuthPlus;
//# sourceMappingURL=authplus.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236773, function(require, module, exports) {

// Copyright 2020 Google LLC
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
exports.Discovery = void 0;
const fs = require("fs");
const google_auth_library_1 = require("google-auth-library");
const resolve = require("url");
const util = require("util");
const apirequest_1 = require("./apirequest");
const endpoint_1 = require("./endpoint");
const readFile = util.promisify(fs.readFile);
class Discovery {
    /**
     * Discovery for discovering API endpoints
     *
     * @param options Options for discovery
     */
    constructor(options) {
        this.transporter = new google_auth_library_1.DefaultTransporter();
        this.options = options || {};
    }
    /**
     * Generate and Endpoint from an endpoint schema object.
     *
     * @param schema The schema from which to generate the Endpoint.
     * @return A function that creates an endpoint.
     */
    makeEndpoint(schema) {
        return (options) => {
            const ep = new endpoint_1.Endpoint(options);
            ep.applySchema(ep, schema, schema, ep);
            return ep;
        };
    }
    /**
     * Log output of generator. Works just like console.log
     */
    log(...args) {
        if (this.options && this.options.debug) {
            console.log(...args);
        }
    }
    /**
     * Generate all APIs and return as in-memory object.
     * @param discoveryUrl
     */
    async discoverAllAPIs(discoveryUrl) {
        const headers = this.options.includePrivate
            ? {}
            : { 'X-User-Ip': '0.0.0.0' };
        const res = await this.transporter.request({
            url: discoveryUrl,
            headers,
        });
        const items = res.data.items;
        const apis = await Promise.all(items.map(async (api) => {
            const endpointCreator = await this.discoverAPI(api.discoveryRestUrl);
            return { api, endpointCreator };
        }));
        const versionIndex = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apisIndex = {};
        for (const set of apis) {
            if (!apisIndex[set.api.name]) {
                versionIndex[set.api.name] = {};
                apisIndex[set.api.name] = (options) => {
                    const type = typeof options;
                    let version;
                    if (type === 'string') {
                        version = options;
                        options = {};
                    }
                    else if (type === 'object') {
                        version = options.version;
                        delete options.version;
                    }
                    else {
                        throw new Error('Argument error: Accepts only string or object');
                    }
                    try {
                        const ep = set.endpointCreator(options, this);
                        return Object.freeze(ep); // create new & freeze
                    }
                    catch (e) {
                        throw new Error(util.format('Unable to load endpoint %s("%s"): %s', set.api.name, version, e.message));
                    }
                };
            }
            versionIndex[set.api.name][set.api.version] = set.endpointCreator;
        }
        return apisIndex;
    }
    /**
     * Generate API file given discovery URL
     *
     * @param apiDiscoveryUrl URL or filename of discovery doc for API
     * @returns A promise that resolves with a function that creates the endpoint
     */
    async discoverAPI(apiDiscoveryUrl) {
        if (typeof apiDiscoveryUrl === 'string') {
            const parts = resolve.parse(apiDiscoveryUrl);
            if (apiDiscoveryUrl && !parts.protocol) {
                this.log('Reading from file ' + apiDiscoveryUrl);
                const file = await readFile(apiDiscoveryUrl, { encoding: 'utf8' });
                return this.makeEndpoint(JSON.parse(file));
            }
            else {
                this.log('Requesting ' + apiDiscoveryUrl);
                const res = await this.transporter.request({
                    url: apiDiscoveryUrl,
                });
                return this.makeEndpoint(res.data);
            }
        }
        else {
            const options = apiDiscoveryUrl;
            this.log('Requesting ' + options.url);
            const url = options.url;
            delete options.url;
            const parameters = {
                options: { url, method: 'GET' },
                requiredParams: [],
                pathParams: [],
                params: options,
                context: { google: { _options: {} }, _options: {} },
            };
            const res = await apirequest_1.createAPIRequest(parameters);
            return this.makeEndpoint(res.data);
        }
    }
}
exports.Discovery = Discovery;
//# sourceMappingURL=discovery.js.map
}, function(modId) { var map = {"./apirequest":1608953236768,"./endpoint":1608953236774}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236774, function(require, module, exports) {

// Copyright 2020 Google LLC
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
exports.Endpoint = void 0;
const apirequest_1 = require("./apirequest");
class Endpoint {
    constructor(options) {
        this._options = options || {};
    }
    /**
     * Given a schema, add methods and resources to a target.
     *
     * @param {object} target The target to which to apply the schema.
     * @param {object} rootSchema The top-level schema, so we don't lose track of it
     * during recursion.
     * @param {object} schema The current schema from which to extract methods and
     * resources.
     * @param {object} context The context to add to each method.
     */
    applySchema(target, rootSchema, schema, context) {
        this.applyMethodsFromSchema(target, rootSchema, schema, context);
        if (schema.resources) {
            for (const resourceName in schema.resources) {
                if (Object.prototype.hasOwnProperty.call(schema.resources, resourceName)) {
                    const resource = schema.resources[resourceName];
                    if (!target[resourceName]) {
                        target[resourceName] = {};
                    }
                    this.applySchema(target[resourceName], rootSchema, resource, context);
                }
            }
        }
    }
    /**
     * Given a schema, add methods to a target.
     *
     * @param {object} target The target to which to apply the methods.
     * @param {object} rootSchema The top-level schema, so we don't lose track of it
     * during recursion.
     * @param {object} schema The current schema from which to extract methods.
     * @param {object} context The context to add to each method.
     */
    applyMethodsFromSchema(target, rootSchema, schema, context) {
        if (schema.methods) {
            for (const name in schema.methods) {
                if (Object.prototype.hasOwnProperty.call(schema.methods, name)) {
                    const method = schema.methods[name];
                    target[name] = this.makeMethod(rootSchema, method, context);
                }
            }
        }
    }
    /**
     * Given a method schema, add a method to a target.
     *
     * @param target The target to which to add the method.
     * @param schema The top-level schema that contains the rootUrl, etc.
     * @param method The method schema from which to generate the method.
     * @param context The context to add to the method.
     */
    makeMethod(schema, method, context) {
        return (paramsOrCallback, callback) => {
            const params = typeof paramsOrCallback === 'function' ? {} : paramsOrCallback;
            callback =
                typeof paramsOrCallback === 'function'
                    ? paramsOrCallback
                    : callback;
            const schemaUrl = buildurl(schema.rootUrl + schema.servicePath + method.path);
            const parameters = {
                options: {
                    url: schemaUrl.substring(1, schemaUrl.length - 1),
                    method: method.httpMethod,
                },
                params,
                requiredParams: method.parameterOrder || [],
                pathParams: this.getPathParams(method.parameters),
                context,
            };
            if (method.mediaUpload &&
                method.mediaUpload.protocols &&
                method.mediaUpload.protocols.simple &&
                method.mediaUpload.protocols.simple.path) {
                const mediaUrl = buildurl(schema.rootUrl + method.mediaUpload.protocols.simple.path);
                parameters.mediaUrl = mediaUrl.substring(1, mediaUrl.length - 1);
            }
            if (!callback) {
                return apirequest_1.createAPIRequest(parameters);
            }
            apirequest_1.createAPIRequest(parameters, callback);
            return;
        };
    }
    getPathParams(params) {
        const pathParams = new Array();
        if (typeof params !== 'object') {
            params = {};
        }
        Object.keys(params).forEach(key => {
            if (params[key].location === 'path') {
                pathParams.push(key);
            }
        });
        return pathParams;
    }
}
exports.Endpoint = Endpoint;
/**
 * Build a string used to create a URL from the discovery doc provided URL.
 * replace double slashes with single slash (except in https://)
 * @private
 * @param  input URL to build from
 * @return Resulting built URL
 */
function buildurl(input) {
    return input ? `'${input}'`.replace(/([^:]\/)\/+/g, '$1') : '';
}
//# sourceMappingURL=endpoint.js.map
}, function(modId) { var map = {"./apirequest":1608953236768}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1608953236766);
})()
//# sourceMappingURL=index.js.map