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
        this.setupNodeActions();
        this.updateParentDropdowns();
        this.renderTree();
        this.setupSearch();
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
    async handleSubmit() {
        const name = document.getElementById('name').value;
        const dob = document.getElementById('dob').value;
        const location = document.getElementById('location').value;
        const fatherId = this.fatherSelect.value || null;
        const motherId = this.motherSelect.value || null;

        if (name) {
            await dataManager.addMember(name, dob, location, fatherId, motherId);
            this.updateParentDropdowns();
            this.renderTree();
            this.form.reset();
            if (this.searchInput) this.searchInput.value = '';
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

    // Render the family tree using vis-network
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

            if (!query) {
                this.renderTree(members);
                return;
            }

            const filtered = members.filter(member =>
                member.name.toLowerCase().includes(query) ||
                (member.location && member.location.toLowerCase().includes(query))
            );
            this.renderTree(filtered);

            // Focus view on matching nodes
            if (filtered.length > 0) {
                treeVisualizer.fitToNodes(filtered.map(m => m.id));
            }
        });
    }

    // Setup Edit and Delete buttons below the tree
    setupNodeActions() {
        const editBtn = document.getElementById('editNodeBtn');
        const deleteBtn = document.getElementById('deleteNodeBtn');

        editBtn.addEventListener('click', () => {
            if (treeVisualizer.selectedNodeId) {
                this.showEditModal(treeVisualizer.selectedNodeId);
            }
        });

        deleteBtn.addEventListener('click', async () => {
            if (treeVisualizer.selectedNodeId) {
                const member = dataManager.getMemberById(treeVisualizer.selectedNodeId);
                if (member && confirm('Delete "' + member.name + '"?')) {
                    await dataManager.deleteMember(treeVisualizer.selectedNodeId);
                    treeVisualizer.hideActions();
                    this.updateParentDropdowns();
                    this.renderTree();
                    if (this.searchInput) this.searchInput.value = '';
                }
            }
        });
    }

    // Show edit modal for a member
    showEditModal(id) {
        const member = dataManager.getMemberById(id);
        if (!member) return;

        const name = prompt('Edit name:', member.name);
        if (name === null) return;

        const dob = prompt('Date of birth (YYYY-MM-DD):', member.dob || '');
        const location = prompt('Location:', member.location || '');

        dataManager.updateMember(id, {
            name: name || member.name,
            dob: dob || member.dob,
            location: location || member.location
        });
        this.updateParentDropdowns();
        this.renderTree();
        treeVisualizer.hideActions();
        if (this.searchInput) this.searchInput.value = '';
    }
}

// Initialize UI manager
const uiManager = new UIManager();