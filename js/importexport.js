class ImportExportManager {
    constructor() {
        this.dataManager = dataManager;
    }

    // Export family data to JSON
    exportToJSON() {
        const data = this.dataManager.getAllMembers();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `family-tree-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import family data from JSON file
    importFromJSON(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data)) {
                    // Clear existing data
                    this.dataManager.members = [];
                    // Add imported members
                    data.forEach(member => {
                        this.dataManager.addMember(
                            member.name,
                            member.dob,
                            member.location,
                            member.fatherId,
                            member.motherId
                        );
                    });
                    alert('Import successful! ' + data.length + ' members added.');
                } else {
                    alert('Invalid file format. Please select a JSON file with family data.');
                }
            } catch (error) {
                alert('Error importing file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // Export data as CSV
    exportToCSV() {
        const members = this.dataManager.getAllMembers();
        if (members.length === 0) {
            alert('No data to export');
            return;
        }

        let csvContent = 'ID,Name,Date of Birth,Location,Father ID,Mother ID,Created At\n';
        members.forEach(member => {
            csvContent += `${member.id},"${member.name}",${member.dob || ''},"${member.location || ''}",${member.fatherId || ''},${member.motherId || ''},${member.createdAt}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `family-tree-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize import/export manager
const importExportManager = new ImportExportManager();