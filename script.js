document.addEventListener('DOMContentLoaded', function() {
    const menuSection = document.getElementById('menu-section');
    const detailSection = document.getElementById('detail-section');
    const lanjutButton = document.getElementById('lanjut-button');
    const orderDetailsDiv = document.getElementById('order-details');
    const grandTotalSpan = document.getElementById('grand-total');
    const buyerDetailsDiv = document.getElementById('buyer-details');
    const downloadButton = document.getElementById('download-button');
    const whatsappLink = document.getElementById('whatsapp-link');
    const kembaliButton = document.getElementById('kembali-button');
    
    const inputNama = document.getElementById('nama');
    const inputHP = document.getElementById('hp');
    const inputKelasAngka = document.getElementById('kelas-angka');

    const menuItems = [
        { id: 'qty-pancake-icing', name: 'Mini Pancake - Icing Sugar', price: 10000, qty: 0 },
        { id: 'qty-pancake-oreo', name: 'Mini Pancake - Oreo Crumble', price: 12000, qty: 0 },
        { id: 'qty-pancake-choco', name: 'Mini Pancake - Chocolate', price: 12000, qty: 0 },
        { id: 'qty-ice-jelang', name: 'Ice Jelang', price: 10000, qty: 0 }
    ];

    const WA_NUMBER = '6281286432393'; 

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    lanjutButton.addEventListener('click', () => {

        const nama = inputNama.value.trim();
        const hp = inputHP.value.trim();
        const kelasAngka = inputKelasAngka.value.trim();
        const jurusanRadio = document.querySelector('input[name="jurusan"]:checked');
        const jurusan = jurusanRadio ? jurusanRadio.value : '';

        let total = 0;
        let whatsappText = `*PRE-ORDER MINI PANCAKE & ICE JELANG*\n\n`;
        
        menuItems.forEach(item => {
            const input = document.getElementById(item.id);
            item.qty = parseInt(input.value) || 0;
            total += item.qty * item.price;
        });

        const orderedItems = menuItems.filter(item => item.qty > 0);
        
        if (!nama || !hp || !jurusan || !kelasAngka) {
            alert("Mohon lengkapi semua Data Pembeli.");
            return;
        }
        if (orderedItems.length === 0) {
            alert("Mohon masukkan kuantitas setidaknya satu menu.");
            return;
        }

        const buyerSummary = `
            <p class="detail-row"><span>Nama:</span> <span>${nama}</span></p>
            <p class="detail-row"><span>HP:</span> <span>${hp}</span></p>
            <p class="detail-row"><span>Jurusan/Kelas:</span> <span>${jurusan} ${kelasAngka}</span></p>
        `;
        buyerDetailsDiv.innerHTML = buyerSummary;
        
        orderDetailsDiv.innerHTML = '';
        orderedItems.forEach(item => {
            const subtotal = item.qty * item.price;
            
            orderDetailsDiv.innerHTML += `
                <p class="detail-row">
                    <strong>${item.qty}x</strong> ${item.name} 
                    <span>${formatRupiah(subtotal)}</span>
                </p>
            `;
            
            whatsappText += `*${item.qty}x* ${item.name} (${formatRupiah(subtotal)})\n`;
        });
        
        grandTotalSpan.textContent = formatRupiah(total);
        
        const waBuyerInfo = `
        Halo Minbloom, saya *${nama}* telah melakukan pembayaran pesanan.\n\n` +
        `*Data Pembeli:*\n` +
        `Nama: ${nama}\n` +
        `HP: ${hp}\n` +
        `Jurusan/Kelas: ${jurusan} ${kelasAngka}\n\n`;

        whatsappText = waBuyerInfo + "*Detail Pesanan:*\n" + whatsappText;
        whatsappText += `\n*TOTAL HARGA:* ${formatRupiah(total)}\n\nBerikut bukti transfer QRIS saya👇🏻. Terima kasih.`;

        const encodedText = encodeURIComponent(whatsappText);
        whatsappLink.href = `https://wa.me/${WA_NUMBER}?text=${encodedText}`;

        menuSection.classList.add('hidden');
        detailSection.classList.remove('hidden');
    });

    kembaliButton.addEventListener('click', () => {
        detailSection.classList.add('hidden');
        menuSection.classList.remove('hidden');
    });

    downloadButton.addEventListener('click', () => {
        const element = document.getElementById('pdf-content');
        const namaPembeli = inputNama.value.trim() || 'Tanpa_Nama';

        element.style.display = 'block';
        element.style.visibility = 'visible';

        setTimeout(() => {
            const opt = {
                margin: [10, 10, 10, 10],
                filename: `Pesanan_${namaPembeli.replace(/ /g, '_')}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true,
                    scrollY: 0,
                    windowWidth: document.body.scrollWidth
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait'
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };
            
            html2pdf().set(opt).from(element).save();
        }, 100);
    });


});