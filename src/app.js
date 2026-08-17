import { SVGRenderer } from './renderers/SVGRenderer';

export function renderPatternApp(containerId, patterns) {
    const root = document.getElementById(containerId);
    root.innerHTML = ''; // Bersihkan kontainer
    
    // Buat container grid
    const grid = document.createElement('div');
    grid.className = 'pattern-grid';

    patterns.forEach(pattern => {
        const card = document.createElement('div');
        card.className = 'pattern-card';

        const title = document.createElement('h3');
        title.textContent = `${pattern.part} (${pattern.size})`;
        
        // Ambil hasil render SVG
        const svgElement = SVGRenderer.render(pattern);
        
        card.appendChild(title);
        card.appendChild(svgElement);
        grid.appendChild(card);
    });

    root.appendChild(grid);
}
