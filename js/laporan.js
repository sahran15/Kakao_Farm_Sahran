
// SISTEM LAPORAN HASIL PANEN KAKAO

const sahran_bulan_input = document.getElementById("sahran_bulan_laporan");
const sahran_tabel_laporan = document.getElementById("sahran_tabel_laporan");

// Mengambil data dari halaman Hasil Panen
function sahran_ambil_data_laporan() {
    return JSON.parse(localStorage.getItem("sahran_data_panen")) || [];
}

// Format angka menjadi Rupiah
function sahran_rupiah_laporan(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

// Format tanggal
function sahran_tanggal_laporan(tanggal) {
    return new Date(tanggal + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// Menampilkan laporan sesuai bulan
function sahran_tampilkan_laporan() {
    const bulan_dipilih = sahran_bulan_input.value;
    const semua_data = sahran_ambil_data_laporan();

    const data_bulanan = semua_data.filter(data =>
        data.tanggal && data.tanggal.startsWith(bulan_dipilih)
    );

    sahran_tabel_laporan.innerHTML = "";

    let total_kg = 0;
    let total_pendapatan = 0;

    data_bulanan.sort((a, b) => a.tanggal.localeCompare(b.tanggal));

    data_bulanan.forEach((data, index) => {
        const pendapatan = Number(data.jumlah) * Number(data.harga);

        total_kg += Number(data.jumlah);
        total_pendapatan += pendapatan;

        const baris = document.createElement("tr");

        const isi = [
            index + 1,
            data.lahan,
            sahran_tanggal_laporan(data.tanggal),
            data.jumlah + " Kg",
            sahran_rupiah_laporan(data.harga),
            sahran_rupiah_laporan(pendapatan),
            data.kualitas,
            data.keterangan || "-"
        ];

        isi.forEach(teks => {
            const kolom = document.createElement("td");
            kolom.textContent = teks;
            baris.appendChild(kolom);
        });

        sahran_tabel_laporan.appendChild(baris);
    });

    document.getElementById("sahran_laporan_total_kg").textContent =
        total_kg.toLocaleString("id-ID") + " Kg";

    document.getElementById("sahran_laporan_total_rupiah").textContent =
        sahran_rupiah_laporan(total_pendapatan);

    const nama_bulan = bulan_dipilih
        ? new Date(bulan_dipilih + "-01T00:00:00").toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric"
        })
        : "";

    document.getElementById("sahran_judul_periode").textContent =
        "Rincian Hasil Panen - " + nama_bulan;

    document.getElementById("sahran_pesan_laporan").textContent =
        data_bulanan.length === 0
            ? "Belum ada data panen pada bulan ini."
            : "Jumlah catatan panen: " + data_bulanan.length;
}

// Mengikuti perubahan bulan
sahran_bulan_input.addEventListener("change", sahran_tampilkan_laporan);

// Tombol cetak
document.getElementById("sahran_cetak_laporan").addEventListener("click", function() {
    window.print();
});

// Mengatur bulan awal ke bulan sekarang
const sekarang = new Date();
sahran_bulan_input.value =
    sekarang.getFullYear() + "-" +
    String(sekarang.getMonth() + 1).padStart(2, "0");

// Tampilkan laporan pertama kali
sahran_tampilkan_laporan();
