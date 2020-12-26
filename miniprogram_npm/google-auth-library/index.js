module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1608953236727, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuth = exports.auth = void 0;
// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
const googleauth_1 = require("./auth/googleauth");
Object.defineProperty(exports, "GoogleAuth", { enumerable: true, get: function () { return googleauth_1.GoogleAuth; } });
var computeclient_1 = require("./auth/computeclient");
Object.defineProperty(exports, "Compute", { enumerable: true, get: function () { return computeclient_1.Compute; } });
var envDetect_1 = require("./auth/envDetect");
Object.defineProperty(exports, "GCPEnv", { enumerable: true, get: function () { return envDetect_1.GCPEnv; } });
var iam_1 = require("./auth/iam");
Object.defineProperty(exports, "IAMAuth", { enumerable: true, get: function () { return iam_1.IAMAuth; } });
var idtokenclient_1 = require("./auth/idtokenclient");
Object.defineProperty(exports, "IdTokenClient", { enumerable: true, get: function () { return idtokenclient_1.IdTokenClient; } });
var jwtaccess_1 = require("./auth/jwtaccess");
Object.defineProperty(exports, "JWTAccess", { enumerable: true, get: function () { return jwtaccess_1.JWTAccess; } });
var jwtclient_1 = require("./auth/jwtclient");
Object.defineProperty(exports, "JWT", { enumerable: true, get: function () { return jwtclient_1.JWT; } });
var oauth2client_1 = require("./auth/oauth2client");
Object.defineProperty(exports, "CodeChallengeMethod", { enumerable: true, get: function () { return oauth2client_1.CodeChallengeMethod; } });
Object.defineProperty(exports, "OAuth2Client", { enumerable: true, get: function () { return oauth2client_1.OAuth2Client; } });
var loginticket_1 = require("./auth/loginticket");
Object.defineProperty(exports, "LoginTicket", { enumerable: true, get: function () { return loginticket_1.LoginTicket; } });
var refreshclient_1 = require("./auth/refreshclient");
Object.defineProperty(exports, "UserRefreshClient", { enumerable: true, get: function () { return refreshclient_1.UserRefreshClient; } });
var transporters_1 = require("./transporters");
Object.defineProperty(exports, "DefaultTransporter", { enumerable: true, get: function () { return transporters_1.DefaultTransporter; } });
const auth = new googleauth_1.GoogleAuth();
exports.auth = auth;
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./auth/googleauth":1608953236728,"./auth/computeclient":1608953236735,"./auth/envDetect":1608953236740,"./auth/iam":1608953236744,"./auth/idtokenclient":1608953236739,"./auth/jwtaccess":1608953236742,"./auth/jwtclient":1608953236741,"./auth/oauth2client":1608953236736,"./auth/loginticket":1608953236738,"./auth/refreshclient":1608953236743,"./transporters":1608953236732}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236728, function(require, module, exports) {

// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuth = exports.CLOUD_SDK_CLIENT_ID = void 0;
const child_process_1 = require("child_process");
const fs = require("fs");
const gcpMetadata = require("gcp-metadata");
const os = require("os");
const path = require("path");
const crypto_1 = require("../crypto/crypto");
const transporters_1 = require("../transporters");
const computeclient_1 = require("./computeclient");
const idtokenclient_1 = require("./idtokenclient");
const envDetect_1 = require("./envDetect");
const jwtclient_1 = require("./jwtclient");
const refreshclient_1 = require("./refreshclient");
exports.CLOUD_SDK_CLIENT_ID = '764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com';
class GoogleAuth {
    constructor(opts) {
        /**
         * Caches a value indicating whether the auth layer is running on Google
         * Compute Engine.
         * @private
         */
        this.checkIsGCE = undefined;
        // To save the contents of the JSON credential file
        this.jsonContent = null;
        this.cachedCredential = null;
        opts = opts || {};
        this._cachedProjectId = opts.projectId || null;
        this.keyFilename = opts.keyFilename || opts.keyFile;
        this.scopes = opts.scopes;
        this.jsonContent = opts.credentials || null;
        this.clientOptions = opts.clientOptions;
    }
    // Note:  this properly is only public to satisify unit tests.
    // https://github.com/Microsoft/TypeScript/issues/5228
    get isGCE() {
        return this.checkIsGCE;
    }
    getProjectId(callback) {
        if (callback) {
            this.getProjectIdAsync().then(r => callback(null, r), callback);
        }
        else {
            return this.getProjectIdAsync();
        }
    }
    getProjectIdAsync() {
        if (this._cachedProjectId) {
            return Promise.resolve(this._cachedProjectId);
        }
        // In implicit case, supports three environments. In order of precedence,
        // the implicit environments are:
        // - GCLOUD_PROJECT or GOOGLE_CLOUD_PROJECT environment variable
        // - GOOGLE_APPLICATION_CREDENTIALS JSON file
        // - Cloud SDK: `gcloud config config-helper --format json`
        // - GCE project ID from metadata server)
        if (!this._getDefaultProjectIdPromise) {
            // TODO: refactor the below code so that it doesn't mix and match
            // promises and async/await.
            this._getDefaultProjectIdPromise = new Promise(
            // eslint-disable-next-line no-async-promise-executor
            async (resolve, reject) => {
                try {
                    const projectId = this.getProductionProjectId() ||
                        (await this.getFileProjectId()) ||
                        (await this.getDefaultServiceProjectId()) ||
                        (await this.getGCEProjectId());
                    this._cachedProjectId = projectId;
                    if (!projectId) {
                        throw new Error('Unable to detect a Project Id in the current environment. \n' +
                            'To learn more about authentication and Google APIs, visit: \n' +
                            'https://cloud.google.com/docs/authentication/getting-started');
                    }
                    resolve(projectId);
                }
                catch (e) {
                    reject(e);
                }
            });
        }
        return this._getDefaultProjectIdPromise;
    }
    getApplicationDefault(optionsOrCallback = {}, callback) {
        let options;
        if (typeof optionsOrCallback === 'function') {
            callback = optionsOrCallback;
        }
        else {
            options = optionsOrCallback;
        }
        if (callback) {
            this.getApplicationDefaultAsync(options).then(r => callback(null, r.credential, r.projectId), callback);
        }
        else {
            return this.getApplicationDefaultAsync(options);
        }
    }
    async getApplicationDefaultAsync(options = {}) {
        // If we've already got a cached credential, just return it.
        if (this.cachedCredential) {
            return {
                credential: this.cachedCredential,
                projectId: await this.getProjectIdAsync(),
            };
        }
        let credential;
        let projectId;
        // Check for the existence of a local environment variable pointing to the
        // location of the credential file. This is typically used in local
        // developer scenarios.
        credential = await this._tryGetApplicationCredentialsFromEnvironmentVariable(options);
        if (credential) {
            if (credential instanceof jwtclient_1.JWT) {
                credential.defaultScopes = this.defaultScopes;
                credential.scopes = this.scopes;
            }
            this.cachedCredential = credential;
            projectId = await this.getProjectId();
            return { credential, projectId };
        }
        // Look in the well-known credential file location.
        credential = await this._tryGetApplicationCredentialsFromWellKnownFile(options);
        if (credential) {
            if (credential instanceof jwtclient_1.JWT) {
                credential.defaultScopes = this.defaultScopes;
                credential.scopes = this.scopes;
            }
            this.cachedCredential = credential;
            projectId = await this.getProjectId();
            return { credential, projectId };
        }
        // Determine if we're running on GCE.
        let isGCE;
        try {
            isGCE = await this._checkIsGCE();
        }
        catch (e) {
            e.message = `Unexpected error determining execution environment: ${e.message}`;
            throw e;
        }
        if (!isGCE) {
            // We failed to find the default credentials. Bail out with an error.
            throw new Error('Could not load the default credentials. Browse to https://cloud.google.com/docs/authentication/getting-started for more information.');
        }
        // For GCE, just return a default ComputeClient. It will take care of
        // the rest.
        options.scopes = this.scopes || this.defaultScopes;
        this.cachedCredential = new computeclient_1.Compute(options);
        projectId = await this.getProjectId();
        return { projectId, credential: this.cachedCredential };
    }
    /**
     * Determines whether the auth layer is running on Google Compute Engine.
     * @returns A promise that resolves with the boolean.
     * @api private
     */
    async _checkIsGCE() {
        if (this.checkIsGCE === undefined) {
            this.checkIsGCE = await gcpMetadata.isAvailable();
        }
        return this.checkIsGCE;
    }
    /**
     * Attempts to load default credentials from the environment variable path..
     * @returns Promise that resolves with the OAuth2Client or null.
     * @api private
     */
    async _tryGetApplicationCredentialsFromEnvironmentVariable(options) {
        const credentialsPath = process.env['GOOGLE_APPLICATION_CREDENTIALS'] ||
            process.env['google_application_credentials'];
        if (!credentialsPath || credentialsPath.length === 0) {
            return null;
        }
        try {
            return this._getApplicationCredentialsFromFilePath(credentialsPath, options);
        }
        catch (e) {
            e.message = `Unable to read the credential file specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable: ${e.message}`;
            throw e;
        }
    }
    /**
     * Attempts to load default credentials from a well-known file location
     * @return Promise that resolves with the OAuth2Client or null.
     * @api private
     */
    async _tryGetApplicationCredentialsFromWellKnownFile(options) {
        // First, figure out the location of the file, depending upon the OS type.
        let location = null;
        if (this._isWindows()) {
            // Windows
            location = process.env['APPDATA'];
        }
        else {
            // Linux or Mac
            const home = process.env['HOME'];
            if (home) {
                location = path.join(home, '.config');
            }
        }
        // If we found the root path, expand it.
        if (location) {
            location = path.join(location, 'gcloud', 'application_default_credentials.json');
            if (!fs.existsSync(location)) {
                location = null;
            }
        }
        // The file does not exist.
        if (!location) {
            return null;
        }
        // The file seems to exist. Try to use it.
        const client = await this._getApplicationCredentialsFromFilePath(location, options);
        return client;
    }
    /**
     * Attempts to load default credentials from a file at the given path..
     * @param filePath The path to the file to read.
     * @returns Promise that resolves with the OAuth2Client
     * @api private
     */
    async _getApplicationCredentialsFromFilePath(filePath, options = {}) {
        // Make sure the path looks like a string.
        if (!filePath || filePath.length === 0) {
            throw new Error('The file path is invalid.');
        }
        // Make sure there is a file at the path. lstatSync will throw if there is
        // nothing there.
        try {
            // Resolve path to actual file in case of symlink. Expect a thrown error
            // if not resolvable.
            filePath = fs.realpathSync(filePath);
            if (!fs.lstatSync(filePath).isFile()) {
                throw new Error();
            }
        }
        catch (err) {
            err.message = `The file at ${filePath} does not exist, or it is not a file. ${err.message}`;
            throw err;
        }
        // Now open a read stream on the file, and parse it.
        const readStream = fs.createReadStream(filePath);
        return this.fromStream(readStream, options);
    }
    /**
     * Create a credentials instance using the given input options.
     * @param json The input object.
     * @param options The JWT or UserRefresh options for the client
     * @returns JWT or UserRefresh Client with data
     */
    fromJSON(json, options) {
        let client;
        if (!json) {
            throw new Error('Must pass in a JSON object containing the Google auth settings.');
        }
        options = options || {};
        if (json.type === 'authorized_user') {
            client = new refreshclient_1.UserRefreshClient(options);
        }
        else {
            options.scopes = this.scopes;
            client = new jwtclient_1.JWT(options);
            client.defaultScopes = this.defaultScopes;
        }
        client.fromJSON(json);
        return client;
    }
    /**
     * Return a JWT or UserRefreshClient from JavaScript object, caching both the
     * object used to instantiate and the client.
     * @param json The input object.
     * @param options The JWT or UserRefresh options for the client
     * @returns JWT or UserRefresh Client with data
     */
    _cacheClientFromJSON(json, options) {
        let client;
        // create either a UserRefreshClient or JWT client.
        options = options || {};
        if (json.type === 'authorized_user') {
            client = new refreshclient_1.UserRefreshClient(options);
        }
        else {
            options.scopes = this.scopes;
            client = new jwtclient_1.JWT(options);
            client.defaultScopes = this.defaultScopes;
        }
        client.fromJSON(json);
        // cache both raw data used to instantiate client and client itself.
        this.jsonContent = json;
        this.cachedCredential = client;
        return this.cachedCredential;
    }
    fromStream(inputStream, optionsOrCallback = {}, callback) {
        let options = {};
        if (typeof optionsOrCallback === 'function') {
            callback = optionsOrCallback;
        }
        else {
            options = optionsOrCallback;
        }
        if (callback) {
            this.fromStreamAsync(inputStream, options).then(r => callback(null, r), callback);
        }
        else {
            return this.fromStreamAsync(inputStream, options);
        }
    }
    fromStreamAsync(inputStream, options) {
        return new Promise((resolve, reject) => {
            if (!inputStream) {
                throw new Error('Must pass in a stream containing the Google auth settings.');
            }
            let s = '';
            inputStream
                .setEncoding('utf8')
                .on('error', reject)
                .on('data', chunk => (s += chunk))
                .on('end', () => {
                try {
                    const data = JSON.parse(s);
                    const r = this._cacheClientFromJSON(data, options);
                    return resolve(r);
                }
                catch (err) {
                    return reject(err);
                }
            });
        });
    }
    /**
     * Create a credentials instance using the given API key string.
     * @param apiKey The API key string
     * @param options An optional options object.
     * @returns A JWT loaded from the key
     */
    fromAPIKey(apiKey, options) {
        options = options || {};
        const client = new jwtclient_1.JWT(options);
        client.fromAPIKey(apiKey);
        return client;
    }
    /**
     * Determines whether the current operating system is Windows.
     * @api private
     */
    _isWindows() {
        const sys = os.platform();
        if (sys && sys.length >= 3) {
            if (sys.substring(0, 3).toLowerCase() === 'win') {
                return true;
            }
        }
        return false;
    }
    /**
     * Run the Google Cloud SDK command that prints the default project ID
     */
    async getDefaultServiceProjectId() {
        return new Promise(resolve => {
            child_process_1.exec('gcloud config config-helper --format json', (err, stdout) => {
                if (!err && stdout) {
                    try {
                        const projectId = JSON.parse(stdout).configuration.properties.core
                            .project;
                        resolve(projectId);
                        return;
                    }
                    catch (e) {
                        // ignore errors
                    }
                }
                resolve(null);
            });
        });
    }
    /**
     * Loads the project id from environment variables.
     * @api private
     */
    getProductionProjectId() {
        return (process.env['GCLOUD_PROJECT'] ||
            process.env['GOOGLE_CLOUD_PROJECT'] ||
            process.env['gcloud_project'] ||
            process.env['google_cloud_project']);
    }
    /**
     * Loads the project id from the GOOGLE_APPLICATION_CREDENTIALS json file.
     * @api private
     */
    async getFileProjectId() {
        if (this.cachedCredential) {
            // Try to read the project ID from the cached credentials file
            return this.cachedCredential.projectId;
        }
        // Ensure the projectId is loaded from the keyFile if available.
        if (this.keyFilename) {
            const creds = await this.getClient();
            if (creds && creds.projectId) {
                return creds.projectId;
            }
        }
        // Try to load a credentials file and read its project ID
        const r = await this._tryGetApplicationCredentialsFromEnvironmentVariable();
        if (r) {
            return r.projectId;
        }
        else {
            return null;
        }
    }
    /**
     * Gets the Compute Engine project ID if it can be inferred.
     */
    async getGCEProjectId() {
        try {
            const r = await gcpMetadata.project('project-id');
            return r;
        }
        catch (e) {
            // Ignore any errors
            return null;
        }
    }
    getCredentials(callback) {
        if (callback) {
            this.getCredentialsAsync().then(r => callback(null, r), callback);
        }
        else {
            return this.getCredentialsAsync();
        }
    }
    async getCredentialsAsync() {
        await this.getClient();
        if (this.jsonContent) {
            const credential = {
                client_email: this.jsonContent.client_email,
                private_key: this.jsonContent.private_key,
            };
            return credential;
        }
        const isGCE = await this._checkIsGCE();
        if (!isGCE) {
            throw new Error('Unknown error.');
        }
        // For GCE, return the service account details from the metadata server
        // NOTE: The trailing '/' at the end of service-accounts/ is very important!
        // The GCF metadata server doesn't respect querystring params if this / is
        // not included.
        const data = await gcpMetadata.instance({
            property: 'service-accounts/',
            params: { recursive: 'true' },
        });
        if (!data || !data.default || !data.default.email) {
            throw new Error('Failure from metadata server.');
        }
        return { client_email: data.default.email };
    }
    /**
     * Automatically obtain a client based on the provided configuration.  If no
     * options were passed, use Application Default Credentials.
     */
    async getClient(options) {
        if (options) {
            throw new Error('Passing options to getClient is forbidden in v5.0.0. Use new GoogleAuth(opts) instead.');
        }
        if (!this.cachedCredential) {
            if (this.jsonContent) {
                this._cacheClientFromJSON(this.jsonContent, this.clientOptions);
            }
            else if (this.keyFilename) {
                const filePath = path.resolve(this.keyFilename);
                const stream = fs.createReadStream(filePath);
                await this.fromStreamAsync(stream, this.clientOptions);
            }
            else {
                await this.getApplicationDefaultAsync(this.clientOptions);
            }
        }
        return this.cachedCredential;
    }
    /**
     * Creates a client which will fetch an ID token for authorization.
     * @param targetAudience the audience for the fetched ID token.
     * @returns IdTokenClient for making HTTP calls authenticated with ID tokens.
     */
    async getIdTokenClient(targetAudience) {
        const client = await this.getClient();
        if (!('fetchIdToken' in client)) {
            throw new Error('Cannot fetch ID token in this environment, use GCE or set the GOOGLE_APPLICATION_CREDENTIALS environment variable to a service account credentials JSON file.');
        }
        return new idtokenclient_1.IdTokenClient({ targetAudience, idTokenProvider: client });
    }
    /**
     * Automatically obtain application default credentials, and return
     * an access token for making requests.
     */
    async getAccessToken() {
        const client = await this.getClient();
        return (await client.getAccessToken()).token;
    }
    /**
     * Obtain the HTTP headers that will provide authorization for a given
     * request.
     */
    async getRequestHeaders(url) {
        const client = await this.getClient();
        return client.getRequestHeaders(url);
    }
    /**
     * Obtain credentials for a request, then attach the appropriate headers to
     * the request options.
     * @param opts Axios or Request options on which to attach the headers
     */
    async authorizeRequest(opts) {
        opts = opts || {};
        const url = opts.url || opts.uri;
        const client = await this.getClient();
        const headers = await client.getRequestHeaders(url);
        opts.headers = Object.assign(opts.headers || {}, headers);
        return opts;
    }
    /**
     * Automatically obtain application default credentials, and make an
     * HTTP request using the given options.
     * @param opts Axios request options for the HTTP request.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async request(opts) {
        const client = await this.getClient();
        return client.request(opts);
    }
    /**
     * Determine the compute environment in which the code is running.
     */
    getEnv() {
        return envDetect_1.getEnv();
    }
    /**
     * Sign the given data with the current private key, or go out
     * to the IAM API to sign it.
     * @param data The data to be signed.
     */
    async sign(data) {
        const client = await this.getClient();
        const crypto = crypto_1.createCrypto();
        if (client instanceof jwtclient_1.JWT && client.key) {
            const sign = await crypto.sign(client.key, data);
            return sign;
        }
        const projectId = await this.getProjectId();
        if (!projectId) {
            throw new Error('Cannot sign data without a project ID.');
        }
        const creds = await this.getCredentials();
        if (!creds.client_email) {
            throw new Error('Cannot sign data without `client_email`.');
        }
        const url = `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${creds.client_email}:signBlob`;
        const res = await this.request({
            method: 'POST',
            url,
            data: {
                payload: crypto.encodeBase64StringUtf8(data),
            },
        });
        return res.data.signedBlob;
    }
}
exports.GoogleAuth = GoogleAuth;
/**
 * Export DefaultTransporter as a static property of the class.
 */
