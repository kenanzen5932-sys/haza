# HAZA Kraliyet Etkinliği

HAZA mobil canlı yayın ve etkinlik uygulaması için hazırlanan liderlik sıralaması, ödüller ve kural sayfalarını içeren web uygulaması.

## Özellikler

- **Liderlik Tablosu (Rank):** Top 1, Top 2 ve Top 3 kullanıcılar özel kraliyet çerçeveleriyle öne çıkarılır. Çerçevelere tıklandığında animasyonlu (WebP) önizleme açılır.
- **Ödüller Sekmesi:** Her sıralama derecesine özel ödüller (çerçeve, araç, rozet, unvan) ve animasyonlu önizlemeler.
- **Çoklu Dil Desteği:** Türkçe (TR), İngilizce (EN) ve Arapça (AR - RTL) tam dil desteği.
- **Haza Kurallar Modalı:** Özel arayüzlü ve dil seçeneklerine duyarlı etkinlik kuralları penceresi.
- **Canlı Geri Sayım:** Etkinlik bitiş süresi sayacı.

## Dağıtım (Vercel)

Proje Vercel ile %100 uyumludur. Depoyu Vercel'e bağladığınızda doğrudan yayına alınabilir:
- `vercel.json` yapılandırması hazırdır.
- Kök dizine gelen ziyaretçiler doğrudan `/etkinlik/` sayfasına yönlendirilir.

## Yerel Geliştirme

```bash
# Bağımlılık gerektirmez, doğrudan yerel sunucu ile çalıştırılabilir:
node server.js
```

Tarayıcınızda `http://localhost:3000` veya `http://localhost:3000/etkinlik/` adresini açarak görüntüleyebilirsiniz.
