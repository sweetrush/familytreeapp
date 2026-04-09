class TreeVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.network = null;
        this.nodes = null;
        this.edges = null;
        this.allMembers = [];
        this.selectedNodeId = null;
    }

    render(members) {
        this.allMembers = members || [];

        if (!this.allMembers.length) {
            this.container.innerHTML = '<p class="empty-state">No family members to display. Add your first member using the form.</p>';
            this.hideActions();
            return;
        }

        // Clear container
        this.container.innerHTML = '';

        // Convert members to vis-network data
        const visNodes = [];
        const visEdges = [];

        this.allMembers.forEach(member => {
            const label = this.escapeHtml(member.name);

            visNodes.push({
                id: member.id,
                label: label,
                title: label,
                color: {
                    background: '#667eea',
                    border: '#5a6fd8',
                    highlight: { background: '#28a745', border: '#218838' },
                    hover: { background: '#5a6fd8', border: '#4a5fc8' }
                }
            });

            if (member.fatherId) {
                visEdges.push({ from: member.fatherId, to: member.id });
            }
            if (member.motherId) {
                visEdges.push({ from: member.motherId, to: member.id });
            }
        });

        this.nodes = new vis.DataSet(visNodes);
        this.edges = new vis.DataSet(visEdges);

        const options = {
            layout: {
                hierarchical: {
                    direction: 'UD',
                    sortMethod: 'directed',
                    levelSeparation: 100,
                    nodeSpacing: 150
                }
            },
            physics: { enabled: false },
            nodes: {
                shape: 'box',
                font: { color: '#fff', size: 14 },
                margin: 10
            },
            edges: {
                color: { color: '#aaa' },
                smooth: { type: 'cubicBezier' }
            },
            interaction: {
                hover: true,
                tooltipDelay: 100
            }
        };

        this.network = new vis.Network(this.container, { nodes: this.nodes, edges: this.edges }, options);

        // Ensure proper sizing after render
        this.network.fit({ animation: false });

        // Handle node clicks
        this.network.on('click', (params) => {
            if (params.nodes.length > 0) {
                this.selectNode(params.nodes[0]);
            }
        });

        // Double-click opens edit
        this.network.on('doubleClick', (params) => {
            if (params.nodes.length > 0) {
                uiManager.showEditModal(params.nodes[0]);
            }
        });
    }

    selectNode(nodeId) {
        this.selectedNodeId = nodeId;
        const member = this.allMembers.find(m => m.id === nodeId);
        if (!member) return;

        const actionsDiv = document.getElementById('nodeActions');
        const nameSpan = document.getElementById('selectedName');
        actionsDiv.style.display = 'block';
        nameSpan.textContent = member.name + (member.dob ? ' (' + member.dob + ')' : '');
    }

    hideActions() {
        this.selectedNodeId = null;
        const actionsDiv = document.getElementById('nodeActions');
        if (actionsDiv) actionsDiv.style.display = 'none';
    }

    fitToNodes(nodeIds) {
        if (this.network && nodeIds && nodeIds.length > 0) {
            this.network.fit({ nodes: nodeIds, animation: true });
        }
    }

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}

// Initialize tree visualizer
const treeVisualizer = new TreeVisualizer('treeView');
