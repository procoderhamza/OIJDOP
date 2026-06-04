const Voice = {
    recognition: null,

    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.lang = 'en-US';
            this.setupEvents();
        }

        const btn = document.getElementById('master-voice-btn');
        if (btn) btn.onclick = () => this.start();
    },

    start() {
        if (this.recognition) {
            this.recognition.start();
            document.getElementById('master-voice-btn').classList.add('listening');
        }
    },

    setupEvents() {
        this.recognition.onresult = (event) => {
            const cmd = event.results[0][0].transcript.toLowerCase();
            document.getElementById('voice-transcript').innerText = `"${cmd}"`;
            this.process(cmd);
        };

        this.recognition.onend = () => {
            document.getElementById('master-voice-btn').classList.remove('listening');
        };
    },

    process(cmd) {
        if (cmd.includes('flowchart')) switchView('flowchart');
        else if (cmd.includes('calculator')) switchView('calculator');
        else if (cmd.includes('note')) switchView('notes');
        else if (cmd.includes('command')) switchView('agent');
    }
};

document.addEventListener('DOMContentLoaded', () => Voice.init());
