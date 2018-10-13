importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {

    workbox.precaching.precacheAndRoute((self.__precacheManifest || []).concat([
        {url: '/public/manifest.json', revision: '4caa6d39ef80670e7fd9b75d8b0eb662'}
    ]));

    workbox.routing.registerRoute(
        /^https:\/\/fonts\.googleapis\.com/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets',
        }),
    );

    workbox.routing.registerRoute(
        new RegExp('^' + self.location.origin + '\/api\/calendar\/(.*)$'),
        workbox.strategies.cacheFirst({
            cacheName: 'api',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 20,
                    maxAgeSeconds: 5 * 60, // 5 minutes
                }),
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
            ],
        }),
    );

    workbox.routing.registerRoute(
        new RegExp('^' + self.location.origin + '\/((.*)\/([0-9]{8}|today|ics))?$'),
        workbox.strategies.networkFirst({
            networkTimeoutSeconds: 3,
            cacheName: 'app',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 20,
                    maxAgeSeconds: 5 * 60, // 5 minutes
                }),
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
            ],
        }),
    );
}