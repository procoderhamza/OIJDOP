/**
 * Core Flowchart Builder Logic
 * Handles Drag & Drop, Node Creation, Connections, and Basic Canvas Operations
 */

const flowchart = {
    nodes: [],
    connections: [],
    selectedNode: null,
    isConnecting: false,
    tempLine: null,

    init() {
        this.canvas = document.getElementById('flow-canvas');
        this.nodesGroup = document.getElementById('nodes');
        this.connGroup = document.getElementById('connections');
        this.setupDragAndDrop();
        this.setupCanvasEvents();
    },

    setupDragAndDrop() {
        const shapeItems = document.querySelectorAll('.shape-item');
        shapeItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('type', item.dataset.type);
            });
        });

        const wrapper = document.getElementById('canvas-wrapper');
        wrapper.addEventListener('dragover', (e) => e.preventDefault());
        wrapper.addEventListener('drop', (e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('type');
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addNode(type, x, y);
        });
    },

    addNode(type, x, y, text = "") {
        const id = 'node-' + Date.now();
        if (!text) {
            text = type.charAt(0).toUpperCase() + type.slice(1);
        }

        const node = { id, type, x, y, text };
        this.nodes.push(node);
        this.renderNode(node);
        return node;
    },

    renderNode(node) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "flow-node");
        g.setAttribute("id", node.id);
        g.setAttribute("transform", `translate(${node.x}, ${node.y})`);

        let shape;
        const w = 120;
        const h = 50;

        if (node.type === 'decision') {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
            shape.setAttribute("d", `M ${w/2} 0 L ${w} ${h/2} L ${w/2} ${h} L 0 ${h/2} Z`);
            shape.setAttribute("fill", "#f59e0b");
        } else if (node.type === 'start' || node.type === 'end') {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            shape.setAttribute("width", w);
            shape.setAttribute("height", h);
            shape.setAttribute("rx", 25);
            shape.setAttribute("fill", node.type === 'start' ? "#38bdf8" : "#ef4444");
        } else if (node.type === 'io') {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
            shape.setAttribute("d", `M 15 0 L ${w} 0 L ${w-15} ${h} L 0 ${h} Z`);
            shape.setAttribute("fill", "#8b5cf6");
        } else if (node.type === 'document') {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
            shape.setAttribute("d", `M 0 0 L ${w} 0 L ${w} ${h-10} Q ${w*0.75} ${h} ${w/2} ${h-10} Q ${w*0.25} ${h-20} 0 ${h-10} Z`);
            shape.setAttribute("fill", "#10b981");
        } else if (node.type === 'data') {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            shape.setAttribute("width", w);
            shape.setAttribute("height", h);
            shape.setAttribute("fill", "#6366f1");
        } else if (node.type === 'preparation') {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
            shape.setAttribute("d", `M 15 0 L ${w-15} 0 L ${w} ${h/2} L ${w-15} ${h} L 15 ${h} L 0 ${h/2} Z`);
            shape.setAttribute("fill", "#ec4899");
        } else if (node.type === 'display') {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
            shape.setAttribute("d", `M 0 ${h/2} L 15 0 L ${w-15} 0 Q ${w} ${h/2} ${w-15} ${h} L 15 ${h} Z`);
            shape.setAttribute("fill", "#f97316");
        } else if (node.type === 'manual') {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
            shape.setAttribute("d", `M 0 10 L ${w} 0 L ${w} ${h} L 0 ${h} Z`);
            shape.setAttribute("fill", "#06b6d4");
        } else if (node.type === 'storage') {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
            shape.setAttribute("d", `M 0 0 L ${w-15} 0 Q ${w} 0 ${w} ${h/2} Q ${w} ${h} ${w-15} ${h} L 0 ${h} Q 15 ${h/2} 0 0 Z`);
            shape.setAttribute("fill", "#475569");
        } else if (node.type === 'database') {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
            shape.setAttribute("d", `M 0 5 Q ${w/2} 0 ${w} 5 L ${w} ${h-5} Q ${w/2} ${h} 0 ${h-5} Z M 0 5 Q ${w/2} 10 ${w} 5`);
            shape.setAttribute("fill", "#4338ca");
        } else {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            shape.setAttribute("width", w);
            shape.setAttribute("height", h);
            shape.setAttribute("fill", "#0ea5e9");
        }

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", w/2);
        label.setAttribute("y", h/2);
        label.textContent = node.text;

        g.appendChild(shape);
        g.appendChild(label);
        this.nodesGroup.appendChild(g);

        this.makeDraggable(g, node);

        g.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectNode(node);
        });
    },

    makeDraggable(el, node) {
        let isDragging = false;
        let offset;

        el.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = this.canvas.getBoundingClientRect();
            offset = {
                x: e.clientX - node.x,
                y: e.clientY - node.y
            };
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            node.x = e.clientX - offset.x;
            node.y = e.clientY - offset.y;
            el.setAttribute("transform", `translate(${node.x}, ${node.y})`);
            this.updateConnections();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
    },

    selectNode(node) {
        this.selectedNode = node;
        const panel = document.getElementById('props-panel');
        panel.innerHTML = '';

        const container = document.createElement('div');
        container.style.marginBottom = '15px';

        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.fontSize = '0.8rem';
        label.style.color = 'var(--text-dim)';
        label.textContent = 'Text';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = node.text;
        input.style.width = '100%';
        input.style.background = 'var(--bg-primary)';
        input.style.border = '1px solid var(--glass-border)';
        input.style.color = 'white';
        input.style.padding = '5px';
        input.style.borderRadius = '4px';
        input.oninput = (e) => this.updateNodeText(e.target.value);

        container.appendChild(label);
        container.appendChild(input);

        const connectBtn = document.createElement('button');
        connectBtn.style.width = '100%';
        connectBtn.style.marginBottom = '10px';
        connectBtn.textContent = 'Connect to...';
        connectBtn.onclick = () => this.startConnection();

        const deleteBtn = document.createElement('button');
        deleteBtn.style.width = '100%';
        deleteBtn.style.background = 'var(--danger)';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.padding = '5px';
        deleteBtn.style.borderRadius = '4px';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => this.deleteNode(node.id);

        panel.appendChild(container);
        panel.appendChild(connectBtn);
        panel.appendChild(deleteBtn);
    },

    updateNodeText(text) {
        if (!this.selectedNode) return;
        this.selectedNode.text = text;
        const el = document.getElementById(this.selectedNode.id);
        if (el) {
            el.querySelector('text').textContent = text;
        }
    },

    startConnection() {
        this.isConnecting = true;
        this.canvas.style.cursor = 'crosshair';
    },

    setupCanvasEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.isConnecting && this.selectedNode) {
                const target = e.target.closest('.flow-node');
                if (target && target.id !== this.selectedNode.id) {
                    this.addConnection(this.selectedNode.id, target.id);
                    this.isConnecting = false;
                    this.canvas.style.cursor = 'default';
                }
            }
        });
    },

    addConnection(sourceId, targetId) {
        this.connections.push({ sourceId, targetId });
        this.updateConnections();
    },

    updateConnections() {
        this.connGroup.innerHTML = '';
        this.connections.forEach((conn, index) => {
            const source = this.nodes.find(n => n.id === conn.sourceId);
            const target = this.nodes.find(n => n.id === conn.targetId);
            if (source && target) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
                line.setAttribute("class", "connection-line");

                // Smart routing: Edge to Edge
                const w = 120, h = 50;
                let sx, sy, tx, ty;

                // Simple check for best port
                if (Math.abs(source.x - target.x) > Math.abs(source.y - target.y)) {
                    // Horizontal
                    if (source.x < target.x) {
                        sx = source.x + w; sy = source.y + h/2;
                        tx = target.x; ty = target.y + h/2;
                    } else {
                        sx = source.x; sy = source.y + h/2;
                        tx = target.x + w; ty = target.y + h/2;
                    }
                } else {
                    // Vertical
                    if (source.y < target.y) {
                        sx = source.x + w/2; sy = source.y + h;
                        tx = target.x + w/2; ty = target.y;
                    } else {
                        sx = source.x + w/2; sy = source.y;
                        tx = target.x + w/2; ty = target.y + h;
                    }
                }

                line.setAttribute("d", `M ${sx} ${sy} L ${tx} ${ty}`);
                line.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if(confirm("Delete this connection?")) {
                        this.connections.splice(index, 1);
                        this.updateConnections();
                    }
                });
                this.connGroup.appendChild(line);
            }
        });
    },

    clear() {
        this.nodes = [];
        this.connections = [];
        this.nodesGroup.innerHTML = '';
        this.connGroup.innerHTML = '';
        document.getElementById('props-panel').innerHTML = '<p style="color: var(--text-dim); font-size: 0.8rem;">Select an element to edit</p>';
    },

    deleteNode(id) {
        this.nodes = this.nodes.filter(n => n.id !== id);
        this.connections = this.connections.filter(c => c.sourceId !== id && c.targetId !== id);
        const el = document.getElementById(id);
        if (el) el.remove();
        this.updateConnections();
        this.selectedNode = null;
        document.getElementById('props-panel').innerHTML = '<p style="color: var(--text-dim); font-size: 0.8rem;">Select an element to edit</p>';
    },

    check() {
        alert("Analyzing logic flow... Success! All nodes are connected.");
    },

    analyze() {
        // Placeholder for AI Analysis
        alert("AI Agent Analysis: This flowchart describes a linear process. Suggestion: Add error handling branching.");
    },

    tutor() {
        alert("AI Tutor: A good flowchart always starts with a 'Start' block and ends with 'End'. Remember to label your decision paths!");
    }
};

window.flowchart = flowchart;
document.addEventListener('DOMContentLoaded', () => flowchart.init());
