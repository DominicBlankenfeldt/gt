export type Vector = [number, number]
export interface Enemy {
    vector: Vector
    speed: number
    size: number
    id: string
    type: EnemyType
    imgsrc: string
    moveVector: Vector
    spawnMoveVector: Vector
    timer: number
    circle: boolean | null
    circleRadius: number
    circleDir: Dir
    isGrow: boolean
    isMagnet: boolean
}
export interface BossEnemy {
    vector: Vector
    size: number
    imgsrc: string
    moveVector: Vector
    hP: number
    maxHP: number
    speed: number
    type: BossType
}
export type BossType = 'normal' | 'hardcore' | 'totalchaos'
export type Dir = 'left' | 'right'
export type EnemyType = 'curve' | 'aimbot' | 'chasebot' | 'getbigger' | 'circle' | 'random' | 'spiral'

export interface Player {
    skillTree: SkillTree
    weaponTree: WeaponTree
    passivTree: PassivTree
    shop: Shop
    highscore: Highscore
    username: string
    img: string
    registeredAt: any
    playMode: PlayMode
    playedGames: PlayedGames
    defeatedBosses: DefeatedBosses
    spaceFleet?: string
    settings: Settings
    playedTime: number
    spaceport: Spaceport
    ship: Ship
}

export interface Highscore {
    normal: number
    hardcore: number
    totalchaos: number
}
export interface DefeatedBosses {
    normal: number
    hardcore: number
    totalchaos: number
}
export interface PlayedGames {
    normal: number
    hardcore: number
    totalchaos: number
}
export interface PlayerInfo {
    vector: Vector
    speed: number
    moveVector: Vector
    size: number
    originalSize: number
}
export interface Shop {
    currency: number
    energyCell: ShopItem
    lessStartEnemies: ShopItem
    higherDifficultyTimer: ShopItem
    lowerScoreTimer: ShopItem
    passivSlots: ShopItem
}
export interface ShopItem {
    amount: number
    reBuy: boolean
    use: boolean
    lvl: number
}
export type ShopElement = 'energyCell' | 'lessStartEnemies' | 'higherDifficultyTimer' | 'lowerScoreTimer' | 'passivSlots'
export interface Ship {
    models: Model[]
    selectedModel: Model
}
export interface Model {
    img: string
    id: number
    rarity: Rarity
}
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export interface Settings {
    abilitys: Abilitys
    moves: Moves
    musicVolume: number
    effectVolume: number
}
export interface Moves {
    up: Key
    down: Key
    left: Key
    right: Key
}
export interface Abilitys {
    1: Ability
    2: Ability
    3: Ability
    4: Ability
}
export interface Ability {
    key: Key
    name: AbilityName
}
export type AbilityName =
    | 'fastAbility'
    | 'slowAbility'
    | 'bombAbility'
    | 'shotAbility'
    | 'magnetAbility'
    | 'slowEnemyAbility'
    | 'stopTimeAbility'
    | 'growAbility'
export type Key =
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z'
    | '0'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'

export type PlayMode = 'normal' | 'hardcore' | 'totalchaos'
export interface WeaponTree {
    weaponPoints: number
    weaponType: weaponType
    weaponAvaibleTypes: weaponType[]
    weaponUpgrades: WeaponUpgrade[]
}
export type WeaponStats = {
    [key in weaponType]: WeaponStat
}
export interface WeaponStat {
    dmg: number
    reload: number
    size: number
    spheres: number
}
export type weaponType = 'standard' | 'shotgun' | 'MG' | 'aimgun' | 'splitgun' | 'safegun' | 'bazooka'
export interface WeaponUpgrade {
    name: WeaponUpgradeName
    lvl: number
}
export type WeaponObject = {
    [key in WeaponUpgradeName]: number
}
export type WeaponUpgradeName = 'moreDamage' | 'biggerProjectile' | 'fasterProjectile' | 'fasterReload' | 'moreHP' | 'scorePerHit' | 'munitionsDepot'

export interface PassivTree {
    passivType: PassivType[]
    passivPoints: number
    passivAvaibleTypes: PassivType[]
    passivUpgrades: PassivUpgrade[]
}
export interface PassivUpgrade {
    name: PassivUpgradeName
    lvl: number
}
export type PassivObject = {
    [key in PassivUpgradeName]: number
}
export type PassivUpgradeName = 'increaseScore' | 'increaseGun' | 'nerfEnemies' | 'moreItems' | 'nerfBoss' | 'longerEffects' | 'moreScrap' | 'none'
export type PassivType = 'none' | PassivUpgradeName
export interface SkillTree {
    skillPoints: number
    skills: Skill[]
}
export interface Skill {
    name: SkillName
    lvl: number
}
export type SkillObject = {
    [key in SkillName]: number
}
export type SkillName =
    | 'fastAbility'
    | 'slowAbility'
    | 'shotAbility'
    | 'bombAbility'
    | 'magnetAbility'
    | 'slowEnemyAbility'
    | 'stopTimeAbility'
    | 'growAbility'
    | 'slowEnemy'
    | 'spawnLessEnemy'
    | 'scoreMultiplicator'
    | 'betterCoin'
    | 'longerMagnet'
    | 'betterGrowPotion'
    | 'smallerBlackHole'
    | 'longerSlowEnemies'
    | 'longerStopTime'
    | 'scorePerEffect'
    | 'strongerSlowEnemies'
    | 'strongerMagnet'
    | 'friendlierDarkhole'
    | 'smallerEnemies'
    | 'shieldGenerator'

export type Outlook = 'up' | 'down' | 'right' | 'left' | 'upleft' | 'upright' | 'downleft' | 'downright'

export interface Item {
    type: Itemtype
    imgsrc: string
    vector: Vector
    size: number
    timer: number
}
export type Itemtype = 'coin' | 'blackHole' | 'growPotion' | 'clearField' | 'magnet' | 'slowEnemies' | 'stopTime'

export interface Plasma {
    size: number
    moveVector: Vector
    vector: Vector
    imgsrc: string
    damage: number
    aim?: boolean
    split?: boolean
}
export interface Spaceport {
    houses: House[]
}
export type HouseName = 'passiv' | 'weapon' | 'skill' | 'shop' | 'hangar'
export interface House {
    lvl: number
    needScore: number
    name: HouseName
}

export interface User {
    player: Player
    email: string
    role: string
    id: string
}

export interface Field {
    borderLeft: number
    borderUp: number
    borderRight: number
    borderDown: number
}
export type FleetSkillObject = {
    [key in FleetSkillName]: number
}
export interface SpaceFleet {
    founder: string
    members: string[]
    info: string
    name: string
    public: boolean
    img: string
    id?: string
    skills: FleetSkill[]
}
export interface FleetSkill {
    name: FleetSkillName
    lvl: number
}

export type FleetSkillName = 'bossEnemies' | 'bossDifficulty'
export interface SpecialScore {
    score: number
    vector: Vector
    duration: number
}
