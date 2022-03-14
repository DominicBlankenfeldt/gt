import * as type from '@/types'
//Vector calculate
export function addVec(vec1: type.Vector, vec2: type.Vector | number) {
    if (typeof vec2 == 'number') {
        return [vec1[0] + vec2, vec1[1] + vec2] as type.Vector
    } else {
        return [vec1[0] + vec2[0], vec1[1] + vec2[1]] as type.Vector
    }
}
export function addVecNum(vec: type.Vector, number: number) {
    return [vec[0] + number, vec[1] + number] as type.Vector
}
export function subVec(vec1: type.Vector, vec2: type.Vector | number) {
    if (typeof vec2 == 'number') {
        return [vec1[0] - vec2, vec1[1] - vec2] as type.Vector
    } else {
        return [vec1[0] - vec2[0], vec1[1] - vec2[1]] as type.Vector
    }
}
export function subVecVec(vec1: type.Vector, vec2: type.Vector) {
    return [vec1[0] - vec2[0], vec1[1] - vec2[1]] as type.Vector
}
export function dirVec(vec1: type.Vector, vec2: type.Vector) {
    let deltaArray = subVec(vec1, vec2) as type.Vector
    deltaArray = norVec(deltaArray)
    return deltaArray
}
export function mulVec(vec1: type.Vector, vec2: type.Vector | number) {
    if (typeof vec2 == 'number') {
        return [vec1[0] * vec2, vec1[1] * vec2] as type.Vector
    } else {
        return [vec1[0] * vec2[0], vec1[1] * vec2[1]] as type.Vector
    }
}
export function divVec(vec1: type.Vector, vec2: type.Vector | number) {
    if (typeof vec2 == 'number') {
        return [vec1[0] / vec2, vec1[1] / vec2] as type.Vector
    } else {
        return [vec1[0] / vec2[0], vec1[1] / vec2[1]] as type.Vector
    }
}
export function norVec(vec: type.Vector) {
    if (lenVec(vec) != 0) {
        return divVec(vec, lenVec(vec)) as type.Vector
    } else {
        return [0, 0] as type.Vector
    }
}
export function lenVec(vec: type.Vector) {
    return Math.sqrt(vec[0] ** 2 + vec[1] ** 2)
}
export function lenVecSqrt(vec: type.Vector) {
    return vec[0] ** 2 + vec[1] ** 2
}
export function rotVec(vec: type.Vector, angle: number) {
    const helpVec = [...vec]
    angle /= 180 / Math.PI
    helpVec[0] = vec[0] * Math.cos(angle) - vec[1] * Math.sin(angle)
    helpVec[1] = vec[0] * Math.sin(angle) + vec[1] * Math.cos(angle)
    return helpVec as type.Vector
}
