import * as type from '@/types'
import { subVec } from '@/game/vectors'
export function findSkill(player: type.Player, skill: type.SkillName) {
    return player.skillTree.skills.find(c => c.name == skill)!.lvl
}
export function findWeaponUpgrade(player: type.Player, weaponUpgrade: type.WeaponUpgradeName) {
    return player.weaponTree.weaponUpgrades[player.weaponTree.weaponUpgrades.findIndex(s => s.name == weaponUpgrade)].lvl
}
export function findPassivUpgrade(player: type.Player, passivUpgrade: type.PassivUpgradeName) {
    return player.passivTree.passivUpgrades[player.passivTree.passivUpgrades.findIndex(p => p.name == passivUpgrade)].lvl
}
export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max)
}
export function grow(object: type.PlayerInfo | type.Enemy, growMultiplier: number, generalSize: number) {
    object.size *= growMultiplier
    object.vector = subVec(object.vector, (object.size * generalSize) / 4)
    return object
}
export function percent(number: number, change: 'in' | 'de') {
    if (change == 'in') {
        return (number + 100) / 100
    }
    if (change == 'de') {
        return number < 100 ? (100 - number) / 100 : 0
    }
    return 1
}
export function borderCheck(
    object: type.Enemy | type.Item | type.PlayerInfo | type.Plasma | type.BossEnemy,
    border: 'inner' | 'outer',
    field: type.Field
) {
    if (border == 'inner') {
        if (object.vector[0] > field.borderRight - object.size) return 'right'
        if (object.vector[0] < field.borderLeft + 1) return 'left'
        if (object.vector[1] < field.borderUp - 2) return 'up'
        if (object.vector[1] > field.borderDown - (object.size + 6)) return 'down'
    }
    if (border == 'outer') {
        if (object.vector[0] > field.borderRight) return 'right'
        if (object.vector[0] < field.borderLeft - 1 - object.size) return 'left'
        if (object.vector[1] < field.borderUp - 1 - object.size) return 'up'
        if (object.vector[1] > field.borderDown) return 'down'
    }
    return false
}
export function roundHalf(num: number) {
    return Math.round(num * 2) / 2
}
