export class ApparelCAD {
    constructor() {
        // Size chart riil untuk Short Legging Rib Knit (Lebar Pinggang relaxed & Panjang 30cm)
        this.sizeChart = {
            S:  { waist: 55, hip: 68, length: 30, crotchDepth: 20, legOpening: 36 },
            M:  { waist: 60, hip: 73, length: 30, crotchDepth: 21, legOpening: 38 },
            L:  { waist: 65, hip: 78, length: 30, crotchDepth: 22, legOpening: 40 },
            XL: { waist: 70, hip: 83, length: 30, crotchDepth: 23, legOpening: 42 }
        };
    }

    // Pola Depan Short Legging
    draftShortLeggingFront(size) {
        const spec = this.sizeChart[size] || this.sizeChart['M'];
        const wWaist = spec.waist / 4;      // Lebar seperempat pinggang
        const wHip = spec.hip / 4;          // Lebar seperempat panggul
        const l = spec.length;              // Panjang celana (30 cm)
        const cd = spec.crotchDepth;        // Tinggi pesak
        const crotchExt = spec.hip / 20;    // Kerukan pesak depan
        const legW = spec.legOpening / 2;   // Lebar bukaan kaki per sisi

        return {
            part: "Front Legging", size: size,
            width: wHip + crotchExt,
            height: l,
            points: {
                P1: { x: 0, y: 0 },                    // Titik tengah atas (center front waist)
                P2: { x: wWaist, y: -0.5 },            // Sisi pinggang atas (turun sedikit)
                P3: { x: wHip, y: cd * 0.6 },          // Titik panggul
                P4: { x: legW, y: l },                 // Bukaan kaki luar (hem)
                P5: { x: -legW * 0.2, y: l },          // Bukaan kaki dalam (inseam)
                P6: { x: -crotchExt, y: cd }           // Titik ujung pesak depan
            },
            path: [
                { from: 'P1', to: 'P2', type: 'line' },
                { from: 'P2', to: 'P3', type: 'line' },
                { from: 'P3', to: 'P4', type: 'line' },
                { from: 'P4', to: 'P5', type: 'line' },
                { from: 'P5', to: 'P6', type: 'line' },
                { from: 'P6', to: 'P1', type: 'curve', cpx: -crotchExt * 0.5, cpy: cd * 0.3 } // Lengkungan pesak mulus
            ]
        };
    }

    // Pola Belakang Short Legging (Lebih tinggi di bagian belakang / rise)
    draftShortLeggingBack(size) {
        const spec = this.sizeChart[size] || this.sizeChart['M'];
        const wWaist = spec.waist / 4;
        const wHip = (spec.hip / 4) + 1.5;      // Panggul belakang sedikit lebih lebar
        const l = spec.length;
        const cd = spec.crotchDepth;
        const crotchExt = spec.hip / 10;        // Kerukan pesak belakang lebih panjang untuk bokong
        const legW = (spec.legOpening / 2);
        const backRise = 3.0;                   // Naik pinggang belakang

        return {
            part: "Back Legging", size: size,
            width: wHip + crotchExt,
            height: l + backRise,
            points: {
                P1: { x: 0, y: -backRise },         // Tengah pinggang belakang (naik 3cm)
                P2: { x: wWaist, y: 0 },            // Sisi pinggang belakang
                P3: { x: wHip, y: cd * 0.6 },       // Panggul belakang
                P4: { x: legW, y: l },              // Bukaan kaki luar
                P5: { x: -legW * 0.2, y: l },       // Bukaan kaki dalam
                P6: { x: -crotchExt, y: cd }        // Ujung pesak belakang
            },
            path: [
                { from: 'P1', to: 'P2', type: 'line' },
                { from: 'P2', to: 'P3', type: 'line' },
                { from: 'P3', to: 'P4', type: 'line' },
                { from: 'P4', to: 'P5', type: 'line' },
                { from: 'P5', to: 'P6', type: 'line' },
                { from: 'P6', to: 'P1', type: 'curve', cpx: -crotchExt * 0.8, cpy: cd * 0.4 }
            ]
        };
    }

    // Sistem Tata Letak Marker anti-tabrakan untuk Kain Tubular
    generateMarker(size, fabricWidthCM = 80, isTubular = true) {
        const front = this.draftShortLeggingFront(size);
        const back = this.draftShortLeggingBack(size);
        const spec = this.sizeChart[size] || this.sizeChart['M'];
        
        const patternHeight = spec.length + 8; 
        let requiredLengthMeters = 0;
        let layoutPatterns = [];
        let collisionWarning = false;

        if (isTubular) {
            requiredLengthMeters = ((patternHeight * 2) + 5) / 100;
            
            // Validasi lebar kain tubular vs ukuran pola
            if (fabricWidthCM < (Math.max(front.width, back.width) * 2 + 10)) {
                collisionWarning = true;
            }

            // Penataan posisi rapi berdampingan secara vertikal di dalam pipa kain tubular
            layoutPatterns = [
                { data: front, offsetX: 15, offsetY: 5, rotate: 0 },
                { data: back, offsetX: (fabricWidthCM / 2) + 5, offsetY: 5, rotate: 0 }
            ];
        } else {
            requiredLengthMeters = (patternHeight + 5) / 100;
            layoutPatterns = [
                { data: front, offsetX: 10, offsetY: 5, rotate: 0 },
                { data: back, offsetX: spec.hip + 20, offsetY: 5, rotate: 0 }
            ];
        }

        return {
            size: size,
            isTubular: isTubular,
            fabricWidth: Number(fabricWidthCM),
            patternHeight: patternHeight + 10,
            estimatedYield: requiredLengthMeters.toFixed(2),
            warning: collisionWarning,
            patterns: layoutPatterns
        };
    }
}
