export class SVGRenderer {
    static renderMarker(markerData) {
        const svgNS = "http://www.w3.org/2000/svg";
        const scale = 3.5;
        
        const canvasWidth = markerData.fabricWidth * scale;
        const canvasHeight = markerData.totalLengthCM * scale;

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "auto");
        svg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);
        svg.style.backgroundColor = "#0f172a";
        svg.style.borderRadius = "8px";

        markerData.patterns.forEach(item => {
            const pattern = item.data;
            const group = document.createElementNS(svgNS, "g");
            group.setAttribute("transform", `translate(${item.offsetX * scale}, ${item.offsetY * scale})`);

            const pathEl = document.createElementNS(svgNS, "path");
            pathEl.setAttribute("d", pattern.pathD);
            pathEl.setAttribute("fill", "rgba(56, 189, 248, 0.15)");
            pathEl.setAttribute("stroke", "#38bdf8");
            pathEl.setAttribute("stroke-width", "1.5");
            group.appendChild(pathEl);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", "10");
            text.setAttribute("y", "25");
            text.setAttribute("fill", "#f8fafc");
            text.setAttribute("font-size", "10px");
            text.setAttribute("font-weight", "bold");
            text.textContent = pattern.part;
            group.appendChild(text);

            svg.appendChild(group);
        });

        return svg;
    }
}
