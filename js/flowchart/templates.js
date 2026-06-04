flowchart.loadTemplate = function(name) {
    this.clear();
    if (name === 'login') {
        const start = this.addNode('start', 100, 50, "Start");
        const input = this.addNode('io', 100, 150, "Input Credentials");
        const check = this.addNode('decision', 100, 250, "Valid?");
        const success = this.addNode('process', 250, 350, "Show Dashboard");
        const fail = this.addNode('process', -50, 350, "Show Error");
        const end = this.addNode('end', 100, 450, "End");

        this.addConnection(start.id, input.id);
        this.addConnection(input.id, check.id);
        this.addConnection(check.id, success.id);
        this.addConnection(check.id, fail.id);
        this.addConnection(success.id, end.id);
        this.addConnection(fail.id, end.id);
    } else if (name === 'checkout') {
        const start = this.addNode('start', 100, 50, "Start");
        const cart = this.addNode('process', 100, 150, "Add to Cart");
        const pay = this.addNode('process', 100, 250, "Process Payment");
        const end = this.addNode('end', 100, 350, "End");

        this.addConnection(start.id, cart.id);
        this.addConnection(cart.id, pay.id);
        this.addConnection(pay.id, end.id);
    }
};
