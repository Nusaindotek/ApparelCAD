export class SVGRenderer {
    /**
     * Render pola ke bentuk elemen SVG
     */
    static render(patternData, scale = 5) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        
        // Atur dimensi canvas SVG (skala tampilan agar muat di layar)
        svg.setAttribute("width", "350");
        svg.setAttribute("height", "450");
        svg.setAttribute("viewBox", `-20 -20 350 450`);

        // 1. Gambar Garis Pola (Path)
        let dPath = "";
        const points = patternData.points;

        // Hubungkan titik-titik (A -> B -> C -> dst)
        const pointKeys = Object.keys(points);
        pointKeys.forEach((key, index) => {
            const pt = points[key];
            const x = pt.x * scale;
            const y = pt.y * scale;

            if (index === 0) {
                dPath += `M ${x} ${y} `;
            } else {
                dPath += `L ${x} ${y} `;
            }
        });
        dPath += "Z"; // Tutup path

        const pathEl = document.createElementNS(svgNS, "path");
        pathEl.setAttribute("d", dPath);
        svg.appendChild(pathEl);

        // 2. Gambar Titik Koordinat & Label (A, B, C...)
        Object.entries(points).forEach(([label, pt]) => {
            const cx = pt.x * scale;
            const cy = pt.y * scale;

            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", cx);
            circle.setAttribute("cy", cy);
            circle.setAttribute("r", 4);
            svg.appendChild(circle);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", cx + 6);
            text.setAttribute("y", cy + 4);
            text.textContent = `${label} (${pt.x}, ${pt.y})`;
            svg.appendChild(text);
        });

        return svg;
    }
}
