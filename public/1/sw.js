console.log('sw')

// 拦截请求
self.addEventListener('fetch', function(event) {
	console.log('fetch url: ', event.request.url)

	event.waitUntil(async function() {
    // Exit early if we don't have access to the client.
    // Eg, if it's cross-origin.
    if (!event.clientId) return;

    // Get the client.
    const client = await clients.get(event.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;

    // Send a message to the client.
    self.clients.matchAll().then(function (clients){
      clients.forEach(function(client){
				client.postMessage('hello everyone')
        client.postMessage({
          msg: "Hey I just got a fetch from you!",
          url: event.request.url
        });
      });
    });
   
  }());

	if(/2\.jpg$/.test(event.request.url)) {
		event.respondWith(fetch('/1/images/1.jpg'));
	}
})

self.addEventListener('message', function (event) {
	console.log(event.data); // 输出：'sw.updatedone'
});