import { TShirtSizeChart } from './config/sizeChart.js';
import { ApparelCAD } from './engine/ApparelCAD.js';
import { SVGRenderer } from './renderers/SVGRenderer.js';

const cad = new ApparelCAD(TShirtSizeChart);

const patterns = [
    cad.draftTShirtFront('M'),
    cad.draftTShirtBack('M'),
    cad.draftTShirtSleeve('M')
];

// Jalankan rendering jika dibuka di Browser
if (typeof window !== 'undefined') {
    const container = document.getElementById('apparel-canvas');

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
