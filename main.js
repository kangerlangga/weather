// Function to fetch and populate dropdown
fetch('deskel.json')
    .then(response => response.json())
    .then(data => {
        const desaDropdown = document.getElementById('desa-dropdown');
        
        // Iterate over the data and add options to the dropdown
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.kode_desa_kelurahan;  // You can use any value like kode_desa_kelurahan
            option.textContent = item.nama_desa_kelurahan; // This will show the name of the desa
            desaDropdown.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading desa data:', error));

    dselect(document.querySelector('#desa-dropdown'));

// Ambil elemen dropdown
const desaDropdown = document.getElementById('desa-dropdown');

// Event listener ketika ada perubahan pilihan di dropdown
desaDropdown.addEventListener('change', function() {
    // Ambil value yang dipilih dari dropdown
    const selectedValue = desaDropdown.value;

    // Jika ada value yang dipilih
    if (selectedValue) {
        // Bangun URL dengan parameter
        const url = `https://kangerlangga.github.io/weather/?adm=${selectedValue}`;

        // Redirect ke URL yang dibangun
        window.location.href = url;
    }
});

// Ambil URL saat ini
const urlParams = new URLSearchParams(window.location.search);

// Ambil parameter tertentu
const adm = urlParams.get('adm');
console.log(adm);

document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${encodeURIComponent(adm)}`;
    const lokasiInfo = document.getElementById('lokasi-info');
    const cuacaData = document.getElementById('cuaca-data');

    // Fungsi untuk mengambil data cuaca
    async function fetchCuaca() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Gagal mengambil data cuaca');
            }
            const data = await response.json();
            displayLokasi(data.lokasi);
            groupAndDisplayCuaca(data.data[0].cuaca);
        } catch (error) {
            console.error('Error:', error);
            cuacaData.innerHTML = `
            <div class="text-center">
                <img src="404.png" class="img-fluid" alt="Data Tidak Ditemukan">
            </div>
            <h3 class="text-danger text-center">Mohon Maaf Data Tidak Ditemukan</h3>
            `;
        }
    }

    // Fungsi untuk menampilkan informasi lokasi
    function displayLokasi(lokasi) {
        const desaDropdownContainer = document.getElementById('desaform');
        desaDropdownContainer.classList.add('d-none');
        lokasiInfo.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td><strong>Desa / Kelurahan</strong></td>
                                <td>${lokasi.desa}</td>
                            </tr>
                            <tr>
                                <td><strong>Kecamatan</strong></td>
                                <td>${lokasi.kecamatan}</td>
                            </tr>
                            <tr>
                                <td><strong>Kota / Kabupaten</strong></td>
                                <td>${lokasi.kotkab}</td>
                            </tr>
                            <tr>
                                <td><strong>Provinsi</strong></td>
                                <td>${lokasi.provinsi}</td>
                            </tr>
                            <tr>
                                <td><strong>Zona Waktu</strong></td>
                                <td>${lokasi.timezone}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Fungsi untuk mengelompokkan data cuaca per hari
    function groupAndDisplayCuaca(cuaca) {
        if (!cuaca || cuaca.length === 0) {
            cuacaData.innerHTML = '<p class="text-warning">Data cuaca tidak tersedia.</p>';
            return;
        }

        // Kelompokkan data cuaca per hari
        const groupedData = {};
        cuaca.forEach((hari) => {
            hari.forEach((item) => {
                const date = item.local_datetime.split(' ')[0]; // Ambil tanggal saja
                if (!groupedData[date]) {
                    groupedData[date] = [];
                }
                groupedData[date].push(item);
            });
        });

        // Tampilkan data cuaca per hari
        let html = '';
        for (const date in groupedData) {
            html += `
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Tanggal: ${date}</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            ${groupedData[date].map((item) => `
                                <div class="col-md-6 mb-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="text-center">
                                                <h4>${item.local_datetime.split(' ')[1].substring(0, 5)}</h4>
                                                <img src="${item.image}" alt="${item.weather_desc}" class="img-fluid" style="width: 100px; height: 100px;">
                                                <h3>${item.weather_desc}</h3>
                                            </div>
                                            <div class="container text-center mt-3">
                                                <div class="row">
                                                    <!-- Suhu -->
                                                    <div class="col-12 col-md-3 mb-3">
                                                        <i class="fa-solid fa-temperature-three-quarters" style="font-size: 2rem;"></i>
                                                        <p>${item.t}°C</p>
                                                    </div>
                                                    <!-- Kelembaban -->
                                                    <div class="col-12 col-md-3 mb-3">
                                                        <i class="fa-solid fa-droplet" style="font-size: 2rem;"></i>
                                                        <p>${item.hu}%</p>
                                                    </div>
                                                    <!-- Kecepatan Angin -->
                                                    <div class="col-12 col-md-3 mb-3">
                                                        <i class="fa-solid fa-wind" style="font-size: 2rem;"></i>
                                                        <p>${item.ws} km/jam (${item.wd})</p>
                                                    </div>
                                                    <!-- Visibilitas -->
                                                    <div class="col-12 col-md-3 mb-3">
                                                        <i class="fa-solid fa-eye" style="font-size: 2rem;"></i>
                                                        <p>${item.vs_text}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        cuacaData.innerHTML = html;
    }

    // Panggil fungsi fetchCuaca saat halaman dimuat
    fetchCuaca();
});