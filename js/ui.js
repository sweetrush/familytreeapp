class UIManager {
    constructor() {
        this.form = document.getElementById('addMemberForm');
        this.treeView = document.getElementById('treeView');
        this.fatherSelect = document.getElementById('father');
        this.motherSelect = document.getElementById('mother');
        this.searchInput = document.getElementById('search');
        this.importFileInput = document.getElementById('importFile');
        this.exportJSONBtn = document.getElementById('exportJSON');
        this.exportCSVBtn = document.getElementById('exportCSV');
    }

    // Initialize UI
    init() {
        this.setupForm();
        this.setupImportExport();
        this.updateParentDropdowns();
        this.renderTree();
        this.setupSearch();
        this.setupTreeActions();
    }

    // Setup form submission
    setupForm() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    // Setup import/export functionality
    setupImportExport() {
        // Export to JSON
        if (this.exportJSONBtn) {
            this.exportJSONBtn.addEventListener('click', () => {
                importExportManager.exportToJSON();
            });
        }

        // Export to CSV
        if (this.exportCSVBtn) {
            this.exportCSVBtn.addEventListener('click', () => {
                importExportManager.exportToCSV();
            });
        }

        // Import from JSON
        if (this.importFileInput) {
            this.importFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    importExportManager.importFromJSON(file);
                    // Reset the input so the same file can be selected again if needed
                    this.importFileInput.value = '';
                }
            });
        }
    }

    // Handle form submission
    handleSubmit() {
        const name = document.getElementById('name').value;
        const dob = document.getElementById('dob').value;
        const location = document.getElementById('location').value;
        const fatherId = this.fatherSelect.value || null;
        const motherId = this.motherSelect.value || null;

        if (name) {
            dataManager.addMember(name, dob, location, fatherId, motherId);
            this.updateParentDropdowns();
            this.renderTree();
            this.form.reset();
            this.searchInput.value = '';
        }
    }

    // Update parent dropdown options
    updateParentDropdowns() {
        const parents = dataManager.getPotentialParents();

        // Clear existing options (except placeholder)
        this.fatherSelect.innerHTML = '<option value="">Select father</option>';
        this.motherSelect.innerHTML = '<option value="">Select mother</option>';

        parents.forEach(member => {
            const option1 = document.createElement('option');
            option1.value = member.id;
            option1.textContent = member.name;
            this.fatherSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = member.id;
            option2.textContent = member.name;
            this.motherSelect.appendChild(option2);
        });
    }

    // Render the family tree using SVG visualizer
    renderTree(membersToRender = null) {
        const members = membersToRender || dataManager.getAllMembers();
        treeVisualizer.render(members);
    }

    // Setup search functionality
    setupSearch() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const members = dataManager.getAllMembers();
            const filtered = members.filter(member =>
                member.name.toLowerCase().includes(query) ||
                (member.location && member.location.toLowerCase().includes(query))
            );
            this.renderTree(filtered);
        });
    }

    // Setup tree actions (edit/delete)
    setupTreeActions() {
        this.treeView.addEventListener('click', (e) => {
            const target = e.target;

            if (target.classList.contains('delete-btn')) {
                const id = target.dataset.id;
                if (confirm('Delete this family member?')) {
                    dataManager.deleteMember(id);
                    this.updateParentDropdowns();
                    this.renderTree();
                    this.searchInput.value = '';
                }
            } else if (target.classList.contains('edit-btn')) {
                const id = target.dataset.id;
                this.showEditModal(id);
            }
        });
    }

    // Show edit modal for a member
    showEditModal(id) {
        const member = dataManager.getMemberById(id);
        if (!member) return;

        const name = prompt('Edit name:', member.name);
        if (name === null) return; // User cancelled

        const dob = prompt('Edit date of birth (YYYY-MM-DD):', member.dob || '');
        const location = prompt('Edit location:', member.location || '');

        // For simplicity, we're not editing parent relationships in this version
        if (name !== null) {
            dataManager.updateMember(id, {
                name: name || member.name,
                dob: dob || member.dob,
                location: location || member.location
            });
            this.updateParentDropdowns();
            this.renderTree();
            this.searchInput.value = '';
        }
    }
}

// Initialize UI manager
const uiManager = new UIManager();