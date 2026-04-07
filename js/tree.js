class TreeVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.svg = null;
        this.width = 1000;
        this.height = 800;
        this.nodeSize = 120;
        this.levelHeight = 150;
    }

    // Render the tree using SVG
    render(members) {
        // Clear existing SVG
        this.container.innerHTML = '';

        if (members.length === 0) {
            this.container.innerHTML = '<p class="empty-state">No family members to display. Add your first member using the form.</p>';
            return;
        }

        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', this.width);
        this.svg.setAttribute('height', this.height);
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        this.container.appendChild(this.svg);

        // Add arrowhead marker for connections
        this.addArrowheadMarker();

        // Find root nodes (those without parents)
        const rootNodes = members.filter(m => !m.fatherId && !m.motherId);

        // Render each root node and its descendants
        let currentY = 50;
        rootNodes.forEach(root => {
            this.renderNode(root, this.width / 2, currentY, members);
            currentY += this.levelHeight;
        });
    }

    // Add arrowhead marker for SVG connections
    addArrowheadMarker() {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '7');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3.5');
        marker.setAttribute('orient', 'auto');
        marker.setAttribute('markerUnits', 'strokeWidth');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
        polygon.setAttribute('fill', '#667eea');

        marker.appendChild(polygon);
        defs.appendChild(marker);
        this.svg.appendChild(defs);
    }

    // Render a single node and its children
    renderNode(member, x, y, allMembers) {
        // Create node group
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `translate(${x}, ${y})`);
        g.setAttribute('class', 'tree-node-group');

        // Rectangle for node
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '200');
        rect.setAttribute('height', '100');
        rect.setAttribute('x', '-100');
        rect.setAttribute('y', '-50');
        rect.setAttribute('rx', '8');
        rect.setAttribute('fill', '#667eea');
        rect.setAttribute('stroke', '#fff');
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('data-id', member.id);

        // Text for name
        const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        nameText.setAttribute('text-anchor', 'middle');
        nameText.setAttribute('y', '-15');
        nameText.setAttribute('fill', 'white');
        nameText.setAttribute('font-weight', 'bold');
        nameText.setAttribute('font-size', '16');
        nameText.textContent = member.name;

        // Text for DOB
        const dobText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        dobText.setAttribute('text-anchor', 'middle');
        dobText.setAttribute('y', '15');
        dobText.setAttribute('fill', 'white');
        dobText.setAttribute('font-size', '12');
        dobText.textContent = member.dob || 'Unknown DOB';

        // Text for location
        const locationText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        locationText.setAttribute('text-anchor', 'middle');
        locationText.setAttribute('y', '35');
        locationText.setAttribute('fill', 'white');
        locationText.setAttribute('font-size', '12');
        locationText.textContent = member.location || 'Unknown location';

        g.appendChild(rect);
        g.appendChild(nameText);
        g.appendChild(dobText);
        g.appendChild(locationText);
        this.svg.appendChild(g);

        // Find children of this member
        const children = allMembers.filter(m =>
            m.fatherId === member.id || m.motherId === member.id
        );

        // Render children
        children.forEach((child, index) => {
            const childX = x - 250 + (index * 500);
            const childY = y + 200;

            // Draw connection line
            this.drawConnection(x, y + 50, childX, childY - 50);

            // Recursively render child node
            this.renderNode(child, childX, childY, allMembers);
        });
    }

    // Draw connection line between two points
    drawConnection(x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#667eea');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('class', 'tree-connection');
        this.svg.appendChild(line);
    }
}

// Initialize tree visualizer
const treeVisualizer = new TreeVisualizer('treeView');

// Update UI manager to use SVG tree visualizer
const originalRenderTree = uiManager.renderTree.bind(uiManager);

uiManager.renderTree = function(membersToRender = null) {
    const members = membersToRender || dataManager.getAllMembers();
    treeVisualizer.render(members);
};