// 游戏数据
const devanagariData = {
    vowels: [
        { iast: "a", devanagari: ["अ"] },
        { iast: "ā", devanagari: ["आ", "ा"] },
        { iast: "i", devanagari: ["इ", "ि"] },
        { iast: "ī", devanagari: ["ई", "ी"] },
        { iast: "u", devanagari: ["उ", "ु"] },
        { iast: "ū", devanagari: ["ऊ", "ू"] },
        { iast: "ṛ", devanagari: ["ऋ", "ृ"] },
        { iast: "ṝ", devanagari: ["ॠ", "ॄ"] },
        { iast: "ḷ", devanagari: ["ऌ", "ॢ"] },
        { iast: "ḹ", devanagari: ["ॡ", "ॣ"] },
        { iast: "e", devanagari: ["ए", "े"] },
        { iast: "ai", devanagari: ["ऐ", "ै"] },
        { iast: "o", devanagari: ["ओ", "ो"] },
        { iast: "au", devanagari: ["औ", "ौ"] },
        { iast: "oṃ", devanagari: ["ॐ"] },
        { iast: "ḥ", devanagari: ["ः"] },
        { iast: "ṃ", devanagari: ["ं"] },
        { iast: "'", devanagari: ["ऽ"] },
        { iast: "/", devanagari: ["।"] },
        { iast: "//", devanagari: ["॥"] }
    ],
    consonants: [
        { iast: "ka", devanagari: ["क"] },
        { iast: "kha", devanagari: ["ख"] },
        { iast: "ga", devanagari: ["ग"] },
        { iast: "gha", devanagari: ["घ"] },
        { iast: "ṅa", devanagari: ["ङ"] },
        { iast: "ca", devanagari: ["च"] },
        { iast: "cha", devanagari: ["छ"] },
        { iast: "ja", devanagari: ["ज"] },
        { iast: "jha", devanagari: ["झ"] },
        { iast: "ña", devanagari: ["ञ"] },
        { iast: "ṭa", devanagari: ["ट"] },
        { iast: "ṭha", devanagari: ["ठ"] },
        { iast: "ḍa", devanagari: ["ड"] },
        { iast: "ḍha", devanagari: ["ढ"] },
        { iast: "ṇa", devanagari: ["ण"] },
        { iast: "ta", devanagari: ["त"] },
        { iast: "tha", devanagari: ["थ"] },
        { iast: "da", devanagari: ["द"] },
        { iast: "dha", devanagari: ["ध"] },
        { iast: "na", devanagari: ["न"] },
        { iast: "pa", devanagari: ["प"] },
        { iast: "pha", devanagari: ["फ"] },
        { iast: "ba", devanagari: ["ब"] },
        { iast: "bha", devanagari: ["भ"] },
        { iast: "ma", devanagari: ["म"] },
        { iast: "ya", devanagari: ["य"] },
        { iast: "ra", devanagari: ["र"] },
        { iast: "la", devanagari: ["ल"] },
        { iast: "va", devanagari: ["व"] },
        { iast: "śa", devanagari: ["श"] },
        { iast: "ṣa", devanagari: ["ष"] },
        { iast: "sa", devanagari: ["स"] },
        { iast: "ha", devanagari: ["ह"] },
        { iast: "0", devanagari: ["०"] },
        { iast: "1", devanagari: ["१"] },
        { iast: "2", devanagari: ["२"] },
        { iast: "3", devanagari: ["३"] },
        { iast: "4", devanagari: ["४"] },
        { iast: "5", devanagari: ["५"] },
        { iast: "6", devanagari: ["६"] },
        { iast: "7", devanagari: ["७"] },
        { iast: "8", devanagari: ["८"] },
        { iast: "9", devanagari: ["९"] }
    ]
};


// 游戏变量
let currentPairs = [];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let isGameStarted = false;
let timer;
let seconds = 0;

// DOM元素
const gameBoard = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");
const pairsDisplay = document.getElementById("pairs-matched");

// 获取随机子集（6对）
function getRandomSubset(array, count = 6) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
}

