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

        const cardWidth = 320;
        const cardHeight = 320;
        const margin = 70;
        const drawAreaWidth = cardWidth - (margin * 2);
        const drawAreaHeight = cardHeight - (margin * 2);

        const scale = Math.min(drawAreaWidth / patternWidth, drawAreaHeight / patternHeight);
        const offsetX = (cardWidth - (patternWidth * scale)) / 2;
        const offsetY = (cardHeight - (patternHeight * scale)) / 2;

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "auto");
        svg.setAttribute("viewBox", `0 0 ${cardWidth} ${cardHeight}`);

        // Render Garis Pola (Path)
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

                if (step.type === "cubic") {
                    // Eksekusi Kurva S untuk Lengan
                    let cp1x = ((step.cp1x - minX) * scale) + offsetX;
                    let cp1y = ((step.cp1y - minY) * scale) + offsetY;
                    let cp2x = ((step.cp2x - minX) * scale) + offsetX;
                    let cp2y = ((step.cp2y - minY) * scale) + offsetY;
                    dPath += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2} `;
                } else if (step.type === "curve") {
                    // Eksekusi Lengkung Biasa (Leher, Ketiak)
                    let cx = step.cpx !== undefined ? ((step.cpx - minX) * scale) + offsetX : (x1 + x2) / 2;
                    let cy = step.cpy !== undefined ? ((step.cpy - minY) * scale) + offsetY : (y1 + y2) / 2;
                    dPath += `Q ${cx} ${cy}, ${x2} ${y2} `;
                } else {
                    // Garis Lurus
                    dPath += `L ${x2} ${y2} `;
                }
            });
            dPath += "Z";
        }

        const pathEl = document.createElementNS(svgNS, "path");
        pathEl.setAttribute("d", dPath);
        pathEl.setAttribute("fill", "rgba(37, 99, 235, 0.08)");
        pathEl.setAttribute("stroke", "#2563eb");
        pathEl.setAttribute("stroke-width", "2");
        pathEl.setAttribute("stroke-linejoin", "round");
        svg.appendChild(pathEl);

        // Render Titik Label
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
            text.setAttribute("font-family", "Arial");
            text.textContent = `${label} (${pt.x}, ${pt.y})`;
            svg.appendChild(text);
        });

        return svg;
    }
}
