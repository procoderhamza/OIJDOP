const Notes = {
    notes: [],
    currentId: null,

    init() {
        this.load();
        this.renderList();

        document.querySelector('.new-note-btn').onclick = () => this.create();
        document.getElementById('note-title').oninput = () => this.save();
        document.getElementById('note-content').oninput = () => this.save();
    },

    load() {
        const saved = localStorage.getItem('agent_notes_v2');
        this.notes = saved ? JSON.parse(saved) : [];
    },

    save() {
        if (!this.currentId) return;
        const note = this.notes.find(n => n.id === this.currentId);
        if (note) {
            note.title = document.getElementById('note-title').value;
            note.content = document.getElementById('note-content').value;
            localStorage.setItem('agent_notes_v2', JSON.stringify(this.notes));
            this.renderList();
        }
    },

    create() {
        const id = Date.now();
        const newNote = { id, title: 'Untitled Note', content: '' };
        this.notes.unshift(newNote);
        this.currentId = id;
        this.renderList();
        this.open(id);
    },

    open(id) {
        this.currentId = id;
        const note = this.notes.find(n => n.id === id);
        if (note) {
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-content').value = note.content;
            this.renderList();
        }
    },

    renderList() {
        const list = document.getElementById('notes-list');
        list.innerHTML = '';
        this.notes.forEach(note => {
            const div = document.createElement('div');
            div.className = `note-item ${note.id === this.currentId ? 'active' : ''}`;

            const strong = document.createElement('strong');
            strong.textContent = note.title || 'Untitled';
            div.appendChild(strong);

            div.onclick = () => this.open(note.id);
            list.appendChild(div);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Notes.init());
