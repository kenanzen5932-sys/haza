# HAZA KRALİYET ETKİNLİĞİ - TEKNİK VE ENTEGRASYON RAPORU
# HAZA ROYAL EVENT - TECHNICAL & INTEGRATION REPORT

---

## 🇹🇷 BÖLÜM 1: TÜRKÇE RAPOR

### 1. Etkinlik Genel Bakışı ve Kullanılan Teknolojiler

HAZA Kraliyet, mobil canlı yayın ve sosyal eğlence platformları için geliştirilmiş, yüksek performanslı ve hafif bir liderlik tablosu (leaderboard) ve ödül yönetim web uygulamasıdır.

#### Kullanılan Teknolojiler:
* **Çekirdek:** HTML5, Saf CSS3 (Vanilla CSS), Modern JavaScript (ES6+).
* **Ekran Uyumluluğu (Responsive Rem):** 750px mobil prototip standardına dayalı dinamik `rem` hesaplaması. Tüm mobil cihaz ekranlarında (iOS & Android) piksel hassasiyetinde ölçeklenir.
* **Animasyon ve Medya Desteği:**
  * **SVGA Player (`svga.min.js`):** Canlı yayın uygulamalarında yaygın olan vektörel 2D animasyonları oynatmak için.
  * **Hareketli WebP (VP8X):** Top 1, 2, 3 kraliyet çerçeveleri için yüksek kaliteli, hafif ve şeffaf animasyonlar.
  * **HTML5 Video (MP4):** Özel binek/araç animasyonları için sessiz, döngüsel oynatma.
* **Çoklu Dil & Yerelleştirme (i18n):**
  * Türkçe (TR), İngilizce (EN) ve Arapça (AR).
  * Arapça için tam **RTL (Sağdan Sola)** yerleşim ve tipografi desteği.
* **Dağıtım ve Altyapı:**
  * Vercel Edge Network (`vercel.json`) üzerinden statik CDN barındırma.
  * Geliştirme ortamı için yerel Node.js statik sunucusu (`server.js`).

---

### 2. Flutter Mobil Uygulamasına Entegrasyon

Bu web etkinliği, Flutter uygulamasının içerisine `webview_flutter` veya `flutter_inappwebview` kütüphaneleri kullanılarak entegre edilir.

#### Adım 1: Flutter Paketinin Eklenmesi (`pubspec.yaml`)
```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_inappwebview: ^6.0.0 # veya webview_flutter: ^4.7.0
```

#### Adım 2: Parametre Aktarımı (Token & Dil)
Uygulama açılırken kullanıcının oturum bilgisi, kullanıcı kimliği (UID) ve seçili dil web görünümüne URL parametreleri ile aktarılır:
```dart
final String eventUrl = "https://haza.vercel.app/etkinlik/?token=$userToken&uid=$userId&lang=${currentLocale.languageCode}";
```

#### Adım 3: JavaScript Köprüsü (Flutter & Web İletişimi)
Kullanıcı web sayfasında bir profile, hediyeye veya satın alma butonuna tıkladığında Flutter yerel kodunun tetiklenmesi:
```dart
InAppWebView(
  initialUrlRequest: URLRequest(url: WebUri(eventUrl)),
  onWebViewCreated: (controller) {
    // Web tarafından Flutter'a gelen mesajları dinle
    controller.addJavaScriptHandler(
      handlerName: 'onProfileClick',
      callback: (args) {
        final String uid = args[0];
        // Flutter'da yerel profil sayfasını aç
        Navigator.pushNamed(context, '/userProfile', arguments: uid);
      },
    );
    controller.addJavaScriptHandler(
      handlerName: 'onGiftSendClick',
      callback: (args) {
        final int giftId = args[0];
        // Flutter'da yerel hediye gönderme modalını aç
        openGiftSheet(giftId);
      },
    );
  },
)
```

---

### 3. Backend & Sunucu Mimarisi ve Entegrasyonu

Etkinlik verilerinin dinamik olarak sunulması ve sıralamaların anlık hesaplanması için önerilen mimari:

#### A. Veritabanı ve Önbellek Mimarisi (Redis Sorted Sets)
Liderlik tablosu yüksek trafik altında ilişkisel veritabanlarını (MySQL/PostgreSQL) yormamak adına **Redis Sorted Sets (ZSET)** üzerinde tutulmalıdır:
* **Puan Ekleme (Hediye Gönderildiğinde):**
  ```bash
  ZINCRBY haza:rank:weekly:wealth 1000 "user_9574242"
  ```
* **Top 20 Listesini Çekme (O(log(N)) Hızında):**
  ```bash
  ZREVRANGE haza:rank:weekly:wealth 0 19 WITHSCORES
  ```

#### B. Sağlanması Gereken REST API Uç Noktaları
1. `GET /api/activity/timeinfo`
   * **Dönüş:** Kalan geri sayım saniyesi (`countdown: 648000`), etkinlik başlangıç ve bitiş tarihi.
