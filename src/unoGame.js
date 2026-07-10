export const UNO_COLORS = ["red", "yellow", "green", "blue"];

export const UNO_COLOR_LABELS = {
  red: "Red",
  yellow: "Yellow",
  green: "Green",
  blue: "Blue"
};

const ACTION_LABELS = {
  skip: "Skip",
  reverse: "Reverse",
  draw2: "+2",
  wild: "Wild",
  wild4: "+4"
};

export function shuffleCards(cards) {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function createUnoDeck() {
  const cards = [];

  UNO_COLORS.forEach((color) => {
    cards.push({ id: `${color}-0`, color, value: "0" });
    for (let value = 1; value <= 9; value += 1) {
      cards.push({ id: `${color}-${value}-a`, color, value: String(value) });
      cards.push({ id: `${color}-${value}-b`, color, value: String(value) });
    }
    ["skip", "reverse", "draw2"].forEach((value) => {
      cards.push({ id: `${color}-${value}-a`, color, value });
      cards.push({ id: `${color}-${value}-b`, color, value });
    });
  });

  for (let index = 0; index < 4; index += 1) {
    cards.push({ id: `wild-${index}`, color: "wild", value: "wild" });
    cards.push({ id: `wild4-${index}`, color: "wild", value: "wild4" });
  }

  return cards;
}

export function createUnoGame(playerIds) {
  const drawPile = shuffleCards(createUnoDeck());
  const hands = Object.fromEntries(playerIds.map((playerId) => [playerId, []]));

  for (let cardNumber = 0; cardNumber < 7; cardNumber += 1) {
    playerIds.forEach((playerId) => {
      hands[playerId].push(drawPile.pop());
    });
  }

  const firstCardIndex = drawPile.findIndex((card) => card.color !== "wild" && /^\d$/.test(card.value));
  const [firstCard] = drawPile.splice(firstCardIndex, 1);

  return {
    activeColor: firstCard.color,
    direction: 1,
    discardPile: [firstCard],
    drawPile,
    drawnCardId: null,
    hands,
    lastAction: { type: "start", playerId: playerIds[0] },
    moveNumber: 0,
    turnIndex: 0,
    turnOrder: playerIds,
    unoPlayerId: null,
    winnerId: null
  };
}

export function cardLabel(card) {
  return ACTION_LABELS[card?.value] || card?.value || "";
}

export function cardAriaLabel(card) {
  if (!card) return "UNO card";
  const color = card.color === "wild" ? "" : `${UNO_COLOR_LABELS[card.color]} `;
  return `${color}${ACTION_LABELS[card.value] || card.value}`.trim();
}

export function canPlayCard(card, topCard, activeColor, hand = []) {
  if (!card || !topCard) return false;
  if (card.value === "wild") return true;
  if (card.value === "wild4") {
    return !hand.some((handCard) => handCard.id !== card.id && handCard.color === activeColor);
  }
  return card.color === activeColor || card.value === topCard.value;
}

export function nextTurnIndex(turnOrder, currentIndex, direction, steps = 1) {
  if (!turnOrder.length) return 0;
  return (currentIndex + direction * steps % turnOrder.length + turnOrder.length) % turnOrder.length;
}

export function refillDrawPile(uno) {
  if (uno.drawPile.length || uno.discardPile.length <= 1) return;
  const topCard = uno.discardPile[uno.discardPile.length - 1];
  uno.drawPile = shuffleCards(uno.discardPile.slice(0, -1));
  uno.discardPile = [topCard];
}

export function drawCards(uno, playerId, count) {
  const drawn = [];
  if (!uno.hands[playerId]) uno.hands[playerId] = [];

  for (let index = 0; index < count; index += 1) {
    refillDrawPile(uno);
    const card = uno.drawPile.pop();
    if (!card) break;
    uno.hands[playerId].push(card);
    drawn.push(card);
  }

  return drawn;
}
