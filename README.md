# Loaded

**Simple dependency manager for scripts that depend on external libraries. Register your jQuery function with Loaded and add an onload event to your jQuery library script tag: Loaded will make sure your function doesn't get called till jQuery's finished downloading.**

This means you can load jQuery with `async` or `defer` knowing your jQuery scripts will only run when jQuery is available. Loaded allows you to remove render-blocking JavaScript from the top of your page, as recommended by [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/).

When an external JS library has loaded, Loaded calls all the functions that depend on it - so long as they don't need any other files that haven't loaded yet. 

## Getting started

* Include `loaded.js` in your HTML file, above the script tags for jQuery and any other libraries you want to watch.
* Add an `onload` handler to the script tag of each external script. The handler calls `loaded.done()` to add the name of the library to Loaded's `available` array. For example: `onload="loaded.done('jquery');"` You can choose your own names for each library.
* Use `loaded.push` to add a function and its dependencies to the queue, for example: 

```
loaded.push(function() {
	$("<h1>Hello World</h1>").appendTo('body').css('color', 'yellow');
}, 'jquery');
```
* Call `loaded.check();` to start Loaded watching for dependencies.

## Options

* You can specify a single dependency or an array of dependencies as the second argument to `loaded.push`. Loaded will only call your function when both scripts are ready. Example:

```loaded.push(myFunc, ['jquery', 'underscore'])```

* If you pass `load` as the third argument to `loaded.push`, Loaded will invoke your function as a callback of the window load event. For example, this item will run as `$(window).load(myFunc)`:

```loaded.push(myFunc, 'jquery', 'load')```

* If you pass `immediate`, Loaded will run your function directly. This example is equivalent to `myFunc()`:
 
```loaded.push(myFunc, 'jquery', 'immediate')```

* If you pass no event argument, Loaded will run your function on DOMReady. If the DOM is already ready when this happens jQuery will run it instantly. This example will run as `$(myFunc)`:

```loaded.push(myFunc, 'jquery')```


## Demo

See `index.html` for a demo which loads JQuery and Underscore and only runs callbacks when they are available.
