// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Load data first
    await dataManager.loadData();

    // Then initialize UI
    uiManager.init();
    console.log('Family Tree App initialized');
    console.log('Data manager loaded with', dataManager.getAllMembers().length, 'members');
});