const mongoose = require('mongoose');

const setupDb = async (mongoURL) => {
	try {
		await mongoose.connect(mongoURL);
		console.log('MongoDB was connected');
	} catch (err) {
		console.error('Error on mongo connection', err);
	}
};

module.exports = {
	setupDb
};