
const scriptTag = document.createElement('script');
scriptTag.async = true;
scriptTag.src = "https://www.googletagmanager.com/gtag/js?id=G-2V5RQ5SQ4W";

scriptTag.onload = function() {   // Ensure to perform gtag configuration only after the script has fully loaded.
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

