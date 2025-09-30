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
    
    // 展开数据，为每个devanagari字符创建一个配对项
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
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";

    // 准备游戏数据
    const allPairs = prepareGameData(dataType);
    currentPairs = getRandomSubset(allPairs);

    // 创建卡片数组
    cards = [];
    currentPairs.forEach(pair => {
        // 添加Devanagari卡片
        cards.push({
            content: pair.devanagari,
            pairId: pair.iast,  // 使用IAST作为配对ID
            type: "devanagari",
            matched: false,
            element: null
        });
        
        // 添加IAST卡片
        cards.push({
            content: pair.iast,
            pairId: pair.devanagari,  // 使用Devanagari作为配对ID
            type: "iast",
            matched: false,
            element: null
        });
    });

    // 洗牌
    cards = shuffleArray(cards);

    // 渲染卡片（3×4网格）
    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.textContent = card.content;
        cardElement.dataset.index = index;
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
    document.getElementById("timer").textContent = "用时: 0秒";
    document.getElementById("pairs-matched").textContent = "已匹配: 0/6";
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
    
    // 启动计时器
    timer = setInterval(() => {
        seconds++;
        document.getElementById("timer").textContent = `用时: ${seconds}秒`;
    }, 1000);
}

// 处理卡片点击
function handleCardClick(index) {
    if (!isGameStarted || cards[index].matched || flippedCards.includes(index)) return;

    // 选中卡片
    cards[index].element.classList.add("selected");
    flippedCards.push(index);

    // 如果已经翻开了两张卡片
    if (flippedCards.length === 2) {
        const [firstIdx, secondIdx] = flippedCards;
        const firstCard = cards[firstIdx];
        const secondCard = cards[secondIdx];

        // 检查是否匹配（双向检查）
        const isMatched = 
            (firstCard.type === "devanagari" && firstCard.pairId === secondCard.content) ||
            (secondCard.type === "devanagari" && secondCard.pairId === firstCard.content);
        
        if (isMatched) {
            // 匹配成功
            firstCard.matched = true;
            secondCard.matched = true;
            matchedPairs++;
            
            // 更新已匹配对计数
            document.getElementById("pairs-matched").textContent = `已匹配: ${matchedPairs}/6`;
            
            // 移除选中状态并添加匹配状态
            firstCard.element.classList.remove("selected");
            secondCard.element.classList.remove("selected");
            firstCard.element.classList.add("matched");
            secondCard.element.classList.add("matched");
            
            flippedCards = [];

            // 检查游戏是否结束
            if (matchedPairs === 6) {
                clearInterval(timer);
                setTimeout(() => alert(`恭喜完成！用时: ${seconds}秒`), 300);
            }
        } else {
            // 不匹配，延迟后恢复
            setTimeout(() => {
                firstCard.element.classList.remove("selected");
                secondCard.element.classList.remove("selected");
                flippedCards = [];
            }, 1000);
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
document.getElementById("vowels-btn").addEventListener("click", function() {
    setActiveMode(this);
    initGame("vowels");
});

document.getElementById("consonants-btn").addEventListener("click", function() {
    setActiveMode(this);
    initGame("consonants");
});

document.getElementById("mixed-btn").addEventListener("click", function() {
    setActiveMode(this);
    initGame("mixed");
});

// 设置活动模式按钮样式
function setActiveMode(button) {
    document.querySelectorAll(".game-modes button").forEach(btn => {
        btn.classList.remove("active");
    });
    button.classList.add("active");
}

// 默认加载元音模式
setActiveMode(document.getElementById("vowels-btn"));
initGame("vowels");
