import { TShirtSizeChart } from './config/sizeChart.js';
import { ApparelCAD } from './engine/ApparelCAD.js';
import { SVGRenderer } from './renderers/SVGRenderer.js';

const cad = new ApparelCAD(TShirtSizeChart);

function renderPatterns(selectedSize) {
    const container = document.getElementById('apparel-canvas');
    if (!container) return;

    container.innerHTML = '';

    try {
        const patterns = [
            cad.draftTShirtFront(selectedSize),
            cad.draftTShirtBack(selectedSize),
            cad.draftTShirtSleeve(selectedSize),
            cad.draftTShirtRib(selectedSize)
        ];

        patterns.forEach(pattern => {
            const card = document.createElement('div');
            card.className = 'pattern-card';
            
            const title = document.createElement('h3');
            title.style.margin = "0 0 10px 0";
            title.style.fontSize = "16px";
            title.style.color = "#0f172a";
            title.innerText = `${pattern.part} (${pattern.size})`;
            card.appendChild(title);

            const svgElement = SVGRenderer.render(pattern);
            card.appendChild(svgElement);

            container.appendChild(card);
        });
    } catch (error) {
        console.error("ApparelCAD Error:", error);
        container.innerHTML = `
            <div style="background:#fee2e2; border:1px solid #f87171; color:#991b1b; padding:15px; border-radius:8px; width:100%;">
                <strong>⚠️ Gagal Memuat Pola:</strong> ${error.message}
            </div>`;
    }
}

const sizeSelect = document.getElementById('sizeSelect');
const currentSize = sizeSelect ? sizeSelect.value : 'M';
renderPatterns(currentSize);

if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
        renderPatterns(e.target.value);
    });
}
