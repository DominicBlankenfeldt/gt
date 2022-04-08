import { ref } from 'vue'
import * as type from '@/types'
export const production = ref(process.env.NODE_ENV === 'production' ? true : false)
export const skillDetails = {
    fastAbility: { name: 'rocket propulsion', maxlvl: 1, tier: 1, description: 'you can speed up your movement' },
    slowAbility: { name: 'sapr flame', maxlvl: 1, tier: 1, description: ' you can slow down your movement' },
    bombAbility: { name: 'remote detonator', maxlvl: 1, tier: 1, description: 'you can remote ignition the nearest bomb' },
    shotAbility: { name: 'plasma thrower', maxlvl: 1, tier: 1, description: ' you can shoot at enemies' },
    magnetAbility: { name: 'electro magnet', maxlvl: 1, tier: 2, description: 'gives you the magnet effect' },
    slowEnemyAbility: { name: 'snow machine', maxlvl: 1, tier: 2, description: 'gives you the slow enemies effect' },
    stopTimeAbility: { name: 'time machine', maxlvl: 1, tier: 2, description: 'gives you the time stop effect' },
    growAbility: { name: 'growth ray', maxlvl: 1, tier: 2, description: 'gives you the grow effect' },
    betterCoin: { name: 'golden coin', maxlvl: 20, tier: 1, description: 'the coin give more score' },
    longerSlowEnemies: { name: 'galactic freeze', maxlvl: 20, tier: 1, description: 'the enemy slow effect holds longer' },
    betterGrowPotion: { name: 'alchemist', maxlvl: 20, tier: 1, description: 'while grown you gain more score' },
    spawnLessEnemy: { name: 'cowards', maxlvl: 20, tier: 1, description: 'it takes longer for additional enemies to spawn' },
    longerStopTime: { name: 'time anomaly', maxlvl: 20, tier: 1, description: 'time stands still longer' },
    scoreMultiplicator: { name: 'golden times', maxlvl: 20, tier: 1, description: 'you gain more score over time' },
    smallerBlackHole: { name: 'cute black holes', maxlvl: 20, tier: 1, description: 'black holes are smaller' },
    slowEnemy: { name: 'braking fog', maxlvl: 20, tier: 1, description: 'enemies will slow down' },
    longerMagnet: { name: 'permanent magnet', maxlvl: 20, tier: 1, description: 'the magnet lasts longer' },
    scorePerEffect: { name: 'golden effects', maxlvl: 20, tier: 2, description: 'gives you score per active effect' },
    strongerSlowEnemies: { name: 'super snowflake', maxlvl: 20, tier: 2, description: 'enhances the slow enemies effect' },
    strongerMagnet: { name: 'super Magnet', maxlvl: 20, tier: 2, description: 'enhances the magnet effect' },
    friendlierDarkhole: { name: 'friendlier Darkhole', maxlvl: 20, tier: 2, description: 'weakens the attraction of the black holes' },
    smallerEnemies: { name: 'cute enemies', maxlvl: 20, tier: 2, description: 'makes enemies smaller' },
    shieldGenerator: { name: 'shield generator', maxlvl: 5, tier: 3, description: 'regularly gives you a shield' },
}
export const weaponDetails = {
    moreDamage: { name: 'power weapon', maxlvl: 20, tier: 1, description: 'your plasma makes more damage' },
    biggerProjectile: { name: 'big plasma', maxlvl: 20, tier: 1, description: 'your plasma gets bigger' },
    fasterProjectile: { name: 'high frequency', maxlvl: 20, tier: 1, description: 'your plasma gets faster' },
    fasterReload: { name: 'load automatically', maxlvl: 20, tier: 1, description: 'increases your reload speed' },
    scorePerHit: { name: 'goldenGun', maxlvl: 20, tier: 2, description: 'increases the score received from shot enemies' },
    moreHP: { name: 'defense systems', maxlvl: 2, tier: 10, description: 'gives you more HP' },
    munitionsDepot: { name: 'munitions depot', maxlvl: 20, tier: 2, description: 'increases your energyCell storage' },

    standard: { description: 'the standard gun', maxlvl: 0 },
    shotgun: { description: 'shot 3 plasmas', maxlvl: 0 },
    MG: { description: 'faster reload', maxlvl: 0 },
    aimgun: { description: 'plamsa pursues enemies', maxlvl: 0 },
    splitgun: { description: 'plasma shatters after collision', maxlvl: 0 },
    safegun: { description: 'throws plasma around the player', maxlvl: 0 },
}
export const weaponAmount = Object.values(weaponDetails).filter(w => !w.maxlvl).length
export const passivDetails = {
    increaseScore: { name: 'all golden', maxlvl: 50, description: 'increases overall score gain' },
    increaseGun: { name: 'modern weapons', maxlvl: 50, description: 'increases all weapon stats' },
    nerfEnemies: { name: 'cute enemies', maxlvl: 50, description: 'less enemies and they are slower' },
    moreItems: { name: 'oodles itemes', maxlvl: 50, description: 'more items spawn' },
    nerfBoss: { name: 'cute boss', maxlvl: 50, description: 'reduce boss hp and slow it down' },
    longerEffects: { name: 'infinite effects', maxlvl: 50, description: 'all effects last longer' },
    moreScrap: { name: 'scrap collector', maxlvl: 50, description: 'you get more scrap' },
    none: { name: 'none', maxlvl: 0, description: '<3' },
}
export const passivAmount = Object.values(passivDetails).length
export const maxEnergyCell = 100
export const maxLessStartEnemies = 10
export const maxHigherDifficultyTimer = 10
export const maxLowerScoreTimer = 10
export const shopDetails = {
    energyCell: { name: 'energyCell', max: maxEnergyCell, maxlvl: 3, description: 'is needed to use abilities', cost: 1, upgradeCost: 2000 },
    lessStartEnemies: {
        name: 'corruption',
        max: maxLessStartEnemies,
        maxlvl: 3,
        description: 'fewer enemies appear at the beginning',
        cost: 10,
        upgradeCost: 1000,
    },
    higherDifficultyTimer: {
        name: 'easy mode',
        max: maxHigherDifficultyTimer,
        maxlvl: 3,
        description: 'it takes longer to increase the difficulty',
        cost: 10,
        upgradeCost: 1000,
    },
    lowerScoreTimer: {
        name: 'faster gold',
        max: maxLowerScoreTimer,
        maxlvl: 3,
        description: 'the score growth is increased faster',
        cost: 10,
        upgradeCost: 1000,
    },
    passivSlots: { name: 'passivSlots', maxlvl: 3, max: 3, description: 'allows to use several passive', cost: 2000, upgradeCost: 2000 },
}
export const houseDetails = {
    skill: { name: 'research lab', maxlvl: 5, description: 'increase your skills max lvl', upgradeCost: 500000 },
    weapon: { name: 'weapons lab', maxlvl: 5, description: 'increase your weaponupgrades max lvl', upgradeCost: 500000 },
    passiv: { name: 'atom lab', maxlvl: 5, description: 'increase your passivs max lvl', upgradeCost: 500000 },
}
//player

