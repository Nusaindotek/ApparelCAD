export class ApparelCAD {
    constructor(sizeChart) {
        this.sizeChart = sizeChart;
    }

    /**
     * Pola Badan Depan
     */
    draftTShirtFront(size) {
        const specs = this._getSpecs(size);
        const halfChest = specs.chestWidth / 2;
        const halfShoulder = specs.shoulderWidth / 2;
        const halfNeck = specs.neckWidth / 2;

        return {
            part: "Front Body",
            size: size,
            points: {
                A: { x: halfNeck, y: 0 },
                B: { x: 0, y: specs.frontNeckDrop },
                C: { x: halfShoulder, y: specs.shoulderDrop },
                D: { x: halfChest, y: specs.armholeStraight },
                E: { x: halfChest, y: specs.bodyLength },
                F: { x: 0, y: specs.bodyLength }
            },
            path: [
                { type: "line", from: "F", to: "B", description: "Lipatan Tengah Depan" },
                { type: "curve", from: "B", to: "A", description: "Kerungan Leher Depan" },
                { type: "line", from: "A", to: "C", description: "Jahitan Bahu" },
                { type: "curve", from: "C", to: "D", description: "Kerungan Lengan" },
                { type: "line", from: "D", to: "E", description: "Jahitan Samping" },
                { type: "line", from: "E", to: "F", description: "Kelim Bawah" }
            ]
        };
    }

    /**
     * Pola Badan Belakang
     */
    draftTShirtBack(size) {
        const specs = this._getSpecs(size);
        const halfChest = specs.chestWidth / 2;
        const halfShoulder = specs.shoulderWidth / 2;
        const halfNeck = specs.neckWidth / 2;

        return {
            part: "Back Body",
            size: size,
            points: {
                A: { x: halfNeck, y: 0 },
                B: { x: 0, y: specs.backNeckDrop }, // Turunan leher belakang lebih dangkal
                C: { x: halfShoulder, y: specs.shoulderDrop },
                D: { x: halfChest, y: specs.armholeStraight },
                E: { x: halfChest, y: specs.bodyLength },
                F: { x: 0, y: specs.bodyLength }
            },
            path: [
                { type: "line", from: "F", to: "B", description: "Lipatan Tengah Belakang" },
                { type: "curve", from: "B", to: "A", description: "Kerungan Leher Belakang" },
                { type: "line", from: "A", to: "C", description: "Jahitan Bahu" },
                { type: "curve", from: "C", to: "D", description: "Kerungan Lengan" },
                { type: "line", from: "D", to: "E", description: "Jahitan Samping" },
                { type: "line", from: "E", to: "F", description: "Kelim Bawah" }
            ]
        };
    }

    _getSpecs(size) {
        const specs = this.sizeChart[size];
        if (!specs) throw new Error(`Ukuran ${size} tidak ditemukan.`);
        return specs;
    }
}
