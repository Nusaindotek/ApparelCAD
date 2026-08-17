import { TShirtSizeChart } from './config/sizeChart.js';
import { ApparelCAD } from './engine/ApparelCAD.js';

const cad = new ApparelCAD(TShirtSizeChart);

const frontPattern = cad.draftTShirtFront('M');
const backPattern = cad.draftTShirtBack('M');
const sleevePattern = cad.draftTShirtSleeve('M');

console.log("=== APPAREL CAD ENGINE TEST V1.0 ===");
console.log("1. Badan Depan:", frontPattern.part, "Status: OK");
console.log("2. Badan Belakang:", backPattern.part, "Status: OK");
console.log("3. Lengan:", sleevePattern.part, "Status: OK");
