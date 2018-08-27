let cacheName = 'helloWorld';

self.addEventListener('install', event => {
	console.log('installed')
	event.waitUntil(
		caches
			.open(cacheName)
			.then(cache => cache.addAll(['/2/js/script.js', '/2/images/hello.png']))
			.catch(console.log)
	)
})

self.addEventListener('fetch', event => {
	console.log('fetch', event.request)
	event.respondWith(
		caches
			.match(event.request)
			.then(response => {
				console.log('match', event.request, response)
				if(response) {
					return response
				}
				return fetch(event.request)
			})
			.catch(console.log)
		// or
		// caches
		// .open(cacheName)
		// .then(cache => cache.match(event.request))
		// .then(response => {
		// 	console.log('match', event.request, response)
		// 	if(response) {
		// 		return response
		// 	}
		// 	return fetch(event.request)
		// })
		// .catch(console.log)
	)
})