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
