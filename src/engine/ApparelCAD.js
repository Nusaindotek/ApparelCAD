export class ApparelCAD {
    constructor(sizeChart) {
        this.sizeChart = sizeChart;
    }

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
                B: { x: 0, y: specs.backNeckDrop },
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

    /**
     * Pola Lengan (Sleeve) - Setengah Lipatan
     */
    draftTShirtSleeve(size) {
        const specs = this._getSpecs(size);

        return {
            part: "Sleeve",
            size: size,
            points: {
                A: { x: 0, y: 0 },                                       // Puncak Lengan (Lipatan)
                B: { x: specs.sleeveOpening + 2, y: specs.sleeveCapHeight }, // Ketiak Lengan
                C: { x: specs.sleeveOpening, y: specs.sleeveLength },    // Bukaan Bawah Samping
                D: { x: 0, y: specs.sleeveLength }                       // Bukaan Bawah Tengah
            },
            path: [
                { type: "curve", from: "A", to: "B", description: "Kerungan Puncak Lengan" },
                { type: "line", from: "B", to: "C", description: "Jahitan Bawah Lengan" },
                { type: "line", from: "C", to: "D", description: "Kelim Bawah Lengan" },
                { type: "line", from: "D", to: "A", description: "Lipatan Tengah Lengan" }
            ]
        };
    }

    _getSpecs(size) {
        const specs = this.sizeChart[size];
        if (!specs) throw new Error(`Ukuran ${size} tidak ditemukan.`);
        return specs;
    }
}