2. `GET /api/activity/rank?type=wealth`
   * **Dönüş:** İlk 3 kullanıcı (`top3`) ve 4–20 sıralaması (`others`). UID, kullanıcı adı, avatar URL'si ve toplam puan.
3. `GET /api/activity/rewards`
   * **Dönüş:** Derecelere göre dağıtılacak ödüllerin görselleri (`image_url`), animasyon dosyaları (`show_url`), rozetler ve unvanlar.
4. `GET /api/activity/gifts`
   * **Dönüş:** Etkinliğe dahil olan puan kazandıran hediyelerin listesi, ikonları ve elmas/altın maliyetleri.

#### C. Ödül Dağıtım Otomasyonu (Cron Job / Worker)
Etkinlik süresi bittiğinde (Pazar gecesi 00:00 veya ayın 1'i):
* Bir Cron Job çalışır, Redis sıralamasını dondurur.
* İlk 3 sıradaki kullanıcılara çerçeve (`top_rank_frame_animated.webp`) ve binek ödülleri kullanıcı envanter tablosuna otomatik olarak işlenir.

---
---

## 🇬🇧 SECTION 2: ENGLISH REPORT

### 1. Event Overview & Technology Stack

HAZA Royal Glory is a lightweight, responsive leaderboard and reward web application designed for mobile live-streaming and social audio apps.

#### Core Technologies:
* **Frontend:** HTML5, Semantic Structure, Vanilla CSS3, Modern JavaScript (ES6+).
* **Responsive Scaling (Flexible Rem):** Dynamic `rem` viewport computation based on a 750px standard mobile artboard, guaranteeing pixel-perfect scaling across all Android and iOS form factors.
* **Animation & Media Engine:**
  * **SVGA Player (`svga.min.js`):** Parses and plays 2D vector graphic animations commonly used in Asian/Middle-Eastern streaming apps.
  * **Animated WebP (VP8X):** Seamless, transparent, loopable animations for Top 1, 2, and 3 Royal Avatar Frames.
  * **HTML5 Video (MP4):** Silent looping player for high-fidelity mounts and vehicles.
* **Internationalization & Localization (i18n):**
  * Fully localized for Turkish (TR), English (EN), and Arabic (AR).
  * Native **RTL (Right-to-Left)** styling and layout alignment for Arabic.
* **Deployment Infrastructure:**
  * Zero-config static CDN deployment via Vercel (`vercel.json`).
  * Built-in Node.js server (`server.js`) for local testing.

---

### 2. Flutter Mobile Application Integration

The web app is loaded inside the Flutter mobile app via standard webview wrappers (`webview_flutter` or `flutter_inappwebview`).

#### Step 1: Add Package Dependency (`pubspec.yaml`)
```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_inappwebview: ^6.0.0
```

#### Step 2: Pass Auth Credentials & Localization
When launching the event screen, pass the user session token, user ID, and active language as URL query parameters:
```dart
final String eventUrl = "https://haza.vercel.app/etkinlik/?token=$authToken&uid=$userId&lang=${Localizations.localeOf(context).languageCode}";
```

#### Step 3: Bi-directional JavaScript Bridge
Handle profile clicks or gift interactions seamlessly between the web app and Flutter native UI:
```dart
InAppWebView(
  initialUrlRequest: URLRequest(url: WebUri(eventUrl)),
  onWebViewCreated: (controller) {
    // Listen for events emitted by the web application
    controller.addJavaScriptHandler(
      handlerName: 'openUserProfile',
      callback: (args) {
        final String targetUid = args[0];
        Navigator.pushNamed(context, '/profile', arguments: targetUid);
      },
    );
  },
)
```

---

### 3. Backend & Server Architecture Integration

To dynamically feed rankings, countdowns, and reward distributions:

#### A. Real-Time Leaderboard Storage (Redis Sorted Sets)
To sustain high concurrency during gift wars, use **Redis ZSET**:
* **Increment Score on Gift Transaction:**
  ```bash
  ZINCRBY haza:rank:monthly:wealth 50000 "uid_1030767"
  ```
* **Fetch Top 20 Ranked Users:**
  ```bash
  ZREVRANGE haza:rank:monthly:wealth 0 19 WITHSCORES
  ```

#### B. Required API Endpoints
1. `GET /api/activity/timeinfo`
   * Returns remaining countdown seconds, start time, and end time.
2. `GET /api/activity/rankTop3` and `GET /api/activity/rankOthers`
   * Returns top 3 podium entries and ranks 4–20 with avatar URLs, scores, and nicknames.
3. `GET /api/activity/rewardlist`
   * Provides reward tier items: static frame images (`top_rank_frame.png`), animated preview URLs (`top_rank_frame_animated.webp`), badge assets, and valid durations (e.g., 30 days).

#### C. Automated Settlement Worker
When the countdown expires:
* A background cron worker snapshots the final Redis leaderboard.
* Rewards (frames, badges, mounts) are credited directly to the winners' accounts in the database.
