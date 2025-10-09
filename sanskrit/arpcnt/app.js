// 你的Firebase配置
    const firebaseConfig = {
        apiKey: "AIzaSyAsevOrW7BYxlg1xH8FjGuxJKu47Udo_sc",
        authDomain: "arbzn08.firebaseapp.com",
        databaseURL: "https://arbzn08-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "arbzn08",
        storageBucket: "arbzn08.appspot.com",
        messagingSenderId: "581298403351",
        appId: "1:581298403351:web:0e6355c9b6a6a9c348c452",
        measurementId: "G-0WEQ3ED242"
    };


// 初始化Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// 登录函数（示例：邮箱/密码登录）
function loginUser(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("登录成功:", userCredential.user);
            loadFeedbackData(); // 登录成功后加载数据
        })
        .catch((error) => {
            console.error("登录失败:", error);
            alert("登录失败: " + error.message);
        });
}

// 监听认证状态变化
auth.onAuthStateChanged((user) => {
    const loginContainer = document.querySelector('.card');
    const dataTableContainer = document.getElementById('dataTableContainer');
    
    if (user) {
        // 用户已登录：隐藏登录表单，显示数据表格
        loginContainer.style.display = 'none';
        dataTableContainer.style.display = 'block';
        loadFeedbackData();
    } else {
        // 用户未登录：显示登录表单，隐藏数据表格
        loginContainer.style.display = 'block';
        dataTableContainer.style.display = 'none';
    }
});

function registerUser(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("注册成功！");
        })
        .catch((error) => {
            alert("注册失败: " + error.message);
        });
}



// 加载反馈数据（仅限已登录用户）
function loadFeedbackData() {
    const feedbackRef = database.ref('feedbacks');
    
    feedbackRef.on('value', (snapshot) => {
        const feedbackData = snapshot.val();
        const tableBody = document.getElementById('feedbackBody');
        tableBody.innerHTML = '';
        
        if (feedbackData) {
            // 遍历所有联系人
            Object.keys(feedbackData).forEach(contact => {
                // 遍历每个联系人的反馈
                Object.keys(feedbackData[contact]).forEach(feedbackId => {
                    const feedback = feedbackData[contact][feedbackId];
                    // 创建表格行
                    const row = document.createElement('tr');
                    
                    // 添加单元格
                    const contactCell = document.createElement('td');
                    contactCell.textContent = contact;
                    row.appendChild(contactCell);
                    
                    const idCell = document.createElement('td');
                    idCell.textContent = feedbackId;
                    row.appendChild(idCell);
                    
                    const textCell = document.createElement('td');
                    textCell.textContent = feedback.text;
                    row.appendChild(textCell);
                    
                    const timestampCell = document.createElement('td');
                    timestampCell.textContent = feedback.timestamp;
                    row.appendChild(timestampCell);
                    
                    const dateCell = document.createElement('td');
                    dateCell.textContent = new Date(feedback.timestamp).toLocaleString();
                    row.appendChild(dateCell);
                    
                    // 将行添加到表格
                    tableBody.appendChild(row);
                });
            });
        } else {
            // 没有数据时显示提示
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 5;
            cell.textContent = '暂无反馈数据';
            cell.className = 'text-center';
            row.appendChild(cell);
            tableBody.appendChild(row);
        }
    }, (error) => {
        console.error('读取数据失败:', error);
        alert('加载数据失败，请检查控制台获取详细信息');
    });
}

// 示例：点击登录按钮触发登录
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    loginUser(email, password);
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            alert("已退出登录");
        })
        .catch((error) => {
            alert("退出失败: " + error.message);
        });
});
