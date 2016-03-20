#!/usr/bin/env node
/*eslint strict: [2, "global"]*/
'use strict';

const logger = require('log4js').getLogger();
const config = require('config');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const TODO_FILEPATH = path.resolve('data/todo.json');

const app = express();
app.use(compress());
app.use('/', express.static('./build', {maxAge: '1y'}));
app.use(bodyParser.json());

// Get ToDo
app.get('/todo', (req, res) => {
	const option = {
		// Disable cache
		etag: false,
		lastModified: false,
		maxAge: 0,
	};
	res.sendFile(TODO_FILEPATH, option, (err) => {
		// If not exist, send empty.
		if (err) res.json([]);
	});
});

// Save ToDo
app.post('/todo', (req, res) => {
	fs.writeFile(TODO_FILEPATH, JSON.stringify(req.body), 'utf-8', function(err) {
		if (err) {
			logger.warn(err);
			res.json(500, {error: 'Save failed'});
		} else {
			res.json({message: 'Save succeeded'});
		}
	});
});

app.listen(config.server.port, () => {
	logger.info('Listening on port %d', config.server.port);
});
