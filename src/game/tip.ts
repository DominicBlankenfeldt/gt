export function tips(tip: number) {
    switch (tip) {
        case 0:
            return ' You can press "enter" to start a round'
        case 1:
            return "Don't forget the skilltree"
        case 2:
            return 'In the skill tree you can hover over buttons for info'
        case 3:
            return 'You can unlock new items with the bosses'
        case 4:
            return 'Read the guide'
        case 5:
            return 'Press the gear wheel in the player-card for settings'
        default:
            return 'You are nice'
    }
}
