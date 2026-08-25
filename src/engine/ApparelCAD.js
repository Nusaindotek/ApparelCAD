export class ApparelCAD {
    constructor() {
        // Spec Shortpants (Panjang 30cm + Ban 3.5cm)
        this.sizeChart = {
            S:  { waist: 14, hip: 17, length: 30, crotchDepth: 20, leg: 18 },
            M:  { waist: 15, hip: 18.25, length: 30, crotchDepth: 21, leg: 19 },
            L:  { waist: 16.25, hip: 19.5, length: 30, crotchDepth: 22, leg: 20 },
            XL: { waist: 17.5, hip: 20.75, length: 30, crotchDepth: 23, leg: 21 }
        };
    }

    draftShortpantsPart(size, isBack = false) {
        const spec = this.sizeChart[size];
        const wWaist = spec.waist;
        const wHip = isBack ? spec.hip + 1.5 : spec.hip;
        const l = spec.length + 3.5;
        const cd = spec.crotchDepth;
        const crotchExt = isBack ? 7.5 : 3.5;
        const legW = spec.leg;
        const rise = isBack ? 3.0 : 0;

        return {
            part: `${isBack ? 'Belakang' : 'Depan'} (${size})`,
            size: size,
            width: wHip + crotchExt + 2,
            height: l + rise,
            // Titik koordinat geometris akurat celana
            points: {
                topRight: { x: crotchExt + wWaist, y: 0 },
                hipRight: { x: crotchExt + wHip, y: cd * 0.5 },
                hemRight: { x: crotchExt + legW, y: l },
                hemLeft:  { x: crotchExt, y: l },
                crotchTip: { x: 0, y: cd },
                topLeft:  { x: crotchExt, y: rise }
            },
            // Titik kontrol kelengkungan pesak (Crotch Bezier Curve)
            controlPoint: { x: crotchExt * 0.3, y: cd * 0.7 }
        };
    }

    generateOptimizedMarker(fabricWidthCM = 80) {
        const sizes = ['XL', 'S', 'L', 'M'];
        const patternsData = sizes.map(size => ({
            size,
            front: this.draftShortpantsPart(size, false),
            back: this.draftShortpantsPart(size, true)
        }));

        let layoutPatterns = [];
        
        // Jarak aman horizontal antar pola (Mencegah Overlap)
        const gap = 4;
        
        // Baris 1: XL (Kiri) & S (Kanan)
        const xlFront = patternsData[0].front;
        const xlBack = patternsData[0].back;
        const sFront = patternsData[1].front;
        const sBack = patternsData[1].back;

        const row1MaxH = Math.max(xlFront.height, xlBack.height, sFront.height, sBack.height);

        layoutPatterns.push({ data: xlFront, offsetX: 3, offsetY: 5 });
        layoutPatterns.push({ data: xlBack, offsetX: 3 + xlFront.width + gap, offsetY: 5 });

        const rightColX = Math.max(fabricWidthCM / 2 + 2, 3 + xlFront.width + xlBack.width + (gap * 2));
        layoutPatterns.push({ data: sFront, offsetX: rightColX, offsetY: 5 });
        layoutPatterns.push({ data: sBack, offsetX: rightColX + sFront.width + gap, offsetY: 5 });

        // Baris 2: L (Kiri) & M (Kanan)
        const lFront = patternsData[2].front;
        const lBack = patternsData[2].back;
        const mFront = patternsData[3].front;
        const mBack = patternsData[3].back;

        const row2MaxH = Math.max(lFront.height, lBack.height, mFront.height, mBack.height);
        const yRow2 = row1MaxH + 15;

        layoutPatterns.push({ data: lFront, offsetX: 3, offsetY: yRow2 });
        layoutPatterns.push({ data: lBack, offsetX: 3 + lFront.width + gap, offsetY: yRow2 });

        layoutPatterns.push({ data: mFront, offsetX: rightColX, offsetY: yRow2 });
        layoutPatterns.push({ data: mBack, offsetX: rightColX + mFront.width + gap, offsetY: yRow2 });

        const totalLengthCM = yRow2 + row2MaxH + 10;
        const metersPerSpread = (totalLengthCM / 100).toFixed(2);

        return {
            fabricWidth: Number(fabricWidthCM),
            totalLengthCM: totalLengthCM,
            estimatedYieldMeters: metersPerSpread,
            patterns: layoutPatterns
        };
    }
}
