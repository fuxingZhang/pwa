let cacheName = 'helloWorld';

self.addEventListener('install', event => {
	// book page-57
	event.waitUntil(self.skipWaiting())
	// mdn 
	self.skipWaiting()
})

self.addEventListener('activate', event => {
	event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
	if (!/localhost:3000\/3\/images\//.test(event.request.url)) {
		return
	}

	event.respondWith(caches.match(event.request, { ignoreSearch: true }).then(response => {
		console.log('match', event.request, response)
		if (response) {
			return response
		}

		let requestToCashe = event.request.clone();

		return fetch(requestToCashe).then(response => {
			if (response && response.status == 200) {
				let responseToCache = response.clone()

				caches.open(cacheName).then(cache => {
					cache.put(requestToCashe, responseToCache)
				})
			}

			return response
		})
	})
	.catch(console.log)
	)
})