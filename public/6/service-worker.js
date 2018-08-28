let cacheName = 'helloWorld';

self.addEventListener('install', event => {
	event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', event => {
	event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
	console.log(event.request.url)
})