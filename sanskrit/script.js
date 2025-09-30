// 梵语数据
const pairs = [
    { devanagari: "अ", iast: "a" },
    { devanagari: "आ", iast: "ā" },
    { devanagari: "इ", iast: "i" },
    { devanagari: "ई", iast: "ī" },
    { devanagari: "उ", iast: "u" },
    { devanagari: "ऊ", iast: "ū" },
    { devanagari: "ऋ", iast: "ṛ" },
    { devanagari: "ए", iast: "e" },
    { devanagari: "ओ", iast: "o" }
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer = null;
let seconds = 0;
let isGameStarted = false;

// 初始化游戏
function initGame() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";

    // 创建卡片数组
    cards = [];
    pairs.forEach(pair => {
        cards.push({
            content: pair.devanagari,
            pairId: pair.iast,
            type: "devanagari",
            matched: false,
            element: null
        });
        cards.push({
            content: pair.iast,
            pairId: pair.devanagari,
            type: "iast",
            matched: false,
            element: null
        });
    });

    // 洗牌
    cards = shuffleArray(cards);

    // 渲染卡片（初始显示内容）
    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.textContent = card.content;
        cardElement.dataset.index = index;
        cardElement.addEventListener("click", () => handleCardClick(index));
        gameBoard.appendChild(cardElement);
        card.element = cardElement;
    });

    // 重置状态
    flippedCards = [];
    matchedPairs = 0;
    isGameStarted = false;
    clearInterval(timer);
    seconds = 0;
    document.getElementById("timer").textContent = "用时: 0秒";
    document.getElementById("start-btn").disabled = false;
}

// 开始游戏
function startGame() {
    isGameStarted = true;
    document.getElementById("start-btn").disabled = true;
    
    // 隐藏所有卡片
    cards.forEach(card => {
        card.element.classList.add("hidden");
    });

    // 启动计时器
    timer = setInterval(() => {
        seconds++;
        document.getElementById("timer").textContent = `用时: ${seconds}秒`;
    }, 1000);
}

// 处理卡片点击
function handleCardClick(index) {
    if (!isGameStarted || cards[index].matched || flippedCards.includes(index)) return;

    // 翻开卡片
    cards[index].element.classList.remove("hidden");
    flippedCards.push(index);

    // 检查是否匹配
    if (flippedCards.length === 2) {
        const [firstIdx, secondIdx] = flippedCards;
        const firstCard = cards[firstIdx];
        const secondCard = cards[secondIdx];

        if (firstCard.pairId === secondCard.content) {
            // 匹配成功
            firstCard.matched = true;
            secondCard.matched = true;
            matchedPairs++;
            
            firstCard.element.classList.add("matched");
            secondCard.element.classList.add("matched");
            
            flippedCards = [];

            // 检查游戏是否结束
            if (matchedPairs === pairs.length) {
                clearInterval(timer);
                setTimeout(() => {
                    alert(`游戏完成！用时: ${seconds}秒`);
                }, 500);
            }
        } else {
            // 不匹配，延迟后重新隐藏
            setTimeout(() => {
                cards[firstIdx].element.classList.add("hidden");
                cards[secondIdx].element.classList.add("hidden");
                flippedCards = [];
            }, 1000);
        }
    }
}

// 洗牌算法
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 事件监听
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", initGame);

// 初始化
initGame();
