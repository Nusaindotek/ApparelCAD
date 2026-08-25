export class ApparelCAD {
    constructor() {
        this.sizeChart = {
            S:  { waist: 16, hip: 20, length: 30, crotchDepth: 20, leg: 18 },
            M:  { waist: 17, hip: 21, length: 30, crotchDepth: 21, leg: 19 },
            L:  { waist: 18, hip: 22, length: 30, crotchDepth: 22, leg: 20 },
            XL: { waist: 19, hip: 23, length: 30, crotchDepth: 23, leg: 21 }
        };
    }

    draftShortpantsPart(size, isBack = false) {
        const spec = this.sizeChart[size];
        const wWaist = spec.waist;
        const wHip = spec.hip;
        const l = spec.length + 3.5;
        const cd = spec.crotchDepth;
        const crotchExt = isBack ? 6.5 : 3.5;
        const legW = spec.leg;
        const rise = isBack ? 3.0 : 0;

        return {
            part: `${isBack ? 'Belakang' : 'Depan'} (${size})`,
            size: size,
            isBack: isBack,
            width: wHip + crotchExt,
            height: l + rise,
            crotchExt: crotchExt,
            points: {
                waistIn:   { x: crotchExt, y: rise },
                waistOut:  { x: crotchExt + wWaist, y: 0 },
                hipOut:    { x: crotchExt + wHip, y: cd * 0.7 },
                legOut:    { x: crotchExt + legW, y: l + rise },
                legIn:     { x: crotchExt, y: l + rise },
                crotchTip: { x: 0, y: cd + rise }
            },
            controlPoint: { x: crotchExt * 0.25, y: (cd + rise) * 0.6 }
        };
    }

    // Algoritma Interlocking Nesting (Saling mengisi lekukan agar efisien & hemat kain)
    generateOptimizedMarker(fabricWidthCM = 80) {
        const sizes = ['XL', 'L', 'M', 'S'];
        let layoutPatterns = [];

        let currentY = 3; // Margin atas kain
        const marginX = 2; // Margin samping kain
        const gap = 0.5;   // Jarak minimal antar potongan kain (0.5 cm agar rapat)

        sizes.forEach(size => {
            const front = this.draftShortpantsPart(size, false);
            const back  = this.draftShortpantsPart(size, true);

            // Cek apakah 1 pasang (Depan + Belakang Terbalik) muat dalam 1 baris kain
            // Dengan cara rotasi 180 derajat pada pola belakang, pesak saling menyelip (interlock)
            const nestedPairWidth = front.width + back.width - Math.min(front.crotchExt, back.crotchExt);

            if (nestedPairWidth + (marginX * 2) <= fabricWidthCM) {
                // POSISI 1 BARIS (Interlocking rapat)
                // Pola Depan tegak
                layoutPatterns.push({
                    data: front,
                    offsetX: marginX,
                    offsetY: currentY,
                    rotation: 0
                });

                // Pola Belakang DIPUTAR 180° agar pesak masuk ke ceruk pinggang/pesak depan
                layoutPatterns.push({
                    data: back,
                    offsetX: marginX + front.width + back.width - 2, // Saling selip rapat
                    offsetY: currentY + back.height,
                    rotation: 180
                });

                currentY += Math.max(front.height, back.height) + gap;
            } else {
                // POSISI BERTINGKAT (Jika lebar kain tidak cukup)
                layoutPatterns.push({
                    data: front,
                    offsetX: marginX,
                    offsetY: currentY,
                    rotation: 0
                });
                currentY += front.height + gap;

                layoutPatterns.push({
                    data: back,
                    offsetX: marginX,
                    offsetY: currentY,
                    rotation: 0
                });
                currentY += back.height + gap;
            }
        });

        const totalLengthCM = currentY + 2;
        const metersPerSpread = (totalLengthCM / 100).toFixed(2);

        return {
            fabricWidth: Number(fabricWidthCM),
            totalLengthCM: totalLengthCM,
            estimatedYieldMeters: metersPerSpread,
            patterns: layoutPatterns
        };
    }
}
