function showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById('tab-' + tabName);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}
