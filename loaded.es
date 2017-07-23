(() => {

	let loaded = {};

	loaded.available = [];
	loaded.queue = [];
	loaded.counter = 0;
	loaded.max = 100;
	loaded.interval = 100;

	/**
	 * Binds a context and arguments to fn
	 * @param fn - function to bind
	 * @param context - value for "this"
	 * @param params - array of arguments to pass to fn
	 * @returns {Function}
	 */
	loaded.wrapFunction = (fn, context, params) => {
		return () => {
			fn.apply(context, params);
		}
	}

	/**
	 * Adds a handle to the end of the list of available scripts
	 * @param handle - name of a script
	 */
	loaded.done = (handle) => {
		loaded.available.push(handle);
	}

	/**
	 * Pushes an item onto the queue
	 * Use loaded.wrapFunction if you need to bind context and params to fn
	 *
	 * @param fn - function to call when dependencies are met
	 * @param deps - string or array - dependency handles
	 * @param event - optional jQuery event to listen for - "domready" or "load"
	 *
	 * Examples:
	 * loaded.push(fn, 'jquery', 'domready');
	 * loaded.push(fn, ['jquery', 'underscore']);
	 */
	loaded.push = (fn, deps, event) => {
		if (typeof fn !== 'function') {
			throw new Error('loaded.push requires a function');
		}
		switch (typeof deps) {
			case 'object':
				deps = deps.sort();
				break;
			case 'string':
				deps = [deps];
				break;
			default:
				throw new Error('loaded.push requires one or more dependency handles');
		}
		if (typeof event === 'string' && event !== 'domready' && event !== 'load') {
			throw new Error('You can specify events "domready" or "load"');
		}
		if (!loaded.queue) {
			loaded.queue = [];
		}
		loaded.queue.push(
			{
				fn   : fn,
				deps : deps,
				event: event
			}
		)
	};

	/**
	 * Checks if dependencies have been met for any item in the queue
	 * If they have, adds the function as a jQuery event listener or calls it
	 * Calls functions in queue order as dependencies are met
	 * Checks every [loaded.interval]
	 * Times out after [loaded.max] iterations
	 */
	loaded.check = () => {
		const self = loaded;
		// Limit the number of times we check for dependencies
		self.counter++;
		if (self.counter > self.maxCounter) {
			throw new Error('loaded exiting. Not all dependencies have loaded.');
			return;
		}

		for (let i = 0; i < self.queue.length; i++) {
			let item = self.queue[i];

			// Remove loaded deps from the item's deps list
			for (let j = 0; j < item.deps.length; j++) {
				if (loaded.available.indexOf(item.deps[j]) > -1) {
					// Dependency's been met, remove it from this item's list
					item.deps.splice(j, 1);
				}
			}

			// Invoke the item's callback and remove the item from cmd.queue
			if (item.deps.length === 0) {
				switch (item.event) {
					case 'load':
						if (typeof jQuery !== 'undefined') {
							if ('complete' === document.readyState) {
								jQuery(item.fn);
							} else {
								jQuery(window).load(item.fn);
							}
							self.queue.splice(i, 1);
						}
						break;
					case 'immediate':
						item.fn();
						self.queue.splice(i, 1);
					default:
						if (typeof jQuery !== 'undefined') {
							jQuery(item.fn);
							self.queue.splice(i, 1);
						}
						break;
				}
			}
		}

		// All done, stop checking the queue
		if (self.queue.length === 0) {
			window.clearTimeout(self.timeout);
			return;
		}

		// There are still items in the queue, so wait a little and repeat
		self.timeout = setTimeout(self.check, self.interval);
	};

	window.loaded = loaded;

})();
