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
    strongerMagnet: { name: 'super Magnet', maxlvl: 20, tier: 2, description: 'enhances the slow magnet effect' },
    friendlierDarkhole: { name: 'friendlier Darkhole', maxlvl: 20, tier: 2, description: 'weakens the attraction of the black holes' },
    smallerEnemies: { name: 'cute enemies', maxlvl: 20, tier: 2, description: 'makes enemies smaller' },
    shieldGenerator: { name: 'shield generator', maxlvl: 5, tier: 3, description: 'regularly gives you a shield' },
}
export const weaponDetails = {
    moreDamage: { name: 'power weapon', maxlvl: 10, tier: 1, description: 'your plasma makes more damage' },
    biggerProjectile: { name: 'big plasma', maxlvl: 10, tier: 1, description: 'your plasma gets bigger' },
    fasterProjectile: { name: 'high frequency', maxlvl: 10, tier: 1, description: 'your plasma gets faster' },
    fasterReload: { name: 'load automatically', maxlvl: 10, tier: 1, description: 'increases your reload speed' },
    moreHP: { name: 'defense systems', maxlvl: 2, tier: 10, description: 'gives you more HP' },
    standard: { description: 'the standard gun', maxlvl: 0 },
    shotgun: { description: 'shot 3 plasmas', maxlvl: 0 },
    MG: { description: 'faster reload', maxlvl: 0 },
    aimgun: { description: 'plamsa pursues enemies', maxlvl: 0 },
    splitgun: { description: 'plasma shatters after collision', maxlvl: 0 },
    safegun: { description: 'throws plasma around the player', maxlvl: 0 },
}
export const weaponAmount = Object.values(weaponDetails).filter(w => !w.maxlvl).length
export const passivDetails = {
    increaseScore: { name: 'increaseScore', maxlvl: 50, description: 'increases overall score gain' },
    increaseGun: { name: 'increaseGun', maxlvl: 50, description: 'increases all weapon stats' },
    nerfEnemies: { name: 'nerfEnemies', maxlvl: 50, description: 'less enemies and they are slower' },
    moreItems: { name: 'moreItems', maxlvl: 50, description: 'more items spawn' },
    nerfBoss: { name: 'nerfBoss', maxlvl: 50, description: 'reduce boss hp and slow it down' },
}
export const passivAmount = Object.values(passivDetails).length + 1
export const maxEnergyCell = 100
export const maxLessStartEnemies = 10
export const maxHigherDifficultyTimer = 10
export const maxLowerScoreTimer = 10
export const shopDetails = {
    energyCell: { name: 'energyCell', max: maxEnergyCell, description: 'is needed to use abilities', cost: 1 },
    lessStartEnemies: { name: 'lessStartEnemies', max: maxLessStartEnemies, description: 'fewer enemies appear at the beginning', cost: 10 },
    higherDifficultyTimer: {
        name: 'higherDifficultyTimer',
        max: maxHigherDifficultyTimer,
        description: 'it takes longer to increase the difficulty',
        cost: 10,
    },
    lowerScoreTimer: { name: 'lowerScoreTimer', max: maxLowerScoreTimer, description: 'the score growth is increased faster', cost: 10 },
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
    player.hP = player.hP || 1
    player.size = player.size || 20
    player.originalSize = player.originalSize || 20
    player.vector = player.vector || [0, 0]
    player.moveVector = player.moveVector || [0, 0]
    player.speed = player.speed || 5
    player.highscore = player.highscore || 0
    player.highscoreHardcore = player.highscoreHardcore || 0
    player.highscoreTotalchaos = player.highscoreTotalchaos || 0
    player.username = player.username || 'gast'
    player.img = player.img || ''
    player.registeredAt = player.registeredAt || new Date().toJSON()
    player.playedGames = player.playedGames || 0
    player.playedHardcore = player.playedHardcore || 0
    player.playedTotalchaos = player.playedTotalchaos || 0
    player.defeatedBosses = player.defeatedBosses || 0
    player.defeatedBossesTotalchaos = player.defeatedBossesTotalchaos || 0
    player.defeatedBossesHardcore = player.defeatedBossesHardcore || 0
    player.playMode = player.playMode || 'normal'
    player.playedTime = player.playedTime || 0
    player.shop = player.shop || { currency: 0, energyCell: 0, reBuy: { energyCell: true } }
    player.shop.currency = player.shop.currency || 0
    for (const shopElement of ['energyCell', 'lessStartEnemies', 'higherDifficultyTimer', 'lowerScoreTimer']) {
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
    for (const weaponUpgrade of ['moreDamage', 'biggerProjectile', 'fasterProjectile', 'fasterReload', 'moreHP']) {
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
    for (const skill of [
        'shotAbility',
        'fastAbility',
        'slowAbility',
        'bombAbility',
        'magnetAbility',
        'slowEnemyAbility',
        'stopTimeAbility',
        'growAbility',
    ]) {
        if (checkSkill(player, skill)) {
            player.skillTree.skills.push({ name: skill as type.SkillName, lvl: 0 })
        }
    }
    for (const skill of [
        'longerStopTime',
        'longerSlowEnemies',
        'slowEnemy',
        'spawnLessEnemy',
        'scoreMultiplicator',
        'betterCoin',
        'longerMagnet',
        'betterGrowPotion',
        'smallerBlackHole',
        'scorePerEffect',
        'strongerSlowEnemies',
        'strongerMagnet',
        'friendlierDarkhole',
        'smallerEnemies',
        'shieldGenerator',
    ]) {
        if (checkSkill(player, skill)) {
            player.skillTree.skills.push({ name: skill as type.SkillName, lvl: 0 })
        }
    }
    player.passivTree =
        player.passivTree ||
        ({
            passivType: 'none',
            passivAvaibleTypes: ['none'],
            passivPoints: 0,
            passivUpgrades: [] as type.PassivUpgrade[],
        } as type.PassivTree)
    for (const passivUpgrade of ['increaseScore', 'increaseGun', 'nerfEnemies', 'moreItems', 'nerfBoss']) {
        if (checkPassivUpgrade(player, passivUpgrade)) {
            player.passivTree.passivUpgrades.push({ name: passivUpgrade as type.PassivUpgradeName, lvl: 0 })
        }
    }
    player.passivTree.passivType = player.passivTree.passivType || 'none'
    player.passivTree.passivAvaibleTypes = player.passivTree.passivAvaibleTypes || ['none']
    return player
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
