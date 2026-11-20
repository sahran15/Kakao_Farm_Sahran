// ======================================
// SISTEM CATATAN HASIL PANEN KAKAO
// KAKAO FARM - SAHRAN
// ======================================

// Data awal (contoh/simulasi)
const sahran_data_awal_panen = [
  {
    id: 1,
    lahan: "Kebun Sejahtera",
    tanggal: "2026-11-10",
    jumlah: 150,
    harga: 35000,
    kualitas: "Baik",
    keterangan: "Panen pertama",
  },
  {
    id: 2,
    lahan: "Kebun Makmur",
    tanggal: "2026-11-12",
    jumlah: 100,
    harga: 35000,
    kualitas: "Sangat Baik",
    keterangan: "Panen rutin",
  },
  {
    id: 3,
    lahan: "Kebun Subur",
    tanggal: "2026-11-15",
    jumlah: 125,
    harga: 35000,
    kualitas: "Baik",
    keterangan: "Panen rutin",
  },
];

// Mengambil data dari Local Storage
let sahran_data_panen = JSON.parse(localStorage.getItem("sahran_data_panen"));

if (!Array.isArray(sahran_data_panen)) {
  sahran_data_panen = sahran_data_awal_panen;
  sahran_simpan_panen();
}

// Fungsi menyimpan data
function sahran_simpan_panen() {
  localStorage.setItem("sahran_data_panen", JSON.stringify(sahran_data_panen));
}

// Format tanggal Indonesia
function sahran_format_tanggal_panen(tanggal) {
  return new Date(tanggal + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Format Rupiah
function sahran_format_rupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

// Menampilkan tabel hasil panen
function sahran_tampilkan_panen() {
  const tabel = document.getElementById("sahran_daftar_panen");

  if (!tabel) return;

  tabel.innerHTML = "";

  sahran_data_panen.sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  sahran_data_panen.forEach((data, index) => {
    const pendapatan = data.jumlah * data.harga;

    const baris = document.createElement("tr");

    const nilai = [
      index + 1,
      data.lahan,
      sahran_format_tanggal_panen(data.tanggal),
      data.jumlah + " Kg",
      sahran_format_rupiah(data.harga),
      sahran_format_rupiah(pendapatan),
      data.kualitas,
      data.keterangan,
    ];

    nilai.forEach((teks) => {
      const kolom = document.createElement("td");
      kolom.textContent = teks;
      baris.appendChild(kolom);
    });

    // Tombol hapus
    const kolom_aksi = document.createElement("td");
    const tombol = document.createElement("button");

    tombol.textContent = "Hapus";
    tombol.type = "button";
    tombol.className = "sahran_hapus_panen";
    tombol.dataset.id = data.id;

    kolom_aksi.appendChild(tombol);
    baris.appendChild(kolom_aksi);

    tabel.appendChild(baris);
  });

  sahran_hitung_total_panen();
}

// Menghitung total panen dan pendapatan
function sahran_hitung_total_panen() {
  let total_kg = 0;
  let total_pendapatan = 0;

  sahran_data_panen.forEach((data) => {
    total_kg += Number(data.jumlah);
    total_pendapatan += Number(data.jumlah) * Number(data.harga);
  });

  document.getElementById("sahran_total_kg").textContent =
    total_kg.toLocaleString("id-ID") + " Kg";

  document.getElementById("sahran_total_pendapatan").textContent =
    sahran_format_rupiah(total_pendapatan);
}

// Form tambah hasil panen
const sahran_form_panen = document.getElementById("sahran_form_panen");

if (sahran_form_panen) {
  sahran_form_panen.addEventListener("submit", function (e) {
    e.preventDefault();

    const lahan = document.getElementById("sahran_nama_lahan").value.trim();

    const tanggal = document.getElementById("sahran_tanggal_panen").value;

    const jumlah = Number(document.getElementById("sahran_jumlah_panen").value);

    const harga = Number(document.getElementById("sahran_harga_panen").value);

    const kualitas = document.getElementById("sahran_kualitas_panen").value;

    const keterangan =
      document.getElementById("sahran_keterangan_panen").value.trim() ||
      "Panen rutin";

    if (
      !lahan ||
      !tanggal ||
      !kualitas ||
      !Number.isFinite(jumlah) ||
      jumlah <= 0 ||
      !Number.isSafeInteger(harga) ||
      harga <= 0 ||
      !Number.isFinite(jumlah * harga) ||
      jumlah * harga > Number.MAX_SAFE_INTEGER
    ) {
      alert("Periksa kembali data yang dimasukkan!");
      return;
    }

    const data_baru = {
      id: Date.now(),
      lahan: lahan,
      tanggal: tanggal,
      jumlah: jumlah,
      harga: harga,
      kualitas: kualitas,
      keterangan: keterangan,
    };

    sahran_data_panen.push(data_baru);

    sahran_simpan_panen();
    sahran_tampilkan_panen();

    alert("Data hasil panen berhasil disimpan!");

    sahran_form_panen.reset();
  });
}

// Fungsi hapus data panen
const sahran_tabel_panen = document.getElementById("sahran_daftar_panen");

if (sahran_tabel_panen) {
  sahran_tabel_panen.addEventListener("click", function (e) {
    if (e.target.classList.contains("sahran_hapus_panen")) {
      const id = Number(e.target.dataset.id);

      if (confirm("Yakin ingin menghapus data panen ini?")) {
        sahran_data_panen = sahran_data_panen.filter((data) => data.id !== id);

        sahran_simpan_panen();
        sahran_tampilkan_panen();

        alert("Data berhasil dihapus!");
      }
    }
  });
}

// Tampilkan data ketika halaman dibuka
sahran_tampilkan_panen();
