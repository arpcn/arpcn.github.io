
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

// ================ 快速Markdown预览（修复版） ================
(function(){
  // 只在Full模式下执行，不检查PAGE_CONFIG
  if (window.location.search.includes('simple')) return;
  
  console.log('快速Markdown预览初始化...');
  
  // 配置
  const CONFIG = {
    previewTimeout: 3000, // 3秒超时
    minContentLength: 50, // 最少显示50字符
    uid: '39a393bd37490e3597370f63f89358a6' // 固定UID
  };
  
  // 获取当前页面的路径
  function getCurrentPagePath() {
    let pathname = window.location.pathname;
    if (pathname === '/' || pathname === '') {
      return '/Index';
    }
    return pathname;
  }
  
  // 直接从pre元素获取路径（备用方法）
  function getPathFromPreElement() {
    const container = document.getElementById('preload-container');
    if (!container) {
      console.log('找不到 preload-container');
      return null;
    }
    
    const preElement = container.querySelector('.preload-content pre');
    if (!preElement) {
      console.log('找不到 pre 元素');
      return null;
    }
    
    const content = preElement.textContent.trim();
    console.log('从pre元素获取的内容:', content);
    
    // 检查是否是路径格式
    if (content && (content.includes('/') || content.includes('\\'))) {
      return content;
    }
    
    return null;
  }
  
  // 构建Markdown URL
  function buildMarkdownUrl(path) {
    // 清理路径
    const cleanPath = path.trim();
    
    // 确保路径以斜杠开头
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  // 使用相对路径，会 重定向到 arpcn.top
  return `/access/39a393bd37490e3597370f63f89358a6${normalizedPath}.md`;
    
    // 或者直接使用原始URL（如果fixScript能处理）：
    // return `https://publish-01.obsidian.md/access/${CONFIG.uid}${normalizedPath}.md`;
  }
  
  // 立即显示内容
  function showPreviewContent(content) {
    console.log('显示预览内容，长度:', content.length);
    
    const container = document.getElementById('preload-container');
    if (!container) {
      console.error('找不到 preload-container');
      return;
    }
    
    // 找到pre元素
    let preElement = container.querySelector('.preload-content pre');
    if (!preElement) {
      console.error('找不到 pre 元素');
      return;
    }
    
    // 更新内容
    const maxLength = 8000; // 限制显示长度
    let displayContent = content.length > maxLength 
      ? content.substring(0, maxLength) + '\n\n... (内容加载中，显示部分预览) ...'
      : content;
    
    preElement.textContent = '\n' + displayContent + '\n';
    
    // 获取父容器
    const contentDiv = preElement.closest('.preload-content');
    if (!contentDiv) {
      console.error('找不到 preload-content div');
      return;
    }
    
    // 立即显示（不延迟）
    console.log('立即显示预览容器');
    contentDiv.style.display = 'block';
    contentDiv.style.opacity = '1';
    
    // 记录预览已显示
    window.__MD_PREVIEW_SHOWN = true;
    window.__MD_PREVIEW_TIME = Date.now();
    
    // 5秒后开始淡出
    setTimeout(() => {
      if (contentDiv && contentDiv.style.display === 'block') {
        console.log('开始淡出预览');
        contentDiv.style.transition = 'opacity 0.8s ease';
        contentDiv.style.opacity = '0';
        setTimeout(() => {
          contentDiv.style.display = 'none';
          console.log('预览已隐藏');
        }, 800);
      }
    }, 5000);
  }
  
  // 显示加载状态
  function showLoadingState() {
    const container = document.getElementById('preload-container');
    if (!container) return;
    
    const preElement = container.querySelector('.preload-content pre');
    if (preElement) {
      const originalText = preElement.textContent.trim();
      if (originalText) {
        preElement.textContent = '\n正在加载: ' + originalText + '\n\n请稍候...\n';
      }
    }
  }
  
  // 显示错误状态
  function showErrorState(error) {
    console.error('加载失败:', error);
    
    const container = document.getElementById('preload-container');
    if (!container) return;
    
    const preElement = container.querySelector('.preload-content pre');
    if (preElement) {
      const originalText = preElement.textContent.trim();
      preElement.textContent = '\n' + originalText + '\n\n⚠️ 内容加载失败\n错误: ' + error.message + '\n';
    }
  }
  
  // 主函数：获取并显示Markdown预览
  async function loadAndShowPreview() {
    console.log('开始加载Markdown预览...');
    
    // 方法1：从pre元素获取路径
    let markdownPath = getPathFromPreElement();
    
    // 方法2：如果方法1失败，使用当前页面路径
    if (!markdownPath) {
      markdownPath = getCurrentPagePath();
      console.log('使用当前页面路径:', markdownPath);
    } else {
      console.log('从pre元素获取路径:', markdownPath);
    }
    
    if (!markdownPath) {
      console.error('无法获取Markdown路径');
      return;
    }
    
    // 显示加载状态
    showLoadingState();
    
    // 构建URL
    const markdownUrl = buildMarkdownUrl(markdownPath);
    console.log('Markdown URL:', markdownUrl);
    
    try {
      // 使用Promise.race实现超时
      const fetchController = new AbortController();
      const timeoutId = setTimeout(() => {
        fetchController.abort();
        console.log('请求超时');
      }, CONFIG.previewTimeout);
      
      // 发起请求
      const response = await fetch(markdownUrl, {
        signal: fetchController.signal,
        headers: {
          'Accept': 'text/markdown, text/plain, text/html',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const content = await response.text();
      
      if (content && content.length >= CONFIG.minContentLength) {
        console.log('成功获取Markdown内容，长度:', content.length);
        showPreviewContent(content);
      } else {
        console.warn('获取的内容太短:', content.length);
        showErrorState(new Error('内容太短或为空'));
      }
      
    } catch (error) {
      console.error('获取Markdown失败:', error);
      showErrorState(error);
      
      // 如果是网络错误，3秒后重试一次
      if (error.name === 'AbortError' || error.message.includes('Network')) {
        console.log('3秒后重试...');
        setTimeout(() => {
          if (!window.__MD_PREVIEW_SHOWN) {
            loadAndShowPreview();
          }
        }, 3000);
      }
    }
  }
  
  // 初始化
  function init() {
    console.log('初始化Markdown预览...');
    
    // 立即开始，不等待DOMContentLoaded
    const startDelay = 200; // 200ms后开始
    
    if (document.readyState === 'loading') {
      // 如果DOM还在加载，等DOMContentLoaded后再等200ms
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(loadAndShowPreview, startDelay);
      });
    } else {
      // 如果DOM已经加载完成，直接开始
      setTimeout(loadAndShowPreview, startDelay);
    }
    
    // 添加一个后备检查：5秒后如果还没显示，再试一次
    setTimeout(() => {
      if (!window.__MD_PREVIEW_SHOWN) {
        console.log('5秒后检查，重新尝试加载...');
        loadAndShowPreview();
      }
    }, 5000);
  }
  
  // 立即开始
  init();
  
  // 导出函数供调试
  window.__debugMarkdownPreview = {
    reload: loadAndShowPreview,
    showPreview: showPreviewContent,
    getPath: getPathFromPreElement
  };
  
})();
