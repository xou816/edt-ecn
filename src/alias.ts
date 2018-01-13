if (process.env.REDISTOGO_URL) {
    const rtg = require('url').parse(process.env.REDISTOGO_URL);
	var redis = require('redis').createClient(rtg.port, rtg.hostname);
	redis.auth(rtg.auth.split(':')[1]);
} else {
    var redis = require('redis').createClient();
}
const crypto = require('crypto');

const hashPin = (alias, pin) => crypto.createHash('sha1').update(alias + pin).digest('hex');

const getAlias = (alias) => {
	return new Promise((resolve, reject) => {
		redis.hgetall(alias, (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
	});
};

exports.aliasExists = (alias) => {
	return new Promise((resolve, reject) => {
		redis.exists(alias, (err, res) => {
			if (err) reject(err);
			resolve(res > 0 ? true : false);
		});
	});
};

exports.getCalId = (alias) => {
	return new Promise((resolve, reject) => {
		redis.hget(alias, 'value', (err, res) => {
			if (err || res === null) reject(err);
			resolve(res);
		});
	});
};

exports.setAlias = (alias, pin, value) => {
	let hash = hashPin(alias, pin);
	return getAlias(alias)
		.then(doc => doc !== null && hash === doc.hash || doc === null ?
			Promise.resolve(null) : Promise.reject('Hash mismatch'))
		.then(_ => new Promise((resolve, reject) => {
			redis.hmset(alias,
				{ hash: hash, value: value },
				(err, res) => {
					if (err) reject(err);
					return resolve(res);
				});
		}));
};

exports.setAliasNoPass = (alias, value) => {
	return new Promise((resolve, reject) => {
		redis.hmset(alias,
			{ value: value },
			(err, res) => {
				if (err) reject(err);
				return resolve(res);
			});
	});
};