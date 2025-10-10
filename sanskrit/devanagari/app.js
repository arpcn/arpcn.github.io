// Firebase 配置 - 替換為你的項目配置
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

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 獲取DOM元素
const userStatsBody = document.getElementById('userStatsBody');
const gameRecordsBody = document.getElementById('gameRecordsBody');
const blacklistBody = document.getElementById('blacklistBody');
const whitelistBody = document.getElementById('whitelistBody');
const userSelect = document.getElementById('userSelect');

// 加載用戶統計數據
function loadUserStats() {
    const userStatsRef = database.ref('userStats');
    
    userStatsRef.on('value', (snapshot) => {
        userStatsBody.innerHTML = ''; // 清空表格
        
        const data = snapshot.val();
        if (!data) {
            userStatsBody.innerHTML = '<tr><td colspan="7" class="text-center">暫無數據</td></tr>';
            return;
        }
        
        // 填充用戶選擇下拉框
        userSelect.innerHTML = '<option value="">-- 請選擇用戶 --</option>';
        
        Object.keys(data).forEach(uid => {
            const user = data[uid];
            const modes = user.modes || {};
            
            // 獲取最佳時間（兼容中英文鍵名）
            const getBestTime = (modeKeys) => {
                for (const key of modeKeys) {
                    if (modes[key]?.bestTime) {
                        return modes[key].bestTime;
                    }
                }
                return 'N/A';
            };
            
            // 添加到用戶統計表格
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${uid}</td>
                <td>${user.gameCount || 0}</td>
                <td>${getBestTime(['vowels', '元音'])}</td>
                <td>${getBestTime(['consonants', '輔音'])}</td>
                <td>${getBestTime(['numbers', '數字'])}</td>
                <td>${getBestTime(['mixed', '混合'])}</td>
            `;
            userStatsBody.appendChild(row);
            
            // 添加到用戶選擇下拉框
            const option = document.createElement('option');
            option.value = uid;
            option.textContent = `${user.username} (${uid})`;
            userSelect.appendChild(option);
        });
    });
}

// 加載游戲記錄數據
function loadGameRecords() {
    userSelect.addEventListener('change', (e) => {
        const uid = e.target.value;
        gameRecordsBody.innerHTML = ''; // 清空表格
        
        if (!uid) return;
        
        const gameRecordsRef = database.ref(`gameRecords/${uid}`);
        gameRecordsRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                gameRecordsBody.innerHTML = '<tr><td colspan="4" class="text-center">該用戶暫無游戲記錄</td></tr>';
                return;
            }
            
            Object.keys(data).forEach(mode => {
                const records = data[mode];
                Object.keys(records).forEach(recordId => {
                    const record = records[recordId];
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${recordId}</td>
                        <td>${mode}</td>
                        <td>${record.time}</td>
                        <td>${new Date(record.timestamp).toLocaleString()}</td>
                    `;
                    gameRecordsBody.appendChild(row);
                });
            });
        });
    });
}

// 加載黑名單數據
function loadBlacklist() {
    const blacklistRef = database.ref('blacklistedUsers');
    
    blacklistRef.on('value', (snapshot) => {
        blacklistBody.innerHTML = ''; // 清空表格
        
        const data = snapshot.val();
        if (!data) {
            blacklistBody.innerHTML = '<tr><td colspan="3" class="text-center">黑名單為空</td></tr>';
            return;
        }
        
        Object.keys(data).forEach(uid => {
            const user = data[uid];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${uid}</td>
                <td>${user.reason || '未指定原因'}</td>
                <td>${new Date(user.timestamp || Date.now()).toLocaleString()}</td>
            `;
            blacklistBody.appendChild(row);
        });
    });
}

// 加載白名單數據
function loadWhitelist() {
    const whitelistRef = database.ref('whitelistedUsers');
    
    whitelistRef.on('value', (snapshot) => {
        whitelistBody.innerHTML = ''; // 清空表格
        
        const data = snapshot.val();
        if (!data) {
            whitelistBody.innerHTML = '<tr><td colspan="3" class="text-center">白名單為空</td></tr>';
            return;
        }
        
        Object.keys(data).forEach(uid => {
            const user = data[uid];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${uid}</td>
                <td>${user.level || '普通特權'}</td>
                <td>${new Date(user.timestamp || Date.now()).toLocaleString()}</td>
            `;
            whitelistBody.appendChild(row);
        });
    });
}

// 頁面加載完成後初始化所有數據
document.addEventListener('DOMContentLoaded', () => {
    loadUserStats();
    loadGameRecords();
    loadBlacklist();
    loadWhitelist();
});
