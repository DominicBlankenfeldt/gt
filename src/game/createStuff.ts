import { borderCheck, findPassivUpgrade, findSkill, findWeaponUpgrade, percent, getRandomInt } from '@/game/helpers'
import * as type from '@/types'
import { addVec, dirVec, lenVec, mulVec, norVec, rotVec, subVec } from '@/game/vectors'
export function createEnemy(enemies: type.Enemy[], generalSize: number, field: type.Field, player: type.Player) {
    let size = 0
    const vector = [0, 0] as type.Vector
    let type = ''
    let imgsrc = ''
    let timer = 0
    let moveArray = [0, 0] as type.Vector
    let circleDir = ''
    switch (getRandomInt(4)) {
        case 0:
            imgsrc = '/gt/img/char/enemy_pingu.png'
            break
        case 1:
            imgsrc = '/gt/img/char/enemy_cupcake.gif'
            break
        case 2:
            imgsrc = '/gt/img/char/enemy_gasman.gif'
            break
        case 3:
            imgsrc = '/gt/img/char/enemy_komet.gif'
            break
    }
    switch (getRandomInt(3)) {
        case 0:
            size = 20 * generalSize
            break
        case 1:
            size = 25 * generalSize
            break
        case 2:
            size = 30 * generalSize
            break
    }
    switch (getRandomInt(4)) {
        case 0:
            vector[1] = field.borderUp - size
            moveArray = [(Math.random() - 0.5) * 2, 1]
            break
        case 1:
            vector[1] = field.borderDown
            moveArray = [(Math.random() - 0.5) * 2, -1]
            break
        case 2:
            vector[0] = field.borderRight
            moveArray = [-1, (Math.random() - 0.5) * 2]
            break
        case 3:
            vector[0] = field.borderLeft - size
            moveArray = [1, (Math.random() - 0.5) * 2]
            break
    }
    moveArray = norVec(moveArray)
    if (!vector[0]) vector[0] = getRandomInt(field.borderRight - field.borderLeft) + field.borderLeft
    if (!vector[1]) vector[1] = getRandomInt(field.borderDown - field.borderUp) + field.borderUp
    switch (getRandomInt(7)) {
        case 0:
            type = 'curve'
            break
        case 1:
            type = 'aimbot'
            break
        case 2:
            type = 'chasebot'
            timer = 450
            break
        case 3:
            type = 'getbigger'
            timer = 1000
            break
        case 4:
            type = 'circle'
            break
        case 5:
            type = 'random'
            timer = 900
            break
        case 6:
            type = 'spiral'
            timer = 100
            break
    }
    switch (getRandomInt(2)) {
        case 0:
            circleDir = 'left'
            break
        case 1:
            circleDir = 'right'
            break
    }

    if (type == 'aimbot') moveArray = dirVec(player.vector, vector)
    enemies.push({
        speed: 1,
        vector: vector,
        size: size,
        id: JSON.stringify(Math.random()),
        type: type as type.EnemyType,
        imgsrc: imgsrc,
        spawnMoveVector: moveArray as type.Vector,
        moveVector: moveArray as type.Vector,
        timer: timer,
        circle: false,
        circleRadius: Math.random() * 0.02 + 0.01,
        circleDir: circleDir as type.Dir,
        isGrow: false,
        isMagnet: false,
    })
    return enemies
}
export function createItems(isStopTime: boolean, generalSize: number, player: type.Player, items: type.Item[], field: type.Field) {
    if (isStopTime) return
    let type = ''
    const vector = [0, 0] as type.Vector
    let size = 20 * generalSize
    let imgsrc = ''

    switch (getRandomInt(7)) {
        case 0:
            type = 'coin'
            size = (getRandomInt(25) + 20) * generalSize
            imgsrc = '/gt/img/items/coin/coin.gif'
            break
        case 1:
            type = 'blackHole'
            size = 20 * percent(findSkill(player, 'smallerBlackHole'), 'de') * generalSize
            imgsrc = '/gt/img/items/darkhole/darkhole.png'
            break
        case 2:
            type = 'growPotion'
            size = (getRandomInt(25) + 20) * generalSize
            imgsrc = '/gt/img/items/potion/potion.gif'
            break
        case 3:
            type = 'clearField'
            imgsrc = '/gt/img/items/bomb/bomb.gif'
            break
        case 4:
            type = 'magnet'
            imgsrc = '/gt/img/items/magnet/magnet.png'
            size = (getRandomInt(25) + 20) * generalSize
            break
        case 5:
            type = 'slowEnemies'
            imgsrc = '/gt/img/items/snowflake/snowflake.png'
            size = (getRandomInt(25) + 20) * generalSize
            break
        case 6:
            type = 'stopTime'
            imgsrc = '/gt/img/items/clock/clock.png'
            size = (getRandomInt(25) + 20) * generalSize
            break
    }
    do {
        vector[0] = getRandomInt(field.borderRight - field.borderLeft - size) + field.borderLeft
        vector[1] = getRandomInt(field.borderDown - field.borderUp - size) + field.borderUp
    } while (lenVec(subVec(vector, player.vector)) < 200 * generalSize)
    items.push({
        type: type as type.Itemtype,
        imgsrc: imgsrc,
        vector: vector,
        size: size,
        timer: 450, // 7.5sek
    })
    return items
}
