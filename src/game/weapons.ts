import { findPassivUpgrade, percent } from '@/game/helpers'
import * as type from '@/types'
import { rotVec } from '@/game/vectors'

export function weapons(
    player: type.Player,
    generalSize: number,
    lastDirection: number,
    playerInfo: type.PlayerInfo,
    weaponObject: type.WeaponObject,
    passivObject: type.PassivObject
) {
    let shotCoolDownDuration
    const plasmas = [] as type.Plasma[]
    let moveVector: type.Vector
    switch (lastDirection) {
        case 0:
            moveVector = [0, -1]
            break
        case 180:
            moveVector = [0, 1]
            break
        case 270:
            moveVector = [-1, 0]
            break
        case 90:
            moveVector = [1, 0]
            break
        case 45:
            moveVector = [1, -1]
            break
        case 315:
            moveVector = [-1, -1]
            break
        case 225:
            moveVector = [-1, 1]
            break
        case 135:
            moveVector = [1, 1]
            break
        default:
            moveVector = [1, 0]
    }
    switch (player.weaponTree.weaponType) {
        case 'standard':
            shotCoolDownDuration =
                2000 *
                percent(weaponObject['fasterReload'] * 5, 'de') *
                (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'de') : 1)
            plasmas.push({
                moveVector: moveVector,
                vector: playerInfo.vector,
                size:
                    5 +
                    percent(percent(weaponObject['biggerProjectile'] * 10, 'in') * 10, 'in') *
                        generalSize *
                        (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
                imgsrc: '/gt/img/char/plasma.png',
                damage:
                    1 +
                    weaponObject['moreDamage'] *
                        (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
            } as type.Plasma)
            break
        case 'aimgun':
            shotCoolDownDuration =
                2500 *
                percent(weaponObject['fasterReload'] * 5, 'de') *
                (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'de') : 1)
            plasmas.push({
                moveVector: moveVector,
                vector: playerInfo.vector,
                size:
                    5 *
                    percent(weaponObject['biggerProjectile'] * 10, 'in') *
                    generalSize *
                    (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
                imgsrc: '/gt/img/char/plasma.png',
                damage:
                    1 +
                    weaponObject['moreDamage'] *
                        (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
                aim: true,
            } as type.Plasma)
            break
        case 'splitgun':
            shotCoolDownDuration =
                2000 *
                percent(weaponObject['fasterReload'] * 5, 'de') *
                (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'de') : 1)
            plasmas.push({
                moveVector: moveVector,
                vector: playerInfo.vector,
                size:
                    5 *
                    percent(weaponObject['biggerProjectile'] * 10, 'in') *
                    generalSize *
                    (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
                imgsrc: '/gt/img/char/plasma.png',
                damage:
                    1 +
                    weaponObject['moreDamage'] *
                        (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
                split: true,
            } as type.Plasma)
            break
        case 'shotgun':
            shotCoolDownDuration =
                3000 *
                percent(weaponObject['fasterReload'] * 5, 'de') *
                (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'de') : 1)
            for (let i = 0; i < 3; i++) {
                plasmas.push({
                    moveVector: rotVec(moveVector, 15 * (i - 1)),
                    vector: playerInfo.vector,
                    size:
                        2 *
                        percent(weaponObject['biggerProjectile'] * 10, 'in') *
                        generalSize *
                        (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
                    imgsrc: '/gt/img/char/plasma.png',
                    damage:
                        1 +
                        weaponObject['moreDamage'] *
                            (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
                } as type.Plasma)
            }
            break
        case 'MG':
            shotCoolDownDuration =
                1000 *
                percent(weaponObject['fasterReload'] * 5, 'de') *
                (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'de') : 1)
            plasmas.push({
                moveVector: moveVector,
                vector: playerInfo.vector,
                size:
                    5 *
                    percent(weaponObject['biggerProjectile'] * 10, 'in') *
                    generalSize *
                    (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
                imgsrc: '/gt/img/char/plasma.png',
                damage:
                    1 +
                    weaponObject['moreDamage'] *
                        (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
            } as type.Plasma)
            break
        case 'safegun':
            shotCoolDownDuration =
                10000 *
                percent(weaponObject['fasterReload'] * 5, 'de') *
                (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'de') : 1)
            for (let i = 0; i < 8; i++) {
                plasmas.push({
                    moveVector: rotVec(moveVector, (360 / 8) * i),
                    vector: playerInfo.vector,
                    size:
                        2 *
                        percent(weaponObject['biggerProjectile'] * 10, 'in') *
                        generalSize *
                        (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
                    imgsrc: '/gt/img/char/plasma.png',
                    damage:
                        1 +
                        weaponObject['moreDamage'] *
                            (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
                } as type.Plasma)
            }
            break
        case 'bazooka':
            shotCoolDownDuration =
                6000 *
                percent(weaponObject['fasterReload'] * 5, 'de') *
                (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'de') : 1)
            plasmas.push({
                moveVector: moveVector,
                vector: playerInfo.vector,
                size:
                    15 *
                    percent(weaponObject['biggerProjectile'] * 10, 'in') *
                    generalSize *
                    (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1),
                imgsrc: '/gt/img/char/plasma.png',
                damage:
                    1 +
                    weaponObject['moreDamage'] *
                        (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1) *
                        3,
            } as type.Plasma)
            break
    }
    return { shotCoolDownDuration: shotCoolDownDuration, plasmas: plasmas }
}
