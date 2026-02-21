// ========================================
// Calculation History Module
// ========================================

/**
 * HistoryManager tracks all calculations
 * Stores as {operation, operands, result, timestamp}
 */
export class HistoryManager {
    constructor(maxSize = 100) {
        this.storageKey = 'calculatorHistory';
        this.maxSize = maxSize;
        this.load();
    }

    /**
     * Load history from localStorage
     */
    load() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                this.history = JSON.parse(stored);
                if (!Array.isArray(this.history)) {
                    this.history = [];
                }
            } catch (e) {
                this.history = [];
            }
        } else {
            this.history = [];
        }
    }

    /**
     * Save history to localStorage
     */
    save() {
        // Keep only the most recent entries
        const trimmed = this.history.slice(-this.maxSize);
        localStorage.setItem(this.storageKey, JSON.stringify(trimmed));
    }

    /**
     * Add a calculation to history
     * @param {string} operation - type of operation (e.g., 'add', 'multiply', 'convert')
     * @param {Array} operands - array of operands
     * @param {string} result - the result
     */
    addEntry(operation, operands, result) {
        const entry = {
            operation,
            operands,
            result,
            timestamp: new Date().toLocaleTimeString()
        };
        this.history.push(entry);
        this.save();
    }

    /**
     * Get all history entries
     * @returns {Array} history entries
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Get recent history
     * @param {number} count - number of recent entries
     * @returns {Array} recent entries
     */
    getRecent(count = 10) {
        return this.history.slice(-count).reverse();
    }

    /**
     * Clear all history
     */
    clear() {
        this.history = [];
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Get formatted history entry
     * @param {Object} entry - history entry
     * @returns {string} formatted string
     */
    formatEntry(entry) {
        return `${entry.operands.join(' ')} → ${entry.result} (${entry.timestamp})`;
    }

    /**
     * Get total history count
     * @returns {number}
     */
    count() {
        return this.history.length;
    }

    /**
     * Search history by operation type
     * @param {string} operation - operation type to search
     * @returns {Array} matching entries
     */
    searchByOperation(operation) {
        return this.history.filter(entry => entry.operation === operation);
    }

    /**
     * Delete specific entry by index
     * @param {number} index - index to delete
     */
    deleteEntry(index) {
        if (index >= 0 && index < this.history.length) {
            this.history.splice(index, 1);
            this.save();
        }
    }

    /**
     * Export history as CSV
     * @returns {string} CSV formatted data
     */
    exportAsCSV() {
        if (this.history.length === 0) return 'Operation,Operands,Result,Timestamp\n';

        let csv = 'Operation,Operands,Result,Timestamp\n';
        this.history.forEach(entry => {
            const operands = entry.operands.join('|');
            csv += `${entry.operation},"${operands}",${entry.result},${entry.timestamp}\n`;
        });
        return csv;
    }

    /**
     * Import history from CSV
     * @param {string} csvData - CSV data to import
     */
    importFromCSV(csvData) {
        const lines = csvData.split('\n');
        let importedCount = 0;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Simple CSV parsing (handles quoted fields)
            const regex = /([^,]+),"([^"]+)",([^,]+),(.+)/;
            const match = line.match(regex);
            if (match) {
                this.history.push({
                    operation: match[1].trim(),
                    operands: match[2].split('|'),
                    result: match[3].trim(),
                    timestamp: match[4].trim()
                });
                importedCount++;
            }
        }

        this.save();
        return importedCount;
    }
}
