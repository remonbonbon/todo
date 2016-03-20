(function() {
	'use strict';

	const STORAGE_KEY = 'filter';

	module.exports = {
		fetch: function() {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '"all"');
		},
		save: function(filter) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(filter));
		}
	};
})();