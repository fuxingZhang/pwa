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

self.addEventListener('push', event => {
	let payload = event.data ? JSON.parse(event.data.text()) : 'no payload'
	let title = 'pwa'
	event.waitUntil(
		self.registration.showNotification(title, {
			body: payload.msg,
			url: payload.url,
			icon: payload.icon,
			actions: [
				{ action: 'voteup', title: 'Vote Up' },
				{ action: 'votedown', title: 'Vote Down' }
			],
			// 振动300ms,暂停100ms,再振动400ms
			vibrate: [300, 100, 400]
		})
	)
})

self.addEventListener('notificationclick', event => {
	event.notification.close()

	if(event.action === 'voteup') {
		clients.openWindow('http://localhost:3000/voteup')
	}else {
		clients.openWindow('http://localhost:3000/votedown')
	}

	event.waitUntil(
		clients.matchAll({
			type: 'window'
		})
		.then(clientList => {
			for(let client of clientList) {
				if(client.url == '/' && 'focus' in client) {
					return client.focus()
				}
			}
			if(clients.openWindow) {
				return clients.openWindow('http://localhost:3000/6/index.html')
			}
		})
	)
})