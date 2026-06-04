const Agent = {
    currentView: 'agent',

    init() {
        console.log("Agent OS Initializing...");
        this.setupNavigation();
        // Modules will self-init or be called here
    },

    setupNavigation() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1) || 'agent';
            this.switchView(hash);
        });

        // Initial load
        const initialHash = window.location.hash.substring(1) || 'agent';
        this.switchView(initialHash);
    },

    switchView(viewId) {
        this.currentView = viewId;

        // Update Nav
        document.querySelectorAll('nav a').forEach(a => {
            a.classList.remove('active');
            if(a.getAttribute('href') === '#' + viewId) a.classList.add('active');
        });

        // Update Sections
        document.querySelectorAll('.view-section').forEach(s => {
            s.classList.remove('active');
        });
        const activeSection = document.getElementById(viewId);
        if(activeSection) activeSection.classList.add('active');
    }
};

window.switchView = (id) => Agent.switchView(id);

document.addEventListener('DOMContentLoaded', () => Agent.init());
