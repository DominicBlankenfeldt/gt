import { percent } from '../game/helpers';
import * as type from '../types';
import { rotVec } from '../game/vectors';
import { weaponStats } from '../global';

export function weapons(
  player: type.Player,
  generalSize: number,
  lastDirection: number,
  playerInfo: type.PlayerInfo,
  weaponObject: type.WeaponObject,
  passivObject: type.PassivObject
) {
  const plasmas = [] as type.Plasma[];
  let moveVector: type.Vector;
  switch (lastDirection) {
    case 0:
      moveVector = [0, -1];
      break;
    case 180:
      moveVector = [0, 1];
      break;
    case 270:
      moveVector = [-1, 0];
      break;
    case 90:
      moveVector = [1, 0];
      break;
    case 45:
      moveVector = [1, -1];
      break;
    case 315:
      moveVector = [-1, -1];
      break;
    case 225:
      moveVector = [-1, 1];
      break;
    case 135:
      moveVector = [1, 1];
      break;
    default:
      moveVector = [1, 0];
  }
  const shotCoolDownDuration =
    weaponStats[player.weaponTree.weaponType].reload *
    1000 *
    percent(weaponObject['fasterReload'] * 1.5, 'de') *
    (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'de') : 1);
  const size =
    weaponStats[player.weaponTree.weaponType].size +
    percent(percent(weaponObject['biggerProjectile'] * 10, 'in') * 10, 'in') *
      generalSize *
      (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1);
  const damage =
    weaponStats[player.weaponTree.weaponType].dmg +
    weaponObject['moreDamage'] * (player.passivTree.passivType.includes('increaseGun') ? percent(passivObject['increaseGun'] / 2, 'in') : 1);
  switch (player.weaponTree.weaponType) {
    case 'standard':
    case 'aimgun':
    case 'splitgun':
    case 'MG':
    case 'bazooka':
      plasmas.push({
        moveVector: moveVector,
        vector: playerInfo.vector,
        size: size,
        imgsrc: '/img/char/plasma.png',
        damage: damage,
        aim: player.weaponTree.weaponType == 'aimgun' ? true : null,
      } as type.Plasma);
      break;
    case 'safegun':
      for (let i = 0; i < 8; i++) {
        plasmas.push({
          moveVector: rotVec(moveVector, (360 / 8) * i),
          vector: playerInfo.vector,
          size: size,
          imgsrc: '/img/char/plasma.png',
          damage: damage,
        } as type.Plasma);
      }
      break;
    case 'shotgun':
      for (let i = 0; i < 3; i++) {
        plasmas.push({
          moveVector: rotVec(moveVector, 15 * (i - 1)),
          vector: playerInfo.vector,
          size: size,
          imgsrc: '/img/char/plasma.png',
          damage: damage,
        } as type.Plasma);
      }
      break;
  }
  return { shotCoolDownDuration: shotCoolDownDuration, plasmas: plasmas };
}
