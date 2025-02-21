
const scriptTag = document.createElement('script');
scriptTag.async = true;
scriptTag.src = "https://www.googletagmanager.com/gtag/js?id=G-2V5RQ5SQ4W";

scriptTag.onload = function() {   // 确保在脚本加载完成后再执行 gtag 配置
    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-2V5RQ5SQ4W');
    `;
    document.head.appendChild(inlineScript);
};

document.head.appendChild(scriptTag);


