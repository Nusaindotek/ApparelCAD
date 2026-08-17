import { TShirtSizeChart } from './config/sizeChart.js';
import { ApparelCAD } from './engine/ApparelCAD.js';
import { SVGRenderer } from './renderers/SVGRenderer.js';

const cad = new ApparelCAD(TShirtSizeChart);

function renderPatterns(selectedSize) {
    const container = document.getElementById('apparel-canvas');
    if (!container) return;

    container.innerHTML = '';

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
        title.innerText = `${pattern.part} (${pattern.size})`;
        card.appendChild(title);

        const svgElement = SVGRenderer.render(pattern);
        card.appendChild(svgElement);

        container.appendChild(card);
    });
}

// Render awal (Default: Size M)
renderPatterns('M');

// Event Listener saat user mengubah dropdown ukuran
const sizeSelect = document.getElementById('sizeSelect');
if (sizeSelect) {
    sizeSelect.addEventListener('change', (e) => {
        renderPatterns(e.target.value);
    });
}
