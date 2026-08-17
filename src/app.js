import { TShirtSizeChart } from './config/sizeChart.js';
import { ApparelCAD } from './engine/ApparelCAD.js';
import { SVGRenderer } from './renderers/SVGRenderer.js';

const cad = new ApparelCAD(TShirtSizeChart);

// 1. Generate semua potongan pola
const patterns = [
    cad.draftTShirtFront('M'),
    cad.draftTShirtBack('M'),
    cad.draftTShirtSleeve('M')
];

// 2. Render visual SVG ke HTML
const container = document.getElementById('apparel-canvas');

if (container) {
    patterns.forEach(pattern => {
        // Buat kartu pembungkus tiap pola
        const card = document.createElement('div');
        card.className = 'pattern-card';
        
        // Judul Pola
        const title = document.createElement('h3');
        title.innerText = `${pattern.part} (${pattern.size})`;
        card.appendChild(title);

        // Render elemen SVG
        const svgElement = SVGRenderer.render(pattern);
        card.appendChild(svgElement);

        // Masukkan ke container utama
        container.appendChild(card);
    });
}
