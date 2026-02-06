
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

// ================ 方案四：快速Markdown预览 ================

// ================ 快速Markdown预览（使用注入的路径） ================
(function(){
  // 只在Full模式下执行
  if (!window.PAGE_CONFIG || !window.PAGE_CONFIG.isFullMode) return;
  
  // 配置
  const CONFIG = {
    previewTimeout: 2000, // 2秒超时
    minContentLength: 100 // 最少显示100字符
  };
  
  // 从preload-content中获取注入的markdownPath
  function getInjectedMarkdownPath() {
    const container = document.getElementById('preload-container');
    if (!container) return null;
    
    const preElement = container.querySelector('.preload-content pre');
    if (!preElement) return null;
    
    // 获取pre元素中的内容（应该是markdownPath）
    const content = preElement.textContent.trim();
    
    // 检查是否是路径格式（包含斜杠）
    if (content && (content.includes('/') || content.includes('.'))) {
      return content;
    }
    
    return null;
  }
  
  // 构建完整的markdown URL
  function buildMarkdownUrl(markdownPath) {
    // 移除可能的前导/尾随换行符和空格
  }
  
  async function quickMarkdownPreview() {
    // 1. 从注入的内容中获取markdown路径
    const markdownPath = getInjectedMarkdownPath();
    if (!markdownPath) {
      console.warn('No markdown path injected');
      return;
    }
    
    
    const cleanPath = markdownPath.trim();
    
    // 确保路径以斜杠开头
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

    const markdownUrl = `https://publish-01.obsidian.md/access/39a393bd37490e3597370f63f89358a6${normalizedPath}.md`;

    console.log('Markdown path:', markdownPath);
    console.log('Fetching markdown from:', markdownUrl);
    
    // 2. 立即开始获取数据
    const fetchPromise = fetch(markdownUrl, {
      headers: {
        'Accept': 'text/markdown, text/plain'
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const content = await response.text();
        console.log('Markdown fetched, length:', content.length);
        return content;
      })
      .catch((error) => {
        console.warn('Markdown fetch failed:', error);
        return null;
      });
    
    // 3. 设置超时
    const timeoutPromise = new Promise(resolve => {
      setTimeout(() => {
        console.log('Preview timeout reached');
        resolve(null);
      }, CONFIG.previewTimeout);
    });
    
    // 4. 竞争：要么获取到数据，要么超时
    const markdownContent = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (markdownContent && markdownContent.length >= CONFIG.minContentLength) {
      console.log('Displaying markdown preview');
      displayQuickPreview(markdownContent);
    } else {
      console.log('No valid markdown content');
      // 不显示加载提示，保持原样
    }
    
    // 5. 继续等待完整数据
    if (!markdownContent) {
      fetchPromise.then(fullData => {
        if (fullData && fullData.length >= CONFIG.minContentLength) {
          displayQuickPreview(fullData);
        }
      });
    }
  }
  
  function displayQuickPreview(content) {
    // 找到预加载容器和pre元素
    const container = document.getElementById('preload-container');
    if (!container) {
      console.warn('preload-container not found');
      return;
    }
    
    // 找到已有的pre元素
    let preElement = container.querySelector('.preload-content pre');
    if (!preElement) {
      console.warn('pre element not found');
      return;
    }
    
    // 设置实际内容
    const maxPreviewLength = 5000;
    let displayContent = content;
    
    if (content.length > maxPreviewLength) {
      displayContent = content.substring(0, maxPreviewLength) + '\n\n... (内容加载中，显示部分预览) ...';
    }
    
    preElement.textContent = '\n' + displayContent + '\n';
    
    // 获取pre元素的父div（preload-content）
    const contentDiv = preElement.closest('.preload-content');
    
    // 延迟显示内容
    setTimeout(() => {
      if (contentDiv) {
        contentDiv.style.display = 'block';
        // 强制重绘
        contentDiv.offsetHeight;
        contentDiv.style.opacity = '1';
      }
    }, 500);
    
    // 3秒后淡出预览（当app.js渲染完成后）
    setTimeout(() => {
      if (contentDiv) {
        contentDiv.style.transition = 'opacity 0.5s ease';
        contentDiv.style.opacity = '0';
        setTimeout(() => {
          contentDiv.style.display = 'none';
        }, 500);
      }
    }, 3000);
  }
  
  // 页面加载后立即执行
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(quickMarkdownPreview, 100);
      });
    } else {
      setTimeout(quickMarkdownPreview, 100);
    }
  }
  
  // 立即初始化
  init();
})();
