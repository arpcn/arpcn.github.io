
// ================ Fix Script (Full模式) ================
(function(){
  window._originalFetch = window.fetch;
  window._originalXHROpen = XMLHttpRequest.prototype.open;
  const cache = '/cache/39a393bd37490e3597370f63f89358a6';
  const publish = 'https://publish-01.obsidian.md';
  const arpcn = 'https://arpcn.top';
  
  function replaceCacheUrl(url) {
    if (!url || typeof url !== 'string') return url;
    const hasSimple = url.includes('?simple') || url.includes('&simple');
    const hasFull = url.includes('?full') || url.includes('&full');
    const fullOriginalUrl = publish + cache;
    
    if (url === fullOriginalUrl || url.includes(fullOriginalUrl)) {
      url = url.replace(publish, arpcn);
      if (hasSimple || hasFull) return url;
      if (url.includes('?')) {
        return url + '&full';
      } else {
        return url + '?full';
      }
    }
    
    if (url === cache || url.startsWith(cache + '?')) {
      if (hasSimple || hasFull) return url;
      if (url.includes('?')) {
        return arpcn + url + '&full';
      } else {
        return arpcn + cache + '?full';
      }
    }
    return url;
  }
  
  window.fetch = function(input, init) {
    if (typeof input === 'string') {
      input = replaceCacheUrl(input);
    }
    return window._originalFetch.call(this, input, init);
  };
  
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    if (url && typeof url === 'string') {
      url = replaceCacheUrl(url);
    }
    return window._originalXHROpen.call(this, method, url, async, user, password);
  };
})();

// ================ Alternative Button Script ================
(function() {
  const fullUrl = window.location.href;
  const urlObj = new URL(fullUrl);
  window.INITIAL_URL_INFO = {
    full: fullUrl,
    pathname: urlObj.pathname,
    search: urlObj.search,
    hash: urlObj.hash,
    hasSimple: urlObj.search.includes('simple'),
    hasHash: !!urlObj.hash
  };
  
  const altBtn = document.getElementById('alt-mode-btn');
  if (altBtn) {
    altBtn.addEventListener('click', function() {
      let targetUrl = 'https://arpcn.top' + urlObj.pathname;
      if (urlObj.search) {
        if (!urlObj.search.includes('simple')) {
          targetUrl += urlObj.search + (urlObj.search.includes('?') ? '&' : '?') + 'simple';
        } else {
          targetUrl += urlObj.search;
        }
      } else {
        targetUrl += '?simple';
      }
      if (urlObj.hash) {
        targetUrl += urlObj.hash;
      }
      window.location.href = targetUrl;
    });
  }
})();

// ================ 快速Markdown预览（优化版） ================
(function(){
  // 只在Full模式下执行
  if (window.location.search.includes('simple')) return;
  
  // 配置
  const CONFIG = {
    minContentLength: 100, // 最少显示100字符
    uid: '39a393bd37490e3597370f63f89358a6'
  };
  
  // 主函数：获取并显示Markdown预览
  async function loadAndShowPreview() {
    // 1. 获取容器和内容
    const container = document.getElementById('preload-container');
    if (!container) return;
    
    const contentDiv = container.querySelector('.preload-content');
    if (!contentDiv) return;
    
    const preElement = contentDiv.querySelector('pre');
    if (!preElement) return;
    
    // 2. 获取当前内容
    const currentContent = preElement.textContent.trim();
    
    // 3. 判断内容类型
    if (currentContent.startsWith('/')) {
      // 情况1：普通用户 - 内容是路径
      await loadAndDisplayMarkdown(currentContent, preElement, contentDiv);
    } else if (currentContent.length > 200) {
      // 情况2：SEO爬虫 - 内容已经是Markdown
      contentDiv.style.display = 'block';
    }
    // 情况3：空内容 - 什么都不做
  }
  
  // 为普通用户获取并显示Markdown
  async function loadAndDisplayMarkdown(path, preElement, contentDiv) {
    // 更新为加载状态
    preElement.textContent = '\n正在加载...\n';
    
    try {
      // 构建URL - 使用相对路径让fixScript处理
      const cleanPath = path.trim();

    // markdownUrl = `/access/${CONFIG.uid}${cleanPath}.md`;
   //   markdownUrl = `https://arpcn.top/access/${CONFIG.uid}${cleanPath}.md`;
    // 或者直接使用原始URL（如果fixScript能处理）：
     markdownUrl = `https://publish-01.obsidian.md/access/${CONFIG.uid}${cleanPath}.md`;

      const response = await fetch(markdownUrl, {

        credentials: 'include'
        headers: {
          'Accept': 'text/markdown'
          // 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400'
        }

      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const content = await response.text();
      
      if (content && content.length >= CONFIG.minContentLength) {
        // 显示内容
        preElement.textContent = '\n' + content + '\n';
        contentDiv.style.display = 'block';
      } else {
        console.warn('获取的内容太短:', content.length);
        showErrorState(new Error('内容太短或为空'));
      }

    } catch (error) {
      console.error('加载失败:', error);
      preElement.textContent = '\n加载失败\n请刷新重试\n';
    }
  }

  // 初始化
  function init() {
    // 延迟100ms开始，确保DOM就绪
    const startDelay = 100;
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(loadAndShowPreview, startDelay);
      });
    } else {
      setTimeout(loadAndShowPreview, startDelay);
    }
  }
  
  // 启动
  init();
  
})();
