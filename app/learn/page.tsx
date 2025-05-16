import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function LearnPage() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Learn Path-Finding Algorithms</h1>

      <Tabs defaultValue="floyd-warshall">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="floyd-warshall">Floyd-Warshall</TabsTrigger>
          <TabsTrigger value="dijkstra">Dijkstra</TabsTrigger>
          <TabsTrigger value="bellman-ford">Bellman-Ford</TabsTrigger>
        </TabsList>

        <TabsContent value="floyd-warshall">
          <Card>
            <CardHeader>
              <CardTitle>Floyd-Warshall Algorithm</CardTitle>
              <CardDescription>All-pairs shortest path algorithm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Overview</h3>
                <p>
                  The Floyd-Warshall algorithm is an efficient algorithm for finding shortest paths in a weighted graph
                  with positive or negative edge weights (but no negative cycles). Unlike Dijkstra's algorithm which
                  finds the shortest path from a single source, Floyd-Warshall computes the shortest paths between all
                  pairs of vertices in the graph.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">How It Works</h3>
                <p className="mb-4">
                  The algorithm works by incrementally improving an estimate on the shortest path between two vertices,
                  until the estimate is optimal.
                </p>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Initialize the distance matrix where direct edges are filled with their weights and other cells with
                    infinity.
                  </li>
                  <li>For each vertex k, consider it as an intermediate vertex for all pairs (i,j).</li>
                  <li>
                    For each pair of vertices (i,j), check if going through vertex k gives a shorter path than the
                    current known path.
                  </li>
                  <li>If a shorter path is found, update the distance matrix.</li>
                  <li>
                    After considering all vertices as intermediates, the matrix contains the shortest distances between
                    all pairs.
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Pseudocode</h3>
                <pre className="bg-slate-900 p-4 rounded-md overflow-x-auto">
                  <code className="text-sm text-white">
                    {`// Initialize distance matrix dist[i][j]
// with direct edge weights or infinity

// Floyd-Warshall algorithm
for k = 1 to n:
    for i = 1 to n:
        for j = 1 to n:
            if dist[i][k] + dist[k][j] < dist[i][j]:
                dist[i][j] = dist[i][k] + dist[k][j]
                next[i][j] = next[i][k]  // For path reconstruction`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Time and Space Complexity</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Time Complexity:</strong> O(V³) where V is the number of vertices
                  </li>
                  <li>
                    <strong>Space Complexity:</strong> O(V²) for the distance matrix
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Advantages and Limitations</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-500">Advantages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Finds all pairs of shortest paths in a single execution</li>
                        <li>Works with negative edge weights (as long as there are no negative cycles)</li>
                        <li>Simple implementation with just three nested loops</li>
                        <li>Can detect negative cycles in the graph</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-500">Limitations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>O(V³) time complexity makes it inefficient for very large graphs</li>
                        <li>Cannot handle graphs with negative cycles</li>
                        <li>Requires storing the entire distance matrix (O(V²) space)</li>
                        <li>Not as efficient as Dijkstra's algorithm for single-source problems</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Applications</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Finding shortest paths in road networks</li>
                  <li>Network routing protocols</li>
                  <li>Detecting negative cycles in currency exchange rates</li>
                  <li>Solving the all-pairs shortest path problem in computer networks</li>
                  <li>Computing transitive closure of directed graphs</li>
                </ul>
              </div>

              <div className="pt-4">
                <Link href="/">
                  <Button>
                    Try It Yourself <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dijkstra">
          <Card>
            <CardHeader>
              <CardTitle>Dijkstra's Algorithm</CardTitle>
              <CardDescription>Single-source shortest path algorithm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Overview</h3>
                <p>
                  Dijkstra's algorithm is a popular algorithm for finding the shortest paths between a single source
                  node and all other nodes in a weighted graph with non-negative edge weights. It uses a greedy approach
                  to build the solution incrementally.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">How It Works</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Initialize distances from source to all vertices as infinite and distance to source as 0.</li>
                  <li>Create a set of unvisited vertices.</li>
                  <li>
                    While the set is not empty:
                    <ol className="list-alpha pl-6 mt-2">
                      <li>Select the vertex with the minimum distance from the set.</li>
                      <li>Remove it from the unvisited set.</li>
                      <li>For each neighbor of the current vertex, calculate the tentative distance.</li>
                      <li>If the tentative distance is less than the current distance, update it.</li>
                    </ol>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Time and Space Complexity</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Time Complexity:</strong> O(V²) with an adjacency matrix, or O((V+E)log V) with a priority
                    queue
                  </li>
                  <li>
                    <strong>Space Complexity:</strong> O(V) for the distance array and visited set
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Advantages and Limitations</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-500">Advantages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Efficient for sparse graphs with priority queue implementation</li>
                        <li>Guarantees the shortest path in graphs with non-negative weights</li>
                        <li>Can be terminated early once the destination is reached</li>
                        <li>Widely used in routing and navigation systems</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-500">Limitations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Cannot handle negative edge weights</li>
                        <li>Less efficient than Floyd-Warshall for dense graphs</li>
                        <li>Requires recomputation for each new source vertex</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="pt-4">
                <Button disabled>
                  Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bellman-ford">
          <Card>
            <CardHeader>
              <CardTitle>Bellman-Ford Algorithm</CardTitle>
              <CardDescription>Single-source shortest path algorithm with negative edge support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Overview</h3>
                <p>
                  The Bellman-Ford algorithm computes shortest paths from a single source vertex to all other vertices
                  in a weighted graph. Unlike Dijkstra's algorithm, it can handle graphs with negative weight edges and
                  can detect negative weight cycles.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">How It Works</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Initialize distances from source to all vertices as infinite and distance to source as 0.</li>
                  <li>Relax all edges V-1 times (where V is the number of vertices).</li>
                  <li>Check for negative weight cycles by attempting to relax edges one more time.</li>
                  <li>If any distance is updated in this final pass, the graph contains a negative weight cycle.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Time and Space Complexity</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Time Complexity:</strong> O(V×E) where V is the number of vertices and E is the number of
                    edges
                  </li>
                  <li>
                    <strong>Space Complexity:</strong> O(V) for the distance array
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Advantages and Limitations</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-500">Advantages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Can handle negative edge weights</li>
                        <li>Can detect negative weight cycles</li>
                        <li>Simple implementation</li>
                        <li>Works with any graph representation</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-500">Limitations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Slower than Dijkstra's algorithm for graphs without negative edges</li>
                        <li>O(V×E) time complexity makes it inefficient for dense graphs</li>
                        <li>Cannot compute shortest paths if negative cycles exist</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="pt-4">
                <Button disabled>
                  Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
