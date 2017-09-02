const ldap = require('ldapjs');
const client = ldap.createClient({
	url: 'ldaps://130.66.41.27:636',
	tlsOptions: {
		rejectUnauthorized: false
	}
});

module.exports = function(username, password) {
	return new Promise((resolve, reject) => {
		client.bind('uid=' + username + ',ou=people,dc=ec-nantes,dc=fr', password, (err) => {
			if (err === null) {
				resolve();
			} else {
				reject();
			}
		});
	});
};
