import { simplify } from './utils.js';

// Convert a decimal number into a fraction using continued fraction method
export function decimalToFraction(decimal) {
    const tolerance = 1.0E-9;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    do {
        let a = Math.floor(b);
        let aux = h1; h1 = a * h1 + h2; h2 = aux;
        aux = k1; k1 = a * k1 + k2; k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance && k1 !== 0);

    const frac = simplify(h1, k1);
    return { num: frac.num, den: frac.den };
}

export function fractionToDecimal(num, den) {
    if (den === 0) return NaN;
    return num / den;
}

export function simplifyFraction(num, den) {
    if (den === 0) return null;
    return simplify(num, den);
}
