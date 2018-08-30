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
	let headers = event.request.headers;

	// save-data
	if(headers.get('save-data')) {
		if(event.request.url.includes('webfont/')) {
			console.log('webfont', event.request.url)
			event.respondWith(new Response('', {
				status: 417,
				statusText: 'Ignore fonts to save data.'
			}))
		}
	}

	// 如果请求的是jpg、png格式图片，则拦截，换成请求请求webp格式
	if (!/\.jpg$|.png/.test(event.request.url)) {
		return
	}

	if(!headers.has('accept') || !headers.get('accept').includes('webp'))  return;

	let req = event.request.clone();
	let url = req.url.substr(0, req.url.lastIndexOf('.')) + '.webp';

	console.log(url)

	event.respondWith(
		fetch(url, {
			mode: 'no-cors'
		})
	);
})