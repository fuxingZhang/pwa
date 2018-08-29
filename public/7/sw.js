'use strict';

const cachename = 'offline-catche'
const offlineUrl = 'offline-page.html'
const index = 'index.html'

self.addEventListener('install', event => {
	event.waitUntil(caches.open(cachename).then(cache => {
		return cache.addAll([index, offlineUrl])
	}))
})

self.addEventListener('fetch', event => {
	console.log('fetch url: ', event.request.url)
	if(event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
		console.log(event.request.url.replace('http://localhost:3000/7/', ''))
		event.respondWith(fetch(event.request.url).catch(err => {
			console.log(err)
			return caches.match(event.request.url.replace('http://localhost:3000/7/', ''))
		}))
	} else {
		event.respondWith(fetch(event.request))
	}
})