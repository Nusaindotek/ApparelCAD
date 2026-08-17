export class ApparelCAD {
    constructor(sizeChart) {
        this.sizeChart = sizeChart;
    }

    getSpecs(size) {
        return this.sizeChart[size] || {
            chest: 104, length: 72, shoulder: 46,
            sleeveLength: 22, armhole: 50, neckWidth: 19
        };
    }

    draftTShirtFront(size) {
        const spec = this.getSpecs(size);
        const w = spec.chest / 4;
        const l = spec.length;
        const sh = spec.shoulder / 2;
        const nw = spec.neckWidth / 2;
        const nd = 9;
        const shDrop = 4;
        const scye = (spec.armhole / 2) + 2;

        return {
            part: "Front Body", size: size,
            // Arah serat kain (Grainline) tegak lurus
            grainline: { x: w / 2, y1: 15, y2: l - 10 },
            points: {
                A: { x: 0, y: nd }, B: { x: nw, y: 0 },
                C: { x: sh, y: shDrop }, D: { x: w, y: scye },
                E: { x: w, y: l }, F: { x: 0, y: l }
            },
            // Tanda Cetekan (Notches) di kerung lengan depan
            notches: [
                { pt: 'curve', from: 'C', to: 'D', percent: 0.6 } // 60% dari ketiak
            ],
            path: [
                { from: 'A', to: 'B', type: 'curve', cpx: 0, cpy: 0 },
                { from: 'B', to: 'C', type: 'line' },
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
        const nd = 2.5;
        const shDrop = 4;
        const scye = (spec.armhole / 2) + 2;

        return {
            part: "Back Body", size: size,
            grainline: { x: w / 2, y1: 15, y2: l - 10 },
            points: {
                A: { x: 0, y: nd }, B: { x: nw, y: 0 },
                C: { x: sh, y: shDrop }, D: { x: w, y: scye },
                E: { x: w, y: l }, F: { x: 0, y: l }
            },
            // 2 Cetekan di lengan belakang (standar industri)
            notches: [
                { pt: 'curve', from: 'C', to: 'D', percent: 0.5 },
                { pt: 'curve', from: 'C', to: 'D', percent: 0.6 }
            ],
            path: [
                { from: 'A', to: 'B', type: 'curve', cpx: 0, cpy: 0 },
                { from: 'B', to: 'C', type: 'line' },
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
        const bicep = (spec.armhole / 2) - 1;
        const capH = 13;
        const cuff = bicep * 0.75;

        return {
            part: "Sleeve", size: size,
            grainline: { x: 0, y1: capH + 2, y2: sl - 2 },
            points: {
                A: { x: 0, y: 0 }, B: { x: bicep, y: capH },
                C: { x: cuff, y: sl }, D: { x: 0, y: sl }
            },
            // Cetekan di puncak lengan
            notches: [{ pt: 'point', node: 'A' }],
            path: [
                { 
                    from: 'A', to: 'B', type: 'cubic', 
                    cp1x: bicep * 0.4, cp1y: 0,
                    cp2x: bicep * 0.6, cp2y: capH * 0.9
                },
                { from: 'B', to: 'C', type: 'line' },
                { from: 'C', to: 'D', type: 'line' },
                { from: 'D', to: 'A', type: 'line' }
            ]
        };
    }

    draftTShirtRib(size) {
        const spec = this.getSpecs(size);
        const w = (spec.neckWidth * Math.PI) * 0.85;
        const h = 4;
        return {
            part: "Neck Rib", size: size,
            grainline: { x: w / 2, y1: 0.5, y2: h - 0.5 },
            points: {
                A: { x: 0, y: 0 }, B: { x: w, y: 0 },
                C: { x: w, y: h }, D: { x: 0, y: h }
            },
            notches: [],
            path: [
                { from: 'A', to: 'B', type: 'line' },
                { from: 'B', to: 'C', type: 'line' },
                { from: 'C', to: 'D', type: 'line' },
                { from: 'D', to: 'A', type: 'line' }
            ]
        };
    }
}
