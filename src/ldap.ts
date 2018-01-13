const ldap = require('ldapjs');
const url = process.env.LDAP_DOMAIN || 'ldaps.nomade.ec-nantes.fr';
let clientError = false;
const client = ldap.createClient({
	url: 'ldaps://' + url + ':636',
	tlsOptions: {
		rejectUnauthorized: false
	},
	timeout: 3000,
	connectTimeout: 3000
});

client.on('error', err => {
	console.error('[ERROR] cannot create ldap client');
	console.error(err);
	clientError = true;
});

module.exports = function(username, password) {
	return new Promise((resolve, reject) => {
		if (clientError) reject();
		if (/\w+/.test(username) && username.length > 0 && password.length > 0) {
			client.bind('uid=' + username + ',ou=people,dc=ec-nantes,dc=fr', password, (err) => {
				if (err === null) {
					resolve();
				} else {
					reject(err);
				}
			});
		} else {
			reject();
		}
	});
};