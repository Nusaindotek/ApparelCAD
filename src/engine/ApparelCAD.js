export class ApparelCAD {
    constructor(sizeChart) {
        this.sizeChart = sizeChart;
        this.defaultSeams = {
            general: 1,  // 1 cm untuk obraks/bahu/samping
            hem: 2.5,    // 2.5 cm untuk kelim bawah
            fold: 0      // 0 cm untuk lipatan tengah
        };
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
     * Pola Lengan (Sleeve)
     */
    draftTShirtSleeve(size) {
        const specs = this._getSpecs(size);

        return {
            part: "Sleeve",
            size: size,
            points: {
                A: { x: 0, y: 0 },
                B: { x: specs.sleeveOpening + 2, y: specs.sleeveCapHeight },
                C: { x: specs.sleeveOpening, y: specs.sleeveLength },
                D: { x: 0, y: specs.sleeveLength }
            },
            path: [
                { type: "curve", from: "A", to: "B", description: "Kerungan Puncak Lengan" },
                { type: "line", from: "B", to: "C", description: "Jahitan Bawah Lengan" },
                { type: "line", from: "C", to: "D", description: "Kelim Bawah Lengan" },
                { type: "line", from: "D", to: "A", description: "Lipatan Tengah Lengan" }
            ]
        };
    }

    /**
     * Pola Rib Leher (Neck Rib)
     */
    draftTShirtRib(size) {
        const specs = this._getSpecs(size);
        const totalNeckCircumference = (specs.neckWidth * 2) + specs.frontNeckDrop;
        const ribLength = totalNeckCircumference * 0.85; 

        return {
            part: "Neck Rib",
            size: size,
            points: {
                A: { x: 0, y: 0 },
                B: { x: ribLength / 2, y: 0 },
                C: { x: ribLength / 2, y: specs.ribWidth * 2 },
                D: { x: 0, y: specs.ribWidth * 2 }
            },
            path: [
                { type: "line", from: "A", to: "B", description: "Atas Rib" },
                { type: "line", from: "B", to: "C", description: "Samping Rib" },
                { type: "line", from: "C", to: "D", description: "Bawah Rib" },
                { type: "line", from: "D", to: "A", description: "Lipatan Rib" }
            ]
        };
    }

    _getSpecs(size) {
        const specs = this.sizeChart[size];
        if (!specs) throw new Error(`Ukuran ${size} tidak ditemukan.`);
        return specs;
    }
}
