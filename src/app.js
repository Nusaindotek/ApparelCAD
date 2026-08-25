import { ApparelCAD } from './engine/ApparelCAD.js';
import { SVGRenderer } from './renderers/SVGRenderer.js';

const cad = new ApparelCAD();

function renderApp() {
    const container = document.getElementById('apparel-canvas');
    const widthInput = document.getElementById('fabricWidthInput');
    
    if (!container) return;
    
    // Membaca lebar kain dari input (Default 80 cm)
    const actualWidth = widthInput ? parseFloat(widthInput.value) || 80 : 80;

    container.innerHTML = '';

    // Generasi Full Set Komplit (S, M, L, XL)
    const marker = cad.generateFullSetMarker(actualWidth);

    const infoCard = document.createElement('div');
    infoCard.style.cssText = "background:#0f172a; border:1px solid #334155; color:#fff; padding:16px; border-radius:8px; margin-bottom:15px;";
    infoCard.innerHTML = `
        <h4 style="margin:0 0 8px 0; color:#38bdf8;">📊 Laporan Marker Full Set Komplit (S, M, L, XL)</h4>
        <div style="font-size:14px; line-height:1.6; color:#cbd5e1;">
            • Lebar Kain Aktual: <strong>${marker.fabricWidth} cm</strong><br>
            • Isi Marker: <strong>1 Set Komplit (4 Pcs: Size S, M, L, XL + Ban Pinggang)</strong><br>
            • Kebutuhan Kain per 1 Kali Gelar: <strong style="color:#4ade80; font-size:16px;">${marker.estimatedYield} Meter</strong>
        </div>
    `;

    const svgElement = SVGRenderer.renderMarker(marker);

    container.appendChild(infoCard);
    container.appendChild(svgElement);
}

// Event listener untuk update real-time saat lebar kain diubah (misal dari 80cm ke 90cm)
document.getElementById('fabricWidthInput')?.addEventListener('input', renderApp);

renderApp();
