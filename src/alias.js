const Datastore = require('nedb');
const crypto = require('crypto');

exports.getDatabase = () => new Datastore({ filename: '../aliases', autoload: true });

const hashPin = (alias, pin) => crypto.createHash('sha1').update(alias + pin).digest('hex');

const getAlias = (db, alias) => {
	return new Promise((resolve, reject) => {
		db.findOne({ name: alias }, (err, doc) => {
			if (err) reject(err);
			return resolve(doc);
		});
	});
};

exports.aliasExists = (db, alias) => {
	return getAlias(db, alias).then(doc => doc === null);
};

exports.getCalId = (db, alias) => {
	return getAlias(db, alias).then(doc => doc.value);
};

exports.setAlias = (db, alias, pin, value) => {
	let hash = hashPin(alias, pin);
	return getAlias(db, alias)
		.then(doc => doc !== null && hash === doc.hash || doc === null ?
			Promise.resolve(null) : Promise.reject('Hash mismatch'))
		.then(_ => new Promise((resolve, reject) => {
			db.update({ name: alias },
				{ name: alias, hash: hash, value: value },
				{ upsert: true },
				(err, count) => {
					if (err) reject(err);
					return resolve(count);
				});
		}));
};