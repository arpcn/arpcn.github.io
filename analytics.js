
// 动态创建并插入 gtag.js 脚本
const scriptTag = document.createElement('script');
scriptTag.async = true;
scriptTag.src = "https://www.googletagmanager.com/gtag/js?id=G-2V5RQ5SQ4W";

// 确保在脚本加载完成后再执行 gtag 配置
scriptTag.onload = function() {
    // 动态创建并插入内联的 gtag 配置脚本
    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-2V5RQ5SQ4W');
    `;
    // 将内联脚本添加到 <head> 中
    document.head.appendChild(inlineScript);
};

// 将 gtag.js 脚本标签添加到 <head> 中
document.head.appendChild(scriptTag);


