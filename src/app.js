import { TShirtSizeChart } from './config/sizeChart.js';
import { ApparelCAD } from './engine/ApparelCAD.js';

const cad = new ApparelCAD(TShirtSizeChart);

const frontPattern = cad.draftTShirtFront('M');
const backPattern = cad.draftTShirtBack('M');

console.log("=== BADAN DEPAN ===", frontPattern);
console.log("=== BADAN BELAKANG ===", backPattern);
