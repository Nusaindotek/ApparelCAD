export class ApparelCAD {
    constructor() {
        this.sizeChart = {
            S:  { waist: 18, hip: 21, length: 30, crotchDepth: 20, leg: 19 },
            M:  { waist: 19, hip: 22, length: 30, crotchDepth: 21, leg: 20 },
            L:  { waist: 20, hip: 23, length: 30, crotchDepth: 22, leg: 21 },
            XL: { waist: 21, hip: 24, length: 30, crotchDepth: 23, leg: 22 }
        };
    }

    draftShortpantsPart(size, isBack = false) {
        const spec = this.sizeChart[size];
        const wWaist = spec.waist;
        const wHip = isBack ? spec.hip + 1.5 : spec.hip;
        const l = spec.length + 3.5;
        const cd = spec.crotchDepth;
        const crotchExt = isBack ? 6.0 : 3.0;
        const legW = spec.leg;
        const rise = isBack ? 2.5 : 0;

        const boundingWidth = wHip + crotchExt;
        const boundingHeight = l + rise;

        return {
            part: `${isBack ? 'Belakang' : 'Depan'} (${size})`,
            size: size,
            isBack: isBack,
            width: boundingWidth,
            height: boundingHeight,
            points: {
                topLeft:   { x: crotchExt, y: rise },
                topRight:  { x: crotchExt + wWaist, y: 0 },
                hipRight:  { x: crotchExt + wHip, y: cd * 0.6 },
                hemRight:  { x: crotchExt + legW, y: l + rise },
                hemLeft:   { x: crotchExt, y: l + rise },
                crotchTip: { x: 0, y: cd + rise }
            },
            controlPoint: { x: crotchExt * 0.25, y: (cd + rise) * 0.75 }
        };
    }

    // Algoritma Shelf Packing: Otomatis turun baris jika melebihi lebar kain aktual
    generateOptimizedMarker(fabricWidthCM = 80) {
        const sizes = ['XL', 'L', 'M', 'S'];
        let allParts = [];

        // Kumpulkan 8 bagian pola lengkap (Depan & Belakang untuk S, M, L, XL)
        sizes.forEach(size => {
            allParts.push(this.draftShortpantsPart(size, false));
            allParts.push(this.draftShortpantsPart(size, true));
        });

        let layoutPatterns = [];
        let currentX = 3;
        let currentY = 4;
        let maxHeightInRow = 0;
        const gap = 3;
        const margin = 3;

        allParts.forEach(part => {
            // Jika lebar melebihi batas kain, pindah ke baris ke bawah
            if (currentX + part.width > fabricWidthCM - margin) {
                currentX = margin;
                currentY += maxHeightInRow + gap;
                maxHeightInRow = 0;
            }

            layoutPatterns.push({
                data: part,
                offsetX: currentX,
                offsetY: currentY
            });

            currentX += part.width + gap;
            if (part.height > maxHeightInRow) {
                maxHeightInRow = part.height;
            }
        });

        const totalLengthCM = currentY + maxHeightInRow + margin;
        const metersPerSpread = (totalLengthCM / 100).toFixed(2);

        return {
            fabricWidth: Number(fabricWidthCM),
            totalLengthCM: totalLengthCM,
            estimatedYieldMeters: metersPerSpread,
            patterns: layoutPatterns
        };
    }
}
