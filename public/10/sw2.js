const cacheName = 'test';

function getQueryString(field, url = self.location.href) {
  const reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
  const result = reg.exec(url);
  console.log('result', result)
  return result ? result[1] : null
}

self.addEventListener('install', event => {
  self.skipWaiting()
  
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll([
      'header.html',
      'footer.html'
    ]))
  )
})

self.addEventListener('activate', event => {
	self.clients.claim()
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  if(url.pathname.endsWith('/test.html')) {
    const id = getQueryString('id', url);
    console.log(id)
    const url2 = `data-${id}.html`;
    console.log(id, url2)
    event.respondWith(htmlStream(url2));
  }
})  

function htmlStream(url) {
  try {
    new ReadableStream({})
  } catch (error) {
    return new Response('Stream not supported');
  }

  const stream = new ReadableStream({
    start: controller => {
      const startFetch = caches.match('header.html');
      const bodyData = fetch(url).catch(() => new Response('Body fetch failed'));
      const endFetch = caches.match('footer.html');
      function pushStream(stream) {
        const reader = stream.getReader();

        function read() {
          return reader.read().then(result => {
            if(result.done) return;
            controller.enqueue(result.value);
            return read();
          })
        }
        return read()
      }

      startFetch
      .then(response => pushStream(response.body))
      .then(() => bodyData)
      .then(response => pushStream(response.body))
      .then(() => endFetch)
      .then(response => pushStream(response.body))
      .then(() => controller.close())
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/html'
    }
  })
}