GoogleAuth.DefaultTransporter = transporters_1.DefaultTransporter;
//# sourceMappingURL=googleauth.js.map
}, function(modId) { var map = {"../crypto/crypto":1608953236729,"../transporters":1608953236732,"./computeclient":1608953236735,"./idtokenclient":1608953236739,"./envDetect":1608953236740,"./jwtclient":1608953236741,"./refreshclient":1608953236743}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236729, function(require, module, exports) {

// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/* global window */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBrowserCrypto = exports.createCrypto = void 0;
const crypto_1 = require("./browser/crypto");
const crypto_2 = require("./node/crypto");
function createCrypto() {
    if (hasBrowserCrypto()) {
        return new crypto_1.BrowserCrypto();
    }
    return new crypto_2.NodeCrypto();
}
exports.createCrypto = createCrypto;
function hasBrowserCrypto() {
    return (typeof window !== 'undefined' &&
        typeof window.crypto !== 'undefined' &&
        typeof window.crypto.subtle !== 'undefined');
}
exports.hasBrowserCrypto = hasBrowserCrypto;
//# sourceMappingURL=crypto.js.map
}, function(modId) { var map = {"./browser/crypto":1608953236730,"./node/crypto":1608953236731}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236730, function(require, module, exports) {

// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/* global window */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserCrypto = void 0;
// This file implements crypto functions we need using in-browser
// SubtleCrypto interface `window.crypto.subtle`.
const base64js = require("base64-js");
// Not all browsers support `TextEncoder`. The following `require` will
// provide a fast UTF8-only replacement for those browsers that don't support
// text encoding natively.
// eslint-disable-next-line node/no-unsupported-features/node-builtins
if (typeof process === 'undefined' && typeof TextEncoder === 'undefined') {
    require('fast-text-encoding');
}
class BrowserCrypto {
    constructor() {
        if (typeof window === 'undefined' ||
            window.crypto === undefined ||
            window.crypto.subtle === undefined) {
            throw new Error("SubtleCrypto not found. Make sure it's an https:// website.");
        }
    }
    async sha256DigestBase64(str) {
        // SubtleCrypto digest() method is async, so we must make
        // this method async as well.
        // To calculate SHA256 digest using SubtleCrypto, we first
        // need to convert an input string to an ArrayBuffer:
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        const inputBuffer = new TextEncoder().encode(str);
        // Result is ArrayBuffer as well.
        const outputBuffer = await window.crypto.subtle.digest('SHA-256', inputBuffer);
        return base64js.fromByteArray(new Uint8Array(outputBuffer));
    }
    randomBytesBase64(count) {
        const array = new Uint8Array(count);
        window.crypto.getRandomValues(array);
        return base64js.fromByteArray(array);
    }
    static padBase64(base64) {
        // base64js requires padding, so let's add some '='
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }
        return base64;
    }
    async verify(pubkey, data, signature) {
        const algo = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: { name: 'SHA-256' },
        };
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        const dataArray = new TextEncoder().encode(data);
        const signatureArray = base64js.toByteArray(BrowserCrypto.padBase64(signature));
        const cryptoKey = await window.crypto.subtle.importKey('jwk', pubkey, algo, true, ['verify']);
        // SubtleCrypto's verify method is async so we must make
        // this method async as well.
        const result = await window.crypto.subtle.verify(algo, cryptoKey, signatureArray, dataArray);
        return result;
    }
    async sign(privateKey, data) {
        const algo = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: { name: 'SHA-256' },
        };
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        const dataArray = new TextEncoder().encode(data);
        const cryptoKey = await window.crypto.subtle.importKey('jwk', privateKey, algo, true, ['sign']);
        // SubtleCrypto's sign method is async so we must make
        // this method async as well.
        const result = await window.crypto.subtle.sign(algo, cryptoKey, dataArray);
        return base64js.fromByteArray(new Uint8Array(result));
    }
    decodeBase64StringUtf8(base64) {
        const uint8array = base64js.toByteArray(BrowserCrypto.padBase64(base64));
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        const result = new TextDecoder().decode(uint8array);
        return result;
    }
    encodeBase64StringUtf8(text) {
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        const uint8array = new TextEncoder().encode(text);
        const result = base64js.fromByteArray(uint8array);
        return result;
    }
}
exports.BrowserCrypto = BrowserCrypto;
//# sourceMappingURL=crypto.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236731, function(require, module, exports) {

// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeCrypto = void 0;
const crypto = require("crypto");
class NodeCrypto {
    async sha256DigestBase64(str) {
        return crypto.createHash('sha256').update(str).digest('base64');
    }
    randomBytesBase64(count) {
        return crypto.randomBytes(count).toString('base64');
    }
    async verify(pubkey, data, signature) {
        const verifier = crypto.createVerify('sha256');
        verifier.update(data);
        verifier.end();
        return verifier.verify(pubkey, signature, 'base64');
    }
    async sign(privateKey, data) {
        const signer = crypto.createSign('RSA-SHA256');
        signer.update(data);
        signer.end();
        return signer.sign(privateKey, 'base64');
    }
    decodeBase64StringUtf8(base64) {
        return Buffer.from(base64, 'base64').toString('utf-8');
    }
    encodeBase64StringUtf8(text) {
        return Buffer.from(text, 'utf-8').toString('base64');
    }
}
exports.NodeCrypto = NodeCrypto;
//# sourceMappingURL=crypto.js.map
}, function(modId) { var map = {"crypto":1608953236731}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236732, function(require, module, exports) {

// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTransporter = void 0;
const gaxios_1 = require("gaxios");
const options_1 = require("./options");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json');
const PRODUCT_NAME = 'google-api-nodejs-client';
class DefaultTransporter {
    /**
     * Configures request options before making a request.
     * @param opts GaxiosOptions options.
     * @return Configured options.
     */
    configure(opts = {}) {
        opts.headers = opts.headers || {};
        if (typeof window === 'undefined') {
            // set transporter user agent if not in browser
            const uaValue = opts.headers['User-Agent'];
            if (!uaValue) {
                opts.headers['User-Agent'] = DefaultTransporter.USER_AGENT;
            }
            else if (!uaValue.includes(`${PRODUCT_NAME}/`)) {
                opts.headers['User-Agent'] = `${uaValue} ${DefaultTransporter.USER_AGENT}`;
            }
            // track google-auth-library-nodejs version:
            const authVersion = `auth/${pkg.version}`;
            if (opts.headers['x-goog-api-client'] &&
                !opts.headers['x-goog-api-client'].includes(authVersion)) {
                opts.headers['x-goog-api-client'] = `${opts.headers['x-goog-api-client']} ${authVersion}`;
            }
            else if (!opts.headers['x-goog-api-client']) {
                const nodeVersion = process.version.replace(/^v/, '');
                opts.headers['x-goog-api-client'] = `gl-node/${nodeVersion} ${authVersion}`;
            }
        }
        return opts;
    }
    request(opts, callback) {
        // ensure the user isn't passing in request-style options
        opts = this.configure(opts);
        try {
            options_1.validate(opts);
        }
        catch (e) {
            if (callback) {
                return callback(e);
            }
            else {
                throw e;
            }
        }
        if (callback) {
            gaxios_1.request(opts).then(r => {
                callback(null, r);
            }, e => {
                callback(this.processError(e));
            });
        }
        else {
            return gaxios_1.request(opts).catch(e => {
                throw this.processError(e);
            });
        }
    }
    /**
     * Changes the error to include details from the body.
     */
    processError(e) {
        const res = e.response;
        const err = e;
        const body = res ? res.data : null;
        if (res && body && body.error && res.status !== 200) {
            if (typeof body.error === 'string') {
                err.message = body.error;
                err.code = res.status.toString();
            }
            else if (Array.isArray(body.error.errors)) {
                err.message = body.error.errors
                    .map((err2) => err2.message)
                    .join('\n');
                err.code = body.error.code;
                err.errors = body.error.errors;
            }
            else {
                err.message = body.error.message;
                err.code = body.error.code || res.status;
            }
        }
        else if (res && res.status >= 400) {
            // Consider all 4xx and 5xx responses errors.
            err.message = body;
            err.code = res.status.toString();
        }
        return err;
    }
}
exports.DefaultTransporter = DefaultTransporter;
/**
 * Default user agent.
 */
DefaultTransporter.USER_AGENT = `${PRODUCT_NAME}/${pkg.version}`;
//# sourceMappingURL=transporters.js.map
}, function(modId) { var map = {"./options":1608953236733,"../../package.json":1608953236734}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236733, function(require, module, exports) {

// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
// Accepts an options object passed from the user to the API.  In the
// previous version of the API, it referred to a `Request` options object.
// Now it refers to an Axiox Request Config object.  This is here to help
// ensure users don't pass invalid options when they upgrade from 0.x to 1.x.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validate(options) {
    const vpairs = [
        { invalid: 'uri', expected: 'url' },
        { invalid: 'json', expected: 'data' },
        { invalid: 'qs', expected: 'params' },
    ];
    for (const pair of vpairs) {
        if (options[pair.invalid]) {
            const e = `'${pair.invalid}' is not a valid configuration option. Please use '${pair.expected}' instead. This library is using Axios for requests. Please see https://github.com/axios/axios to learn more about the valid request options.`;
            throw new Error(e);
        }
    }
}
exports.validate = validate;
//# sourceMappingURL=options.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236734, function(require, module, exports) {
module.exports = {
  "_from": "google-auth-library@^6.0.0",
  "_id": "google-auth-library@6.1.3",
  "_inBundle": false,
  "_integrity": "sha512-m9mwvY3GWbr7ZYEbl61isWmk+fvTmOt0YNUfPOUY2VH8K5pZlAIWJjxEi0PqR3OjMretyiQLI6GURMrPSwHQ2g==",
  "_location": "/google-auth-library",
  "_phantomChildren": {
    "buffer-equal-constant-time": "1.0.1",
    "ecdsa-sig-formatter": "1.0.11",
    "safe-buffer": "5.2.1"
  },
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "google-auth-library@^6.0.0",
    "name": "google-auth-library",
    "escapedName": "google-auth-library",
    "rawSpec": "^6.0.0",
    "saveSpec": null,
    "fetchSpec": "^6.0.0"
  },
  "_requiredBy": [
    "/googleapis",
    "/googleapis-common"
  ],
  "_resolved": "https://registry.npmjs.org/google-auth-library/-/google-auth-library-6.1.3.tgz",
  "_shasum": "39d868140b70d0c4b32c6f6d8f4ccc1400d84dca",
  "_spec": "google-auth-library@^6.0.0",
  "_where": "D:\\WeChatProjects\\miniprogram-4\\node_modules\\googleapis",
  "author": {
    "name": "Google Inc."
  },
  "bugs": {
    "url": "https://github.com/googleapis/google-auth-library-nodejs/issues"
  },
  "bundleDependencies": false,
  "dependencies": {
    "arrify": "^2.0.0",
    "base64-js": "^1.3.0",
    "ecdsa-sig-formatter": "^1.0.11",
    "fast-text-encoding": "^1.0.0",
    "gaxios": "^4.0.0",
    "gcp-metadata": "^4.2.0",
    "gtoken": "^5.0.4",
    "jws": "^4.0.0",
    "lru-cache": "^6.0.0"
  },
  "deprecated": false,
  "description": "Google APIs Authentication Client Library for Node.js",
  "devDependencies": {
    "@compodoc/compodoc": "^1.1.7",
    "@microsoft/api-documenter": "^7.8.10",
    "@microsoft/api-extractor": "^7.8.10",
    "@types/base64-js": "^1.2.5",
    "@types/chai": "^4.1.7",
    "@types/jws": "^3.1.0",
    "@types/lru-cache": "^5.0.0",
    "@types/mocha": "^8.0.0",
    "@types/mv": "^2.1.0",
    "@types/ncp": "^2.0.1",
    "@types/node": "^10.5.1",
    "@types/sinon": "^9.0.0",
    "@types/tmp": "^0.2.0",
    "assert-rejects": "^1.0.0",
    "c8": "^7.0.0",
    "chai": "^4.2.0",
    "codecov": "^3.0.2",
    "execa": "^4.0.0",
    "gts": "^2.0.0",
    "is-docker": "^2.0.0",
    "karma": "^5.0.0",
    "karma-chrome-launcher": "^3.0.0",
    "karma-coverage": "^2.0.0",
    "karma-firefox-launcher": "^2.0.0",
    "karma-mocha": "^2.0.0",
    "karma-remap-coverage": "^0.1.5",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-webpack": "^4.0.0",
    "keypair": "^1.0.1",
    "linkinator": "^2.0.0",
    "mocha": "^8.0.0",
    "mv": "^2.1.1",
    "ncp": "^2.0.0",
    "nock": "^13.0.0",
    "null-loader": "^4.0.0",
    "puppeteer": "^5.0.0",
    "sinon": "^9.0.0",
    "tmp": "^0.2.0",
    "ts-loader": "^8.0.0",
    "typescript": "^3.8.3",
    "webpack": "^4.20.2",
    "webpack-cli": "^4.0.0"
  },
  "engines": {
    "node": ">=10"
  },
  "files": [
    "build/src",
    "!build/src/**/*.map"
  ],
  "homepage": "https://github.com/googleapis/google-auth-library-nodejs#readme",
  "keywords": [
    "google",
    "api",
    "google apis",
    "client",
    "client library"
  ],
  "license": "Apache-2.0",
  "main": "./build/src/index.js",
  "name": "google-auth-library",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/googleapis/google-auth-library-nodejs.git"
  },
  "scripts": {
    "api-documenter": "api-documenter yaml --input-folder=temp",
    "api-extractor": "api-extractor run --local",
    "browser-test": "karma start",
    "clean": "gts clean",
    "compile": "tsc -p .",
    "docs": "compodoc src/",
    "docs-test": "linkinator docs",
    "fix": "gts fix",
    "lint": "gts check",
    "precompile": "gts clean",
    "predocs-test": "npm run docs",
    "prelint": "cd samples; npm link ../; npm install",
    "prepare": "npm run compile",
    "presystem-test": "npm run compile",
    "pretest": "npm run compile",
    "samples-test": "cd samples/ && npm link ../ && npm test && cd ../",
    "system-test": "mocha build/system-test --timeout 60000",
    "test": "c8 mocha build/test",
    "webpack": "webpack"
  },
  "types": "./build/src/index.d.ts",
  "version": "6.1.3"
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236735, function(require, module, exports) {

// Copyright 2013 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compute = void 0;
const arrify = require("arrify");
const gcpMetadata = require("gcp-metadata");
const oauth2client_1 = require("./oauth2client");
class Compute extends oauth2client_1.OAuth2Client {
    /**
     * Google Compute Engine service account credentials.
     *
     * Retrieve access token from the metadata server.
     * See: https://developers.google.com/compute/docs/authentication
     */
    constructor(options = {}) {
        super(options);
        // Start with an expired refresh token, which will automatically be
        // refreshed before the first API call is made.
        this.credentials = { expiry_date: 1, refresh_token: 'compute-placeholder' };
        this.serviceAccountEmail = options.serviceAccountEmail || 'default';
        this.scopes = arrify(options.scopes);
    }
    /**
     * Refreshes the access token.
     * @param refreshToken Unused parameter
     */
    async refreshTokenNoCache(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refreshToken) {
        const tokenPath = `service-accounts/${this.serviceAccountEmail}/token`;
        let data;
        try {
            const instanceOptions = {
                property: tokenPath,
            };
            if (this.scopes.length > 0) {
                instanceOptions.params = {
                    scopes: this.scopes.join(','),
                };
            }
            data = await gcpMetadata.instance(instanceOptions);
        }
        catch (e) {
            e.message = `Could not refresh access token: ${e.message}`;
            this.wrapError(e);
            throw e;
        }
        const tokens = data;
        if (data && data.expires_in) {
            tokens.expiry_date = new Date().getTime() + data.expires_in * 1000;
            delete tokens.expires_in;
        }
        this.emit('tokens', tokens);
        return { tokens, res: null };
    }
    /**
     * Fetches an ID token.
     * @param targetAudience the audience for the fetched ID token.
     */
    async fetchIdToken(targetAudience) {
        const idTokenPath = `service-accounts/${this.serviceAccountEmail}/identity` +
            `?format=full&audience=${targetAudience}`;
        let idToken;
        try {
            const instanceOptions = {
                property: idTokenPath,
            };
            idToken = await gcpMetadata.instance(instanceOptions);
        }
        catch (e) {
            e.message = `Could not fetch ID token: ${e.message}`;
            throw e;
        }
        return idToken;
    }
    wrapError(e) {
        const res = e.response;
        if (res && res.status) {
            e.code = res.status.toString();
            if (res.status === 403) {
                e.message =
                    'A Forbidden error was returned while attempting to retrieve an access ' +
                        'token for the Compute Engine built-in service account. This may be because the Compute ' +
                        'Engine instance does not have the correct permission scopes specified: ' +
                        e.message;
            }
            else if (res.status === 404) {
                e.message =
                    'A Not Found error was returned while attempting to retrieve an access' +
                        'token for the Compute Engine built-in service account. This may be because the Compute ' +
                        'Engine instance does not have any permission scopes specified: ' +
                        e.message;
            }
        }
    }
}
exports.Compute = Compute;
//# sourceMappingURL=computeclient.js.map
}, function(modId) { var map = {"./oauth2client":1608953236736}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236736, function(require, module, exports) {

// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Client = exports.CertificateFormat = exports.CodeChallengeMethod = void 0;
const querystring = require("querystring");
const stream = require("stream");
const formatEcdsa = require("ecdsa-sig-formatter");
const crypto_1 = require("../crypto/crypto");
const authclient_1 = require("./authclient");
const loginticket_1 = require("./loginticket");
var CodeChallengeMethod;
(function (CodeChallengeMethod) {
    CodeChallengeMethod["Plain"] = "plain";
    CodeChallengeMethod["S256"] = "S256";
})(CodeChallengeMethod = exports.CodeChallengeMethod || (exports.CodeChallengeMethod = {}));
var CertificateFormat;
(function (CertificateFormat) {
    CertificateFormat["PEM"] = "PEM";
    CertificateFormat["JWK"] = "JWK";
})(CertificateFormat = exports.CertificateFormat || (exports.CertificateFormat = {}));
class OAuth2Client extends authclient_1.AuthClient {
    constructor(optionsOrClientId, clientSecret, redirectUri) {
        super();
        this.certificateCache = {};
        this.certificateExpiry = null;
        this.certificateCacheFormat = CertificateFormat.PEM;
        this.refreshTokenPromises = new Map();
        const opts = optionsOrClientId && typeof optionsOrClientId === 'object'
            ? optionsOrClientId
            : { clientId: optionsOrClientId, clientSecret, redirectUri };
        this._clientId = opts.clientId;
        this._clientSecret = opts.clientSecret;
        this.redirectUri = opts.redirectUri;
        this.eagerRefreshThresholdMillis =
            opts.eagerRefreshThresholdMillis || 5 * 60 * 1000;
        this.forceRefreshOnFailure = !!opts.forceRefreshOnFailure;
    }
    /**
     * Generates URL for consent page landing.
     * @param opts Options.
     * @return URL to consent page.
     */
    generateAuthUrl(opts = {}) {
        if (opts.code_challenge_method && !opts.code_challenge) {
            throw new Error('If a code_challenge_method is provided, code_challenge must be included.');
        }
        opts.response_type = opts.response_type || 'code';
        opts.client_id = opts.client_id || this._clientId;
        opts.redirect_uri = opts.redirect_uri || this.redirectUri;
        // Allow scopes to be passed either as array or a string
        if (opts.scope instanceof Array) {
            opts.scope = opts.scope.join(' ');
        }
        const rootUrl = OAuth2Client.GOOGLE_OAUTH2_AUTH_BASE_URL_;
        return rootUrl + '?' + querystring.stringify(opts);
    }
    generateCodeVerifier() {
        // To make the code compatible with browser SubtleCrypto we need to make
        // this method async.
        throw new Error('generateCodeVerifier is removed, please use generateCodeVerifierAsync instead.');
    }
    /**
     * Convenience method to automatically generate a code_verifier, and its
     * resulting SHA256. If used, this must be paired with a S256
     * code_challenge_method.
     *
     * For a full example see:
     * https://github.com/googleapis/google-auth-library-nodejs/blob/master/samples/oauth2-codeVerifier.js
     */
    async generateCodeVerifierAsync() {
        // base64 encoding uses 6 bits per character, and we want to generate128
        // characters. 6*128/8 = 96.
        const crypto = crypto_1.createCrypto();
        const randomString = crypto.randomBytesBase64(96);
        // The valid characters in the code_verifier are [A-Z]/[a-z]/[0-9]/
        // "-"/"."/"_"/"~". Base64 encoded strings are pretty close, so we're just
        // swapping out a few chars.
        const codeVerifier = randomString
            .replace(/\+/g, '~')
            .replace(/=/g, '_')
            .replace(/\//g, '-');
        // Generate the base64 encoded SHA256
        const unencodedCodeChallenge = await crypto.sha256DigestBase64(codeVerifier);
        // We need to use base64UrlEncoding instead of standard base64
        const codeChallenge = unencodedCodeChallenge
            .split('=')[0]
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
        return { codeVerifier, codeChallenge };
    }
    getToken(codeOrOptions, callback) {
        const options = typeof codeOrOptions === 'string' ? { code: codeOrOptions } : codeOrOptions;
        if (callback) {
            this.getTokenAsync(options).then(r => callback(null, r.tokens, r.res), e => callback(e, null, e.response));
        }
        else {
            return this.getTokenAsync(options);
        }
    }
    async getTokenAsync(options) {
        const url = OAuth2Client.GOOGLE_OAUTH2_TOKEN_URL_;
        const values = {
            code: options.code,
            client_id: options.client_id || this._clientId,
            client_secret: this._clientSecret,
            redirect_uri: options.redirect_uri || this.redirectUri,
            grant_type: 'authorization_code',
            code_verifier: options.codeVerifier,
        };
        const res = await this.transporter.request({
            method: 'POST',
            url,
            data: querystring.stringify(values),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const tokens = res.data;
        if (res.data && res.data.expires_in) {
            tokens.expiry_date = new Date().getTime() + res.data.expires_in * 1000;
            delete tokens.expires_in;
        }
        this.emit('tokens', tokens);
        return { tokens, res };
    }
    /**
     * Refreshes the access token.
     * @param refresh_token Existing refresh token.
     * @private
     */
    async refreshToken(refreshToken) {
        if (!refreshToken) {
            return this.refreshTokenNoCache(refreshToken);
        }
        // If a request to refresh using the same token has started,
        // return the same promise.
        if (this.refreshTokenPromises.has(refreshToken)) {
            return this.refreshTokenPromises.get(refreshToken);
        }
        const p = this.refreshTokenNoCache(refreshToken).then(r => {
            this.refreshTokenPromises.delete(refreshToken);
            return r;
        }, e => {
            this.refreshTokenPromises.delete(refreshToken);
            throw e;
        });
        this.refreshTokenPromises.set(refreshToken, p);
        return p;
    }
    async refreshTokenNoCache(refreshToken) {
        if (!refreshToken) {
            throw new Error('No refresh token is set.');
        }
        const url = OAuth2Client.GOOGLE_OAUTH2_TOKEN_URL_;
        const data = {
            refresh_token: refreshToken,
            client_id: this._clientId,
            client_secret: this._clientSecret,
            grant_type: 'refresh_token',
        };
        // request for new token
        const res = await this.transporter.request({
            method: 'POST',
            url,
            data: querystring.stringify(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const tokens = res.data;
        // TODO: de-duplicate this code from a few spots
        if (res.data && res.data.expires_in) {
            tokens.expiry_date = new Date().getTime() + res.data.expires_in * 1000;
            delete tokens.expires_in;
        }
        this.emit('tokens', tokens);
        return { tokens, res };
    }
    refreshAccessToken(callback) {
        if (callback) {
            this.refreshAccessTokenAsync().then(r => callback(null, r.credentials, r.res), callback);
        }
        else {
            return this.refreshAccessTokenAsync();
        }
    }
    async refreshAccessTokenAsync() {
        const r = await this.refreshToken(this.credentials.refresh_token);
        const tokens = r.tokens;
        tokens.refresh_token = this.credentials.refresh_token;
        this.credentials = tokens;
        return { credentials: this.credentials, res: r.res };
    }
    getAccessToken(callback) {
        if (callback) {
            this.getAccessTokenAsync().then(r => callback(null, r.token, r.res), callback);
        }
        else {
            return this.getAccessTokenAsync();
        }
    }
    async getAccessTokenAsync() {
        const shouldRefresh = !this.credentials.access_token || this.isTokenExpiring();
        if (shouldRefresh) {
            if (!this.credentials.refresh_token) {
                throw new Error('No refresh token is set.');
            }
            const r = await this.refreshAccessTokenAsync();
            if (!r.credentials || (r.credentials && !r.credentials.access_token)) {
                throw new Error('Could not refresh access token.');
            }
            return { token: r.credentials.access_token, res: r.res };
        }
        else {
            return { token: this.credentials.access_token };
        }
    }
    /**
     * The main authentication interface.  It takes an optional url which when
     * present is the endpoint being accessed, and returns a Promise which
     * resolves with authorization header fields.
     *
     * In OAuth2Client, the result has the form:
     * { Authorization: 'Bearer <access_token_value>' }
     * @param url The optional url being authorized
     */
    async getRequestHeaders(url) {
        const headers = (await this.getRequestMetadataAsync(url)).headers;
        return headers;
    }
    async getRequestMetadataAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    url) {
        const thisCreds = this.credentials;
        if (!thisCreds.access_token && !thisCreds.refresh_token && !this.apiKey) {
            throw new Error('No access, refresh token or API key is set.');
        }
        if (thisCreds.access_token && !this.isTokenExpiring()) {
            thisCreds.token_type = thisCreds.token_type || 'Bearer';
            const headers = {
                Authorization: thisCreds.token_type + ' ' + thisCreds.access_token,
            };
            return { headers };
        }
        if (this.apiKey) {
            return { headers: { 'X-Goog-Api-Key': this.apiKey } };
        }
        let r = null;
        let tokens = null;
        try {
            r = await this.refreshToken(thisCreds.refresh_token);
            tokens = r.tokens;
        }
        catch (err) {
            const e = err;
            if (e.response &&
                (e.response.status === 403 || e.response.status === 404)) {
                e.message = `Could not refresh access token: ${e.message}`;
            }
            throw e;
        }
        const credentials = this.credentials;
        credentials.token_type = credentials.token_type || 'Bearer';
        tokens.refresh_token = credentials.refresh_token;
        this.credentials = tokens;
        const headers = {
            Authorization: credentials.token_type + ' ' + tokens.access_token,
        };
        return { headers: this.addSharedMetadataHeaders(headers), res: r.res };
    }
    /**
     * Generates an URL to revoke the given token.
     * @param token The existing token to be revoked.
     */
    static getRevokeTokenUrl(token) {
        const parameters = querystring.stringify({ token });
        return `${OAuth2Client.GOOGLE_OAUTH2_REVOKE_URL_}?${parameters}`;
    }
    revokeToken(token, callback) {
        const opts = {
            url: OAuth2Client.getRevokeTokenUrl(token),
            method: 'POST',
        };
        if (callback) {
            this.transporter
                .request(opts)
                .then(r => callback(null, r), callback);
        }
        else {
            return this.transporter.request(opts);
        }
    }
    revokeCredentials(callback) {
        if (callback) {
            this.revokeCredentialsAsync().then(res => callback(null, res), callback);
        }
        else {
            return this.revokeCredentialsAsync();
        }
    }
    async revokeCredentialsAsync() {
        const token = this.credentials.access_token;
        this.credentials = {};
        if (token) {
            return this.revokeToken(token);
        }
        else {
            throw new Error('No access token to revoke.');
        }
    }
    request(opts, callback) {
        if (callback) {
            this.requestAsync(opts).then(r => callback(null, r), e => {
                return callback(e, e.response);
            });
        }
        else {
            return this.requestAsync(opts);
        }
    }
    async requestAsync(opts, retry = false) {
        let r2;
        try {
            const r = await this.getRequestMetadataAsync(opts.url);
            opts.headers = opts.headers || {};
            if (r.headers && r.headers['x-goog-user-project']) {
                opts.headers['x-goog-user-project'] = r.headers['x-goog-user-project'];
            }
            if (r.headers && r.headers.Authorization) {
                opts.headers.Authorization = r.headers.Authorization;
            }
            if (this.apiKey) {
                opts.headers['X-Goog-Api-Key'] = this.apiKey;
            }
            r2 = await this.transporter.request(opts);
        }
        catch (e) {
            const res = e.response;
            if (res) {
                const statusCode = res.status;
                // Retry the request for metadata if the following criteria are true:
                // - We haven't already retried.  It only makes sense to retry once.
                // - The response was a 401 or a 403
                // - The request didn't send a readableStream
                // - An access_token and refresh_token were available, but either no
                //   expiry_date was available or the forceRefreshOnFailure flag is set.
                //   The absent expiry_date case can happen when developers stash the
                //   access_token and refresh_token for later use, but the access_token
                //   fails on the first try because it's expired. Some developers may
                //   choose to enable forceRefreshOnFailure to mitigate time-related
                //   errors.
                const mayRequireRefresh = this.credentials &&
                    this.credentials.access_token &&
                    this.credentials.refresh_token &&
                    (!this.credentials.expiry_date || this.forceRefreshOnFailure);
                const isReadableStream = res.config.data instanceof stream.Readable;
                const isAuthErr = statusCode === 401 || statusCode === 403;
                if (!retry && isAuthErr && !isReadableStream && mayRequireRefresh) {
                    await this.refreshAccessTokenAsync();
                    return this.requestAsync(opts, true);
                }
            }
            throw e;
        }
        return r2;
    }
    verifyIdToken(options, callback) {
        // This function used to accept two arguments instead of an options object.
        // Check the types to help users upgrade with less pain.
        // This check can be removed after a 2.0 release.
        if (callback && typeof callback !== 'function') {
            throw new Error('This method accepts an options object as the first parameter, which includes the idToken, audience, and maxExpiry.');
        }
        if (callback) {
            this.verifyIdTokenAsync(options).then(r => callback(null, r), callback);
        }
        else {
            return this.verifyIdTokenAsync(options);
        }
    }
    async verifyIdTokenAsync(options) {
        if (!options.idToken) {
            throw new Error('The verifyIdToken method requires an ID Token');
        }
        const response = await this.getFederatedSignonCertsAsync();
        const login = await this.verifySignedJwtWithCertsAsync(options.idToken, response.certs, options.audience, OAuth2Client.ISSUERS_, options.maxExpiry);
        return login;
    }
    /**
     * Obtains information about the provisioned access token.  Especially useful
     * if you want to check the scopes that were provisioned to a given token.
     *
     * @param accessToken Required.  The Access Token for which you want to get
     * user info.
     */
    async getTokenInfo(accessToken) {
        const { data } = await this.transporter.request({
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            url: OAuth2Client.GOOGLE_TOKEN_INFO_URL,
            data: querystring.stringify({ access_token: accessToken }),
        });
        const info = Object.assign({
            expiry_date: new Date().getTime() + data.expires_in * 1000,
            scopes: data.scope.split(' '),
        }, data);
        delete info.expires_in;
        delete info.scope;
        return info;
    }
    getFederatedSignonCerts(callback) {
        if (callback) {
            this.getFederatedSignonCertsAsync().then(r => callback(null, r.certs, r.res), callback);
        }
        else {
            return this.getFederatedSignonCertsAsync();
        }
    }
    async getFederatedSignonCertsAsync() {
        const nowTime = new Date().getTime();
        const format = crypto_1.hasBrowserCrypto()
            ? CertificateFormat.JWK
            : CertificateFormat.PEM;
        if (this.certificateExpiry &&
            nowTime < this.certificateExpiry.getTime() &&
            this.certificateCacheFormat === format) {
            return { certs: this.certificateCache, format };
        }
        let res;
        let url;
        switch (format) {
            case CertificateFormat.PEM:
                url = OAuth2Client.GOOGLE_OAUTH2_FEDERATED_SIGNON_PEM_CERTS_URL_;
                break;
            case CertificateFormat.JWK:
                url = OAuth2Client.GOOGLE_OAUTH2_FEDERATED_SIGNON_JWK_CERTS_URL_;
                break;
            default:
                throw new Error(`Unsupported certificate format ${format}`);
        }
        try {
            res = await this.transporter.request({ url });
        }
        catch (e) {
            e.message = `Failed to retrieve verification certificates: ${e.message}`;
            throw e;
        }
        const cacheControl = res ? res.headers['cache-control'] : undefined;
        let cacheAge = -1;
        if (cacheControl) {
            const pattern = new RegExp('max-age=([0-9]*)');
            const regexResult = pattern.exec(cacheControl);
            if (regexResult && regexResult.length === 2) {
                // Cache results with max-age (in seconds)
                cacheAge = Number(regexResult[1]) * 1000; // milliseconds
            }
        }
        let certificates = {};
        switch (format) {
            case CertificateFormat.PEM:
                certificates = res.data;
                break;
            case CertificateFormat.JWK:
                for (const key of res.data.keys) {
                    certificates[key.kid] = key;
                }
                break;
            default:
                throw new Error(`Unsupported certificate format ${format}`);
        }
        const now = new Date();
        this.certificateExpiry =
            cacheAge === -1 ? null : new Date(now.getTime() + cacheAge);
        this.certificateCache = certificates;
        this.certificateCacheFormat = format;
        return { certs: certificates, format, res };
    }
    getIapPublicKeys(callback) {
        if (callback) {
            this.getIapPublicKeysAsync().then(r => callback(null, r.pubkeys, r.res), callback);
        }
        else {
            return this.getIapPublicKeysAsync();
        }
    }
    async getIapPublicKeysAsync() {
        let res;
        const url = OAuth2Client.GOOGLE_OAUTH2_IAP_PUBLIC_KEY_URL_;
        try {
            res = await this.transporter.request({ url });
        }
        catch (e) {
            e.message = `Failed to retrieve verification certificates: ${e.message}`;
            throw e;
        }
        return { pubkeys: res.data, res };
    }
    verifySignedJwtWithCerts() {
        // To make the code compatible with browser SubtleCrypto we need to make
        // this method async.
        throw new Error('verifySignedJwtWithCerts is removed, please use verifySignedJwtWithCertsAsync instead.');
    }
    /**
     * Verify the id token is signed with the correct certificate
     * and is from the correct audience.
     * @param jwt The jwt to verify (The ID Token in this case).
     * @param certs The array of certs to test the jwt against.
     * @param requiredAudience The audience to test the jwt against.
     * @param issuers The allowed issuers of the jwt (Optional).
     * @param maxExpiry The max expiry the certificate can be (Optional).
     * @return Returns a promise resolving to LoginTicket on verification.
     */
    async verifySignedJwtWithCertsAsync(jwt, certs, requiredAudience, issuers, maxExpiry) {
        const crypto = crypto_1.createCrypto();
        if (!maxExpiry) {
            maxExpiry = OAuth2Client.MAX_TOKEN_LIFETIME_SECS_;
        }
        const segments = jwt.split('.');
        if (segments.length !== 3) {
            throw new Error('Wrong number of segments in token: ' + jwt);
        }
        const signed = segments[0] + '.' + segments[1];
        let signature = segments[2];
        let envelope;
        let payload;
        try {
            envelope = JSON.parse(crypto.decodeBase64StringUtf8(segments[0]));
        }
        catch (err) {
            err.message = `Can't parse token envelope: ${segments[0]}': ${err.message}`;
            throw err;
        }
        if (!envelope) {
            throw new Error("Can't parse token envelope: " + segments[0]);
        }
        try {
            payload = JSON.parse(crypto.decodeBase64StringUtf8(segments[1]));
        }
        catch (err) {
            err.message = `Can't parse token payload '${segments[0]}`;
            throw err;
        }
        if (!payload) {
            throw new Error("Can't parse token payload: " + segments[1]);
        }
        if (!Object.prototype.hasOwnProperty.call(certs, envelope.kid)) {
            // If this is not present, then there's no reason to attempt verification
            throw new Error('No pem found for envelope: ' + JSON.stringify(envelope));
        }
        const cert = certs[envelope.kid];
        if (envelope.alg === 'ES256') {
            signature = formatEcdsa.joseToDer(signature, 'ES256').toString('base64');
        }
        const verified = await crypto.verify(cert, signed, signature);
        if (!verified) {
            throw new Error('Invalid token signature: ' + jwt);
        }
        if (!payload.iat) {
            throw new Error('No issue time in token: ' + JSON.stringify(payload));
        }
        if (!payload.exp) {
            throw new Error('No expiration time in token: ' + JSON.stringify(payload));
        }
        const iat = Number(payload.iat);
        if (isNaN(iat))
            throw new Error('iat field using invalid format');
        const exp = Number(payload.exp);
        if (isNaN(exp))
            throw new Error('exp field using invalid format');
        const now = new Date().getTime() / 1000;
        if (exp >= now + maxExpiry) {
            throw new Error('Expiration time too far in future: ' + JSON.stringify(payload));
        }
        const earliest = iat - OAuth2Client.CLOCK_SKEW_SECS_;
        const latest = exp + OAuth2Client.CLOCK_SKEW_SECS_;
        if (now < earliest) {
            throw new Error('Token used too early, ' +
                now +
                ' < ' +
                earliest +
                ': ' +
                JSON.stringify(payload));
        }
        if (now > latest) {
            throw new Error('Token used too late, ' +
                now +
                ' > ' +
                latest +
                ': ' +
                JSON.stringify(payload));
        }
        if (issuers && issuers.indexOf(payload.iss) < 0) {
            throw new Error('Invalid issuer, expected one of [' +
                issuers +
                '], but got ' +
                payload.iss);
        }
        // Check the audience matches if we have one
        if (typeof requiredAudience !== 'undefined' && requiredAudience !== null) {
            const aud = payload.aud;
            let audVerified = false;
            // If the requiredAudience is an array, check if it contains token
            // audience
            if (requiredAudience.constructor === Array) {
                audVerified = requiredAudience.indexOf(aud) > -1;
            }
            else {
                audVerified = aud === requiredAudience;
            }
            if (!audVerified) {
                throw new Error('Wrong recipient, payload audience != requiredAudience');
            }
        }
        return new loginticket_1.LoginTicket(envelope, payload);
    }
    /**
     * Returns true if a token is expired or will expire within
     * eagerRefreshThresholdMillismilliseconds.
     * If there is no expiry time, assumes the token is not expired or expiring.
     */
    isTokenExpiring() {
        const expiryDate = this.credentials.expiry_date;
        return expiryDate
            ? expiryDate <= new Date().getTime() + this.eagerRefreshThresholdMillis
            : false;
    }
}
exports.OAuth2Client = OAuth2Client;
OAuth2Client.GOOGLE_TOKEN_INFO_URL = 'https://oauth2.googleapis.com/tokeninfo';
/**
 * The base URL for auth endpoints.
 */
OAuth2Client.GOOGLE_OAUTH2_AUTH_BASE_URL_ = 'https://accounts.google.com/o/oauth2/v2/auth';
/**
 * The base endpoint for token retrieval.
 */
OAuth2Client.GOOGLE_OAUTH2_TOKEN_URL_ = 'https://oauth2.googleapis.com/token';
/**
 * The base endpoint to revoke tokens.
 */
OAuth2Client.GOOGLE_OAUTH2_REVOKE_URL_ = 'https://oauth2.googleapis.com/revoke';
/**
 * Google Sign on certificates in PEM format.
 */
OAuth2Client.GOOGLE_OAUTH2_FEDERATED_SIGNON_PEM_CERTS_URL_ = 'https://www.googleapis.com/oauth2/v1/certs';
/**
 * Google Sign on certificates in JWK format.
 */
OAuth2Client.GOOGLE_OAUTH2_FEDERATED_SIGNON_JWK_CERTS_URL_ = 'https://www.googleapis.com/oauth2/v3/certs';
/**
 * Google Sign on certificates in JWK format.
 */
OAuth2Client.GOOGLE_OAUTH2_IAP_PUBLIC_KEY_URL_ = 'https://www.gstatic.com/iap/verify/public_key';
/**
 * Clock skew - five minutes in seconds
 */
OAuth2Client.CLOCK_SKEW_SECS_ = 300;
/**
 * Max Token Lifetime is one day in seconds
 */
OAuth2Client.MAX_TOKEN_LIFETIME_SECS_ = 86400;
/**
 * The allowed oauth token issuers.
 */
OAuth2Client.ISSUERS_ = [
    'accounts.google.com',
    'https://accounts.google.com',
];
//# sourceMappingURL=oauth2client.js.map
}, function(modId) { var map = {"../crypto/crypto":1608953236729,"./authclient":1608953236737,"./loginticket":1608953236738}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236737, function(require, module, exports) {

// Copyright 2012 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthClient = void 0;
const events_1 = require("events");
const transporters_1 = require("../transporters");
class AuthClient extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.transporter = new transporters_1.DefaultTransporter();
        this.credentials = {};
    }
    /**
     * Sets the auth credentials.
     */
    setCredentials(credentials) {
        this.credentials = credentials;
    }
    /**
     * Append additional headers, e.g., x-goog-user-project, shared across the
     * classes inheriting AuthClient. This method should be used by any method
     * that overrides getRequestMetadataAsync(), which is a shared helper for
     * setting request information in both gRPC and HTTP API calls.
     *
     * @param headers objedcdt to append additional headers to.
     */
    addSharedMetadataHeaders(headers) {
        // quota_project_id, stored in application_default_credentials.json, is set in
        // the x-goog-user-project header, to indicate an alternate account for
        // billing and quota:
        if (!headers['x-goog-user-project'] && // don't override a value the user sets.
            this.quotaProjectId) {
            headers['x-goog-user-project'] = this.quotaProjectId;
        }
        return headers;
    }
}
exports.AuthClient = AuthClient;
//# sourceMappingURL=authclient.js.map
}, function(modId) { var map = {"../transporters":1608953236732}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236738, function(require, module, exports) {

// Copyright 2014 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginTicket = void 0;
class LoginTicket {
    /**
     * Create a simple class to extract user ID from an ID Token
     *
     * @param {string} env Envelope of the jwt
     * @param {TokenPayload} pay Payload of the jwt
     * @constructor
     */
    constructor(env, pay) {
        this.envelope = env;
        this.payload = pay;
    }
    getEnvelope() {
        return this.envelope;
    }
    getPayload() {
        return this.payload;
    }
    /**
     * Create a simple class to extract user ID from an ID Token
     *
     * @return The user ID
     */
    getUserId() {
        const payload = this.getPayload();
        if (payload && payload.sub) {
            return payload.sub;
        }
        return null;
    }
    /**
     * Returns attributes from the login ticket.  This can contain
     * various information about the user session.
     *
     * @return The envelope and payload
     */
    getAttributes() {
        return { envelope: this.getEnvelope(), payload: this.getPayload() };
    }
}
exports.LoginTicket = LoginTicket;
//# sourceMappingURL=loginticket.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236739, function(require, module, exports) {

// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdTokenClient = void 0;
const oauth2client_1 = require("./oauth2client");
class IdTokenClient extends oauth2client_1.OAuth2Client {
    /**
     * Google ID Token client
     *
     * Retrieve access token from the metadata server.
     * See: https://developers.google.com/compute/docs/authentication
     */
    constructor(options) {
        super();
        this.targetAudience = options.targetAudience;
        this.idTokenProvider = options.idTokenProvider;
    }
    async getRequestMetadataAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    url) {
        if (!this.credentials.id_token ||
            (this.credentials.expiry_date || 0) < Date.now()) {
            const idToken = await this.idTokenProvider.fetchIdToken(this.targetAudience);
            this.credentials = {
                id_token: idToken,
                expiry_date: this.getIdTokenExpiryDate(idToken),
            };
        }
        const headers = {
            Authorization: 'Bearer ' + this.credentials.id_token,
        };
        return { headers };
    }
    getIdTokenExpiryDate(idToken) {
        const payloadB64 = idToken.split('.')[1];
        if (payloadB64) {
            const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('ascii'));
            return payload.exp * 1000;
        }
    }
}
exports.IdTokenClient = IdTokenClient;
//# sourceMappingURL=idtokenclient.js.map
}, function(modId) { var map = {"./oauth2client":1608953236736}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236740, function(require, module, exports) {

// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = exports.clear = exports.GCPEnv = void 0;
const gcpMetadata = require("gcp-metadata");
var GCPEnv;
(function (GCPEnv) {
    GCPEnv["APP_ENGINE"] = "APP_ENGINE";
    GCPEnv["KUBERNETES_ENGINE"] = "KUBERNETES_ENGINE";
    GCPEnv["CLOUD_FUNCTIONS"] = "CLOUD_FUNCTIONS";
    GCPEnv["COMPUTE_ENGINE"] = "COMPUTE_ENGINE";
    GCPEnv["NONE"] = "NONE";
})(GCPEnv = exports.GCPEnv || (exports.GCPEnv = {}));
let envPromise;
function clear() {
    envPromise = undefined;
}
exports.clear = clear;
async function getEnv() {
    if (envPromise) {
        return envPromise;
    }
    envPromise = getEnvMemoized();
    return envPromise;
}
exports.getEnv = getEnv;
async function getEnvMemoized() {
    let env = GCPEnv.NONE;
    if (isAppEngine()) {
        env = GCPEnv.APP_ENGINE;
    }
    else if (isCloudFunction()) {
        env = GCPEnv.CLOUD_FUNCTIONS;
    }
    else if (await isComputeEngine()) {
        if (await isKubernetesEngine()) {
            env = GCPEnv.KUBERNETES_ENGINE;
        }
        else {
            env = GCPEnv.COMPUTE_ENGINE;
        }
    }
    else {
        env = GCPEnv.NONE;
    }
    return env;
}
function isAppEngine() {
    return !!(process.env.GAE_SERVICE || process.env.GAE_MODULE_NAME);
}
function isCloudFunction() {
    return !!(process.env.FUNCTION_NAME || process.env.FUNCTION_TARGET);
}
async function isKubernetesEngine() {
    try {
        await gcpMetadata.instance('attributes/cluster-name');
        return true;
    }
    catch (e) {
        return false;
    }
}
async function isComputeEngine() {
    return gcpMetadata.isAvailable();
}
//# sourceMappingURL=envDetect.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236741, function(require, module, exports) {

// Copyright 2013 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = void 0;
const gtoken_1 = require("gtoken");
const jwtaccess_1 = require("./jwtaccess");
const oauth2client_1 = require("./oauth2client");
class JWT extends oauth2client_1.OAuth2Client {
    constructor(optionsOrEmail, keyFile, key, scopes, subject, keyId) {
        const opts = optionsOrEmail && typeof optionsOrEmail === 'object'
            ? optionsOrEmail
            : { email: optionsOrEmail, keyFile, key, keyId, scopes, subject };
        super({
            eagerRefreshThresholdMillis: opts.eagerRefreshThresholdMillis,
            forceRefreshOnFailure: opts.forceRefreshOnFailure,
        });
        this.email = opts.email;
        this.keyFile = opts.keyFile;
        this.key = opts.key;
        this.keyId = opts.keyId;
        this.scopes = opts.scopes;
        this.subject = opts.subject;
        this.additionalClaims = opts.additionalClaims;
        this.credentials = { refresh_token: 'jwt-placeholder', expiry_date: 1 };
    }
    /**
     * Creates a copy of the credential with the specified scopes.
     * @param scopes List of requested scopes or a single scope.
     * @return The cloned instance.
     */
    createScoped(scopes) {
        return new JWT({
            email: this.email,
            keyFile: this.keyFile,
            key: this.key,
            keyId: this.keyId,
            scopes,
            subject: this.subject,
            additionalClaims: this.additionalClaims,
        });
    }
    /**
     * Obtains the metadata to be sent with the request.
     *
     * @param url the URI being authorized.
     */
    async getRequestMetadataAsync(url) {
        if (!this.apiKey && !this.hasUserScopes() && url) {
            if (this.additionalClaims &&
                this.additionalClaims.target_audience) {
                const { tokens } = await this.refreshToken();
                return {
                    headers: this.addSharedMetadataHeaders({
                        Authorization: `Bearer ${tokens.id_token}`,
                    }),
                };
            }
            else {
                // no scopes have been set, but a uri has been provided. Use JWTAccess
                // credentials.
                if (!this.access) {
                    this.access = new jwtaccess_1.JWTAccess(this.email, this.key, this.keyId, this.eagerRefreshThresholdMillis);
                }
                const headers = await this.access.getRequestHeaders(url, this.additionalClaims);
                return { headers: this.addSharedMetadataHeaders(headers) };
            }
        }
        else if (this.hasAnyScopes() || this.apiKey) {
            return super.getRequestMetadataAsync(url);
        }
        else {
            // If no audience, apiKey, or scopes are provided, we should not attempt
            // to populate any headers:
            return { headers: {} };
        }
    }
    /**
     * Fetches an ID token.
     * @param targetAudience the audience for the fetched ID token.
     */
    async fetchIdToken(targetAudience) {
        // Create a new gToken for fetching an ID token
        const gtoken = new gtoken_1.GoogleToken({
            iss: this.email,
            sub: this.subject,
            scope: this.scopes || this.defaultScopes,
            keyFile: this.keyFile,
            key: this.key,
            additionalClaims: { target_audience: targetAudience },
        });
        await gtoken.getToken({
            forceRefresh: true,
        });
        if (!gtoken.idToken) {
            throw new Error('Unknown error: Failed to fetch ID token');
        }
        return gtoken.idToken;
    }
    /**
     * Determine if there are currently scopes available.
     */
    hasUserScopes() {
        if (!this.scopes) {
            return false;
        }
        return this.scopes.length > 0;
    }
    /**
     * Are there any default or user scopes defined.
     */
    hasAnyScopes() {
        if (this.scopes && this.scopes.length > 0)
            return true;
        if (this.defaultScopes && this.defaultScopes.length > 0)
            return true;
        return false;
    }
    authorize(callback) {
        if (callback) {
            this.authorizeAsync().then(r => callback(null, r), callback);
        }
        else {
            return this.authorizeAsync();
        }
    }
    async authorizeAsync() {
        const result = await this.refreshToken();
        if (!result) {
            throw new Error('No result returned');
        }
        this.credentials = result.tokens;
        this.credentials.refresh_token = 'jwt-placeholder';
        this.key = this.gtoken.key;
        this.email = this.gtoken.iss;
        return result.tokens;
    }
    /**
     * Refreshes the access token.
     * @param refreshToken ignored
     * @private
     */
    async refreshTokenNoCache(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refreshToken) {
        const gtoken = this.createGToken();
        const token = await gtoken.getToken({
            forceRefresh: this.isTokenExpiring(),
        });
        const tokens = {
            access_token: token.access_token,
            token_type: 'Bearer',
            expiry_date: gtoken.expiresAt,
            id_token: gtoken.idToken,
        };
        this.emit('tokens', tokens);
        return { res: null, tokens };
    }
    /**
     * Create a gToken if it doesn't already exist.
     */
    createGToken() {
        if (!this.gtoken) {
            this.gtoken = new gtoken_1.GoogleToken({
                iss: this.email,
                sub: this.subject,
                scope: this.scopes || this.defaultScopes,
                keyFile: this.keyFile,
                key: this.key,
                additionalClaims: this.additionalClaims,
            });
        }
        return this.gtoken;
    }
    /**
     * Create a JWT credentials instance using the given input options.
     * @param json The input object.
     */
    fromJSON(json) {
        if (!json) {
            throw new Error('Must pass in a JSON object containing the service account auth settings.');
        }
        if (!json.client_email) {
            throw new Error('The incoming JSON object does not contain a client_email field');
        }
        if (!json.private_key) {
            throw new Error('The incoming JSON object does not contain a private_key field');
        }
        // Extract the relevant information from the json key file.
        this.email = json.client_email;
        this.key = json.private_key;
        this.keyId = json.private_key_id;
        this.projectId = json.project_id;
        this.quotaProjectId = json.quota_project_id;
    }
    fromStream(inputStream, callback) {
        if (callback) {
            this.fromStreamAsync(inputStream).then(() => callback(), callback);
        }
        else {
            return this.fromStreamAsync(inputStream);
        }
    }
    fromStreamAsync(inputStream) {
        return new Promise((resolve, reject) => {
            if (!inputStream) {
                throw new Error('Must pass in a stream containing the service account auth settings.');
            }
            let s = '';
            inputStream
                .setEncoding('utf8')
                .on('error', reject)
                .on('data', chunk => (s += chunk))
                .on('end', () => {
                try {
                    const data = JSON.parse(s);
                    this.fromJSON(data);
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    /**
     * Creates a JWT credentials instance using an API Key for authentication.
     * @param apiKey The API Key in string form.
     */
    fromAPIKey(apiKey) {
        if (typeof apiKey !== 'string') {
            throw new Error('Must provide an API Key string.');
        }
        this.apiKey = apiKey;
    }
    /**
     * Using the key or keyFile on the JWT client, obtain an object that contains
     * the key and the client email.
     */
    async getCredentials() {
        if (this.key) {
            return { private_key: this.key, client_email: this.email };
        }
        else if (this.keyFile) {
            const gtoken = this.createGToken();
            const creds = await gtoken.getCredentials(this.keyFile);
            return { private_key: creds.privateKey, client_email: creds.clientEmail };
        }
        throw new Error('A key or a keyFile must be provided to getCredentials.');
    }
}
exports.JWT = JWT;
//# sourceMappingURL=jwtclient.js.map
}, function(modId) { var map = {"./jwtaccess":1608953236742,"./oauth2client":1608953236736}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236742, function(require, module, exports) {

// Copyright 2015 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTAccess = void 0;
const jws = require("jws");
const LRU = require("lru-cache");
const DEFAULT_HEADER = {
    alg: 'RS256',
    typ: 'JWT',
};
class JWTAccess {
    /**
     * JWTAccess service account credentials.
     *
     * Create a new access token by using the credential to create a new JWT token
     * that's recognized as the access token.
     *
     * @param email the service account email address.
     * @param key the private key that will be used to sign the token.
     * @param keyId the ID of the private key used to sign the token.
     */
    constructor(email, key, keyId, eagerRefreshThresholdMillis) {
        this.cache = new LRU({
            max: 500,
            maxAge: 60 * 60 * 1000,
        });
        this.email = email;
        this.key = key;
        this.keyId = keyId;
        this.eagerRefreshThresholdMillis = eagerRefreshThresholdMillis !== null && eagerRefreshThresholdMillis !== void 0 ? eagerRefreshThresholdMillis : 5 * 60 * 1000;
    }
    /**
     * Get a non-expired access token, after refreshing if necessary.
     *
     * @param url The URI being authorized.
     * @param additionalClaims An object with a set of additional claims to
     * include in the payload.
     * @returns An object that includes the authorization header.
     */
    getRequestHeaders(url, additionalClaims) {
        // Return cached authorization headers, unless we are within
        // eagerRefreshThresholdMillis ms of them expiring:
        const cachedToken = this.cache.get(url);
        const now = Date.now();
        if (cachedToken &&
            cachedToken.expiration - now > this.eagerRefreshThresholdMillis) {
            return cachedToken.headers;
        }
        const iat = Math.floor(Date.now() / 1000);
        const exp = JWTAccess.getExpirationTime(iat);
        // The payload used for signed JWT headers has:
        // iss == sub == <client email>
        // aud == <the authorization uri>
        const defaultClaims = {
            iss: this.email,
            sub: this.email,
            aud: url,
            exp,
            iat,
        };
        // if additionalClaims are provided, ensure they do not collide with
        // other required claims.
        if (additionalClaims) {
            for (const claim in defaultClaims) {
                if (additionalClaims[claim]) {
                    throw new Error(`The '${claim}' property is not allowed when passing additionalClaims. This claim is included in the JWT by default.`);
                }
            }
        }
        const header = this.keyId
            ? { ...DEFAULT_HEADER, kid: this.keyId }
            : DEFAULT_HEADER;
        const payload = Object.assign(defaultClaims, additionalClaims);
        // Sign the jwt and add it to the cache
        const signedJWT = jws.sign({ header, payload, secret: this.key });
        const headers = { Authorization: `Bearer ${signedJWT}` };
        this.cache.set(url, {
            expiration: exp * 1000,
            headers,
        });
        return headers;
    }
    /**
     * Returns an expiration time for the JWT token.
     *
     * @param iat The issued at time for the JWT.
     * @returns An expiration time for the JWT.
     */
    static getExpirationTime(iat) {
        const exp = iat + 3600; // 3600 seconds = 1 hour
        return exp;
    }
    /**
     * Create a JWTAccess credentials instance using the given input options.
     * @param json The input object.
     */
    fromJSON(json) {
        if (!json) {
            throw new Error('Must pass in a JSON object containing the service account auth settings.');
        }
        if (!json.client_email) {
            throw new Error('The incoming JSON object does not contain a client_email field');
        }
        if (!json.private_key) {
            throw new Error('The incoming JSON object does not contain a private_key field');
        }
        // Extract the relevant information from the json key file.
        this.email = json.client_email;
        this.key = json.private_key;
        this.keyId = json.private_key_id;
        this.projectId = json.project_id;
    }
    fromStream(inputStream, callback) {
        if (callback) {
            this.fromStreamAsync(inputStream).then(() => callback(), callback);
        }
        else {
            return this.fromStreamAsync(inputStream);
        }
    }
    fromStreamAsync(inputStream) {
        return new Promise((resolve, reject) => {
            if (!inputStream) {
                reject(new Error('Must pass in a stream containing the service account auth settings.'));
            }
            let s = '';
            inputStream
                .setEncoding('utf8')
                .on('data', chunk => (s += chunk))
                .on('error', reject)
                .on('end', () => {
                try {
                    const data = JSON.parse(s);
                    this.fromJSON(data);
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
}
exports.JWTAccess = JWTAccess;
//# sourceMappingURL=jwtaccess.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236743, function(require, module, exports) {

// Copyright 2015 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRefreshClient = void 0;
const oauth2client_1 = require("./oauth2client");
class UserRefreshClient extends oauth2client_1.OAuth2Client {
    constructor(optionsOrClientId, clientSecret, refreshToken, eagerRefreshThresholdMillis, forceRefreshOnFailure) {
        const opts = optionsOrClientId && typeof optionsOrClientId === 'object'
            ? optionsOrClientId
            : {
                clientId: optionsOrClientId,
                clientSecret,
                refreshToken,
                eagerRefreshThresholdMillis,
                forceRefreshOnFailure,
            };
        super({
            clientId: opts.clientId,
            clientSecret: opts.clientSecret,
            eagerRefreshThresholdMillis: opts.eagerRefreshThresholdMillis,
            forceRefreshOnFailure: opts.forceRefreshOnFailure,
        });
        this._refreshToken = opts.refreshToken;
        this.credentials.refresh_token = opts.refreshToken;
    }
    /**
     * Refreshes the access token.
     * @param refreshToken An ignored refreshToken..
     * @param callback Optional callback.
     */
    async refreshTokenNoCache(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refreshToken) {
        return super.refreshTokenNoCache(this._refreshToken);
    }
    /**
     * Create a UserRefreshClient credentials instance using the given input
     * options.
     * @param json The input object.
     */
    fromJSON(json) {
        if (!json) {
            throw new Error('Must pass in a JSON object containing the user refresh token');
        }
        if (json.type !== 'authorized_user') {
            throw new Error('The incoming JSON object does not have the "authorized_user" type');
        }
        if (!json.client_id) {
            throw new Error('The incoming JSON object does not contain a client_id field');
        }
        if (!json.client_secret) {
            throw new Error('The incoming JSON object does not contain a client_secret field');
        }
        if (!json.refresh_token) {
            throw new Error('The incoming JSON object does not contain a refresh_token field');
        }
        this._clientId = json.client_id;
        this._clientSecret = json.client_secret;
        this._refreshToken = json.refresh_token;
        this.credentials.refresh_token = json.refresh_token;
        this.quotaProjectId = json.quota_project_id;
    }
    fromStream(inputStream, callback) {
        if (callback) {
            this.fromStreamAsync(inputStream).then(() => callback(), callback);
        }
        else {
            return this.fromStreamAsync(inputStream);
        }
    }
    async fromStreamAsync(inputStream) {
        return new Promise((resolve, reject) => {
            if (!inputStream) {
                return reject(new Error('Must pass in a stream containing the user refresh token.'));
            }
            let s = '';
            inputStream
                .setEncoding('utf8')
                .on('error', reject)
                .on('data', chunk => (s += chunk))
                .on('end', () => {
                try {
                    const data = JSON.parse(s);
                    this.fromJSON(data);
                    return resolve();
                }
                catch (err) {
                    return reject(err);
                }
            });
        });
    }
}
exports.UserRefreshClient = UserRefreshClient;
//# sourceMappingURL=refreshclient.js.map
}, function(modId) { var map = {"./oauth2client":1608953236736}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1608953236744, function(require, module, exports) {

// Copyright 2014 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.IAMAuth = void 0;
class IAMAuth {
    /**
     * IAM credentials.
     *
     * @param selector the iam authority selector
     * @param token the token
     * @constructor
     */
    constructor(selector, token) {
        this.selector = selector;
        this.token = token;
        this.selector = selector;
        this.token = token;
    }
    /**
     * Acquire the HTTP headers required to make an authenticated request.
     */
    getRequestHeaders() {
        return {
            'x-goog-iam-authority-selector': this.selector,
            'x-goog-iam-authorization-token': this.token,
        };
    }
}
exports.IAMAuth = IAMAuth;
//# sourceMappingURL=iam.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1608953236727);
})()
//# sourceMappingURL=index.js.map