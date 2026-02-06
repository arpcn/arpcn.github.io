
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

