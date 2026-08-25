export class ApparelCAD {
    constructor() {
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
        const crotchExt = spec.hip / 24;
        const legW = spec.legOpening / 2;

        return {
            part: "Front Legging", size: size,
            points: {
                A: { x: 0, y: 1 },
                B: { x: wWaist, y: 0 },
                C: { x: wHip, y: cd * 0.5 },
                D: { x: legW, y: l },
                E: { x: -crotchExt, y: l },
                F: { x: -crotchExt, y: cd }
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
        const crotchExt = spec.hip / 12;
        const legW = (spec.legOpening / 2) + 1;
        const rise = 2.5;

        return {
            part: "Back Legging", size: size,
            points: {
                A: { x: 0, y: -rise },
                B: { x: wWaist, y: 0 },
                C: { x: wHip, y: cd * 0.5 },
                D: { x: legW, y: l },
                E: { x: -crotchExt, y: l },
                F: { x: -crotchExt, y: cd }
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

    // Perhitungan khusus Kain Tubular (Default 80cm lipat = 160cm keliling)
    generateMarker(size, fabricWidthCM = 80, isTubular = true) {
        const front = this.draftShortLeggingFront(size);
        const back = this.draftShortLeggingBack(size);
        const spec = this.sizeChart[size] || this.sizeChart['M'];
        
        const patternHeight = spec.length + 5; // Toleransi kelim/pinggang
        let requiredLengthMeters = 0;
        let layoutPatterns = [];

        if (isTubular) {
            // Pada kain tubular 80cm, 1 layer (2 lapis kain) cukup untuk 1 pasang legging (kiri & kanan)
            // Pola disusun bertumpuk/berselang-seling secara vertikal
            requiredLengthMeters = ((patternHeight * 2) + 4) / 100;

            layoutPatterns = [
                { data: front, offsetX: 10, offsetY: 5, rotate: 0 },
                { data: back, offsetX: (spec.hip / 4) + 15, offsetY: patternHeight + 10, rotate: 180 }
            ];
        } else {
            // Jika kain dibelah (Open Width 160cm)
            requiredLengthMeters = (patternHeight + 4) / 100;

            layoutPatterns = [
                { data: front, offsetX: 10, offsetY: 5, rotate: 0 },
                { data: back, offsetX: (spec.hip / 2) + 20, offsetY: patternHeight, rotate: 180 }
            ];
        }

        return {
            size: size,
            isTubular: isTubular,
            fabricWidth: fabricWidthCM,
            patternHeight: isTubular ? (patternHeight * 2) + 15 : patternHeight + 10,
            estimatedYield: requiredLengthMeters.toFixed(2),
            patterns: layoutPatterns
        };
    }
}
