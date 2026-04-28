# Expense Tracker - Personal Project

Project ini adalah aplikasi pencatat pengeluaran harian pribadi yang dibangun dengan Next.js, Tailwind CSS, dan Supabase. Fokus utama adalah kemudahan penggunaan, privasi (fitur hide balance), dan efisiensi input.

## Tech Stack
- **Frontend**: Next.js (App Router), React 19, Tailwind CSS 4.
- **Backend/Database**: Supabase.
- **Icons**: Lucide React.
- **Typography**: Inter (Google Fonts).

## Fitur Utama

### 1. Authentication & Security
- **Simple Auth**: Menggunakan Supabase Auth (Email & Password).
- **Session Persistence**: Mengingat login pengguna.
- **PIN Protection**: Setelah login pertama kali, sesi berikutnya hanya memerlukan PIN sederhana untuk masuk. Terdapat opsi Logout atau Ganti Akun.

### 2. Budgeting & Balance
- **Monthly Budget**: Pengguna dapat mengatur jatah uang bulanan dan mengubahnya kapan saja.
- **Hidden Balance**: Di halaman Home, saldo sisa muncul di bagian atas namun tersembunyi secara default (masked). Dapat dimunculkan dengan klik icon eye.
- **Daily Spending**: Menampilkan total pengeluaran hari ini, juga dengan fitur hide/unhide.

### 3. Expense Input
- **Quick Input**: Form sederhana untuk memasukkan pengeluaran.
- **Fields**:
    - Nominal (Number)
    - Kategori (Dropdown/Select)
    - Catatan (Optional Text)
- **Kategori**:
    - Makanan
    - Transportasi
    - Tagihan
    - Pengeluaran Tak Terduga
    - Pacaran
    - Cafe/Nongkrong/Jajan

### 4. Recap & Analytics
- **Summary**: Fitur rekap pengeluaran yang bisa dilihat kapan saja (filter harian, mingguan, atau bulanan).
- **Visualization**: Grafik sederhana untuk melihat distribusi kategori pengeluaran (Optional/Future improvement).

## Interface Guidelines (UI/UX)

### Design System (Recommended by ui-ux-pro-max)
- **Style**: Modern Glassmorphism. Menggunakan efek blur, border halus, dan layer yang dalam.
- **Color Palette**:
    - **Primary**: `#18181B` (Slate 950)
    - **Background**: `#FAFAFA` (Zinc 50)
    - **Accent/CTA**: `#2563EB` (Blue 600)
    - **Success/Balance**: `#10B981` (Emerald 500)
    - **Danger/Expense**: `#EF4444` (Red 500)
- **Typography**: Inter (Sans-serif) untuk kesan bersih dan fungsional.
- **Components**:
    - **Cards**: Background putih dengan opasitas 80% (`bg-white/80`), backdrop blur, dan border tipis.
    - **Buttons**: Kontras tinggi untuk CTA, `cursor-pointer` pada semua elemen interaktif.
    - **Transitions**: Smooth transitions (150-300ms) untuk hover dan modal.

### Layout
- **Mobile First**: Desain dioptimalkan untuk penggunaan di smartphone.
- **Navigation**: Bottom navigation bar untuk akses cepat ke Home, Input, dan Recap.
- **Home Screen Hierarchy**:
    1. Greeting & Date.
    2. Card Saldo Sisa (Hidden by default).
    3. Card Pengeluaran Hari Ini (Hidden by default).
    4. Recent Transactions (3-5 terakhir).
    5. Floating Action Button (FAB) atau Bottom Tab untuk Input.

## Database Schema (Supabase)

### Table: `profiles`
Menyimpan data tambahan user.
- `id`: uuid (references auth.users) - Primary Key
- `pin`: text (hashed or simple string for local use)
- `monthly_budget`: numeric (default: 0)
- `updated_at`: timestamp

### Table: `expenses`
Menyimpan riwayat pengeluaran.
- `id`: uuid - Primary Key
- `user_id`: uuid (references auth.users)
- `amount`: numeric
- `category`: text (Enum: Makanan, Transportasi, Tagihan, etc.)
- `note`: text (optional)
- `created_at`: timestamp (default: now())

## Arahan Pengembangan untuk AI
1. Prioritaskan keamanan sesi (PIN logic).
2. Gunakan komponen Lucide React yang konsisten.
3. Pastikan fitur hide/unhide saldo bekerja secara reaktif di sisi client.
4. Gunakan Tailwind CSS 4 utility classes sesuai konfigurasi project.
