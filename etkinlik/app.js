// Haza Kraliyet - Rank & Ödüller Standalone Logic
(function() {
  'use strict';

  // 1. Flexible Rem Calculation
  function initFlexible() {
    function setRem() {
      var width = document.documentElement.getBoundingClientRect().width;
      if (width > 750) width = 750;
      var rem = width / 7.5;
      document.documentElement.style.fontSize = rem + 'px';
    }
    setRem();
    window.addEventListener('resize', setRem);
    window.addEventListener('pageshow', function(e) {
      if (e.persisted) setRem();
    });
  }
  initFlexible();

  // State
  let storeData = null;
  let currentTabIdx = 0; // 0: Rank, 1: Ödül
  let currentLang = 'tr';
  let countdownSeconds = 648000;
  let timerInterval = null;
  let currentSvgaPlayer = null;

  // DOM Elements
  const pageContainer = document.getElementById('pageContainer');
  const titleImg = document.getElementById('titleImg');
  const rulesBtn = document.getElementById('rulesBtn');
  const dayBox = document.getElementById('dayBox');
  const daysLabel = document.getElementById('daysLabel');
  const hourBox = document.getElementById('hourBox');
  const minBox = document.getElementById('minBox');
  const secBox = document.getElementById('secBox');

  const tabRank = document.getElementById('tabRank');
  const tabReward = document.getElementById('tabReward');
  const tabContent = document.getElementById('tabContent');

  const rulesModal = document.getElementById('rulesModal');
  const rulesCloseBtn = document.getElementById('rulesCloseBtn');
  const rulesConfirmBtn = document.getElementById('rulesConfirmBtn');
  const rulesTitleDiv = document.getElementById('rulesTitleDiv');
  const rulesTextWealth = document.getElementById('rulesTextWealth');
  const ruleDesc1 = document.getElementById('ruleDesc1');
  const ruleDesc2 = document.getElementById('ruleDesc2');
  const ruleDesc3 = document.getElementById('ruleDesc3');
  const ruleDesc4 = document.getElementById('ruleDesc4');
  const textRoots = document.querySelector('.text-roots');
  const atvtTip1 = document.getElementById('atvtTip1');
  const atvtTip2 = document.getElementById('atvtTip2');

  const previewModal = document.getElementById('previewModal');
  const previewCloseBtn = document.getElementById('previewCloseBtn');
  const previewTitle = document.getElementById('previewTitle');
  const previewMedia = document.getElementById('previewMedia');

  // Format large numbers
  function formatScore(val) {
    if (!val && val !== 0) return '0';
    return Number(val).toLocaleString();
  }

  // Countdown timer
  function startCountdown(sec) {
    if (timerInterval) clearInterval(timerInterval);
    countdownSeconds = sec || 648000;

    function tick() {
      if (countdownSeconds <= 0) {
        countdownSeconds = 0;
        clearInterval(timerInterval);
      }
      var d = Math.floor(countdownSeconds / (3600 * 24));
      var h = Math.floor((countdownSeconds % (3600 * 24)) / 3600);
      var m = Math.floor((countdownSeconds % 3600) / 60);
      var s = Math.floor(countdownSeconds % 60);

      dayBox.textContent = d;
      hourBox.textContent = h <= 9 ? '0' + h : h;
      minBox.textContent = m <= 9 ? '0' + m : m;
      secBox.textContent = s <= 9 ? '0' + s : s;

      countdownSeconds--;
    }

    tick();
    timerInterval = setInterval(tick, 1000);
  }

  // Switch Language
  function setLanguage(lang) {
    currentLang = lang;
    const t = storeData.translations[lang] || storeData.translations.en;

    // Body class for RTL & arabic
    if (lang === 'ar') {
      pageContainer.classList.add('arlang');
      document.body.style.direction = 'rtl';
    } else {
      pageContainer.classList.remove('arlang');
      document.body.style.direction = 'ltr';
    }

    // Language switch button text & title
    const langSwitchText = document.getElementById('langSwitchText');
    const langSwitchBtn = document.getElementById('langSwitchBtn');
    if (langSwitchText) {
      langSwitchText.textContent = t.lang_btn_text || (lang === 'tr' ? 'Dil' : (lang === 'ar' ? 'لغة' : 'Lang'));
    }
    if (langSwitchBtn) {
      const nextLangName = lang === 'tr' ? 'English' : (lang === 'en' ? 'العربية' : 'Türkçe');
      langSwitchBtn.setAttribute('title', `Dili Değiştir (${nextLangName})`);
    }

    // Update Banner title image
    titleImg.src = `img/activity/mothList/img_ch_title_${lang}.png`;

    // Static text updates
    document.title = t.haza_kraliyet || 'HAZA KRALİYET';
    rulesBtn.textContent = t.rules || 'Kurallar';
    daysLabel.textContent = t.days || 'Gün';
    tabRank.textContent = t.tab_rank || 'Rank';
    tabReward.textContent = t.tab_reward || 'Ödül';

    // Rules modal texts (All Haza branded)
    rulesTextWealth.textContent = t.rules_modal_title || t.rules || 'Kural';
    if (t.rules_list && textRoots) {
      textRoots.innerHTML = t.rules_list.map((r, i) => `<div id="ruleDesc${i+1}">${r}</div>`).join('');
    } else {
      if (ruleDesc1) ruleDesc1.textContent = t.rules_description1;
      if (ruleDesc2) ruleDesc2.textContent = t.rules_description2;
      if (ruleDesc3) ruleDesc3.textContent = t.rules_description3;
      if (ruleDesc4) ruleDesc4.textContent = t.rules_description4;
    }
    if (rulesConfirmBtn) rulesConfirmBtn.textContent = t.modal_close || 'Anladım';
    atvtTip1.textContent = t.wealth_king_acticity_button_introduction_1;
    atvtTip2.textContent = t.wealth_king_acticity_button_introduction_2;

    renderTab();
  }

  // Switch Tab (0: Rank, 1: Ödül)
  function switchTab(idx) {
    currentTabIdx = idx;

    if (idx === 0) {
      tabRank.className = 'tab-item active';
      tabReward.className = 'tab-item inactive';
    } else {
      tabRank.className = 'tab-item inactive';
      tabReward.className = 'tab-item active';
    }

    renderTab();
  }

  // Render Tab
  function renderTab() {
    if (!storeData) return;
    const t = storeData.translations[currentLang] || storeData.translations.en;

    if (currentTabIdx === 0) {
      renderRankPage(t);
    } else {
      renderRewardPage(t);
    }

    bindPreviewEvents();
  }

  // Render Rank Page (Event Gifts + HAZA KRALİYET Top 1,2,3 + Ranks 4 to 20 bots)
  function renderRankPage(t) {
    const top3 = storeData.rankData.top3;
    const others = storeData.rankData.others || [];
    const gifts = storeData.eventGifts || [];
    const lang = currentLang;

    // Build 6 gifts items (scrolling horizontally to the right)
    let giftsHtml = '';
    gifts.forEach(gift => {
      const giftName = gift['name_' + lang] || gift.name_tr || gift.name_en;
      giftsHtml += `
        <div class="item" data-img="${gift.image}" data-name="${giftName}" title="${giftName}">
          <div class="gift-root">
            <img class="gift-img" src="${gift.image}" alt="${giftName}">
          </div>
          <div class="gift-text">${giftName}</div>
          <div class="gift-gold-root">
            <img class="gold-icon" src="img/activity/mothList/gold_icon.png" alt="Coins">
            <div class="gold-num">${formatScore(gift.coins)}</div>
          </div>
        </div>
      `;
    });

    // Build ranks 4 to 20 items
    let othersHtml = '';
    others.forEach(user => {
      othersHtml += `
        <div class="rank-other-item">
          <div class="item-left">
            <div class="item-rank-num">${user.rank}</div>
            <div class="item-avatar-wrap">
              <img class="item-avatar" src="${user.avatar}" alt="${user.nickname}">
            </div>
            <div class="item-info">
              <div class="item-name">${user.nickname}</div>
              <div class="item-uid">ID: ${user.uid}</div>
            </div>
          </div>
          <div class="item-right">
            <img class="item-gold-icon" src="img/activity/mothList/gold_icon.png" alt="Score">
            <div class="item-gold-num">${formatScore(user.score)}</div>
          </div>
        </div>
      `;
    });

    tabContent.innerHTML = `
      <div class="wealth-root">
        <!-- 1. GÖNDERİLECEK HEDİYELER (6 gifts horizontally scrolling to the right) -->
        <div class="ranking-gift-root">
          <div class="title-text">
            <div class="text lang-${lang}">${t.event_gifts || 'GÖNDERİLECEK HEDİYELER'}</div>
          </div>
          <div class="rank-gift-root">
            <div class="close-ctenr-ew">
              ${giftsHtml}
            </div>
          </div>
        </div>

        <!-- 2. Top 3 Podium with HAZA KRALİYET title -->
        <div class="heg-top-root">
          <img class="bd-tp-img" src="img/activity/mothList/ranking_top_border.png">
          <img class="bd-ct-img" src="img/activity/mothList/ranking_ct_border.png">
          <img class="bd-bm-img" src="img/activity/mothList/ranking_bm_border.png">
          <div class="root-title-bg-title">
            <div class="text-int">${t.haza_kraliyet || 'HAZA KRALİYET'}</div>
          </div>
          <div class="amiddle-root">
            <!-- Top 1 Center -->
            <div class="one-root top-rank-podium" data-rank="1">
              <img class="one-header top-rank-frame" src="assets/top_rank_frame.png" alt="Top 1">
              <img class="user-atv" src="${top3[0].avatarurl}">
              <div class="name-test">${top3[0].nickname}</div>
              <div class="gold-num-icon">
                <img class="gold-icon" src="img/activity/mothList/gold_icon.png">
                <div class="glod-num">${formatScore(top3[0].score)}</div>
              </div>
            </div>
            <!-- Top 2 Left -->
            <div class="two-root top-rank-podium" data-rank="2">
              <img class="two-header top-rank-frame" src="assets/top_rank_frame.png" alt="Top 2">
              <img class="user-atv" src="${top3[1].avatarurl}">
              <div class="name-test">${top3[1].nickname}</div>
              <div class="gold-num-icon">
                <img class="gold-icon" src="img/activity/mothList/gold_icon.png">
                <div class="glod-num">${formatScore(top3[1].score)}</div>
              </div>
            </div>
            <!-- Top 3 Right -->
            <div class="three-root top-rank-podium" data-rank="3">
              <img class="three-header top-rank-frame" src="assets/top_rank_frame.png" alt="Top 3">
              <img class="user-atv" src="${top3[2].avatarurl}">
              <div class="name-test">${top3[2].nickname}</div>
              <div class="gold-num-icon">
                <img class="gold-icon" src="img/activity/mothList/gold_icon.png">
                <div class="glod-num">${formatScore(top3[2].score)}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Ranks 4 to 20 List -->
        <div class="rank-list-others">
          ${othersHtml}
        </div>
      </div>
    `;
  }

  // Render Reward Page (Full rewards section in its dedicated tab)
  function renderRewardPage(t) {
    const l = storeData.rewardsData;
    const lang = currentLang;

    // All ranks (Top 1, Top 2, Top 3) using standard uniform layout like Top 2
    let allRanksHtml = '';
    l.forEach((group, r) => {
      // Exclude any banner item if present
      const items = group.filter(item => {
        const name = (item.name_tr || item.name_en || '').toLowerCase();
        return !name.includes('banner');
      });

      let itemsHtml = '';
      items.forEach(item => {
        const itemImg = item['image_url_' + lang] || item.image_url_en;
        const itemName = item['name_' + lang] || item.name_en;
        const showUrl = item.show_url || '';
        itemsHtml += `
          <div class="im-rt" data-img="${itemImg}" data-name="${itemName}" data-media="${showUrl}" title="${itemName}">
            <div class="ig-rt-bg">
              <img class="gt-ig" src="${itemImg}" alt="${itemName}">
              ${item.prview == 1 ? `<img class="in-prview" src="img/activity/mothList/icon_preview.png" data-media="${showUrl}" data-name="${itemName}">` : ''}
              ${item.days > 0 ? `<div class="te-rt">${item.days} ${t.days}</div>` : ''}
            </div>
            <div class="ne-tt">${itemName}</div>
          </div>
        `;
      });

      allRanksHtml += `
        <div class="lt-wh-rd">
          <div class="lt-tp-tt">Top${r + 1}</div>
          <div class="lt-im-rt">${itemsHtml}</div>
        </div>
      `;
    });

    tabContent.innerHTML = `
      <div class="wealth-root" style="padding-top: 0.3rem;">
        <div class="wealth-reward" style="margin-top: 0;">
          <div class="root-title-bg-title">
            <div class="text-int">${t.reward || 'Ödül'}</div>
          </div>
          <img class="bd-tp-img" src="img/activity/mothList/ranking_top_border.png">
          <img class="bd-ct-img" src="img/activity/mothList/ranking_ct_border.png">
          <img class="bd-bm-img" src="img/activity/mothList/ranking_bm_border.png">
          <div class="sbody-wealth-reward">
            <div class="bg-imgs"></div>
            <div class="bg-tws"></div>
            <div class="rw-rt" style="padding-top: 0.2rem;">
              ${allRanksHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Preview Modal logic (Clean transparent image / media preview)
  function bindPreviewEvents() {
    // 1. Specific preview button for MP4 / videos / svga
    document.querySelectorAll('.in-prview').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const media = this.dataset.media;
        const name = this.dataset.name;
        openPreview(media, name);
      });
    });

    // 2. Click on reward items (Aristokrasi Duke, Rozetler, Çerçeveler vb.)
    // If it's an SVGA (Top 1, 2, 3 Çerçeve) or MP4, open it. Otherwise if image, open image!
    document.querySelectorAll('.lt-wh-rd .lt-im-rt .im-rt').forEach(itemCard => {
      itemCard.addEventListener('click', function(e) {
        if (e.target.closest('.in-prview')) return;
        const img = this.dataset.img;
        const media = this.dataset.media;
        const name = this.dataset.name;

        // User requirement: Top 1, 2, 3 frames should open animation (WebP / SVGA / MP4)
        if (media && (media.endsWith('.svga') || media.endsWith('.mp4') || media.endsWith('.webp'))) {
          openPreview(media, name);
        } else if (img) {
          openPreview(img, name);
        } else if (media) {
          openPreview(media, name);
        }
      });
    });

    // 3. Click on rank event gifts (GÖNDERİLECEK HEDİYELER)
    document.querySelectorAll('.rank-gift-root .item').forEach(giftCard => {
      giftCard.addEventListener('click', function() {
        const img = this.dataset.img;
        const name = this.dataset.name;
        if (img) {
          openPreview(img, name);
        }
      });
    });

    // 4. Click on Rank Top 1, 2, 3 podium (frame or avatar) -> open animated frame preview
    document.querySelectorAll('.top-rank-podium').forEach(podiumEl => {
      podiumEl.addEventListener('click', function() {
        const t = storeData ? (storeData.translations[currentLang] || storeData.translations.tr) : {};
        const title = t.royal_frame || (currentLang === 'tr' ? 'Haza Kraliyet Çerçevesi' : (currentLang === 'ar' ? 'إطار هازا الملكي' : 'Haza Royal Frame'));
        openPreview('assets/top_rank_frame_animated.webp', title);
      });
    });
  }

  function openPreview(mediaUrl, name) {
    if (!mediaUrl) return;
    previewTitle.textContent = name || '';
    previewMedia.innerHTML = '';

    // Stop and clear previous SVGA if any
    if (currentSvgaPlayer) {
      try {
        currentSvgaPlayer.stopAnimation();
        currentSvgaPlayer.clear();
      } catch (err) {}
      currentSvgaPlayer = null;
    }

    if (mediaUrl.endsWith('.svga') || (typeof mediaUrl === 'string' && mediaUrl.indexOf('data:svga') >= 0)) {
      const svgaBox = document.createElement('div');
      svgaBox.className = 'custom-preview-svga-box';
      previewMedia.appendChild(svgaBox);

      // Prefer embedded base64 frames to support direct file:/// opening without CORS errors
      let svgaSource = mediaUrl;
      if (window.HAZA_FRAMES) {
        if (mediaUrl.includes('top1') && window.HAZA_FRAMES.top1) {
          svgaSource = window.HAZA_FRAMES.top1;
        } else if (mediaUrl.includes('top2') && window.HAZA_FRAMES.top2) {
          svgaSource = window.HAZA_FRAMES.top2;
        } else if (mediaUrl.includes('top3') && window.HAZA_FRAMES.top3) {
          svgaSource = window.HAZA_FRAMES.top3;
        }
      }

      if (window.SVGA && window.SVGA.Player && window.SVGA.Parser) {
        try {
          const player = new window.SVGA.Player(svgaBox);
          player.loops = 0; // Infinite loop
          player.clearsAfterStop = true;
          currentSvgaPlayer = player;

          // Override _resize so canvas resolution strictly matches native videoSize,
          // preventing svgaplayerweb from stretching the internal canvas and shifting the drawing to the left!
          player._resize = function() {
            if (this._drawingCanvas && this._videoItem) {
              const r = this._videoItem.videoSize;
              this._drawingCanvas.width = r.width;
              this._drawingCanvas.height = r.height;
              this._drawingCanvas.style.transform = 'none';
              this._drawingCanvas.style.webkitTransform = 'none';
            }
          };

          const parser = new window.SVGA.Parser();
          parser.load(svgaSource, function(videoItem) {
            if (currentSvgaPlayer === player) {
              player.setVideoItem(videoItem);
              if (player._drawingCanvas) {
                player._drawingCanvas.width = videoItem.videoSize.width;
                player._drawingCanvas.height = videoItem.videoSize.height;
                player._drawingCanvas.style.transform = 'none';
                player._drawingCanvas.style.webkitTransform = 'none';
                player._drawingCanvas.style.display = 'block';
                player._drawingCanvas.style.margin = '0 auto';
              }
              svgaBox.style.setProperty('text-align', 'center', 'important');
              player.startAnimation();
            }
          }, function(loadErr) {
            console.error('SVGA load error:', loadErr);
          });
        } catch (e) {
          console.error('SVGA init error:', e);
        }
      } else {
        console.warn('SVGA library not loaded');
      }
    } else if (mediaUrl.endsWith('.mp4')) {
      const vid = document.createElement('video');
      vid.src = mediaUrl;
      vid.autoplay = true;
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      previewMedia.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = mediaUrl;
      img.alt = name || 'Görsel';
      if (mediaUrl.includes('top_rank_frame') || mediaUrl.includes('678f56ef')) {
        img.className = 'preview-frame-anim';
      }
      previewMedia.appendChild(img);
    }

    previewModal.style.display = 'flex';
    // Trigger CSS transition if any
    requestAnimationFrame(() => {
      previewModal.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
  }

  function closePreview() {
    if (currentSvgaPlayer) {
      try {
        currentSvgaPlayer.stopAnimation();
        currentSvgaPlayer.clear();
      } catch (err) {}
      currentSvgaPlayer = null;
    }
    previewModal.classList.remove('open');
    previewModal.style.display = 'none';
    previewMedia.innerHTML = '';
    document.body.style.overflow = '';
  }

  // Setup Event Handlers
  function setupEvents() {
    // Two-Tab switching
    tabRank.addEventListener('click', () => switchTab(0));
    tabReward.addEventListener('click', () => switchTab(1));

    // Single Language Switch Button (cycles TR -> EN -> AR -> TR)
    const langSwitchBtn = document.getElementById('langSwitchBtn');
    if (langSwitchBtn) {
      langSwitchBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const langs = ['tr', 'en', 'ar'];
        const nextIdx = (langs.indexOf(currentLang) + 1) % langs.length;
        setLanguage(langs[nextIdx]);
      });
      langSwitchBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    }

    // Rules modal open / close
    function openRules(e) {
      if (e) e.stopPropagation();
      const t = storeData ? (storeData.translations[currentLang] || storeData.translations.tr) : null;
      if (t) {
        if (rulesTextWealth) rulesTextWealth.textContent = t.rules_modal_title || t.rules || 'Kural';
        const textRootsEl = document.querySelector('.text-roots');
        const list = t.rules_list || [t.rules_description1, t.rules_description2, t.rules_description3, t.rules_description4].filter(Boolean);
        if (textRootsEl && list.length > 0) {
          textRootsEl.innerHTML = list.map((r, i) => `<div id="ruleDesc${i+1}">${r}</div>`).join('');
        }
      }
      rulesModal.classList.add('open');
      rulesModal.style.display = 'flex';
    }

    function closeRules(e) {
      if (e) e.stopPropagation();
      rulesModal.classList.remove('open');
      rulesModal.style.display = 'none';
    }

    rulesBtn.addEventListener('click', openRules);
    if (rulesCloseBtn) rulesCloseBtn.addEventListener('click', closeRules);
    if (rulesConfirmBtn) rulesConfirmBtn.addEventListener('click', closeRules);
    rulesModal.addEventListener('click', function(e) {
      if (e.target === rulesModal) closeRules(e);
    });

    // Preview close handlers:
    // 1. Right-side close button
    if (previewCloseBtn) {
      previewCloseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closePreview();
      });
    }

    // 2. Click outside (on dimmed backdrop)
    previewModal.addEventListener('click', function(e) {
      if (!e.target.closest('.custom-preview-content')) {
        closePreview();
      }
    });

    // 3. Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && previewModal.classList.contains('open')) {
        closePreview();
      }
    });
  }

  // Init
  async function init() {
    try {
      if (window.HAZA_DATA) {
        storeData = window.HAZA_DATA;
      } else {
        const res = await fetch('data.json');
        storeData = await res.json();
      }
      setupEvents();
      setLanguage('tr');
      switchTab(0);
      startCountdown(storeData.countdown);
    } catch (e) {
      console.error('Failed to init Haza app', e);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
