import { borderCheck, findPassivUpgrade, findSkill, findWeaponUpgrade, percent, getRandomInt } from '@/game/helpers'
import * as type from '@/types'
import { addVec, dirVec, lenVec, mulVec, norVec, rotVec, subVec } from '@/game/vectors'
import { respawnEnemy } from '@/game/createStuff'
export function plasmaMovement(
    plasmas: type.Plasma[],
    enemyPlasmas: type.Plasma[],
    Enemies: type.Enemy[],
    player: type.Player,
    generalSize: number,
    field: type.Field
) {
    for (const plasma of plasmas) {
        if (plasma.aim) {
            const enemies = [...Enemies]
            enemies.sort((a, b) => {
                return lenVec(subVec(a.vector, player.vector)) - lenVec(subVec(b.vector, player.vector))
            })
            plasma.moveVector = addVec(plasma.moveVector, dirVec(enemies[0].vector, plasma.vector))
        }
        plasma.moveVector = mulVec(
            norVec(plasma.moveVector),
            (7 + findWeaponUpgrade(player, 'fasterProjectile')) *
                generalSize *
                (player.passivTree.passivType == 'increaseGun' ? percent(findPassivUpgrade(player, 'increaseGun') / 2, 'in') : 1)
        )
        plasma.vector = addVec(plasma.vector, plasma.moveVector)
        if (borderCheck(plasma, 'outer', field)) plasmas = deletePlasma(plasmas, plasma)
    }
    for (const plasma of enemyPlasmas) {
        plasma.moveVector = mulVec(norVec(plasma.moveVector), 5 * generalSize)
        plasma.vector = addVec(plasma.vector, plasma.moveVector)
        if (borderCheck(plasma, 'outer', field)) plasmas = deletePlasma(plasmas, plasma)
    }
    return { plasmas: plasmas, enemyPlasmas: enemyPlasmas }
}
function deletePlasma(plasmas: type.Plasma[], plasma: type.Plasma) {
    return plasmas.filter(p => p != plasma)
}
export function playerMovement(player: type.Player, pressedKeys: any, field: type.Field, lastDirection: number, generalSize: number) {
    player.moveVector = [0, 0]

    if (pressedKeys['ArrowLeft'] || pressedKeys[player.settings.moves['left']]) player.moveVector[0] = left(player, field)
    if (pressedKeys['ArrowRight'] || pressedKeys[player.settings.moves['right']]) player.moveVector[0] = right(player, field)
    if (pressedKeys['ArrowUp'] || pressedKeys[player.settings.moves['up']]) player.moveVector[1] = up(player, field)
    if (pressedKeys['ArrowDown'] || pressedKeys[player.settings.moves['down']]) player.moveVector[1] = down(player, field)

    player.moveVector = mulVec(norVec(player.moveVector), player.speed * generalSize)
    player.vector = addVec(player.vector, player.moveVector)
    if (player.moveVector[0] > 0) lastDirection = 90
    if (player.moveVector[0] < 0) lastDirection = 270
    if (player.moveVector[1] > 0) lastDirection = 180
    if (player.moveVector[1] < 0) lastDirection = 0
    if (player.moveVector[0] > 0 && player.moveVector[1] > 0) lastDirection = 135
    if (player.moveVector[0] < 0 && player.moveVector[1] > 0) lastDirection = 225
    if (player.moveVector[0] > 0 && player.moveVector[1] < 0) lastDirection = 45
    if (player.moveVector[0] < 0 && player.moveVector[1] < 0) lastDirection = 315

    switch (borderCheck(player, 'inner', field)) {
        case 'right':
            player.vector[0] = field.borderRight - player.size
            break
        case 'left':
            player.vector[0] = field.borderLeft + 1
            break
        case 'up':
            player.vector[1] = field.borderUp - 2
            break
        case 'down':
            player.vector[1] = field.borderDown - (player.size + 6)
            break
    }
    return { player: player, lastDirection: lastDirection }
}
function left(player: type.Player, field: type.Field) {
    if (!borderCheck(player, 'inner', field)) return -1
    return 0
}
function right(player: type.Player, field: type.Field) {
    if (!borderCheck(player, 'inner', field)) {
        if (player.moveVector[0] == 0) return 1
        else return 0
    }
    return 0
}
function up(player: type.Player, field: type.Field) {
    if (!borderCheck(player, 'inner', field)) return -1
    return 0
}
function down(player: type.Player, field: type.Field) {
    if (!borderCheck(player, 'inner', field)) {
        if (player.moveVector[1] == 0) return 1
        else return 0
    }
    return 0
}

