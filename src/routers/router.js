import {Router} from 'backbone';
import {Todos} from './../collections/todos.js';

const TodosCollection = new Todos();
const TodoRouter = Router.extend({
	routes: {
		'*filter': 'setFilter'
	},
	setFilter: function (param) {
		// Set the current filter to be used
		window.TodoFilter = param || '';
		// Trigger a collection filter event, causing hiding/unhiding
		// of Todo view items
		TodosCollection.trigger('filter');
	}
});

export {TodoRouter};
