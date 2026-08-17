// Tambahkan konfigurasi kampuh default pada class ApparelCAD
export class ApparelCAD {
    constructor(sizeChart) {
        this.sizeChart = sizeChart;
        this.defaultSeams = {
            general: 1,  // 1 cm untuk obraks/bahu/samping
            hem: 2.5,    // 2.5 cm untuk kelim bawah
            fold: 0      // 0 cm untuk lipatan tengah
        };
    }

    // ... method draftTShirtFront, draftTShirtBack, draftTShirtSleeve tetap sama ...

    /**
     * Menghasilkan Pola Rib Leher (Kepingan ke-4)
     */
    draftTShirtRib(size) {
        const specs = this._getSpecs(size);
        // Panjang rib umumnya 85% dari total keliling leher
        const totalNeckCircumference = (specs.neckWidth * 2) + specs.frontNeckDrop;
        const ribLength = totalNeckCircumference * 0.85; 

        return {
            part: "Neck Rib",
            size: size,
            points: {
                A: { x: 0, y: 0 },
                B: { x: ribLength / 2, y: 0 },
                C: { x: ribLength / 2, y: specs.ribWidth * 2 }, // Lipat dua
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
}
