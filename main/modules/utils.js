// Utility math & fraction helpers (pure functions)
export function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    return b === 0 ? a : gcd(b, a % b);
}

export function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(Math.abs(a), Math.abs(b));
}

export function simplify(num, den) {
    const divisor = gcd(num, den);
    let simpNum = num / divisor;
    let simpDen = den / divisor;
    if (simpDen < 0) {
        simpNum = -simpNum;
        simpDen = -simpDen;
    }
    return { num: simpNum, den: simpDen };
}

export function convertMixedToImproper(whole, num, den) {
    if (den === 0) return null;
    // Handle negative whole correctly
    const sign = whole < 0 ? -1 : 1;
    const absWhole = Math.abs(whole);
    const absNum = Math.abs(num);
    let newNum = absWhole * den + absNum;
    newNum = sign * newNum;
    // If numerator had its own sign, apply it
    if (num < 0 && whole === 0) newNum = -absNum;
    return simplify(newNum, den);
}

export function convertImproperToMixed(num, den) {
    if (den === 0) return null;
    const sign = num < 0 ? -1 : 1;
    const absNum = Math.abs(num);
    const absDen = Math.abs(den);
    const whole = Math.floor(absNum / absDen) * sign;
    let newNum = absNum % absDen;
    let newDen = absDen;
    const simplifiedRemainder = simplify(newNum, newDen);
    newNum = simplifiedRemainder.num;
    newDen = simplifiedRemainder.den;
    return { whole: whole, num: newNum, den: newDen };
}

export function formatFraction({ whole, num, den }) {
    if (den === 0) return "Undefined";
    if (num === 0) return (whole || 0).toString();
    if (!whole) return `${num}/${den}`;
    return `${whole} ${num}/${den}`;
}

export function formatFractionHTML({ whole, num, den }) {
    if (den === 0) return "<div class='fraction-result'>Undefined</div>";
    if (num === 0) return `<div class='fraction-result'>${whole || 0}</div>`;
    
    const fractionHTML = `<div class='fraction-display'><div class='frac-num'>${num}</div><div class='frac-line'></div><div class='frac-den'>${den}</div></div>`;
    
    if (!whole || whole === 0) return fractionHTML;
    return `<div class='fraction-result mixed-fraction'><span class='frac-whole'>${whole}</span> ${fractionHTML}</div>`;
}
