// Offline Mock Interceptor for Hoby MonthRankList SPA
(function() {
  console.log('[Hoby Mock] Interceptor activated');

  let mockData = null;

  // Load mock data synchronously or inline
  const xhrSync = new XMLHttpRequest();
  xhrSync.open('GET', '/mock_data.json', false);
  try {
    xhrSync.send();
    if (xhrSync.status === 200) {
      mockData = JSON.parse(xhrSync.responseText);
      console.log('[Hoby Mock] Loaded mock_data.json successfully');
    }
  } catch (e) {
    console.warn('[Hoby Mock] Failed to load mock_data.json synchronously, using embedded fallback', e);
  }

  // Intercept XMLHttpRequest (used by Axios)
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._method = method;
    this._url = url;
    return origOpen.apply(this, [method, url, ...args]);
  };

  XMLHttpRequest.prototype.send = function(body) {
    const url = this._url || '';
    if (url.includes('/web/activity/timeinfo') || url.includes('/web/activity/rankTop3') || url.includes('/web/activity/rewardlist')) {
      let payload = {};
      try {
        if (typeof body === 'string') payload = JSON.parse(body);
        else if (body) payload = body;
      } catch (e) {}

      const type = payload.rewardType || 'wealth';
      console.log('[Hoby Mock] Intercepted request:', url, payload);

      let responseObj = { code: 0, msg: 'ok', res: null };

      if (url.includes('/web/activity/timeinfo')) {
        responseObj.res = { countdown: mockData ? mockData.countdown : 648000 };
      } else if (url.includes('/web/activity/rankTop3')) {
        const cat = mockData && mockData[type] ? mockData[type] : null;
        responseObj.res = cat ? cat.top3 : [];
      } else if (url.includes('/web/activity/rewardlist')) {
        const cat = mockData && mockData[type] ? mockData[type] : null;
        responseObj.res = cat ? cat.rewards : [];
      }

      const responseText = JSON.stringify(responseObj);

      Object.defineProperty(this, 'status', { get: () => 200, configurable: true });
      Object.defineProperty(this, 'readyState', { get: () => 4, configurable: true });
      Object.defineProperty(this, 'responseText', { get: () => responseText, configurable: true });
      Object.defineProperty(this, 'response', { get: () => responseText, configurable: true });

      setTimeout(() => {
        if (typeof this.onreadystatechange === 'function') {
          this.onreadystatechange();
        }
        if (typeof this.onload === 'function') {
          this.onload();
        }
      }, 50);

      return;
    }

    return origSend.apply(this, [body]);
  };

  // Image fallback: redirect remote CDN images to local assets/rewards
  document.addEventListener('error', function(e) {
    if (e.target && e.target.tagName === 'IMG') {
      const src = e.target.src;
      if (src && (src.includes('upload.chatie.live') || src.includes('img.chatie.live'))) {
        const filename = src.split('/').pop().split('?')[0];
        e.target.src = '/assets/rewards/' + filename;
      }
    }
  }, true);

})();
