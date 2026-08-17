export class SVGRenderer {
    static render(pattern) {
        // Cari bounding box (batas min/max koordinat)
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        Object.values(pattern.points).forEach(pt => {
            if (pt.x < minX) minX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y > maxY) maxY = pt.y;
        });

        // Tambahkan margin di sekitar pola agar titik & teks tidak terpotong
        const margin = 5;
        const width = (maxX - minX) + (margin * 2);
        const height = (maxY - minY) + (margin * 2);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", `${minX - margin} ${minY - margin} ${width} ${height}`);
        svg.setAttribute("width", "340");
        svg.setAttribute("height", "450");
        svg.style.background = "#ffffff";
        svg.style.border = "1px dashed #cbd5e1";
        svg.style.borderRadius = "6px";

        // 1. Gambar Path/Garis Pola Utama
        let pathD = "";
        pattern.path.forEach((segment, index) => {
            const start = pattern.points[segment.from];
            const end = pattern.points[segment.to];

            if (index === 0) {
                pathD += `M ${start.x} ${start.y} `;
            }

            if (segment.type === "line") {
                pathD += `L ${end.x} ${end.y} `;
            } else if (segment.type === "curve") {
                // Kalkulasi Bezier curve sederhana yang mulus untuk kerungan
                const controlX = (start.x + end.x) / 2;
                const controlY = Math.max(start.y, end.y);
                pathD += `Q ${controlX} ${controlY} ${end.x} ${end.y} `;
            }
        });

        const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathEl.setAttribute("d", pathD);
        pathEl.setAttribute("fill", "rgba(37, 99, 235, 0.05)");
        pathEl.setAttribute("stroke", "#2563eb");
        pathEl.setAttribute("stroke-width", "0.8");
        svg.appendChild(pathEl);

        // 2. Gambar Titik Koordinat & Label Nama Titik
        Object.entries(pattern.points).forEach(([name, pt]) => {
            // Lingkaran Titik (Node)
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", pt.x);
            circle.setAttribute("cy", pt.y);
            circle.setAttribute("r", "0.9");
            circle.setAttribute("fill", "#ef4444");
            svg.appendChild(circle);

            // Teks Label (Nama titik & Nilai x,y)
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            
            // Penyesuaian offset posisi teks agar tidak saling bertumpuk
            let offsetX = 1.2;
            let offsetY = -1.2;
            if (pt.x === 0) offsetX = -4.5; // Jika di garis lipatan tengah

            text.setAttribute("x", pt.x + offsetX);
            text.setAttribute("y", pt.y + offsetY);
            text.setAttribute("font-size", "2.2");
            text.setAttribute("font-family", "sans-serif");
            text.setAttribute("font-weight", "bold");
            text.setAttribute("fill", "#1e293b");
            text.textContent = `${name} (${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`;
            svg.appendChild(text);
        });

        return svg;
    }
}
