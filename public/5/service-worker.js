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
	console.log(event.request.url)
})