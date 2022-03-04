import { ref } from 'vue'
const audioElement = document.createElement('audio')
export const musicStarts = ref(false)
audioElement.setAttribute('id', 'music')
audioElement.setAttribute('src', '/gt/music/Space.mp3')
audioElement.setAttribute('autoplay', 'autoplay')
audioElement.loop = true
changeVolume(10)
export function changeVolume(volume: number) {
    if (audioElement) audioElement.volume = volume / 1000
}
export function start() {
    if (!musicStarts.value) {
        audioElement.play()
    }
    musicStarts.value = true
}
export function itemSound(volume: number) {
    const ItemSound = document.createElement('audio')
    ItemSound.setAttribute('id', 'itemSound')
    ItemSound.setAttribute('src', '/gt/music/CollectItemSound.mp3')
    ItemSound.setAttribute('autoplay', 'autoplay')
    ItemSound.volume = volume / 100
    ItemSound.play()
}
export function plasmaSound(volume: number) {
    const PlasmaSound = document.createElement('audio')
    PlasmaSound.setAttribute('id', 'plasmaSound')
    PlasmaSound.setAttribute('src', '/gt/music/PlasmaSound.mp3')
    PlasmaSound.setAttribute('autoplay', 'autoplay')
    PlasmaSound.volume = volume / 100
    PlasmaSound.play()
}
export function ButtonSound(volume: number) {
    const buttonSound = document.createElement('audio')
    buttonSound.setAttribute('id', 'ButtonSound')
    buttonSound.setAttribute('src', '/gt/music/ButtonPressed.mp3')
    buttonSound.setAttribute('autoplay', 'autoplay')
    buttonSound.volume = volume / 100
    buttonSound.play()
}
