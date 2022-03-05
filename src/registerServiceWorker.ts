/* eslint-disable no-console */

import { register } from 'register-service-worker'

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
        },
        offline() {
            console.log('No internet connection found. App is running in offline mode.')
        },
        error(error) {
            console.error('Error during service worker registration:', error)
        },
    })
}
navigator.serviceWorker.register(`${process.env.BASE_URL}service-worker.js`).then(reg => {
    reg.addEventListener('updatefound', () => {
        const newSW = reg.installing
        newSW?.addEventListener('statechange', () => {
            // Check service worker state
            if (newSW.state === 'installed') {
                // A new SW is available and installed.
                // You can update the page directly or better
                // show a notification to the user to prompt for a page reload
                // and inform about the new version available
                reg.update()
            }
        })
    })
})
