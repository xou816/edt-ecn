importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {

    workbox.precaching.precacheAndRoute((self.__precacheManifest || []).concat([
        {url: '/public/manifest.json', revision: '14598fc245de825401ac4c49ec2afe16cd'}
    ]));

    workbox.routing.registerRoute(
        /^https:\/\/fonts\.googleapis\.com/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets',
        }),
    );

    workbox.routing.registerRoute(
        new RegExp('^' + self.location.origin + '\/api\/(calendar\/custom|alias)\/([a-z0-9:+\-_]+)$'),
        workbox.strategies.cacheFirst({
            cacheName: 'calendars',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 20,
                    maxAgeSeconds: 60 * 60,
                }),
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
            ],
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
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'app',
        }),
    );
}