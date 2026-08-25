import { ApparelCAD } from './engine/ApparelCAD.js';
import { SVGRenderer } from './renderers/SVGRenderer.js';

const cad = new ApparelCAD();

function render() {
    const container = document.getElementById('apparel-canvas');
    const widthInput = document.getElementById('fabricWidth');
    
    if (!container) return;
    const fabricWidth = widthInput ? parseFloat(widthInput.value) || 80 : 80;

    container.innerHTML = '';

    // Generate Layout Interlock 1 Set Komplit
    const marker = cad.generateOptimizedMarker(fabricWidth);

    // Ringkasan Akurat Kebutuhan Kain
    const infoCard = document.createElement('div');
    infoCard.style.cssText = "background:#0f172a; border:1px solid #0284c7; padding:15px; border-radius:8px; margin-bottom:15px;";
    infoCard.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <span style="color:#94a3b8; font-size:13px;">Format Layout:</span>
                <strong style="color:#fff; display:block;">1 Set Komplit Shortpants (S, M, L, XL)</strong>
            </div>
            <div style="text-align:right;">
                <span style="color:#94a3b8; font-size:13px;">Kebutuhan Kain 1x Gelar:</span>
                <strong style="color:#4ade80; font-size:20px; display:block;">${marker.estimatedYieldMeters} Meter</strong>
            </div>
        </div>
    `;

    const svgCanvas = SVGRenderer.renderMarker(marker);

    container.appendChild(infoCard);
    container.appendChild(svgCanvas);
}

document.getElementById('fabricWidth')?.addEventListener('input', render);
document.addEventListener('DOMContentLoaded', render);
render();
