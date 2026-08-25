export class SVGRenderer {
    static renderMarker(markerData) {
        const svgNS = "http://www.w3.org/2000/svg";
        const scale = 3.5; // Skala render piksel per cm
        
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

            // Merakit garis & kurva pesak dengan perkalian skala tepat
            const dPath = `
                M ${pts.topLeft.x * scale} ${pts.topLeft.y * scale}
                L ${pts.topRight.x * scale} ${pts.topRight.y * scale}
                L ${pts.hipRight.x * scale} ${pts.hipRight.y * scale}
                L ${pts.hemRight.x * scale} ${pts.hemRight.y * scale}
                L ${pts.hemLeft.x * scale} ${pts.hemLeft.y * scale}
                Q ${cp.x * scale} ${cp.y * scale}, ${pts.crotchTip.x * scale} ${pts.crotchTip.y * scale}
                Z
            `;

            const pathEl = document.createElementNS(svgNS, "path");
            pathEl.setAttribute("d", dPath);
            pathEl.setAttribute("fill", "rgba(56, 189, 248, 0.15)");
            pathEl.setAttribute("stroke", "#38bdf8");
            pathEl.setAttribute("stroke-width", "1.5");
            group.appendChild(pathEl);

            // Label Nama Pola
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", (pts.topLeft.x + 2) * scale);
            text.setAttribute("y", 20);
            text.setAttribute("fill", "#f8fafc");
            text.setAttribute("font-size", "10px");
            text.setAttribute("font-weight", "bold");
            text.textContent = p.part;
            group.appendChild(text);

            svg.appendChild(group);
        });

        return svg;
    }
}
