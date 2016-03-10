#!/usr/bin/env node
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
	res.sendFile(TODO_FILEPATH, (err) => {
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
