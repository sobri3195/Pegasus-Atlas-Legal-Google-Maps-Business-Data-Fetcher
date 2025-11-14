# Pegasus Atlas
**Automated Business Data Collector & Browser Automation Toolkit**

Pegasus Atlas adalah aplikasi desktop yang dirancang untuk mengotomatisasi pengambilan data publik dari internet menggunakan teknik browser automation, DOM parsing, dan headless browsing.

Aplikasi ini difokuskan untuk keperluan riset, analisis pasar, dan pengelolaan data publik yang tersedia secara terbuka di web.

⚠️ **Pegasus Atlas tidak menggunakan API resmi apa pun**—sehingga cocok untuk eksperimen, riset internal, dan automation workflow yang membutuhkan fleksibilitas penuh.

---

## ✨ Fitur Utama

### 🔍 1. Automated Business Search
- Masukkan keyword (misalnya: kategori bisnis atau wilayah)
- Aplikasi melakukan navigasi otomatis melalui browser engine
- Mengambil informasi publik dari halaman yang ditampilkan

### 📌 2. Data Extractor (Public Info Only)
Ekstraksi elemen halaman seperti:
- Nama bisnis
- Alamat publik
- Nomor telepon yang terlihat
- Link website
- Kategori
- Koordinat (jika tersedia di elemen halaman)
- Informasi metadata lainnya yang muncul di DOM

**Hanya mengumpulkan informasi yang memang ditampilkan secara publik di halaman.**

### ⚙️ 3. Headless / Visible Browser Mode
- Mode headless untuk otomatisasi cepat
- Mode visual untuk debugging
- Pengaturan delay & human-behavior simulation untuk stabilitas

### 📁 4. Ekspor Data
- CSV
- Excel
- JSON
- PDF (laporan ringkas)

### 🔄 5. Batch Automation
- Input kata kunci banyak sekaligus
- Sistem antrean otomatis
- Retry system jika halaman gagal dimuat

### 📊 6. Data Cleaning
- Deteksi duplikasi
- Normalisasi alamat
- Penyatuan format data

---

## ⚠️ Catatan Penting (Legal & Etika)

**Pegasus Atlas menyediakan alat browser automation, bukan alat untuk:**
- ❌ melakukan bypass keamanan
- ❌ mengambil data yang dilindungi
- ❌ mem-bypass CAPTCHA
- ❌ melanggar Terms of Service sebuah platform
- ❌ mengambil data pribadi/non-publik

**Pengguna bertanggung jawab memastikan penggunaan sesuai hukum & kebijakan situs tujuan.**

---

## 🛠️ Teknologi

- **Desktop**: Electron
- **Automation Engine**: Puppeteer
- **Parser**: Cheerio
- **Database**: LowDB
- **UI**: React + TypeScript

---

## 🚀 Instalasi & Penggunaan

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Instalasi
```bash
# Clone repository
git clone <repository-url>
cd pegasus-atlas

# Install dependencies
npm install

# Run development mode
npm run dev

# Build for production
npm run build
npm start
```

### Development
```bash
# Run in development mode
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

---

## 📁 Struktur Project

```
pegasus-atlas/
├── src/
│   ├── main/              # Electron main process
│   ├── renderer/          # UI components (React)
│   ├── automation/        # Browser automation logic
│   ├── data/              # Data processing & storage
│   └── utils/             # Utility functions
├── public/                # Static assets
├── dist/                  # Build output
└── package.json
```

---

## 📊 Roadmap

- [ ] Visual Flow Builder untuk automation
- [ ] Proxy rotation module
- [ ] DOM selector recorder
- [ ] Template extraction
- [ ] Plugin marketplace

---

## 📄 License

MIT License - See LICENSE file for details

---

**Made with ❤️ for research and market analysis purposes**
