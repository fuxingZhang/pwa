console.log('sw')

// 拦截请求
self.addEventListener('fetch', function(event) {
	console.log('fetch url: ', event.request.url)
	if(/\.jpg$/.test(event.request.url)) {
		event.respondWith(Promise.race([timeout(3000), fetch(event.request.url)]));
	} else {
		event.respondWith(fetch(event.request))
	}
})

function timeout(delay) {
	return new Promise((resolve, reject) => {
		setTimeout( () => {
			resolve(new Response('', {
				status: 408,
				statusText: 'Request timed out.'
			}))
		}, delay);
	})
}