export class ApparelCAD {
    constructor() {
        this.sizeChart = {
            S:  { waist: 55, hip: 68, length: 30, crotchDepth: 20, legOpening: 36 },
            M:  { waist: 60, hip: 73, length: 30, crotchDepth: 21, legOpening: 38 },
            L:  { waist: 65, hip: 78, length: 30, crotchDepth: 22, legOpening: 40 },
            XL: { waist: 70, hip: 83, length: 30, crotchDepth: 23, legOpening: 42 }
        };
    }

    draftLeggingPart(size, isBack = false) {
        const spec = this.sizeChart[size];
        const wWaist = spec.waist / 4;
        const wHip = isBack ? (spec.hip / 4) + 1.5 : spec.hip / 4;
        const l = spec.length + 3.5; // Termasuk kampuh ban pinggang elastis 3.5cm
        const cd = spec.crotchDepth;
        const crotchExt = isBack ? spec.hip / 10 : spec.hip / 20;
        const legW = spec.legOpening / 2;
        const rise = isBack ? 3.0 : 0;

        return {
            part: `${isBack ? 'Back' : 'Front'} (${size})`,
            size: size,
            width: wHip + crotchExt,
            height: l,
            points: {
                P1: { x: 0, y: -rise - 3.5 },
                P2: { x: wWaist, y: -3.5 },
                P3: { x: wHip, y: cd * 0.6 },
                P4: { x: legW, y: l - 3.5 },
                P5: { x: -legW * 0.2, y: l - 3.5 },
                P6: { x: -crotchExt, y: cd }
            },
            path: [
                { from: 'P1', to: 'P2', type: 'line' },
                { from: 'P2', to: 'P3', type: 'line' },
                { from: 'P3', to: 'P4', type: 'line' },
                { from: 'P4', to: 'P5', type: 'line' },
                { from: 'P5', to: 'P6', type: 'line' },
                { from: 'P6', to: 'P1', type: 'curve', cpx: -crotchExt * (isBack ? 0.8 : 0.5), cpy: cd * 0.4 }
            ]
        };
    }

    // Auto-Nesting Full Set (S, M, L, XL) & Kalkulasi Panjang Kain per 1 Gelaran
    generateFullSetMarker(fabricWidthCM = 80) {
        const sizes = ['S', 'M', 'L', 'XL'];
        let layoutPatterns = [];
        let currentX = 5;
        let currentY = 5;
        let maxHeightInRow = 0;

        sizes.forEach(size => {
            const front = this.draftLeggingPart(size, false);
            const back = this.draftLeggingPart(size, true);
            const itemMaxH = Math.max(front.height, back.height);
            const combinedWidth = front.width + back.width + 4;

            // Jika ruang horizontal tidak muat di lebar kain, pindah baris ke bawah
            if (currentX + combinedWidth > fabricWidthCM - 2) {
                currentX = 5;
                currentY += maxHeightInRow + 5;
                maxHeightInRow = 0;
            }

            // Susun pola Front dan Back berdampingan
            layoutPatterns.push({ data: front, offsetX: currentX, offsetY: currentY, rotate: 0 });
            layoutPatterns.push({ data: back, offsetX: currentX + front.width + 2, offsetY: currentY, rotate: 0 });

            currentX += combinedWidth + 4;
            if (itemMaxH > maxHeightInRow) maxHeightInRow = itemMaxH;
        });

        const totalMarkerHeightCM = currentY + maxHeightInRow + 8; // Margin pemotongan
        const metersPerSpread = (totalMarkerHeightCM / 100).toFixed(2); // Hasil meter per 1 kali gelar

        return {
            fabricWidth: Number(fabricWidthCM),
            patternHeight: totalMarkerHeightCM,
            estimatedYield: metersPerSpread,
            totalPcs: 4, // 1 Set Komplit (S, M, L, XL)
            patterns: layoutPatterns
        };
    }
}
