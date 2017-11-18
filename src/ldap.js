const ldap = require('ldapjs');
const url = process.env.LDAP_DOMAIN || 'ldaps.nomade.ec-nantes.fr';
const client = ldap.createClient({
	url: 'ldaps://' + url + ':636',
	tlsOptions: {
		rejectUnauthorized: false
	},
	timeout: 3000,
	connectTimeout: 3000
});

module.exports = function(username, password) {
	return new Promise((resolve, reject) => {
		client.on('error', err => reject());
		if (/\w+/.test(username)) {
			client.bind('uid=' + username + ',ou=people,dc=ec-nantes,dc=fr', password, (err) => {
				if (err === null) {
					client.unbind((err) => {
						resolve();
					});
				} else {
					reject();
				}
			});
		} else {
			reject();
		}
	});
};
