'use strict';

let cacheName = 'helloWorld';
const cachename = 'offline-catche'
const offlineUrl = 'offline-page.html'
const index = 'index.html'

self.addEventListener('install', event => {
	self.skipWaiting()

	event.waitUntil(caches.open(cachename).then(cache => {
		return cache.addAll([index, offlineUrl])
	}))
})

self.addEventListener('activate', event => {
	event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
	event.respondWith(caches.match(event.request, { ignoreSearch: true }).then(response => {
		console.log('match', event.request, response)
		if (response) {
			return response
		}

		let requestToCashe = event.request.clone();
		console.log(1111,requestToCashe)

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
	.catch(error => {
		if(event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
			console.log(event.request.url.replace('http://localhost:3000/7/', ''))
			return caches.match(event.request.url.replace('http://localhost:3000/7/', ''))
		}
	})
	)
})