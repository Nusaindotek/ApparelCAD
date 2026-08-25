export class ApparelCAD {
    constructor() {
        // Ukuran potongan setengah pola Shortpants Rib Knit (cm)
        this.sizeChart = {
            S:  { waist: 16, hip: 20, length: 30, crotchDepth: 20, leg: 18 },
            M:  { waist: 17, hip: 21, length: 30, crotchDepth: 21, leg: 19 },
            L:  { waist: 18, hip: 22, length: 30, crotchDepth: 22, leg: 20 },
            XL: { waist: 19, hip: 23, length: 30, crotchDepth: 23, leg: 21 }
        };
    }

    // Pembuatan geometri persis sesuai diagram titik 1-17 gambar Anda
    draftShortpantsPart(size, isBack = false) {
        const spec = this.sizeChart[size];
        const wWaist = spec.waist;
        const wHip = spec.hip;
        const l = spec.length + 3.5; // Total tinggi celana
        const cd = spec.crotchDepth; // Tinggi pesak (Crotch Depth)
        const crotchExt = isBack ? 6.5 : 3.5; // Tonjolan pesak (Poin 15/17)
        const legW = spec.leg;
        const rise = isBack ? 3.0 : 0; // Kenaikan ban pinggang belakang (Poin 13)

        return {
            part: `${isBack ? 'Belakang' : 'Depan'} (${size})`,
            size: size,
            isBack: isBack,
            width: wHip + crotchExt,
            height: l + rise,
            // Koordinat Titik Sesuai Diagram
            points: {
                waistIn:   { x: crotchExt, y: 0 },                  // Poin 13 (Pinggang Dalam)
                waistOut:  { x: crotchExt + wWaist, y: rise },      // Poin 10/12 (Pinggang Samping)
                hipOut:    { x: crotchExt + wHip, y: cd },          // Poin 14/16 (Sisi Pinggul)
                legOut:    { x: crotchExt + legW, y: l + rise },    // Poin 2 (Paha Samping)
                legIn:     { x: crotchExt, y: l + rise },           // Poin 2 (Paha Dalam)
                crotchTip: { x: 0, y: cd + rise }                   // Poin 15/17 (Ujung Pesak Melengkung)
            },
            controlPoint: { x: crotchExt * 0.2, y: (cd + rise) * 0.85 }
        };
    }

    // Shelf-Packing Layout: Menyusun pola otomatis turun baris jika melebihi lebar kain
    generateOptimizedMarker(fabricWidthCM = 80) {
        const sizes = ['XL', 'L', 'M', 'S'];
        let allParts = [];

        sizes.forEach(size => {
            allParts.push(this.draftShortpantsPart(size, false));
            allParts.push(this.draftShortpantsPart(size, true));
        });

        let layoutPatterns = [];
        let currentX = 2;
        let currentY = 4;
        let maxHeightInRow = 0;
        const gap = 3;
        const margin = 2;

        allParts.forEach(part => {
            // Jika lebar menyentuh batas kain (80cm/90cm), pindah ke baris bawahnya
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
