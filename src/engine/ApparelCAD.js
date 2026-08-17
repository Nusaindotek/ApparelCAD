export class ApparelCAD {
    constructor(sizeChart) {
        this.sizeChart = sizeChart;
    }

    getSpecs(size) {
        // Fallback aman jika ukuran tidak ditemukan di config
        return this.sizeChart[size] || {
            chest: 104, length: 72, shoulder: 46,
            sleeveLength: 22, armhole: 50, neckWidth: 19
        };
    }

    draftTShirtFront(size) {
        const spec = this.getSpecs(size);
        const w = spec.chest / 4;        // Lebar 1/4 badan
        const l = spec.length;           // Panjang baju
        const sh = spec.shoulder / 2;    // Lebar bahu (setengah)
        const nw = spec.neckWidth / 2;   // Lebar leher (setengah)
        const nd = 9;                    // Turun leher depan
        const shDrop = 4;                // Kemiringan bahu
        const scye = (spec.armhole / 2) + 2; // Kedalaman kerung ketiak

        return {
            part: "Front Body", size: size,
            points: {
                A: { x: 0, y: nd },       // Tengah Depan Leher
                B: { x: nw, y: 0 },       // Titik Leher Bahu
                C: { x: sh, y: shDrop },  // Ujung Bahu
                D: { x: w, y: scye },     // Titik Ketiak (Dada)
                E: { x: w, y: l },        // Ujung Bawah Sisi
                F: { x: 0, y: l }         // Tengah Depan Bawah
            },
            path: [
                // Kurva leher melengkung ke dalam
                { from: 'A', to: 'B', type: 'curve', cpx: 0, cpy: 0 }, 
                { from: 'B', to: 'C', type: 'line' },
                // Kurva kerung lengan (Armhole)
                { from: 'C', to: 'D', type: 'curve', cpx: sh - 2, cpy: scye - 4 }, 
                { from: 'D', to: 'E', type: 'line' },
                { from: 'E', to: 'F', type: 'line' },
                { from: 'F', to: 'A', type: 'line' }
            ]
        };
    }

    draftTShirtBack(size) {
        const spec = this.getSpecs(size);
        const w = spec.chest / 4;
        const l = spec.length;
        const sh = spec.shoulder / 2;
        const nw = spec.neckWidth / 2;
        const nd = 2.5;                  // Turun leher belakang (lebih dangkal)
        const shDrop = 4;
        const scye = (spec.armhole / 2) + 2;

        return {
            part: "Back Body", size: size,
            points: {
                A: { x: 0, y: nd },
                B: { x: nw, y: 0 },
                C: { x: sh, y: shDrop },
                D: { x: w, y: scye },
                E: { x: w, y: l },
                F: { x: 0, y: l }
            },
            path: [
                { from: 'A', to: 'B', type: 'curve', cpx: 0, cpy: 0 },
                { from: 'B', to: 'C', type: 'line' },
                // Kerung lengan belakang tidak se-melengkung bagian depan
                { from: 'C', to: 'D', type: 'curve', cpx: sh + 0.5, cpy: scye - 5 }, 
                { from: 'D', to: 'E', type: 'line' },
                { from: 'E', to: 'F', type: 'line' },
                { from: 'F', to: 'A', type: 'line' }
            ]
        };
    }

    draftTShirtSleeve(size) {
        const spec = this.getSpecs(size);
        const sl = spec.sleeveLength; 
        const bicep = (spec.armhole / 2) - 1; // Lebar lengan (ketiak)
        const capH = 13;                      // Tinggi puncak lengan
        const cuff = bicep * 0.75;            // Lebar manset bawah

        return {
            part: "Sleeve", size: size,
            points: {
                A: { x: 0, y: 0 },          // Puncak Lengan (Lipatan)
                B: { x: bicep, y: capH },   // Ketiak Lengan
                C: { x: cuff, y: sl },      // Ujung Manset
                D: { x: 0, y: sl }          // Tengah Manset
            },
            path: [
                // Menggunakan kurva Cubic (Bentuk 'S') untuk ujung lengan
                { 
                    from: 'A', to: 'B', type: 'cubic', 
                    cp1x: bicep * 0.4, cp1y: 0,          // Lengkungan luar di puncak
                    cp2x: bicep * 0.6, cp2y: capH * 0.9  // Lengkungan dalam di ketiak
                },
                { from: 'B', to: 'C', type: 'line' },
                { from: 'C', to: 'D', type: 'line' },
                { from: 'D', to: 'A', type: 'line' }
            ]
        };
    }

    draftTShirtRib(size) {
        const spec = this.getSpecs(size);
        const w = (spec.neckWidth * Math.PI) * 0.85; // Panjang rib disesuaikan lingkar leher
        const h = 4;
        return {
            part: "Neck Rib", size: size,
            points: {
                A: { x: 0, y: 0 }, B: { x: w, y: 0 },
                C: { x: w, y: h }, D: { x: 0, y: h }
            },
            path: [
                { from: 'A', to: 'B', type: 'line' },
                { from: 'B', to: 'C', type: 'line' },
                { from: 'C', to: 'D', type: 'line' },
                { from: 'D', to: 'A', type: 'line' }
            ]
        };
    }
}
