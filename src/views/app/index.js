import {View} from 'backbone';
import template from './template.html';
import _ from 'underscore';
import $ from 'jquery';

import {TodoView} from './../todo/index.js';
import {Todos} from './../../collections/todos.js';

const TodosCollection = new Todos();

const AppView = View.extend({
	// Instead of generating a new element, bind to the existing skeleton of
	// the App already present in the HTML.
	el: '.todoapp',
	// Our template for the line of statistics at the bottom of the app.
	statsTemplate: _.template(template),
	// Delegated events for creating new items, and clearing completed ones.
	events: {
		'keypress .new-todo': 'createOnEnter',
		'click .clear-completed': 'clearCompleted',
		'click .toggle-all': 'toggleAllComplete'
	},
	// At initialization we bind to the relevant events on the `Todos`
	// collection, when items are added or changed. Kick things off by
	// loading any preexisting todos that might be saved in *localStorage*.
	initialize: function() {
		this.allCheckbox = this.$('.toggle-all')[0];
		this.$input = this.$('.new-todo');
		this.$footer = this.$('.footer');
		this.$main = this.$('.main');
		this.$list = $('.todo-list');
		this.listenTo(TodosCollection, 'add', this.addOne);
		this.listenTo(TodosCollection, 'reset', this.addAll);
		this.listenTo(TodosCollection, 'change:completed', this.filterOne);
		this.listenTo(TodosCollection, 'filter', this.filterAll);
		this.listenTo(TodosCollection, 'all', _.debounce(this.render, 0));
		// Suppresses 'add' events with {reset: true} and prevents the app view
		// from being re-rendered for every model. Only renders when the 'reset'
		// event is triggered at the end of the fetch.
		TodosCollection.fetch({reset: true});
	},
	// Re-rendering the App just means refreshing the statistics -- the rest
	// of the app doesn't change.
	render: function () {
		var completed = TodosCollection.completed().length;
		var remaining = TodosCollection.remaining().length;
		if (TodosCollection.length) {
			this.$main.show();
			this.$footer.show();
			this.$footer.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}));
			this.$('.filters li a')
				.removeClass('selected')
				.filter('[href="/' + (window.TodoFilter || '') + '"]')
				.addClass('selected');
		} else {
			this.$main.hide();
			this.$footer.hide();
		}
		this.allCheckbox.checked = !remaining;
	},
	// Add a single todo item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne: function (todo) {
		var view = new TodoView({ model: todo });
		this.$list.append(view.render().el);
	},
	// Add all items in the **Todos** collection at once.
	addAll: function () {
		this.$list.html('');
		TodosCollection.each(this.addOne, this);
	},
	filterOne: (todo) => {
		todo.trigger('visible');
	},
	filterAll: function () {
		TodosCollection.each(this.filterOne, this);
	},
	// Generate the attributes for a new Todo item.
	newAttributes: function () {
		return {
			title: this.$input.val().trim(),
			order: TodosCollection.nextOrder(),
			completed: false
		};
	},
	// If you hit return in the main input field, create new **Todo** model,
	// persisting it to *localStorage*.
	createOnEnter: function (e) {
		if (e.which === window.ENTER_KEY && this.$input.val().trim()) {
			TodosCollection.create(this.newAttributes());
			this.$input.val('');
		}
	},
	// Clear all completed todo items, destroying their models.
	clearCompleted: function () {
		_.invoke(TodosCollection.completed(), 'destroy');
		return false;
	},
	toggleAllComplete: function () {
		var completed = this.allCheckbox.checked;
		TodosCollection.each(function (todo) {
			todo.save({
				completed: completed
			});
		});
	}
});

export {AppView};