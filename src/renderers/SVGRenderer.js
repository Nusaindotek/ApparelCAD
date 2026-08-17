export class SVGRenderer {
    static render(pattern) {
        const pts = pattern.points;
        const svgNS = "http://www.w3.org/2000/svg";

        // 1. Hitung Bounding Box (Batas Minimum & Maksimum Pola)
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        Object.values(pts).forEach(pt => {
            if (pt.x < minX) minX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y > maxY) maxY = pt.y;
        });

        const patternWidth = Math.max(maxX - minX, 1);
        const patternHeight = Math.max(maxY - minY, 1);

        // Dimensi Kanvas Kartu SVG Fixed
        const cardWidth = 320;
        const cardHeight = 420;

        // Area Aktif (Memberi Margin Ruang Teks 50px Tepi)
        const marginX = 55;
        const marginY = 50;
        const drawAreaWidth = cardWidth - (marginX * 2);
        const drawAreaHeight = cardHeight - (marginY * 2);

        // 2. Skala Dinamis agar Setiap Pola Pas Memenuhi Kanvas
        const scaleX = drawAreaWidth / patternWidth;
        const scaleY = drawAreaHeight / patternHeight;
        // Gunakan skala terkecil agar bentuk/proporsi asli pola tidak distorsi
        const scale = Math.min(scaleX, scaleY);

        // Hitung Offset Posisi Tengah (Auto-Center)
        const offsetX = (cardWidth - (patternWidth * scale)) / 2;
        const offsetY = (cardHeight - (patternHeight * scale)) / 2;

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", cardWidth);
        svg.setAttribute("height", cardHeight);
        svg.setAttribute("viewBox", `0 0 ${cardWidth} ${cardHeight}`);
        svg.style.background = "#ffffff";
        svg.style.border = "1px dashed #cbd5e1";
        svg.style.borderRadius = "6px";

        let dPath = "";

        // 3. Render Garis Pola (Path)
        if (pattern.path && pattern.path.length > 0) {
            pattern.path.forEach((step, idx) => {
                const start = pts[step.from];
                const end = pts[step.to];

                const x1 = ((start.x - minX) * scale) + offsetX;
                const y1 = ((start.y - minY) * scale) + offsetY;
                const x2 = ((end.x - minX) * scale) + offsetX;
                const y2 = ((end.y - minY) * scale) + offsetY;

                if (idx === 0) dPath += `M ${x1} ${y1} `;

                if (step.type === "curve") {
                    let cx = (x1 + x2) / 2;
                    let cy = (y1 + y2) / 2;

                    if (step.from === "B" && step.to === "A") { 
                        cx = x1; cy = y2; 
                    } else if (step.from === "C" && step.to === "D") { 
                        cx = x1 - (25 * (scale / 4)); cy = (y1 + y2) / 2; 
                    } else if (step.from === "A" && step.to === "B" && pattern.part === "Sleeve") { 
                        cx = x1 + ((x2 - x1) * 0.4); cy = y1 - (18 * (scale / 4)); 
                    }

                    dPath += `Q ${cx} ${cy}, ${x2} ${y2} `;
                } else {
                    dPath += `L ${x2} ${y2} `;
                }
            });
            dPath += "Z";
        }

        const pathEl = document.createElementNS(svgNS, "path");
        pathEl.setAttribute("d", dPath);
        pathEl.setAttribute("fill", "rgba(37, 99, 235, 0.04)");
        pathEl.setAttribute("stroke", "#2563eb");
        pathEl.setAttribute("stroke-width", "2");
        svg.appendChild(pathEl);

        // 4. Render Titik Merah & Teks Koordinat
        Object.entries(pts).forEach(([label, pt]) => {
            const cx = ((pt.x - minX) * scale) + offsetX;
            const cy = ((pt.y - minY) * scale) + offsetY;

            // Titik Merah
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", cx);
            circle.setAttribute("cy", cy);
            circle.setAttribute("r", "4");
            circle.setAttribute("fill", "#ef4444");
            svg.appendChild(circle);

            // Teks Label
            const text = document.createElementNS(svgNS, "text");
            let textX = cx + 8;
            let textY = cy + 4;

            // Pindahkan posisi teks jika menyenggol garis tepi kiri
            if (pt.x === minX) {
                textX = cx - 48;
            }

            text.setAttribute("x", textX);
            text.setAttribute("y", textY);
            text.setAttribute("font-size", "11px");
            text.setAttribute("font-family", "Arial, sans-serif");
            text.setAttribute("font-weight", "600");
            text.setAttribute("fill", "#334155");
            
            // Format angka desimal rapi (maks 2 angka dibelakang koma)
            const valX = Number.isInteger(pt.x) ? pt.x : pt.x.toFixed(2);
            const valY = Number.isInteger(pt.y) ? pt.y : pt.y.toFixed(2);
            text.textContent = `${label} (${valX}, ${valY})`;

            svg.appendChild(text);
        });

        return svg;
    }
}
