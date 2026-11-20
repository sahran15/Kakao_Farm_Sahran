
// Mengambil elemen formulir dan tabel
const sahran_form_lahan = document.getElementById("sahran_form_lahan");
const sahran_daftar_lahan = document.getElementById("sahran_daftar_lahan");

// Mengambil data dari Local Storage
let sahran_data_lahan = JSON.parse(
    localStorage.getItem("sahran_data_lahan")
) || [];

let sahran_edit_index = -1;

// Menyimpan data ke Local Storage
function sahran_simpan_penyimpanan() {
    localStorage.setItem(
        "sahran_data_lahan",
        JSON.stringify(sahran_data_lahan)
    );
}

// Menampilkan data lahan ke tabel
function sahran_tampilkan_lahan() {
    sahran_daftar_lahan.innerHTML = "";

    if (sahran_data_lahan.length === 0) {
        sahran_daftar_lahan.innerHTML =
            '<tr><td colspan="8">Belum ada data lahan.</td></tr>';
        return;
    }

    sahran_data_lahan.forEach((lahan, index) => {
        const baris = document.createElement("tr");

        const data = [
            index + 1,
            lahan.nama,
            lahan.lokasi,
            lahan.luas + " ha",
            lahan.pohon,
            lahan.kondisi,
            lahan.catatan || "-"
        ];

        data.forEach((isi) => {
            const kolom = document.createElement("td");
            kolom.textContent = isi;
            baris.appendChild(kolom);
        });

        const kolom_aksi = document.createElement("td");

        const tombol_edit = document.createElement("button");
        tombol_edit.textContent = "Edit";
        tombol_edit.type = "button";
        tombol_edit.onclick = () => sahran_edit_lahan(index);

        const tombol_hapus = document.createElement("button");
        tombol_hapus.textContent = "Hapus";
        tombol_hapus.type = "button";
        tombol_hapus.onclick = () => sahran_hapus_lahan(index);

        kolom_aksi.appendChild(tombol_edit);
        kolom_aksi.appendChild(tombol_hapus);
        baris.appendChild(kolom_aksi);

        sahran_daftar_lahan.appendChild(baris);
    });
}

// Menambahkan dan memperbarui data
sahran_form_lahan.addEventListener("submit", function(event) {
    event.preventDefault();

    const nama = document.getElementById("sahran_nama_lahan").value.trim();
    const lokasi = document.getElementById("sahran_lokasi_lahan").value.trim();
    const luas = Number(document.getElementById("sahran_luas_lahan").value);
    const pohon = Number(document.getElementById("sahran_jumlah_pohon").value);
    const kondisi = document.getElementById("sahran_kondisi_lahan").value;
    const catatan = document.getElementById("sahran_catatan_lahan").value.trim();

    if (
        !nama ||
        !lokasi ||
        !Number.isFinite(luas) ||
        luas <= 0 ||
        !Number.isSafeInteger(pohon) ||
        pohon <= 0 ||
        !kondisi
    ) {
        alert("Mohon isi data lahan dengan benar!");
        return;
    }

    const data_baru = {
        nama,
        lokasi,
        luas,
        pohon,
        kondisi,
        catatan
    };

    if (sahran_edit_index === -1) {
        sahran_data_lahan.push(data_baru);
        alert("Data lahan berhasil disimpan!");
    } else {
        sahran_data_lahan[sahran_edit_index] = data_baru;
        alert("Data lahan berhasil diperbarui!");
        sahran_edit_index = -1;
    }

    sahran_simpan_penyimpanan();
    sahran_tampilkan_lahan();
    sahran_form_lahan.reset();
});

// Mengedit data
function sahran_edit_lahan(index) {
    const lahan = sahran_data_lahan[index];

    document.getElementById("sahran_nama_lahan").value = lahan.nama;
    document.getElementById("sahran_lokasi_lahan").value = lahan.lokasi;
    document.getElementById("sahran_luas_lahan").value = lahan.luas;
    document.getElementById("sahran_jumlah_pohon").value = lahan.pohon;
    document.getElementById("sahran_kondisi_lahan").value = lahan.kondisi;
    document.getElementById("sahran_catatan_lahan").value = lahan.catatan;

    sahran_edit_index = index;

    document.getElementById("sahran_nama_lahan").focus();
}

// Menghapus data
function sahran_hapus_lahan(index) {
    const konfirmasi = confirm("Yakin ingin menghapus data lahan ini?");

    if (konfirmasi) {
        sahran_data_lahan.splice(index, 1);
        sahran_simpan_penyimpanan();
        sahran_tampilkan_lahan();
        alert("Data lahan berhasil dihapus!");
    }
}

// Menampilkan data saat halaman dibuka
sahran_tampilkan_lahan();
