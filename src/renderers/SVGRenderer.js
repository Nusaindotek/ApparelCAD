export class SVGRenderer {
    static render(pattern) {
        const pts = pattern.points;
        const svgNS = "http://www.w3.org/2000/svg";

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
        
        // Elemen Penampung (Layering CAD)
        const handlesGroup = document.createElementNS(svgNS, "g");
        const pathGroup = document.createElementNS(svgNS, "g");
        const notchesGroup = document.createElementNS(svgNS, "g");
        
        svg.appendChild(handlesGroup);
        svg.appendChild(pathGroup);
        svg.appendChild(notchesGroup);

        let dPath = "";
        
        // 1. Gambar Garis Pola & Titik Kontrol (CAD View)
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
                    let cp1x = ((step.cp1x - minX) * scale) + offsetX;
                    let cp1y = ((step.cp1y - minY) * scale) + offsetY;
                    let cp2x = ((step.cp2x - minX) * scale) + offsetX;
                    let cp2y = ((step.cp2y - minY) * scale) + offsetY;
                    dPath += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2} `;
                    
                    // Render Bezier Handles ala Software CAD
                    this.drawHandle(handlesGroup, x1, y1, cp1x, cp1y);
                    this.drawHandle(handlesGroup, x2, y2, cp2x, cp2y);
                } else if (step.type === "curve") {
                    let cx = step.cpx !== undefined ? ((step.cpx - minX) * scale) + offsetX : (x1 + x2) / 2;
                    let cy = step.cpy !== undefined ? ((step.cpy - minY) * scale) + offsetY : (y1 + y2) / 2;
                    dPath += `Q ${cx} ${cy}, ${x2} ${y2} `;
                    
                    this.drawHandle(handlesGroup, x1, y1, cx, cy);
                    this.drawHandle(handlesGroup, x2, y2, cx, cy);
                } else {
                    dPath += `L ${x2} ${y2} `;
                }
            });
            dPath += "Z";
        }

        // Render Garis Net Pola
        const pathEl = document.createElementNS(svgNS, "path");
        pathEl.setAttribute("d", dPath);
        pathEl.setAttribute("fill", "rgba(15, 23, 42, 0.03)");
        pathEl.setAttribute("stroke", "#0f172a");
        pathEl.setAttribute("stroke-width", "2");
        pathEl.setAttribute("stroke-linejoin", "round");
        pathGroup.appendChild(pathEl);

        // 2. Render Grainline (Arah Serat Kain)
        if (pattern.grainline) {
            const gx = ((pattern.grainline.x - minX) * scale) + offsetX;
            const gy1 = ((pattern.grainline.y1 - minY) * scale) + offsetY;
            const gy2 = ((pattern.grainline.y2 - minY) * scale) + offsetY;
            
            const grainLine = document.createElementNS(svgNS, "line");
            grainLine.setAttribute("x1", gx); grainLine.setAttribute("y1", gy1);
            grainLine.setAttribute("x2", gx); grainLine.setAttribute("y2", gy2);
            grainLine.setAttribute("stroke", "#ef4444");
            grainLine.setAttribute("stroke-width", "1.5");
            
            // Panah Grainline Atas & Bawah
            this.drawArrowHead(notchesGroup, gx, gy1, "up");
            this.drawArrowHead(notchesGroup, gx, gy2, "down");
            notchesGroup.appendChild(grainLine);
        }

        // 3. Render Titik Koordinat
        Object.entries(pts).forEach(([label, pt]) => {
            const cx = ((pt.x - minX) * scale) + offsetX;
            const cy = ((pt.y - minY) * scale) + offsetY;

            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", cx); circle.setAttribute("cy", cy);
            circle.setAttribute("r", "3.5"); circle.setAttribute("fill", "#0f172a");
            notchesGroup.appendChild(circle);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", pt.x === minX ? cx - 48 : cx + 8);
            text.setAttribute("y", cy + 4);
            text.setAttribute("font-size", "10px");
            text.setAttribute("font-family", "monospace");
            text.setAttribute("fill", "#475569");
            text.textContent = `${label}`;
            notchesGroup.appendChild(text);
        });

        return svg;
    }

    // --- Helper Functions untuk UI ala CAD ---
    
    static drawHandle(group, x1, y1, x2, y2) {
        const svgNS = "http://www.w3.org/2000/svg";
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x1); line.setAttribute("y1", y1);
        line.setAttribute("x2", x2); line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#3b82f6");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("stroke-dasharray", "3,3");
        
        const controlPt = document.createElementNS(svgNS, "circle");
        controlPt.setAttribute("cx", x2); controlPt.setAttribute("cy", y2);
        controlPt.setAttribute("r", "3");
        controlPt.setAttribute("fill", "#ffffff");
        controlPt.setAttribute("stroke", "#3b82f6");
        controlPt.setAttribute("stroke-width", "1.5");
        
        group.appendChild(line);
        group.appendChild(controlPt);
    }

    static drawArrowHead(group, x, y, direction) {
        const svgNS = "http://www.w3.org/2000/svg";
        const path = document.createElementNS(svgNS, "path");
        const size = 6;
        if (direction === "up") {
            path.setAttribute("d", `M ${x-size} ${y+size} L ${x} ${y} L ${x+size} ${y+size}`);
        } else {
            path.setAttribute("d", `M ${x-size} ${y-size} L ${x} ${y} L ${x+size} ${y-size}`);
        }
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#ef4444");
        path.setAttribute("stroke-width", "1.5");
        group.appendChild(path);
    }
}
