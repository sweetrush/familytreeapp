class ImportExportManager {
    constructor() {
        this.apiBase = '.';
    }

    // Export family data to JSON
    async exportToJSON() {
        try {
            const response = await fetch(`${this.apiBase}/api/import_export.php?format=json`);
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `family-tree-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert('Failed to export data');
            }
        } catch (error) {
            console.error('Error exporting JSON:', error);
            alert('Failed to export data');
        }
    }

    // Import family data from JSON file
    async importFromJSON(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.apiBase}/api/import_export.php`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert('Import successful! ' + result.count + ' members added.');
                // Reload data
                await dataManager.loadData();
                uiManager.renderTree();
            } else {
                const error = await response.json();
                alert('Import failed: ' + error.error);
            }
        } catch (error) {
            console.error('Error importing file:', error);
            alert('Failed to import file');
        }
    }

    // Export data as CSV
    async exportToCSV() {
        try {
            const response = await fetch(`${this.apiBase}/api/import_export.php?format=csv`);
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `family-tree-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert('Failed to export data');
            }
        } catch (error) {
            console.error('Error exporting CSV:', error);
            alert('Failed to export data');
        }
    }
}

// Initialize import/export manager
const importExportManager = new ImportExportManager();