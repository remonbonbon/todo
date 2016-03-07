'use strict';

const STORAGE_KEY = 'todos';

module.exports = {
	fetch: function() {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
	},
	save: function(todos) {
		console.log(JSON.stringify(todos));
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
	}
};