// app.js

// 1. DATA TABEL UKURAN
const TShirtSizeChart = {
    M: {
        bodyLength: 70,
        chestWidth: 50,
        shoulderWidth: 44,
        neckWidth: 18,
        armholeStraight: 24,
        shoulderDrop: 3,
        frontNeckDrop: 10
    }
};

// 2. MESIN DRAFTING
class ApparelCAD {
    constructor(sizeChart) {
        this.sizeChart = sizeChart;
    }

    draftTShirtFront(size) {
        const specs = this.sizeChart[size];
        if (!specs) {
            throw new Error(`Ukuran ${size} tidak ditemukan di Size Chart.`);
        }

        const halfChest = specs.chestWidth / 2;
        const halfShoulder = specs.shoulderWidth / 2;
        const halfNeck = specs.neckWidth / 2;

        const points = {
            A: { x: halfNeck, y: 0 },
            B: { x: 0, y: specs.frontNeckDrop },
            C: { x: halfShoulder, y: specs.shoulderDrop },
            D: { x: halfChest, y: specs.armholeStraight },
            E: { x: halfChest, y: specs.bodyLength },
            F: { x: 0, y: specs.bodyLength }
        };

        const path = [
            { type: "line", from: "F", to: "B", description: "Garis Lipatan Tengah (Center Front)" },
            { type: "curve", from: "B", to: "A", description: "Kerungan Leher Depan (Front Neckline)" },
            { type: "line", from: "A", to: "C", description: "Jahitan Bahu (Shoulder Seam)" },
            { type: "curve", from: "C", to: "D", description: "Kerungan Lengan (Armhole)" },
            { type: "line", from: "D", to: "E", description: "Jahitan Samping (Side Seam)" },
            { type: "line", from: "E", to: "F", description: "Kelim Bawah (Hemline)" }
        ];

        return {
            part: "Front Body",
            size: size,
            points: points,
            path: path
        };
    }
}

// 3. ESEKUSI / TESTING
const engine = new ApparelCAD(TShirtSizeChart);
const result = engine.draftTShirtFront('M');

console.log(JSON.stringify(result, null, 2));
