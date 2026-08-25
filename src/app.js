import { ApparelCAD } from './engine/ApparelCAD.js';
import { SVGRenderer } from './renderers/SVGRenderer.js';

const cad = new ApparelCAD();

function renderApp() {
    const container = document.getElementById('apparel-canvas');
    const leftSizeSelect = document.getElementById('leftSizeSelect');   // Pilihan size sisi kiri (misal XL)
    const rightSizeSelect = document.getElementById('rightSizeSelect'); // Pilihan size sisi kanan (misal S)
    const widthInput = document.getElementById('fabricWidthInput');     // Lebar kain aktual (misal 80 cm)
    
    if (!container) return;
    
    const leftSize = leftSizeSelect ? leftSizeSelect.value : 'XL';
    const rightSize = rightSizeSelect ? rightSizeSelect.value : 'S';
    const actualWidth = widthInput ? parseFloat(widthInput.value) || 80 : 80;

    container.innerHTML = '';

    // Memanggil fungsi interlock marker
    const marker = cad.generateInterlockMarker(leftSize, rightSize, actualWidth);

    const infoCard = document.createElement('div');
    infoCard.style.cssText = "background:#1e293b; color:#fff; padding:15px; border-radius:8px; margin-bottom:15px; grid-column:1/-1;";
    infoCard.innerHTML = `
        <h4 style="margin:0 0 5px 0;">Nesting Interlock Multi-Size (Anti-Waste)</h4>
        <p style="margin:0; font-size:14px; color:#cbd5e1;">
            Layout: <strong>Kiri (${leftSize}) + Kanan (${rightSize})</strong> | 
            Lebar Rol Kain: <strong>${marker.fabricWidth} cm</strong><br>
            Sudah Termasuk Kampuh Ban Pinggang (+3.5cm) | 
            Kebutuhan Kain per Set Kombinasi: <strong style="color:#38bdf8;">${marker.estimatedYield} Meter</strong>
        </p>
    `;

    const svgElement = SVGRenderer.renderMarker(marker);

    container.appendChild(infoCard);
    container.appendChild(svgElement);
}

// Event Listeners
document.getElementById('leftSizeSelect')?.addEventListener('change', renderApp);
document.getElementById('rightSizeSelect')?.addEventListener('change', renderApp);
document.getElementById('fabricWidthInput')?.addEventListener('input', renderApp);

renderApp();
