export class SVGRenderer {
    static renderMarker(markerData) {
        const svgNS = "http://www.w3.org/2000/svg";
        const scale = 3.5; // Skala render (1 cm = 3.5 pixel)
        
        const canvasWidth = markerData.fabricWidth * scale;
        const canvasHeight = markerData.totalLengthCM * scale;

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "auto");
        svg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);
        svg.style.backgroundColor = "#0f172a";
        svg.style.borderRadius = "8px";
        svg.style.border = "1px solid #334155";

        markerData.patterns.forEach(item => {
            const p = item.data;
            const pts = p.points;
            const cp = p.controlPoint;

            const group = document.createElementNS(svgNS, "g");
            group.setAttribute("transform", `translate(${item.offsetX * scale}, ${item.offsetY * scale})`);

            // Menggambar alur pola persis sesuai alur diagram gambar referensi
            const dPath = `
                M ${pts.waistIn.x * scale} ${pts.waistIn.y * scale}
                L ${pts.waistOut.x * scale} ${pts.waistOut.y * scale}
                L ${pts.hipOut.x * scale} ${pts.hipOut.y * scale}
                L ${pts.legOut.x * scale} ${pts.legOut.y * scale}
                L ${pts.legIn.x * scale} ${pts.legIn.y * scale}
                Q ${cp.x * scale} ${cp.y * scale}, ${pts.crotchTip.x * scale} ${pts.crotchTip.y * scale}
                Z
            `;

            const pathEl = document.createElementNS(svgNS, "path");
            pathEl.setAttribute("d", dPath);
            pathEl.setAttribute("fill", p.isBack ? "rgba(56, 189, 248, 0.18)" : "rgba(129, 140, 248, 0.18)");
            pathEl.setAttribute("stroke", p.isBack ? "#38bdf8" : "#818cf8");
            pathEl.setAttribute("stroke-width", "1.5");
            group.appendChild(pathEl);

            // Label Informasi Nama Pola
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", (pts.waistIn.x + 1) * scale);
            text.setAttribute("y", (pts.waistIn.y + 6) * scale);
            text.setAttribute("fill", "#f8fafc");
            text.setAttribute("font-size", "9px");
            text.setAttribute("font-weight", "bold");
            text.textContent = p.part;
            group.appendChild(text);

            svg.appendChild(group);
        });

        return svg;
    }
}
