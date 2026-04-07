class DataManager {
    constructor() {
        this.storageKey = 'familyTreeData';
        this.members = [];
        this.loadData();
    }

    // Load data from localStorage
    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                this.members = JSON.parse(data);
            } else {
                // Initialize with empty array
                this.members = [];
                this.saveData();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.members = [];
        }
    }

    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.members, null, 2));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // Add a new family member
    addMember(name, dob, location, fatherId = null, motherId = null) {
        const newMember = {
            id: this.generateId(),
            name,
            dob,
            location,
            fatherId,
            motherId,
            createdAt: new Date().toISOString()
        };

        this.members.push(newMember);
        this.saveData();
        return newMember;
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Get all members
    getAllMembers() {
        return this.members;
    }

    // Get member by ID
    getMemberById(id) {
        return this.members.find(m => m.id === id);
    }

    // Get potential parents (for dropdowns)
    getPotentialParents() {
        return this.members.filter(m =>
            m.fatherId === null && m.motherId === null
        );
    }

    // Delete a member by ID
    deleteMember(id) {
        this.members = this.members.filter(m => m.id !== id);
        this.saveData();
    }

    // Update a member
    updateMember(id, updates) {
        const index = this.members.findIndex(m => m.id === id);
        if (index !== -1) {
            this.members[index] = { ...this.members[index], ...updates };
            this.saveData();
            return this.members[index];
        }
        return null;
    }
}

// Initialize data manager
const dataManager = new DataManager();