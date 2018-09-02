const cacheName = 'test';

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
	self.clients.claim()
})

self.addEventListener('fetch', event => {
  event.respondWith(htmlStream());
})  

function htmlStream() {
  const html = 'html goes here ...';

  const stream = new ReadableStream({
    start: controller => {
      const encoder = new TextEncoder();
      let pos = 0;
      let chunkSize = 1;

      function push() {
        if(pos >= html.length) {
          controller.close();
          return
        }

        controller.enqueue(
          encoder.encode(html.slice(pos, pos + chunkSize))
        )

        pos += chunkSize;
        setTimeout(push, 50);
      }

      push();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/html'
    }
  })
}