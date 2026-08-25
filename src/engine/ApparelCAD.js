export class ApparelCAD {
    constructor() {
        // Spesifikasi persis sesuai tabel acuan produk Anda
        this.sizeChart = {
            S:  { waist: 55, hip: 68, length: 30, crotchDepth: 22, legOpening: 36 },
            M:  { waist: 60, hip: 73, length: 30, crotchDepth: 23, legOpening: 38 },
            L:  { waist: 65, hip: 78, length: 30, crotchDepth: 24, legOpening: 40 },
            XL: { waist: 70, hip: 83, length: 30, crotchDepth: 25, legOpening: 42 }
        };
    }

    draftShortLeggingFront(size) {
        const spec = this.sizeChart[size] || this.sizeChart['M'];
        const wWaist = spec.waist / 4;
        const wHip = spec.hip / 4;
        const l = spec.length;
        const cd = spec.crotchDepth;
        const crotchExt = spec.hip / 24; // Ekstensi pesak depan pas ketat
        const legW = spec.legOpening / 2;

        return {
            part: "Front Legging", size: size,
            points: {
                A: { x: 0, y: 1 },              // Tengah pinggang depan (turun 1cm)
                B: { x: wWaist, y: 0 },         // Sisi pinggang
                C: { x: wHip, y: cd * 0.5 },     // Pinggul
                D: { x: legW, y: l },           // Sisi bawah (Outseam)
                E: { x: -crotchExt, y: l },     // Paha dalam bawah
                F: { x: -crotchExt, y: cd }      // Ujung pesak depan
            },
            path: [
                { from: 'A', to: 'B', type: 'line' },
                { from: 'B', to: 'C', type: 'line' },
                { from: 'C', to: 'D', type: 'line' },
                { from: 'D', to: 'E', type: 'line' },
                { from: 'E', to: 'F', type: 'line' },
                { from: 'F', to: 'A', type: 'curve', cpx: 0, cpy: cd * 0.75 }
            ]
        };
    }

    draftShortLeggingBack(size) {
        const spec = this.sizeChart[size] || this.sizeChart['M'];
        const wWaist = spec.waist / 4;
        const wHip = (spec.hip / 4) + 1;
        const l = spec.length;
        const cd = spec.crotchDepth;
        const crotchExt = spec.hip / 12; // Ekstensi pesak belakang untuk bentuk bokong
        const legW = (spec.legOpening / 2) + 1;
        const rise = 2.5;                // Naik pinggang belakang

        return {
            part: "Back Legging", size: size,
            points: {
                A: { x: 0, y: -rise },          // Tengah pinggang belakang (naik 2.5cm)
                B: { x: wWaist, y: 0 },         // Sisi pinggang
                C: { x: wHip, y: cd * 0.5 },    // Pinggul
                D: { x: legW, y: l },           // Sisi bawah
                E: { x: -crotchExt, y: l },     // Paha dalam bawah
                F: { x: -crotchExt, y: cd }     // Ujung pesak belakang
            },
            path: [
                { from: 'A', to: 'B', type: 'line' },
                { from: 'B', to: 'C', type: 'line' },
                { from: 'C', to: 'D', type: 'line' },
                { from: 'D', to: 'E', type: 'line' },
                { from: 'E', to: 'F', type: 'line' },
                { from: 'F', to: 'A', type: 'curve', cpx: -crotchExt * 0.2, cpy: cd * 0.6 }
            ]
        };
    }

    // Perhitungan penggunaan kain (Marker/Nesting)
    generateMarker(size, fabricWidthCM = 150) {
        const front = this.draftShortLeggingFront(size);
        const back = this.draftShortLeggingBack(size);
        const spec = this.sizeChart[size] || this.sizeChart['M'];
        
        // Mengatur susunan interlocking (Pola belakang diputar 180 derajat)
        const margin = 2;
        const patternHeight = spec.length + 6; // Termasuk space kelim & karet
        
        // Menghitung estimasi panjang kain yang terpakai per 1 pasang (depan & belakang)
        const estimatedYieldMeters = (patternHeight + margin) / 100;

        return {
            size: size,
            fabricWidth: fabricWidthCM,
            patternHeight: patternHeight,
            estimatedYield: estimatedYieldMeters.toFixed(2),
            patterns: [
                { data: front, offsetX: 10, offsetY: 5, rotate: 0 },
                { data: back, offsetX: (spec.hip / 2) + 20, offsetY: patternHeight, rotate: 180 }
            ]
        };
    }
}
