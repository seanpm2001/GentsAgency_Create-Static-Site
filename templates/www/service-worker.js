const cacheName = 'static';

const offlinePage = '/offline.html';

const referrerDeny = [];
const urlDeny = [];

self.addEventListener('install', (e) => {
	e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (e) => {
	e.waitUntil(self.clients.claim());

	e.waitUntil((async function enableNavigationPreload() {
		if (self.registration.navigationPreload) {
			await self.registration.navigationPreload.enable();
		}
	})());

	e.waitUntil((async function precache() {
		const cache = await caches.open(cacheName);
		await cache.addAll([
			offlinePage,
			'/',
		]);
	})());
});

self.addEventListener('fetch', (e) => {
	const { request } = e;
	const {
		url, headers, method, mode, referrer,
	} = request;

	if (method !== 'GET' && method !== 'HEAD') {
		return;
	}

	if (Array.isArray(referrerDeny) && referrerDeny.length > 0) {
		const matched = referrerDeny.filter((r) => referrer.startsWith(r));

		if (matched.length > 0) {
			return;
		}
	}

	if (Array.isArray(urlDeny) && urlDeny.length > 0) {
		const matched = urlDeny.filter((u) => url.startsWith(u));

		if (matched.length > 0) {
			return;
		}
	}

	e.respondWith((async function handleFetch() {
		const response = Promise.resolve(e.preloadResponse).then((preloaded) => preloaded || fetch(request));

		e.waitUntil((async function storeResponse() {
			const clone = (await response).clone();

			if (!clone.ok) {
				return;
			}

			const cacheControl = clone.headers.get('Cache-Control');

			if (cacheControl) {
				if (
					cacheControl.includes('private')
					|| cacheControl.includes('must-revalidate')
					|| cacheControl.includes('no-cache')
					|| cacheControl.includes('max-age=0')
				) {
					return;
				}
			}

			const cache = await caches.open(cacheName);
			await cache.put(request, clone);
		}()));

		if (mode === 'navigate' || headers.get('Accept').includes('text/html')) {
			return Promise.race([
				response,
				new Promise((_, reject) => {
					setTimeout(() => reject(), 5000);
				}),
			]).catch(async () => {
				const cached = await caches.match(request);
				return cached || response;
			}).catch(() => caches.match(offlinePage));
		}

		const cached = await caches.match(request);
		return cached || response;
	}()));
});
