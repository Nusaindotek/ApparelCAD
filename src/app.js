import { ApparelCAD } from './engine/ApparelCAD.js';
import { SVGRenderer } from './renderers/SVGRenderer.js';

const cad = new ApparelCAD();

function renderApp() {
    const container = document.getElementById('apparel-canvas');
    const sizeSelect = document.getElementById('sizeSelect');
    if (!container) return;
    
    const selectedSize = sizeSelect ? sizeSelect.value : 'M';
    container.innerHTML = '';

    const marker = cad.generateMarker(selectedSize, 150);

    const infoCard = document.createElement('div');
    infoCard.style.cssText = "background:#1e293b; color:#fff; padding:15px; border-radius:8px; margin-bottom:15px; grid-column:1/-1;";
    infoCard.innerHTML = `
        <h4 style="margin:0 0 5px 0;">Kalkulasi Kain - Short Legging Rib Knit (Size ${marker.size})</h4>
        <p style="margin:0; font-size:14px; color:#cbd5e1;">
            Panjang Bawahan: <strong>30 cm</strong> | 
            Lingkar Pinggang: <strong>${cad.sizeChart[selectedSize].waist} cm</strong> | 
            Estimasi Kain per Pcs: <strong>${marker.estimatedYield} Meter</strong> (Lebar Kain ${marker.fabricWidth} cm)
        </p>
    `;

    const svgElement = SVGRenderer.renderMarker(marker);

    container.appendChild(infoCard);
    container.appendChild(svgElement);
}

const sizeSelect = document.getElementById('sizeSelect');
if (sizeSelect) {
    sizeSelect.addEventListener('change', renderApp);
}

renderApp();
