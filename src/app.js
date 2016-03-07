'use strict';

const Vue = require('vue');
const TodoStore = require('./store-todos');
const FilterStore = require('./store-filter');

var filters = {
	all: function (todos) {
		return todos;
	},
	active: function (todos) {
		return todos.filter(function (todo) {
			return !todo.completed;
		});
	},
	completed: function (todos) {
		return todos.filter(function (todo) {
			return todo.completed;
		});
	}
};

const vm = new Vue({
	el: '#app',
	data: {
		todos: TodoStore.fetch(),
		newTodo: '',
		filter: FilterStore.fetch(),
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
	},
});
