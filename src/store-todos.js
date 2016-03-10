'use strict';

const STORAGE_KEY = 'todos';


module.exports = {
	fetch: function(done) {
		done = done ? done : function() {};

		fetch('todo').then(function(res) {
			return res.json();
		}).catch(function(err) {
			done(err);
		}).then(function(json) {
			done(null, json);
		});
	},
	save: function(todos, done) {
		done = done ? done : function() {};

		console.log(JSON.stringify(todos));
		fetch('todo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(todos)
		}).then(function(res) {
			return res.json();
		}).catch(function(err) {
			done(err);
		}).then(function(json) {
			done(null, json);
		});
	}
};