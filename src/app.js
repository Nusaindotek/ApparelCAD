import { ApparelCAD } from './engine/ApparelCAD.js';
import { SVGRenderer } from './renderers/SVGRenderer.js';

const cad = new ApparelCAD();

function renderApp() {
    const container = document.getElementById('apparel-canvas');
    const sizeSelect = document.getElementById('sizeSelect');
    const widthInput = document.getElementById('fabricWidthInput'); // Input fleksibel lebar kain
    const modeSelect = document.getElementById('fabricModeSelect'); // Pilihan Tubular / Open Width
    
    if (!container) return;
    
    const selectedSize = sizeSelect ? sizeSelect.value : 'M';
    const actualWidth = widthInput ? parseFloat(widthInput.value) || 80 : 80;
    const isTubular = modeSelect ? modeSelect.value === 'tubular' : true;

    container.innerHTML = '';

    const marker = cad.generateMarker(selectedSize, actualWidth, isTubular);

    const infoCard = document.createElement('div');
    infoCard.style.cssText = "background:#1e293b; color:#fff; padding:15px; border-radius:8px; margin-bottom:15px; grid-column:1/-1;";
    infoCard.innerHTML = `
        <h4 style="margin:0 0 5px 0;">Kalkulator Marker Fleksibel - Size ${marker.size}</h4>
        <p style="margin:0; font-size:14px; color:#cbd5e1;">
            Tipe Kain: <strong>${marker.isTubular ? 'Tubular (Melingkar)' : 'Open Width (Dibelah)'}</strong> | 
            Lebar Aktual: <strong>${marker.fabricWidth} cm</strong><br>
            Panjang Celana: <strong>30 cm</strong> | 
            Estimasi Kebutuhan Kain per Pcs: <strong style="color:#38bdf8;">${marker.estimatedYield} Meter</strong>
        </p>
    `;

    const svgElement = SVGRenderer.renderMarker(marker);

    container.appendChild(infoCard);
    container.appendChild(svgElement);
}

// Event Listeners untuk interaksi dinamis
document.getElementById('sizeSelect')?.addEventListener('change', renderApp);
document.getElementById('fabricWidthInput')?.addEventListener('input', renderApp);
document.getElementById('fabricModeSelect')?.addEventListener('change', renderApp);

renderApp();
