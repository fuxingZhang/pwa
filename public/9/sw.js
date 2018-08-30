// Load the sw-toolbox library.
importScripts('./js/idb-keyval.js');

console.log('sw')

const cacheName = 'latestNews-v1';
const offlineUrl = '/offline';

// Handle network delays
function timeout(delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(new Response('', {
        status: 408,
        statusText: 'Request timed out.'
      }));
    }, delay);
  });
}

function resolveFirstPromise(promises) {
  return new Promise((resolve, reject) => {

    promises = promises.map(p => Promise.resolve(p));

    promises.forEach(p => p.then(resolve));

    promises.reduce((a, b) => a.catch(() => b))
    .catch(() => reject(Error("All failed")));
  });
};

// The sync event for the contact form
self.addEventListener('sync', function (event) {
  if (event.tag === 'contact-email') {
    event.waitUntil(
      idbKeyval.get('sendMessage').then(value =>
        fetch('/api/webpush/sendMessage/', {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' }),
          body: JSON.stringify(value)
        }).then(res => console.log(res))
      ));

        // Remove the value from the DB
        idbKeyval.delete('sendMessage');
    }
});
