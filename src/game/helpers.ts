import * as type from '@/types'
import { subVec } from '@/game/vectors'
import { hangarSize, maxCurrency } from '@/global'
export function findlvlSkill(player: type.Player, skill: type.LvlSkillName) {
    return player.lvlTree.lvlSkills.find(c => c.name == skill)!.lvl
}
export function findlvlWeaponUpgrade(player: type.Player, weaponUpgrade: type.LvlWeaponUpgradeName) {
    return player.lvlTree.lvlWeaponUpgrade.find(c => c.name == weaponUpgrade)!.lvl
}
export function findlvlPassiv(player: type.Player, passiv: type.LvlPassivName) {
    return player.lvlTree.lvlPassiv.find(c => c.name == passiv)!.lvl
}
export function findSkill(player: type.Player, skill: type.SkillName) {
    return player.skillTree.skills.find(c => c.name == skill)!.lvl
}
export function findHouse(player: type.Player, house: type.HouseName) {
    return player.spaceport.houses.find(c => c.name == house)!.lvl
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
    if (change == 'in') return (number + 100) / 100
    if (change == 'de') return 1 - 1 * (1 - Math.pow(2, -0.015 * number))
    //number < 100 ? (100 - number) / 100 : 0
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
export function sellModel(player: type.Player, model: type.Model): type.Player {
    if (player.ship.selectedModel != model) {
        switch (model.rarity) {
            case 'common':
                player.shop.currency += 10
                break
            case 'uncommon':
                player.shop.currency += 20
                break
            case 'rare':
                player.shop.currency += 30
                break
            case 'epic':
                player.shop.currency += 40
                break
            case 'legendary':
                player.shop.currency += 50
                break
        }
        if (player.shop.currency > maxCurrency) player.shop.currency = maxCurrency
        player.ship.models = player.ship.models.filter(m => m.id != model.id)
    }
    return player
}
export function buyModel(player: type.Player, max: number, rarity: number) {
    let raityString = ''
    let receiveMessage = ''
    let counter = 0
    let random = getRandomInt(100)
    const map = {
        common: 1,
        uncommon: 2,
        rare: 3,
        epic: 4,
        legendary: 5,
    }
    while (random < 30 + findHouse(player, 'hangar') * 3 && counter < max) {
        rarity++
        counter++
        random = getRandomInt(100)
    }
    switch (rarity) {
        case 0:
            break
        case 1:
            raityString = 'common'
            break
        case 2:
            raityString = 'uncommon'
            break
        case 3:
            raityString = 'rare'
            break
        case 4:
            raityString = 'epic'
            break
        case 5:
            raityString = 'legendary'
            break
    }
    if (rarity && player.ship.models.length < hangarSize) {
        receiveMessage = `you have received a ${raityString} spaceship`
        const model = {
            id: Math.random(),
            img: getRandomInt(18) + 1 + '',
            rarity: raityString as type.Rarity,
        }
        player.ship.models.push(model)
        if (player.ship.autoSell && rarity <= map[player.ship.autoSell]) {
            player = sellModel(player, model)
        }
    }
    return { player: player as type.Player, receiveMessage: receiveMessage }
}
export function int(x: number) {
    return x
}
export function payCurrency(player: type.Player, amount: number) {
    player.shop.currency += amount
    for (const task of player.daily.tasks) {
        if (task.type == 'payCurrency') {
            if (task.need > 0) {
                task.need -= amount
                if (task.need <= 0) {
                    player.daily.tasksDone++
                    player = handleGainXp(player, 100)
                }
            }
        }
    }
    return player
}
export function handleGainXp(player: type.Player, xp: number) {
    player.lvlTree.xp += xp
    if (player.lvlTree.xp >= player.lvlTree.lvl * 100) {
        player.lvlTree.lvl++
        player.lvlTree.xp = 0
    }
    return player
}
