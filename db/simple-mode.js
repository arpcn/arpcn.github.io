

    // ================ Fix Script (Simple模式) ================
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
            return url + '&simple';
          } else {
            return url + '?simple';
          }
        }
        
        if (url === cache || url.startsWith(cache + '?')) {
          if (hasSimple || hasFull) return url;
          if (url.includes('?')) {
            return arpcn + url + '&simple';
          } else {
            return arpcn + cache + '?simple';
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

    // ================ Hash Scroll Script ================
    (function(){
      const INITIAL_HASH = (function(){const hash = window.location.hash; return hash;})();
      
      function cleanHash(hash) {
        if (!hash) return '';
        if (hash.includes('?')) {
          hash = hash.split('?')[0];
        }
        return hash;
      }
      
      function decodeHashText(hashText) {
        if (!hashText) return '';
        const specialChars = {
          '%E2%96%B7': '▶', '%E2%96%BA': '▷', '%E2%96%BB': '▻', 
          '%E2%97%80': '◀', '%E2%97%81': '◁', '%E2%97%82': '◂',
          '%26%2310183%3B': '▶', '%26%239658%3B': '▶',
          '▶': '▶', '▷': '▷', '▸': '▸', '▹': '▹', '►': '►', '▻': '▻'
        };
        let decoded = hashText;
        try {
          decoded = decodeURIComponent(hashText);
        } catch (e) {}
        for (const [encoded, decodedChar] of Object.entries(specialChars)) {
          if (decoded.includes(encoded)) {
            decoded = decoded.replace(new RegExp(encoded, 'g'), decodedChar);
          }
        }
        return decoded;
      }
      
      function highlightElement(element) {
        if (!element) return;
        const originalBg = element.style.backgroundColor;
        element.style.backgroundColor = 'rgba(66, 153, 225, 0.2)';
        element.style.transition = 'background-color 0.5s ease';
        setTimeout(() => {
          element.style.backgroundColor = originalBg;
        }, 2000);
      }
      
      function findElement(targetText) {
        if (!targetText) return null;
        
        const elementByDataHeading = document.querySelector('[data-heading="' + targetText + '"]');
        if (elementByDataHeading) return elementByDataHeading;
        
        if (targetText.includes('▶') || targetText.includes('▷') || targetText.includes('▸') || 
            targetText.includes('▹') || targetText.includes('►') || targetText.includes('▻')) {
          const cleanedTarget = targetText.replace(/[▶▷▸▹►▻◀◁◂◃]/g, '').trim();
          if (cleanedTarget && cleanedTarget !== targetText) {
            const allDataHeadings = document.querySelectorAll('[data-heading]');
            for (let el of allDataHeadings) {
              const dataHeading = el.getAttribute('data-heading');
              if (dataHeading && dataHeading.includes(cleanedTarget)) return el;
            }
            const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
            for (let el of allElements) {
              if (el.textContent && el.textContent.includes(cleanedTarget)) return el;
            }
          }
          const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
          for (let el of allElements) {
            if (el.textContent && el.textContent.includes(targetText)) return el;
          }
          for (let el of allElements) {
            if (el.textContent && el.textContent.trim().startsWith(targetText)) return el;
          }
        }
        
        if (targetText.includes('-')) {
          let element = document.querySelector('[data-heading="' + targetText + '"]');
          if (element) return element;
          const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          for (let heading of headingElements) {
            if (heading.textContent && heading.textContent.includes(targetText)) return heading;
          }
        }
        
        let element = document.getElementById(targetText);
        if (element) return element;
        
        const encodedId = encodeURIComponent(targetText);
        element = document.getElementById(encodedId);
        if (element) return element;
        
        const cleanedTarget = targetText.replace(/^[▶▷▸▹►▻◀◁◂◃•▪\\s]*/, '').trim();
        if (cleanedTarget && cleanedTarget !== targetText) {
          element = document.querySelector('[data-heading="' + cleanedTarget + '"]');
          if (element) return element;
        }
        
        const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (let heading of headingElements) {
          const text = heading.textContent.trim();
          if (text === targetText) return heading;
          const cleanedHeadingText = text.replace(/^[▶▷▸▹►▻◀◁◂◃•▪\\s]*/, '').trim();
          if (cleanedHeadingText === cleanedTarget) return heading;
        }
        
        const allElements = document.querySelectorAll('*');
        for (let el of allElements) {
          if (el.textContent && el.textContent.trim() === targetText) return el;
        }
        return null;
      }
      
      function scrollUsingMarkdownContainer(element) {
        if (!element) return false;
        const markdownContainer = document.querySelector('.markdown-preview-view');
        if (!markdownContainer) {
          const possibleContainers = ['.render-container', '.site-body', '.main-content', 'article', '[role="main"]', 'main'];
          for (const selector of possibleContainers) {
            const container = document.querySelector(selector);
            if (container) {
              const elementRect = element.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();
              const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
              container.scrollTop = relativeTop - 100;
              setTimeout(() => { highlightElement(element); }, 300);
              return true;
            }
          }
          return false;
        }
        const containerRect = markdownContainer.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const relativeTop = elementRect.top - containerRect.top + markdownContainer.scrollTop;
        markdownContainer.scrollTop = relativeTop - 100;
        setTimeout(() => { highlightElement(element); }, 300);
        return true;
      }
      
      function forceScrollWithLastResort(element) {
        if (!element) return;
        const containers = [
          document.documentElement, document.body,
          document.querySelector('.render-container'),
          document.querySelector('.site-body'),
          document.querySelector('.markdown-preview-view')
        ].filter(Boolean);
        containers.forEach(container => {
          container.style.overflow = 'auto';
          container.style.overflowY = 'auto';
        });
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const targetScroll = Math.max(0, elementTop - 100);
        const scrollAttempts = [
          () => { document.documentElement.scrollTop = targetScroll; document.body.scrollTop = targetScroll; },
          () => { window.scrollTo(0, targetScroll); },
          () => { scrollUsingMarkdownContainer(element); },
          () => { window.scrollTo({top: targetScroll, behavior: 'smooth'}); }
        ];
        scrollAttempts.forEach((attempt, index) => {
          setTimeout(() => {
            try { attempt(); } catch (e) { console.error('Scroll attempt failed:', e); }
          }, index * 300);
        });
        setTimeout(() => { highlightElement(element); }, 1500);
      }
      
      function retryScroll(targetText, maxAttempts = 8, attempt = 1) {
        if (attempt > maxAttempts) return false;
        const element = findElement(targetText);
        if (element) {
          if (!scrollUsingMarkdownContainer(element)) {
            forceScrollWithLastResort(element);
          }
          return true;
        } else {
          setTimeout(() => { retryScroll(targetText, maxAttempts, attempt + 1); }, 1000 * attempt);
          return false;
        }
      }
      
      function isLoadingIndicatorHidden() {
        const indicator = document.getElementById('loading-indicator');
        const isHidden = !indicator || indicator.classList.contains('hidden');
        return isHidden;
      }
      
      function waitForCondition(conditionFn, callback, timeout = 15000) {
        if (conditionFn()) { callback(); return; }
        let attempts = 0;
        const maxAttempts = timeout / 500;
        const interval = setInterval(() => {
          attempts++;
          if (conditionFn()) {
            clearInterval(interval);
            setTimeout(callback, 300);
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            callback();
          }
        }, 500);
      }
      
      function executeScroll() {
        const cleanHashValue = cleanHash(INITIAL_HASH);
        if (!cleanHashValue || cleanHashValue === '#') return;
        let hashText = cleanHashValue.startsWith('#') ? cleanHashValue.substring(1) : cleanHashValue;
        let targetText = decodeHashText(hashText);
        if (!targetText) return;
        
        const possibleTexts = [
          targetText, targetText.trim(),
          decodeURIComponent(hashText),
          targetText.replace(/^[#▶▷▸▹►▻◀◁◂◃•▪\\s]+/, ''),
          targetText.replace(/[▶▷▸▹►▻◀◁◂◃•▪]/g, ''),
        ];
        const uniqueTexts = [...new Set(possibleTexts.filter(t => t && t.length > 0))];
        let found = false;
        for (let i = 0; i < uniqueTexts.length; i++) {
          const text = uniqueTexts[i];
          if (retryScroll(text, 4, 1)) {
            found = true;
            break;
          }
        }
      }
      
      function initScrollSystem() {
        waitForCondition(
          () => {
            const isReady = document.readyState === 'complete' || document.readyState === 'interactive';
            const hasContent = document.body && (document.querySelector('[data-heading]') || document.querySelector('h1, h2, h3'));
            return isReady && hasContent && isLoadingIndicatorHidden();
          },
          executeScroll,
          20000
        );
        
        window.addEventListener('hashchange', function(event) {
          const newHash = cleanHash(window.location.hash);
          if (newHash && newHash !== '#') {
            const hashText = newHash.startsWith('#') ? newHash.substring(1) : newHash;
            const targetText = decodeHashText(hashText);
            waitForCondition(
              isLoadingIndicatorHidden,
              () => { retryScroll(targetText, 6, 1); },
              8000
            );
          }
        });
      }
      
      function delayedInitScrollSystem(delay = 2000) {
        setTimeout(() => { initScrollSystem(); }, delay);
      }
      
      function checkPageStateAndInit() {
        if (document.readyState === 'complete') {
          delayedInitScrollSystem(2000);
        } else {
          window.addEventListener('load', function() { delayedInitScrollSystem(2000); });
          document.addEventListener('DOMContentLoaded', function() { delayedInitScrollSystem(2000); });
          const immediateCheck = setInterval(() => {
            if (document.readyState === 'complete') {
              clearInterval(immediateCheck);
              delayedInitScrollSystem(2000);
            }
          }, 500);
        }
      }
      
      checkPageStateAndInit();
    })();

    // ================ Simple Mode Button Script ================
    (function() {
      const currentUrl = window.location.href;
      const urlObj = new URL(currentUrl);
      let fullVersionUrl = 'https://arpcn.top' + urlObj.pathname;
      const searchParams = new URLSearchParams(urlObj.search);
      if (searchParams.has('simple')) {
        searchParams.delete('simple');
        const newSearch = searchParams.toString();
        if (newSearch) {
          fullVersionUrl += '?' + newSearch;
        }
      }
      if (urlObj.hash) {
        fullVersionUrl += urlObj.hash;
      }
      window.fullVersionNavigate = function() {
        const currentWithoutHash = window.location.href.replace(/#.*$/, '');
        const targetWithoutHash = fullVersionUrl.replace(/#.*$/, '');
        if (currentWithoutHash === targetWithoutHash) {
          if (urlObj.hash) {
            window.location.hash = urlObj.hash;
          }
          setTimeout(() => { window.location.reload(true); }, 100);
        } else {
          window.location.href = fullVersionUrl;
        }
        return false;
      };
    })();

    // ================ Background Load Script ================
    (function() {
      window.fullVersionReady = false;
      window.fullVersionCache = null;
      window.fullVersionPromise = null;
      const CacheUrl = "https://arpcn.top/cache/39a393bd37490e3597370f63f89358a6?full";
      
      function loadBackground() {
        if (window.fullVersionPromise) return window.fullVersionPromise;
        window.fullVersionPromise = new Promise(async (resolve) => {
          try {
            const cacheResponse = await fetch(CacheUrl);
            if (cacheResponse.ok) {
              window.fullVersionCache = await cacheResponse.json();
              window.fullVersionReady = true;
              updateButtonText();
            }
            resolve(true);
          } catch (error) {
            console.error(error);
            resolve(false);
          }
        });
        return window.fullVersionPromise;
      }
      
      function updateButtonText() {
        const button = document.querySelector('#simple-mode-button button');
        if (button) {
          button.textContent = 'Full Version (Ready) ☚';
          button.style.backgroundColor = '#2196F3';
        }
      }
      
      setTimeout(() => { loadBackground(); }, 8000);
    })();

