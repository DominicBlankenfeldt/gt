import * as tf from "@tensorflow/tfjs";
import { any, Tensor } from "@tensorflow/tfjs";
import { Enemy, Item, Player } from "./types";
import * as API from "@/API";

function d([x1, y1]: [number, number], [x2, y2]: [number, number]): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
function min(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): [number, number] {
  return [x1 - x2, y1 - y2];
}
function mul(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number]
): [number, number] {
  return [x1 * x2, y1 * y2];
}
function gaussianRand() {
  let rand = 0;

  for (let i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
}

export function getNewGeneration(players: Player[]): Player[] {
  const MUTATION_RATE = 0.1;

  const newPlayers: Player[] = [];

  players = players.sort((p1, p2) => (p1.score > p2.score ? -1 : 1));

  let highscores = API.getData("highscores") as number[];
  if (!highscores) highscores = [];
  highscores.push(players[0].score);
  API.setData("highscores", highscores);
  console.log("highscore", players[0].score);
  console.log("lowscore", players[players.length - 1].score);

  let player = "" as any;
  for (player in players) {
    player = parseInt(player);
    players[player].survived++;

    const AIPlayer = players[0] as Player & {
      getWeigths: () => Tensor[];
    };
    const weights = AIPlayer.getWeigths();

    const mutatedWeights = tf.tidy(() => {
      const mutatedWeights = [];
      for (let i = 0; i < weights.length; i++) {
        const tensor = weights[i];
        const shape = weights[i].shape;
        const values = tensor.dataSync().slice();
        for (let j = 0; j < values.length; j++) {
          if (Math.random() < MUTATION_RATE) {
            const w = values[j];
            Math.random() < 0.5
              ? (values[j] = w + gaussianRand())
              : (values[j] = w - gaussianRand());
            if (values[j] < 0) values[j] = 0;
            if (values[j] > 1) values[j] = 1;
          }
        }
        const newTensor = tf.tensor(values, shape);
        mutatedWeights[i] = newTensor;
      }
      return mutatedWeights;
    });
    newPlayers.push(
      createNewAIPlayer(mutatedWeights, players[player].survived)
    );
  }
  console.log(newPlayers);
  for (const player in newPlayers) {
    API.setData("player" + player, newPlayers[player]);
  }

  return newPlayers;
}

export function createNewAIPlayer(
  weights?: tf.Tensor<tf.Rank>[],
  survived?: number
): Player & { getWeigths: () => Tensor[] } {
  const NUMBER_OF_ENEMIES = 4;
  const HIDDEN_NODES = 30;

  const ITEM_VALUES = {
    coin: 1,
    clearField: 0.8,
    growPotion: 0.2,
    bomb: 0,
    "": -1,
  } as any;

  const model = tf.sequential();
  const hiddenLayer = tf.layers.dense({
    units: HIDDEN_NODES,
    inputShape: [NUMBER_OF_ENEMIES * 2 + 3],
    activation: "relu",
  });
  model.add(hiddenLayer);
  const outputLayer = tf.layers.dense({
    units: 4,
    activation: "sigmoid",
  });
  model.add(outputLayer);
  if (weights) model.setWeights(weights);

  return {
    x: 0,
    y: 0,
    score: 0,
    speed: 5,
    size: 15,
    survived: survived || 0,
    id: "AI#" + (Math.random() + "").slice(4, 9),
    color: "blue",
    getWeigths() {
      return model.getWeights();
    },
    doesMove(dir, pressedKeys, { enemies, items, border, player }) {
      const playerPos: [number, number] = [player.x, player.y];

      const closestItem =
        items.length > 0
          ? items.reduce((a, b) =>
              d([a.x, a.y], playerPos) < d([b.x, b.y], playerPos) ? a : b
            )
          : null;
      const closestEnemies = enemies
        .sort((a, b) =>
          d([a.x, a.y], playerPos) < d([b.x, b.y], playerPos) ? 1 : -1
        )
        .slice(0, NUMBER_OF_ENEMIES);

      const rescale = (v: [number, number]) =>
        mul(min(v, [border[2], border[0]]), [
          1 / (border[3] - border[2]),
          1 / (border[1] - border[0]),
        ]);
      const closestItemData = [
        ...(closestItem
          ? min(rescale([closestItem.x, closestItem.y]), rescale(playerPos))
          : [-1, -1]),
        ITEM_VALUES[closestItem?.type ?? ""] as number,
      ];
      const closestEnemiesData = closestEnemies.flatMap((e) =>
        min(rescale([e.x, e.y]), rescale(playerPos))
      );

      let inputData = [...closestItemData, ...closestEnemiesData];
      inputData = [
        ...inputData,
        ...Array(NUMBER_OF_ENEMIES * 2 + 3 - inputData.length).fill(-1),
      ];
      inputData.length = NUMBER_OF_ENEMIES * 2 + 3;

      const prediction = (
        model.predict(
          tf.tensor(inputData, [1, NUMBER_OF_ENEMIES * 2 + 3])
        ) as any
      ).arraySync()[0];

      if (dir == "up") return prediction[0] > 0.5;
      if (dir == "down") return prediction[1] > 0.5;
      if (dir == "left") return prediction[2] > 0.5;
      if (dir == "right") return prediction[3] > 0.5;
      return false;
    },
  };
}
