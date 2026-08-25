export class ApparelCAD {
    constructor() {
        this.sizeChart = {
            S:  { waist: 55, hip: 68, length: 30, crotchDepth: 20, legOpening: 36 },
            M:  { waist: 60, hip: 73, length: 30, crotchDepth: 21, legOpening: 38 },
            L:  { waist: 65, hip: 78, length: 30, crotchDepth: 22, legOpening: 40 },
            XL: { waist: 70, hip: 83, length: 30, crotchDepth: 23, legOpening: 42 }
        };
    }

    // Generator Pola dengan tambahan tinggi ban pinggang (Waistband allowance +3.5cm)
    draftLeggingPart(size, type, isBack = false) {
        const spec = this.sizeChart[size];
        const wWaist = spec.waist / 4;
        const wHip = isBack ? (spec.hip / 4) + 1.5 : spec.hip / 4;
        const l = spec.length + 3.5; // +3.5 cm extra untuk lipatan ban pinggang elastis
        const cd = spec.crotchDepth;
        const crotchExt = isBack ? spec.hip / 10 : spec.hip / 20;
        const legW = isBack ? (spec.legOpening / 2) : (spec.legOpening / 2);
        const rise = isBack ? 3.0 : 0;

        return {
            part: `${isBack ? 'Back' : 'Front'} (${size})`,
            size: size,
            width: wHip + crotchExt,
            height: l,
            points: {
                P1: { x: 0, y: -rise - 3.5 },          // Batas atas lipatan ban pinggang
                P2: { x: wWaist, y: -3.5 },            // Sisi pinggang
                P3: { x: wHip, y: cd * 0.6 },          // Panggul
                P4: { x: legW, y: l - 3.5 },           // Bukaan kaki luar
                P5: { x: -legW * 0.2, y: l - 3.5 },    // Bukaan kaki dalam
                P6: { x: -crotchExt, y: cd }           // Ujung pesak
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

    // Marker Cerdas: Menggabungkan Ukuran Berbeda (Misal: XL & S) di Lebar 80cm
    generateInterlockMarker(leftSize = 'XL', rightSize = 'S', fabricWidthCM = 80) {
        const leftFront = this.draftLeggingPart(leftSize, 'front', false);
        const leftBack = this.draftLeggingPart(leftSize, 'back', true);
        
        const rightFront = this.draftLeggingPart(rightSize, 'front', false);
        const rightBack = this.draftLeggingPart(rightSize, 'back', true);

        // Tinggi total marker menyesuaikan ukuran terpanjang
        const maxH = Math.max(leftFront.height, leftBack.height, rightFront.height, rightBack.height);
        const markerHeight = (maxH * 2) + 10;

        // Susunan Interlocking: Sisi kiri (Misal XL besar) dikunci berpasangan dengan Sisi kanan (Misal S kecil)
        // Agar pas di lebar 80cm tanpa waste berlebih
        const layoutPatterns = [
            // Sisi Kiri Kain (Ukuran Besar: XL)
            { data: leftFront, offsetX: 5, offsetY: 2, rotate: 0 },
            { data: leftBack, offsetX: 5, offsetY: maxH + 5, rotate: 0 },

            // Sisi Kanan Kain (Ukuran Kecil: S - Diselang-seling posisinya agar mengunci ruang kosong)
            { data: rightFront, offsetX: fabricWidthCM / 2 + 2, offsetY: 2, rotate: 0 },
            { data: rightBack, offsetX: fabricWidthCM / 2 + 2, offsetY: maxH + 5, rotate: 0 }
        ];

        // Estimasi efisiensi kain gabungan
        const totalYield = (markerHeight / 100).toFixed(2);

        return {
            fabricWidth: Number(fabricWidthCM),
            patternHeight: markerHeight,
            estimatedYield: totalYield,
            description: `Kombinasi Interlock: Kiri (${leftSize}) & Kanan (${rightSize})`,
            patterns: layoutPatterns
        };
    }
}
