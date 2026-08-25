export class SVGRenderer {
    static renderMarker(markerData) {
        const svgNS = "http://www.w3.org/2000/svg";
        const scale = 4; // Skala rendering (1 cm = 4 pixel)
        
        const canvasWidth = markerData.fabricWidth * scale;
        const canvasHeight = (markerData.patternHeight + 10) * scale; // Tinggi kain + margin

        // 1. Inisialisasi SVG Canvas
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "auto");
        svg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);
        svg.style.backgroundColor = "#0f172a";
        svg.style.borderRadius = "8px";

        // 2. Gambar Area Roll Kain (Fabric Boundary)
        const fabric = document.createElementNS(svgNS, "rect");
        fabric.setAttribute("x", "0");
        fabric.setAttribute("y", "0");
        fabric.setAttribute("width", canvasWidth);
        fabric.setAttribute("height", canvasHeight);
        fabric.setAttribute("fill", "#1e293b");
        fabric.setAttribute("stroke", "#334155");
        fabric.setAttribute("stroke-width", "2");
        fabric.setAttribute("stroke-dasharray", "6 6");
        svg.appendChild(fabric);

        // 3. Render Setiap Komponen Pola
        markerData.patterns.forEach(item => {
            const pattern = item.data;
            const pts = pattern.points;
            
            const group = document.createElementNS(svgNS, "g");
            group.setAttribute("transform", `translate(${item.offsetX * scale}, ${item.offsetY * scale}) rotate(${item.rotate})`);

            // Menyusun Path Vektor Pola
            let dPath = "";
            pattern.path.forEach((step, idx) => {
                const s = pts[step.from];
                const e = pts[step.to];
                
                const x1 = s.x * scale; const y1 = s.y * scale;
                const x2 = e.x * scale; const y2 = e.y * scale;

                if (idx === 0) dPath += `M ${x1} ${y1} `;

                if (step.type === "curve") {
                    let cx = (step.cpx * scale);
                    let cy = (step.cpy * scale);
                    dPath += `Q ${cx} ${cy}, ${x2} ${y2} `;
                } else {
                    dPath += `L ${x2} ${y2} `;
                }
            });
            dPath += "Z";

            // Bentuk Pola (Path)
            const pathEl = document.createElementNS(svgNS, "path");
            pathEl.setAttribute("d", dPath);
            pathEl.setAttribute("fill", item.rotate === 180 ? "rgba(16, 185, 129, 0.25)" : "rgba(59, 130, 246, 0.25)");
            pathEl.setAttribute("stroke", item.rotate === 180 ? "#10b981" : "#3b82f6");
            pathEl.setAttribute("stroke-width", "2");
            group.appendChild(pathEl);

            // Label Nama Pola
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", item.rotate === 180 ? -40 : 10);
            text.setAttribute("y", item.rotate === 180 ? -15 : 25);
            text.setAttribute("fill", "#f8fafc");
            text.setAttribute("font-size", "12px");
            text.setAttribute("font-family", "sans-serif");
            text.setAttribute("font-weight", "600");
            text.setAttribute("transform", item.rotate === 180 ? "rotate(180)" : "rotate(0)");
            text.textContent = `${pattern.part} (${pattern.size})`;
            group.appendChild(text);

            svg.appendChild(group);
        });

        return svg;
    }
}
