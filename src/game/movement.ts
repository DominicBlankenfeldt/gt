import { borderCheck, findPassivUpgrade, findWeaponUpgrade, percent, getRandomInt } from '@/game/helpers'
import * as type from '@/types'
import { addVec, dirVec, lenVecSqrt, mulVec, norVec, rotVec, subVec } from '@/game/vectors'
import { respawnEnemy } from '@/game/createStuff'
export function plasmaMovement(
    plasmas: type.Plasma[],
    enemyPlasmas: type.Plasma[],
    Enemies: type.Enemy[],
    player: type.Player,
    generalSize: number,
    field: type.Field,
    boss: type.BossEnemy
) {
    for (const plasma of plasmas) {
        if (plasma.aim) {
            const enemies = [...Enemies] as any[]
            if (boss.hP) enemies.push(boss)
            enemies.sort((a, b) => {
                return lenVecSqrt(subVec(a.vector, plasma.vector)) - lenVecSqrt(subVec(b.vector, plasma.vector))
            })
            plasma.moveVector = addVec(plasma.moveVector, dirVec(enemies[0].vector, plasma.vector))
        }
        plasma.moveVector = mulVec(
            norVec(plasma.moveVector),
            (7 + findWeaponUpgrade(player, 'fasterProjectile') / 2) *
                generalSize *
                (player.passivTree.passivType.includes('increaseGun') ? percent(findPassivUpgrade(player, 'increaseGun') / 3, 'in') : 1)
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
export function playerMovement(
    player: type.Player,
    pressedKeys: any,
    field: type.Field,
    lastDirection: number,
    generalSize: number,
    multiplicator: number,
    playerInfo: type.PlayerInfo
) {
    playerInfo.moveVector = [0, 0]

    if (pressedKeys['ArrowLeft'] || pressedKeys[player.settings.moves['left']]) playerInfo.moveVector[0] = left(playerInfo, field)
    if (pressedKeys['ArrowRight'] || pressedKeys[player.settings.moves['right']]) playerInfo.moveVector[0] = right(playerInfo, field)
    if (pressedKeys['ArrowUp'] || pressedKeys[player.settings.moves['up']]) playerInfo.moveVector[1] = up(playerInfo, field)
    if (pressedKeys['ArrowDown'] || pressedKeys[player.settings.moves['down']]) playerInfo.moveVector[1] = down(playerInfo, field)

    playerInfo.moveVector = mulVec(norVec(playerInfo.moveVector), playerInfo.speed * generalSize * multiplicator)
    playerInfo.vector = addVec(playerInfo.vector, playerInfo.moveVector)
    if (playerInfo.moveVector[0] > 0) lastDirection = 90
    if (playerInfo.moveVector[0] < 0) lastDirection = 270
    if (playerInfo.moveVector[1] > 0) lastDirection = 180
    if (playerInfo.moveVector[1] < 0) lastDirection = 0
    if (playerInfo.moveVector[0] > 0 && playerInfo.moveVector[1] > 0) lastDirection = 135
    if (playerInfo.moveVector[0] < 0 && playerInfo.moveVector[1] > 0) lastDirection = 225
    if (playerInfo.moveVector[0] > 0 && playerInfo.moveVector[1] < 0) lastDirection = 45
    if (playerInfo.moveVector[0] < 0 && playerInfo.moveVector[1] < 0) lastDirection = 315

    switch (borderCheck(playerInfo, 'inner', field)) {
        case 'right':
            playerInfo.vector[0] = field.borderRight - playerInfo.size
            break
        case 'left':
            playerInfo.vector[0] = field.borderLeft + 1
            break
        case 'up':
            playerInfo.vector[1] = field.borderUp - 2
            break
        case 'down':
            playerInfo.vector[1] = field.borderDown - (playerInfo.size + 6)
            break
    }
    return { player: player, lastDirection: lastDirection }
}
function left(playerInfo: type.PlayerInfo, field: type.Field) {
    if (!borderCheck(playerInfo, 'inner', field)) return -1
    return 0
}
function right(playerInfo: type.PlayerInfo, field: type.Field) {
    if (!borderCheck(playerInfo, 'inner', field)) {
        if (playerInfo.moveVector[0] == 0) return 1
        else return 0
    }
    return 0
}
function up(playerInfo: type.PlayerInfo, field: type.Field) {
    if (!borderCheck(playerInfo, 'inner', field)) return -1
    return 0
}
function down(playerInfo: type.PlayerInfo, field: type.Field) {
    if (!borderCheck(playerInfo, 'inner', field)) {
        if (playerInfo.moveVector[1] == 0) return 1
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
    field: type.Field,
    skillObject: type.SkillObject,
    playerInfo: type.PlayerInfo
) {
    for (const enemy of enemies) {
        if (enemy.isFear) {
            enemy.vector = fearEnemy(enemy, player, generalSize, isSlowEnemies, skillObject, playerInfo)
        } else {
            if (enemy.type == 'spiral')
                enemy.vector = moveSpiralEnemy(enemy, difficulty, player, generalSize, isSlowEnemies, skillObject) || enemy.vector
            if (enemy.type == 'circle') enemy.moveVector = moveCircleEnemy(enemy, difficulty)
            if (enemy.type == 'curve') enemy.moveVector = moveCurveEnemy(enemy)
            if (enemy.type == 'chasebot') {
                enemy.vector = moveChasebotEnemy(enemy, player, generalSize, isSlowEnemies, skillObject, playerInfo)
            } else {
                enemy.vector = addVec(
                    enemy.vector,
                    mulVec(
                        norVec(enemy.moveVector),
                        difficulty *
                            percent(skillObject['slowEnemy'], 'de') *
                            generalSize *
                            (isSlowEnemies ? 0.75 - skillObject['strongerSlowEnemies'] / 150 : 1) *
                            (player.passivTree.passivType.includes('nerfEnemies') ? percent(findPassivUpgrade(player, 'nerfEnemies') / 4, 'de') : 1) *
                            enemy.speed
                    )
                )
            }
        }
        if (borderCheck(enemy, 'outer', field)) enemies = respawnEnemy(enemies, enemy, generalSize, field, skillObject, playerInfo)
        if (enemy.type == 'chasebot' || enemy.type == 'random')
            enemy.timer ? enemy.timer-- : (enemies = respawnEnemy(enemies, enemy, generalSize, field, skillObject, playerInfo))
    }
    return enemies
}
function moveChasebotEnemy(
    enemy: type.Enemy,
    player: type.Player,
    generalSize: number,
    isSlowEnemies: boolean,
    skillObject: type.SkillObject,
    playerInfo: type.PlayerInfo
) {
    return addVec(
        enemy.vector,
        mulVec(
            dirVec(playerInfo.vector, enemy.vector),
            2 *
                generalSize *
                (isSlowEnemies ? 0.75 - skillObject['strongerSlowEnemies'] / 150 : 1) *
                (player.passivTree.passivType.includes('nerfEnemies') ? percent(findPassivUpgrade(player, 'nerfEnemies') / 4, 'de') : 1) *
                enemy.speed
        )
    )
}
function fearEnemy(
    enemy: type.Enemy,
    player: type.Player,
    generalSize: number,
    isSlowEnemies: boolean,
    skillObject: type.SkillObject,
    playerInfo: type.PlayerInfo
) {
    return subVec(
        enemy.vector,
        mulVec(
            dirVec(playerInfo.vector, enemy.vector),
            2 *
                generalSize *
                (isSlowEnemies ? 0.75 - skillObject['strongerSlowEnemies'] / 150 : 1) *
                (player.passivTree.passivType.includes('nerfEnemies') ? percent(findPassivUpgrade(player, 'nerfEnemies') / 4, 'de') : 1) *
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
function moveSpiralEnemy(
    enemy: type.Enemy,
    difficulty: number,
    player: type.Player,
    generalSize: number,
    isSlowEnemies: boolean,
    skillObject: type.SkillObject
) {
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
                    percent(skillObject['slowEnemy'], 'de') *
                    generalSize *
                    (player.passivTree.passivType.includes('nerfEnemies') ? percent(findPassivUpgrade(player, 'nerfEnemies') / 4, 'de') : 1) *
                    0.4 *
                    (isSlowEnemies ? 0.75 - skillObject['strongerSlowEnemies'] / 150 : 1) *
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
