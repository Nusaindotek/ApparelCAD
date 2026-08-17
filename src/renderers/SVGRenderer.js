// src/renderers/SVGRenderer.js
export class SVGRenderer {
    static render(patternData, scale = 5) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        
        svg.setAttribute("width", "350");
        svg.setAttribute("height", "450");
        svg.setAttribute("viewBox", `-20 -20 350 450`);

        const pts = patternData.points;
        let dPath = "";

        // Mengikuti urutan array path (bukan urutan abjad titik)
        if (patternData.path && patternData.path.length > 0) {
            patternData.path.forEach((step, idx) => {
                const start = pts[step.from];
                const end = pts[step.to];

                const x1 = start.x * scale;
                const y1 = start.y * scale;
                const x2 = end.x * scale;
                const y2 = end.y * scale;

                if (idx === 0) {
                    dPath += `M ${x1} ${y1} `;
                }

                if (step.type === "curve") {
                    // Kalkulasi Titik Kontrol Kurva (Bézier Curve)
                    let cx = (x1 + x2) / 2;
                    let cy = (y1 + y2) / 2;

                    // Penyesuaian kelengkungan kerung leher dan ketiak
                    if (step.from === "B" && step.to === "A") { 
                        cx = x1; cy = y2; // Lengkungan Leher
                    } else if (step.from === "C" && step.to === "D") { 
                        cx = x1 - 15; cy = (y1 + y2) / 2; // Lengkungan Kerungan Lengan
                    } else if (step.from === "A" && step.to === "B" && patternData.part === "Sleeve") { 
                        cx = x2 * 0.4; cy = y1 - 10; // Lengkungan Puncak Lengan
                    }

                    dPath += `Q ${cx} ${cy}, ${x2} ${y2} `;
                } else {
                    dPath += `L ${x2} ${y2} `;
                }
            });
            dPath += "Z";
        }

        // 1. Gambar Garis Pola
        const pathEl = document.createElementNS(svgNS, "path");
        pathEl.setAttribute("d", dPath);
        svg.appendChild(pathEl);

        // 2. Gambar Titik Koordinat & Label
        Object.entries(pts).forEach(([label, pt]) => {
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
