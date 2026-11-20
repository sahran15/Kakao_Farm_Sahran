

function sahran_muatkan_pilihan_lahan() {
    const pilihan = document.getElementById("sahran_nama_lahan");

    if (!pilihan) return;

    const data_lahan = JSON.parse(
        localStorage.getItem("sahran_data_lahan")
    ) || [];

    pilihan.innerHTML = "";

    const opsi_awal = document.createElement("option");
    opsi_awal.value = "";
    opsi_awal.textContent = "-- Pilih Nama Lahan --";
    pilihan.appendChild(opsi_awal);

    data_lahan.forEach((lahan) => {
        const opsi = document.createElement("option");
        opsi.value = lahan.nama;
        opsi.textContent = lahan.nama;
        pilihan.appendChild(opsi);
    });

    if (data_lahan.length === 0) {
        opsi_awal.textContent =
            "-- Tambahkan Data Lahan Terlebih Dahulu --";
    }
}

sahran_muatkan_pilihan_lahan();
