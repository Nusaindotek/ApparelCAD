export class ApparelCAD {
    constructor() {
        // Ukuran riil Shortpants Rib Knit (Panjang 30cm + Ban 3.5cm)
        this.sizeChart = {
            S:  { waist: 14, hip: 17, length: 30, crotchDepth: 20, leg: 18 },
            M:  { waist: 15, hip: 18.25, length: 30, crotchDepth: 21, leg: 19 },
            L:  { waist: 16.25, hip: 19.5, length: 30, crotchDepth: 22, leg: 20 },
            XL: { waist: 17.5, hip: 20.75, length: 30, crotchDepth: 23, leg: 21 }
        };
    }

    // Pembuatan geometri pola celana pendek dengan lekukan pesak akurat
    draftShortpantsPart(size, isBack = false) {
        const spec = this.sizeChart[size];
        const wWaist = spec.waist;
        const wHip = isBack ? spec.hip + 1.5 : spec.hip;
        const l = spec.length + 3.5;
        const cd = spec.crotchDepth;
        const crotchExt = isBack ? 7.5 : 3.5; // Kerukan pesak belakang lebih keluar
        const legW = spec.leg;
        const rise = isBack ? 3.0 : 0;

        // Path SVG dengan kurva pesak (Crotch Curve)
        return {
            part: `${isBack ? 'Belakang' : 'Depan'} (${size})`,
            size: size,
            width: wHip + crotchExt,
            height: l + rise,
            pathD: `
                M ${crotchExt} ${rise} 
                L ${crotchExt + wWaist} 0 
                L ${crotchExt + wHip} ${cd * 0.5} 
                L ${crotchExt + legW} ${l} 
                L ${crotchExt} ${l} 
                Q ${crotchExt * 0.2} ${cd * 0.7}, 0 ${cd} 
                Z
            `
        };
    }

    generateOptimizedMarker(fabricWidthCM = 80) {
        const sizes = ['XL', 'S', 'L', 'M'];
        let layoutPatterns = [];
        
        // Buat pola untuk 4 ukuran
        const patternsData = sizes.map(size => ({
            size,
            front: this.draftShortpantsPart(size, false),
            back: this.draftShortpantsPart(size, true)
        }));

        // Baris 1: XL & S
        const row1MaxH = Math.max(patternsData[0].front.height, patternsData[1].front.height);
        // Baris 2: L & M
        const row2MaxH = Math.max(patternsData[2].front.height, patternsData[3].front.height);

        // Baris 1 (Atas): Size XL di Kiri, Size S di Kanan
        layoutPatterns.push({ data: patternsData[0].front, offsetX: 2, offsetY: 5 });
        layoutPatterns.push({ data: patternsData[0].back, offsetX: patternsData[0].front.width + 5, offsetY: 5 });
        
        const rightColX = Math.max(fabricWidthCM / 2, (patternsData[0].front.width + patternsData[0].back.width) + 8);
        layoutPatterns.push({ data: patternsData[1].front, offsetX: rightColX, offsetY: 5 });
        layoutPatterns.push({ data: patternsData[1].back, offsetX: rightColX + patternsData[1].front.width + 3, offsetY: 5 });

        // Baris 2 (Bawah): Size L di Kiri, Size M di Kanan
        const yRow2 = row1MaxH + 12;
        layoutPatterns.push({ data: patternsData[2].front, offsetX: 2, offsetY: yRow2 });
        layoutPatterns.push({ data: patternsData[2].back, offsetX: patternsData[2].front.width + 5, offsetY: yRow2 });

        layoutPatterns.push({ data: patternsData[3].front, offsetX: rightColX, offsetY: yRow2 });
        layoutPatterns.push({ data: patternsData[3].back, offsetX: rightColX + patternsData[3].front.width + 3, offsetY: yRow2 });

        const totalLengthCM = yRow2 + row2MaxH + 8;
        const metersPerSpread = (totalLengthCM / 100).toFixed(2);

        return {
            fabricWidth: Number(fabricWidthCM),
            totalLengthCM: totalLengthCM,
            estimatedYieldMeters: metersPerSpread,
            patterns: layoutPatterns
        };
    }
}
