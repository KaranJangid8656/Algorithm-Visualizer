import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, BookOpen } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About Algorithm Visualizer</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Our interactive visualizations help you understand complex algorithms through hands-on experimentation.
            </p>
            <p>Each algorithm comes with detailed explanations, pseudocode, and complexity analysis.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visualize</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              See algorithms in action with step-by-step animations that reveal how they work internally.
            </p>
            <p>Create your own graphs or use our examples to explore different scenarios and edge cases.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Understand the strengths and weaknesses of different algorithms for solving the same problem.
            </p>
            <p>Learn when to use each algorithm based on your specific requirements and constraints.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Currently Available Algorithms</CardTitle>
          <CardDescription>We're continuously adding new algorithms to our collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center p-3 border rounded-md">
              <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-800 mr-3">
                Available
              </Badge>
              <span>Floyd-Warshall</span>
            </div>

            <div className="flex items-center p-3 border rounded-md">
              <Badge variant="outline" className="bg-amber-900/20 text-amber-500 border-amber-800 mr-3">
                Coming Soon
              </Badge>
              <span>Dijkstra</span>
            </div>

            <div className="flex items-center p-3 border rounded-md">
              <Badge variant="outline" className="bg-amber-900/20 text-amber-500 border-amber-800 mr-3">
                Coming Soon
              </Badge>
              <span>Bellman-Ford</span>
            </div>

            <div className="flex items-center p-3 border rounded-md">
              <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700 mr-3">
                Planned
              </Badge>
              <span>A* Search</span>
            </div>

            <div className="flex items-center p-3 border rounded-md">
              <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700 mr-3">
                Planned
              </Badge>
              <span>Johnson's Algorithm</span>
            </div>

            <div className="flex items-center p-3 border rounded-md">
              <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700 mr-3">
                Planned
              </Badge>
              <span>Breadth-First Search</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About the Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Algorithm Visualizer is an educational tool designed to help students, developers, and anyone interested in
            computer science understand graph algorithms through interactive visualizations.
          </p>

          <p>
            This project was created with Next.js, React, and Tailwind CSS, with a focus on providing a responsive,
            accessible, and intuitive user experience.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </Link>

            <Link href="/learn">
              <Button>
                <BookOpen className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
