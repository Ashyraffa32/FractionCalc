// ========================================
// Memory Management Module (M+, M-, MC, MR)
// ========================================

/**
 * MemoryManager handles fraction memory operations
 * Stores fractions as {whole, num, den} format
 * Persists to localStorage
 */
export class MemoryManager {
    constructor() {
        this.storageKey = 'calculatorMemory';
        this.load();
    }

    /**
     * Load memory from localStorage
     */
    load() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                this.memory = JSON.parse(stored);
            } catch (e) {
                this.memory = { whole: 0, num: 0, den: 1 };
            }
        } else {
            this.memory = { whole: 0, num: 0, den: 1 };
        }
    }

    /**
     * Save memory to localStorage
     */
    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
    }

    /**
     * Clear memory (MC)
     */
    clear() {
        this.memory = { whole: 0, num: 0, den: 1 };
        this.save();
        return this.getFormattedMemory();
    }

    /**
     * Add fraction to memory (M+)
     * @param {Object} fraction - {whole, num, den}
     * @param {Object} utils - utility functions for fraction operations
     * @returns {string} formatted result
     */
    add(fraction, utils) {
        const result = utils.addFractions(this.memory, fraction);
        this.memory = result;
        this.save();
        return this.getFormattedMemory();
    }

    /**
     * Subtract fraction from memory (M-)
     * @param {Object} fraction - {whole, num, den}
     * @param {Object} utils - utility functions for fraction operations
     * @returns {string} formatted result
     */
    subtract(fraction, utils) {
        const result = utils.subtractFractions(this.memory, fraction);
        this.memory = result;
        this.save();
        return this.getFormattedMemory();
    }

    /**
     * Recall memory (MR)
     * @returns {Object} memory fraction {whole, num, den}
     */
    recall() {
        return { ...this.memory };
    }

    /**
     * Get formatted memory as string
     * @returns {string} formatted fraction string
     */
    getFormattedMemory() {
        const { whole, num, den } = this.memory;
        if (num === 0) return (whole || 0).toString();
        if (!whole || whole === 0) return `${num}/${den}`;
        return `${whole} ${num}/${den}`;
    }

    /**
     * Check if memory is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.memory.whole === 0 && this.memory.num === 0;
    }

    /**
     * Get memory state
     * @returns {Object} current memory
     */
    getMemory() {
        return { ...this.memory };
    }
}

/**
 * Utility functions for fraction arithmetic
 */
export const memoryUtils = {
    gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        return b === 0 ? a : memoryUtils.gcd(b, a % b);
    },

    lcm(a, b) {
        if (a === 0 || b === 0) return 0;
        return Math.abs(a * b) / memoryUtils.gcd(Math.abs(a), Math.abs(b));
    },

    simplify(num, den) {
        const divisor = memoryUtils.gcd(num, den);
        let simpNum = num / divisor;
        let simpDen = den / divisor;
        if (simpDen < 0) {
            simpNum = -simpNum;
            simpDen = -simpDen;
        }
        return { num: simpNum, den: simpDen };
    },

    convertMixedToImproper(whole, num, den) {
        if (den === 0) return null;
        const sign = whole < 0 ? -1 : 1;
        const absWhole = Math.abs(whole);
        const absNum = Math.abs(num);
        let newNum = absWhole * den + absNum;
        newNum = sign * newNum;
        if (num < 0 && whole === 0) newNum = -absNum;
        return memoryUtils.simplify(newNum, den);
    },

    convertImproperToMixed(num, den) {
        if (den === 0) return null;
        const sign = num < 0 ? -1 : 1;
        const absNum = Math.abs(num);
        const absDen = Math.abs(den);
        const whole = Math.floor(absNum / absDen) * sign;
        let newNum = absNum % absDen;
        let newDen = absDen;
        const simplifiedRemainder = memoryUtils.simplify(newNum, newDen);
        newNum = simplifiedRemainder.num;
        newDen = simplifiedRemainder.den;
        return { whole: whole, num: newNum, den: newDen };
    },

    /**
     * Add two fractions
     */
    addFractions(frac1, frac2) {
        // Convert to improper
        const improper1 = memoryUtils.convertMixedToImproper(
            frac1.whole || 0,
            frac1.num,
            frac1.den
        );
        const improper2 = memoryUtils.convertMixedToImproper(
            frac2.whole || 0,
            frac2.num,
            frac2.den
        );

        // Find LCD
        const lcd = memoryUtils.lcm(improper1.den, improper2.den);

        // Add fractions
        const num1Scaled = improper1.num * (lcd / improper1.den);
        const num2Scaled = improper2.num * (lcd / improper2.den);
        const resultNum = num1Scaled + num2Scaled;

        // Simplify and convert back
        const simplified = memoryUtils.simplify(resultNum, lcd);
        return memoryUtils.convertImproperToMixed(simplified.num, simplified.den);
    },

    /**
     * Subtract two fractions
     */
    subtractFractions(frac1, frac2) {
        // Convert to improper
        const improper1 = memoryUtils.convertMixedToImproper(
            frac1.whole || 0,
            frac1.num,
            frac1.den
        );
        const improper2 = memoryUtils.convertMixedToImproper(
            frac2.whole || 0,
            frac2.num,
            frac2.den
        );

        // Find LCD
        const lcd = memoryUtils.lcm(improper1.den, improper2.den);

        // Subtract fractions
        const num1Scaled = improper1.num * (lcd / improper1.den);
        const num2Scaled = improper2.num * (lcd / improper2.den);
        const resultNum = num1Scaled - num2Scaled;

        // Simplify and convert back
        const simplified = memoryUtils.simplify(resultNum, lcd);
        return memoryUtils.convertImproperToMixed(simplified.num, simplified.den);
    }
};