export function checkPlayer(player: type.Player) {
    player = player || {}
    player.settings = player.settings || {
        abilitys: {
            1: { key: '1', name: '' },
            2: { key: '2', name: '' },
            3: { key: '3', name: '' },
            4: { key: '4', name: '' },
        },
        moves: {
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',
        },
        musicVolume: 50,
        effectVolume: 50,
    }
    player.highscore = player.highscore || {
        normal: 0,
        hardcore: 0,
        totalchaos: 0,
    }
    player.username = player.username || 'gast'
    player.img = player.img || ''
    player.registeredAt = player.registeredAt || new Date().toJSON()
    player.playedGames = player.playedGames || {
        normal: 0,
        hardcore: 0,
        totalchaos: 0,
    }
    player.defeatedBosses = player.defeatedBosses || {
        normal: 0,
        hardcore: 0,
        totalchaos: 0,
    }
    player.playMode = player.playMode || 'normal'
    player.playedTime = player.playedTime || 0
    player.shop = player.shop || {}
    player.shop.currency = player.shop.currency || 0
    for (const shopElement of Object.keys(shopDetails)) {
        player.shop[shopElement as type.ShopElement] = player.shop[shopElement as type.ShopElement] || { amount: 0, reBuy: false, use: false, lvl: 1 }
    }
    player.weaponTree =
        player.weaponTree ||
        ({
            weaponType: 'standard',
            weaponAvaibleTypes: ['standard'],
            weaponPoints: 0,
            weaponUpgrades: [] as type.WeaponUpgrade[],
        } as type.WeaponTree)
    for (const weaponUpgrade of Object.entries(weaponDetails)
        .filter(([key, value]) => value.maxlvl)
        .flatMap(([key, value]) => key) as type.weaponType[]) {
        if (checkWeaponUpgrade(player, weaponUpgrade)) {
            player.weaponTree.weaponUpgrades.push({ name: weaponUpgrade as type.WeaponUpgradeName, lvl: 0 })
        }
    }
    player.weaponTree.weaponType = player.weaponTree.weaponType || 'standard'
    player.weaponTree.weaponAvaibleTypes = player.weaponTree.weaponAvaibleTypes || ['standard']
    player.skillTree =
        player.skillTree ||
        ({
            skillPoints: 0,
            skills: [] as type.Skill[],
        } as type.SkillTree)
    for (const skill of Object.entries(skillDetails)
        .filter(([key, value]) => value.maxlvl == 1)
        .flatMap(([key, value]) => key)) {
        if (checkSkill(player, skill)) {
            player.skillTree.skills.push({ name: skill as type.SkillName, lvl: 0 })
        }
    }
    for (const skill of Object.entries(skillDetails)
        .filter(([key, value]) => value.maxlvl != 1)
        .flatMap(([key, value]) => key)) {
        if (checkSkill(player, skill)) {
            player.skillTree.skills.push({ name: skill as type.SkillName, lvl: 0 })
        }
    }
    player.passivTree =
        player.passivTree ||
        ({
            passivType: ['none', 'none', 'none'],
            passivAvaibleTypes: [],
            passivPoints: 0,
            passivUpgrades: [] as type.PassivUpgrade[],
        } as type.PassivTree)
    for (const passivUpgrade of Object.keys(passivDetails)) {
        if (checkPassivUpgrade(player, passivUpgrade)) {
            player.passivTree.passivUpgrades.push({ name: passivUpgrade as type.PassivUpgradeName, lvl: 0 })
        }
    }
    player.spaceport = player.spaceport || {
        houses: [] as type.House[],
    }
    for (const house of Object.keys(houseDetails)) {
        if (checkHouse(player, house)) {
            player.spaceport.houses.push({ name: house as type.HouseName, lvl: 0, needScore: 0 })
        }
    }
    return player
}
function checkHouse(player: type.Player, house: string) {
    return player.spaceport.houses[player.spaceport.houses.findIndex(s => s.name == house)] === undefined
}
function checkWeaponUpgrade(player: type.Player, weaponUpgrade: string) {
    return player.weaponTree.weaponUpgrades[player.weaponTree.weaponUpgrades.findIndex(s => s.name == weaponUpgrade)] === undefined
}
function checkSkill(player: type.Player, skill: string) {
    return player.skillTree.skills[player.skillTree.skills.findIndex(s => s.name == skill)] === undefined
}
function checkPassivUpgrade(player: type.Player, passivUpgrade: string) {
    return player.passivTree.passivUpgrades[player.passivTree.passivUpgrades.findIndex(s => s.name == passivUpgrade)] === undefined
}
