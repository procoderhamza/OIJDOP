/**
 * AI Study Tutor Logic
 * Handles PDF processing, text analysis, and generation of visual learning aids.
 */

const StudyTutor = {
    init() {
        this.pdfUpload = document.getElementById('pdf-upload');
        this.analyzeBtn = document.getElementById('analyze-study-btn');
        this.outputArea = document.getElementById('explanation-content');
        this.visualGrid = document.getElementById('visual-aids');

        if (this.pdfUpload) {
            this.pdfUpload.onchange = (e) => this.handlePDF(e);
        }

        if (this.analyzeBtn) {
            this.analyzeBtn.onclick = () => this.generateAids();
        }
    },

    async handlePDF(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.outputArea.innerHTML = '';
        const icon = document.createElement('i');
        icon.className = 'fas fa-spinner fa-spin';
        this.outputArea.appendChild(icon);
        this.outputArea.appendChild(document.createTextNode(' Extracting knowledge from PDF...'));

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const typedarray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = "";

                for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    fullText += content.items.map(item => item.str).join(" ") + "\n";
                }

                document.getElementById('study-text').value = fullText;
                this.outputArea.textContent = "Knowledge extracted. Click 'Generate Visual Aids' to begin learning.";
            };
            reader.readAsArrayBuffer(file);
        } catch (err) {
            console.error(err);
            this.outputArea.textContent = "Error processing PDF. Please try pasting text manually.";
        }
    },

    generateAids() {
        const text = document.getElementById('study-text').value.trim();
        if (!text) {
            alert("Please provide some study material first.");
            return;
        }

        this.outputArea.innerHTML = '';
        const robotIcon = document.createElement('i');
        robotIcon.className = 'fas fa-robot';
        this.outputArea.appendChild(robotIcon);
        this.outputArea.appendChild(document.createTextNode(` AI is analyzing: "${text.substring(0, 50)}..."`));
        this.visualGrid.innerHTML = "";

        // Simulated AI Generation
        setTimeout(() => {
            this.outputArea.innerHTML = `
                <p><strong>AI Analysis:</strong> This material focuses on complex systems and logical structures.
                I've generated visual anchors to help you memorize key concepts.</p>
                <ul style="margin-left: 20px; margin-top: 10px;">
                    <li>Main Theme: System Architecture</li>
                    <li>Key Complexity: High</li>
                    <li>Recommended Study Method: Spaced Repetition</li>
                </ul>
            `;

            this.addVisualCard(
                "Concept Map",
                "A visual hierarchy of the system's components.",
                "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
            );

            this.addVisualCard(
                "Logic Animation",
                "Visualizing how data flows through the logic gates.",
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
            );

            this.addVisualCard(
                "Memory Anchor",
                "A mnemonic image to help you remember the core sequence.",
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
            );
        }, 1500);
    },

    addVisualCard(title, desc, imgUrl) {
        const card = document.createElement('div');
        card.className = 'visual-card';

        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = title;

        const content = document.createElement('div');
        content.className = 'content';

        const h5 = document.createElement('h5');
        h5.textContent = title;

        const p = document.createElement('p');
        p.textContent = desc;

        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.style.marginTop = '10px';
        btn.style.fontSize = '0.7rem';
        btn.style.padding = '5px 10px';

        const playIcon = document.createElement('i');
        playIcon.className = 'fas fa-play';
        btn.appendChild(playIcon);
        btn.appendChild(document.createTextNode(' Watch Animation'));

        content.appendChild(h5);
        content.appendChild(p);
        content.appendChild(btn);

        card.appendChild(img);
        card.appendChild(content);

        btn.onclick = () => this.showAnimation(title, desc);

        this.visualGrid.appendChild(card);
    },

    showAnimation(title, desc) {
        const modal = document.getElementById('ai-modal');
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-desc').textContent = desc;
        modal.classList.add('active');
    },

    closeModal() {
        document.getElementById('ai-modal').classList.remove('active');
    }
};

document.addEventListener('DOMContentLoaded', () => StudyTutor.init());
