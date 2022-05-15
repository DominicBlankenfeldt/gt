import { findSkill, percent, getRandomInt } from '@/game/helpers'
import * as type from '@/types'
import { dirVec, lenVec, norVec, subVec } from '@/game/vectors'
export function createEnemy(
    enemies: type.Enemy[],
    generalSize: number,
    field: type.Field,
    skillObject: type.SkillObject,
    playerInfo: type.PlayerInfo
) {
    let size = 0
    const vector = [0, 0] as type.Vector
    let type = ''
    let imgsrc = ''
    let timer = 0
    timer++
    let moveArray = [0, 0] as type.Vector
    let circleDir = ''
    switch (getRandomInt(3)) {
        case 0:
            size = 25 * generalSize * percent(skillObject['smallerEnemies'] / 2, 'de')
            break
        case 1:
            size = 30 * generalSize * percent(skillObject['smallerEnemies'] / 2, 'de')
            break
        case 2:
            size = 35 * generalSize * percent(skillObject['smallerEnemies'] / 2, 'de')
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
    switch (getRandomInt(6)) {
        case 0:
            type = 'curve'
            imgsrc = '/gt/img/char/enemy_space_debris1.gif'
            break
        case 1:
            type = 'aimbot'
            imgsrc = '/gt/img/char/enemy_komet.gif'
            break
        case 2:
            type = 'chasebot'
            imgsrc = '/gt/img/char/enemy_gasman.gif'
            timer = 450
            break
        case 3:
            type = 'circle'
            imgsrc = '/gt/img/char/enemy_rino_fish_spin.gif'
            break
        case 4:
            type = 'random'
            imgsrc = '/gt/img/char/enemy_blue-nebula.gif'
            timer = 900
            break
        case 5:
            type = 'spiral'
            imgsrc = '/gt/img/char/enemy_satenna.gif'
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
    if (type == 'aimbot') moveArray = dirVec(playerInfo.vector, vector)
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
        isFear: false,
    })
    return enemies
}
export function respawnEnemy(
    enemies: type.Enemy[],
    enemy: type.Enemy,
    generalSize: number,
    field: type.Field,
    skillObject: type.SkillObject,
    playerInfo: type.PlayerInfo
) {
    enemies = createEnemy(enemies, generalSize, field, skillObject, playerInfo)
    return enemies.filter(e => e != enemy)
}

export function createItems(
    isStopTime: boolean,
    generalSize: number,
    player: type.Player,
    items: type.Item[],
    field: type.Field,
    badItems: boolean,
    bossFight: boolean,
    playerInfo: type.PlayerInfo
) {
    if (isStopTime) return
    let type = ''
    const vector = [0, 0] as type.Vector
    let size = 20 * generalSize
    let imgsrc = ''
    let i = 6
    if (badItems) i = 7
    if (bossFight) i -= 2
    switch (getRandomInt(i) + (bossFight ? 2 : 0)) {
        case 0:
            type = 'coin'
            size = (getRandomInt(25) + 20) * generalSize
            imgsrc = '/gt/img/items/coin/coin.gif'
            break
        case 1:
            type = 'growPotion'
            size = (getRandomInt(25) + 20) * generalSize
            imgsrc = '/gt/img/items/potion/potion.gif'
            break
        case 2:
            type = 'clearField'
            imgsrc = '/gt/img/items/bomb/bomb.gif'
            break
        case 3:
            type = 'magnet'
            imgsrc = '/gt/img/items/magnet/magnet.png'
            size = (getRandomInt(25) + 20) * generalSize
            break
        case 4:
            type = 'slowEnemies'
            imgsrc = '/gt/img/items/snowflake/snowflake.gif'
            size = (getRandomInt(25) + 20) * generalSize
            break
        case 5:
            type = 'stopTime'
            imgsrc = '/gt/img/items/clock/clock.png'
            size = (getRandomInt(25) + 20) * generalSize
            break
        case 6:
            type = 'blackHole'
            size = 20 * percent(findSkill(player, 'smallerBlackHole'), 'de') * generalSize
            imgsrc = '/gt/img/items/darkhole/darkhole.png'
            break
    }
    do {
        vector[0] = getRandomInt(field.borderRight - field.borderLeft - size) + field.borderLeft
        vector[1] = getRandomInt(field.borderDown - field.borderUp - size) + field.borderUp
    } while (lenVec(subVec(vector, playerInfo.vector)) < 200 * generalSize)
    items.push({
        type: type as type.Itemtype,
        imgsrc: imgsrc,
        vector: vector,
        size: size,
        timer: 450, // 7.5sek
    })
    return items
}
