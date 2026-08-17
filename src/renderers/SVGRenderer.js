export class SVGRenderer {
    static render(pattern) {
        const pts = pattern.points;
        const svgNS = "http://www.w3.org/2000/svg";

        // Hitung Bounding Box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        Object.values(pts).forEach(pt => {
            if (pt.x < minX) minX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y > maxY) maxY = pt.y;
        });

        const patternWidth = Math.max(maxX - minX, 1);
        const patternHeight = Math.max(maxY - minY, 1);

        // Dimensi Kanvas SVG
        const cardWidth = 320;
        const cardHeight = 320; // Disesuaikan agar lebih kompak

        // Margin untuk label teks
        const margin = 70;
        const drawAreaWidth = cardWidth - (margin * 2);
        const drawAreaHeight = cardHeight - (margin * 2);

        const scale = Math.min(drawAreaWidth / patternWidth, drawAreaHeight / patternHeight);
        const offsetX = (cardWidth - (patternWidth * scale)) / 2;
        const offsetY = (cardHeight - (patternHeight * scale)) / 2;

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%"); // Agar responsif
        svg.setAttribute("height", "auto");
        svg.setAttribute("viewBox", `0 0 ${cardWidth} ${cardHeight}`);

        // Render Path
        let dPath = "";
        if (pattern.path) {
            pattern.path.forEach((step, idx) => {
                const s = pts[step.from];
                const e = pts[step.to];
                const x1 = ((s.x - minX) * scale) + offsetX;
                const y1 = ((s.y - minY) * scale) + offsetY;
                const x2 = ((e.x - minX) * scale) + offsetX;
                const y2 = ((e.y - minY) * scale) + offsetY;

                if (idx === 0) dPath += `M ${x1} ${y1} `;
                if (step.type === "curve") {
                    let cx = (x1 + x2) / 2;
                    let cy = (y1 + y2) / 2;
                    if (step.from === "B" && step.to === "A") { cx = x1; cy = y2; }
                    dPath += `Q ${cx} ${cy}, ${x2} ${y2} `;
                } else {
                    dPath += `L ${x2} ${y2} `;
                }
            });
            dPath += "Z";
        }

        const pathEl = document.createElementNS(svgNS, "path");
        pathEl.setAttribute("d", dPath);
        pathEl.setAttribute("fill", "rgba(37, 99, 235, 0.05)");
        pathEl.setAttribute("stroke", "#2563eb");
        pathEl.setAttribute("stroke-width", "2");
        svg.appendChild(pathEl);

        // Render Titik
        Object.entries(pts).forEach(([label, pt]) => {
            const cx = ((pt.x - minX) * scale) + offsetX;
            const cy = ((pt.y - minY) * scale) + offsetY;

            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", cx); circle.setAttribute("cy", cy);
            circle.setAttribute("r", "4"); circle.setAttribute("fill", "#ef4444");
            svg.appendChild(circle);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", pt.x === minX ? cx - 48 : cx + 8);
            text.setAttribute("y", cy + 4);
            text.setAttribute("font-size", "11px");
            text.textContent = `${label} (${pt.x}, ${pt.y})`;
            svg.appendChild(text);
        });

        return svg;
    }
}
