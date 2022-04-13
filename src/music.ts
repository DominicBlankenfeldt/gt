import { ref } from 'vue'
import * as type from '@/types'
const audioElement = document.createElement('audio')
export const musicStarts = ref(false)
audioElement.setAttribute('id', 'music')
audioElement.setAttribute('src', '/gt/music/Space.mp3')
audioElement.setAttribute('autoplay', 'autoplay')
audioElement.loop = true
changeVolume(50)
export function changeVolume(volume: number) {
    if (audioElement) audioElement.volume = volume / 5000
}
export function start() {
    if (!musicStarts.value) {
        try {
            audioElement.play()
        } catch {
            return
        }
    }
    musicStarts.value = true
}
export function itemSound(volume: number, item: type.Item) {
    const ItemSound = document.createElement('audio')
    switch (item.type) {
        case 'clearField':
            ItemSound.setAttribute('src', '/gt/music/BombSound.mp3')
            break
        default:
            ItemSound.setAttribute('src', '/gt/music/CollectItemSound.mp3')
            break
    }
    ItemSound.setAttribute('id', 'itemSound')
    ItemSound.setAttribute('autoplay', 'autoplay')
    ItemSound.volume = volume / 600
    ItemSound.play()
}
export function plasmaSound(volume: number) {
    const PlasmaSound = document.createElement('audio')
    PlasmaSound.setAttribute('id', 'plasmaSound')
    PlasmaSound.setAttribute('src', '/gt/music/PlasmaSound.mp3')
    PlasmaSound.setAttribute('autoplay', 'autoplay')
    PlasmaSound.volume = volume / 600
    PlasmaSound.play()
}
export function ButtonSound(volume: number) {
    const buttonSound = document.createElement('audio')
    buttonSound.setAttribute('id', 'ButtonSound')
    buttonSound.setAttribute('src', '/gt/music/ButtonPressed.mp3')
    buttonSound.setAttribute('autoplay', 'autoplay')
    buttonSound.volume = volume / 600
    buttonSound.play()
}
