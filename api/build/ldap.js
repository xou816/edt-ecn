"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ldap = require("ldapjs");
var url = process.env.LDAP_DOMAIN || 'ldaps.nomade.ec-nantes.fr';
var clientError = false;
var client = ldap.createClient({
    url: 'ldaps://' + url + ':636',
    tlsOptions: {
        rejectUnauthorized: false
    },
    timeout: 3000,
    connectTimeout: 3000
});
client.on('error', function (err) {
    console.error('[ERROR] cannot create ldap client');
    console.error(err);
    clientError = true;
});
function checkCredentials(username, password) {
    return new Promise(function (resolve, reject) {
        if (clientError)
            reject();
        if (/\w+/.test(username) && username.length > 0 && password.length > 0) {
            client.bind('uid=' + username + ',ou=people,dc=ec-nantes,dc=fr', password, function (err) {
                if (err === null) {
                    resolve();
                }
                else {
                    reject(err);
                }
            });
        }
        else {
            reject();
        }
    });
}
exports.default = checkCredentials;
;
