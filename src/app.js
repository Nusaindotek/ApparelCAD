import { TShirtSizeChart } from './config/sizeChart.js';
import { ApparelCAD } from './engine/ApparelCAD.js';
import { SVGRenderer } from './renderers/SVGRenderer.js';

const cad = new ApparelCAD(TShirtSizeChart);

// Render 4 kepingan pola Kaos Oblong
const patterns = [
    cad.draftTShirtFront('M'),
    cad.draftTShirtBack('M'),
    cad.draftTShirtSleeve('M'),
    cad.draftTShirtRib('M')
];

const container = document.getElementById('apparel-canvas');

if (container) {
    container.innerHTML = '';
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
