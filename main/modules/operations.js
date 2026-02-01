import { lcm, simplify, convertImproperToMixed, convertMixedToImproper, formatFraction } from './utils.js';

// fractions input: array of {whole, num, den}
// operator: '+','-','*','/'
// t: localization object
export function calculateFraction(fractionsInput, operator = '+', explanationOn = false, t = {}) {
    const fractions = [];
    let explanation = '';

    if (explanationOn) explanation += t.expStep1 + '\n';

    // Convert to improper
    for (let i = 0; i < fractionsInput.length; i++) {
        const f = fractionsInput[i];
        if (isNaN(f.num) || isNaN(f.den) || f.den === 0) {
            return { error: t.invalidInput || 'Invalid input.' };
        }
        const improper = convertMixedToImproper(f.whole || 0, f.num, f.den);
        fractions.push(improper);
        if (explanationOn) {
            const originalStr = `${f.whole !== 0 ? `${f.whole} ` : ''}${f.num}/${f.den}`;
            explanation += t.expFraction
                .replace('{i}', i + 1)
                .replace('{original}', originalStr)
                .replace('{improper}', `${improper.num}/${improper.den}`) + '\n';
        }
    }

    // Addition/Subtraction -> common denominator
    if (operator === '+' || operator === '-') {
        let finalDen = fractions[0].den;
        for (let i = 1; i < fractions.length; i++) {
            finalDen = lcm(finalDen, fractions[i].den);
        }
        if (explanationOn) explanation += '\n' + t.expStep2.replace('{lcd}', finalDen) + '\n';

        let finalNum = 0;
        let opExpression = '';

        fractions.forEach((frac, idx) => {
            const scaledNum = frac.num * (finalDen / frac.den);
            if (explanationOn) {
                explanation += t.expAdjust
                    .replace('{num}', frac.num)
                    .replace('{den}', frac.den)
                    .replace('{scaledNum}', scaledNum)
                    .replace('{lcd}', finalDen) + '\n';
                opExpression += `${idx > 0 ? ` ${operator} ` : ''}(${scaledNum})`;
            }
            if (idx === 0) finalNum = scaledNum;
            else finalNum = operator === '+' ? finalNum + scaledNum : finalNum - scaledNum;
        });

        if (explanationOn) {
            explanation += '\n' + t.expStep3 + '\n';
            explanation += t.expOperation
                .replace('{expression}', opExpression)
                .replace('{finalNum}', finalNum)
                .replace('{lcd}', finalDen) + '\n';
        }

        const simplifiedRes = simplify(finalNum, finalDen);
        const finalMixed = convertImproperToMixed(simplifiedRes.num, simplifiedRes.den);
        const resultStr = formatFraction(finalMixed);
        if (explanationOn) {
            explanation += t.expUnsimplified.replace('{num}', finalNum).replace('{den}', finalDen) + '\n\n';
            explanation += t.expStep4 + '\n';
            explanation += t.expSimplified.replace('{num}', simplifiedRes.num).replace('{den}', simplifiedRes.den) + '\n';
            explanation += t.expFinalMixed.replace('{result}', resultStr) + '\n';
        }

        return { resultStr: `${t.result || 'Result:'} ${resultStr}`, explanation, showExplanation: explanationOn };
    }

    // Multiplication / Division
    let resultNum = fractions[0].num;
    let resultDen = fractions[0].den;
    let opExpression = `(${resultNum}/${resultDen})`;

    if (explanationOn) explanation += '\n' + (operator === '*' ? t.expStep3Multiply : t.expStep3Divide) + '\n';

    for (let i = 1; i < fractions.length; i++) {
        const frac = fractions[i];
        opExpression += ` ${operator} (${frac.num}/${frac.den})`;
        if (operator === '*') {
            resultNum *= frac.num;
            resultDen *= frac.den;
        } else if (operator === '/') {
            resultNum *= frac.den;
            resultDen *= frac.num;
        }
    }

    if (explanationOn) {
        explanation += (operator === '*' ? t.expOpMultiply : t.expOpDivide).replace('{expression}', opExpression) + '\n';
    }

    const simplifiedRes = simplify(resultNum, resultDen);
    const finalMixed = convertImproperToMixed(simplifiedRes.num, simplifiedRes.den);
    const resultStr = formatFraction(finalMixed);

    if (explanationOn) {
        explanation += t.expUnsimplified.replace('{num}', resultNum).replace('{den}', resultDen) + '\n\n';
        explanation += t.expStep4 + '\n';
        explanation += t.expSimplified.replace('{num}', simplifiedRes.num).replace('{den}', simplifiedRes.den) + '\n';
        explanation += t.expFinalMixed.replace('{result}', resultStr) + '\n';
    }

    return { resultStr: `${t.result || 'Result:'} ${resultStr}`, explanation, showExplanation: explanationOn };
}

export function convertFractionCore({ whole = 0, num, den }, improperToMixed, t = {}) {
    if (isNaN(num) || isNaN(den) || den === 0) {
        return { error: t.invalidInput };
    }
    if (improperToMixed) {
        const res = convertImproperToMixed(num, den);
        if (!res) return { error: t.invalidInput };
        const resultStr = res.whole !== 0 ? `${res.whole} ${res.num}/${res.den}` : `${res.num}/${res.den}`;
        if (res.num === 0) return { resultStr: `${t.improperToMixed} ${res.whole}` };
        return { resultStr: `${t.improperToMixed} ${resultStr}` };
    }
    const res = convertMixedToImproper(whole, num, den);
    if (!res) return { error: t.invalidInput };
    const resultStr = res.den === 1 ? `${res.num}` : `${res.num}/${res.den}`;
    return { resultStr: `${t.mixedToImproper} ${resultStr}` };
}
