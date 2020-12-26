module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1608953236745, function(require, module, exports) {

/**
 * Copyright 2018 Google LLC
 *
 * Distributed under MIT license.
 * See file LICENSE for detail or copy at https://opensource.org/licenses/MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPem = void 0;
const fs = require("fs");
const forge = require("node-forge");
const util_1 = require("util");
const readFile = util_1.promisify(fs.readFile);
function getPem(filename, callback) {
    if (callback) {
        getPemAsync(filename)
            .then(pem => callback(null, pem))
            .catch(err => callback(err, null));
    }
    else {
        return getPemAsync(filename);
    }
}
exports.getPem = getPem;
function getPemAsync(filename) {
    return readFile(filename, { encoding: 'base64' }).then(keyp12 => {
        return convertToPem(keyp12);
    });
}
/**
 * Converts a P12 in base64 encoding to a pem.
 * @param p12base64 String containing base64 encoded p12.
 * @returns a string containing the pem.
 */
function convertToPem(p12base64) {
    const p12Der = forge.util.decode64(p12base64);
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, 'notasecret');
    const bags = p12.getBags({ friendlyName: 'privatekey' });
    if (bags.friendlyName) {
        const privateKey = bags.friendlyName[0].key;
        const pem = forge.pki.privateKeyToPem(privateKey);
        return pem.replace(/\r\n/g, '\n');
    }
    else {
        throw new Error('Unable to get friendly name.');
    }
}
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1608953236745);
})()
//# sourceMappingURL=index.js.map