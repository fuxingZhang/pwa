console.log('sw')

// 拦截请求
self.addEventListener('fetch', function(event) {
	console.log('fetch url: ', event.request.url)
	if(/2\.jpg$/.test(event.request.url)) {
		event.respondWith(fetch('/1/images/1.jpg'));
	}
})