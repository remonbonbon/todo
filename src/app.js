'use strict';

const Vue = require('vue');
const TodoStore = require('./store-todos');
const FilterStore = require('./store-filter');

var filters = {
	all: function(todos) {
		return todos;
	},
	active: function(todos) {
		return todos.filter(function(todo) {
			return !todo.completed;
		});
	},
	completed: function(todos) {
		return todos.filter(function(todo) {
			return todo.completed;
		});
	}
};

const vm = new Vue({
	el: '#app',
	data: {
		todos: [],
		filter: FilterStore.fetch(),
		newTodo: '',
		editedTodo: null,
		editedTodoTitle: null,
		beforeEditTitle: '',
	},
	created: function() {
		TodoStore.fetch(function(err, json) {
			if (err) return console.log('parsing failed', err);
			this.todos = json;
		}.bind(this));
	},
	watch: {
		todos: {
			handler: function(todos) {
				TodoStore.save(todos);
			},
			deep: true
		},
		filter: function(filter) {
			FilterStore.save(filter);
		},
	},
	computed: {
		filteredTodos: function() {
			return filters[this.filter](this.todos);
		},
		remaining: function() {
			return filters.active(this.todos).length;
		},
		allDone: {
			get: function() {
				return this.remaining === 0;
			},
			set: function(value) {
				this.todos.forEach(function (todo) {
					todo.completed = value;
				});
			}
		},
	},
	methods: {
		addTodo: function(event) {
			var value = this.newTodo && this.newTodo.trim();
			if (!value) {
				return;
			}
			this.todos.push({
				title: value,
				completed: false,
				priority: 1
			});
			this.newTodo = '';
		},
		toggleTodo: function(todo) {
			todo.completed = !todo.completed;
		},
		removeTodo: function(todo) {
			this.todos.$remove(todo);
		},
		removeCompleted: function() {
			if (this.remaining < this.todos.length) {
				// If completed todo exists
				this.todos = filters.active(this.todos);
			}
		},

		editTodo: function(todo) {
			if (this.editedTodo === todo) {
				return;
			}
			this.editedTodo = todo;
			this.editedTodoTitle = todo.title;
			this.beforeEditTitle = todo.title;
		},
		doneEdit: function(todo) {
			if (!this.editedTodo) {
				return;
			}
			todo.title = this.editedTodoTitle.trim();
			this.editedTodo = null;
			this.editedTodoTitle = null;
			if (!todo.title) {
				this.removeTodo(todo);
			}
		},
		cancelEdit: function(todo) {
			this.editedTodo = null;
			this.editedTodoTitle = null;
			todo.title = this.beforeEditTitle;
		},
	},

	// a custom directive to wait for the DOM to be updated
	// before focusing on the input field.
	// http://vuejs.org/guide/custom-directive.html
	directives: {
		'todo-focus': function(value) {
			if (!value) {
				return;
			}
			var el = this.el;
			Vue.nextTick(function() {
				// Focus on input element
				el.focus();
			});
		}
	},
});
