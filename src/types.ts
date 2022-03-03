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
    vector: Vector
    speed: number
    moveVector: Vector
    size: number
    originalSize: number
    skillTree: SkillTree
    weaponTree: WeaponTree
    passivTree: PassivTree
    outlook: Outlook
    highscore: number
    highscoreHardcore: number
    highscoreTotalchaos: number
    id: string
    username: string
    img: string
    registeredAt: any
    playMode: PlayMode
    playedGames: number
    playedHardcore: number
    playedTotalchaos: number
    defeatedBosses: number
    defeatedBossesHardcore: number
    defeatedBossesTotalchaos: number
    spaceFleet?: string
    settings: Settings
}
export interface Settings {
    abilitys: Abilitys
    moves: Moves
    volume: number
}
export interface Moves {
    up: Key
    down: Key
    left: Key
    right: Key
}
export interface Abilitys {
    1: Key
    2: Key
    3: Key
    4: Key
}
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
export type weaponType = 'standard' | 'shotgun' | 'MG' | 'aimgun' | 'splitgun' | 'safegun'
export interface WeaponUpgrade {
    name: WeaponUpgradeName
    lvl: number
}
export type WeaponUpgradeName = 'moreDamage' | 'biggerProjectile' | 'fasterProjectile' | 'fasterReload'

export interface PassivTree {
    passivType: PassivType
    passivPoints: number
    passivAvaibleTypes: PassivType[]
    passivUpgrades: PassivUpgrade[]
}
export interface PassivUpgrade {
    name: PassivUpgradeName
    lvl: number
}
export type PassivUpgradeName = 'increaseScore' | 'increaseGun' | 'nerfEnemies' | 'moreItems' | 'nerfBoss'
export type PassivType = 'none' | 'increaseScore' | 'increaseGun' | 'nerfEnemies' | 'moreItems' | 'nerfBoss'
export interface SkillTree {
    skillPoints: number
    skills: Skill[]
}
export interface Skill {
    name: SkillName
    lvl: number
}
export type SkillName =
    | 'fastAbility'
    | 'slowAbility'
    | 'bombAbility'
    | 'shotAbility'
    | 'slowEnemy'
    | 'spawnLessEnemy'
    | 'scoreMultiplicator'
    | 'betterCoin'
    | 'longerMagnet'
    | 'betterGrowPotion'
    | 'smallerBlackHole'
    | 'longerSlowEnemies'
    | 'longerStopTime'

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

export type Vector = [number, number]

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
export interface SpaceFleet {
    founder: string
    members: string[]
    info: string
    name: string
    public: boolean
    img: string
    id?: string | undefined
}
