(function bootstrap(w, d) {
	function loadScript(src, async, defer) {
		var s = d.createElement('script');
		s.async = !!async;
		s.defer = !!defer;
		s.src = src;

		d.head.appendChild(s);
	}

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/service-worker.js');
	}

	// Mustard Cutting. If there is native Custom Elements (v1)
	// we assume decent ES6 support & load in the Rollup bundle.
	// Else, we load a fallback & run the transpiled bundle from Babel
	if ('customElements' in window) {
		loadScript('/assets/js/main.es6.js', false, true);
	} else {
		if (!('MutationObserver' in window)) {
			// Don't even try to polyfill
			return;
		}

		loadScript('https://cdn.polyfill.io/v2/polyfill.min.js?features=default-3.6,Symbol,fetch,Array.prototype.includes,Array.prototype.find&flags=gated&unknown=polyfill', false, true);
		loadScript('/assets/js/main.js', false, true);
	}
}(window, document));
