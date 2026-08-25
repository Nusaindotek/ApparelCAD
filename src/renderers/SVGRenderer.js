export class SVGRenderer {
    static renderMarker(markerData) {
        const svgNS = "http://www.w3.org/2000/svg";
        const scale = 4; // Skala tampilan piksel
        
        const canvasWidth = markerData.fabricWidth * scale;
        const canvasHeight = markerData.totalLengthCM * scale;

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "auto");
        svg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);
        svg.style.backgroundColor = "#1e293b";
        svg.style.borderRadius = "8px";
        svg.style.border = "1px solid #475569";

        // Render Setiap Pola Celana
        markerData.patterns.forEach(item => {
            const pattern = item.data;
            const pts = pattern.points;
            
            const group = document.createElementNS(svgNS, "g");
            group.setAttribute("transform", `translate(${item.offsetX * scale}, ${item.offsetY * scale})`);

            let dPath = "";
            pattern.path.forEach((step, idx) => {
                const s = pts[step.from];
                const e = pts[step.to];
                const x1 = s.x * scale; const y1 = s.y * scale;
                const x2 = e.x * scale; const y2 = e.y * scale;

                if (idx === 0) dPath += `M ${x1} ${y1} `;
                if (step.type === "curve") {
                    dPath += `Q ${step.cpx * scale} ${step.cpy * scale}, ${x2} ${y2} `;
                } else {
                    dPath += `L ${x2} ${y2} `;
                }
            });
            dPath += "Z";

            const pathEl = document.createElementNS(svgNS, "path");
            pathEl.setAttribute("d", dPath);
            pathEl.setAttribute("fill", "rgba(56, 189, 248, 0.2)");
            pathEl.setAttribute("stroke", "#38bdf8");
            pathEl.setAttribute("stroke-width", "2");
            group.appendChild(pathEl);

            // Label Size
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", 5);
            text.setAttribute("y", 20);
            text.setAttribute("fill", "#f8fafc");
            text.setAttribute("font-size", "11px");
            text.setAttribute("font-weight", "bold");
            text.textContent = pattern.part;
            group.appendChild(text);

            svg.appendChild(group);
        });

        return svg;
    }
}
