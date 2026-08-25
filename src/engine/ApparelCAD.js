export class ApparelCAD {
    constructor() {
        // Spec Spesifik Shortpants (Panjang 30 cm + Ban Pinggang 3.5 cm)
        this.sizeChart = {
            S:  { waist: 55, hip: 68, length: 30, crotchDepth: 20, legOpening: 36 },
            M:  { waist: 60, hip: 73, length: 30, crotchDepth: 21, legOpening: 38 },
            L:  { waist: 65, hip: 78, length: 30, crotchDepth: 22, legOpening: 40 },
            XL: { waist: 70, hip: 83, length: 30, crotchDepth: 23, legOpening: 42 }
        };
    }

    // Geometri Pola Celana Pendek
    draftShortpantsPart(size, isBack = false) {
        const spec = this.sizeChart[size];
        const wWaist = spec.waist / 4;
        const wHip = isBack ? (spec.hip / 4) + 1.5 : spec.hip / 4;
        const l = spec.length + 3.5; // Karet elastis ban pinggang
        const cd = spec.crotchDepth;
        const crotchExt = isBack ? spec.hip / 10 : spec.hip / 20;
        const legW = spec.legOpening / 2;
        const rise = isBack ? 3.0 : 0;

        return {
            part: `${isBack ? 'Belakang' : 'Depan'} (${size})`,
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

    // Penguncian Layout Anti-Waste Pasangan (XL + S) dan (L + M)
    generateOptimizedMarker(fabricWidthCM = 80) {
        const pairs = [
            { big: 'XL', small: 'S' },
            { big: 'L',  small: 'M' }
        ];

        let layoutPatterns = [];
        let currentY = 5;

        pairs.forEach(pair => {
            const bigFront = this.draftShortpantsPart(pair.big, false);
            const bigBack = this.draftShortpantsPart(pair.big, true);
            const smallFront = this.draftShortpantsPart(pair.small, false);
            const smallBack = this.draftShortpantsPart(pair.small, true);

            const rowHeight = Math.max(bigFront.height, bigBack.height) + 5;

            // Susun Interlock: Ukuran Besar di Sisi Kiri, Ukuran Kecil Diputar di Sisi Kanan Memanfaatkan Ruang Kosong
            layoutPatterns.push({ data: bigFront, offsetX: 5, offsetY: currentY, rotate: 0 });
            layoutPatterns.push({ data: bigBack, offsetX: bigFront.width + 5, offsetY: currentY, rotate: 0 });
            
            // Sisi kanan kain (Selang-seling/Interlock)
            const rightX = Math.max(fabricWidthCM / 2, bigFront.width + bigBack.width + 10);
            layoutPatterns.push({ data: smallFront, offsetX: rightX, offsetY: currentY, rotate: 0 });
            layoutPatterns.push({ data: smallBack, offsetX: rightX + smallFront.width + 2, offsetY: currentY, rotate: 0 });

            currentY += rowHeight;
        });

        const totalLengthCM = currentY + 5;
        const metersPerSpread = (totalLengthCM / 100).toFixed(2); // Panjang kain per 1 kali gelar

        return {
            fabricWidth: Number(fabricWidthCM),
            totalLengthCM: totalLengthCM,
            estimatedYieldMeters: metersPerSpread,
            patterns: layoutPatterns
        };
    }
}
