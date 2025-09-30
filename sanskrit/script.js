// 梵语天城体-拉丁转写配对数据
const pairs = [
    { devanagari: "अ", iast: "a" },
    { devanagari: "आ", iast: "ā" },
    { devanagari: "इ", iast: "i" },
    { devanagari: "ई", iast: "ī" },
    { devanagari: "उ", iast: "u" },
    { devanagari: "ऊ", iast: "ū" },
    { devanagari: "ऋ", iast: "ṛ" },
    { devanagari: "ए", iast: "e" },
    { devanagari: "ओ", iast: "o" },
    { devanagari: "क", iast: "ka" },
    { devanagari: "ख", iast: "kha" },
    { devanagari: "ग", iast: "ga" },
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;

// 初始化游戏
function initGame() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    flippedCards = [];
    matchedPairs = 0;
    score = 0;
    updateScore();

    // 创建卡片数组（每对两张）
    cards = [];
    pairs.forEach(pair => {
        cards.push({ content: pair.devanagari, type: "devanagari", matched: false });
        cards.push({ content: pair.iast, type: "iast", matched: false });
    });

    // 洗牌
    cards = shuffleArray(cards);

    // 渲染卡片
    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.index = index;
        cardElement.addEventListener("click", flipCard);
        gameBoard.appendChild(cardElement);
    });
}

// 洗牌算法（Fisher-Yates）
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 翻牌逻辑
function flipCard() {
    const cardIndex = parseInt(this.dataset.index);
    const card = cards[cardIndex];

    // 如果牌已匹配或已翻开，则忽略
    if (card.matched || flippedCards.includes(cardIndex)) return;

    // 翻开牌
    this.textContent = card.content;
    this.classList.add("flipped");
    flippedCards.push(cardIndex);

    // 如果翻开了两张牌，检查是否匹配
    if (flippedCards.length === 2) {
        const [firstIndex, secondIndex] = flippedCards;
        const firstCard = cards[firstIndex];
        const secondCard = cards[secondIndex];

        // 检查是否匹配（天城体对应转写）
        const isMatch = 
            (firstCard.type === "devanagari" && secondCard.type === "iast" && 
             pairs.some(p => p.devanagari === firstCard.content && p.iast === secondCard.content)) ||
            (firstCard.type === "iast" && secondCard.type === "devanagari" && 
             pairs.some(p => p.iast === firstCard.content && p.devanagari === secondCard.content));

        if (isMatch) {
            // 匹配成功
            cards[firstIndex].matched = true;
            cards[secondIndex].matched = true;
            matchedPairs++;
            score += 10;
            updateScore();
            flippedCards = [];

            // 检查游戏是否结束
            if (matchedPairs === pairs.length) {
                setTimeout(() => alert(`恭喜！你的得分是 ${score}！`), 500);
            }
        } else {
            // 不匹配，翻回去
            setTimeout(() => {
                document.querySelector(`.card[data-index="${firstIndex}"]`).textContent = "";
                document.querySelector(`.card[data-index="${secondIndex}"]`).textContent = "";
                document.querySelector(`.card[data-index="${firstIndex}"]`).classList.remove("flipped");
                document.querySelector(`.card[data-index="${secondIndex}"]`).classList.remove("flipped");
                flippedCards = [];
            }, 1000);
        }
    }
}

// 更新分数显示
function updateScore() {
    document.getElementById("score").textContent = `得分: ${score}`;
}

// 重置游戏
document.getElementById("reset-btn").addEventListener("click", initGame);

// 初始化游戏
initGame();