// 准备游戏数据
function prepareGameData(dataType) {
    let data = [];
    if (dataType === 'vowels') {
        data = [...devanagariData.vowels];
    } else if (dataType === 'consonants') {
        data = [...devanagariData.consonants];
    } else {
        data = [...devanagariData.vowels, ...devanagariData.consonants];
    }
    
    const expandedData = [];
    data.forEach(item => {
        item.devanagari.forEach(char => {
            expandedData.push({
                iast: item.iast,
                devanagari: char
            });
        });
    });
    
    return expandedData;
}

// 初始化游戏
function initGame(dataType) {
    gameBoard.innerHTML = "";
    const allPairs = prepareGameData(dataType);
    currentPairs = getRandomSubset(allPairs);

    cards = [];
    currentPairs.forEach(pair => {
        // Devanagari卡片
        cards.push({
            content: pair.devanagari,
            pairId: pair.iast,
            type: "devanagari",
            matched: false,
            element: null
        });
        
        // IAST卡片
        cards.push({
            content: pair.iast,
            pairId: pair.devanagari,
            type: "iast",
            matched: false,
            element: null
        });
    });

    cards = shuffleArray(cards);

    // 创建卡片元素
    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.dataset.index = index;
        
        const cardContent = document.createElement("div");
        cardContent.className = "card-content";
        cardContent.textContent = card.content;
        
        cardElement.appendChild(cardContent);
        cardElement.addEventListener("click", () => handleCardClick(index));
        gameBoard.appendChild(cardElement);
        card.element = cardElement;
    });

    // 重置游戏状态
    flippedCards = [];
    matchedPairs = 0;
    isGameStarted = false;
    clearInterval(timer);
    seconds = 0;
    timerDisplay.textContent = "⏱️ 0秒";
    pairsDisplay.textContent = "✅ 0/6";
    document.getElementById("start-btn").disabled = false;
}

// 洗牌函数
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 开始游戏
function startGame() {
    if (isGameStarted) return;
    
    isGameStarted = true;
    document.getElementById("start-btn").disabled = true;
    
    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = `⏱️ ${seconds}秒`;
    }, 1000);
}

// 处理卡片点击
function handleCardClick(index) {
    if (!isGameStarted || cards[index].matched || flippedCards.includes(index)) return;

    cards[index].element.classList.add("selected");
    flippedCards.push(index);

    if (flippedCards.length === 2) {
        const [firstIdx, secondIdx] = flippedCards;
        const firstCard = cards[firstIdx];
        const secondCard = cards[secondIdx];

        const isMatched = 
            (firstCard.type === "devanagari" && firstCard.pairId === secondCard.content) ||
            (secondCard.type === "devanagari" && secondCard.pairId === firstCard.content);
        
        if (isMatched) {
            firstCard.matched = true;
            secondCard.matched = true;
            matchedPairs++;
            
            pairsDisplay.textContent = `✅ ${matchedPairs}/6`;
            
            firstCard.element.classList.remove("selected");
            secondCard.element.classList.remove("selected");
            firstCard.element.classList.add("matched");
            secondCard.element.classList.add("matched");
            
            flippedCards = [];
            if (matchedPairs === 6) {
                clearInterval(timer);
                setTimeout(() => {
                    document.getElementById('completion-time').textContent = `用时: ${seconds}秒`;
                    document.getElementById('completion-modal').classList.add('active');
                }, 500);
            }
        } else {
            setTimeout(() => {
                firstCard.element.classList.remove("selected");
                secondCard.element.classList.remove("selected");
                flippedCards = [];
            }, 800);
        }
    }
}

// 事件监听
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", () => {
    const currentMode = document.querySelector(".game-modes button.active")?.id;
    if (currentMode) {
        initGame(currentMode.replace("-btn", ""));
    }
});

// 游戏模式选择
function setupModeButton(buttonId, mode) {
    const button = document.getElementById(buttonId);
    button.addEventListener("click", function() {
        setActiveMode(this);
        initGame(mode);
    });
}

function setActiveMode(button) {
    document.querySelectorAll(".game-modes button").forEach(btn => {
        btn.classList.remove("active");
    });
    button.classList.add("active");
}

setupModeButton("vowels-btn", "vowels");
setupModeButton("consonants-btn", "consonants");
setupModeButton("mixed-btn", "mixed");

// 关闭模态框
document.getElementById('modal-close-btn').addEventListener('click', function() {
    document.getElementById('completion-modal').classList.remove('active');
});

// 默认加载元音模式
setActiveMode(document.getElementById("vowels-btn"));
initGame("vowels");
