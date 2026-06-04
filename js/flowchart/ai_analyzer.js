flowchart.analyze = function() {
    const nodeCount = this.nodes.length;
    const connCount = this.connections.length;

    if (nodeCount === 0) {
        alert("AI Agent: The canvas is empty. Start by dragging a 'Start' shape.");
        return;
    }

    const startNodes = this.nodes.filter(n => n.type === 'start');
    const endNodes = this.nodes.filter(n => n.type === 'end');

    let analysis = `AI Logic Analysis:\n`;
    analysis += `- Total Blocks: ${nodeCount}\n`;
    analysis += `- Total Connections: ${connCount}\n`;

    if (startNodes.length === 0) analysis += `⚠️ Missing 'Start' block.\n`;
    if (endNodes.length === 0) analysis += `⚠️ Missing 'End' block.\n`;

    const disconnected = this.nodes.filter(n =>
        !this.connections.some(c => c.sourceId === n.id || c.targetId === n.id)
    );

    if (disconnected.length > 0) {
        analysis += `⚠️ Found ${disconnected.length} disconnected block(s).\n`;
    } else {
        analysis += `✅ Logic flow is contiguous.\n`;
    }

    alert(analysis);
};

flowchart.check = function() {
    const issues = [];

    // Check for multiple starts
    if (this.nodes.filter(n => n.type === 'start').length > 1) {
        issues.push("Multiple 'Start' blocks found. Only one entry point is standard.");
    }

    // Check for nodes without outgoing connections (except End)
    this.nodes.forEach(node => {
        if (node.type !== 'end') {
            const hasOutgoing = this.connections.some(c => c.sourceId === node.id);
            if (!hasOutgoing) {
                issues.push(`Node '${node.text}' has no outgoing flow.`);
            }
        }
    });

    // Check for decision nodes without at least 2 outputs
    this.nodes.filter(n => n.type === 'decision').forEach(node => {
        const outputCount = this.connections.filter(c => c.sourceId === node.id).length;
        if (outputCount < 2) {
            issues.push(`Decision '${node.text}' should have at least 2 output paths.`);
        }
    });

    if (issues.length > 0) {
        alert("AI Logic Checker Results:\n\n" + issues.map(i => "❌ " + i).join("\n"));
    } else {
        alert("AI Logic Checker: Logic flow is valid and follows standard conventions! ✅");
    }
};

flowchart.tutor = function() {
    const topics = [
        "Use a rounded rectangle for 'Start' and 'End'.",
        "Use a rhombus (diamond) for 'Decision' nodes with Yes/No branches.",
        "Use a parallelogram for 'Input/Output' operations like reading user data.",
        "Ensure every path eventually leads to an 'End' block to prevent infinite loops.",
        "Avoid crossing connection lines to maintain readability."
    ];
    const tip = topics[Math.floor(Math.random() * topics.length)];
    alert("AI Tutor Tip: " + tip);
};

flowchart.exportSVG = function() {
    const svgData = document.getElementById('flow-canvas').outerHTML;
    const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "flowchart.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};
