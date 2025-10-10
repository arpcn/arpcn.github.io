// 遊戲數據
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
        { iast: "'", devanagari: ["ऽ"] }
 //        { iast: "/", devanagari: ["।"] },
 //        { iast: "//", devanagari: ["॥"] }
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
        { iast: "kṣa", devanagari: ["क्ष"] },
        { iast: "jña", devanagari: ["ज्ञ"] },
    ],
    numbers: [
  //       { iast: "0", devanagari: ["०"] },
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

const firebaseConfig = {
    apiKey: "AIzaSyAvxH-5gah6gVufzNFrne-c7VfU6VSpcyQ",
    authDomain: "arbzn09.firebaseapp.com",
    databaseURL: "https://arbzn09-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "arbzn09",
    storageBucket: "arbzn09.firebasestorage.app",
    messagingSenderId: "172952488674",
    appId: "1:172952488674:web:1369dc83ac8df8c6ca6cbb",
    measurementId: "G-WNKZZ26059"
};
firebase.initializeApp(firebaseConfig);

// 遊戲變量
let currentPairs = [];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let isGameStarted = false;
let timer;
let timeElapsed = 0; // 單位：0.1秒
let pairColors = []; // 存儲每對卡片的顏色索引
let currentUsername = localStorage.getItem('devanagariGameUsername') || '';
let preloadedLeaderboardData = {
    vowels: null,
    consonants: null,
    numbers: null,
    mixed: null
};
let cachedUserHistory = []; // 內存緩存

// DOM元素
const gameBoard = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");
const pairsDisplay = document.getElementById("pairs-matched");

// 初始化時檢查用戶名
function checkUsername() {
    if (!currentUsername) {
        document.getElementById('username-modal').classList.add('active');
        document.getElementById('username-input').focus();
    } else {
        // 檢查用戶是否在黑名單中
        firebase.database().ref('blacklistedUsers/' + currentUsername.replace(/[.$#[\]/]/g, '_'))
            .once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    alert("抱歉，此賬戶已被限制使用");
                    document.getElementById('username-input').value = "";
                    document.getElementById('username-modal').classList.add('active');
                    currentUsername = "";
                    localStorage.removeItem('devanagariGameUsername');
                    updateUsernameDisplay(); // 更新顯示
                } else {
                    startGame();
                }
            })
            .catch(error => {
                console.error("檢查黑名單失敗:", error);
                startGame(); // 出錯時默認允許
            });
    }
}

// 檢查用戶是否在白名單中
function checkUserWhitelist(username) {
    const sanitizedUsername = username.replace(/[.$#[\]/]/g, '_');
    return firebase.database().ref('whitelistedUsers/' + sanitizedUsername)
        .once('value')
        .then(snapshot => snapshot.exists());
}

function clearUserData() {
    currentUsername = "";
    localStorage.removeItem('devanagariGameUsername');
    cachedUserHistory = [];
    sessionStorage.removeItem('cachedHistory');
    updateUsernameDisplay();
}

function updateUsernameDisplay() {
    const changeuserDisplay = document.getElementById('change-user-btn');
    if (currentUsername) {
        changeuserDisplay.textContent = currentUsername;
    } else {
        changeuserDisplay.textContent = "登錄";
    }
}

// 強制轉換函數
function forceTraditionalUsername(inputUsername) {
  const forcedConversionMap = {
  '会': '會',
  '论': '論',
  '双': '雙',
  '愿': '願',
  '云': '雲',
  '泽': '澤',
  // 可擴展其他需要強制轉換的字
};
  canonicalUsername =  inputUsername.replace(/[会论双愿泽]/g, char => forcedConversionMap[char] || char);
  
  return {
    displayName: canonicalUsername,
    originalInput: inputUsername // 保留原始輸入用於顯示
  };
}

// 獲取隨機子集（6對）
function getRandomSubset(array, count = 6) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
}

// 準備遊戲數據
function prepareGameData(dataType) {
    let data = [];
    if (dataType === 'vowels') {
        data = [...devanagariData.vowels];
    } else if (dataType === 'consonants') {
        data = [...devanagariData.consonants];
    } else if (dataType === 'numbers') {
        data = [...devanagariData.numbers];
    } else {
        data = [...devanagariData.vowels, ...devanagariData.consonants, ...devanagariData.numbers];
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

// 洗牌函數
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 初始化遊戲
function initGame(dataType) {
    gameBoard.innerHTML = "";
    const allPairs = prepareGameData(dataType);
    currentPairs = getRandomSubset(allPairs);

    // 為每對卡片分配顏色索引 (0-5)
    pairColors = currentPairs.map((_, index) => index % 6);

    cards = [];
    currentPairs.forEach((pair, pairIndex) => {
        // Devanagari卡片
        cards.push({
            content: pair.devanagari,
            pairId: pair.iast,
            type: "devanagari",
            matched: false,
            element: null,
            pairIndex: pairIndex // 用於匹配顏色
        });
        
        // IAST卡片
        cards.push({
            content: pair.iast,
            pairId: pair.devanagari,
            type: "iast",
            matched: false,
            element: null,
            pairIndex: pairIndex // 用於匹配顏色
        });
    });

    cards = shuffleArray(cards);

    // 創建卡片元素
    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.dataset.index = index;
        cardElement.dataset.type = card.type;
        cardElement.dataset.pair = card.pairIndex; // 添加顏色索引
        
        const cardContent = document.createElement("div");
        cardContent.className = "card-content";
        cardContent.textContent = card.content;
        
        // 使用ResizeObserver監聽尺寸變化
        const resizeObserver = new ResizeObserver(entries => {
            const card = entries[0].target;
            const fontSize = Math.min(card.offsetWidth, card.offsetHeight) * 0.4;
            card.querySelector('.card-content').style.fontSize = `${fontSize}px`;
        });
        resizeObserver.observe(cardElement);
        
        cardElement.appendChild(cardContent);
        cardElement.addEventListener("click", () => handleCardClick(index));
        gameBoard.appendChild(cardElement);
        card.element = cardElement;
    });

    // 重置遊戲狀態
    flippedCards = [];
    matchedPairs = 0;
    isGameStarted = false;
    clearInterval(timer);
    timeElapsed = 0;
    timerDisplay.textContent = "⏱️ 0.0秒";
    pairsDisplay.textContent = "✅ 0/6";
    document.getElementById("start-btn").disabled = false;

    if (currentUsername) {
        preloadUserHistory();
    }

updateUsernameDisplay();

}

// 預加載當前模式的歷史記錄（靜默執行）
function preloadUserHistory() {
    const currentMode = document.querySelector(".game-modes button.active")?.textContent;
    if (!currentMode || !currentUsername) return;
    
    const sanitizedUsername = currentUsername.replace(/[.$#[\]/]/g, '_');
    
    // 1. 優先檢查內存緩存
    if (cachedUserHistory.length > 0 && 
        cachedUserHistory[0]?.mode === currentMode) return;
    
    // 2. 檢查sessionStorage緩存
    const sessionCache = sessionStorage.getItem('cachedHistory');
    if (sessionCache) {
        const cachedData = JSON.parse(sessionCache);
        if (cachedData.length > 0 && cachedData[0]?.mode === currentMode) {
            cachedUserHistory = cachedData;
            return;
        }
    }
    
    // 3. 從Firebase加載當前模式的數據
    firebase.database().ref(`gameRecords/${sanitizedUsername}/${currentMode}`)
        .orderByChild('timestamp')
        .limitToLast(10)
        .once('value')
        .then(snapshot => {
            const records = [];
            snapshot.forEach(record => {
                records.unshift({
                    mode: currentMode,
                    time: record.val().time,
                    timestamp: record.val().timestamp // 存儲完整時間戳
                });
            });
            
            // 更新緩存
            cachedUserHistory = records;
            sessionStorage.setItem('cachedHistory', JSON.stringify(records));
        })
        .catch(error => console.log("預加載失敗（不影響遊戲）:", error));
}

// 開始遊戲
function startGame() {
    if (isGameStarted) return;
    
    isGameStarted = true;
    document.getElementById("start-btn").disabled = true;
    
    timer = setInterval(() => {
        timeElapsed++;
        const displaySeconds = (timeElapsed / 10).toFixed(1);
        timerDisplay.textContent = `⏱️ ${displaySeconds}秒`;
    }, 100); // 每0.1秒更新一次
}

// 處理卡片點擊
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

            // 遊戲完成時的處理
            if (matchedPairs === 6) {
                clearInterval(timer);
                const finishTime = (timeElapsed / 10).toFixed(1);
                const gameMode = document.querySelector(".game-modes button.active").textContent;
                const modeKey = document.querySelector(".game-modes button.active").id.replace("-btn", "");
                
                // 如果有預加載數據，直接使用
                if (preloadedLeaderboardData[modeKey]) {
                    renderLeaderboard(preloadedLeaderboardData[modeKey], gameMode, parseFloat(finishTime));
                }
                
                // 更新用戶統計并保存遊戲記錄
                updateUserStats(currentUsername, gameMode, parseFloat(finishTime))
                    .then(() => {
                        return saveGameRecord(currentUsername, gameMode, parseFloat(finishTime));
                    })
                    .then(() => {
                        // 即使有預加載數據，也更新一次確保最新
                        return getLeaderboard(gameMode, parseFloat(finishTime));
                    })
                    .catch(error => {
                        console.error("遊戲完成處理失敗:", error);
                        document.getElementById('completion-time').textContent = `用時: ${finishTime}秒`;
                        document.getElementById('completion-modal').classList.add('active');
                    });
                    
                // 新增：更新本地緩存
                const newRecord = {
                    mode: gameMode,
                    time: parseFloat(finishTime),
                    timestamp: Date.now() // 使用當前時間戳
                };
                // 更新內存緩存
                cachedUserHistory.unshift(newRecord);
                if (cachedUserHistory.length > 10) cachedUserHistory.pop();
                // 更新sessionStorage
                sessionStorage.setItem('cachedHistory', JSON.stringify(cachedUserHistory));
            }

        } else { // 配對失敗時，延遲250ms後取消選中狀態 
            setTimeout(() => {
                firstCard.element.classList.remove("selected");
                secondCard.element.classList.remove("selected");
                flippedCards = [];
            }, 250); // 延遲時間（單位：毫秒）
        }
    }
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

// 從數據庫加載排除名單
const excludedUsers = firebase.database().ref('excludedUsers').once('value')
    .then(snapshot => snapshot.val() || [])
    .catch(() => []);


// 保存遊戲記錄（按模式分開存儲，每種模式最多10條）
function saveGameRecord(username, mode, time) {

    if (excludedUsers.includes(username)) return Promise.resolve(); // 直接返回成功，但不執行任何操作

    return new Promise((resolve, reject) => {
        const sanitizedUsername = username.replace(/[.$#[\]/]/g, '_');
        const modeRecordsRef = firebase.database().ref(`gameRecords/${sanitizedUsername}/${mode}`);
        
        // 獲取當前模式下的所有記錄
        modeRecordsRef.once('value')
            .then(snapshot => {
                const records = snapshot.val() || {};
                const recordIds = Object.keys(records);
                
                // 如果已有10條記錄，刪除最舊的一條
                if (recordIds.length >= 10) {
                    let oldestRecordId = null;
                    let oldestTimestamp = Number.MAX_SAFE_INTEGER;
                    
                    // 找出時間戳最小的記錄
                    for (const id in records) {
                        if (records[id].timestamp < oldestTimestamp) {
                            oldestTimestamp = records[id].timestamp;
                            oldestRecordId = id;
                        }
                    }
                    
                    if (oldestRecordId) {
                        return modeRecordsRef.child(oldestRecordId).remove()
                            .then(() => true);
                    }
                }
                return true;
            })
            .then(() => {
                // 添加新記錄到當前模式節點下
                return modeRecordsRef.push().set({
                    time: time,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                });
            })
            .then(() => resolve())
            .catch(error => reject(error));
    });
}


// 更新用戶統計數據
function updateUserStats(username, mode, currentTime) {

    if (excludedUsers.includes(username)) return Promise.resolve(); // 直接返回成功，但不執行任何操作

    return new Promise((resolve, reject) => {
        const sanitizedUsername = username.replace(/[.$#[\]/]/g, '_');
        const userRef = firebase.database().ref(`userStats/${sanitizedUsername}`);
        
        userRef.transaction(currentData => {
            if (!currentData) {
                currentData = {
                    username: username,
                    gameCount: 1,
                    modes: {
                        [mode]: {
                            count: 1,
                            bestTime: currentTime,
                            lastPlayed: firebase.database.ServerValue.TIMESTAMP
                        }
                    }
                };
            } else {
                currentData.gameCount = (currentData.gameCount || 0) + 1;
                
                // 初始化 modes 對象如果不存在
                if (!currentData.modes) {
                    currentData.modes = {};
                }
                
                // 初始化當前模式數據如果不存在
                if (!currentData.modes[mode]) {
                    currentData.modes[mode] = {
                        count: 0,
                        bestTime: currentTime,
                        lastPlayed: firebase.database.ServerValue.TIMESTAMP
                    };
                }
                
                // 更新模式統計
                currentData.modes[mode].count += 1;
                if (currentTime < currentData.modes[mode].bestTime) {
                    currentData.modes[mode].bestTime = currentTime;
                }
                currentData.modes[mode].lastPlayed = firebase.database.ServerValue.TIMESTAMP;
            }
            return currentData;
        }, (error, committed) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

// 在遊戲初始化時預加載排行榜數據
function preloadLeaderboardData() {
    const modes = ['vowels', 'consonants', 'numbers', 'mixed'];
    
    modes.forEach(mode => {
        // 檢查是否有緩存數據
        const cachedData = sessionStorage.getItem(`leaderboard_${mode}`);
        if (cachedData) {
            preloadedLeaderboardData[mode] = JSON.parse(cachedData);
            return; // 使用緩存數據
        }
        
        // 從Firebase加載數據
        firebase.database().ref('userStats')
            .orderByChild(`modes/${mode}/bestTime`)
            .startAt(0) // 只查詢有成績的記錄
            .limitToFirst(10)
            .once('value')
            .then(snapshot => {
                const records = [];
                snapshot.forEach(userSnapshot => {
                    const userData = userSnapshot.val();
                    if (userData.modes && userData.modes[mode]) {
                        records.push({
                            username: userData.username,
                            time: userData.modes[mode].bestTime,
                            gamesPlayed: userData.modes[mode].count || 0,
                            isCurrentUser: userData.username === currentUsername
                        });
                    }
                });
                
                records.sort((a, b) => a.time - b.time);
                preloadedLeaderboardData[mode] = records;
                
                // 保存到sessionStorage
                sessionStorage.setItem(`leaderboard_${mode}`, JSON.stringify(records));
            })
            .catch(error => console.error(`預加載 ${mode} 排行榜數據失敗:`, error));
    });
}


// 獲取排行榜數據
function getLeaderboard(mode, currentTime) {
    // 查詢全局排行榜（前10名）
    const globalQuery = firebase.database().ref('userStats')
        .orderByChild(`modes/${mode}/bestTime`)
        .limitToFirst(10);
    
    // 查詢當前用戶數據（用於高亮顯示）
    const sanitizedUsername = currentUsername.replace(/[.$#[\]/]/g, '_');
    const userQuery = firebase.database().ref(`userStats/${sanitizedUsername}`);
    
    // 並行查詢
    Promise.all([globalQuery.once('value'), userQuery.once('value')])
        .then(([globalSnapshot, userSnapshot]) => {
            const records = [];
            
            // 處理全局排行榜數據
            globalSnapshot.forEach(userSnapshot => {
                const userData = userSnapshot.val();
                if (userData.modes && userData.modes[mode]) {
                    records.push({
                        username: userData.username,
                        time: userData.modes[mode].bestTime,
                        gamesPlayed: userData.modes[mode].count || 0,
                        isCurrentUser: userData.username === currentUsername
                    });
                }
            });
            
            // 添加當前用戶數據（如果不在前10名中）
            const userData = userSnapshot.val();
            if (userData && userData.modes?.[mode]) {
                const alreadyInList = records.some(r => r.username === currentUsername);
                if (!alreadyInList) {
                    records.push({
                        username: currentUsername,
                        time: userData.modes[mode].bestTime,
                        gamesPlayed: userData.modes[mode].count || 0,
                        isCurrentUser: true
                    });
                }
            }
            
            // 按時間排序（確保順序正確）
            records.sort((a, b) => a.time - b.time);
            
            // 渲染排行榜
            renderLeaderboard(records, mode, currentTime);
        })
        .catch(error => {
            console.error("獲取排行榜失敗:", error);
            // 降級處理：至少顯示完成時間和基本信息
            document.getElementById('completion-time').textContent = `用時: ${currentTime}秒`;
            document.getElementById('completion-modal').classList.add('active');
        });
}

// 渲染排行榜-支持預加載數據
function renderLeaderboard(records, mode, currentTime) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    
    // 立即顯示預加載數據
    if (records && records.length > 0) {
        leaderboardBody.innerHTML = '';
        
        records.slice(0, 10).forEach((record, index) => {
            const row = document.createElement('tr');
            if (record.isCurrentUser) {
                row.classList.add('current-user');
            }
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${record.username === currentUsername ? '👤 ' + record.username : record.username}</td>
                <td>${record.time.toFixed(1)}</td>
                <td>${record.gamesPlayed}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    } else {
        leaderboardBody.innerHTML = '<tr><td colspan="4">加載中...</td></tr>';
    }
    
    document.getElementById('completion-time').textContent = `用時: ${currentTime}秒 (模式: ${mode})`;
    document.getElementById('completion-modal').classList.add('active');
    
    // 後臺更新最新數據
    updateLeaderboard(mode, currentTime);
}

// 後臺更新排行榜數據
function updateLeaderboard(mode, currentTime) {
    const sanitizedUsername = currentUsername.replace(/[.$#[\]/]/g, '_');
    
    Promise.all([
        firebase.database().ref('userStats')
            .orderByChild(`modes/${mode}/bestTime`)
            .limitToFirst(10)
            .once('value'),
        firebase.database().ref(`userStats/${sanitizedUsername}`).once('value')
    ]).then(([globalSnapshot, userSnapshot]) => {
        const records = [];
        
        // 處理全局排行榜數據
        globalSnapshot.forEach(userSnapshot => {
            const userData = userSnapshot.val();
            if (userData.modes && userData.modes[mode]) {
                records.push({
                    username: userData.username,
                    time: userData.modes[mode].bestTime,
                    gamesPlayed: userData.modes[mode].count || 0,
                    isCurrentUser: userData.username === currentUsername
                });
            }
        });
        
        // 添加當前用戶數據（如果不在前10名中）
        const userData = userSnapshot.val();
        if (userData && userData.modes?.[mode]) {
            const alreadyInList = records.some(r => r.username === currentUsername);
            if (!alreadyInList) {
                records.push({
                    username: currentUsername,
                    time: userData.modes[mode].bestTime,
                    gamesPlayed: userData.modes[mode].count || 0,
                    isCurrentUser: true
                });
            }
        }
        
        // 按時間排序
        records.sort((a, b) => a.time - b.time);
        
        // 更新預加載數據和緩存
        preloadedLeaderboardData[mode] = records;
        sessionStorage.setItem(`leaderboard_${mode}`, JSON.stringify(records));
        
        // 如果用戶仍在查看排行榜，則更新UI
        if (document.getElementById('completion-modal').classList.contains('active')) {
            const leaderboardBody = document.getElementById('leaderboard-body');
            leaderboardBody.innerHTML = '';
            
            records.slice(0, 10).forEach((record, index) => {
                const row = document.createElement('tr');
                if (record.isCurrentUser) {
                    row.classList.add('current-user');
                }
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${record.username} ${record.isCurrentUser ? '👤' : ''}</td>
                    <td>${record.time.toFixed(1)}</td>
                    <td>${record.gamesPlayed}</td>
                `;
                leaderboardBody.appendChild(row);
            });
        }
    }).catch(error => console.error("更新排行榜失敗:", error));
}

// 加載當前模式的歷史記錄
function loadHistoryRecords() {
    const historyBody = document.getElementById('history-body');
    
    // 1. 立即顯示緩存內容
    if (cachedUserHistory.length > 0) {
        renderHistoryRecords(cachedUserHistory);
    } else {
        historyBody.innerHTML = '<tr><td colspan="3">加載中...</td></tr>';
    }

    // 2. 後臺更新最新數據（無論是否有緩存）
    const currentMode = document.querySelector(".game-modes button.active").textContent;
    const sanitizedUsername = currentUsername.replace(/[.$#[\]/]/g, '_');
    const modeRecordsRef = firebase.database().ref(`gameRecords/${sanitizedUsername}/${currentMode}`);
    
    modeRecordsRef.orderByChild('timestamp').limitToLast(10).once('value')
        .then(snapshot => {
            const records = [];
            snapshot.forEach(record => {
                records.unshift({ // 使用unshift實現倒序排列
                    mode: currentMode,
                    time: record.val().time,
                    timestamp: record.val().timestamp // 確保傳遞完整時間戳
                });
            });
            
            
            // 僅當用戶仍停留在歷史記錄面板時更新UI
            if (document.getElementById('history-container').style.display === 'block') {
            // 渲染記錄
            renderHistoryRecords(records);
            }
            
            // 更新緩存（僅緩存當前模式）
            cachedUserHistory = records;
            sessionStorage.setItem('cachedHistory', JSON.stringify(records));
        })
        .catch(error => {
            console.error("加載歷史記錄失敗:", error);
            if (cachedUserHistory.length === 0) {
                historyBody.innerHTML = '<tr><td colspan="3">加載失敗</td></tr>';
            }
        });
    
    // 顯示歷史記錄面板
    document.getElementById('history-container').style.display = 'block';
    document.getElementById('load-history-btn').style.display = 'none';
}

// 渲染歷史記錄
function renderHistoryRecords(records) {
    const historyBody = document.getElementById('history-body');
    historyBody.innerHTML = '';
    
    records.forEach(record => {
        const row = document.createElement('tr');
        const formattedDate = formatDate(record.timestamp || Date.now());
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${record.time.toFixed(1)}</td>
        `;
        historyBody.appendChild(row);
    });
}

// 事件監聽
document.getElementById("start-btn").addEventListener("click", () => {
    checkUsername();  // 原有逻辑
    resetGame();      // 新增：执行重置
});
document.getElementById("reset-btn").addEventListener("click", resetGame);
function resetGame() {
    const currentMode = document.querySelector(".game-modes button.active")?.id;
    if (currentMode) {
        initGame(currentMode.replace("-btn", ""));
    }
}

// 遊戲模式選擇
function setupModeButton(buttonId, mode) {
    const button = document.getElementById(buttonId);
    button.addEventListener("click", function() {
        setActiveMode(this);
        initGame(mode);
        if (currentUsername) {
            preloadUserHistory();
        }
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
setupModeButton("numbers-btn", "numbers");
setupModeButton("mixed-btn", "mixed");

// 關閉模態框
document.getElementById('modal-close-btn').addEventListener('click', function() {
    document.getElementById('completion-modal').classList.remove('active');
    document.getElementById('history-container').style.display = 'none';
    document.getElementById('load-history-btn').style.display = 'block';
});

// 加載歷史記錄按鈕
document.getElementById('load-history-btn').addEventListener('click', loadHistoryRecords);

// 監聽主題變化
function updateTheme() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark-mode', isDark);
}
window.matchMedia('(prefers-color-scheme: dark)').addListener(updateTheme);
updateTheme(); // 初始化

// 默認加載元音模式
setActiveMode(document.getElementById("vowels-btn"));
initGame("vowels");
// 初始化後立即預加載數據
preloadLeaderboardData();

// 用戶點擊"查看記錄"時：
document.getElementById('load-history-btn').addEventListener('click', () => {
    loadHistoryRecords(); // 瞬間顯示緩存，後臺更新
});


// 定時刷新（放在這裏確保Firebase已初始化）
const preloadInterval = setInterval(preloadLeaderboardData, 5 * 60 * 1000); // 每5分鍾刷新一次

// 可選：頁面卸載時清除定時器（避免內存泄漏）
window.addEventListener('beforeunload', () => {
    clearInterval(preloadInterval);
});

// 監聽網絡恢復事件
window.addEventListener('online', () => {
    if (currentUsername && !navigator.userAgent.includes('Firefox')) { // Firefox可能誤觸發
        setTimeout(preloadUserHistory, 3000); // 延遲執行避免阻塞
    }
});

// 切換用戶的事件監聽
// 登錄Modal
function showLoginModal() {
    document.getElementById('username-input').value = "";
    document.getElementById('username-modal').classList.add('active');
    document.getElementById('username-input').focus();
    // 重置遊戲狀態
    const currentMode = document.querySelector(".game-modes button.active")?.id;
    if (currentMode) initGame(currentMode.replace("-btn", ""));
}

document.getElementById('change-user-btn').addEventListener('click', function() {
    currentUsername ? 
        document.getElementById('user-action-dialog').style.display = 'flex' :
        showLoginModal();
});

// 對話框按鈕事件處理
document.getElementById('logout-btn').addEventListener('click', function() {
    // 退出登錄
    clearUserData();
    document.getElementById('user-action-dialog').style.display = 'none';
    updateUserButtonText(); // 可選：更新按鈕顯示為"Sign in"
});

document.getElementById('relogin-btn').addEventListener('click', function() {
    // 重新登錄
    document.getElementById('user-action-dialog').style.display = 'none';
    showLoginModal();
});

document.getElementById('cancel-btn').addEventListener('click', function() {
    // 取消操作
    document.getElementById('user-action-dialog').style.display = 'none';
});

// 點擊對話框外部關閉
document.getElementById('user-action-dialog').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});

// 可選：更新用戶按鈕顯示文本的函數
function updateUserButtonText() {
    const user = getCurrentUser(); // 假設有獲取當前用戶的函數
    const btn = document.getElementById('change-user-btn');
    btn.textContent = user ? user.username : 'Sign in';
}

// 添加回車鍵提交支持
document.getElementById('username-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('username-submit-btn').click();
    }
});


// 用戶名提交處理
document.getElementById('username-submit-btn').addEventListener('click', function() {
    let username = document.getElementById('username-input').value.trim();

    if (username) {
          const result = forceTraditionalUsername(username);
          username = result.displayName;
        // 先檢查白名單
        checkUserWhitelist(username)
            .then(isWhitelisted => {
                if (isWhitelisted) {
                    // 再檢查黑名單（原有邏輯）
                    const sanitizedUsername = username.replace(/[.$#[\]/]/g, '_');
                    return firebase.database().ref('blacklistedUsers/' + sanitizedUsername)
                        .once('value')
                        .then(snapshot => {
                            if (snapshot.exists()) {
                                throw new Error("BLACKLISTED");
                            }
                             if (result.originalInput !== result.displayName) {
                                alert(`繫統已將「${result.originalInput}」轉換為「${result.displayName}」`);
                             }
                            return username;
                        });
                } else {
                    throw new Error("NOT_WHITELISTED");
                }
            })
            .then(username => {
                currentUsername = username;
                localStorage.setItem('devanagariGameUsername', username);
                document.getElementById('username-modal').classList.remove('active');
                updateUsernameDisplay();
            })
            .catch(error => {
                if (error.message === "NOT_WHITELISTED") {
                    alert("抱歉，您不在授權用戶名單中");
                } else if (error.message === "BLACKLISTED") {
                    alert("抱歉，此賬戶已被限制使用");
                } else {
                    console.error("登錄失敗:", error);
                    alert("登錄時發生錯誤");
                }
                document.getElementById('username-input').value = "";
            });
    } else {
        alert('請輸入有效的用戶名');
    }
});

// 取消按鈕事件
document.getElementById('username-cancel-btn').addEventListener('click', function() {
    document.getElementById('username-modal').classList.remove('active');
});

// 保存原始 alert 函數
const originalAlert = window.alert;

// 重寫全局 alert 函數
window.alert = function(message) {
  const overlay = document.getElementById('custom-alert-overlay');
  const messageEl = document.getElementById('custom-alert-message');
  const confirmBtn = document.getElementById('custom-alert-confirm');
  
  // 設置消息內容
  messageEl.textContent = message;
  
  // 顯示提示框
  overlay.style.display = 'flex';
  
  // 創建并返回一個 Promise
  return new Promise((resolve) => {
    // 確認按鈕點擊處理
    const handler = () => {
      overlay.style.display = 'none';
      confirmBtn.removeEventListener('click', handler);
      resolve();
    };
    
    confirmBtn.addEventListener('click', handler);
    
    // 點擊背景關閉
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        handler();
      }
    });
    
    // ESC 鍵關閉
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        handler();
        document.removeEventListener('keydown', escHandler);
      }
    });
  });
};

// 如果需要兼容同步代碼，可以保留原始 alert 的同步行為
window.alert.sync = originalAlert;


