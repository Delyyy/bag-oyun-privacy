// Bağ — 88 seviyelik veritabanı, kademeli grup artışı
//
// Tier ve grup sayısı eğrisi:
//   tutorial (1-3):    1-2 grup    (4-8 kelime)
//   warmup   (4-8):    2-3 grup    (8-12 kelime)
//   easy     (9-28):   4 grup      (16 kelime)
//   medium   (29-48):  4 grup      (16 kelime)
//   hard     (49-63):  4 grup      (16 kelime)
//   impossible (64-78):4 grup      (16 kelime)
//   master   (79-88):  5 grup      (20 kelime) — USTA seviyesi
//
// Her level: groups[] (1..N grup), her grup 4 kelime
// maxMistakes: opsiyonel; tanımsızsa tier default kullanılır

const TIERS = {
  tutorial:   { name: "BAŞLANGIÇ", maxMistakes: 5, color: "easy"   },
  warmup:     { name: "ISINMA",    maxMistakes: 5, color: "easy"   },
  easy:       { name: "KOLAY",     maxMistakes: 5, color: "easy"   },
  medium:     { name: "ORTA",      maxMistakes: 4, color: "medium" },
  hard:       { name: "ZOR",       maxMistakes: 3, color: "hard"   },
  impossible: { name: "İMKANSIZ",  maxMistakes: 2, color: "tricky" },
  master:     { name: "USTA",      maxMistakes: 4, color: "master" },
  legendary:  { name: "EFSANE",    maxMistakes: 3, color: "legendary" }
};

