class DataManager {
    constructor() {
        this.apiBase = '.';
        this.members = [];
    }

    // Load data from PHP API
    async loadData() {
        try {
            const response = await fetch(`${this.apiBase}/api/get_members.php`);
            if (response.ok) {
                this.members = await response.json();
            } else {
                this.members = [];
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.members = [];
        }
    }

    // Add a new family member
    async addMember(name, dob, location, fatherId = null, motherId = null) {
        try {
            const response = await fetch(`${this.apiBase}/api/add_member.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, dob, location, fatherId, motherId })
            });

            if (response.ok) {
                const newMember = await response.json();
                this.members.push(newMember);
                return newMember;
            }
        } catch (error) {
            console.error('Error adding member:', error);
        }
        return null;
    }

    // Update a member
    async updateMember(id, updates) {
        try {
            const response = await fetch(`${this.apiBase}/api/update_member.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, ...updates })
            });

            if (response.ok) {
                const updated = await response.json();
                const index = this.members.findIndex(m => m.id === id);
                if (index !== -1) {
                    this.members[index] = updated;
                }
                return updated;
            }
        } catch (error) {
            console.error('Error updating member:', error);
        }
        return null;
    }

    // Delete a member
    async deleteMember(id) {
        try {
            const response = await fetch(`${this.apiBase}/api/delete_member.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                this.members = this.members.filter(m => m.id !== id);
                return true;
            }
        } catch (error) {
            console.error('Error deleting member:', error);
        }
        return false;
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
}

// Initialize data manager
const dataManager = new DataManager();