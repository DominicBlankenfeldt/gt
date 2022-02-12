import * as type from '@/types'
export function findSkill(player: type.Player, skill: type.SkillName) {
    return player.skillTree.skills[player.skillTree.skills.findIndex(s => s.name == skill)].lvl
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
export function percent(number: number, change: 'in' | 'de') {
    if (change == 'in') {
        return (number + 100) / 100
    }
    if (change == 'de') {
        return number < 100 ? (100 - number) / 100 : 0
    }
    return 1
}