const LEVELS = [
  // ============ TUTORIAL (1-3) — 1-2 grup ============
  { id: 1, tier: "tutorial", maxMistakes: 99, groups: [
    { category: "RENKLER", difficulty: "easy", words: ["KIRMIZI", "MAVİ", "YEŞİL", "SARI"] }
  ]},
  { id: 2, tier: "tutorial", maxMistakes: 99, groups: [
    { category: "SAYILAR", difficulty: "easy", words: ["BİR", "İKİ", "ÜÇ", "DÖRT"] }
  ]},
  { id: 3, tier: "tutorial", maxMistakes: 5, groups: [
    { category: "MEYVELER", difficulty: "easy", words: ["ELMA", "ARMUT", "KİRAZ", "ÜZÜM"] },
    { category: "SEBZELER", difficulty: "medium", words: ["DOMATES", "BİBER", "SALATALIK", "PATATES"] }
  ]},

  // ============ WARMUP (4-8) — 2-3 grup ============
  { id: 4, tier: "warmup", maxMistakes: 5, groups: [
    { category: "GÜNLER", difficulty: "easy", words: ["PAZAR", "SALI", "PERŞEMBE", "CUMA"] },
    { category: "AYLAR", difficulty: "medium", words: ["OCAK", "ŞUBAT", "MART", "NİSAN"] }
  ]},
  { id: 5, tier: "warmup", maxMistakes: 5, groups: [
    { category: "EVCİL HAYVAN", difficulty: "easy", words: ["KEDİ", "KÖPEK", "KUŞ", "BALIK"] },
    { category: "ÇİÇEKLER", difficulty: "medium", words: ["GÜL", "LALE", "PAPATYA", "MENEKŞE"] }
  ]},
  { id: 6, tier: "warmup", maxMistakes: 5, groups: [
    { category: "İÇECEKLER", difficulty: "easy", words: ["ÇAY", "KAHVE", "AYRAN", "SU"] },
    { category: "TÜRK YEMEK", difficulty: "medium", words: ["KEBAP", "KÖFTE", "PİLAV", "ÇORBA"] },
    { category: "TATLILAR", difficulty: "hard", words: ["BAKLAVA", "HELVA", "REVANİ", "REÇEL"] }
  ]},
  { id: 7, tier: "warmup", maxMistakes: 5, groups: [
    { category: "TAŞITLAR", difficulty: "easy", words: ["ARABA", "OTOBÜS", "TREN", "UÇAK"] },
    { category: "VAHŞİ HAYVAN", difficulty: "medium", words: ["ASLAN", "KAPLAN", "KURT", "AYI"] },
    { category: "GİYSİLER", difficulty: "hard", words: ["GÖMLEK", "PANTOLON", "ETEK", "CEKET"] }
  ]},
  { id: 8, tier: "warmup", maxMistakes: 5, groups: [
    { category: "SPORLAR", difficulty: "easy", words: ["FUTBOL", "BASKETBOL", "VOLEYBOL", "TENİS"] },
    { category: "MÜZİK ALETLERİ", difficulty: "medium", words: ["GİTAR", "PİYANO", "KEMAN", "DAVUL"] },
    { category: "MESLEKLER", difficulty: "hard", words: ["DOKTOR", "ÖĞRETMEN", "PİLOT", "AŞÇI"] }
  ]},

  // ============ KOLAY (9-28) — 4 grup ============
  { id: 9, tier: "easy", groups: [
    { category: "RENKLER 2", difficulty: "easy", words: ["PEMBE", "MOR", "TURUNCU", "GRİ"] },
    { category: "MEYVELER 2", difficulty: "medium", words: ["MUZ", "ŞEFTALİ", "KARPUZ", "KAVUN"] },
    { category: "MEVSİMLER", difficulty: "hard", words: ["İLKBAHAR", "YAZ", "SONBAHAR", "KIŞ"] },
    { category: "ŞEKİLLER", difficulty: "tricky", words: ["DAİRE", "KARE", "ÜÇGEN", "DİKDÖRTGEN"] }
  ]},
  { id: 10, tier: "easy", groups: [
    { category: "GÜNLER 2", difficulty: "easy", words: ["PAZARTESİ", "ÇARŞAMBA", "CUMARTESİ", "PERŞEMBE_2"] },
    { category: "VÜCUT ORGANLARI", difficulty: "medium", words: ["KALP", "AKCİĞER", "BEYİN", "MİDE"] },
    { category: "DENİZ TAŞITLARI", difficulty: "hard", words: ["GEMİ", "VAPUR", "KAYIK", "YELKENLİ"] },
    { category: "EV EŞYALARI", difficulty: "tricky", words: ["MASA", "SANDALYE", "DOLAP", "YATAK"] }
  ]},
  { id: 11, tier: "easy", groups: [
    { category: "İÇECEK 2", difficulty: "easy", words: ["LİMONATA", "ŞALGAM", "BOZA", "SAHLEP"] },
    { category: "GİYSİ 2", difficulty: "medium", words: ["KAZAK", "MONT", "ELBİSE", "KABAN"] },
    { category: "MESLEK 2", difficulty: "hard", words: ["MÜHENDİS", "AVUKAT", "POLİS", "MİMAR"] },
    { category: "OYUNCAKLAR", difficulty: "tricky", words: ["TOP", "BEBEK", "PUZZLE", "LEGO"] }
  ]},
  { id: 12, tier: "easy", groups: [
    { category: "DERSLER", difficulty: "easy", words: ["MATEMATİK", "TARİH", "FİZİK", "BİYOLOJİ"] },
    { category: "AKRABALAR", difficulty: "medium", words: ["ANNE", "BABA", "TEYZE", "DAYI"] },
    { category: "OKUL EŞYALARI", difficulty: "hard", words: ["KALEM", "DEFTER", "SİLGİ", "ÇANTA"] },
    { category: "ÇİÇEK 2", difficulty: "tricky", words: ["KARANFİL", "ZAMBAK", "NERGİS", "AYÇİÇEĞİ"] }
  ]},
  { id: 13, tier: "easy", groups: [
    { category: "KÜMES HAYVAN", difficulty: "easy", words: ["TAVUK", "HOROZ", "ÖRDEK", "KAZ"] },
    { category: "MUTFAK ALETİ", difficulty: "medium", words: ["KAŞIK", "ÇATAL", "BIÇAK", "TENCERE"] },
    { category: "AĞAÇ TÜRÜ", difficulty: "hard", words: ["MEŞE", "ÇAM", "KAVAK", "ÇINAR"] },
    { category: "BAYRAMLAR", difficulty: "tricky", words: ["RAMAZAN", "KURBAN", "CUMHURİYET", "ZAFER"] }
  ]},
  { id: 14, tier: "easy", groups: [
    { category: "TEMİZLİK", difficulty: "easy", words: ["SABUN", "DETERJAN", "FIRÇA", "SÜNGER"] },
    { category: "DOĞA OLAYI", difficulty: "medium", words: ["YAĞMUR", "KAR", "FIRTINA", "DOLU"] },
    { category: "ÇİFTLİK HAYVANI", difficulty: "hard", words: ["İNEK", "AT", "KOYUN", "KEÇİ"] },
    { category: "MATEMATİK İŞLEM", difficulty: "tricky", words: ["TOPLAMA", "ÇIKARMA", "ÇARPMA", "BÖLME"] }
  ]},
  { id: 15, tier: "easy", groups: [
    { category: "İLETİŞİM", difficulty: "easy", words: ["TELEFON", "EMAIL", "MEKTUP", "TELGRAF"] },
    { category: "SU SPORU", difficulty: "medium", words: ["YÜZME", "DALMA", "SÖRF", "KÜREK"] },
    { category: "VÜCUT BÖLGESİ", difficulty: "hard", words: ["BAŞ", "KOL", "BACAK", "GÖVDE"] },
    { category: "KIYAFET MALZEMESİ", difficulty: "tricky", words: ["PAMUK", "YÜN", "İPEK", "DERİ"] }
  ]},
  { id: 16, tier: "easy", groups: [
    { category: "ASKER RÜTBE", difficulty: "easy", words: ["ER", "ONBAŞI", "ÇAVUŞ", "TEĞMEN"] },
    { category: "AKDENİZ ÜRÜNÜ", difficulty: "medium", words: ["ZEYTİN", "İNCİR", "NAR", "PORTAKAL"] },
    { category: "PEYNİR ÇEŞİTİ", difficulty: "hard", words: ["BEYAZ", "KAŞAR", "TULUM", "EZİNE"] },
    { category: "ŞEKİL 2", difficulty: "tricky", words: ["YUVARLAK", "OVAL", "KÜP", "PİRAMİT"] }
  ]},
  { id: 17, tier: "easy", groups: [
    { category: "TROPİK MEYVE", difficulty: "easy", words: ["MANGO", "ANANAS", "AVOKADO", "PAPAYA"] },
    { category: "TÜRK ŞEHRİ", difficulty: "medium", words: ["İZMİR", "BURSA", "KONYA", "ADANA"] },
    { category: "MUTFAK ÜRÜNÜ", difficulty: "hard", words: ["UN", "ŞEKER", "TUZ", "YAĞ"] },
    { category: "BURÇLAR", difficulty: "tricky", words: ["KOÇ", "BOĞA", "İKİZLER", "YENGEÇ"] }
  ]},
  { id: 18, tier: "easy", groups: [
    { category: "DENİZLER", difficulty: "easy", words: ["EGE", "AKDENİZ", "MARMARA", "KARADENİZ"] },
    { category: "MÜZİK ALETİ 2", difficulty: "medium", words: ["TROMPET", "FLÜT", "SAKSAFON", "OBUA"] },
    { category: "METALLER", difficulty: "hard", words: ["ALTIN", "GÜMÜŞ", "BAKIR", "DEMİR"] },
    { category: "YIL DİLİMİ", difficulty: "tricky", words: ["GÜN", "HAFTA", "AY", "YIL"] }
  ]},
  { id: 19, tier: "easy", groups: [
    { category: "KÖPEK CİNSİ", difficulty: "easy", words: ["KANGAL", "AKBAŞ", "GOLDEN", "HUSKY"] },
    { category: "TURİSTİK YER", difficulty: "medium", words: ["AYASOFYA", "KAPADOKYA", "EFES", "PAMUKKALE"] },
    { category: "KEDİ CİNSİ", difficulty: "hard", words: ["VAN", "TEKİR", "ANKARA", "SİYAM"] },
    { category: "TATLI ___", difficulty: "tricky", words: ["DİL", "RÜYA", "SU", "NİYET"] }
  ]},
  { id: 20, tier: "easy", groups: [
    { category: "AYAKKABI", difficulty: "easy", words: ["SPOR", "BOT", "SANDALET", "TERLİK"] },
    { category: "KUMAŞ TÜRÜ", difficulty: "medium", words: ["SATEN", "KADİFE", "KETEN", "DENİM"] },
    { category: "EGZOTİK MEYVE", difficulty: "hard", words: ["HURMA", "KİVİ", "HİNDİSTAN_CEVİZİ", "GREYFURT"] },
    { category: "KEDİ ___", difficulty: "tricky", words: ["MAMASI", "KULAĞI", "TUVALETİ", "OYUNU"] }
  ]},
  { id: 21, tier: "easy", groups: [
    { category: "TAKILAR", difficulty: "easy", words: ["KÜPE", "KOLYE", "BİLEZİK", "YÜZÜK"] },
    { category: "SEBZE 2", difficulty: "medium", words: ["KABAK", "PATLICAN", "ENGİNAR", "PIRASA"] },
    { category: "BAKLİYAT", difficulty: "hard", words: ["MERCİMEK", "NOHUT", "FASULYE", "BEZELYE"] },
    { category: "PATATES ___", difficulty: "tricky", words: ["KIZARTMASI", "SALATASI", "PÜRESİ", "EKMEĞİ"] }
  ]},
  { id: 22, tier: "easy", groups: [
    { category: "TATİLDE", difficulty: "easy", words: ["KUM", "ŞEMSİYE", "MAYO", "BORNOZ"] },
    { category: "KIŞ AKTİVİTESİ", difficulty: "medium", words: ["KAYAK", "KIZAK", "KARTOPU", "PATEN"] },
    { category: "SU ALTI", difficulty: "hard", words: ["MERCAN", "AHTAPOT", "SÜNGER", "DENİZATI"] },
    { category: "DENİZ ___", difficulty: "tricky", words: ["KENARI", "ANASI", "FENERİ", "YILDIZI"] }
  ]},
  { id: 23, tier: "easy", groups: [
    { category: "ÇİZGİ FİLM", difficulty: "easy", words: ["MİKİ", "DONALD", "GOFY", "PLUTO"] },
    { category: "TÜRK ÇİZGİ", difficulty: "medium", words: ["KELOĞLAN", "NASRETTİN", "KARAOĞLAN", "RAFADAN"] },
    { category: "ANİMASYON STÜDYO", difficulty: "hard", words: ["DİSNEY", "PİXAR", "GHIBLI", "DREAMWORKS"] },
    { category: "ÇİZGİ ___", difficulty: "tricky", words: ["ROMAN", "FİLM", "KIRMA", "DEFTER"] }
  ]},
  { id: 24, tier: "easy", groups: [
    { category: "SOSYAL MEDYA", difficulty: "easy", words: ["INSTAGRAM", "FACEBOOK", "TWITTER", "TIKTOK"] },
    { category: "BİLGİSAYAR PARÇASI", difficulty: "medium", words: ["KLAVYE", "FARE", "EKRAN", "KASA"] },
    { category: "TEKNOLOJİ MARKASI", difficulty: "hard", words: ["APPLE", "SAMSUNG", "GOOGLE", "MICROSOFT"] },
    { category: "CEP ___", difficulty: "tricky", words: ["TELEFONU", "SAATİ", "HARÇLIĞI", "BAŞINA"] }
  ]},
  { id: 25, tier: "easy", groups: [
    { category: "SES TÜRÜ", difficulty: "easy", words: ["MÜZİK", "KONUŞMA", "GÜRÜLTÜ", "FISILTI"] },
    { category: "MÜZİK TÜRÜ", difficulty: "medium", words: ["POP", "ROCK", "RAP", "ARABESK"] },
    { category: "TÜRK POP", difficulty: "hard", words: ["KENAN", "TARKAN", "GÜLŞEN", "MUSTAFA"] },
    { category: "SES ___", difficulty: "tricky", words: ["TONU", "SANATÇISI", "KAYDI", "BOMBASI"] }
  ]},
  { id: 26, tier: "easy", groups: [
    { category: "SAYI ARTIŞI", difficulty: "easy", words: ["ON", "YÜZ", "BİN", "MİLYON"] },
    { category: "BÜYÜK SAYI", difficulty: "medium", words: ["MİLYAR", "TRİLYON", "KATRİLYON", "KENTİLYON"] },
    { category: "GEOMETRİ", difficulty: "hard", words: ["AÇI", "KENAR", "KÖŞE", "YÜZEY"] },
    { category: "BİR ___", difficulty: "tricky", words: ["BAKIMA", "ARADAN", "HAFTA", "ZAMANLAR"] }
  ]},
  { id: 27, tier: "easy", groups: [
    { category: "BAYRAK", difficulty: "easy", words: ["TÜRK", "AMERİKAN", "FRANSIZ", "ALMAN"] },
    { category: "ÜLKE PARASI", difficulty: "medium", words: ["DOLAR", "EURO", "YEN", "STERLİN"] },
    { category: "BAŞKENTLER", difficulty: "hard", words: ["ANKARA", "BERLİN", "PARİS", "LONDRA"] },
    { category: "ALTIN ___", difficulty: "tricky", words: ["BİLEZİK", "ÇAĞ", "GÜN", "ORAN"] }
  ]},
  { id: 28, tier: "easy", groups: [
    { category: "GÖZLÜK", difficulty: "easy", words: ["CAM", "GÜNEŞ", "OKUMA", "ÇERÇEVE"] },
    { category: "SAAT TÜRÜ", difficulty: "medium", words: ["KOL", "DUVAR", "ÇALAR", "KUM"] },
    { category: "ZAMAN ÖLÇERİ", difficulty: "hard", words: ["KRONOMETRE", "GÜNEŞ_SAATİ", "KUM_SAATİ", "SARKAÇ"] },
    { category: "SAAT ___", difficulty: "tricky", words: ["KULESİ", "BAŞI", "KAYIŞI", "FARKI"] }
  ]},

  // ============ ORTA (29-48) — 4 grup ============
  { id: 29, tier: "medium", groups: [
    { category: "DENİZ CANLISI", difficulty: "easy", words: ["BALIK", "İSTAVRİT", "YENGEÇ", "DENİZYILDIZI"] },
    { category: "DAĞLAR", difficulty: "medium", words: ["AĞRI", "ULUDAĞ", "ERCİYES", "ILGAZ"] },
    { category: "GEZEGEN", difficulty: "hard", words: ["MERKÜR", "VENÜS", "MARS", "JÜPİTER"] },
    { category: "PAZAR ___", difficulty: "tricky", words: ["GÜNÜ", "YERİ", "ESNAF", "ARABA"] }
  ]},
  { id: 30, tier: "medium", groups: [
    { category: "İLLER", difficulty: "easy", words: ["ANTALYA", "MUĞLA", "AYDIN", "DENİZLİ"] },
    { category: "OPERA TERİMİ", difficulty: "medium", words: ["ARYA", "TENOR", "SOPRANO", "KORO"] },
    { category: "TÜRK FİLMLERİ", difficulty: "hard", words: ["EŞKIYA", "VİZONTELE", "AĞA", "MUHSİN"] },
    { category: "AY ___", difficulty: "tricky", words: ["YILDIZ", "IŞIK", "TUTULMASI", "BALIĞI"] }
  ]},
  { id: 31, tier: "medium", groups: [
    { category: "TÜRK MUTFAK", difficulty: "easy", words: ["MANTI", "PİDE", "DOLMA", "BÖREK"] },
    { category: "İSTANBUL SEMTİ", difficulty: "medium", words: ["BALAT", "ORTAKÖY", "BEBEK", "MODA"] },
    { category: "TÜRK ROCK", difficulty: "hard", words: ["MOR_VE_ÖTESİ", "DUMAN", "MFÖ", "ATHENA"] },
    { category: "EVDE TUTULAN ___", difficulty: "tricky", words: ["YAS", "ORUÇ", "SIR", "DEFTER"] }
  ]},
  { id: 32, tier: "medium", groups: [
    { category: "FUTBOL TAKIMI", difficulty: "easy", words: ["FENERBAHÇE", "GALATASARAY", "BEŞİKTAŞ", "TRABZONSPOR"] },
    { category: "TÜRK ŞARKICI", difficulty: "medium", words: ["TARKAN", "SEZEN", "AJDA", "BARIŞ"] },
    { category: "OSMANLI PADİŞAHI", difficulty: "hard", words: ["FATİH", "YAVUZ", "KANUNİ", "ABDÜLHAMİT"] },
    { category: "GÜL ___", difficulty: "tricky", words: ["BAHÇESİ", "SUYU", "PEMBE", "REÇELİ"] }
  ]},
  { id: 33, tier: "medium", groups: [
    { category: "TIBBİ TERİM", difficulty: "easy", words: ["TANSİYON", "NABIZ", "TEŞHİS", "MUAYENE"] },
    { category: "YILDIZ İŞARETİ", difficulty: "medium", words: ["ASLAN", "BAŞAK", "TERAZİ", "AKREP"] },
    { category: "TÜRK YAZAR", difficulty: "hard", words: ["KEMAL", "PAMUK", "TANPINAR", "ATAY"] },
    { category: "EL ___", difficulty: "tricky", words: ["KİTABI", "SANATI", "BOMBASI", "FENERİ"] }
  ]},
  { id: 34, tier: "medium", groups: [
    { category: "TÜRK BAYRAĞI", difficulty: "easy", words: ["KIRMIZI", "AY", "YILDIZ", "BEYAZ"] },
    { category: "İÇKİLER", difficulty: "medium", words: ["RAKI", "ŞARAP", "BİRA", "ŞALGAM"] },
    { category: "TÜRK YÖNETMEN", difficulty: "hard", words: ["CEYLAN", "AKIN", "ERKSAN", "GÜNEY"] },
    { category: "ÇAY ___", difficulty: "tricky", words: ["BAHÇESİ", "TABAĞI", "KAŞIĞI", "DEMLİĞİ"] }
  ]},
  { id: 35, tier: "medium", groups: [
    { category: "EKMEK TÜRÜ", difficulty: "easy", words: ["EKMEK", "SİMİT", "POĞAÇA", "PİDE_2"] },
    { category: "İLK YARDIM", difficulty: "medium", words: ["BANT", "PAMUK", "GAZLI", "MERHEM"] },
    { category: "ANTİK ŞEHİR", difficulty: "hard", words: ["EFES_2", "TROYA", "PERGAMON", "ASPENDOS"] },
    { category: "ATEŞ ___", difficulty: "tricky", words: ["BÖCEĞİ", "PAHASINA", "TOPU", "HATTI"] }
  ]},
  { id: 36, tier: "medium", groups: [
    { category: "TÜRK MARKA", difficulty: "easy", words: ["ARÇELİK", "VESTEL", "BEKO", "MAVİ"] },
    { category: "TÜRK DİZİ", difficulty: "medium", words: ["KURTLAR", "ÇUKUR", "BEHZAT", "EZEL"] },
    { category: "GEMİ BÖLÜMÜ", difficulty: "hard", words: ["PRUVA", "PUPA", "İSKELE", "SANCAK"] },
    { category: "BAŞ ___", difficulty: "tricky", words: ["AĞRISI", "BAKAN", "ROL", "KAHRAMAN"] }
  ]},
  { id: 37, tier: "medium", groups: [
    { category: "DÜĞÜN OBJESİ", difficulty: "easy", words: ["YÜZÜK_2", "GELİNLİK", "PASTA", "BUKET"] },
    { category: "KOZMETİK", difficulty: "medium", words: ["RUJ", "MASKARA", "PUDRA", "OJE"] },
    { category: "TÜRK SİNEMA", difficulty: "hard", words: ["AKAD", "BERKER", "ARKIN", "İNANIR"] },
    { category: "AÇIK ___", difficulty: "tricky", words: ["ARTIRMA", "DENİZ", "BÜFE", "GÖRÜŞLÜ"] }
  ]},
  { id: 38, tier: "medium", groups: [
    { category: "İSTANBUL CAMİSİ", difficulty: "easy", words: ["SÜLEYMANİYE", "SULTANAHMET", "EYÜP", "ORTAKÖY_2"] },
    { category: "ŞİİR BİÇİMİ", difficulty: "medium", words: ["KOŞMA", "MANİ", "TÜRKÜ", "DESTAN"] },
    { category: "MİTOLOJİ", difficulty: "hard", words: ["ZÜMRÜDÜANKA", "EJDERHA", "PERİ", "DEV"] },
    { category: "AT ___", difficulty: "tricky", words: ["YARIŞI", "NALI", "GÖZLÜĞÜ", "KESTANESİ"] }
  ]},
  { id: 39, tier: "medium", groups: [
    { category: "TURİSTİK BÖLGE", difficulty: "easy", words: ["KAPADOKYA", "PAMUKKALE", "OLİMPOS", "NEMRUT"] },
    { category: "MİLLİ PARK", difficulty: "medium", words: ["KÖPRÜLÜ", "GÖREME", "MUNZUR", "SOĞANLI"] },
    { category: "TÜRK SAVUNMA", difficulty: "hard", words: ["ATAK", "BAYRAKTAR", "AKINCI", "AKSUNGUR"] },
    { category: "KARLI ___", difficulty: "tricky", words: ["DAĞ", "GÜN_2", "TEPELER", "MEVSİM"] }
  ]},
  { id: 40, tier: "medium", groups: [
    { category: "ÇOCUK OYUNU", difficulty: "easy", words: ["SAKLAMBAÇ", "BİRDİRBİR", "İSTOP", "YAKARTOP"] },
    { category: "GAZETE BÖLÜMÜ", difficulty: "medium", words: ["MANŞET", "KÖŞE", "SPOR", "MAGAZİN"] },
    { category: "MİZAH DERGİSİ", difficulty: "hard", words: ["GIRGIR", "LEMAN", "PENGUEN", "UYKUSUZ"] },
    { category: "KÖŞE ___", difficulty: "tricky", words: ["BAŞI", "TAŞI", "YAZARI", "ATIŞI"] }
  ]},
  { id: 41, tier: "medium", groups: [
    { category: "HAVA OLAYI", difficulty: "easy", words: ["SİS", "RÜZGAR", "ŞİMŞEK", "GÖKKUŞAĞI"] },
    { category: "HALK MÜZİĞİ", difficulty: "medium", words: ["MİSKET", "KÖROĞLU", "HALAY", "ZEYBEK"] },
    { category: "TÜRK BANKA", difficulty: "hard", words: ["ZİRAAT", "AKBANK", "GARANTİ", "İŞBANKASI"] },
    { category: "DOĞA ___", difficulty: "tricky", words: ["KORUMA", "OLAYI", "SPORLARI", "YÜRÜYÜŞÜ"] }
  ]},
  { id: 42, tier: "medium", groups: [
    { category: "HARİTA İŞARETİ", difficulty: "easy", words: ["DAĞ_2", "OVA", "GÖL", "NEHİR"] },
    { category: "ÇAY DEMLEME", difficulty: "medium", words: ["DEMLİK", "KETTLE", "SÜZGEÇ", "BARDAK"] },
    { category: "GASTRONOMİ ŞEHRİ", difficulty: "hard", words: ["GAZİANTEP", "HATAY", "AFYON", "MERSİN"] },
    { category: "SÜT ___", difficulty: "tricky", words: ["ANNESİ", "KARDEŞ", "KUZUSU", "TOZU"] }
  ]},
  { id: 43, tier: "medium", groups: [
    { category: "SOKAK HAYVANI", difficulty: "easy", words: ["KEDİ_2", "KÖPEK_2", "KARGA", "GÜVERCİN"] },
    { category: "KUŞ TÜRÜ", difficulty: "medium", words: ["KARTAL", "ŞAHİN", "MARTI", "BAYKUŞ"] },
    { category: "NESLİ TÜKENEN", difficulty: "hard", words: ["KAPLAN_2", "GERGEDAN", "PANDA", "ANADOLU_PARSI"] },
    { category: "KARTAL ___", difficulty: "tricky", words: ["YUVASI", "BAKIŞI", "GÖZÜ", "PENÇESİ"] }
  ]},
  { id: 44, tier: "medium", groups: [
    { category: "TÜRK YEMEK", difficulty: "easy", words: ["KEBAP_2", "KÖFTE_2", "PİLAV_2", "ÇORBA_2"] },
    { category: "TÜRK KAHVALTI", difficulty: "medium", words: ["BAL", "REÇEL", "KAYMAK", "SUCUK"] },
    { category: "ZEYTİN TÜRÜ", difficulty: "hard", words: ["SİYAH", "YEŞİL", "GEMLİK", "EDREMİT"] },
    { category: "BAL ___", difficulty: "tricky", words: ["KABAĞI", "KÖPÜĞÜ", "MUMU", "ARISI"] }
  ]},
  { id: 45, tier: "medium", groups: [
    { category: "DOĞAL GAZ", difficulty: "easy", words: ["DOĞAL", "OKSİJEN", "AZOT", "HİDROJEN"] },
    { category: "KİMYASAL", difficulty: "medium", words: ["ASİT", "BAZ", "TUZ_2", "ALKOL"] },
    { category: "ELEMENT", difficulty: "hard", words: ["SODYUM", "KALSİYUM", "MAGNEZYUM", "POTASYUM"] },
    { category: "SU ___", difficulty: "tricky", words: ["DEPOSU", "KESİNTİSİ", "ÇİÇEĞİ", "ALTI"] }
  ]},
  { id: 46, tier: "medium", groups: [
    { category: "TÜRK ROMANI", difficulty: "easy", words: ["ÇALIKUŞU", "ŞU_ÇILGIN", "AŞK_I_MEMNU", "MAİ_VE_SİYAH"] },
    { category: "TÜRK ROMANCISI", difficulty: "medium", words: ["REŞAT", "HALİT", "ORHAN", "AHMET"] },
    { category: "TÜRK TİYATRO YAZARI", difficulty: "hard", words: ["MUHSİN_2", "TURGUT", "NEVZAT", "REFİK"] },
    { category: "KARA ___", difficulty: "tricky", words: ["BORSA", "KEDİ", "MAYA", "MİZAH"] }
  ]},
  { id: 47, tier: "medium", groups: [
    { category: "SU SPORU 2", difficulty: "easy", words: ["YÜZME_2", "SU_TOPU", "KAYAK_2", "YELKEN"] },
    { category: "KIŞ SPORU", difficulty: "medium", words: ["SNOWBOARD", "BUZ_HOKEYİ", "KIZAK_2", "PATEN_2"] },
    { category: "GRAND SLAM", difficulty: "hard", words: ["AVUSTRALYA", "FRANSA", "WIMBLEDON", "ABD"] },
    { category: "SPOR ___", difficulty: "tricky", words: ["SALONU", "AYAKKABISI", "YORUMCU", "PROGRAMI"] }
  ]},
  { id: 48, tier: "medium", groups: [
    { category: "TAKVİM TÜRÜ", difficulty: "easy", words: ["DUVAR_2", "MASA_2", "AJANDA", "KAĞIT"] },
    { category: "BAYRAM", difficulty: "medium", words: ["ŞEKER", "KURBAN_2", "ÇOCUK", "ANNE_2"] },
    { category: "MİLLİ GÜN", difficulty: "hard", words: ["NİSAN23", "MAYIS19", "AĞUSTOS30", "EKİM29"] },
    { category: "GÜN ___", difficulty: "tricky", words: ["BATIMI", "ORTASI", "DOĞMASI", "AŞIRI"] }
  ]},

  // ============ ZOR (49-63) — 4 grup ============
  { id: 49, tier: "hard", groups: [
    { category: "NEHİRLER", difficulty: "easy", words: ["KIZILIRMAK", "SAKARYA", "MERİÇ", "ARAS"] },
    { category: "ŞİİR TÜRÜ", difficulty: "medium", words: ["GAZEL", "KASİDE", "MESNEVİ", "RUBAİ"] },
    { category: "OSMANLI MİMARI", difficulty: "hard", words: ["SİNAN", "DAVUT", "AYAS", "MEHMET"] },
    { category: "___ OĞLU", difficulty: "tricky", words: ["KAYIN", "KARA_2", "DAYI_2", "BABA_2"] }
  ]},
  { id: 50, tier: "hard", groups: [
    { category: "EBRU SANATI", difficulty: "easy", words: ["BATTAL", "GELGİT", "BÜLBÜL", "ŞAL"] },
    { category: "BORSA TERİMİ", difficulty: "medium", words: ["AYI", "BOĞA_2", "HİSSE", "ENDEKS"] },
    { category: "PİŞİRME YÖNTEMİ", difficulty: "hard", words: ["KAVURMA", "HAŞLAMA", "KIZARTMA", "BUHARLAMA"] },
    { category: "KARA ___ (2)", difficulty: "tricky", words: ["DENİZ", "PARA", "TAHTA", "TREN_2"] }
  ]},
  { id: 51, tier: "hard", groups: [
    { category: "DİVAN ŞAİRİ", difficulty: "easy", words: ["FUZULİ", "BAKİ", "NEDİM", "NEFİ"] },
    { category: "TÜRK MAKAMI", difficulty: "medium", words: ["HİCAZ", "RAST", "NİHAVENT", "UŞŞAK"] },
    { category: "TÜRK TİYATRO", difficulty: "hard", words: ["KARAGÖZ", "ORTAOYUNU", "MEDDAH", "TULUAT"] },
    { category: "GÖZ ___", difficulty: "tricky", words: ["KIRPMA", "BEBEĞİ", "YAŞARMA", "ÇUKURU"] }
  ]},
  { id: 52, tier: "hard", groups: [
    { category: "OSMANLI PARASI", difficulty: "easy", words: ["AKÇE", "KURUŞ", "PARA_2", "MECİDİYE"] },
    { category: "EDEBİ AKIM", difficulty: "medium", words: ["ROMANTİZM", "REALİZM", "SÜRREALİZM", "EMPRESYONİZM"] },
    { category: "FELSEFİ KAVRAM", difficulty: "hard", words: ["BİLİNÇ", "ÖZGÜRLÜK", "ETİK", "ESTETİK"] },
    { category: "ALTIN ___ (2)", difficulty: "tricky", words: ["YUMURTLAYAN", "POSTU", "MADALYA", "KAFES"] }
  ]},
  { id: 53, tier: "hard", groups: [
    { category: "SATRANÇ TAŞI", difficulty: "easy", words: ["ŞAH", "VEZİR", "KALE", "AT_2"] },
    { category: "TÜRK DESTANI", difficulty: "medium", words: ["ERGENEKON", "OĞUZ", "MANAS", "ALPAMIŞ"] },
    { category: "TARİHTE BARIŞ", difficulty: "hard", words: ["LOZAN", "MUDANYA", "KARLOFÇA", "KÜÇÜK_KAYNARCA"] },
    { category: "DEMİR ___", difficulty: "tricky", words: ["YOLU", "PERDE", "ATA", "LEBLEBİ"] }
  ]},
  { id: 54, tier: "hard", groups: [
    { category: "TARİHİ KÖPRÜ", difficulty: "easy", words: ["MOSTAR", "GALATA", "BOĞAZİÇİ", "MALABADİ"] },
    { category: "TÜRK SAZ", difficulty: "medium", words: ["UD", "NEY", "KEMENÇE", "KANUN"] },
    { category: "AŞIK USTASI", difficulty: "hard", words: ["VEYSEL", "MAHZUNİ", "DAİMİ", "EMRAH"] },
    { category: "ESKİ ___", difficulty: "tricky", words: ["ÇAĞ_2", "ZAMAN", "ARAP", "YUNAN"] }
  ]},
  { id: 55, tier: "hard", groups: [
    { category: "SARAY TATLISI", difficulty: "easy", words: ["ŞERBET", "HELVA", "BAKLAVA", "KURABİYE"] },
    { category: "OSMANLI YEMEK", difficulty: "medium", words: ["MUHALLEBİ", "KEŞKEK", "HÜNKAR", "AŞURE"] },
    { category: "DİVAN NAZIM", difficulty: "hard", words: ["KASİDE_2", "GAZEL_2", "MURABBA", "KITA"] },
    { category: "SOFRA ___", difficulty: "tricky", words: ["BAŞI", "BEZİ", "ADABI", "TUZU"] }
  ]},
  { id: 56, tier: "hard", groups: [
    { category: "NAMAZ VAKTİ", difficulty: "easy", words: ["SABAH", "ÖĞLE", "AKŞAM", "YATSI"] },
    { category: "İSLAMİ TERİM", difficulty: "medium", words: ["İFTAR", "SAHUR", "ORUÇ", "NİYET"] },
    { category: "TÜRK İSLAM ALİMİ", difficulty: "hard", words: ["BİRUNİ", "HAREZMİ", "FARABİ", "İBNSİNA"] },
    { category: "ABDEST ___", difficulty: "tricky", words: ["ALMAK", "BOZULMASI", "SUYU", "AZALARI"] }
  ]},
  { id: 57, tier: "hard", groups: [
    { category: "GEZEGEN", difficulty: "easy", words: ["JÜPİTER_2", "SATÜRN", "NEPTÜN", "URANÜS"] },
    { category: "ASTRONOMİ", difficulty: "medium", words: ["GALAKSİ", "NEBULA", "KOMET", "METEOR"] },
    { category: "ESKİ TÜRK GÖK", difficulty: "hard", words: ["GÜN_3", "AY_2", "YILDIZ_2", "GÖK"] },
    { category: "GÖZ ___ (2)", difficulty: "tricky", words: ["KIRPMAK", "YAŞARMAK", "KAPAĞI", "NURU"] }
  ]},
  { id: 58, tier: "hard", groups: [
    { category: "SAVAŞ ARACI", difficulty: "easy", words: ["TANK", "TOP_2", "UÇAK_2", "GEMİ_2"] },
    { category: "AĞIR SİLAH", difficulty: "medium", words: ["OBÜS", "BOMBA", "ROKET", "FÜZE"] },
    { category: "TÜRK GENERAL", difficulty: "hard", words: ["ÇAKMAK", "KARABEKİR", "ALPDOĞAN", "ATATÜRK"] },
    { category: "TANK ___", difficulty: "tricky", words: ["SAVAR", "MAYINI", "BİRLİĞİ", "FİLOSU"] }
  ]},
  { id: 59, tier: "hard", groups: [
    { category: "BASKETBOL", difficulty: "easy", words: ["BASKET", "RIBAUND", "FAUL", "ASIST"] },
    { category: "TOP SPOR", difficulty: "medium", words: ["FUTBOL_2", "VOLEYBOL_2", "HENTBOL", "TENİS_2"] },
    { category: "TÜRK BASKETBOL", difficulty: "hard", words: ["EFES_3", "TOFAŞ", "PINAR", "DARÜŞŞAFAKA"] },
    { category: "TOP ___", difficulty: "tricky", words: ["AYAK", "LANTI", "ÇUVALI", "ATIŞ"] }
  ]},
  { id: 60, tier: "hard", groups: [
    { category: "ORMAN", difficulty: "easy", words: ["AĞAÇ", "YAPRAK", "KÖK", "DAL"] },
    { category: "KIR ÇİÇEĞİ", difficulty: "medium", words: ["GELİNCİK", "YONCA", "EBEGÜMECİ", "HATMİ"] },
    { category: "DOĞAL AFET", difficulty: "hard", words: ["DEPREM", "TSUNAMİ", "KASIRGA", "VOLKAN"] },
    { category: "AĞAÇ ___", difficulty: "tricky", words: ["DALI", "KÖKÜ", "GÖVDESİ", "KAVUNU"] }
  ]},
  { id: 61, tier: "hard", groups: [
    { category: "KURTULUŞ", difficulty: "easy", words: ["İSTİKLAL", "ZAFER_2", "KURTULUŞ_KELIMESI", "MİSAK"] },
    { category: "ATATÜRK İLKE", difficulty: "medium", words: ["CUMHURİYETÇİLİK", "MİLLİYETÇİLİK", "HALKÇILIK", "LAİKLİK"] },
    { category: "ATATÜRK DEVRİM", difficulty: "hard", words: ["HARF", "ŞAPKA", "KIYAFET_2", "TAKVİM_2"] },
    { category: "19 ___", difficulty: "tricky", words: ["MAYIS", "AĞUSTOS", "EYLÜL", "EKİM"] }
  ]},
  { id: 62, tier: "hard", groups: [
    { category: "BİLİM DALI", difficulty: "easy", words: ["FİZİK", "KİMYA", "BİYOLOJİ", "MATEMATİK"] },
    { category: "BİLGİN", difficulty: "medium", words: ["EİNSTEİN", "NEWTON", "TESLA", "HAWKING"] },
    { category: "ELEMENT 2", difficulty: "hard", words: ["HİDROJEN_2", "OKSİJEN_2", "AZOT_2", "KARBON"] },
    { category: "BİLİM ___", difficulty: "tricky", words: ["KURGU", "ADAMI", "DALI", "TARİHİ"] }
  ]},
  { id: 63, tier: "hard", groups: [
    { category: "NOTA", difficulty: "easy", words: ["DO", "RE", "Mİ", "FA"] },
    { category: "MÜZİK TERİM", difficulty: "medium", words: ["AKOR", "MELODİ", "RİTİM", "TEMPO"] },
    { category: "TÜRK BESTECİ", difficulty: "hard", words: ["SAYGUN", "ERKİN", "TANBURİ", "DEDE_EFENDİ"] },
    { category: "NOTA ___", difficulty: "tricky", words: ["DEFTERİ", "ATMA", "SETİ", "KAĞIDI"] }
  ]},

  // ============ İMKANSIZ (64-78) — 4 grup ============
  { id: 64, tier: "impossible", groups: [
    { category: "YUNAN TANRI", difficulty: "easy", words: ["ZEUS", "POSEIDON", "HADES", "APOLLON"] },
    { category: "FELSEFE YÖNTEMİ", difficulty: "medium", words: ["TÜMEVARIM", "TÜMDENGELİM", "ANALOJİ", "DİYALEKTİK"] },
    { category: "TÜRKÇE EK", difficulty: "hard", words: ["LIK", "CIK", "DAŞ", "GİL"] },
    { category: "TATLI ___ (2)", difficulty: "tricky", words: ["HUYLU", "YEMEK", "PATATES_2", "KAÇIK"] }
  ]},
  { id: 65, tier: "impossible", groups: [
    { category: "İSTASYON", difficulty: "easy", words: ["TREN_3", "BENZİN", "OTOBÜS_2", "RADYO"] },
    { category: "KARA ___ (3)", difficulty: "medium", words: ["KEDİ_3", "KUVVETLERİ", "LİSTE", "GÖZLÜK_2"] },
    { category: "YEŞİL ___", difficulty: "hard", words: ["ÇAM_2", "PASAPORT", "KART", "BİBER_2"] },
    { category: "ARA ___", difficulty: "tricky", words: ["SOKAK", "VERMEK", "TOPLANTI", "BUL"] }
  ]},
  { id: 66, tier: "impossible", groups: [
    { category: "AĞIR ___", difficulty: "easy", words: ["TOP_3", "SİKLET", "İŞÇİ", "CEZA"] },
    { category: "İPEK ___", difficulty: "medium", words: ["BÖCEĞİ", "YOLU_2", "GÖMLEK_2", "SAÇLI"] },
    { category: "BOĞAZ ___", difficulty: "hard", words: ["KÖPRÜSÜ", "AĞRISI", "TURU", "İÇİ"] },
    { category: "KIR ___", difficulty: "tricky", words: ["KOŞUSU", "ÇİÇEĞİ_2", "MİSAFİRİ", "GAZİNOSU"] }
  ]},
  { id: 67, tier: "impossible", groups: [
    { category: "KAFA ___", difficulty: "easy", words: ["KOLU", "KAĞIDI", "DENGİ", "TUTUŞU"] },
    { category: "KALEM ___", difficulty: "medium", words: ["KUTUSU", "OYNATMAK", "AÇACAĞI", "TIRAŞI"] },
    { category: "İSKEMLE ___", difficulty: "hard", words: ["BACAĞI", "MİNDERİ", "OYUNU", "ARKALIĞI"] },
    { category: "AYAK ___", difficulty: "tricky", words: ["İZİ", "BİLEĞİ", "TAKIMI", "PARMAĞI"] }
  ]},
  { id: 68, tier: "impossible", groups: [
    { category: "GÖZ ___ (3)", difficulty: "easy", words: ["ALICI", "KIRPMAK_2", "KAPAĞI_2", "BOYASI"] },
    { category: "GÖZ ___ (4)", difficulty: "medium", words: ["BANT_2", "DAMLASI", "ALIŞKANLIĞI", "BEBEĞİ_2"] },
    { category: "AĞIZ ___", difficulty: "hard", words: ["TADI", "DOLUSU", "BİRLİĞİ", "KAVGASI"] },
    { category: "EL ___ (2)", difficulty: "tricky", words: ["İŞİ", "EMEĞİ", "ÇANTASI", "YORDAMIYLA"] }
  ]},
  { id: 69, tier: "impossible", groups: [
    { category: "HİNT YEMEK", difficulty: "easy", words: ["KARI", "MASALA", "SAMOSA", "NAAN"] },
    { category: "UZAK DOĞU", difficulty: "medium", words: ["SUSHI", "RAMEN", "PHO", "SATAY"] },
    { category: "ZEYTİNYAĞLI", difficulty: "hard", words: ["BARBUNYA", "TAZE_FASULYE", "ENGİNAR_2", "YAPRAK_SARMA"] },
    { category: "KIZGIN ___", difficulty: "tricky", words: ["YAĞ_2", "TAVA", "BAKIŞ", "KAFA"] }
  ]},
  { id: 70, tier: "impossible", groups: [
    { category: "BAHARAT", difficulty: "easy", words: ["KEKİK", "KARABİBER", "NANE", "KİMYON"] },
    { category: "ÇORBA TÜRÜ", difficulty: "medium", words: ["MERCİMEK_2", "EZOGELİN", "YAYLA", "TARHANA"] },
    { category: "ESKİ ÖLÇÜ", difficulty: "hard", words: ["ARŞIN", "ZİRA", "ENDAZE", "OKKA"] },
    { category: "ÇORBA ___", difficulty: "tricky", words: ["KAŞIĞI", "TASI", "KEPÇESİ", "MENÜSÜ"] }
  ]},
  { id: 71, tier: "impossible", groups: [
    { category: "HASTANE", difficulty: "easy", words: ["MUAYENE_2", "TEDAVİ", "REÇETE", "AMELİYAT"] },
    { category: "TIBBİ DAL", difficulty: "medium", words: ["KARDİYOLOJİ", "NÖROLOJİ", "ORTOPEDİ", "DAHİLİYE"] },
    { category: "KAN GRUBU", difficulty: "hard", words: ["A_GRUBU", "B_GRUBU", "AB_GRUBU", "SIFIR_GRUBU"] },
    { category: "SOĞUK ___", difficulty: "tricky", words: ["SAVAŞ", "ALGINLIĞI", "KAN_2", "KAHVE_2"] }
  ]},
  { id: 72, tier: "impossible", groups: [
    { category: "SİRK", difficulty: "easy", words: ["TRAPEZ", "JOKEY", "AKROBAT", "PALYAÇO"] },
    { category: "SAHNE", difficulty: "medium", words: ["TİYATRO", "OPERA", "KONSER", "BALE"] },
    { category: "TİYATRO TÜRÜ", difficulty: "hard", words: ["KOMEDİ", "TRAJEDİ", "HİCİV", "PASTORAL"] },
    { category: "SAHNE ___", difficulty: "tricky", words: ["ARKASI", "ALMAK", "IŞIĞI", "TASARIMI"] }
  ]},
  { id: 73, tier: "impossible", groups: [
    { category: "TASARIM AKIMI", difficulty: "easy", words: ["BAUHAUS", "ART_DECO", "MİNİMAL", "BRUTAL"] },
    { category: "SOYUT KAVRAM", difficulty: "medium", words: ["SEVGİ", "ÖZGÜRLÜK_2", "ADALET", "BARIŞ_2"] },
    { category: "GÜZEL SANAT", difficulty: "hard", words: ["RESİM", "HEYKEL", "MİMARİ", "EDEBİYAT"] },
    { category: "SOYUT ___", difficulty: "tricky", words: ["DÜŞÜNCE", "RESİM_2", "KAVRAM", "İFADE"] }
  ]},
  { id: 74, tier: "impossible", groups: [
    { category: "KORKU FİGÜRÜ", difficulty: "easy", words: ["DRACULA", "FRANKEN", "MUMYA", "KURTADAM"] },
    { category: "KORKU TEMA", difficulty: "medium", words: ["CADI", "ZOMBİ", "HAYALET", "KATİL"] },
    { category: "ARAP MOTİF", difficulty: "hard", words: ["GEOMETRİ_2", "ARABESK", "KÜFİ", "CELİ"] },
    { category: "KORKULU ___", difficulty: "tricky", words: ["RÜYA", "FİLM", "OYUN", "HİKAYE"] }
  ]},
  { id: 75, tier: "impossible", groups: [
    { category: "HAVA SPORU", difficulty: "easy", words: ["PARAŞÜT", "BALON", "YAMAÇ", "JET"] },
    { category: "SU ALTI EKİP", difficulty: "medium", words: ["DALGIÇ", "BATISKAF", "ŞNORKEL", "OKSİJEN_3"] },
    { category: "SAHNE GÖSTERİ", difficulty: "hard", words: ["JOKEY_2", "AKROBAT_2", "TRAPEZ_2", "İLLÜZYONİST"] },
    { category: "HAVA ___", difficulty: "tricky", words: ["DURUMU", "KOLU", "TRAFİĞİ", "PARASI"] }
  ]},
  { id: 76, tier: "impossible", groups: [
    { category: "MOBİLYA", difficulty: "easy", words: ["KOLTUK", "KANEPE", "RAF", "KOMODİN"] },
    { category: "AYDINLATMA", difficulty: "medium", words: ["AVİZE", "ABAJUR", "LAMBA", "MUM"] },
    { category: "MİMARİ ELEMAN", difficulty: "hard", words: ["KEMER", "KUBBE", "REVAK", "MİHRAP"] },
    { category: "AYAK ___ (2)", difficulty: "tricky", words: ["ALTI", "TABANI", "PARMAK_UCU", "TOPUĞU"] }
  ]},
  { id: 77, tier: "impossible", groups: [
    { category: "PARMAK ADI", difficulty: "easy", words: ["BAŞ_PARMAK", "İŞARET", "ORTA_PARMAK", "YÜZÜK_PARMAK"] },
    { category: "EKLEM", difficulty: "medium", words: ["DİZ", "DİRSEK", "BİLEK_2", "OMUZ"] },
    { category: "KEMİK ADI", difficulty: "hard", words: ["KAVAL", "KAFA_KEMİĞİ", "OMUR", "KÜREK_KEMİĞİ"] },
    { category: "PARMAK ___", difficulty: "tricky", words: ["İZİ_2", "KADAR", "UCU", "OLMAK"] }
  ]},
  { id: 78, tier: "impossible", groups: [
    { category: "AKDENİZ ÜLKE", difficulty: "easy", words: ["İSPANYA", "FRANSA_2", "İTALYA", "YUNANİSTAN"] },
    { category: "KARADENİZ ÜLKE", difficulty: "medium", words: ["TÜRKİYE", "BULGARİSTAN", "ROMANYA", "UKRAYNA"] },
    { category: "İPEK YOLU ŞEHRİ", difficulty: "hard", words: ["SEMERKANT", "BUHARA", "KAŞGAR", "HOTAN"] },
    { category: "İPEK ___ (2)", difficulty: "tricky", words: ["BÖCEĞİ_2", "YOLU_3", "GÖMLEK_3", "TÜYLÜ"] }
  ]},

  // ============ USTA (79-88) — 5 grup, light trap ============
  // Hafif trap: 1-2 kelime başka gruba uyabilir gibi görünür. EFSANE kadar zor değil.

  // 79: Yiyecek/içecek (NANE baharat mı çay aroması mı? BOZA sıcak mı soğuk mu?)
  { id: 79, tier: "master", maxMistakes: 4, groups: [
    { category: "KAHVALTI", difficulty: "easy", words: ["BAL", "REÇEL", "TEREYAĞI", "ZEYTİN"] },
    { category: "TÜRK TATLISI", difficulty: "medium", words: ["BAKLAVA", "KÜNEFE", "KAZANDİBİ", "REVANİ"] },
    { category: "SICAK İÇECEK", difficulty: "hard", words: ["ÇAY", "KAHVE", "SAHLEP", "BOZA"] },
    { category: "SOĞUK İÇECEK", difficulty: "hard", words: ["AYRAN", "ŞALGAM", "LİMONATA", "KOLA"] },
    { category: "BAHARAT", difficulty: "tricky", words: ["KEKİK", "NANE", "KARABİBER", "KİMYON"] }
  ]},

  // 80: Hayvan kategorileri (AT — fiil mi hayvan mı? KEDİ vahşi mi evcil mi?)
  { id: 80, tier: "master", maxMistakes: 4, groups: [
    { category: "EVCİL HAYVAN", difficulty: "easy", words: ["KEDİ", "KÖPEK", "KUŞ", "BALIK"] },
    { category: "ÇİFTLİK HAYVANI", difficulty: "medium", words: ["İNEK", "AT", "KOYUN", "KEÇİ"] },
    { category: "VAHŞİ HAYVAN", difficulty: "hard", words: ["ASLAN", "KAPLAN", "KURT", "AYI"] },
    { category: "KÜMES HAYVANI", difficulty: "hard", words: ["TAVUK", "HOROZ", "ÖRDEK", "KAZ"] },
    { category: "DENİZ CANLISI", difficulty: "tricky", words: ["AHTAPOT", "YENGEÇ", "MİDYE", "ISTAKOZ"] }
  ]},

  // 81: Renkler (ALTIN renk mi metal mi? PEMBE temel mi pastel mi?)
  { id: 81, tier: "master", maxMistakes: 4, groups: [
    { category: "TEMEL RENK", difficulty: "easy", words: ["KIRMIZI", "MAVİ", "YEŞİL", "SARI"] },
    { category: "KOYU TON", difficulty: "medium", words: ["LACİVERT", "BORDO", "HAKİ", "KAHVERENGİ"] },
    { category: "NÖTR", difficulty: "hard", words: ["BEYAZ", "SİYAH", "GRİ", "BEJ"] },
    { category: "METALİK RENK", difficulty: "hard", words: ["ALTIN", "GÜMÜŞ", "BAKIR", "BRONZ"] },
    { category: "DOĞA RENGİ", difficulty: "tricky", words: ["TURUNCU", "MOR", "PEMBE", "PASTEL_MAVİ"] }
  ]},

  // 82: Mutfak (BIÇAK alet mi kesici mi? DOLAP mobilya mı kap mı?)
  { id: 82, tier: "master", maxMistakes: 4, groups: [
    { category: "MUTFAK ALETİ", difficulty: "easy", words: ["KAŞIK", "ÇATAL", "BIÇAK", "TENCERE"] },
    { category: "ELEKTRİKLİ ALET", difficulty: "medium", words: ["BLENDER", "MİKSER", "FRİTÖZ", "ROBOT"] },
    { category: "KESİCİ ALET", difficulty: "hard", words: ["SATIR", "RENDE", "MAKAS", "OYACI"] },
    { category: "YEMEK KABI", difficulty: "hard", words: ["TABAK", "BARDAK", "KASE", "SOSLUK"] },
    { category: "BÜYÜK MUTFAK MOBİLYASI", difficulty: "tricky", words: ["DOLAP", "TEZGAH", "BUZDOLABI", "FIRIN"] }
  ]},

  // 83: Türkiye coğrafya — şehirleri bölgelere ayır
  { id: 83, tier: "master", maxMistakes: 4, groups: [
    { category: "AKDENİZ ŞEHRİ", difficulty: "easy", words: ["ANTALYA", "MUĞLA", "MERSİN", "ADANA"] },
    { category: "KARADENİZ ŞEHRİ", difficulty: "medium", words: ["TRABZON", "RİZE", "GİRESUN", "ARTVİN"] },
    { category: "İÇ ANADOLU", difficulty: "hard", words: ["ANKARA", "KONYA", "KAYSERİ", "NEVŞEHİR"] },
    { category: "EGE ŞEHRİ", difficulty: "hard", words: ["İZMİR", "AYDIN", "MANİSA", "DENİZLİ"] },
    { category: "DOĞU ANADOLU", difficulty: "tricky", words: ["ERZURUM", "KARS", "AĞRI", "VAN"] }
  ]},

  // 84: Ev içi (DOLAP/AYNA hangi odada?)
  { id: 84, tier: "master", maxMistakes: 4, groups: [
    { category: "OTURMA ODASI", difficulty: "easy", words: ["KOLTUK", "KANEPE", "SEHPA", "TV"] },
    { category: "YATAK ODASI", difficulty: "medium", words: ["YATAK", "GARDIROP", "KOMODİN", "ABAJUR"] },
    { category: "MUTFAK", difficulty: "hard", words: ["BUZDOLABI_2", "BULAŞIK", "OCAK", "MİKRODALGA"] },
    { category: "BANYO", difficulty: "hard", words: ["DUŞ", "KÜVET", "LAVABO", "AYNA"] },
    { category: "BEBEK ODASI", difficulty: "tricky", words: ["BEŞİK", "OYUNCAK", "BEZ", "BİBERON"] }
  ]},

  // 85: Spor (TENİS bireysel mi takım mı? KÜREK su mu kış mı?)
  { id: 85, tier: "master", maxMistakes: 4, groups: [
    { category: "TAKIM SPORU", difficulty: "easy", words: ["FUTBOL", "BASKETBOL", "VOLEYBOL", "HENTBOL"] },
    { category: "BİREYSEL SPOR", difficulty: "medium", words: ["TENİS", "GOLF", "BOWLING", "ESKRİM"] },
    { category: "SU SPORU", difficulty: "hard", words: ["YÜZME", "DALMA", "SÖRF", "KÜREK"] },
    { category: "KIŞ SPORU", difficulty: "hard", words: ["KAYAK", "SNOWBOARD", "PATEN", "KIZAK"] },
    { category: "DÖVÜŞ SPORU", difficulty: "tricky", words: ["BOKS", "KARATE", "JUDO", "GÜREŞ"] }
  ]},

  // 86: Zaman/burç/gezegen (KOÇ hayvan mı burç mu? YENGEÇ deniz mi burç mu?)
  { id: 86, tier: "master", maxMistakes: 4, groups: [
    { category: "AY ADI", difficulty: "easy", words: ["OCAK", "ŞUBAT", "MART", "NİSAN"] },
    { category: "HAFTA GÜNÜ", difficulty: "medium", words: ["PAZARTESİ", "SALI", "ÇARŞAMBA", "PERŞEMBE"] },
    { category: "BURÇ", difficulty: "hard", words: ["KOÇ", "BOĞA", "İKİZLER", "YENGEÇ_2"] },
    { category: "GEZEGEN", difficulty: "hard", words: ["MERKÜR", "VENÜS", "MARS", "JÜPİTER"] },
    { category: "TÜRKÇE YILDIZ ADI", difficulty: "tricky", words: ["GÜNEŞ", "ÜLKER", "ÇOBANYILDIZI", "KUTUPYILDIZI"] }
  ]},

  // 87: Marka çeşitleri (APPLE telefon mu tech mi? TESLA auto mu tech mi?)
  { id: 87, tier: "master", maxMistakes: 4, groups: [
    { category: "TELEFON MARKASI", difficulty: "easy", words: ["APPLE", "SAMSUNG", "XIAOMI", "HUAWEI"] },
    { category: "OTOMOBİL MARKASI", difficulty: "medium", words: ["TESLA", "FORD", "BMW", "MERCEDES"] },
    { category: "SPOR GİYİM", difficulty: "hard", words: ["NIKE", "ADIDAS", "PUMA", "REEBOK"] },
    { category: "ZİNCİR MARKET", difficulty: "hard", words: ["MIGROS", "A101", "BIM", "ŞOK"] },
    { category: "TÜRK HAVAYOLU", difficulty: "tricky", words: ["THY", "PEGASUS", "SUNEXPRESS", "AJET"] }
  ]},

  // 88: Vücut/duyu (KULAK kafa parçası mı duyu mu? GÖZ kafa mı duyu mu?)
  { id: 88, tier: "master", maxMistakes: 4, groups: [
    { category: "KAFA PARÇASI", difficulty: "easy", words: ["SAÇ", "BURUN", "AĞIZ", "KULAK"] },
    { category: "KOL PARÇASI", difficulty: "medium", words: ["OMUZ", "BİLEK", "EL", "PARMAK"] },
    { category: "BACAK PARÇASI", difficulty: "hard", words: ["DİZ", "BALDIR", "AYAK", "TOPUK"] },
    { category: "İÇ ORGAN", difficulty: "hard", words: ["KALP", "AKCİĞER", "BEYİN", "MİDE"] },
    { category: "DUYU", difficulty: "tricky", words: ["GÖRME", "İŞİTME", "KOKLAMA", "TATMA"] }
  ]},

  // ============ EFSANE (89-100) — TRAP TASARIMI ============
  // Kelimeler birden fazla gruba uyabilir gibi görünür; tek bir doğru ayrım var.
  // Zorluk progresif: 89-94 (4 hata) → 95-97 (3 hata) → 98-100 (2 hata, ipucusuz neredeyse imkansız)

  // 89: İsim mi unvan mı semt mi paşa mı? (FATİH/MURAT/MEHMET/OSMAN/KEMAL trap)
  { id: 89, tier: "legendary", maxMistakes: 4, groups: [
    { category: "OSMANLI SULTANI", difficulty: "easy", words: ["FATİH", "YAVUZ", "KANUNİ", "MURAT"] },
    { category: "İSTANBUL İLÇESİ", difficulty: "medium", words: ["BEYOĞLU", "KADIKÖY", "ÜSKÜDAR", "EYÜP"] },
    { category: "ERKEK ADI", difficulty: "hard", words: ["AHMET", "MEHMET", "OSMAN", "ALİ"] },
    { category: "İTTİHAT-TERAKKİ PAŞASI", difficulty: "tricky", words: ["TALAT", "ENVER", "CEMAL", "FUAT"] },
    { category: "ATATÜRK İLE İLGİLİ", difficulty: "tricky", words: ["KEMAL", "GAZİ", "SELANİK", "ANITKABİR"] }
  ]},

  // 90: Çift anlamlı kelime trap (YAZ/YÜZ/AT/BAK/KOŞ ortak fiil/isim)
  { id: 90, tier: "legendary", maxMistakes: 4, groups: [
    { category: "EMİR KİPİ FİİL", difficulty: "easy", words: ["GEL", "GİT", "DUR", "KOŞ"] },
    { category: "MEVSİM", difficulty: "medium", words: ["İLKBAHAR", "YAZ", "SONBAHAR", "KIŞ"] },
    { category: "YÜZÜN PARÇASI", difficulty: "hard", words: ["GÖZ", "BURUN_2", "AĞIZ_2", "KULAK_2"] },
    { category: "BÜYÜK SAYI", difficulty: "tricky", words: ["YÜZ", "BİN", "MİLYON", "MİLYAR"] },
    { category: "EVCİL HAYVAN", difficulty: "tricky", words: ["AT", "KEDİ_2", "KÖPEK_2", "KUŞ_2"] }
  ]},

  // 91: Şehir mi başkent mi imparatorluk mu? (ROMA/ANKARA/BİZANS trap)
  { id: 91, tier: "legendary", maxMistakes: 4, groups: [
    { category: "TÜRK ŞEHRİ", difficulty: "easy", words: ["BURSA_2", "KONYA_2", "ADANA_2", "İZMİR_4"] },
    { category: "AVRUPA BAŞKENTİ", difficulty: "medium", words: ["PARİS", "LONDRA", "BERLİN", "MADRİD"] },
    { category: "ÜLKE ADI", difficulty: "hard", words: ["FRANSA", "ALMANYA", "İTALYA", "ABD"] },
    { category: "ESKİ İMPARATORLUK", difficulty: "tricky", words: ["BİZANS", "ROMA", "MOĞOL", "PERS"] },
    { category: "TÜRK HÜKÜMDARI", difficulty: "tricky", words: ["ATATÜRK", "FATİH_2", "OSMAN_2", "KANUNİ_2"] }
  ]},

  // 92: Spor karmaşa (ARDA/BURAK isim mi futbolcu mu?)
  { id: 92, tier: "legendary", maxMistakes: 4, groups: [
    { category: "SPOR DALI", difficulty: "easy", words: ["BASKETBOL", "FUTBOL", "VOLEYBOL", "TENİS"] },
    { category: "SPOR MARKASI", difficulty: "medium", words: ["NIKE", "ADIDAS", "PUMA", "REEBOK"] },
    { category: "SÜPER LİG TAKIMI", difficulty: "hard", words: ["FENERBAHÇE", "GALATASARAY", "BEŞİKTAŞ", "TRABZONSPOR"] },
    { category: "MİLLİ FUTBOLCU", difficulty: "tricky", words: ["ARDA", "BURAK", "HAKAN", "MERİH"] },
    { category: "STADYUM", difficulty: "tricky", words: ["VODAFONE_PARK", "ALİ_SAMİ_YEN", "ŞÜKRÜ_SARAÇOĞLU", "PAPARA_PARK"] },
    { category: "TARAFTAR GRUBU", difficulty: "tricky", words: ["ÇARŞI", "ULTRASLAN", "GENÇFB", "1907"] }
  ]},

  // 93: Doğa/isim/burç (GÜL/ASLAN/BAŞAK/KOÇ multi-meaning)
  { id: 93, tier: "legendary", maxMistakes: 4, groups: [
    { category: "ÇİÇEK", difficulty: "easy", words: ["GÜL", "LALE", "MENEKŞE", "PAPATYA"] },
    { category: "KIZ ADI", difficulty: "medium", words: ["AYŞE", "FATMA", "ZEYNEP", "ELİF"] },
    { category: "ERKEK ADI 2", difficulty: "hard", words: ["HASAN", "HÜSEYİN", "İBRAHİM", "YUSUF"] },
    { category: "AY ADI", difficulty: "tricky", words: ["OCAK", "ŞUBAT", "MART", "NİSAN"] },
    { category: "HAYVAN", difficulty: "tricky", words: ["ASLAN", "TURNA", "KEDİ_3", "KARGA"] },
    { category: "BURÇ", difficulty: "tricky", words: ["BAŞAK", "AKREP", "TERAZİ", "YAY"] }
  ]},

  // 94: Eski/Modern paralel (her tier hem eski hem modern versiyonlu)
  { id: 94, tier: "legendary", maxMistakes: 4, groups: [
    { category: "ESKİ MESLEK", difficulty: "easy", words: ["NALBUR_2", "ARABACI", "BEKÇİ_2", "FERRACI"] },
    { category: "MODERN MESLEK", difficulty: "medium", words: ["YAZILIMCI", "GRAFİKER", "ANALİST", "EDİTÖR"] },
    { category: "ESKİ TAŞIT", difficulty: "hard", words: ["FAYTON", "KAĞNI", "KAYIK_2", "AT_ARABASI"] },
    { category: "MODERN TAŞIT", difficulty: "tricky", words: ["METRO", "TAKSİ", "BİSİKLET", "SCOOTER"] },
    { category: "ESKİ ÖLÇÜ", difficulty: "tricky", words: ["ARŞIN_2", "ZİRA", "ENDAZE", "OKKA_2"] },
    { category: "MODERN ÖLÇÜ", difficulty: "tricky", words: ["METRE", "KİLOMETRE", "KİLOGRAM", "GRAM"] }
  ]},

  // 95: Edebi dönem ayırma — HARD! Edebiyat bilmeden çıkmaz, ipucu zorunlu
  { id: 95, tier: "legendary", maxMistakes: 3, groups: [
    { category: "TANZİMAT YAZARI", difficulty: "easy", words: ["ŞİNASİ", "NAMIK_KEMAL", "ZİYA_PAŞA", "AHMET_MİTHAT"] },
    { category: "SERVET-İ FÜNUN", difficulty: "medium", words: ["TEVFİK_FİKRET", "CENAP_ŞAHABETTİN", "HALİT_ZİYA", "MEHMET_RAUF"] },
    { category: "MİLLİ EDEBİYAT", difficulty: "hard", words: ["ÖMER_SEYFETTİN", "MEHMET_AKİF", "ZİYA_GÖKALP", "YAHYA_KEMAL"] },
    { category: "GARİP AKIMI", difficulty: "tricky", words: ["ORHAN_VELİ", "OKTAY_RİFAT", "MELİH_CEVDET", "BEHÇET_NECATİGİL"] },
    { category: "İKİNCİ YENİ", difficulty: "tricky", words: ["EDİP_CANSEVER", "İLHAN_BERK", "TURGUT_UYAR", "CEMAL_SÜREYA"] },
    { category: "DİVAN ŞAİRİ", difficulty: "tricky", words: ["FUZULİ", "BAKİ", "NEDİM", "NEFİ"] }
  ]},

  // 96: Türk tarih dönemleri — HARD! Şeyhülislam, beylik bilgisi gerek
  { id: 96, tier: "legendary", maxMistakes: 3, groups: [
    { category: "SELÇUKLU SULTANI", difficulty: "easy", words: ["TUĞRUL", "ALPARSLAN", "MELİKŞAH", "SANCAR"] },
    { category: "ANADOLU BEYLİĞİ", difficulty: "medium", words: ["KARAMANOĞLU", "GERMİYAN", "AYDINOĞLU", "MENTEŞE"] },
    { category: "OSMANLI SADRAZAMI", difficulty: "hard", words: ["SOKULLU", "KÖPRÜLÜ", "İBRAHİM_PAŞA", "TALAT_PAŞA"] },
    { category: "OSMANLI ŞEYHÜLİSLAMI", difficulty: "tricky", words: ["EBUSSUUD", "ZENBİLLİ_ALİ", "ÇIVIZADE", "MOLLA_GÜRANİ"] },
    { category: "CUMHURİYET BAŞBAKANI", difficulty: "tricky", words: ["İNÖNÜ", "BAYAR", "MENDERES", "DEMİREL"] },
    { category: "YENİÇERİ TERİMİ", difficulty: "tricky", words: ["AĞA", "ORTAK", "BÖLÜK", "ÇORBACI"] }
  ]},

  // 97: Müzik/folklor niche — Halk kültürü uzmanlığı gerek
  { id: 97, tier: "legendary", maxMistakes: 3, groups: [
    { category: "TÜRK MAKAMI", difficulty: "easy", words: ["HİCAZ", "USSAK", "RAST", "NİHAVENT"] },
    { category: "HALK SAZI", difficulty: "medium", words: ["BAĞLAMA", "CURA", "DİVAN_SAZI", "TANBUR"] },
    { category: "HALK DANSI", difficulty: "hard", words: ["ZEYBEK", "HALAY", "HORON", "BAR"] },
    { category: "HALK ŞİİR TÜRÜ", difficulty: "tricky", words: ["KOŞMA", "MANİ", "TÜRKÜ", "AĞIT"] },
    { category: "AŞIK USTASI", difficulty: "tricky", words: ["VEYSEL", "MAHZUNİ", "EMRAH", "DAİMİ"] },
    { category: "MEVLEVİ TERİMİ", difficulty: "tricky", words: ["SEMA", "MUKABELE", "POSTNİŞİN", "MEYDAN"] },
    { category: "DİVAN NAZIM ŞEKLİ", difficulty: "tricky", words: ["GAZEL", "MURABBA", "MUHAMMES", "MÜSEDDES"] }
  ]},

  // 98: Antik dünya — Yunan/Roma/Mısır/Hitit tanrıları ayır
  { id: 98, tier: "legendary", maxMistakes: 2, groups: [
    { category: "YUNAN TANRISI", difficulty: "easy", words: ["ZEUS", "APOLLON", "HERA", "ATHENA"] },
    { category: "ROMA TANRISI", difficulty: "medium", words: ["JÜPİTER_2", "NEPTÜN_2", "VENÜS_2", "MARS_3"] },
    { category: "MISIR TANRISI", difficulty: "hard", words: ["RA", "OSİRİS", "İSİS", "ANUBİS"] },
    { category: "HİTİT ARKEOLOJİ YERİ", difficulty: "tricky", words: ["HATTUŞA", "YAZILKAYA", "ALACAHÖYÜK", "KANİŞ"] },
    { category: "ANTİK ANADOLU ŞEHRİ", difficulty: "tricky", words: ["TROYA", "EFES_4", "BERGAMA", "SARDES"] },
    { category: "ANTİK FİLOZOF", difficulty: "tricky", words: ["SOKRATES_2", "PLATON_2", "ARİSTO_2", "EPİKÜR_2"] },
    { category: "ESKİ YAZI SİSTEMİ", difficulty: "tricky", words: ["ÇİVİ", "HİYEROGLİF", "RUNİK", "GÖKTÜRK"] }
  ]},

  // 99: Türk kültür efsaneleri — trap: aynı isim farklı alanlarda tanınmış olabilir
  { id: 99, tier: "legendary", maxMistakes: 2, groups: [
    { category: "TÜRK DENİZCİSİ", difficulty: "easy", words: ["BARBAROS", "TURGUT_REİS", "PİRİ_REİS", "SEYDİ_ALİ"] },
    { category: "TÜRK ROMANCISI 2", difficulty: "medium", words: ["YAŞAR_KEMAL", "SABAHATTİN_ALİ", "HALİDE_EDİP", "REŞAT_NURİ"] },
    { category: "TÜRK BİLİM İNSANI 2", difficulty: "hard", words: ["AZİZ_SANCAR", "CAHİT_ARF", "OKTAY_SİNANOĞLU", "ALİ_KUŞÇU"] },
    { category: "YEŞİLÇAM KOMEDİSTİ", difficulty: "tricky", words: ["KEMAL_SUNAL", "ŞENER_ŞEN", "MUNİR_ÖZKUL", "İLYAS_SALMAN"] },
    { category: "YEŞİLÇAM KADIN YILDIZI", difficulty: "tricky", words: ["TÜRKAN_ŞORAY", "FATMA_GİRİK", "HÜLYA_KOÇYIGIT", "FİLİZ_AKIN"] }
  ]},

  // 100: FİNAL BOSS — Şair dönemleri + ek niche kategoriler, 2 hata
  { id: 100, tier: "legendary", maxMistakes: 2, groups: [
    { category: "DİVAN ŞAİRİ 2", difficulty: "easy", words: ["BAKİ_2", "NEDİM_2", "NEFİ_2", "ŞEYH_GALİP"] },
    { category: "TANZİMAT 2", difficulty: "medium", words: ["ŞİNASİ_2", "NAMIK_KEMAL_2", "ZİYA_PAŞA_2", "ABDÜLHAK_HAMİT"] },
    { category: "HALK OZANI", difficulty: "hard", words: ["VEYSEL_2", "KARACAOĞLAN", "YUNUS_EMRE", "PIR_SULTAN"] },
    { category: "MODERN ŞAİR", difficulty: "tricky", words: ["NAZIM", "ORHAN_VELİ_2", "CAHİT_SITKI", "EDİP_CANSEVER_2"] },
    { category: "___ EFENDİ", difficulty: "tricky", words: ["DEDE_2", "KOMİSER", "MÜFETTİŞ", "HAYRİ"] },
    { category: "ESKİ EĞİTİM YERİ", difficulty: "tricky", words: ["DERGAH", "ZAVİYE", "TEKKE", "MEDRESE"] },
    { category: "SULTAN UNVANI ___ HAN", difficulty: "tricky", words: ["MUSTAFA_3", "SÜLEYMAN", "MEHMED", "MURAD"] }
  ]},

  // ============ COOLDOWN ORTA (101-108) — 100 sonrası nefes alma, tuzaklar hafif ============

  // 101: YOĞURT trap — süt ürünü mü fermente mi?
  { id: 101, tier: "medium", groups: [
    { category: "SÜT ÜRÜNİ", difficulty: "easy", words: ["PEYNİR", "KAYMAK", "TEREYAĞI", "DONDURMA"] },
    { category: "FERMENTE GIDA", difficulty: "medium", words: ["YOĞURT", "TURŞU", "SIRKE", "BOZA"] },
    { category: "TAHIL ÜRÜNİ", difficulty: "hard", words: ["BULGUR", "MAKARNA", "İRMİK", "ARPA"] },
    { category: "ET ÜRÜNİ", difficulty: "tricky", words: ["PASTIRMA", "SUCUK", "SALAM", "SOSIS"] }
  ]},

  // 102: BARDAK/FİNCAN trap — çay bardakta, kahve fincanda
  { id: 102, tier: "medium", groups: [
    { category: "ÇAY AKSESUARI", difficulty: "easy", words: ["DEMLİK", "BARDAK", "ÇAYDANLIK", "TABAK"] },
    { category: "KAHVE AKSESUARI", difficulty: "medium", words: ["CEZVE", "FİNCAN", "TELVE", "KÖPÜK"] },
    { category: "SOFRA AKSESUARI", difficulty: "hard", words: ["TUZLUK", "BİBERLİK", "SIRKELIK", "PEÇETE"] },
    { category: "TÜRK TATLISI 3", difficulty: "tricky", words: ["ŞEKERPARE", "LOKUM", "TULUMBA", "ZERDE"] }
  ]},

  // 103: ŞEKER hastalık mı malzeme mi? ATEŞ isim mi belirti mi?
  { id: 103, tier: "medium", groups: [
    { category: "HASTALIK BELİRTİSİ", difficulty: "easy", words: ["ATEŞ", "ÖKSÜRÜK", "BULANTI", "TITREME"] },
    { category: "İLAÇ FORMU", difficulty: "medium", words: ["TABLET", "ŞURUP", "MERHEM", "DAMLA"] },
    { category: "HASTANE BÖLÜMÜ 2", difficulty: "hard", words: ["ACİL", "POLİKLİNİK", "YOĞUN_BAKIM", "AMELİYATHANE"] },
    { category: "KRONİK HASTALIK", difficulty: "tricky", words: ["ŞEKER", "TANSIYON", "ASTIM", "ROMATIZMA"] }
  ]},

  // 104: TAVLA kahvehane mi masa oyunu mu? DAMA ikisi de gibi duruyor
  { id: 104, tier: "medium", groups: [
    { category: "KAHVEHANE OYUNU", difficulty: "easy", words: ["BATAK", "PIŞTI", "OKEY", "TAVLA"] },
    { category: "ÇOCUKLUK OYUNU 3", difficulty: "medium", words: ["TOPAÇ", "BİLYE", "ÇELIK_ÇOMAK", "SEKSEK"] },
    { category: "MASA OYUNU", difficulty: "hard", words: ["MONOPOLY", "DAMA", "JENGA", "SCRABBLE"] },
    { category: "DIŞ MEKAN OYUNU", difficulty: "tricky", words: ["BOCCE", "OKÇULUK", "GOLF", "FRİSBİ"] }
  ]},

  // 105: DEDE/NINE hem baba hem anne tarafında olabilir — büyük tuzak
  { id: 105, tier: "medium", groups: [
    { category: "BABA TARAFI AKRABA", difficulty: "easy", words: ["AMCA", "HALA", "DEDE", "NINE"] },
    { category: "ANNE TARAFI AKRABA", difficulty: "medium", words: ["DAYI", "TEYZE", "BÜYÜKBABA", "BÜYÜKANNE"] },
    { category: "EŞİN AİLESİNDEN", difficulty: "hard", words: ["KAYNANA", "KAYNATA", "GÖRÜMCE", "BALDIZ"] },
    { category: "BÜYÜK KARDEŞ", difficulty: "tricky", words: ["AĞABEY", "ABLA", "ABI", "BACI"] }
  ]},

  // 106: BEŞİKTAŞ semt mi takım mı? KARTAL ilçe mi kuş mu?
  { id: 106, tier: "medium", groups: [
    { category: "İSTANBUL ANADOLU YAKASI", difficulty: "easy", words: ["KADIKÖY", "ÜSKÜDAR", "MALTEPE", "KARTAL"] },
    { category: "İSTANBUL AVRUPA YAKASI", difficulty: "medium", words: ["BEŞİKTAŞ", "ŞİŞLİ", "SARIYER", "BAKIRKÖY"] },
    { category: "İSTANBUL BOĞAZİÇİ KÖPRÜSÜ", difficulty: "hard", words: ["BOĞAZİÇİ", "FATİH_SULTAN", "YAVUZ_SELIM", "OSMANGAZI"] },
    { category: "İSTANBUL TARİHİ SEMT", difficulty: "tricky", words: ["GALATA", "ORTAKÖY", "BEBEK", "ARNAVUTKÖY"] }
  ]},

  // 107: Büyük sayılar + birimler — MİLYAR/KATRİLYON/TON/KİLOMETRE tuzağı
  { id: 107, tier: "medium", groups: [
    { category: "BÜYÜK SAYI", difficulty: "easy", words: ["MİLYON", "MİLYAR", "TRİLYON", "KATRİLYON"] },
    { category: "KESİR / ORAN", difficulty: "medium", words: ["ÇEYREK", "YARISI", "ÜÇTE_BİR", "YÜZDE"] },
    { category: "AĞIRLIK BİRİMİ", difficulty: "hard", words: ["GRAM", "KİLO", "TON", "MİLİGRAM"] },
    { category: "UZUNLUK BİRİMİ", difficulty: "tricky", words: ["METRE", "KİLOMETRE", "SANTİMETRE", "MİLİMETRE"] }
  ]},

  // 108: NAZAR boncuğu mu muska mı? YONCA uğur mu çiçek mi?
  { id: 108, tier: "medium", groups: [
    { category: "NAZAR İNANCI", difficulty: "easy", words: ["BONCUK", "MUSKA", "NAZARLIK", "TÜTSÜ"] },
    { category: "UĞURLU SAYILIR", difficulty: "medium", words: ["NAL", "YONCA", "UĞUR_BÖCEĞİ", "ÇÖREK_OTU"] },
    { category: "RÜYADA İYİ SAYILIR", difficulty: "hard", words: ["UÇMAK", "YILDIZ_GÖRMEK", "PARA_BULMAK", "DÜĞÜN_GÖRMEK"] },
    { category: "UĞURSUZ SAYILIR", difficulty: "tricky", words: ["KARGA", "BAYKUŞ", "AYNA_KIRMAK", "ÜÇ_KİBRİT"] }
  ]},

  // ============ ZORLAŞIYOR (109-116) — ZOR tier, tuzaklar güçleniyor ============

  // 109: YAZ mevsim mi fiil mi? GÜL çiçek mi fiil mi? EL vücut mu deyim mi?
  // Her kelime yalnızca bir grupta — ama başkasını çağrıştırıyor
  { id: 109, tier: "hard", groups: [
    { category: "MEVSİM", difficulty: "easy", words: ["İLKBAHAR", "YAZ", "SONBAHAR", "KIŞ"] },
    { category: "EMİR KİPİ (FİİL)", difficulty: "medium", words: ["SUS", "DUR", "BAK", "GEL"] },
    { category: "ÇİÇEK", difficulty: "hard", words: ["GÜL", "LALE", "MENEKŞE", "KARANFIL"] },
    { category: "VÜCUT UZVU", difficulty: "tricky", words: ["BAŞ", "EL", "DİL", "GÖZ"] }
  ]},

  // 110: DOĞAN hem hayvan hem soyad hem erkek adı — ASLAN da öyle
  { id: 110, tier: "hard", groups: [
    { category: "TÜRK SOYADLARI (KELİME ANLAMLARI)", difficulty: "easy", words: ["YILMAZ", "POLAT", "DOĞAN", "ASLAN"] },
    { category: "METAL / MADEN", difficulty: "medium", words: ["DEMİR", "BAKIR", "ÇELİK", "ALÜMINYUM"] },
    { category: "TABİATTA OLUŞUM", difficulty: "hard", words: ["KAYA", "ÇAKIL", "DERE", "TEPE"] },
    { category: "ERKEK ADI VE HAYVAN", difficulty: "tricky", words: ["KARTAL", "ŞAHİN", "BOZKURT", "ATMACA"] }
  ]},
  // DOĞAN hem soyad hem erkek adı hem hayvan (falcon); ASLAN hem soyad hem hayvan hem isim — mükemmel tuzak

  // 111: EL hem vücut hem deyim hem yabancı anlamı
  { id: 111, tier: "hard", groups: [
    { category: "VÜCUT UZVUNUN İKİ ANLAMLI HALİ", difficulty: "easy", words: ["EL", "DİL", "GÖZ", "KULAK"] },
    { category: "EL ___", difficulty: "medium", words: ["KİTABI", "EMEĞİ", "FENERİ", "BOMBASI"] },
    { category: "DİL ___", difficulty: "hard", words: ["BİLGİSİ", "SÜRÇMESI", "OKULU", "KURSU"] },
    { category: "GÖZ ___", difficulty: "tricky", words: ["BEBEK", "KAPAK", "DAMLASI", "BOYASI"] }
  ]},

  // 112: Türk şehirlerinin ünlü ürünü — ama şehir adı verilmiyor
  { id: 112, tier: "hard", groups: [
    { category: "ISPARTA'NIN", difficulty: "easy", words: ["GÜL", "GÜL_SUYU", "GÜL_YAĞLARI", "GÜL_REÇELİ"] },
    { category: "AFYON'UN", difficulty: "medium", words: ["KAYMAK", "SUCUK", "LOKUM", "HAŞHAŞ"] },
    { category: "BURSA'NIN", difficulty: "hard", words: ["İSKENDER", "KESTANE", "İPEK", "ŞEFTALİ"] },
    { category: "GAZİANTEP'İN", difficulty: "tricky", words: ["BAKLAVA", "ANTEP_FISTIĞI", "KATMER", "LAHMACUN"] }
  ]},

  // 113: KAR hem hava olayı hem ticaret terimi — tuzak
  { id: 113, tier: "hard", groups: [
    { category: "HAVA OLAYI", difficulty: "easy", words: ["KAR", "SIS", "DOLU", "TIPI"] },
    { category: "TİCARETTE KAZANÇ", difficulty: "medium", words: ["HASILAT", "KAZANÇ", "GELİR", "TEMETTÜ"] },
    { category: "TÜRKÇE ERKEK ADI", difficulty: "hard", words: ["DUMAN", "BULUT", "YAĞMUR", "FIRTINA"] },
    { category: "SAHNEDE / TIYATRODA", difficulty: "tricky", words: ["PERde", "IŞIK", "DEKOR", "KOSTÜM"] }
  ]},
  // Tuzak: KAR=hava olayı (kar yağmak), DUMAN/BULUT isim olarak da tanıdık ama hava grubunda DEĞİL

  // 114: Meslekler yakın ama farklı
  { id: 114, tier: "hard", groups: [
    { category: "SAĞLIK MESLEĞI", difficulty: "easy", words: ["DOKTOR", "HEMŞİRE", "ECZACI", "DİŞÇİ"] },
    { category: "HUKUK MESLEĞİ", difficulty: "medium", words: ["AVUKAT", "HAKİM", "SAVCΙ", "NOTEr"] },
    { category: "EĞİTİM MESLEĞİ", difficulty: "hard", words: ["ÖĞRETMEN", "MÜDÜR", "REKTÖr", "DEKAN"] },
    { category: "DEVLET GÖREVLİSİ", difficulty: "tricky", words: ["KAYMAKAM", "VALİ", "MUHTAR", "BELEDIYE_BAŞKANI"] }
  ]},
  // Trap: MÜDÜR hem okul hem hastane hem şirket = hangi gruptaki MÜDÜR? Okul müdürü eğitim, hastane müdürü sağlık?

  // 115: Ölçü karmaşası — küçükten büyüğe mi büyükten küçüğe mi?
  { id: 115, tier: "hard", groups: [
    { category: "KÜÇÜK SAYI", difficulty: "easy", words: ["ON", "YÜZ", "BİN", "ON_BİN"] },
    { category: "BÜYÜK SAYI", difficulty: "medium", words: ["MİLYON", "MİLYAR", "TRİLYON", "KATRİLYON"] },
    { category: "PARA BİRİMİ", difficulty: "hard", words: ["KURUŞ", "LİRA", "DOLAR", "EURO"] },
    { category: "YÜZDE İFADESİ", difficulty: "tricky", words: ["YARISI", "ÇEYREĞI", "ÜÇTE_BİRİ", "DÖRTTE_BİRİ"] }
  ]},
  // Tuzak: MİLYON büyük gibi duruyor ama küçük grubunda değil — oyuncu BİN/MİLYON sınırını çizemez

  // 116: Zaman — sabah mı öğle mi akşam mı?
  { id: 116, tier: "hard", groups: [
    { category: "SABAH YAPILIR", difficulty: "easy", words: ["KAHVALTI", "UYANMA", "DUŞALMA", "GAZETE"] },
    { category: "AKŞAM YAPILIR", difficulty: "medium", words: ["AKŞAM_YEMEĞİ", "DIZI", "UYUMA", "MUHABBET"] },
    { category: "GÜN BOYU YAPILIR", difficulty: "hard", words: ["ÇAY", "NAMAZ", "TELeFON", "ÇALIŞMA"] },
    { category: "SADECE BAYRAMDA YAPILIR", difficulty: "tricky", words: ["EL_ÖPME", "HARÇLIK", "ZİYARET", "BAYRAMLIK"] }
  ]},
  // ÇAY hem sabah hem her zaman; NAMAZ günde 5 kez = sabah da akşam da — tuzak

  // ============ KAFA KARIŞTIRICI (117-124) — USTA/İMKANSIZ tier ============

  // 117: ALTIN/GÜMÜŞ/BRONZ olimpiyat mı maden mi metalik renk mi?
  { id: 117, tier: "impossible", groups: [
    { category: "OLİMPİYAT SIRASI", difficulty: "easy", words: ["ALTIN", "GÜMÜŞ", "BRONZ", "DÖRDÜNCÜ"] },
    { category: "METALİK RENK", difficulty: "medium", words: ["ROS_GOLD", "KROM", "ANTRASİT", "BAKIR"] },
    { category: "DEĞERLİ TAŞ", difficulty: "hard", words: ["ELMAS", "ZÜMRüT", "YAKUT", "SAFİR"] },
    { category: "FINANS TERİMİ", difficulty: "tricky", words: ["FAİZ", "BORSA", "ENFLASYON", "KUR"] }
  ]},
  // Tuzak: ALTIN/GÜMÜŞ olimpiyat sırası, değerli taş DEĞİL; KROM/BAKIR renk, maden DEĞİL

  // 118: Türk pop/müzik — isim mi albüm mü şarkı mı?
  { id: 118, tier: "impossible", groups: [
    { category: "TARKAN ŞARKISI", difficulty: "easy", words: ["ŞIKIDIM", "KUZU_KUZU", "DUDU", "ACIMAYACAK"] },
    { category: "SEZEN AKSU ŞARKISI", difficulty: "medium", words: ["HAYDI_SÖYLE", "GERİ_DÖN", "FIRUZE", "GIT"] },
    { category: "MÜZISYEN ADI", difficulty: "hard", words: ["TARKAN", "SEZEN", "AJDA", "BARIŞ"] },
    { category: "MÜZISYEN SOYADI", difficulty: "tricky", words: ["AKSU", "MANÇO", "PEKKAN", "TUNC"] }
  ]},
  // GIT hem sezen aksu şarkısı hem emir kipi; SEZEN hem müzisyen adı hem şarkıdaki kelime olabilir

  // 119: Eşanlamlılar farklı gruplarda — hangisi hangi kategoride?
  { id: 119, tier: "impossible", groups: [
    { category: "MUTLU ANLAMINA GELIR", difficulty: "easy", words: ["SEVİNÇLİ", "NEŞELI", "KEYIFLI", "ŞENLIKLI"] },
    { category: "ÜZGÜN ANLAMINA GELIR", difficulty: "medium", words: ["KEDERLI", "MAHZUN", "HÜZÜNLÜ", "GAMLΙ"] },
    { category: "ÖFKELI ANLAMINA GELIR", difficulty: "hard", words: ["KIZGİN", "SINIRLI", "ÖFKELI", "DARGΙN"] },
    { category: "SAKIN ANLAMINA GELIR", difficulty: "tricky", words: ["SAKİN", "HUZURLU", "RAHAT", "DİNGİN"] }
  ]},
  // DАРGIN hem üzgün hem kızgın anlamına gelebilir Türkçede — iyi tuzak
  // HUZURLU hem sakin hem mutlu sayılabilir

  // 120: Miktar belirteçleri — ÇOK az mı çok mu?
  { id: 120, tier: "impossible", groups: [
    { category: "ÇOK AZ ANLAMINDA", difficulty: "easy", words: ["BİRAZ", "BİRKAÇ", "AZICIK", "BİR_NEBZE"] },
    { category: "ÇOK FAZLA ANLAMINDA", difficulty: "medium", words: ["SÜRÜ_SÜRÜ", "TON_LARCA", "YIĞIN_YIĞIN", "DOLU_DOLU"] },
    { category: "ORTA / NE AZ NE ÇOK", difficulty: "hard", words: ["YETERLİ", "MAKUL", "ORTA", "YARI_YARI"] },
    { category: "BELİRSİZ MİKTAR", difficulty: "tricky", words: ["FILAN", "FEŞMEKÂN", "KADAR", "MİKTARCA"] }
  ]},

  // 121: Renk + deyim + isim üçlü tuzak
  { id: 121, tier: "master", maxMistakes: 4, groups: [
    { category: "KIRMIZI ___", difficulty: "easy", words: ["BIBER", "ET", "KART", "GÜL"] },
    { category: "YEŞİL ___", difficulty: "medium", words: ["ÇEVRE", "SAHA", "PASAPORT", "ALAN"] },
    { category: "SİYAH ___", difficulty: "hard", words: ["ÇORBA", "LISTE", "PARA", "GÖZLÜK"] },
    { category: "BEYAZ ___", difficulty: "hard", words: ["SAYFА", "YALAN", "PEYNİR", "GELİNLİK"] },
    { category: "ALTIN ___", difficulty: "tricky", words: ["BİLEZİK", "ÇAĞ", "KURAL", "ORAN"] }
  ]},
  // GÜL hem kırmızı hem pembe; PARA hem siyah (kara para) hem beyaz; BIBER=kırmızı, ÇEVRE=yeşil

  // 122: Sayı + deyim tuzağı — rakam mı deyim mi?
  { id: 122, tier: "master", maxMistakes: 4, groups: [
    { category: "SAYI (RAKAM)", difficulty: "easy", words: ["BİR", "İKİ", "ÜÇ", "DÖRT"] },
    { category: "BİR ___", difficulty: "medium", words: ["ZAMANLAR", "HAFTA", "GÜN", "AN"] },
    { category: "İKİ ___", difficulty: "hard", words: ["YÜZLÜ", "ELLİ", "BAŞLI", "ANLAMLI"] },
    { category: "ÜÇ ___", difficulty: "hard", words: ["GEN", "KAĞIT", "AYAK", "TEKER"] },
    { category: "DÖRT ___", difficulty: "tricky", words: ["DÖRTLÜK", "MEVSIM", "NALA", "AYAKLI"] }
  ]},
  // BİR/İKİ/ÜÇ/DÖRT hem rakam hem deyim başlangıcı — oyuncu hangisi olduğunu anlayamaz

  // 123: Türk atasözlerinin son kelimesi — bilirsen gruplayabilirsin
  { id: 123, tier: "master", maxMistakes: 4, groups: [
    { category: "ATALAR SÖZÜ BİTİŞİ (___ SÖYLER)", difficulty: "easy", words: ["BÜLBÜL", "DERT", "GÖNÜL", "NEFİS"] },
    { category: "DEYIM (VÜCUTLA İLGİLİ)", difficulty: "medium", words: ["EL_VERMEK", "GOZ_YUMMAK", "KULAK_ASMAK", "DIL_DOKMEK"] },
    { category: "ÖZDEYİŞ BAŞLANGICI", difficulty: "hard", words: ["DAMLAYA", "SAKLA", "VAKTI", "BORCUNU"] },
    { category: "HEM DEYİM HEM HAKIKAT", difficulty: "tricky", words: ["DÜŞMEK", "KALKMAK", "YÜRÜMEK", "KOŞMAK"] }
  ]},

  // 124: Ünlü Türklerin ilk adı — kim hangi alanda? (tuzak: aynı isimde birden fazla ünlü Türk var)
  { id: 124, tier: "master", maxMistakes: 4, groups: [
    { category: "TÜRK SPORCUNUN ADI", difficulty: "easy", words: ["NAIM", "RIZA", "HALUK", "BURAK"] },
    { category: "TÜRK SİNEMA YILDIZININ ADI", difficulty: "medium", words: ["TÜRKAN", "FATMA", "HÜLYA", "FİLİZ"] },
    { category: "TÜRK MÜZİSYENİN ADI", difficulty: "hard", words: ["TARKAN", "SEZEN", "AJDA", "ZÜLFÜ"] },
    { category: "HEM SPORCU HEM BAŞKA ÜNLÜNÜN ADI", difficulty: "tricky", words: ["HAKAN", "ARDA", "MERİH", "KEREM"] }
  ]},

  // ============ BATCH 1 (125-144) — 4 grup — gunluk kelimeler ============

  // 125: Eş anlamlı tuzağı — kelimeler tanıdık, doğru anlam grubunu bulmak zor
  { id: 125, tier: "hard", maxMistakes: 4, groups: [
    { category: "HIZLI ANLAMINDA", difficulty: "easy", words: ["ÇABUK", "SÜRATLİ", "TEZ", "İVEDİ"] },
    { category: "YAVAŞ ANLAMINDA", difficulty: "medium", words: ["AĞIRDAN", "USUL", "SAKİN", "TANE_TANE"] },
    { category: "AKILLI ANLAMINDA", difficulty: "hard", words: ["ZEKİ", "UYANIK", "KURNAZ", "ANLAYIŞLI"] },
    { category: "GÜÇLÜ ANLAMINDA", difficulty: "tricky", words: ["KUVVETLİ", "SAĞLAM", "DİNÇ", "KUDRETLİ"] }
  ]},

  // 126: Bileşik kelime tuzağı — hangi ön ek ile birleşiyor?
  { id: 126, tier: "hard", maxMistakes: 4, groups: [
    { category: "KARA ___", difficulty: "easy", words: ["KARABİBER", "KARATAHTA", "KARABASAN", "KARALAHANA"] },
    { category: "AK ___", difficulty: "medium", words: ["AKCİĞER", "AKRABA", "AKBABA", "AKDENİZ"] },
    { category: "KÖR ___", difficulty: "hard", words: ["KÖRFEZ", "KÖREBE", "KÖRKÜTÜK", "KÖRDÜĞÜM"] },
    { category: "BOŞ ___", difficulty: "tricky", words: ["BOŞLUK", "BOŞANMA", "BOŞBOĞAZ", "BOŞVERMEK"] }
  ]},

  // 127: Hangi işte yapılır — fiil tuzağı
  { id: 127, tier: "hard", maxMistakes: 4, groups: [
    { category: "MUTFAKTA YAPILIR", difficulty: "easy", words: ["DOĞRAMAK", "KAVURMAK", "HAŞLAMAK", "YOĞURMAK"] },
    { category: "TEMİZLİKTE YAPILIR", difficulty: "medium", words: ["SÜPÜRMEK", "SİLMEK", "OVMAK", "DURULAMAK"] },
    { category: "BAHÇEDE YAPILIR", difficulty: "hard", words: ["SULAMAK", "BUDAMAK", "EKMEK", "ÇAPALAMAK"] },
    { category: "TAMİRDE YAPILIR", difficulty: "tricky", words: ["ÇİVİLEMEK", "VİDALAMAK", "ZIMPARALAMAK", "LEHİMLEMEK"] }
  ]},

  // 128: Nerede bulunur — KÖK ve YUVA tuzakları
  { id: 128, tier: "hard", maxMistakes: 4, groups: [
    { category: "DENİZDE BULUNUR", difficulty: "easy", words: ["YOSUN", "DALGA", "KÖPÜK", "İSTİRİDYE"] },
    { category: "GÖKYÜZÜNDE GÖRÜLÜR", difficulty: "medium", words: ["BULUT", "ŞİMŞEK", "GÖKKUŞAĞI", "GÖKGÜRÜLTÜSÜ"] },
    { category: "TOPRAĞIN ALTINDA", difficulty: "hard", words: ["KÖK", "SOLUCAN", "KÖSTEBEK", "DEFİNE"] },
    { category: "AĞAÇTA BULUNUR", difficulty: "tricky", words: ["DAL", "KOVUK", "KUŞ_YUVASI", "KOZALAK"] }
  ]},

  // 129: Hangi duyguda ne yaparız — tepki tuzağı
  { id: 129, tier: "hard", maxMistakes: 4, groups: [
    { category: "KORKUNCA OLUR", difficulty: "easy", words: ["TİTREME", "DONAKALMA", "ÇIĞLIK", "TÜYLERİN_DİKEN_DİKEN"] },
    { category: "KIZINCA OLUR", difficulty: "medium", words: ["KAŞ_ÇATMA", "HOMURDANMA", "YUMRUK_SIKMA", "KÜSME"] },
    { category: "UTANINCA OLUR", difficulty: "hard", words: ["KIZARMA", "KEKELEME", "BAŞ_EĞME", "SAKLANMA"] },
    { category: "ÜZÜLÜNCE OLUR", difficulty: "tricky", words: ["AĞLAMA", "İÇ_ÇEKME", "SURAT_ASMA", "SUSMA"] }
  ]},

  // 130: Vücut bileşik kelime tuzağı
  { id: 130, tier: "hard", maxMistakes: 4, groups: [
    { category: "BAŞ ___", difficulty: "easy", words: ["BAŞBAKAN", "BAŞPARMAK", "BAŞARI", "BAŞAĞRISI"] },
    { category: "KOL ___", difficulty: "medium", words: ["KOLTUK", "KOLSAATİ", "KOLLUK", "KOLBASTI"] },
    { category: "DİZ ___", difficulty: "hard", words: ["DİZÜSTÜ", "DİZKAPAĞI", "DİZBAĞI", "DİZBOYU"] },
    { category: "AYAK ___", difficulty: "tricky", words: ["AYAKKABI", "AYAKBAĞI", "AYAKİZİ", "AYAKTAKIMI"] }
  ]},

  // 131: Nereden alınır
  { id: 131, tier: "hard", maxMistakes: 4, groups: [
    { category: "MANAVDAN ALINIR", difficulty: "easy", words: ["MARUL", "MAYDANOZ", "TURP", "ROKA"] },
    { category: "KASAPTAN ALINIR", difficulty: "medium", words: ["KIYMA", "KUŞBAŞI", "PİRZOLA", "BONFİLE"] },
    { category: "FIRINDAN ALINIR", difficulty: "hard", words: ["SİMİT", "POĞAÇA", "SOMUN", "GALETA"] },
    { category: "BAKKALDAN ALINIR", difficulty: "tricky", words: ["KİBRİT", "GAZOZ", "ÇAKMAK", "MENDİL"] }
  ]},

  // 132: Mevsim olayları — YAĞMUR ve SİS tuzağı
  { id: 132, tier: "hard", maxMistakes: 4, groups: [
    { category: "KIŞIN OLUR", difficulty: "easy", words: ["AYAZ", "KIRAĞI", "BUZLANMA", "SOBA"] },
    { category: "YAZIN OLUR", difficulty: "medium", words: ["KAVURUCU_SICAK", "SERİNLEME", "DONDURMA", "VANTİLATÖR"] },
    { category: "İLKBAHARDA OLUR", difficulty: "hard", words: ["FİLİZLENME", "KIRLANGIÇ", "POLEN", "TOMURCUK"] },
    { category: "SONBAHARDA OLUR", difficulty: "tricky", words: ["YAPRAK_DÖKÜMÜ", "HASAT", "ÜŞÜMEYE_BAŞLAMA", "PUSLU_HAVA"] }
  ]},

  // 133: Hangi meslek nerede çalışır — MÜDÜR tuzağı
  { id: 133, tier: "hard", maxMistakes: 4, groups: [
    { category: "HASTANEDE ÇALIŞIR", difficulty: "easy", words: ["HEMŞİRE", "HASTABAKICI", "RÖNTGENCİ", "NÖBETÇİ_DOKTOR"] },
    { category: "OKULDA ÇALIŞIR", difficulty: "medium", words: ["ÖĞRETMEN", "OKUL_MÜDÜRÜ", "REHBER", "HİZMETLİ"] },
    { category: "LOKANTADA ÇALIŞIR", difficulty: "hard", words: ["AŞÇI", "GARSON", "KOMİ", "BULAŞIKÇI"] },
    { category: "MAHKEMEDE ÇALIŞIR", difficulty: "tricky", words: ["HAKİM", "SAVCI", "ZABIT_KATİBİ", "MÜBAŞİR"] }
  ]},

  // 134: Taşıt — nerede gider
  { id: 134, tier: "hard", maxMistakes: 4, groups: [
    { category: "KARADA GİDER", difficulty: "easy", words: ["KAMYON", "MOTOSİKLET", "TRAKTÖR", "MİNİBÜS"] },
    { category: "DENİZDE GİDER", difficulty: "medium", words: ["GEMİ", "SANDAL", "SAL", "FERİBOT"] },
    { category: "HAVADA GİDER", difficulty: "hard", words: ["UÇAK", "HELİKOPTER", "ZEPLİN", "PLANÖR"] },
    { category: "RAYDA GİDER", difficulty: "tricky", words: ["TREN", "TRAMVAY", "METRO", "VAGON"] }
  ]},

  // 135: Hangi kutlama — ŞEKER ve BALON tuzağı
  { id: 135, tier: "hard", maxMistakes: 3, groups: [
    { category: "DÜĞÜNDE OLUR", difficulty: "easy", words: ["GELİNLİK", "NİKAH", "TAKI", "DAVUL_ZURNA"] },
    { category: "BAYRAMDA OLUR", difficulty: "medium", words: ["HARÇLIK", "EL_ÖPME", "BAYRAM_ŞEKERİ", "AKRABA_ZİYARETİ"] },
    { category: "DOĞUM GÜNÜNDE OLUR", difficulty: "hard", words: ["PASTA", "MUM", "HEDİYE", "BALON"] },
    { category: "PİKNİKTE OLUR", difficulty: "tricky", words: ["MANGAL", "BATTANİYE", "SEMAVER", "TOP_OYUNU"] }
  ]},

  // 136: Hangi uzuvla yapılır — hareket tuzağı
  { id: 136, tier: "hard", maxMistakes: 3, groups: [
    { category: "EL İLE YAPILIR", difficulty: "easy", words: ["TUTMAK", "OKŞAMAK", "ÇİMDİKLEMEK", "ALKIŞLAMAK"] },
    { category: "AYAK İLE YAPILIR", difficulty: "medium", words: ["TEKMELEMEK", "ZIPLAMAK", "TEPİNMEK", "YÜRÜMEK"] },
    { category: "GÖZ İLE YAPILIR", difficulty: "hard", words: ["BAKMAK", "KIRPMAK", "SÜZMEK", "İZLEMEK"] },
    { category: "AĞIZ İLE YAPILIR", difficulty: "tricky", words: ["ISIRMAK", "ÜFLEMEK", "FISILDAMAK", "ÇİĞNEMEK"] }
  ]},

  // 137: Kıyafet — vücudun neresine giyilir
  { id: 137, tier: "hard", maxMistakes: 3, groups: [
    { category: "BAŞA GİYİLİR", difficulty: "easy", words: ["ŞAPKA", "BERE", "KASKET", "BAŞÖRTÜSÜ"] },
    { category: "AYAĞA GİYİLİR", difficulty: "medium", words: ["ÇORAP", "TERLİK", "BOT", "ÇİZME"] },
    { category: "ÜST BEDENE GİYİLİR", difficulty: "hard", words: ["GÖMLEK", "TİŞÖRT", "HIRKA", "YELEK"] },
    { category: "ALT BEDENE GİYİLİR", difficulty: "tricky", words: ["PANTOLON", "ETEK", "ŞORT", "TAYT"] }
  ]},

  // 138: Hangi ders
  { id: 138, tier: "hard", maxMistakes: 3, groups: [
    { category: "MATEMATİK DERSİNDE", difficulty: "easy", words: ["KESİR", "ÇARPIM", "AÇI", "DENKLEM"] },
    { category: "TÜRKÇE DERSİNDE", difficulty: "medium", words: ["ÖZNE", "YÜKLEM", "HECE", "ŞİİR"] },
    { category: "FEN DERSİNDE", difficulty: "hard", words: ["DENEY", "HÜCRE", "MIKNATIS", "İSKELET"] },
    { category: "RESİM DERSİNDE", difficulty: "tricky", words: ["FIRÇA", "PALET", "SULUBOYA", "TUVAL"] }
  ]},

  // 139: Günlük teknoloji — HABER ve MÜZİK tuzağı
  { id: 139, tier: "hard", maxMistakes: 3, groups: [
    { category: "TELEFONDA VAR", difficulty: "easy", words: ["MESAJ", "KİŞİLER", "ŞARJ", "TİTREŞİM"] },
    { category: "TELEVİZYONDA VAR", difficulty: "medium", words: ["KANAL", "DİZİ", "REKLAM", "KUMANDA"] },
    { category: "BİLGİSAYARDA VAR", difficulty: "hard", words: ["KLAVYE", "FARE", "EKRAN", "YAZICI"] },
    { category: "RADYODA VAR", difficulty: "tricky", words: ["FREKANS", "ANONS", "CANLI_YAYIN", "SPİKER"] }
  ]},

  // 140: Hangi sporun parçası
  { id: 140, tier: "hard", maxMistakes: 3, groups: [
    { category: "FUTBOLDA VAR", difficulty: "easy", words: ["KALE", "PENALTI", "KORNER", "OFSAYT"] },
    { category: "BASKETBOLDA VAR", difficulty: "medium", words: ["POTA", "SMAÇ", "TURNİKE", "RİBAUND"] },
    { category: "VOLEYBOLDA VAR", difficulty: "hard", words: ["FİLE", "SERVİS", "MANŞET", "BLOK"] },
    { category: "YÜZMEDE VAR", difficulty: "tricky", words: ["KULVAR", "KULAÇ", "DALIŞ", "NEFES_TUTMA"] }
  ]},

  // 141: Yaş dönemleri — GÖZLÜK tuzağı
  { id: 141, tier: "hard", maxMistakes: 3, groups: [
    { category: "BEBEKLİKLE İLGİLİ", difficulty: "easy", words: ["BİBERON", "EMZİK", "ÇINGIRAK", "BEŞİK"] },
    { category: "OKUL ÇAĞIYLA İLGİLİ", difficulty: "medium", words: ["ZİL", "TENEFFÜS", "ÖDEV", "KARNE"] },
    { category: "GENÇLİKLE İLGİLİ", difficulty: "hard", words: ["HAYAL_KURMA", "HEVES", "ARKADAŞ_GRUBU", "İLK_HEYECAN"] },
    { category: "YAŞLILIKLA İLGİLİ", difficulty: "tricky", words: ["BASTON", "EMEKLİLİK", "TORUN_SEVGİSİ", "HATIRALAR"] }
  ]},

  // 142: Hangi tat — TURŞU ve YOĞURT tuzağı
  { id: 142, tier: "hard", maxMistakes: 3, groups: [
    { category: "TATLI OLAN", difficulty: "easy", words: ["BAL", "LOKUM", "PEKMEZ", "KESTANE_ŞEKERİ"] },
    { category: "TUZLU OLAN", difficulty: "medium", words: ["TURŞU", "ZEYTİN", "CİPS", "ÇEREZ"] },
    { category: "EKŞİ OLAN", difficulty: "hard", words: ["LİMON", "SİRKE", "KORUK", "YEŞİL_ERİK"] },
    { category: "ACI OLAN", difficulty: "tricky", words: ["HARDAL", "ACI_BİBER", "ZENCEFİL", "SARIMSAK"] }
  ]},

  // 143: Hangi havada — havaya bağlı durumlar
  { id: 143, tier: "hard", maxMistakes: 3, groups: [
    { category: "GÜNEŞLİ HAVADA", difficulty: "easy", words: ["GÖLGE_ARAMA", "TERLEME", "GÜNEŞ_GÖZLÜĞÜ", "PİKNİK"] },
    { category: "YAĞMURLU HAVADA", difficulty: "medium", words: ["ŞEMSİYE", "ÇAMUR", "SU_BİRİKİNTİSİ", "YAĞMURLUK"] },
    { category: "KARLI HAVADA", difficulty: "hard", words: ["KARDAN_ADAM", "KIZAK", "KAR_TOPU", "KÜREK_ÇEKME"] },
    { category: "RÜZGARLI HAVADA", difficulty: "tricky", words: ["UÇURTMA", "SAVRULMA", "ŞAPKA_UÇMASI", "FIRILDAK"] }
  ]},

  // 144: Batch finali — eş anlamlı karmaşası, RAHAT ve KABA tuzağı
  { id: 144, tier: "hard", maxMistakes: 3, groups: [
    { category: "GÜZEL ANLAMINDA", difficulty: "easy", words: ["HOŞ", "ŞIK", "ALIMLI", "ZARİF"] },
    { category: "ÇİRKİN ANLAMINDA", difficulty: "medium", words: ["KABA", "BİÇİMSİZ", "İTİCİ", "SEVİMSİZ"] },
    { category: "ZOR ANLAMINDA", difficulty: "hard", words: ["ÇETİN", "GÜÇ", "ÇETREFİLLİ", "YORUCU"] },
    { category: "KOLAY ANLAMINDA", difficulty: "tricky", words: ["BASİT", "RAHAT", "ZAHMETSİZ", "ÇOCUK_OYUNCAĞI"] }
  ]},

  // ============ BATCH 2 (145-164) — 5 grup — gunluk kelimeler ============

  // 145: Meslek aletleri
  { id: 145, tier: "master", maxMistakes: 4, groups: [
    { category: "DOKTORUN ALETİ", difficulty: "easy", words: ["STETOSKOP", "ŞIRINGA", "REÇETE", "TANSİYON_ALETİ"] },
    { category: "MARANGOZUN ALETİ", difficulty: "medium", words: ["TESTERE", "RENDE", "ÇEKİÇ", "KESKİ"] },
    { category: "AŞÇININ ALETİ", difficulty: "hard", words: ["TENCERE", "KEPÇE", "SATIR", "KEVGİR"] },
    { category: "BERBERİN ALETİ", difficulty: "hard", words: ["MAKAS", "TARAK", "USTURA", "FÖN"] },
    { category: "BAHÇIVANIN ALETİ", difficulty: "tricky", words: ["KÜREK", "TIRMIK", "ÇAPA", "BUDAMA_MAKASI"] }
  ]},

  // 146: Bileşik kelime — hangi ön ek
  { id: 146, tier: "master", maxMistakes: 4, groups: [
    { category: "SU ___", difficulty: "easy", words: ["SUBORUSU", "SUKABAĞI", "SUSAMURU", "SUKEMERİ"] },
    { category: "GÖZ ___", difficulty: "medium", words: ["GÖZLÜK", "GÖZYAŞI", "GÖZBEBEĞİ", "GÖZALTI"] },
    { category: "GÜN ___", difficulty: "hard", words: ["GÜNDÜZ", "GÜNDOĞUMU", "GÜNBATIMI", "GÜNEBAKAN"] },
    { category: "YOL ___", difficulty: "hard", words: ["YOLCU", "YOLLUK", "YOLARKADAŞI", "YOLKENARI"] },
    { category: "İŞ ___", difficulty: "tricky", words: ["İŞÇİ", "İŞYERİ", "İŞGÜZAR", "İŞBİRLİĞİ"] }
  ]},

  // 147: Hayvan nerede yaşar
  { id: 147, tier: "master", maxMistakes: 4, groups: [
    { category: "KÜMESTE YAŞAR", difficulty: "easy", words: ["TAVUK", "HOROZ", "HİNDİ", "ÖRDEK"] },
    { category: "AHIRDA YAŞAR", difficulty: "medium", words: ["İNEK", "AT", "EŞEK", "MANDA"] },
    { category: "ORMANDA YAŞAR", difficulty: "hard", words: ["TİLKİ", "GEYİK", "SİNCAP", "BAYKUŞ"] },
    { category: "ÇÖLDE YAŞAR", difficulty: "hard", words: ["DEVE", "ENGEREK", "AKREP", "KERTENKELE"] },
    { category: "KUTUPTA YAŞAR", difficulty: "tricky", words: ["PENGUEN", "FOK", "KUTUP_AYISI", "MORS"] }
  ]},

  // 148: Hangi duyu ile algılanır
  { id: 148, tier: "master", maxMistakes: 4, groups: [
    { category: "GÖZLE ALGILANIR", difficulty: "easy", words: ["RENK", "IŞIK", "PARLAKLIK", "KARANLIK"] },
    { category: "KULAKLA ALGILANIR", difficulty: "medium", words: ["GÜRÜLTÜ", "MELODİ", "FISILTI", "YANKI"] },
    { category: "BURUNLA ALGILANIR", difficulty: "hard", words: ["KOKU", "MİS_GİBİ", "LEŞ_KOKUSU", "RAYİHA"] },
    { category: "DİLLE ALGILANIR", difficulty: "hard", words: ["TATLILIK", "EKŞİLİK", "TUZLULUK", "ACILIK"] },
    { category: "DERİYLE ALGILANIR", difficulty: "tricky", words: ["SICAKLIK", "SOĞUKLUK", "YUMUŞAKLIK", "PÜRÜZ"] }
  ]},

  // 149: Hangi durumda söylenir
  { id: 149, tier: "master", maxMistakes: 4, groups: [
    { category: "TEŞEKKÜR EDERKEN", difficulty: "easy", words: ["SAĞ_OL", "ELLERİNE_SAĞLIK", "ALLAH_RAZI_OLSUN", "MİNNETTARIM"] },
    { category: "ÖZÜR DİLERKEN", difficulty: "medium", words: ["KUSURA_BAKMA", "AFFEDERSİN", "ÜZGÜNÜM", "HELALLEŞ"] },
    { category: "TEBRİK EDERKEN", difficulty: "hard", words: ["GÖZÜN_AYDIN", "HAYIRLI_OLSUN", "TEBRİKLER", "DARISI_BAŞINA"] },
    { category: "GEÇMİŞ OLSUN DERKEN", difficulty: "hard", words: ["ACİL_ŞİFALAR", "GEÇMİŞ_OLSUN", "SAĞLIKLAR_OLSUN", "ŞİFA_BULASIN"] },
    { category: "VEDALAŞIRKEN", difficulty: "tricky", words: ["GÜLE_GÜLE", "YOLUN_AÇIK_OLSUN", "KENDİNE_İYİ_BAK", "GÖRÜŞMEK_ÜZERE"] }
  ]},

  // 150: Bileşik kelime — vücut ön ekleri
  { id: 150, tier: "master", maxMistakes: 4, groups: [
    { category: "EL ___", difficulty: "easy", words: ["ELYAZISI", "ELDİVEN", "ELKİTABI", "ELARABASI"] },
    { category: "DİŞ ___", difficulty: "medium", words: ["DİŞMACUNU", "DİŞFIRÇASI", "DİŞHEKİMİ", "DİŞAĞRISI"] },
    { category: "SAÇ ___", difficulty: "hard", words: ["SAÇKESİMİ", "SAÇTOKASI", "SAÇBOYASI", "SAÇKURUTMA"] },
    { category: "KAŞ ___", difficulty: "hard", words: ["KAŞKALEMİ", "KAŞALTI", "KAŞ_GÖZ", "KAŞYAPMA"] },
    { category: "BURUN ___", difficulty: "tricky", words: ["BURUNDELİĞİ", "BURUNKANAMASI", "BURUNUCU", "BURUNKEMİĞİ"] }
  ]},

  // 151: Neyden yapılır
  { id: 151, tier: "master", maxMistakes: 4, groups: [
    { category: "TAHTADAN YAPILIR", difficulty: "easy", words: ["MASA", "RAF", "KAŞIK", "MERDİVEN"] },
    { category: "CAMDAN YAPILIR", difficulty: "medium", words: ["BARDAK", "AYNA", "PENCERE", "VAZO"] },
    { category: "DEMİRDEN YAPILIR", difficulty: "hard", words: ["ÇİVİ", "KİLİT", "ZİNCİR", "PARMAKLIK"] },
    { category: "KUMAŞTAN YAPILIR", difficulty: "hard", words: ["PERDE", "YORGAN", "BAYRAK", "ÇADIR"] },
    { category: "KAĞITTAN YAPILIR", difficulty: "tricky", words: ["GAZETE", "ZARF", "TAKVİM", "PEÇETE"] }
  ]},

  // 152: Hangi dükkandan alınır
  { id: 152, tier: "master", maxMistakes: 4, groups: [
    { category: "ECZANEDEN ALINIR", difficulty: "easy", words: ["AĞRI_KESİCİ", "VİTAMİN", "PANSUMAN", "TERMOMETRE"] },
    { category: "KIRTASİYEDEN ALINIR", difficulty: "medium", words: ["DEFTER", "SİLGİ", "KALEMTRAŞ", "CETVEL"] },
    { category: "OYUNCAKÇIDAN ALINIR", difficulty: "hard", words: ["OYUNCAK_BEBEK", "YAPBOZ", "OYUNCAK_ARABA", "PELUŞ_AYI"] },
    { category: "ÇİÇEKÇİDEN ALINIR", difficulty: "hard", words: ["BUKET", "SAKSI", "FİDAN", "ÇELENK"] },
    { category: "PASTANEDEN ALINIR", difficulty: "tricky", words: ["YAŞ_PASTA", "KURABİYE", "PROFİTEROL", "TART"] }
  ]},

  // 153: Spor nerede yapılır
  { id: 153, tier: "master", maxMistakes: 4, groups: [
    { category: "SAHADA YAPILIR", difficulty: "easy", words: ["KOŞU", "PAS_VERME", "GOL_ATMA", "TAÇ_ATIŞI"] },
    { category: "SALONDA YAPILIR", difficulty: "medium", words: ["AĞIRLIK_KALDIRMA", "İP_ATLAMA", "MEKİK", "ŞINAV"] },
    { category: "HAVUZDA YAPILIR", difficulty: "hard", words: ["KULAÇ_ATMA", "SUYA_ATLAMA", "SIRTÜSTÜ_YÜZME", "DALMA"] },
    { category: "PİSTTE YAPILIR", difficulty: "hard", words: ["ARABA_YARIŞI", "BİSİKLET_YARIŞI", "ATLETİZM", "PATEN"] },
    { category: "DOĞADA YAPILIR", difficulty: "tricky", words: ["DAĞ_TIRMANIŞI", "KAMP", "AVCILIK", "OLTA_BALIKÇILIĞI"] }
  ]},

  // 154: Bileşik kelime — zaman ön ekleri
  { id: 154, tier: "master", maxMistakes: 4, groups: [
    { category: "KIŞ ___", difficulty: "easy", words: ["KIŞLIK", "KIŞ_UYKUSU", "KIŞ_BAHÇESİ", "KIŞ_LASTİĞİ"] },
    { category: "YAZ ___", difficulty: "medium", words: ["YAZLIK", "YAZ_TATİLİ", "YAZ_OKULU", "YAZ_SAATİ"] },
    { category: "GECE ___", difficulty: "hard", words: ["GECEKONDU", "GECELİK", "GECEYARISI", "GECE_BEKÇİSİ"] },
    { category: "SABAH ___", difficulty: "hard", words: ["SABAHLIK", "SABAH_SPORU", "SABAH_EZANI", "SABAH_AKŞAM"] },
    { category: "AKŞAM ___", difficulty: "tricky", words: ["AKŞAM_YEMEĞİ", "AKŞAMÜSTÜ", "AKŞAM_GAZETESİ", "AKŞAM_KARANLIĞI"] }
  ]},

  // 155: Hangi malzemeyle çalışır — zanaatkar
  { id: 155, tier: "master", maxMistakes: 4, groups: [
    { category: "FIRINCININ İŞİ", difficulty: "easy", words: ["HAMUR_AÇMA", "EKMEK_PİŞİRME", "MAYALAMA", "UN_ELEME"] },
    { category: "TERZİNİN İŞİ", difficulty: "medium", words: ["DİKİŞ_DİKME", "ÖLÇÜ_ALMA", "PROVA", "KUMAŞ_KESME"] },
    { category: "BOYACININ İŞİ", difficulty: "hard", words: ["DUVAR_BOYAMA", "ASTAR_ÇEKME", "MACUN_SÜRME", "RULO_ÇEKME"] },
    { category: "ÇİLİNGİRİN İŞİ", difficulty: "hard", words: ["ANAHTAR_YAPMA", "KİLİT_DEĞİŞTİRME", "KAPI_AÇMA", "KASA_TAMİRİ"] },
    { category: "AYAKKABICININ İŞİ", difficulty: "tricky", words: ["PENÇE_YAPMA", "TOPUK_ÇAKMA", "BOYA_CİLA", "BAĞCIK_DEĞİŞTİRME"] }
  ]},

  // 156: Müzik aleti türleri
  { id: 156, tier: "master", maxMistakes: 4, groups: [
    { category: "TELLİ ÇALGI", difficulty: "easy", words: ["GİTAR", "BAĞLAMA", "UD", "KANUN"] },
    { category: "ÜFLEMELİ ÇALGI", difficulty: "medium", words: ["FLÜT", "NEY", "ZURNA", "MIZIKA"] },
    { category: "VURMALI ÇALGI", difficulty: "hard", words: ["DAVUL", "DARBUKA", "DEF", "KÖS"] },
    { category: "TUŞLU ÇALGI", difficulty: "hard", words: ["PİYANO", "ORG", "AKORDEON", "MELODİKA"] },
    { category: "YAYLI ÇALGI", difficulty: "tricky", words: ["KEMAN", "VİYOLONSEL", "KABAK_KEMANE", "RUBAB"] }
  ]},

  // 157: Hangi içecek
  { id: 157, tier: "master", maxMistakes: 4, groups: [
    { category: "SICAK İÇİLİR", difficulty: "easy", words: ["ÇAY", "KAHVE", "SALEP", "ADAÇAYI"] },
    { category: "SOĞUK İÇİLİR", difficulty: "medium", words: ["AYRAN", "ŞALGAM", "LİMONATA", "BUZLU_ÇAY"] },
    { category: "GAZLI İÇECEK", difficulty: "hard", words: ["ENERJİ_İÇECEĞİ", "KOLA", "SODA", "MADEN_SUYU"] },
    { category: "SÜTLÜ İÇECEK", difficulty: "hard", words: ["SÜT", "KAKAO", "SÜTLÜ_KAHVE", "MUHALLEBİ_ŞERBETİ"] },
    { category: "ŞİFALI İÇİLİR", difficulty: "tricky", words: ["IHLAMUR", "NANE_LİMON", "KUŞBURNU", "REZENE_ÇAYI"] }
  ]},

  // 158: Hangi tatlı
  { id: 158, tier: "master", maxMistakes: 4, groups: [
    { category: "ŞERBETLİ TATLI", difficulty: "easy", words: ["BAKLAVA", "ŞEKERPARE", "TULUMBA", "KADAYIF"] },
    { category: "SÜTLÜ TATLI", difficulty: "medium", words: ["SÜTLAÇ", "KAZANDİBİ", "KEŞKÜL", "TAVUKGÖĞSÜ"] },
    { category: "MEYVELİ TATLI", difficulty: "hard", words: ["AYVA_TATLISI", "İNCİR_TATLISI", "ELMALI_KEK", "KOMPOSTO"] },
    { category: "HAMUR TATLISI", difficulty: "hard", words: ["LOKMA", "REVANİ", "KEMALPAŞA", "ŞAMBALİ"] },
    { category: "KURU İKRAM", difficulty: "tricky", words: ["LEBLEBİ", "CEVİZ", "KURU_İNCİR", "ÇEKİRDEK"] }
  ]},

  // 159: Duygu durumu — yüz ifadeleri
  { id: 159, tier: "master", maxMistakes: 4, groups: [
    { category: "MUTLU İFADE", difficulty: "easy", words: ["GÜLÜMSEME", "KAHKAHA", "IŞILDAYAN_GÖZLER", "SEVİNÇ_ÇIĞLIĞI"] },
    { category: "ÜZGÜN İFADE", difficulty: "medium", words: ["ASIK_SURAT", "DOLU_GÖZLER", "TİTREYEN_DUDAK", "İÇ_GEÇİRME"] },
    { category: "KIZGIN İFADE", difficulty: "hard", words: ["ÇATIK_KAŞ", "KISILMIŞ_GÖZLER", "SIKILI_DİŞ", "KIPKIRMIZI_YÜZ"] },
    { category: "ŞAŞKIN İFADE", difficulty: "hard", words: ["AÇIK_AĞIZ", "KALKIK_KAŞ", "FALTAŞI_GÖZLER", "DONUK_BAKIŞ"] },
    { category: "YORGUN İFADE", difficulty: "tricky", words: ["ESNEME", "AĞIR_GÖZ_KAPAKLARI", "MORARMIŞ_HALKALAR", "GÜÇSÜZ_BAKIŞ"] }
  ]},

  // 160: Hangi işin sesi
  { id: 160, tier: "master", maxMistakes: 4, groups: [
    { category: "MUTFAKTAN GELEN SES", difficulty: "easy", words: ["CIZIRTI", "TENCERE_ŞANGIRTISI", "BIÇAK_TAKIRTISI", "SU_ŞIRILTISI"] },
    { category: "SOKAKTAN GELEN SES", difficulty: "medium", words: ["KORNA", "FREN_GICIRTISI", "SİMİTÇİ_SESİ", "ÇOCUK_BAĞIRIŞI"] },
    { category: "DOĞADAN GELEN SES", difficulty: "hard", words: ["KUŞ_CIVILTISI", "YAPRAK_HIŞIRTISI", "DERE_ŞIRILTISI", "RÜZGAR_UĞULTUSU"] },
    { category: "İNŞAATTAN GELEN SES", difficulty: "hard", words: ["MATKAP_SESİ", "ÇEKİÇ_DARBESİ", "BETON_MİKSERİ", "KEPÇE_GÜRÜLTÜSÜ"] },
    { category: "GECE SESSİZLİĞİNDE", difficulty: "tricky", words: ["SAAT_TIKIRTISI", "KÖPEK_HAVLAMASI", "BAYKUŞ_ÖTÜŞÜ", "MUSLUK_DAMLASI"] }
  ]},

  // 161: Hangi tören
  { id: 161, tier: "master", maxMistakes: 4, groups: [
    { category: "OKUL TÖRENİNDE", difficulty: "easy", words: ["BAYRAK_TÖRENİ", "İSTİKLAL_MARŞI", "DİPLOMA", "KEP_ATMA"] },
    { category: "ASKERLİKTE", difficulty: "medium", words: ["YEMİN_TÖRENİ", "TERHİS", "NÖBET", "ÜNİFORMA"] },
    { category: "İŞ HAYATINDA", difficulty: "hard", words: ["İŞE_GİRİŞ", "TOPLANTI", "TERFİ", "MAAŞ_GÜNÜ"] },
    { category: "SPOR MÜSABAKASINDA", difficulty: "hard", words: ["MADALYA_TÖRENİ", "KÜRSÜ", "ALKIŞ", "ŞAMPİYONLUK_KUPASI"] },
    { category: "AÇILIŞ TÖRENİNDE", difficulty: "tricky", words: ["KURDELE_KESME", "KONFETİ", "PROTOKOL", "HAYIR_DUASI"] }
  ]},

  // 162: Bunu kim yapar — usta işleri
  { id: 162, tier: "master", maxMistakes: 4, groups: [
    { category: "ÇİFTÇİ YAPAR", difficulty: "easy", words: ["TARLA_SÜRME", "TOHUM_EKME", "HASAT_TOPLAMA", "HARMAN"] },
    { category: "BALIKÇI YAPAR", difficulty: "medium", words: ["AĞ_ATMA", "OLTA_SARMA", "AĞ_ONARMA", "BALIK_AYIKLAMA"] },
    { category: "ÇOBAN YAPAR", difficulty: "hard", words: ["SÜRÜ_GÜTME", "OTLATMA", "SAĞIM", "KIRKIM"] },
    { category: "ARICI YAPAR", difficulty: "hard", words: ["KOVAN_BAKIMI", "BAL_SAĞMA", "OĞUL_ALMA", "PETEK_TAKMA"] },
    { category: "DOKUMACI YAPAR", difficulty: "tricky", words: ["İP_EĞİRME", "TEZGAH_KURMA", "DESEN_ÇIKARMA", "HALI_DÜĞÜMÜ"] }
  ]},

  // 163: Hangi kapta saklanır / pişirilir
  { id: 163, tier: "master", maxMistakes: 4, groups: [
    { category: "SIVI KONUR", difficulty: "easy", words: ["ŞİŞE", "SÜRAHİ", "BİDON", "MATARA"] },
    { category: "İÇİNDE PİŞİRİLİR", difficulty: "medium", words: ["TAVA", "GÜVEÇ", "DÜDÜKLÜ", "SAHAN"] },
    { category: "KURU GIDA KONUR", difficulty: "hard", words: ["KAVANOZ", "TENEKE", "ÇUVAL", "KESE"] },
    { category: "SOFRAYA KONUR", difficulty: "hard", words: ["TABAK", "KASE", "SERVİS_TABAĞI", "TUZLUK"] },
    { category: "ÇÖP İÇİN", difficulty: "tricky", words: ["ÇÖP_KOVASI", "ÇÖP_POŞETİ", "ÇÖP_KONTEYNERİ", "GERİ_DÖNÜŞÜM_KUTUSU"] }
  ]},

  // 164: Batch finali — çok anlamlı kelime tuzakları
  { id: 164, tier: "master", maxMistakes: 4, groups: [
    { category: "AÇMAK FİİLİYLE", difficulty: "easy", words: ["KAPI_AÇMAK", "RADYO_AÇMAK", "İŞTAH_AÇMAK", "OKUL_AÇMAK"] },
    { category: "ÇEKMEK FİİLİYLE", difficulty: "medium", words: ["FOTOĞRAF_ÇEKMEK", "HALAY_ÇEKMEK", "ACI_ÇEKMEK", "KÜREK_ÇEKMEK"] },
    { category: "ATMAK FİİLİYLE", difficulty: "hard", words: ["GOL_ATMAK", "İMZA_ATMAK", "ADIM_ATMAK", "ÇIĞLIK_ATMAK"] },
    { category: "TUTMAK FİİLİYLE", difficulty: "hard", words: ["ORUÇ_TUTMAK", "YAS_TUTMAK", "TAKIM_TUTMAK", "NÖBET_TUTMAK"] },
    { category: "VERMEK FİİLİYLE", difficulty: "tricky", words: ["SÖZ_VERMEK", "KARAR_VERMEK", "MOLA_VERMEK", "SELAM_VERMEK"] }
  ]},

  // ============ BATCH 3 (165-184) — 6 grup — gunluk kelimeler ============

  // 165: Bileşik kelime — 6 ön ek
  { id: 165, tier: "legendary", maxMistakes: 3, groups: [
    { category: "AY ___", difficulty: "easy", words: ["AYÇİÇEĞİ", "AYDEDE", "AYÇÖREĞİ", "AYBAŞI"] },
    { category: "DENİZ ___", difficulty: "medium", words: ["DENİZKIZI", "DENİZALTI", "DENİZYILDIZI", "DENİZANASI"] },
    { category: "YER ___", difficulty: "hard", words: ["YERFISTIĞI", "YERALTI", "YERKÜRE", "YERELMASI"] },
    { category: "GÖK ___", difficulty: "hard", words: ["GÖKKUBBE", "GÖKDELEN", "GÖKYÜZÜ", "GÖKTAŞI"] },
    { category: "TAŞ ___", difficulty: "tricky", words: ["TAŞKÖMÜRÜ", "TAŞOCAĞI", "TAŞBASKI", "TAŞPLAK"] },
    { category: "BAL ___", difficulty: "tricky", words: ["BALKABAĞI", "BALMUMU", "BALPETEĞİ", "BALARISI"] }
  ]},

  // 166: Bileşik kelime — 6 ön ek
  { id: 166, tier: "legendary", maxMistakes: 3, groups: [
    { category: "ATEŞ ___", difficulty: "easy", words: ["ATEŞBÖCEĞİ", "ATEŞKES", "ATEŞ_PAHASI", "ATEŞ_TOPU"] },
    { category: "KAN ___", difficulty: "medium", words: ["KAN_GRUBU", "KAN_BASINCI", "KAN_BAĞI", "KAN_DAVASI"] },
    { category: "CAN ___", difficulty: "hard", words: ["CANKURTARAN", "CAN_SIKINTISI", "CAN_YELEĞİ", "CAN_DOSTU"] },
    { category: "ANA ___", difficulty: "hard", words: ["ANAYOL", "ANAOKULU", "ANAYURT", "ANAFİKİR"] },
    { category: "BABA ___", difficulty: "tricky", words: ["BABAYİĞİT", "BABAANNE", "BABAEVİ", "BABACAN"] },
    { category: "ÇOCUK ___", difficulty: "tricky", words: ["ÇOCUKLUK", "ÇOCUK_BAHÇESİ", "ÇOCUK_DOKTORU", "ÇOCUK_ODASI"] }
  ]},

  // 167: Türk sofrası
  { id: 167, tier: "legendary", maxMistakes: 3, groups: [
    { category: "ÇORBA ÇEŞİDİ", difficulty: "easy", words: ["MERCİMEK_ÇORBASI", "EZOGELİN", "YAYLA_ÇORBASI", "İŞKEMBE"] },
    { category: "ETLİ YEMEK", difficulty: "medium", words: ["TAS_KEBABI", "ETLİ_NOHUT", "KAVURMA", "ORMAN_KEBABI"] },
    { category: "ZEYTİNYAĞLI YEMEK", difficulty: "hard", words: ["TÜRLÜ", "İMAMBAYILDI", "ZEYTİNYAĞLI_FASULYE", "YAPRAK_SARMA"] },
    { category: "PİLAV ÇEŞİDİ", difficulty: "hard", words: ["BULGUR_PİLAVI", "ŞEHRİYELİ_PİLAV", "NOHUTLU_PİLAV", "İÇ_PİLAV"] },
    { category: "SALATA ÇEŞİDİ", difficulty: "tricky", words: ["ÇOBAN_SALATA", "MEVSİM_SALATA", "GAVURDAĞI", "PİYAZ"] },
    { category: "MEZE ÇEŞİDİ", difficulty: "tricky", words: ["HAYDARİ", "ACILI_EZME", "ŞAKŞUKA", "SİGARA_BÖREĞİ"] }
  ]},

  // 168: Hangi tatil
  { id: 168, tier: "legendary", maxMistakes: 3, groups: [
    { category: "DENİZ TATİLİNDE", difficulty: "easy", words: ["KUMSAL", "ŞEZLONG", "DENİZ_GÖZLÜĞÜ", "GÜNEŞLENME"] },
    { category: "DAĞ TATİLİNDE", difficulty: "medium", words: ["DAĞ_EVİ", "MANZARA", "TEMİZ_HAVA", "ŞÖMİNE"] },
    { category: "ŞEHİR GEZİSİNDE", difficulty: "hard", words: ["MÜZE", "ALIŞVERİŞ_MERKEZİ", "TARİHİ_YERLER", "TUR_OTOBÜSÜ"] },
    { category: "KÖY ZİYARETİNDE", difficulty: "hard", words: ["TARLA", "ÇİFTLİK", "BOSTAN", "KÖY_KAHVALTISI"] },
    { category: "KAMPTA", difficulty: "tricky", words: ["KAMP_SANDALYESİ", "UYKU_TULUMU", "KAMP_ATEŞİ", "EL_FENERİ"] },
    { category: "KAPLICADA", difficulty: "tricky", words: ["SICAK_SU", "ÇAMUR_BANYOSU", "BUHAR", "MASAJ"] }
  ]},

  // 169: Karakter özelliği
  { id: 169, tier: "legendary", maxMistakes: 3, groups: [
    { category: "CÖMERT İNSAN", difficulty: "easy", words: ["PAYLAŞIR", "İKRAM_EDER", "ELİ_AÇIKTIR", "BAĞIŞLAR"] },
    { category: "CİMRİ İNSAN", difficulty: "medium", words: ["ELİ_SIKIDIR", "KISARAK_HARCAR", "BİRİKTİRİR", "VERMEZ"] },
    { category: "CESUR İNSAN", difficulty: "hard", words: ["KORKMAZ", "ATILGANDIR", "GÖZÜPEKTİR", "MEYDAN_OKUR"] },
    { category: "KORKAK İNSAN", difficulty: "hard", words: ["ÜRKEKTİR", "ÇEKİNİR", "KAÇAR", "SİNER"] },
    { category: "ÇALIŞKAN İNSAN", difficulty: "tricky", words: ["GAYRETLİDİR", "ÜRETKENDİR", "AZİMLİDİR", "ERKEN_KALKAR"] },
    { category: "TEMBEL İNSAN", difficulty: "tricky", words: ["ÜŞENİR", "ERTELER", "UYUMAYI_SEVER", "OYALANIR"] }
  ]},

  // 170: Bileşik kelime — yön ön ekleri
  { id: 170, tier: "legendary", maxMistakes: 3, groups: [
    { category: "ÖN ___", difficulty: "easy", words: ["ÖNSÖZ", "ÖNYARGI", "ÖNGÖRÜ", "ÖNCELİK"] },
    { category: "ARKA ___", difficulty: "medium", words: ["ARKADAŞ", "ARKA_BAHÇE", "ARKA_PLAN", "ARKA_SOKAK"] },
    { category: "ALT ___", difficulty: "hard", words: ["ALTYAZI", "ALTYAPI", "ALTGEÇİT", "ALT_KAT"] },
    { category: "ÜST ___", difficulty: "hard", words: ["ÜSTGEÇİT", "ÜSTYAPI", "ÜSTBAŞ", "ÜST_KAT"] },
    { category: "İÇ ___", difficulty: "tricky", words: ["İÇYÜZÜ", "İÇGÜDÜ", "İÇ_SAVAŞ", "İÇ_ÇAMAŞIRI"] },
    { category: "DIŞ ___", difficulty: "tricky", words: ["DIŞ_KAPI", "DIŞ_DÜNYA", "DIŞ_GÖRÜNÜŞ", "DIŞ_İŞLERİ"] }
  ]},

  // 171: Ev işleri
  { id: 171, tier: "legendary", maxMistakes: 3, groups: [
    { category: "YEMEK İŞİ", difficulty: "easy", words: ["MALZEME_HAZIRLAMA", "TENCERE_KAYNATMA", "SOFRA_KURMA", "TADINA_BAKMA"] },
    { category: "BULAŞIK İŞİ", difficulty: "medium", words: ["TABAK_YIKAMA", "DURULAMA", "KURULAMA", "DOLABA_YERLEŞTİRME"] },
    { category: "ÇAMAŞIR İŞİ", difficulty: "hard", words: ["LEKE_ÇIKARMA", "MAKİNEYE_ATMA", "İPE_ASMA", "KATLAMA"] },
    { category: "TEMİZLİK İŞİ", difficulty: "hard", words: ["TOZ_ALMA", "YER_SİLME", "CAM_SİLME", "ÖRÜMCEK_AĞI_TEMİZLEME"] },
    { category: "ÜTÜ İŞİ", difficulty: "tricky", words: ["BUHAR_VERME", "KOL_ÜTÜLEME", "KIRIŞIK_GİDERME", "YAKA_DÜZELTME"] },
    { category: "DÜZENLEME İŞİ", difficulty: "tricky", words: ["EŞYA_YERLEŞTİRME", "ÇEKMECE_TOPLAMA", "YATAK_YAPMA", "AYAKKABI_DİZME"] }
  ]},

  // 172: Hangi durumda hangi söz
  { id: 172, tier: "legendary", maxMistakes: 3, groups: [
    { category: "SOFRADA SÖYLENİR", difficulty: "easy", words: ["AFİYET_OLSUN", "ELİNE_SAĞLIK", "BUYURUN", "ZİYADE_OLSUN"] },
    { category: "YOLA ÇIKARKEN", difficulty: "medium", words: ["HAYIRLI_YOLCULUK", "SELAMETLE", "ACELE_ETME", "DİKKATLİ_OL"] },
    { category: "UYKUDAN ÖNCE", difficulty: "hard", words: ["İYİ_GECELER", "TATLI_RÜYALAR", "RAHAT_UYU", "ALLAH_RAHATLIK_VERSİN"] },
    { category: "BİRİNİ ÖVERKEN", difficulty: "hard", words: ["AFERİN", "BRAVO", "HELAL_OLSUN", "NE_GÜZEL_YAPMIŞSIN"] },
    { category: "BİRİNİ AZARLARKEN", difficulty: "tricky", words: ["AYIP_ETTİN", "BU_NE_HAL", "UTAN_BİRAZ", "YAKIŞTI_MI_ŞİMDİ"] },
    { category: "SABIR DİLERKEN", difficulty: "tricky", words: ["GEÇER", "ÜZÜLME", "HER_ŞEY_DÜZELİR", "DİŞİNİ_SIK"] }
  ]},

  // 173: Hangi malzeme hangi işte
  { id: 173, tier: "legendary", maxMistakes: 3, groups: [
    { category: "BOYAMA İÇİN", difficulty: "easy", words: ["RULO", "FIRÇA_UCU", "ASTAR", "İNCELTİCİ"] },
    { category: "DİKİŞ İÇİN", difficulty: "medium", words: ["İPLİK", "İĞNE", "YÜKSÜK", "DİKİŞ_MAKİNESİ"] },
    { category: "ÖRGÜ İÇİN", difficulty: "hard", words: ["YÜN", "ŞİŞ", "TIĞ", "YUMAK"] },
    { category: "YAPIŞTIRMA İÇİN", difficulty: "hard", words: ["TUTKAL", "BANT", "ZAMK", "SİLİKON"] },
    { category: "BAĞLAMA İÇİN", difficulty: "tricky", words: ["İP", "TEL", "LASTİK_BANT", "KORDON"] },
    { category: "ÖLÇME İÇİN", difficulty: "tricky", words: ["METRE", "TERAZİ", "KANTAR", "ŞAKÜL"] }
  ]},

  // 174: Bileşik kelime — yer ön ekleri
  { id: 174, tier: "legendary", maxMistakes: 3, groups: [
    { category: "KÖY ___", difficulty: "easy", words: ["KÖYLÜ", "KÖY_OKULU", "KÖY_MEYDANI", "KÖY_YOLU"] },
    { category: "EV ___", difficulty: "medium", words: ["EV_SAHİBİ", "EV_ÖDEVİ", "EV_HANIMI", "EV_HAYVANI"] },
    { category: "OKUL ___", difficulty: "hard", words: ["OKUL_ÇANTASI", "OKUL_SERVİSİ", "OKUL_BAHÇESİ", "OKUL_ÖNLÜĞÜ"] },
    { category: "PARK ___", difficulty: "hard", words: ["PARK_YERİ", "PARK_BANKI", "PARK_BAHÇE", "PARK_HALİNDE"] },
    { category: "ÇARŞI ___", difficulty: "tricky", words: ["ÇARŞI_İZNİ", "ÇARŞI_PAZAR", "KAPALI_ÇARŞI", "ÇARŞI_ESNAFI"] },
    { category: "DEVLET ___", difficulty: "tricky", words: ["DEVLET_MEMURU", "DEVLET_OKULU", "DEVLET_HASTANESİ", "DEVLET_BAHÇESİ"] }
  ]},

  // 175: Acil durumda ne yapılır
  { id: 175, tier: "legendary", maxMistakes: 3, groups: [
    { category: "YANGIN ANINDA", difficulty: "easy", words: ["İTFAİYE_ÇAĞIRMA", "YANGIN_TÜPÜ", "DUMANDAN_KAÇMA", "BİNAYI_BOŞALTMA"] },
    { category: "DEPREM ANINDA", difficulty: "medium", words: ["ÇÖK_KAPAN_TUTUN", "GÜVENLİ_NOKTA", "AÇIK_ALANA_ÇIKMA", "DEPREM_ÇANTASI"] },
    { category: "KAZA ANINDA", difficulty: "hard", words: ["İLK_YARDIM", "AMBULANS_ÇAĞIRMA", "SAKİN_KALMA", "YARALIYI_OYNATMAMA"] },
    { category: "SEL ANINDA", difficulty: "hard", words: ["YÜKSEK_KATA_ÇIKMA", "ELEKTRİĞİ_KESME", "DERELERDEN_UZAK_DURMA", "ARACI_TERK_ETME"] },
    { category: "KAYBOLUNCA", difficulty: "tricky", words: ["POLİSE_HABER_VERME", "SON_GÖRÜLEN_YER", "ANONS_YAPTIRMA", "OLDUĞUN_YERDE_KALMA"] },
    { category: "HIRSIZLIKTA", difficulty: "tricky", words: ["POLİS_ÇAĞIRMA", "KAPIYI_KİLİTLEME", "EŞYAYA_DOKUNMAMA", "TUTANAK_TUTMA"] }
  ]},

  // 176: Hangi hayvan ne verir / ne yapar
  { id: 176, tier: "legendary", maxMistakes: 3, groups: [
    { category: "İNEKLE İLGİLİ", difficulty: "easy", words: ["SÜT_VERİR", "OTLAR", "BÖĞÜRÜR", "GEVİŞ_GETİRİR"] },
    { category: "ARIYLA İLGİLİ", difficulty: "medium", words: ["BAL_YAPAR", "ÇİÇEK_TOZU_TAŞIR", "İĞNESİ_VARDIR", "VIZILDAR"] },
    { category: "KOYUNLA İLGİLİ", difficulty: "hard", words: ["YÜN_VERİR", "MELER", "SÜRÜ_HALİNDE", "KUZULAR"] },
    { category: "TAVUKLA İLGİLİ", difficulty: "hard", words: ["YUMURTLAR", "GIDAKLAR", "EŞELENİR", "CİVCİV_ÇIKARIR"] },
    { category: "İPEKBÖCEĞİYLE İLGİLİ", difficulty: "tricky", words: ["KOZA_ÖRER", "DUT_YAPRAĞI_YER", "İPEK_VERİR", "KELEBEK_OLUR"] },
    { category: "DEVEYLE İLGİLİ", difficulty: "tricky", words: ["HÖRGÜCÜ_VARDIR", "SUSUZLUĞA_DAYANIR", "ÇÖLDE_YÜRÜR", "YÜK_TAŞIR"] }
  ]},

  // 177: Trafikte
  { id: 177, tier: "legendary", maxMistakes: 3, groups: [
    { category: "TRAFİK İŞARETİ", difficulty: "easy", words: ["DUR_LEVHASI", "YAYA_GEÇİDİ", "GİRİLMEZ", "PARK_YASAĞI"] },
    { category: "TRAFİK IŞIĞI", difficulty: "medium", words: ["KIRMIZI_IŞIK", "SARI_IŞIK", "YEŞİL_IŞIK", "YANIP_SÖNEN"] },
    { category: "ARABANIN PARÇASI", difficulty: "hard", words: ["DİREKSİYON", "VİTES", "FREN_PEDALI", "EL_FRENİ"] },
    { category: "YOLDA BULUNUR", difficulty: "hard", words: ["KALDIRIM", "REFÜJ", "BARİYER", "HIZ_KESİCİ"] },
    { category: "SÜRÜCÜ BELGESİ İŞLEMİ", difficulty: "tricky", words: ["DİREKSİYON_SINAVI", "EHLİYET", "SÜRÜŞ_DERSİ", "TEORİK_SINAV"] },
    { category: "TRAFİK GÖREVLİSİ", difficulty: "tricky", words: ["TRAFİK_POLİSİ", "DÜDÜK", "CEZA_YAZMA", "YOL_KONTROLÜ"] }
  ]},

  // 178: Hangi mevsim işi
  { id: 178, tier: "legendary", maxMistakes: 3, groups: [
    { category: "BAHÇEDE BAHAR İŞİ", difficulty: "easy", words: ["FİDE_DİKME", "TOHUM_SERPME", "TOPRAK_BELLEME", "ÇİT_BUDAMA"] },
    { category: "KIŞ HAZIRLIĞI", difficulty: "medium", words: ["TURŞU_KURMA", "REÇEL_KAYNATMA", "ODUN_İSTİFLEME", "SALÇA_YAPMA"] },
    { category: "YAZ SERİNLİĞİ İÇİN", difficulty: "hard", words: ["TENTE_AÇMA", "PERDE_KAPATMA", "SERİN_ODA", "BOL_SU_İÇME"] },
    { category: "SONBAHAR İŞİ", difficulty: "hard", words: ["YAPRAK_TOPLAMA", "CEVİZ_SİLKELEME", "ZEYTİN_TOPLAMA", "BAĞ_BOZUMU"] },
    { category: "OKUL AÇILIŞ HAZIRLIĞI", difficulty: "tricky", words: ["KIRTASİYE_ALMA", "ÜNİFORMA_DİKTİRME", "DERS_PROGRAMI", "ÇANTA_HAZIRLAMA"] },
    { category: "TATİL HAZIRLIĞI", difficulty: "tricky", words: ["BAVUL_TOPLAMA", "BİLET_ALMA", "OTEL_AYARLAMA", "YOL_PLANI"] }
  ]},

  // 179: Beden dili
  { id: 179, tier: "legendary", maxMistakes: 3, groups: [
    { category: "ONAY ANLAMINDA", difficulty: "easy", words: ["BAŞ_SALLAMA", "BAŞPARMAK_KALDIRMA", "GÖZ_KIRPMA", "TAMAM_İŞARETİ"] },
    { category: "RET ANLAMINDA", difficulty: "medium", words: ["BAŞ_İKİ_YANA", "EL_SALLAMA", "OMUZ_SİLKME", "KAŞ_KALDIRMA"] },
    { category: "SUSMA İŞARETİ", difficulty: "hard", words: ["PARMAK_DUDAĞA", "ELLE_İŞARET", "GÖZLE_UYARMA", "DUDAK_BÜZME"] },
    { category: "ÇAĞIRMA İŞARETİ", difficulty: "hard", words: ["EL_İLE_ÇAĞIRMA", "ISLIK_ÇALMA", "İSİM_SESLENME", "KOLU_KALDIRMA"] },
    { category: "SELAMLAŞMA", difficulty: "tricky", words: ["EL_SIKIŞMA", "SARILMA", "YANAK_ÖPME", "ELİNİ_KALBE_KOYMA"] },
    { category: "ŞAŞKINLIK İŞARETİ", difficulty: "tricky", words: ["AĞZI_AÇIK_KALMA", "ELLERİ_BAŞA_GÖTÜRME", "GERİYE_KAYKILMA", "GÖZLERİ_OVUŞTURMA"] }
  ]},

  // 180: Pazardan ne alınır
  { id: 180, tier: "legendary", maxMistakes: 3, groups: [
    { category: "YEŞİLLİK TEZGAHI", difficulty: "easy", words: ["TERE", "DEREOTU", "NANE", "SEMİZOTU"] },
    { category: "MEYVE TEZGAHI", difficulty: "medium", words: ["AYVA", "NAR", "TRABZON_HURMASI", "MUŞMULA"] },
    { category: "BAKLAGİL TEZGAHI", difficulty: "hard", words: ["NOHUT", "BARBUNYA", "BÖRÜLCE", "MERCİMEK"] },
    { category: "TURŞULUK TEZGAHI", difficulty: "hard", words: ["KORNİŞON", "LAHANA", "PANCAR", "ACUR"] },
    { category: "KURUYEMİŞ TEZGAHI", difficulty: "tricky", words: ["FINDIK", "BADEM", "ANTEP_FISTIĞI", "KAYISI_KURUSU"] },
    { category: "BAHARAT TEZGAHI", difficulty: "tricky", words: ["KİMYON", "PUL_BİBER", "KEKİK", "SUMAK"] }
  ]},

  // 181: Hangi oyun
  { id: 181, tier: "legendary", maxMistakes: 3, groups: [
    { category: "ZEKA OYUNU", difficulty: "easy", words: ["SATRANÇ", "SUDOKU", "KARE_BULMACA", "MANGALA"] },
    { category: "SOKAK OYUNU", difficulty: "medium", words: ["SAKLAMBAÇ", "ELİM_SENDE", "YAKAN_TOP", "MENDİL_KAPMACA"] },
    { category: "KAĞIT OYUNU", difficulty: "hard", words: ["PİŞTİ", "BATAK", "KING", "ODUNCU"] },
    { category: "KALEM KAĞIT OYUNU", difficulty: "hard", words: ["İSİM_ŞEHİR", "ADAM_ASMACA", "TIK_TAK_TOE", "NOKTA_OYUNU"] },
    { category: "PARMAK OYUNU", difficulty: "tricky", words: ["TAŞ_KAĞIT_MAKAS", "BİRDİRBİR", "DOKUZ_TAŞ", "BEŞ_TAŞ"] },
    { category: "BİLGİSAYAR OYUNU", difficulty: "tricky", words: ["YARIŞ_OYUNU", "BULMACA_OYUNU", "MACERA_OYUNU", "STRATEJİ_OYUNU"] }
  ]},

  // 182: Hangi koku
  { id: 182, tier: "legendary", maxMistakes: 3, groups: [
    { category: "MUTFAK KOKUSU", difficulty: "easy", words: ["TAZE_EKMEK", "DEMLENMİŞ_ÇAY", "SOĞAN_KAVURMASI", "BAHARATLI_YEMEK"] },
    { category: "DOĞA KOKUSU", difficulty: "medium", words: ["YAĞMUR_SONRASI", "ÇİÇEK_KOKUSU", "ÇAM_ORMANI", "DENİZ_HAVASI"] },
    { category: "TEMİZLİK KOKUSU", difficulty: "hard", words: ["SABUN", "ÇAMAŞIR_SUYU", "KOLONYA", "ODA_SPREYİ"] },
    { category: "RAHATSIZ EDEN KOKU", difficulty: "hard", words: ["KÜF", "ÇÜRÜK_YUMURTA", "EGZOZ_DUMANI", "TER"] },
    { category: "TATLI KOKU", difficulty: "tricky", words: ["VANİLYA", "TARÇIN", "FIRINDAN_KEK", "ÇİKOLATA"] },
    { category: "BAYRAM KOKUSU", difficulty: "tricky", words: ["YENİ_GİYSİ", "KOLONYALI_EL", "BAYRAM_TATLISI", "TÜTSÜ"] }
  ]},

  // 183: Hangi şikayet / hangi doktor
  { id: 183, tier: "legendary", maxMistakes: 3, groups: [
    { category: "DİŞ ŞİKAYETİ", difficulty: "easy", words: ["DİŞ_ÇÜRÜĞÜ", "DİŞ_ETİ_KANAMASI", "DİŞ_AĞRISI", "DİŞ_TAŞI"] },
    { category: "GÖZ ŞİKAYETİ", difficulty: "medium", words: ["BULANIK_GÖRME", "GÖZ_SULANMASI", "GÖZ_KAŞINTISI", "GÖZ_YORGUNLUĞU"] },
    { category: "MİDE ŞİKAYETİ", difficulty: "hard", words: ["MİDE_BULANTISI", "HAZIMSIZLIK", "MİDE_YANMASI", "ŞİŞKİNLİK"] },
    { category: "SOĞUK ALGINLIĞI", difficulty: "hard", words: ["BURUN_AKINTISI", "HAPŞIRMA", "BOĞAZ_AĞRISI", "HALSİZLİK"] },
    { category: "KAS İSKELET ŞİKAYETİ", difficulty: "tricky", words: ["BEL_AĞRISI", "BOYUN_TUTULMASI", "EKLEM_AĞRISI", "KAS_KRAMPI"] },
    { category: "CİLT ŞİKAYETİ", difficulty: "tricky", words: ["KAŞINTI", "KIZARIKLIK", "KURULUK", "SİVİLCE"] }
  ]},

  // 184: Batch finali — çok anlamlı kelime tuzakları
  { id: 184, tier: "legendary", maxMistakes: 3, groups: [
    { category: "GİRMEK FİİLİYLE", difficulty: "easy", words: ["SINAVA_GİRMEK", "İÇERİ_GİRMEK", "ARAYA_GİRMEK", "BORCA_GİRMEK"] },
    { category: "KIRMAK FİİLİYLE", difficulty: "medium", words: ["CAM_KIRMAK", "KALP_KIRMAK", "REKOR_KIRMAK", "ORUÇ_KIRMAK"] },
    { category: "DÖKMEK FİİLİYLE", difficulty: "hard", words: ["SU_DÖKMEK", "GÖZYAŞI_DÖKMEK", "DİL_DÖKMEK", "YAPRAK_DÖKMEK"] },
    { category: "BOZMAK FİİLİYLE", difficulty: "hard", words: ["PARA_BOZMAK", "OYUN_BOZMAK", "SÜKUNETİ_BOZMAK", "MORAL_BOZMAK"] },
    { category: "SERMEK FİİLİYLE", difficulty: "tricky", words: ["ÇAMAŞIR_SERMEK", "SOFRA_SERMEK", "YERE_SERMEK", "MİNDER_SERMEK"] },
    { category: "TAKMAK FİİLİYLE", difficulty: "tricky", words: ["KÜPE_TAKMAK", "İSİM_TAKMAK", "KAFAYA_TAKMAK", "NOT_TAKMAK"] }
  ]},

  // ============ BATCH 4 (185-200) — 7 grup — BUYUK FINAL ============

  // 185: Hangi dükkandan
  { id: 185, tier: "legendary", maxMistakes: 3, groups: [
    { category: "KUYUMCUDA SATILIR", difficulty: "easy", words: ["YÜZÜK", "KOLYE", "BİLEZİK", "KÜPE"] },
    { category: "NALBURDA SATILIR", difficulty: "medium", words: ["VİDA", "ASMA_KİLİT", "MUSLUK", "MENTEŞE"] },
    { category: "GÖZLÜKÇÜDE SATILIR", difficulty: "hard", words: ["NUMARALI_CAM", "ÇERÇEVE", "LENS", "GÖZLÜK_KILIFI"] },
    { category: "MOBİLYACIDA SATILIR", difficulty: "hard", words: ["GARDIROP", "VİTRİN", "PUF", "ŞİFONYER"] },
    { category: "ZÜCCACİYEDE SATILIR", difficulty: "tricky", words: ["ÇAY_TAKIMI", "FİNCAN", "SU_BARDAĞI", "TENCERE_SETİ"] },
    { category: "KASETÇİDE SATILIR", difficulty: "tricky", words: ["ALBÜM", "PLAK", "DİNLEME_CİHAZI", "KASET"] },
    { category: "BALIK HALİNDE SATILIR", difficulty: "tricky", words: ["HAMSİ", "ÇİPURA", "LEVREK", "İSTAVRİT"] }
  ]},

  // 186: Bileşik kelime — 7 ön ek
  { id: 186, tier: "legendary", maxMistakes: 3, groups: [
    { category: "DİL ___", difficulty: "easy", words: ["DİLBİLGİSİ", "DİLEKÇE", "DİLBALIĞI", "DİLPEYNİRİ"] },
    { category: "KULAK ___", difficulty: "medium", words: ["KULAKLIK", "KULAK_MEMESİ", "KULAK_DOLGUNLUĞU", "KULAK_MİSAFİRİ"] },
    { category: "KÖŞE ___", difficulty: "hard", words: ["KÖŞEBAŞI", "KÖŞE_YAZARI", "KÖŞE_KOLTUĞU", "KÖŞE_BUCAK"] },
    { category: "KUM ___", difficulty: "hard", words: ["KUMSAAT", "KUMBARA", "KUMPAS", "KUMTAŞI"] },
    { category: "BUZ ___", difficulty: "tricky", words: ["BUZDOLABI", "BUZPATENİ", "BUZHANE", "BUZKIRAN"] },
    { category: "KAPI ___", difficulty: "tricky", words: ["KAPI_KOLU", "KAPI_ZİLİ", "KAPI_NUMARASI", "KAPI_KOMŞUSU"] },
    { category: "TOP ___", difficulty: "tricky", words: ["TOPUZ", "TOPAÇ", "TOPLU_İĞNE", "TOPRAK"] }
  ]},

  // 187: Hangi ruh hali
  { id: 187, tier: "legendary", maxMistakes: 3, groups: [
    { category: "SEVİNÇ HALİ", difficulty: "easy", words: ["COŞKU", "NEŞE", "KEYİF", "MUTLULUK"] },
    { category: "KEDER HALİ", difficulty: "medium", words: ["HÜZÜN", "GAM", "TASA", "ELEM"] },
    { category: "ÖFKE HALİ", difficulty: "hard", words: ["HİDDET", "KIZGINLIK", "GAZAP", "SİNİR"] },
    { category: "KORKU HALİ", difficulty: "hard", words: ["ÜRPERTİ", "DEHŞET", "ENDİŞE", "PANİK"] },
    { category: "YORGUNLUK HALİ", difficulty: "tricky", words: ["BİTKİNLİK", "MECALSİZLİK", "TAKATSİZLİK", "DERMANSIZLIK"] },
    { category: "HEYECAN HALİ", difficulty: "tricky", words: ["TELAŞ", "MERAK", "SABIRSIZLIK", "İÇ_GIDIKLANMASI"] },
    { category: "HUZUR HALİ", difficulty: "tricky", words: ["DİNGİNLİK", "FERAHLIK", "İÇ_RAHATLIĞI", "SÜKUNET"] }
  ]},

  // 188: Hangi sporcu ne yapar
  { id: 188, tier: "legendary", maxMistakes: 3, groups: [
    { category: "FUTBOLCU YAPAR", difficulty: "easy", words: ["TOPA_VURMA", "ÇALIM_ATMA", "KAFA_VURUŞU", "GOL_SEVİNCİ"] },
    { category: "BOKSÖR YAPAR", difficulty: "medium", words: ["YUMRUK_SAVURMA", "KORUMA_ALMA", "RİNGDE_DANS", "DARBE_SAVUŞTURMA"] },
    { category: "YÜZÜCÜ YAPAR", difficulty: "hard", words: ["NEFES_AYARLAMA", "SUYA_BALIKLAMA", "TEMPO_TUTMA", "DÖNÜŞ_TAKLASI"] },
    { category: "GÜREŞÇİ YAPAR", difficulty: "hard", words: ["MİNDERE_ÇIKMA", "RAKİBİ_TUŞLAMA", "OYUN_YAPMA", "PEŞREV_ÇEKME"] },
    { category: "JİMNASTİKÇİ YAPAR", difficulty: "tricky", words: ["TAKLA_ATMA", "DENGE_KURMA", "ESNEME_HAREKETİ", "PERENDE"] },
    { category: "DAĞCI YAPAR", difficulty: "tricky", words: ["İPE_TUTUNMA", "ZİRVEYE_ÇIKMA", "KAMP_KURMA", "KAYAYA_TIRMANMA"] },
    { category: "OKÇU YAPAR", difficulty: "tricky", words: ["YAYI_GERME", "NİŞAN_ALMA", "OKU_BIRAKMA", "HEDEFİ_VURMA"] }
  ]},

  // 189: Hangi havada gökyüzü
  { id: 189, tier: "legendary", maxMistakes: 3, groups: [
    { category: "AÇIK HAVADA GÖKYÜZÜ", difficulty: "easy", words: ["MASMAVİ", "PIRIL_PIRIL", "BULUTSUZ", "BERRAK"] },
    { category: "BULUTLU HAVADA", difficulty: "medium", words: ["KAPALI_HAVA", "GRİMSİ", "KURŞUNİ", "KAPANIK"] },
    { category: "FIRTINALI HAVADA", difficulty: "hard", words: ["KARARMIŞ", "ŞİMŞEKLİ", "GÜRÜLTÜLÜ", "TEHDİTKAR"] },
    { category: "GÜN BATIMINDA", difficulty: "hard", words: ["KIZILLIK", "TURUNCU_TONLAR", "ALACAKARANLIK", "BATAN_GÜNEŞ"] },
    { category: "GECE GÖKYÜZÜ", difficulty: "tricky", words: ["KAPKARANLIK", "YILDIZLI", "MEHTAPLI", "DOLUNAYLI"] },
    { category: "SİSLİ HAVADA", difficulty: "tricky", words: ["BULANIK", "PUSLU", "GÖRÜŞ_MESAFESİ_KISA", "BEYAZIMSI"] },
    { category: "ŞAFAK VAKTİ", difficulty: "tricky", words: ["AĞARAN_UFUK", "İLK_IŞIK", "PEMBEMSİ", "GÜN_DOĞUMU"] }
  ]},

  // 190: Hangi yemek öncesi hazırlık
  { id: 190, tier: "legendary", maxMistakes: 3, groups: [
    { category: "ÇORBA HAZIRLIĞI", difficulty: "easy", words: ["SEBZE_DOĞRAMA", "TERBİYE_YAPMA", "KAYNATMA", "BLENDERDAN_GEÇİRME"] },
    { category: "KÖFTE HAZIRLIĞI", difficulty: "medium", words: ["KIYMA_YOĞURMA", "BAHARAT_KATMA", "ŞEKİL_VERME", "TAVADA_PİŞİRME"] },
    { category: "BÖREK HAZIRLIĞI", difficulty: "hard", words: ["YUFKA_SERME", "İÇ_HAZIRLAMA", "RULO_YAPMA", "YUMURTA_SÜRME"] },
    { category: "SALATA HAZIRLIĞI", difficulty: "hard", words: ["YIKAMA", "İNCE_KIYMA", "SOS_GEZDİRME", "KARIŞTIRMA"] },
    { category: "TURŞU HAZIRLIĞI", difficulty: "tricky", words: ["KAVANOZA_DİZME", "SİRKE_DÖKME", "SU_EKLEME", "AĞZINI_KAPATMA"] },
    { category: "REÇEL HAZIRLIĞI", difficulty: "tricky", words: ["MEYVE_AYIKLAMA", "ŞEKERLE_BEKLETME", "KISIK_ATEŞ", "KÖPÜK_ALMA"] },
    { category: "HAMUR İŞİ HAZIRLIĞI", difficulty: "tricky", words: ["MAYA_ÇÖZME", "TEPSİ_YAĞLAMA", "OKLAVAYLA_AÇMA", "FIRINI_ISITMA"] }
  ]},

  // 191: Vücut bakımı
  { id: 191, tier: "legendary", maxMistakes: 3, groups: [
    { category: "SAÇ BAKIMI", difficulty: "easy", words: ["ŞAMPUANLAMA", "TARAMA", "KURUTMA", "MASKE_UYGULAMA"] },
    { category: "DİŞ BAKIMI", difficulty: "medium", words: ["FIRÇALAMA", "DİŞ_İPİ", "GARGARA", "AĞIZ_ÇALKALAMA"] },
    { category: "CİLT BAKIMI", difficulty: "hard", words: ["NEMLENDİRME", "TEMİZLEME_JELİ", "GÜNEŞ_KORUYUCU", "PEELİNG"] },
    { category: "EL VE TIRNAK BAKIMI", difficulty: "hard", words: ["TIRNAK_KESME", "TÖRPÜLEME", "KREM_SÜRME", "OJE_SÜRME"] },
    { category: "AYAK BAKIMI", difficulty: "tricky", words: ["NASIR_TEMİZLEME", "TOPUK_BAKIMI", "ÇORAP_DEĞİŞTİRME", "AYAK_BANYOSU"] },
    { category: "GÜNLÜK TEMİZLİK", difficulty: "tricky", words: ["DUŞ_ALMA", "EL_YIKAMA", "YÜZ_YIKAMA", "KULAK_TEMİZLİĞİ"] },
    { category: "TIRAŞ", difficulty: "tricky", words: ["KÖPÜK_SÜRME", "JİLET_KULLANMA", "TIRAŞ_SONRASI_LOSYON", "SAKAL_DÜZELTME"] }
  ]},

  // 192: Yolculukta
  { id: 192, tier: "legendary", maxMistakes: 3, groups: [
    { category: "OTOBÜS YOLCULUĞUNDA", difficulty: "easy", words: ["KOLTUK_NUMARASI", "MOLA", "İKRAM_SERVİSİ", "BAGAJ_BÖLÜMÜ"] },
    { category: "UÇAK YOLCULUĞUNDA", difficulty: "medium", words: ["BİNİŞ_KARTI", "KEMER_BAĞLAMA", "EL_BAGAJI", "PENCERE_KENARI"] },
    { category: "VAPUR YOLCULUĞUNDA", difficulty: "hard", words: ["GÜVERTE", "İSKELE", "MARTI_BESLEME", "BOĞAZ_MANZARASI"] },
    { category: "TREN YOLCULUĞUNDA", difficulty: "hard", words: ["KOMPARTIMAN", "PERON", "RAY_SESİ", "VAGON_GEÇİŞİ"] },
    { category: "ARABA YOLCULUĞUNDA", difficulty: "tricky", words: ["NAVİGASYON", "BENZİN_MOLASI", "MÜZİK_AÇMA", "ARKA_KOLTUK"] },
    { category: "YAYA YOLCULUKTA", difficulty: "tricky", words: ["KALDIRIMDAN_YÜRÜME", "YAYA_GEÇİDİ_KULLANMA", "YORULUNCA_OTURMA", "ADRES_SORMA"] },
    { category: "YOLCULUK HAZIRLIĞINDA", difficulty: "tricky", words: ["VALİZ_DİZME", "BİLET_KONTROLÜ", "ERKEN_ÇIKMA", "HAVA_DURUMUNA_BAKMA"] }
  ]},

  // 193: Hangi belge nerede
  { id: 193, tier: "legendary", maxMistakes: 2, groups: [
    { category: "KİMLİK BİLGİSİ", difficulty: "easy", words: ["AD_SOYAD", "DOĞUM_TARİHİ", "BABA_ADI", "NÜFUS_NUMARASI"] },
    { category: "OKUL BELGESİ", difficulty: "medium", words: ["SINIF_LİSTESİ", "DEVAMSIZLIK_BELGESİ", "ÖĞRENCİ_BELGESİ", "TAKDİR_BELGESİ"] },
    { category: "SAĞLIK BELGESİ", difficulty: "hard", words: ["RAPOR", "AŞI_KARTI", "TAHLİL_SONUCU", "SAĞLIK_KARNESİ"] },
    { category: "BANKADA İŞLEM", difficulty: "hard", words: ["PARA_YATIRMA", "PARA_ÇEKME", "HESAP_AÇMA", "DEKONT_ALMA"] },
    { category: "POSTANEDE İŞLEM", difficulty: "tricky", words: ["MEKTUP_GÖNDERME", "KOLİ_KARGOLAMA", "PUL_ALMA", "TELGRAF_ÇEKME"] },
    { category: "BELEDİYEDE İŞLEM", difficulty: "tricky", words: ["SU_ABONELİĞİ", "EVLİLİK_BAŞVURUSU", "RUHSAT_ALMA", "ŞİKAYET_DİLEKÇESİ"] },
    { category: "VERGİ DAİRESİNDE", difficulty: "tricky", words: ["VERGİ_ÖDEME", "BEYANNAME", "BORÇ_SORGULAMA", "MÜKELLEF_KAYDI"] }
  ]},

  // 194: Hangi deyim ne anlatır
  { id: 194, tier: "legendary", maxMistakes: 2, groups: [
    { category: "ÇOK SEVİNMEK", difficulty: "easy", words: ["ETEKLERİ_ZİL_ÇALMAK", "AĞZI_KULAKLARINA_VARMAK", "SEVİNÇTEN_UÇMAK", "BAYRAM_ETMEK"] },
    { category: "ÇOK KORKMAK", difficulty: "medium", words: ["ÖDÜ_KOPMAK", "YÜREĞİ_AĞZINA_GELMEK", "TÜYLERİ_ÜRPERMEK", "DİZLERİ_TİTREMEK"] },
    { category: "ÇOK ÜZÜLMEK", difficulty: "hard", words: ["İÇİ_PARÇALANMAK", "GÖZLERİ_DOLMAK", "YÜREĞİ_BURKULMAK", "KAHROLMAK"] },
    { category: "ÇOK KIZMAK", difficulty: "hard", words: ["TEPESİ_ATMAK", "KÜPLERE_BİNMEK", "BURNUNDAN_SOLUMAK", "ATEŞ_PÜSKÜRMEK"] },
    { category: "ÇOK YORULMAK", difficulty: "tricky", words: ["CANI_ÇIKMAK", "TAKATİ_KALMAMAK", "AYAKTA_DURAMAMAK", "BİTAP_DÜŞMEK"] },
    { category: "ÇOK ŞAŞIRMAK", difficulty: "tricky", words: ["KÜÇÜK_DİLİNİ_YUTMAK", "DONUP_KALMAK", "AĞZI_AÇIK_KALMAK", "GÖZLERİNE_İNANAMAMAK"] },
    { category: "ÇOK UTANMAK", difficulty: "tricky", words: ["YERİN_DİBİNE_GEÇMEK", "KIPKIRMIZI_OLMAK", "MAHCUP_OLMAK", "BAŞINI_KALDIRAMAMAK"] }
  ]},

  // 195: Hangi meslek hangi mekanda
  { id: 195, tier: "legendary", maxMistakes: 2, groups: [
    { category: "FIRINDA ÇALIŞIR", difficulty: "easy", words: ["EKMEKÇİ", "PİDECİ", "SİMİTÇİ", "POĞAÇACI"] },
    { category: "GEMİDE ÇALIŞIR", difficulty: "medium", words: ["KAPTAN", "TAYFA", "LOSTROMO", "MAKİNİST"] },
    { category: "UÇAKTA ÇALIŞIR", difficulty: "hard", words: ["PİLOT", "KABİN_MEMURU", "HOSTES", "İKİNCİ_PİLOT"] },
    { category: "TİYATRODA ÇALIŞIR", difficulty: "hard", words: ["OYUNCU", "SUFLÖR", "DEKORCU", "IŞIKÇI"] },
    { category: "GAZETEDE ÇALIŞIR", difficulty: "tricky", words: ["MUHABİR", "EDİTÖR", "FOTO_MUHABİRİ", "YAZI_İŞLERİ_MÜDÜRÜ"] },
    { category: "İNŞAATTA ÇALIŞIR", difficulty: "tricky", words: ["KALIPÇI", "SIVACI", "DEMİRCİ", "İŞÇİBAŞI"] },
    { category: "OTELDE ÇALIŞIR", difficulty: "tricky", words: ["RESEPSİYONİST", "KAT_GÖREVLİSİ", "VALE", "OTEL_MÜDÜRÜ"] }
  ]},

  // 196: Hangi olay doğada
  { id: 196, tier: "legendary", maxMistakes: 2, groups: [
    { category: "GÖKTE OLUR", difficulty: "easy", words: ["YILDIZ_KAYMASI", "AY_TUTULMASI", "ŞAFAK_SÖKMESİ", "BULUT_GEÇİŞİ"] },
    { category: "DENİZDE OLUR", difficulty: "medium", words: ["MED_CEZİR", "DALGA_KABARMASI", "AKINTI", "KÖPÜKLENME"] },
    { category: "TOPRAKTA OLUR", difficulty: "hard", words: ["ÇATLAMA", "ÇÖKME", "VERİMLİLEŞME", "KAYMA"] },
    { category: "ORMANDA OLUR", difficulty: "hard", words: ["YAPRAK_AÇMA", "MEYVE_VERME", "AĞAÇ_DEVRİLMESİ", "FİLİZ_SÜRME"] },
    { category: "HAVADA OLUR", difficulty: "tricky", words: ["YILDIRIM_DÜŞMESİ", "DOLU_YAĞMASI", "ÇİY_OLUŞMASI", "GÖKKUŞAĞI_BELİRMESİ"] },
    { category: "DAĞDA OLUR", difficulty: "tricky", words: ["KAR_ERİMESİ", "ÇIĞ_DÜŞMESİ", "SİS_BASMASI", "KAYA_YUVARLANMASI"] },
    { category: "GÖLDE OLUR", difficulty: "tricky", words: ["DONMA", "BUHARLAŞMA", "SAZLIK_OLUŞMASI", "SU_ÇEKİLMESİ"] }
  ]},

  // 197: Hangi alışkanlık
  { id: 197, tier: "legendary", maxMistakes: 2, groups: [
    { category: "İYİ ALIŞKANLIK", difficulty: "easy", words: ["ERKEN_YATMA", "KİTAP_OKUMA", "SPOR_YAPMA", "SU_İÇME"] },
    { category: "KÖTÜ ALIŞKANLIK", difficulty: "medium", words: ["TIRNAK_YEME", "GEÇ_KALMA", "SÖZ_KESME", "ERTELEME"] },
    { category: "SABAH RUTİNİ", difficulty: "hard", words: ["YATAK_TOPLAMA", "KAHVALTI_ETME", "PERDE_AÇMA", "GİYİNME"] },
    { category: "AKŞAM RUTİNİ", difficulty: "hard", words: ["YEMEK_YEME", "HABER_İZLEME", "DİŞ_FIRÇALAMA", "PİJAMA_GİYME"] },
    { category: "HAFTA SONU YAPILANI", difficulty: "tricky", words: ["GEÇ_UYANMA", "GEZMEYE_ÇIKMA", "MİSAFİRLİK", "DİNLENME"] },
    { category: "TASARRUF ALIŞKANLIĞI", difficulty: "tricky", words: ["IŞIKLARI_SÖNDÜRME", "MUSLUĞU_KISMA", "FİŞ_ÇEKME", "GEREKSİZ_HARCAMAMA"] },
    { category: "NEZAKET DAVRANIŞI", difficulty: "tricky", words: ["SIRA_BEKLEME", "TEŞEKKÜR_ETME", "KAPI_TUTMA", "YAŞLIYA_YER_VERME"] }
  ]},

  // 198: Hangi mekanda ne yapılır
  { id: 198, tier: "legendary", maxMistakes: 2, groups: [
    { category: "KÜTÜPHANEDE", difficulty: "easy", words: ["SESSİZ_OLMA", "KİTAP_ÖDÜNÇ_ALMA", "ARAŞTIRMA_YAPMA", "NOT_TUTMA"] },
    { category: "SİNEMADA", difficulty: "medium", words: ["KOLTUK_BULMA", "PATLAMIŞ_MISIR", "PERDE_İZLEME", "TELEFONU_SUSTURMA"] },
    { category: "MÜZEDE", difficulty: "hard", words: ["ESERLERE_BAKMA", "REHBER_DİNLEME", "DOKUNMAMA", "SERGİ_GEZME"] },
    { category: "PARKTA", difficulty: "hard", words: ["SALINCAĞA_BİNME", "BANKTA_OTURMA", "YÜRÜYÜŞ_YAPMA", "KUŞ_BESLEME"] },
    { category: "HASTANEDE", difficulty: "tricky", words: ["SIRA_NUMARASI_ALMA", "MUAYENE_OLMA", "TAHLİL_VERME", "İLAÇ_YAZDIRMA"] },
    { category: "BERBERDE", difficulty: "tricky", words: ["KOLTUĞA_OTURMA", "SAÇ_KESTİRME", "SAKAL_TIRAŞI", "AYNADA_BAKMA"] },
    { category: "LOKANTADA", difficulty: "tricky", words: ["MENÜ_İSTEME", "SİPARİŞ_VERME", "HESAP_İSTEME", "BAHŞİŞ_BIRAKMA"] }
  ]},

  // 199: Hangi zamanda
  { id: 199, tier: "legendary", maxMistakes: 2, groups: [
    { category: "GÜN İÇİNDE", difficulty: "easy", words: ["ÖĞLEN", "İKİNDİ", "GÜN_ORTASI", "GÜN_BOYU"] },
    { category: "HAFTA İÇİNDE", difficulty: "medium", words: ["HAFTA_BAŞI", "HAFTA_ORTASI", "HAFTA_SONU", "HER_GÜN"] },
    { category: "AY İÇİNDE", difficulty: "hard", words: ["AY_BAŞI", "AY_SONU", "AY_ORTASI", "BU_AY"] },
    { category: "YIL İÇİNDE", difficulty: "hard", words: ["YIL_BAŞI", "YIL_SONU", "YIL_DÖNÜMÜ", "GELECEK_YIL"] },
    { category: "GEÇMİŞ ZAMAN", difficulty: "tricky", words: ["DÜN", "EVVELSİ_GÜN", "GEÇEN_HAFTA", "ESKİDEN"] },
    { category: "GELECEK ZAMAN", difficulty: "tricky", words: ["YARIN", "ÖBÜR_GÜN", "İLERİDE", "BİRAZDAN"] },
    { category: "BELİRSİZ ZAMAN", difficulty: "tricky", words: ["BİR_GÜN", "ARA_SIRA", "BAZEN", "ER_GEÇ"] }
  ]},

  // 200: BÜYÜK FİNAL — çok anlamlı kelime tuzakları
  { id: 200, tier: "legendary", maxMistakes: 2, groups: [
    { category: "GEÇMEK FİİLİYLE", difficulty: "easy", words: ["SINIF_GEÇMEK", "YOLDAN_GEÇMEK", "VAZGEÇMEK", "SÖZ_GEÇİRMEK"] },
    { category: "ÇIKMAK FİİLİYLE", difficulty: "medium", words: ["YOLA_ÇIKMAK", "ORTAYA_ÇIKMAK", "İŞTEN_ÇIKMAK", "KARŞINA_ÇIKMAK"] },
    { category: "DÜŞMEK FİİLİYLE", difficulty: "hard", words: ["YERE_DÜŞMEK", "YOLA_DÜŞMEK", "HASTA_DÜŞMEK", "AKLINA_DÜŞMEK"] },
    { category: "KALMAK FİİLİYLE", difficulty: "hard", words: ["GERİDE_KALMAK", "HAYRAN_KALMAK", "SINIFTA_KALMAK", "YOLDA_KALMAK"] },
    { category: "BAKMAK FİİLİYLE", difficulty: "tricky", words: ["HASTAYA_BAKMAK", "PENCEREDEN_BAKMAK", "İŞİNE_BAKMAK", "ÇOCUĞA_BAKMAK"] },
    { category: "GELMEK FİİLİYLE", difficulty: "tricky", words: ["AKLA_GELMEK", "DİLE_GELMEK", "PAHALIYA_GELMEK", "ÜSTÜNE_GELMEK"] },
    { category: "VURMAK FİİLİYLE", difficulty: "tricky", words: ["KAPIYI_VURMAK", "GÜNEŞ_VURMAK", "KAFAYA_VURMAK", "DAMGASINI_VURMAK"] }
  ]}
];

const TOTAL_LEVELS = LEVELS.length;

function getLevel(n) {
  if (n < 1 || n > TOTAL_LEVELS) return null;
  return LEVELS[n - 1];
}

function getTierInfo(tierKey) {
  return TIERS[tierKey];
}
