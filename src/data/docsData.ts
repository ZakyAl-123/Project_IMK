export interface DocItem {
  id: string;
  title: string;
  category: "Bisnis" | "UX & UI" | "Sistem & UML" | "Basis Data" | "API & Koding" | "Panduan & Manual";
  description: string;
  content: string; // Markdown or rich HTML-compatible content
  visualData?: any; // Structured data for rendering custom diagrams/tables
}

export const documentationList: DocItem[] = [
  {
    id: "doc_01",
    title: "1. Business Model Canvas",
    category: "Bisnis",
    description: "Kerangka kerja manajemen strategis untuk mendefinisikan model bisnis Desaine.",
    content: "Business Model Canvas (BMC) Desaine dirancang untuk memposisikan platform sebagai ekosistem hulu-ke-hilir untuk kreator digital Indonesia.",
    visualData: {
      headers: ["Key Partners", "Key Activities", "Value Propositions", "Customer Relationships", "Customer Segments"],
      rows: [
        {
          partners: "• Payment Gateway (Midtrans, Xendit)\n• Komunitas Desain (Dribbble ID, Behance ID)\n• Universitas & LKP Seni Rupa\n• Asosiasi Desainer Grafis Indonesia (ADGI)\n• Penyedia Cloud (GCP/AWS)",
          activities: "• Maintenance core engine marketplace\n• Moderasi aset masuk & verifikasi hak cipta\n• Pengelolaan Escrow custom order\n• Marketing dan promosi featured designers\n• Pengembangan algoritma AI Copilot",
          value_propositions: "• Kreator: Pendapatan berkelanjutan, lisensi aman, AI generator pendukung.\n• Pembeli: File terverifikasi bebas malware, refund terjamin escrow, kustomisasi desainer lokal.\n• Korporasi: Dokumen penagihan resmi (Invoice & PPN).",
          relationships: "• Sistem Escrow terpercaya\n• Customer Support 24/7\n• Komunitas Forum interaktif\n• Program Sertifikasi Desainer\n• Perlindungan royalti otomatis",
          segments: "• UMKM & Startup Lokal\n• Agensi Periklanan\n• Perusahaan Swasta & BUMN\n• Instansi Pemerintah\n• Freelancer & Ilustrator\n• Mahasiswa Desain"
        },
        {
          key_resources: "• Platform web (React, Laravel REST API)\n• Hak Paten Watermarking Engine\n• Server Cloud GCP & Database Cloud SQL\n• Algoritma Deteksi AI Duplikasi\n• Tim Moderator & Developer",
          channels: "• Portal Desaine.id\n• Integrasi Widget (Embed Portfolio)\n• Social Media Marketing (Instagram, TikTok)\n• Google SEO & Ads\n• Partnership Event Kampus",
          cost_structure: "• Biaya Sewa Server GCP & Redis Cloud (~Rp 45jt/bln)\n• Gaji Tim Inti & Moderator Kurasi\n• Biaya API Pihak Ketiga (Gemini AI, Cloudinary)\n• Marketing & Sponsorship Event Desain",
          revenue_streams: "• Komisi Penjualan Marketplace (5% - 15%)\n• Membership Subscription (Pro: Rp149rb, Business: Rp499rb)\n• Escrow & Custom Design Service Fee (3%)\n• Iklan Banner & Featured Products\n• Komisi Penjualan Kelas & Workshop Online"
        }
      ]
    }
  },
  {
    id: "doc_02",
    title: "2. Lean Canvas",
    category: "Bisnis",
    description: "Fokus pada problem-solution fit, key metrics, dan unfair advantage dari Desaine.",
    content: "Lean Canvas memfokuskan Desaine pada penyelesaian masalah nyata yang dihadapi freelancer lokal dalam bertransaksi produk digital secara aman dan profesional.",
    visualData: {
      problem: "• 1. Freelancer lokal kesulitan menarik dana (withdraw) dari marketplace luar (Fiverr, Envato) karena kendala PayPal & potongan tinggi.\n• 2. UMKM kesulitan mencari desain berkualitas lokal dengan harga rupiah bersahabat.\n• 3. Tingginya plagiarisme dan pencurian karya desain tanpa royalti.\n• 4. Sulitnya mengurus kontrak & invoice resmi bagi instansi pemerintah.",
      solution: "• 1. Platform lokal terintegrasi E-wallet & Bank Indonesia terkemuka.\n• 2. AI Copilot untuk penulisan copywriting & rekomendasi harga otomatis.\n• 3. Sistem Watermarking digital unik & enkripsi ZIP aman.\n• 4. Pembayaran escrow otomatis dengan invoice legal berekstensi PPN.",
      key_metrics: "• Monthly Active Users (MAU)\n• Gross Merchandise Value (GMV) per bulan\n• Angka retensi desainer (Seller Retention)\n• Rata-rata waktu penyelesaian Custom Order",
      unfair_advantage: "• 1. Kemitraan strategis dengan Asosiasi Desainer Grafis Indonesia (ADGI) untuk kurasi standar industri.\n• 2. Algoritma AI Copyright Detection bertenaga Gemini yang memindai kesamaan visual aset secara real-time.",
      high_level_concept: "Gabungan Envato Market + Fiverr dengan kearifan lokal sistem pembayaran Indonesia & AI Copilot."
    }
  },
  {
    id: "doc_03",
    title: "3. Value Proposition Canvas",
    category: "Bisnis",
    description: "Memetakan profil pelanggan (desainer & pembeli) dengan nilai tawar unik platform.",
    content: "Value Proposition Canvas ini menganalisis relasi mendalam antara 'Jobs to be Done' dengan solusi inovatif yang ditawarkan oleh Desaine.",
    visualData: {
      buyer: {
        jobs: "• Mendapatkan aset visual berkualitas tinggi untuk promosi UMKM.\n• Membuat revisi custom desain dengan rasa aman (biaya tidak dibawa kabur desainer).\n• Mempertanggungjawabkan invoice pembelian ke bagian keuangan perusahaan.",
        pains: "• Kualitas aset jelek setelah didownload.\n• Desainer menghilang setelah dibayar (scam).\n• Lisensi tidak jelas dan terancam tuntutan hak cipta.",
        gains: "• Kecepatan promosi karena template instan.\n• Escrow menjamin dana aman hingga serah terima final.\n• Kejelasan lisensi komersial bersertifikasi legal."
      },
      seller: {
        jobs: "• Menjual hasil karya desain untuk menambah pemasukan.\n• Membangun kredibilitas portofolio online.\n• Mengikuti kontes berhadiah besar.",
        pains: "• Biaya potongan platform luar terlalu besar (hingga 20% + biaya transfer).\n• Karya dibajak dan didistribusikan ulang gratis di grup ilegal.\n• Kesulitan merancang copywriting deskripsi produk.",
        gains: "• Penarikan instan ke e-wallet (GoPay, OVO, Dana) & Bank Lokal.\n• AI Writer otomatis mempermudah upload produk.\n• Proteksi file dengan enkripsi tautan kedaluwarsa (secure download links)."
      }
    }
  },
  {
    id: "doc_04",
    title: "4. SWOT Analysis",
    category: "Bisnis",
    description: "Analisis kekuatan, kelemahan, peluang, dan ancaman kompetitif platform.",
    content: "Sebagai platform baru, Desaine memanfaatkan teknologi AI tercanggih dan lokalisasi pembayaran sebagai senjata utama melawan raksasa global.",
    visualData: [
      { type: "Strengths (Kekuatan)", items: ["Sistem pembayaran instan QRIS dan Virtual Account tanpa kartu kredit.", "AI Copilot bawaan untuk optimasi SEO produk dan rekomendasi harga.", "Sistem Escrow otomatis untuk proteksi transaksi Custom Order.", "Fitur sertifikasi desainer berstandar nasional."] },
      { type: "Weaknesses (Kelemahan)", items: ["Brand awareness awal masih rendah dibanding Creative Market atau Envato.", "Ketergantungan awal pada infrastruktur cloud server eksternal.", "Kurva pembelajaran kurator desainer lokal dalam mendeteksi plagiat visual."] },
      { type: "Opportunities (Peluang)", items: ["Pertumbuhan digitalisasi UMKM Indonesia yang masif (>64 juta UMKM memerlukan konten promosi).", "Kampanye bangga buatan Indonesia meningkatkan preferensi produk lokal.", "Instansi pemerintah mulai beralih menggunakan e-katalog untuk pengadaan jasa kreatif."] },
      { type: "Threats (Ancaman)", items: ["Perang harga aset murah di grup-grup sosial media ilegal.", "Munculnya tool AI generator gratis (Midjourney, Canva Magic Studio) yang membuat user awam enggan membeli template.", "Perubahan regulasi pajak digital pemerintah."] }
    ]
  },
  {
    id: "doc_05",
    title: "5. Porter Five Forces",
    category: "Bisnis",
    description: "Analisis daya tawar industri dan intensitas persaingan pasar desain.",
    content: "Evaluasi strategis menunjukkan tingkat daya tarik pasar Desaine berada pada level 'Sangat Menjanjikan' karena lokalisasi kustomisasi produk.",
    visualData: {
      threat_new_entrants: { level: "Medium", desc: "Membangun marketplace memerlukan kepercayaan (trust) dan ekosistem escrow yang rumit sehingga menghalangi pemain kecil instan." },
      bargaining_power_suppliers: { level: "Low-Medium", desc: "Desainer lokal memiliki alternatif global, namun mereka sangat menyukai Desaine karena potongan komisi kecil (hanya 5%-8% dibanding 20% luar negeri) dan kemudahan penarikan rupiah." },
      bargaining_power_buyers: { level: "High", desc: "Pembeli memiliki banyak pilihan gratis di internet. Desaine mengatasinya dengan menawarkan garansi kualitas dan file source terlengkap (.fig, .ai, .psd) yang tidak disediakan platform gratis." },
      threat_substitutes: { level: "Medium-High", desc: "Tool generator instan. Kami ubah ancaman ini dengan mengintegrasikan AI sebagai asisten (Copilot), bukan menggantikan peran desainer profesional." },
      industry_rivalry: { level: "High", desc: "Pemain global seperti Canva, Envato, dan Creative Market sangat mendominasi. Desaine mengambil ceruk pasar spesifik lokalisasi UMKM Indonesia dan pengerjaan Custom Order lokal." }
    }
  },
  {
    id: "doc_06",
    title: "6. User Persona",
    category: "UX & UI",
    description: "Representasi target pengguna utama Desaine (Desainer & UMKM).",
    content: "Kami memetakan dua tipe pengguna utama untuk memastikan antarmuka Desaine ramah bagi kreator pemula maupun pemilik bisnis non-teknis.",
    visualData: [
      {
        role: "Kreator (Seller Persona)",
        name: "Aris Munandar (24 Tahun)",
        bio: "Seorang fresh graduate desain komunikasi visual (DKV) dari Bandung yang bekerja sebagai freelancer. Sering mendapat kendala pencairan dana dari luar negeri.",
        goals: ["Mendapatkan penghasilan bulanan stabil dari penjualan pasif (passive income) template poster.", "Membangun reputasi portofolio agar bisa direkrut oleh klien korporasi besar."],
        frustrations: ["Potongan fee platform luar terlalu besar.", "Proses upload aset rumit dan harus menulis deskripsi bahasa inggris yang kaku."]
      },
      {
        role: "Pembeli (Buyer Persona)",
        name: "Dewi Lestari (32 Tahun)",
        bio: "Pemilik usaha kuliner kripik pedas lokal di Yogyakarta. Mengelola akun Instagram bisnis sendiri namun tidak memiliki keahlian mendesain dari nol.",
        goals: ["Mendapatkan template feed sosial media yang modern, kekinian, tinggal ganti foto dan teks.", "Menemukan desainer lokal untuk custom desain kemasan box produk."],
        frustrations: ["Membeli di platform luar harganya mahal dalam kurs Dollar.", "Kesulitan mentransfer uang karena tidak memiliki kartu kredit."]
      }
    ]
  },
  {
    id: "doc_07",
    title: "7. User Journey Map",
    category: "UX & UI",
    description: "Perjalanan pengguna dari menemukan platform hingga berhasil bertransaksi.",
    content: "User Journey dirancang mulus (frictionless) dengan minim klik menuju checkout produk.",
    visualData: {
      stages: [
        { name: "1. Penemuan", actions: "Melihat postingan Instagram Desaine tentang 'SaaS UI Kit Lokal'.", thoughts: "Wah, ini yang saya butuhkan untuk proyek web fintech saya.", emotion: "Tertarik" },
        { name: "2. Eksplorasi", actions: "Mengunjungi website, mencari kategori UI Kit, menggunakan fitur live search.", thoughts: "Webnya cepat, ada filter spesifik software figma.", emotion: "Senang" },
        { name: "3. Evaluasi", actions: "Membuka halaman detail, memeriksa lisensi, menguji demo visual watermark.", thoughts: "Apakah aman? Ada garansi refund escrow jika file rusak.", emotion: "Yakin" },
        { name: "4. Pembelian", actions: "Klik Checkout, memilih pembayaran QRIS, memindai barcode via GoPay.", thoughts: "Instan! Pembayaran langsung terverifikasi tanpa upload struk.", emotion: "Sangat Puas" },
        { name: "5. Unduhan", actions: "Mengunduh file ZIP dari halaman invoice dengan tautan aman.", thoughts: "Tautan kedaluwarsa otomatis demi keamanan karya desainer.", emotion: "Lega" }
      ]
    }
  },
  {
    id: "doc_08",
    title: "8. Sitemap",
    category: "UX & UI",
    description: "Struktur navigasi halaman utama dan sub-halaman Desaine.",
    content: "Arsitektur sitemap disusun hierarkis dengan pemisahan peran yang tegas namun mudah dinavigasikan melalui Role Switcher.",
    visualData: {
      root: "DESAINE (desaine.id)",
      nodes: [
        { title: "Beranda / Landing Page", subs: ["Banner Hero", "Kategori Pilihan", "Produk Terlaris", "Daftar Kontes Terpopuler", "Testimoni"] },
        { title: "Marketplace / Katalog Produk", subs: ["Pencarian & Autocomplete", "Filter Sidebar (Lisensi, Harga, Software)", "Detail Produk (Preview, Ulasan, Changelog)"] },
        { title: "Custom Order Hub", subs: ["Daftar Proyek Klien", "Kirim Proposal Proyek", "Sistem Kelola Milestone Escrow", "Ruang Obrolan & Pengiriman File Final"] },
        { title: "Komunitas Kreatif", subs: ["Forum Diskusi", "Blog Edukasi Tren", "Halaman Sayembara / Kontes"] },
        { title: "Dashboard Kreator (Seller)", subs: ["Statistik Grafik Keuangan", "Form Upload Produk (AI-Powered)", "Manajemen Produk", "Penarikan Saldo (Withdraw)"] },
        { title: "Portal Admin (Management)", subs: ["Moderasi Kurasi Produk", "Verifikasi Desainer Baru", "Manajemen Tarik Dana (Withdraw)", "Audit Log Sistem"] },
        { title: "Developer & Spec Portal (Dokumentasi)", subs: ["30 Modul SRS & Bisnis", "Model ERD 80+ Tabel", "API Explorer Mock", "Deployment Guide"] }
      ]
    }
  },
  {
    id: "doc_09",
    title: "9. Information Architecture",
    category: "UX & UI",
    description: "Hubungan aliran informasi dan pembagian metadata konten.",
    content: "Sistem IA memastikan metadata seperti software (.fig, .psd), format file, lisensi, dan tag SEO selalu terindeks secara konsisten.",
    visualData: {
      product_card: ["Thumbnail Preview", "Judul & Kategori", "Ikon Software Pendukung", "Rating (Bintang)", "Harga Asli vs Diskon", "Nama Desainer & Badge Keanggotaan"],
      detail_page: ["Galeri Gambar Preview (Carousel)", "Panel Beli Samping (License Selector, Price, Button)", "Spesifikasi Teknis (Software, File Size, Formats, Release)", "Deskripsi Lengkap & Changelog Versi", "Tab Review Pelanggan (Verified Purchase)"]
    }
  },
  {
    id: "doc_10",
    title: "10. Wireframe Concepts",
    category: "UX & UI",
    description: "Sketsa tata letak layout komponen utama sebelum penerapan gaya visual.",
    content: "Kami menerapkan prinsip bento-grid pada bagian atas dashboard dan layout split 70:30 pada halaman produk detail.",
    visualData: {
      dashboard_grid: "[ Bento Box 1: Saldo & Withdraw (Lebar 2/3) ] [ Bento Box 2: Total Orderan (Lebar 1/3) ]\n[ Bento Box 3: Grafik Penjualan (Lebar 3/3) ]",
      detail_page_layout: "Kiri (70%): Gambar Preview Besar -> Tab Deskripsi -> Tab Review -> Tab Changelog\nKanan (30%): Kotak Pembelian -> Pemilihan Lisensi -> Tombol Beli QRIS -> Tombol Hubungi Desainer"
    }
  },
  {
    id: "doc_11",
    title: "11. High Fidelity UI Guide",
    category: "UX & UI",
    description: "Spesifikasi visual tingkat tinggi, efek kaca (glassmorphism), dan mikro-interaksi.",
    content: "Desain visual Desaine mengusung konsep 'Premium Futuristic' dengan perpaduan warna yang elegan, transparansi backdrop blur, serta sudut rounded yang bersahabat.",
    visualData: {
      styling_tokens: {
        background: "Off-white Slate (#F8FAFC)",
        dark_background: "Deep Charcoal (#0F172A)",
        glassmorphism: "bg-white/70 backdrop-blur-md border border-white/20 shadow-xl",
        primary_accent: "Emerald Green (#10B981) - melambangkan pertumbuhan ekonomi lokal.",
        secondary_accent: "Indigo Violet (#6366F1) - melambangkan kreativitas & teknologi."
      }
    }
  },
  {
    id: "doc_12",
    title: "12. Design System",
    category: "UX & UI",
    description: "Kamus token desain, tipografi, grid, dan komponen interaktif.",
    content: "Mengadaptasi Google Material Design 3 dengan kombinasi Tailwind CSS v4 terbaru.",
    visualData: {
      typography: {
        display: "Inter / Space Grotesk - 32px - Bold (Tracking Tight)",
        heading: "Inter - 20px - SemiBold",
        body: "Inter - 14px - Regular (Line-height 1.6)",
        mono: "JetBrains Mono - 12px - Medium (Untuk metadata & status log)"
      },
      buttons: {
        primary: "bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-xl transition-all active:scale-95",
        secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3 rounded-xl border border-slate-200",
        glass: "bg-white/40 hover:bg-white/60 backdrop-blur border border-white/20 rounded-xl px-4 py-2"
      }
    }
  },
  {
    id: "doc_13",
    title: "13. Use Case Diagram",
    category: "Sistem & UML",
    description: "Pemetaan fungsionalitas aktor utama (Buyer, Seller, Admin, AI Engine).",
    content: "Menjabarkan batas-batas sistem Desaine dan interaksi aktor luar dengan proses bisnis inti.",
    visualData: {
      actors: ["Pembeli (Buyer)", "Desainer (Seller)", "Administrator", "Sistem AI Engine"],
      use_cases: [
        "Buyer: Mencari Produk -> Checkout Produk -> Verifikasi Bayar -> Unduh File -> Review Rating",
        "Buyer: Posting Custom Project -> Seleksi Proposal -> Kirim Dana Escrow -> Unduh File Final -> Rilis Milestone",
        "Seller: Upload Produk (AI-Generated Copy) -> Lihat Dashboard Grafik -> Tarik Saldo Ke E-wallet",
        "Admin: Verifikasi Produk Pending -> Moderasi Laporan -> Approve Tarik Saldo -> Pantau Audit Logs",
        "AI Engine: Deteksi Plagiasi -> Generate Deskripsi SEO -> Rekomendasi Harga Pasar"
      ]
    }
  },
  {
    id: "doc_14",
    title: "14. Activity Diagram",
    category: "Sistem & UML",
    description: "Alur kerja aktivitas proses order custom dari awal hingga rilis dana escrow.",
    content: "Diagram aktivitas ini menggambarkan sinkronisasi antara aksi pembeli, desainer, dan sistem escrow.",
    visualData: {
      steps: [
        "1. Klien memposting rincian proyek dengan anggaran.",
        "2. Sistem mendistribusikan proyek ke feed Custom Order.",
        "3. Desainer mengirimkan proposal berisi harga dan lama pengerjaan.",
        "4. Klien memilih proposal terbaik dan mentransfer dana milestone ke rekening escrow.",
        "5. Sistem menahan dana (status: FUNDED) dan menotifikasi desainer.",
        "6. Desainer mengerjakan proyek, mengirim file pratinjau (watermarked).",
        "7. Klien menyetujui hasil final.",
        "8. Dana dirilis ke dompet desainer (status: RELEASED), platform memotong komisi 5%."
      ]
    }
  },
  {
    id: "doc_15",
    title: "15. Sequence Diagram",
    category: "Sistem & UML",
    description: "Interaksi objek terurut waktu pada proses checkout dengan Payment Gateway.",
    content: "Menunjukkan urutan pemanggilan API antara Frontend Next.js, Backend Laravel, dan Payment Gateway Midtrans.",
    visualData: {
      sequence: [
        "Frontend -> Backend: POST /api/payment/checkout {productId, licenseType}",
        "Backend -> Backend: Validasi harga produk & buat order dengan status PENDING",
        "Backend -> Midtrans API: Request Snap Token Pembayaran",
        "Midtrans API -> Backend: Return Snap Token & URL Transaksi",
        "Backend -> Frontend: Respons snapToken",
        "Frontend -> User: Tampilkan popup widget pembayaran QRIS / Virtual Account",
        "User -> Midtrans: Melakukan pembayaran sukses",
        "Midtrans -> Backend (Webhook): Notifikasi pembayaran sukses (settlement)",
        "Backend -> Backend: Ubah status order AKTIF, isi saldo seller, aktifkan tautan download",
        "Backend -> Frontend (Websocket): Push notifikasi sukses",
        "Frontend -> User: Alihkan ke halaman invoice & aktifkan tombol download"
      ]
    }
  },
  {
    id: "doc_16",
    title: "16. Class Diagram",
    category: "Sistem & UML",
    description: "Struktur kelas sistem backend, relasi, enkapsulasi, dan tipe data.",
    content: "Rancangan arsitektur object-oriented programming (OOP) di backend Desaine.",
    visualData: {
      classes: [
        { name: "User", attributes: ["+id: UUID", "+name: string", "+email: string", "-password_hash: string", "+role: Enum", "+balance: Decimal"], methods: ["+register()", "+login()", "+updateProfile()", "+withdrawBalance()"] },
        { name: "Product", attributes: ["+id: UUID", "+title: string", "+price: Decimal", "+file_path: string", "+watermark_path: string", "+status: Enum"], methods: ["+create()", "+update()", "+delete()", "+generateWatermark()", "+getSecureDownloadUrl()"] },
        { name: "Order", attributes: ["+id: UUID", "+buyer_id: UUID", "+product_id: UUID", "+amount: Decimal", "+payment_status: Enum", "+license_type: Enum"], methods: ["+processPayment()", "+generateInvoice()", "+completeOrder()"] },
        { name: "EscrowTransaction", attributes: ["+id: UUID", "+project_id: UUID", "+milestone_id: UUID", "+held_amount: Decimal", "+status: Enum"], methods: ["+holdFunds()", "+releaseFunds()", "+refundToBuyer()"] }
      ]
    }
  },
  {
    id: "doc_17",
    title: "17. Entity Relationship Diagram (ERD)",
    category: "Basis Data",
    description: "Arsitektur database profesional berskala enterprise dengan relasi kompleks.",
    content: "Database Desaine dirancang untuk mendukung performa tinggi, audit keamanan, dan fleksibilitas bisnis. ERD mencakup lebih dari 80 tabel logis yang dinormalisasi hingga bentuk 3NF.",
    visualData: {
      key_tables: [
        { name: "1. Core Users Module (15 Tabel)", desc: "users, user_profiles, user_addresses, user_documents (KTP/KYC), oauth_accounts, roles, permissions, role_user, session_tokens, password_resets, user_devices, user_preferences, user_ratings, followers, blocks." },
        { name: "2. Core Products Module (18 Tabel)", desc: "products, product_details, categories, product_category, tags, product_tag, product_previews, product_files, license_types, product_licenses, product_reviews, review_helpful, product_changelogs, product_versions, product_favorites, wishlists, flash_sales, flash_sale_product." },
        { name: "3. Transactions & Escrow Module (15 Tabel)", desc: "orders, order_items, order_licenses, payment_transactions, escrow_accounts, escrow_ledgers, dispute_logs, refunds, invoice_records, seller_balances, wallet_ledgers, withdraw_requests, platform_revenues, affiliate_referrals, referral_payouts." },
        { name: "4. Custom Projects Module (12 Tabel)", desc: "custom_projects, custom_project_categories, project_proposals, proposal_attachments, project_milestones, escrow_milestone_funds, work_deliveries, delivery_revisions, delivery_reviews, project_chats, project_disputes, project_audit_logs." },
        { name: "5. AI & Analytics Module (10 Tabel)", desc: "ai_generation_logs, ai_copyright_scans, ai_pricing_recommendations, analytics_visitors, product_view_logs, conversion_rates, search_keywords, typo_dictionary, search_clicks, user_activity_logs." },
        { name: "6. CMS & Community Module (12 Tabel)", desc: "blog_posts, blog_categories, blog_comments, blog_likes, forum_topics, forum_categories, forum_posts, forum_post_likes, banners, system_notifications, support_tickets, ticket_replies." }
      ],
      relationships: "• users.id 1:M products.seller_id\n• products.id 1:M product_previews.product_id\n• users.id 1:M orders.buyer_id\n• custom_projects.id 1:M project_milestones.project_id\n• escrow_accounts.id 1:1 escrow_ledgers.escrow_id"
    }
  },
  {
    id: "doc_18",
    title: "18. Data Flow Diagram (DFD)",
    category: "Sistem & UML",
    description: "Aliran data level 0 (Context Diagram) dan level 1 sistem Desaine.",
    content: "DFD menjamin transparansi bagaimana data pengguna diproses dari frontend ke backend hingga sistem eksternal (Payment Gateway & S3).",
    visualData: {
      context_diagram: "[ Pembeli ] -> Data Registrasi & Transaksi -> ( Sistem Desaine.id ) -> Token Pembayaran QRIS -> [ Midtrans API ]\n[ Desainer ] -> File ZIP & Preview -> ( Sistem Desaine.id ) -> Enkripsi File -> [ Cloud Storage S3 / Supabase ]",
      dfd_level_1: "Proses 1.0 (Auth) -> Simpan ke DB Users\nProses 2.0 (Upload) -> Verifikasi AI Plagiat -> Simpan File ke S3 -> Data Metadata ke DB Products\nProses 3.0 (Checkout) -> Generate Invoice -> Simpan ke DB Transaksi"
    }
  },
  {
    id: "doc_19",
    title: "19. Flowchart Sistem",
    category: "Sistem & UML",
    description: "Flowchart logika upload produk digital dengan proteksi watermark otomatis.",
    content: "Menunjukkan logika backend dalam mengamankan hak cipta produk desainer sebelum diterbitkan di marketplace.",
    visualData: {
      steps: [
        "Mulai -> Desainer upload file Gambar Utama & file ZIP",
        "Apakah file berformat gambar (.png, .jpg)?",
        "YA: Kirim ke Watermark Engine -> Tambahkan logo transparan 'Desaine.id' -> Simpan sebagai file Preview",
        "TIDAK: (Misal file Figma / PSD) -> Buat render thumbnail otomatis -> Simpan Preview",
        "Kirim File ZIP utama ke direktori S3 terenkripsi (private bucket)",
        "Jalankan AI Duplication Checker -> Apakah lolos uji kemiripan < 80%?",
        "YA: Status produk AKTIF dan langsung tampil di katalog",
        "TIDAK: Status produk PENDING -> Kirim ke antrean kurator admin -> Selesai"
      ]
    }
  },
  {
    id: "doc_20",
    title: "20. API Documentation (REST API Specs)",
    category: "API & Koding",
    description: "Spesifikasi endpoint REST API lengkap dengan request/response schema.",
    content: "Daftar API inti berekstensi JSON yang digunakan untuk komunikasi frontend-backend.",
    visualData: [
      { method: "POST", path: "/api/auth/login", desc: "Mengotentikasi user, mengembalikan JWT token & cookie refresh token.", body: "{ email, password }", response: "{ status: 'success', token: 'eyJhb...', user: {...} }" },
      { method: "GET", path: "/api/products", desc: "Mencari produk dengan filter pencarian cepat (autocomplete).", query: "?category=UI%20Kit&search=dashboard", response: "{ data: [...products], total: 142 }" },
      { method: "POST", path: "/api/ai/copilot", desc: "Interaksi dengan server-side Gemini AI untuk optimasi SEO produk.", body: "{ prompt, type: 'seo_tags' }", response: "{ status: 'success', suggestions: ['Figma', 'UI Kit', 'Dashboard'] }" },
      { method: "GET", path: "/api/download/:productId", desc: "Membuat tautan unduhan aman berekstensi tanda tangan waktu (expired link).", response: "Meredireksi ke tautan unduhan bertanda tangan S3 presigned URL (berlaku 5 menit)" }
    ]
  },
  {
    id: "doc_21",
    title: "21. Database Schema (DDL Migration)",
    category: "Basis Data",
    description: "Representasi skema DDL relasional utama dan indexing strategis.",
    content: "Skema DDL dirancang menggunakan Drizzle/Eloquent dengan indeks performa tinggi pada kolom pencarian dan foreign key.",
    visualData: {
      indexes: [
        "CREATE INDEX idx_products_category ON products(category);",
        "CREATE INDEX idx_orders_buyer_status ON orders(buyer_id, payment_status);",
        "CREATE INDEX idx_custom_projects_status ON custom_projects(status);"
      ],
      ddl_example: "CREATE TABLE products (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  title VARCHAR(255) NOT NULL,\n  description TEXT,\n  price NUMERIC(12, 2) NOT NULL,\n  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,\n  file_path VARCHAR(512) NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);"
    }
  },
  {
    id: "doc_22",
    title: "22. Folder Structure",
    category: "API & Koding",
    description: "Arsitektur struktur folder terorganisir untuk Laravel 12 & Next.js.",
    content: "Pemisahan Concerns yang tegas memudahkan tim DevOps dan Developer bekerja secara paralel.",
    visualData: {
      backend_laravel: "app/\n├── Http/ (Controllers, Middlewares)\n├── Models/ (User, Product, Order, etc.)\n├── Repositories/ (Repository Pattern interfaces)\n├── Services/ (Business logic handlers)\n└── Database/ (Migrations, Seeders)\nroutes/api.php (REST API routes)",
      frontend_nextjs: "src/\n├── components/ (Re-usable UI components, Bento cards)\n├── data/ (Mock database data & docs)\n├── App.tsx (SPA entry with client-side router)\n├── types.ts (Data contracts)\n└── index.css (Tailwind 4 configurations)"
    }
  },
  {
    id: "doc_23",
    title: "23. Coding Standard",
    category: "API & Koding",
    description: "Prinsip clean code, aturan ESLint, dan arsitektur SOLID.",
    content: "Tim Desaine wajib menaati standar penulisan kode demi kemudahan perluasan sistem di masa depan.",
    visualData: {
      principles: [
        "S - Single Responsibility: Satu service class hanya menghandle satu tugas bisnis (misal: EscrowService).",
        "O - Open/Closed: Memperluas fitur pembayaran melalui modul gateway interface tanpa merusak kode utama.",
        "L - Liskov Substitution: Kelas turunan (misal: PremiumUser) harus bisa menggantikan kelas induk (User).",
        "I - Interface Segregation: Client-side tidak boleh dipaksa mengimpor method API yang tidak digunakan.",
        "D - Dependency Inversion: Controller bergantung pada interfaces Repository, bukan langsung pada Model DB."
      ]
    }
  },
  {
    id: "doc_24",
    title: "24. Deployment & DevOps Guide",
    category: "Panduan & Manual",
    description: "Petunjuk kontainerisasi Docker, Nginx, SSL, dan deployment GCP Cloud Run.",
    content: "Platform Desaine menggunakan infrastruktur berbasis kontainer mikro untuk menjamin skalabilitas tinggi saat terjadi lonjakan traffic flash-sale.",
    visualData: {
      dockerfile: "FROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\nEXPOSE 3000\nCMD [\"node\", \"dist/server.cjs\"]",
      cicd_pipeline: "GitHub Actions -> Run Lint & Tests -> Build Docker Image -> Push to GCP Artifact Registry -> Deploy to Cloud Run"
    }
  },
  {
    id: "doc_25",
    title: "25. Testing Strategy",
    category: "API & Koding",
    description: "Skema Unit, Integration, dan End-to-End Testing.",
    content: "Setiap fungsionalitas kritis diuji secara berkala menggunakan PHPUnit (backend) dan Vitest/Playwright (frontend).",
    visualData: {
      scenarios: [
        "Unit Test: Memastikan perhitungan bagi hasil royalti seller terpotong komisi platform secara presisi (e.g. 100.000 - 8% = 92.000).",
        "Integration Test: Melakukan checkout produk digital -> generate invoice -> simpan status transaksi.",
        "Security Test: Mengirimkan payload malicious javascript (<script>) untuk memastikan filter anti-XSS berjalan."
      ]
    }
  },
  {
    id: "doc_26",
    title: "26. Security Hardening Checklist",
    category: "Panduan & Manual",
    description: "Audit keamanan sistem, pertahanan XSS, CSRF, JWT, dan SQLi.",
    content: "Keamanan finansial dan kepemilikan hak cipta adalah aset terpenting Desaine.",
    visualData: [
      { area: "Otentikasi", rules: ["JWT token disimpan di HTTP-only Cookie untuk mencegah pembajakan via script XSS.", "Password dienkripsi menggunakan bcrypt dengan work-factor minimal 12."] },
      { area: "Input Sanitization", rules: ["Semua SQL Query di backend wajib menggunakan Parameterized Prepared Statements via ORM.", "Gunakan Helmet middleware di Express / anti-XSS di Laravel Laravel-Purifier."] },
      { area: "API Protection", rules: ["Pembatasan lalu lintas (Rate Limiting) maksimal 60 request per menit per alamat IP.", "Verifikasi token berekstensi masa kedaluwarsa pendek (AccessToken 15 menit, RefreshToken 7 hari)."] }
    ]
  },
  {
    id: "doc_27",
    title: "27. Manual Book",
    category: "Panduan & Manual",
    description: "Buku panduan operasional platform untuk tim internal dan operasional CS.",
    content: "Menjelaskan cara menguji fungsionalitas platform pada server lokal dan memeriksa kesehatan server.",
    visualData: {
      start_steps: [
        "1. Kloning repositori kode dari server git.",
        "2. Buat file .env dari duplikasi .env.example lalu masukkan GEMINI_API_KEY.",
        "3. Jalankan 'npm install' untuk memuat seluruh library pendukung.",
        "4. Jalankan 'npm run dev' untuk memicu dev server full-stack di port 3000.",
        "5. Buka alamat browser http://localhost:3000 untuk berinteraksi langsung."
      ]
    }
  },
  {
    id: "doc_28",
    title: "28. Administrator Guide",
    category: "Panduan & Manual",
    description: "Petunjuk penggunaan Dashboard Admin untuk kurasi produk dan moderasi keuangan.",
    content: "Panduan teknis bagi administrator dalam mengontrol kualitas aset marketplace.",
    visualData: {
      admin_tasks: [
        "Verifikasi Produk: Masuk ke Tab 'Moderation' -> Klik detail aset pending -> Periksa pratinjau gambar -> Klik Setujui (Approve) atau Tolak (Reject) disertai alasan.",
        "Withdrawal: Masuk ke Tab 'Withdrawal Management' -> Verifikasi kesesuaian saldo dompet seller -> Klik Approve untuk memicu transfer instan via API Midtrans payout."
      ]
    }
  },
  {
    id: "doc_29",
    title: "29. User & Seller Guide",
    category: "Panduan & Manual",
    description: "Panduan onboarding sukses bagi desainer untuk mulai menghasilkan rupiah.",
    content: "Panduan taktis bagi desainer lokal agar produknya laris manis terjual di Desaine.",
    visualData: {
      tips: [
        "1. Gunakan 'AI SEO Copilot' saat mengupload produk untuk mendapatkan judul deskripsi paling dicari pelanggan.",
        "2. Sediakan preview gambar berukuran minimal 1200x800px dengan aspek rasio 3:2.",
        "3. Tautkan akun portofolio Dribbble & Behance Anda di profile agar lolos verifikasi 'Verified Professional Designer'."
      ]
    }
  },
  {
    id: "doc_30",
    title: "30. Technical Architecture Spec",
    category: "Sistem & UML",
    description: "Arsitektur cloud hybrid global dengan caching Redis dan database multi-region.",
    content: "Desaine menggunakan pendekatan arsitektur tangguh berbasis mikro (Microservices Ready) untuk memastikan stabilitas transaksi tinggi.",
    visualData: {
      tech_stack: {
        frontend: "Next.js 14, React 19, Tailwind CSS v4, Framer Motion, Recharts",
        backend: "Laravel 12 (Core Service), Node.js Express (AI Copilot & Real-time WebSockets)",
        caching: "Redis Cache (Session & Catalog caching, 50x lebih cepat dibanding DB direct lookup)",
        cloud: "GCP (Cloud Run, Cloud SQL PostgreSQL, Cloud Storage, Cloud Pub/Sub)"
      }
    }
  }
];
