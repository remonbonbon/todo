#!/usr/bin/env node
'use strict';

const logger = require('log4js').getLogger();
const config = require('config');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(compress());
app.use('/', express.static('./build', {maxAge: '1w'}));
app.use(bodyParser.json());

// Get ToDo
app.get('/todo', (req, res) => {
	res.sendFile(path.resolve('data/todo.json'), (err) => {
		// If not exist, send empty.
		res.json({});
	});
});

app.listen(config.server.port, () => {
	logger.info('Listening on port %d', config.server.port);
});
