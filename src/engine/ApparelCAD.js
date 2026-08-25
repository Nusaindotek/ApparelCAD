export class ApparelCAD {
    constructor() {
        // Standar potongan setengah pola Shortpants Rib Knit (cm)
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
        const crotchExt = isBack ? 6.0 : 3.0; // Kerukan pesak
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

    generateOptimizedMarker(fabricWidthCM = 80) {
        const pairs = [
            { bigSize: 'XL', smallSize: 'S' },
            { bigSize: 'L',  smallSize: 'M' }
        ];

        let layoutPatterns = [];
        let currentY = 4; // Margin atas 4 cm
        const marginX = 2; // Margin tepi kain 2 cm
        const gap = 3;     // Jarak minimal antar-pola 3 cm

        pairs.forEach(pair => {
            const bigF = this.draftShortpantsPart(pair.bigSize, false);
            const bigB = this.draftShortpantsPart(pair.bigSize, true);
            const smF  = this.draftShortpantsPart(pair.smallSize, false);
            const smB  = this.draftShortpantsPart(pair.smallSize, true);

            // Perhitungan Posisi X Kumulatif Tanpa Bentrok (Strict Non-Overlapping)
            const x1 = marginX;
            const x2 = x1 + bigF.width + gap;
            const x3 = x2 + bigB.width + gap;
            const x4 = x3 + smF.width + gap;

            // Masukkan ke susunan layout
            layoutPatterns.push({ data: bigF, offsetX: x1, offsetY: currentY });
            layoutPatterns.push({ data: bigB, offsetX: x2, offsetY: currentY });
            layoutPatterns.push({ data: smF,  offsetX: x3, offsetY: currentY });
            layoutPatterns.push({ data: smB,  offsetX: x4, offsetY: currentY });

            // Hitung tinggi maksimum baris
            const rowHeight = Math.max(bigF.height, bigB.height, smF.height, smB.height);
            currentY += rowHeight + gap;
        });

        const totalLengthCM = currentY + marginX;
        const metersPerSpread = (totalLengthCM / 100).toFixed(2);

        return {
            fabricWidth: Number(fabricWidthCM),
            totalLengthCM: totalLengthCM,
            estimatedYieldMeters: metersPerSpread,
            patterns: layoutPatterns
        };
    }
}
