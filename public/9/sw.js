// Load the sw-toolbox library.
importScripts('./js/idb-keyval.js');

console.log('sw-v2')

// The sync event for the contact form
self.addEventListener('sync', function (event) {
  console.log(11111)
  if (event.tag === 'contact-email') {
    event.waitUntil(idbKeyval.get('sendMessage').then(value =>
      fetch('/api/webpush/sendMessage/', {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(value)
      })
      .then(response => {
        console.log(response)
        if (response.status >= 200 && response.status < 300) {
          console.log('sync success')
          idbKeyval.delete('sendMessage');
        }
      })
    ));
  }
});
