import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function ComparePage() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Algorithm Comparison</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Shortest Path Algorithms Comparison</CardTitle>
          <CardDescription>
            Compare the features, performance, and use cases of different shortest path algorithms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Algorithm</TableHead>
                  <TableHead>Time Complexity</TableHead>
                  <TableHead>Space Complexity</TableHead>
                  <TableHead>Negative Edges</TableHead>
                  <TableHead>Negative Cycles</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Floyd-Warshall</TableCell>
                  <TableCell>O(V³)</TableCell>
                  <TableCell>O(V²)</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-800">
                      Supported
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-900/20 text-red-500 border-red-800">
                      Detected but not solved
                    </Badge>
                  </TableCell>
                  <TableCell>All-pairs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Dijkstra</TableCell>
                  <TableCell>O((V+E)log V)</TableCell>
                  <TableCell>O(V)</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-900/20 text-red-500 border-red-800">
                      Not supported
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-900/20 text-red-500 border-red-800">
                      Not supported
                    </Badge>
                  </TableCell>
                  <TableCell>Single-source</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bellman-Ford</TableCell>
                  <TableCell>O(V×E)</TableCell>
                  <TableCell>O(V)</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-800">
                      Supported
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-900/20 text-amber-500 border-amber-800">
                      Detected
                    </Badge>
                  </TableCell>
                  <TableCell>Single-source</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Johnson's</TableCell>
                  <TableCell>O(V²log V + VE)</TableCell>
                  <TableCell>O(V²)</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-800">
                      Supported
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-900/20 text-red-500 border-red-800">
                      Not supported
                    </Badge>
                  </TableCell>
                  <TableCell>All-pairs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">A*</TableCell>
                  <TableCell>O(E)</TableCell>
                  <TableCell>O(V)</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-900/20 text-red-500 border-red-800">
                      Not supported
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-900/20 text-red-500 border-red-800">
                      Not supported
                    </Badge>
                  </TableCell>
                  <TableCell>Single-pair</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>When to Use Floyd-Warshall</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>When you need to find shortest paths between all pairs of vertices</li>
              <li>When the graph is dense (many edges)</li>
              <li>When the graph has negative edge weights (but no negative cycles)</li>
              <li>When the implementation simplicity is more important than performance</li>
              <li>When the graph is small to medium-sized (due to O(V³) complexity)</li>
            </ul>

            <div className="mt-6">
              <Link href="/">
                <Button>
                  Try Floyd-Warshall <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>When to Use Dijkstra</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>When you need to find shortest paths from a single source</li>
              <li>When all edge weights are non-negative</li>
              <li>When the graph is sparse (few edges)</li>
              <li>When performance is critical</li>
              <li>When you need to find the shortest path to a specific target (can terminate early)</li>
              <li>In GPS and navigation systems</li>
            </ul>

            <div className="mt-6">
              <Button disabled>
                Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>Relative performance of different algorithms based on graph characteristics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Graph Type</TableHead>
                  <TableHead>Best Algorithm</TableHead>
                  <TableHead>Why?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Dense graph, all-pairs needed</TableCell>
                  <TableCell>Floyd-Warshall</TableCell>
                  <TableCell>Simple implementation, good performance for dense graphs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sparse graph, single source</TableCell>
                  <TableCell>Dijkstra</TableCell>
                  <TableCell>O((V+E)log V) is better than O(V³) for sparse graphs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Graph with negative edges</TableCell>
                  <TableCell>Bellman-Ford or Floyd-Warshall</TableCell>
                  <TableCell>These algorithms can handle negative edge weights</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Large sparse graph, all-pairs</TableCell>
                  <TableCell>Johnson's</TableCell>
                  <TableCell>Better than Floyd-Warshall for sparse graphs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Single path with heuristic</TableCell>
                  <TableCell>A*</TableCell>
                  <TableCell>Uses heuristics to find path faster than Dijkstra</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
