const fs = require('fs');
const path = require('path');

const mockData = {
  countdown: 648000, // ~7.5 days
  wealth: {
    top3: [
      {
        uid: 9574242,
        nickname: "AL-KHAFAJI 👑",
        avatarurl: "/d17ujs28mie8b2.cloudfront.net/9574242-Avatar-C66217E7E205FF948585F67F99C5E970.gif",
        score: 35820000
      },
      {
        uid: 1030767,
        nickname: "Prince_TR",
        avatarurl: "/d17ujs28mie8b2.cloudfront.net/1030767-Avatar-DFA2FEEC15E24C2137C2132FF7F79CE4.jpg",
        score: 24150000
      },
      {
        uid: 9413255,
        nickname: "Golden Sultan",
        avatarurl: "/d17ujs28mie8b2.cloudfront.net/9413255-Avatar-5951487EA9BC4EF80FACA0BB816E5DD3.png",
        score: 18900000
      }
    ],
    rewards: [
      // Top 1
      [
        {
          name_en: "Top 1 Wealth Banner",
          name_tr: "1. Zenginlik Bannerı",
          name_ar: "بانر الثراء الأول",
          image_url_en: "/assets/rewards/df52b6aa8e31ebc46133a1b41aebe4b3.png",
          image_url_tr: "/assets/rewards/f2ba39daf310c8ca29decc915854683f.png",
          image_url_ar: "/assets/rewards/8a01bde7320944568491292e269c3d86.png",
          days: 30,
          prview: 0
        },
        {
          name_en: "Royal Wealth Frame",
          name_tr: "Kraliyet Zenginlik Çerçevesi",
          name_ar: "إطار الثراء الملكي",
          image_url_en: "/assets/rewards/37da3b351b47308095b2462c860e3158.png",
          show_url: "/assets/rewards/22b529e26b047ceb74c844235b6b9d7b.svga",
          days: 30,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Cyber Phantom Mount",
          name_tr: "Siber Hayalet Araç",
          name_ar: "مركبة الشبح السيبراني",
          image_url_en: "/assets/rewards/28ac41315e8031678366c97c94954cd1.png",
          show_url: "/assets/rewards/9a465a46f630df95f6a1bf95de4c4629.mp4",
          days: 30,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Top 1 Wealth Badge",
          name_tr: "1. Zenginlik Rozeti",
          name_ar: "شارة الثراء الأول",
          image_url_en: "/assets/rewards/48ac6fc688b086bce55ec8ea630f76d6.png",
          days: 30,
          prview: 0,
          show_key: []
        },
        {
          name_en: "VIP LV5 Status",
          name_tr: "VIP LV5 Ayrıcalığı",
          name_ar: "حالة VIP 5",
          image_url_en: "/assets/rewards/vip_lv5.png",
          days: 30,
          prview: 0,
          show_key: []
        }
      ],
      // Top 2
      [
        {
          name_en: "Top 2 Wealth Frame",
          name_tr: "2. Zenginlik Çerçevesi",
          name_ar: "إطار الثراء الثاني",
          image_url_en: "/assets/rewards/52ab4cb9d50eb43909e869df6e027451.png",
          show_url: "/assets/rewards/5d647745a63019b700d8df9a5b9af529.svga",
          days: 15,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Golden Supercar",
          name_tr: "Altın Süper Araç",
          name_ar: "سيارة السوبر الذهبية",
          image_url_en: "/assets/rewards/1f125a7f373cb9340531d3be01389b69.png",
          show_url: "/assets/rewards/a84165acedd6b3116be2406c9764170c.mp4",
          days: 15,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Top 2 Wealth Badge",
          name_tr: "2. Zenginlik Rozeti",
          name_ar: "شارة الثراء الثاني",
          image_url_en: "/assets/rewards/9135d6605a27f6fa1d2a7170e0ced87b.png",
          days: 15,
          prview: 0,
          show_key: []
        },
        {
          name_en: "VIP LV4 Status",
          name_tr: "VIP LV4 Ayrıcalığı",
          name_ar: "حالة VIP 4",
          image_url_en: "/assets/rewards/vip_lv4.png",
          days: 15,
          prview: 0,
          show_key: []
        }
      ],
      // Top 3
      [
        {
          name_en: "Top 3 Wealth Frame",
          name_tr: "3. Zenginlik Çerçevesi",
          name_ar: "إطار الثراء الثالث",
          image_url_en: "/assets/rewards/ef2955c7c83fd0a49637915ebd2a06ad.png",
          show_url: "/assets/rewards/8fe7b5183fe29d3e69dac1bec1bd3d50.svga",
          days: 7,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Silver Comet Mount",
          name_tr: "Gümüş Kuyruklu Araç",
          name_ar: "مركبة المذنب الفضي",
          image_url_en: "/assets/rewards/9dedcf5849749c4803fd1742a7249559.png",
          show_url: "/assets/rewards/5f9d6428768d9094479885330dad532a.mp4",
          days: 7,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Top 3 Wealth Badge",
          name_tr: "3. Zenginlik Rozeti",
          name_ar: "شارة الثراء الثالث",
          image_url_en: "/assets/rewards/4cbe1020d9daf09cd6c1e6a22a502ca3.png",
          days: 7,
          prview: 0,
          show_key: []
        }
      ]
    ]
  },
  charm: {
    top3: [
      {
        uid: 9542120,
        nickname: "Queen_Bella ✨",
        avatarurl: "/d17ujs28mie8b2.cloudfront.net/9542120-Avatar-A9F3CA382003F5F70A21B9C0B9C44C1E.jpg",
        score: 41200000
      },
      {
        uid: 9574242,
        nickname: "Rose_Angel",
        avatarurl: "/d17ujs28mie8b2.cloudfront.net/9574242-Avatar-C66217E7E205FF948585F67F99C5E970.gif",
        score: 28900000
      },
      {
        uid: 1030767,
        nickname: "Star_Girl",
        avatarurl: "/d17ujs28mie8b2.cloudfront.net/1030767-Avatar-DFA2FEEC15E24C2137C2132FF7F79CE4.jpg",
        score: 21300000
      }
    ],
    rewards: [
      // Top 1 Charm
      [
        {
          name_en: "Top 1 Charm Banner",
          name_tr: "1. Cazibe Bannerı",
          name_ar: "بانر السحر الأول",
          image_url_en: "/assets/rewards/5b3e443a76e8df97c3eae5d09dc69735.png",
          days: 30,
          prview: 0
        },
        {
          name_en: "Goddess Charm Frame",
          name_tr: "Tanrıça Cazibe Çerçevesi",
          name_ar: "إطار السحر الإلهي",
          image_url_en: "/assets/rewards/6a9efb13b56621a1497b4e7754b41bb5.png",
          show_url: "/assets/rewards/d0f87eef80141308c6bbb5499293d146.svga",
          days: 30,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Wings of Radiance Mount",
          name_tr: "Işıltı Kanatları Aracı",
          name_ar: "أجنحة الإشعاع",
          image_url_en: "/assets/rewards/f1d9f1d5615ea16f88703f40578ed986.png",
          show_url: "/assets/rewards/f8e6d4c6191ebc26086740b97a33cc65.mp4",
          days: 30,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Top 1 Charm Badge",
          name_tr: "1. Cazibe Rozeti",
          name_ar: "شارة السحر الأول",
          image_url_en: "/assets/rewards/48ac6fc688b086bce55ec8ea630f76d6.png",
          days: 30,
          prview: 0,
          show_key: []
        }
      ],
      // Top 2 Charm
      [
        {
          name_en: "Top 2 Charm Frame",
          name_tr: "2. Cazibe Çerçevesi",
          name_ar: "إطار السحر الثاني",
          image_url_en: "/assets/rewards/4a7419f690d2cfafef642821df65e6f9.png",
          show_url: "/assets/rewards/19c258ae5792c85ef337a3543e1dbb28.svga",
          days: 15,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Pink Cruiser",
          name_tr: "Pembe Kruvazör Araç",
          name_ar: "مركبة الطراد الوردي",
          image_url_en: "/assets/rewards/81812f36e5b5c04ddf7ecbb77b7a4a18.png",
          show_url: "/assets/rewards/6164a94e27aa81088430569b26646af6.mp4",
          days: 15,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Top 2 Charm Badge",
          name_tr: "2. Cazibe Rozeti",
          name_ar: "شارة السحر الثاني",
          image_url_en: "/assets/rewards/9135d6605a27f6fa1d2a7170e0ced87b.png",
          days: 15,
          prview: 0,
          show_key: []
        }
      ],
      // Top 3 Charm
      [
        {
          name_en: "Top 3 Charm Frame",
          name_tr: "3. Cazibe Çerçevesi",
          name_ar: "إطار السحر الثالث",
          image_url_en: "/assets/rewards/41a6c0195a1343883c9b5b8ec0c8c380.png",
          show_url: "/assets/rewards/34acbaf23ba9ddb172738526eea5911e.svga",
          days: 7,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Top 3 Charm Badge",
          name_tr: "3. Cazibe Rozeti",
          name_ar: "شارة السحر الثالث",
          image_url_en: "/assets/rewards/4cbe1020d9daf09cd6c1e6a22a502ca3.png",
          days: 7,
          prview: 0,
          show_key: []
        }
      ]
    ]
  },
  room: {
    top3: [
      {
        roomno: 1012781,
        room_name: "VIP Night Club 🔥",
        logo: "/d17ujs28mie8b2.cloudfront.net/1012781-RoomLogo-CCD3A2C4674F387B2A5DF9E649076E5A.png",
        score: 58200000
      },
      {
        roomno: 9520800,
        room_name: "Music & Chill 🎵",
        logo: "/d17ujs28mie8b2.cloudfront.net/9520800-RoomLogo-E23BCFAD4717303E6720C2558CC6EE08.jpg",
        score: 39500000
      },
      {
        roomno: 9574242,
        room_name: "Royal Palace 👑",
        logo: "/d17ujs28mie8b2.cloudfront.net/9574242-RoomLogo-06A2C0A19162D405A70CBABE5B0137DD.jpg",
        score: 29800000
      }
    ],
    rewards: [
      // Top 1 Room
      [
        {
          name_en: "Top 1 Room Banner",
          name_tr: "1. Oda Bannerı",
          name_ar: "بانر الغرفة الأول",
          image_url_en: "/assets/rewards/27e1add1d82664838fb818d059338ebc.png",
          days: 30,
          prview: 0
        },
        {
          name_en: "Imperial Palace Room Frame",
          name_tr: "İmparatorluk Oda Çerçevesi",
          name_ar: "إطار غرفة القصر الإمبراطوري",
          image_url_en: "/assets/rewards/9fb00acd95d3be82871adf26405a348e.png",
          show_url: "/assets/rewards/addf5ced8340d04f8b1c62d73b8ed7c0.svga",
          days: 30,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Golden Dragon Cruiser",
          name_tr: "Altın Ejderha Aracı",
          name_ar: "مركبة التنين الذهبي",
          image_url_en: "/assets/rewards/891fc92e9a4ad3b8230a55dcc0c06d4b.png",
          show_url: "/assets/rewards/954a8bff99683aacb0f162ea01e4ba63.mp4",
          days: 30,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Top 1 Room Medal",
          name_tr: "1. Oda Madalyası",
          name_ar: "وسام الغرفة الأول",
          image_url_en: "/assets/rewards/8OYnA9mMmW4ft5XGqNdwt1prkVexmx8J.png",
          days: 30,
          prview: 0,
          show_key: []
        }
      ],
      // Top 2 Room
      [
        {
          name_en: "Top 2 Room Frame",
          name_tr: "2. Oda Çerçevesi",
          name_ar: "إطار الغرفة الثاني",
          image_url_en: "/assets/rewards/d14a3a079c8db3585177ddfd0c86a370.png",
          show_url: "/assets/rewards/19eabba24ee1b087307ea46a6b9ee484.svga",
          days: 15,
          prview: 1,
          show_key: []
        },
        {
          name_en: "Starlight Airship",
          name_tr: "Yıldız Işığı Hava Gemisi",
          name_ar: "سفينة ضوء النجوم",
          image_url_en: "/assets/rewards/a72d8e9d64334a4a3a53c20b1c6c4a93.png",
          show_url: "/assets/rewards/7f4ecdf16fb753a58d3dfd55e406655f.mp4",
          days: 15,
          prview: 1,
          show_key: []
        }
      ],
      // Top 3 Room
      [
        {
          name_en: "Top 3 Room Frame",
          name_tr: "3. Oda Çerçevesi",
          name_ar: "إطار الغرفة الثالث",
          image_url_en: "/assets/rewards/f64c37e904eb7f60619ce3cc4be983b3.png",
          show_url: "/assets/rewards/8bad2969fde3d7cd53ac6b6e93ebb34f.svga",
          days: 7,
          prview: 1,
          show_key: []
        }
      ]
    ]
  }
};

fs.writeFileSync(path.join(__dirname, 'mock_data.json'), JSON.stringify(mockData, null, 2), 'utf8');
console.log('Saved mock_data.json successfully!');
