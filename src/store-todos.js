(function() {
	'use strict';

	module.exports = {
		fetch: function(done) {
			done = done ? done : function() {};

			fetch('todo', {
				credentials: 'same-origin',	// send cookie for basic auth
			})
			.then(res => res.json())
			.catch(err => done(err))
			.then(json => done(null, json));
		},
		save: function(todos, done) {
			done = done ? done : function() {};

			console.log(JSON.stringify(todos));
			fetch('todo', {
				credentials: 'same-origin',	// send cookie for basic auth
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(todos)
			})
			.then(res => res.json())
			.catch(err => done(err))
			.then(json => done(null, json));
		}
	};
})();