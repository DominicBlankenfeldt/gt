/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { ref } from 'vue'
export const newVersion = ref(false)

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
            console.log('App is being served from cache by a service worker.\n' + 'For more details, visit https://goo.gl/AFskqB')
        },
        registered() {
            console.log('Service worker has been registered.')
        },
        cached() {
            console.log('Content has been cached for offline use.')
        },
        updatefound() {
            console.log('New content is downloading.')
        },
        updated() {
            console.log('New content is available; please refresh.')
            newVersion.value = true
        },
        offline() {
            console.log('No internet connection found. App is running in offline mode.')
        },
        error(error) {
            console.error('Error during service worker registration:', error)
        },
    })
}

const cacheName = 'v0.2.7'

self.addEventListener('activate', event => {
    // Remove old caches
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event.waitUntil(
        (async () => {
            const keys = await caches.keys()
            return keys.map(async cache => {
                if (cache !== cacheName) {
                    console.log('Service Worker: Removing old cache: ' + cache)
                    return await caches.delete(cache)
                }
            })
        })()
    )
})