export function enemyMovement(
    enemies: type.Enemy[],
    difficulty: number,
    player: type.Player,
    generalSize: number,
    isSlowEnemies: boolean,
    field: type.Field
) {
    for (const enemy of enemies) {
        if (enemy.type == 'spiral') enemy.vector = moveSpiralEnemy(enemy, difficulty, player, generalSize, isSlowEnemies) || enemy.vector
        if (enemy.type == 'circle') enemy.moveVector = moveCircleEnemy(enemy, difficulty)
        if (enemy.type == 'curve') enemy.moveVector = moveCurveEnemy(enemy)
        if (enemy.type == 'chasebot') {
            enemy.vector = moveChasebotEnemy(enemy, player, generalSize, isSlowEnemies)
        } else {
            enemy.moveVector = norVec(enemy.moveVector)
            enemy.vector = addVec(
                enemy.vector,
                mulVec(
                    enemy.moveVector,
                    difficulty *
                        percent(findSkill(player, 'slowEnemy'), 'de') *
                        generalSize *
                        (isSlowEnemies ? 0.75 : 1) *
                        (player.passivTree.passivType == 'nerfEnemies' ? percent(findPassivUpgrade(player, 'nerfEnemies') / 4, 'de') : 1) *
                        enemy.speed
                )
            )
        }
        if (borderCheck(enemy, 'outer', field)) enemies = respawnEnemy(enemies, enemy, generalSize, field, player)
        if (enemy.type == 'chasebot' || enemy.type == 'random')
            enemy.timer ? enemy.timer-- : (enemies = respawnEnemy(enemies, enemy, generalSize, field, player))
    }
    return enemies
}
function moveChasebotEnemy(enemy: type.Enemy, player: type.Player, generalSize: number, isSlowEnemies: boolean) {
    return addVec(
        enemy.vector,
        mulVec(
            dirVec(player.vector, enemy.vector),
            2 *
                generalSize *
                (isSlowEnemies ? 0.75 : 1) *
                (player.passivTree.passivType == 'nerfEnemies' ? percent(findPassivUpgrade(player, 'nerfEnemies') / 4, 'de') : 1) *
                enemy.speed
        )
    )
}
function moveCurveEnemy(enemy: type.Enemy) {
    enemy.moveVector[enemy.moveVector.findIndex(v => v != 1)] > 0
        ? (enemy.moveVector[enemy.moveVector.findIndex(v => v != 1)] += 0.02 * Math.random())
        : (enemy.moveVector[enemy.moveVector.findIndex(v => v != 1)] -= 0.02 * Math.random())
    return enemy.moveVector
}
function moveSpiralEnemy(enemy: type.Enemy, difficulty: number, player: type.Player, generalSize: number, isSlowEnemies: boolean) {
    if (enemy.timer > 0) {
        enemy.timer--
    } else {
        enemy.moveVector = circle(enemy, 2) || enemy.moveVector
        enemy.moveVector = norVec(enemy.moveVector)
        return addVec(
            enemy.vector,
            mulVec(
                enemy.spawnMoveVector,
                difficulty *
                    percent(findSkill(player, 'slowEnemy'), 'de') *
                    generalSize *
                    (player.passivTree.passivType == 'nerfEnemies' ? percent(findPassivUpgrade(player, 'nerfEnemies') / 4, 'de') : 1) *
                    0.4 *
                    (isSlowEnemies ? 0.75 : 1) *
                    enemy.speed
            )
        )
    }
}
function moveCircleEnemy(enemy: type.Enemy, difficulty: number) {
    if (enemy.timer > 5000) {
        enemy.timer += 3 * Math.random()
        enemy.moveVector = enemy.spawnMoveVector
    } else {
        enemy.timer += getRandomInt(3) + difficulty + 2
        if (enemy.timer > 1000) enemy.circle = true
    }
    if (enemy.circle) enemy.moveVector = circle(enemy, 1) || enemy.moveVector
    return enemy.moveVector
}
function circle(enemy: type.Enemy, radiusMultiplier: number) {
    const acc = mulVec(rotVec(enemy.moveVector, 90), enemy.circleRadius * radiusMultiplier)
    if (enemy.circleDir == 'left') return addVec(enemy.moveVector, acc)
    if (enemy.circleDir == 'right') return subVec(enemy.moveVector, acc)
}
