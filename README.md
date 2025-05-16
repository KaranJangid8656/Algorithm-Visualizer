# Floyd-Warshall Algorithm Visualizer

An interactive web application for visualizing the Floyd-Warshall algorithm, which finds the shortest paths between all pairs of nodes in a graph.


## Features

- **Interactive Graph Creation**: Add nodes and weighted edges to build your own graph
- **Step-by-Step Animation**: Visualize each step of the Floyd-Warshall algorithm
- **Path Highlighting**: See the shortest path between any two nodes
- **Distance Matrix**: View the resulting distance matrix of shortest paths
- **Animation Controls**: Pause, resume, speed up, or skip to the end of the animation
- **Example Graphs**: Load pre-defined example graphs, including ones with negative weights
- **Import/Export**: Save and load your graph structures as JSON files
- **Drag and Drop**: Reposition nodes by dragging them on the canvas




## Usage

### Creating a Graph

1. Use the "Nodes" tab to add nodes to your graph
2. Switch to the "Edges" tab to create connections between nodes
3. Each edge must have a weight value (can be negative)
4. Drag nodes on the canvas to arrange your graph

### Running the Algorithm

1. Click "Run Floyd-Warshall Algorithm" to start the visualization
2. Use the animation controls to adjust speed or pause/resume
3. Select source and target nodes to highlight specific shortest paths
4. View the distance matrix to see all shortest path distances

### Additional Options

- Toggle edge weights and node labels with the buttons above the canvas
- Use the example graphs to quickly test the algorithm with different scenarios
- Export your graph to share with others or save for later
- Import previously saved graphs

## How It Works

The Floyd-Warshall algorithm finds the shortest paths between all pairs of nodes in a weighted graph. It works by iteratively improving an estimate of the shortest path between two vertices by considering whether going through an intermediate vertex gives a shorter path.

The core of the algorithm follows this pseudocode:

```
for k from 1 to |V|
    for i from 1 to |V|
        for j from 1 to |V|
            if dist[i][j] > dist[i][k] + dist[k][j]
                dist[i][j] = dist[i][k] + dist[k][j]
                next[i][j] = next[i][k]
```

The visualizer highlights:
- The current intermediate node (k) in orange
- The source (i) and destination (j) nodes in blue
- Path updates in green when a shorter path is found

## Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components

## License

[MIT License](LICENSE)




