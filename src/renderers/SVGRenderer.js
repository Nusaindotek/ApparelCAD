export class SVGRenderer {
    static render(pattern) {
        // 1. Tentukan Bounding Box (Rentang Pola)
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        Object.values(pattern.points).forEach(pt => {
            if (pt.x < minX) minX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y > maxY) maxY = pt.y;
        });

        // Faktor Skala agar SVG Pas di Canvas
        const scale = 4;
        const padding = 20;
        const svgWidth = Math.max((maxX * scale) + (padding * 2), 320);
        const svgHeight = (maxY * scale) + (padding * 2);

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "320");
        svg.setAttribute("height", "420");
        svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
        svg.style.background = "#ffffff";
        svg.style.border = "1px dashed #cbd5e1";

        const pts = pattern.points;
        let dPath = "";

        // 2. Gambar Path Sesuai Alur Path Engine
        if (pattern.path && pattern.path.length > 0) {
            pattern.path.forEach((step, idx) => {
                const start = pts[step.from];
                const end = pts[step.to];

                const x1 = (start.x * scale) + padding;
                const y1 = (start.y * scale) + padding;
                const x2 = (end.x * scale) + padding;
                const y2 = (end.y * scale) + padding;

                if (idx === 0) dPath += `M ${x1} ${y1} `;

                if (step.type === "curve") {
                    let cx = (x1 + x2) / 2;
                    let cy = (y1 + y2) / 2;

                    // Penyesuaian kurva spesifik titik
                    if (step.from === "B" && step.to === "A") { 
                        cx = x1; cy = y2; 
                    } else if (step.from === "C" && step.to === "D") { 
                        cx = x1 - 30; cy = (y1 + y2) / 2; 
                    } else if (step.from === "A" && step.to === "B" && pattern.part === "Sleeve") { 
                        cx = (x2 - padding) * 0.4 + padding; cy = y1 - 20; 
                    }

                    dPath += `Q ${cx} ${cy}, ${x2} ${y2} `;
                } else {
                    dPath += `L ${x2} ${y2} `;
                }
            });
            dPath += "Z";
        }

        // Garis Pola (Stroke)
        const pathEl = document.createElementNS(svgNS, "path");
        pathEl.setAttribute("d", dPath);
        pathEl.setAttribute("fill", "rgba(37, 99, 235, 0.04)");
        pathEl.setAttribute("stroke", "#2563eb");
        pathEl.setAttribute("stroke-width", "2");
        svg.appendChild(pathEl);

        // 3. Gambar Titik Node & Label (Ukuran Proporsional)
        Object.entries(pts).forEach(([label, pt]) => {
            const cx = (pt.x * scale) + padding;
            const cy = (pt.y * scale) + padding;

            // Titik Merah
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", cx);
            circle.setAttribute("cy", cy);
            circle.setAttribute("r", "4");
            circle.setAttribute("fill", "#ef4444");
            svg.appendChild(circle);

            // Teks Nama Titik & Koordinat
            const text = document.createElementNS(svgNS, "text");
            let offsetX = 8;
            let offsetY = 4;
            if (pt.x === 0) offsetX = -55; // Geser teks jika di lipatan kiri

            text.setAttribute("x", cx + offsetX);
            text.setAttribute("y", cy + offsetY);
            text.setAttribute("font-size", "11px");
            text.setAttribute("font-family", "Arial, sans-serif");
            text.setAttribute("font-weight", "600");
            text.setAttribute("fill", "#334155");
            text.textContent = `${label} (${pt.x}, ${pt.y})`;
            svg.appendChild(text);
        });

        return svg;
    }
}
