"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Play, Plus, Trash2, Pause, SkipForward, RotateCcw, Download, Upload, Lightbulb } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Node {
  id: string
  x: number
  y: number
  dragging?: boolean
}

interface Edge {
  source: string
  target: string
  weight: number
}

interface AnimationStep {
  type: "init" | "processing" | "update" | "final"
  k?: number
  i?: number
  j?: number
  newDist?: number
  matrix?: number[][]
  path?: string[]
}

export default function FloydWarshallApp() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [newNodeId, setNewNodeId] = useState("")
  const [newEdgeSource, setNewEdgeSource] = useState("")
  const [newEdgeTarget, setNewEdgeTarget] = useState("")
  const [newEdgeWeight, setNewEdgeWeight] = useState(1)
  const [sourceNode, setSourceNode] = useState("")
  const [targetNode, setTargetNode] = useState("")
  const [distanceMatrix, setDistanceMatrix] = useState<number[][]>([])
  const [nextMatrix, setNextMatrix] = useState<string[][]>([])
  const [shortestPath, setShortestPath] = useState<string[]>([])
  const [shortestDistance, setShortestDistance] = useState<number | null>(null)
  const [algorithmRun, setAlgorithmRun] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showWeights, setShowWeights] = useState(true)
  const [showNodeLabels, setShowNodeLabels] = useState(true)
  const [isDraggingNode, setIsDraggingNode] = useState(false)
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [showExamples, setShowExamples] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  // Add a new node
  const addNode = () => {
    if (!newNodeId.trim() || nodes.some((node) => node.id === newNodeId)) {
      return
    }

    // Generate random position within canvas
    const x = Math.random() * 400 + 50
    const y = Math.random() * 300 + 50

    setNodes([...nodes, { id: newNodeId, x, y }])
    setNewNodeId("")
  }

  // Add a new edge
  const addEdge = () => {
    if (
      !newEdgeSource ||
      !newEdgeTarget ||
      newEdgeSource === newEdgeTarget ||
      edges.some((edge) => edge.source === newEdgeSource && edge.target === newEdgeTarget)
    ) {
      return
    }

    setEdges([
      ...edges,
      {
        source: newEdgeSource,
        target: newEdgeTarget,
        weight: newEdgeWeight,
      },
    ])

    setNewEdgeSource("")
    setNewEdgeTarget("")
    setNewEdgeWeight(1)
  }

  // Run Floyd-Warshall algorithm with animation steps
  const runFloydWarshall = () => {
    if (nodes.length === 0) return

    // Initialize distance matrix with Infinity
    const dist: number[][] = Array(nodes.length)
      .fill(0)
      .map(() => Array(nodes.length).fill(Number.POSITIVE_INFINITY))
    const next: string[][] = Array(nodes.length)
      .fill(0)
      .map(() => Array(nodes.length).fill(""))

    // Map node IDs to matrix indices
    const nodeIndices = new Map<string, number>()
    nodes.forEach((node, index) => {
      nodeIndices.set(node.id, index)
    })

    // Initialize distances for direct edges
    edges.forEach((edge) => {
      const u = nodeIndices.get(edge.source)!
      const v = nodeIndices.get(edge.target)!
      dist[u][v] = edge.weight
      next[u][v] = edge.target
    })

    // Set distance to self as 0
    for (let i = 0; i < nodes.length; i++) {
      dist[i][i] = 0
    }

    // Create animation steps
    const steps: AnimationStep[] = []

    // Initial state
    steps.push({
      type: "init",
      matrix: JSON.parse(JSON.stringify(dist)),
    })

    // Floyd-Warshall algorithm with animation steps
    for (let k = 0; k < nodes.length; k++) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          // Processing step
          steps.push({
            type: "processing",
            k,
            i,
            j,
            matrix: JSON.parse(JSON.stringify(dist)),
          })

          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            const oldDist = dist[i][j]
            dist[i][j] = dist[i][k] + dist[k][j]
            next[i][j] = next[i][k]

            // Update step
            steps.push({
              type: "update",
              k,
              i,
              j,
              newDist: dist[i][j],
              matrix: JSON.parse(JSON.stringify(dist)),
            })
          }
        }
      }
    }

    // Final state
    steps.push({
      type: "final",
      matrix: JSON.parse(JSON.stringify(dist)),
    })

    setDistanceMatrix(dist)
    setNextMatrix(next)
    setAlgorithmRun(true)
    setAnimationSteps(steps)
    setCurrentStepIndex(0)

    // If source and target are selected, find the path
    if (sourceNode && targetNode) {
      const path = findPathArray(sourceNode, targetNode, nodeIndices, dist, next)
      setShortestPath(path)
      const u = nodeIndices.get(sourceNode)!
      const v = nodeIndices.get(targetNode)!
      setShortestDistance(dist[u][v] === Number.POSITIVE_INFINITY ? null : dist[u][v])

      // Add path to final step
      if (steps.length > 0) {
        const finalStep = steps[steps.length - 1]
        finalStep.path = path
      }
    }

    // Start animation
    setIsAnimating(true)
  }

  // Find path between source and target and return as array
  const findPathArray = (
    source: string,
    target: string,
    nodeIndices: Map<string, number>,
    dist: number[][],
    next: string[][],
  ): string[] => {
    const u = nodeIndices.get(source)!
    const v = nodeIndices.get(target)!

    if (next[u][v] === "") {
      return []
    }

    const path: string[] = [source]
    let current = source

    while (current !== target) {
      const currentIndex = nodeIndices.get(current)!
      const targetIndex = nodeIndices.get(target)!
      current = next[currentIndex][targetIndex]
      path.push(current)
    }

    return path
  }

  // Update path when source or target changes
  useEffect(() => {
    if (algorithmRun && sourceNode && targetNode) {
      const nodeIndices = new Map<string, number>()
      nodes.forEach((node, index) => {
        nodeIndices.set(node.id, index)
      })

      const path = findPathArray(sourceNode, targetNode, nodeIndices, distanceMatrix, nextMatrix)
      setShortestPath(path)

      const u = nodeIndices.get(sourceNode)!
      const v = nodeIndices.get(targetNode)!
      setShortestDistance(distanceMatrix[u][v] === Number.POSITIVE_INFINITY ? null : distanceMatrix[u][v])
    }
  }, [sourceNode, targetNode])

  // Animation control
  useEffect(() => {
    if (isAnimating && animationSteps.length > 0) {
      const animate = () => {
        if (currentStepIndex < animationSteps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1)
        } else {
          setIsAnimating(false)
        }
      }

      const timeout = setTimeout(animate, 1000 - animationSpeed * 9)
      return () => clearTimeout(timeout)
    }
  }, [isAnimating, currentStepIndex, animationSteps, animationSpeed])

  // Handle animation step
  useEffect(() => {
    if (animationSteps.length > 0 && currentStepIndex < animationSteps.length) {
      const currentStep = animationSteps[currentStepIndex]

      // Update visualization based on current step
      if (currentStep.type === "final" && currentStep.path) {
        setShortestPath(currentStep.path)
      }
    }
  }, [currentStepIndex, animationSteps])

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get canvas dimensions
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid (optional)
    ctx.beginPath()
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
    ctx.lineWidth = 1

    const gridSize = 20
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
    }
    ctx.stroke()

    // Get current animation step
    let currentHighlightK = -1
    let currentHighlightI = -1
    let currentHighlightJ = -1
    let isUpdating = false

    if (animationSteps.length > 0 && currentStepIndex < animationSteps.length) {
      const step = animationSteps[currentStepIndex]
      if (step.type === "processing" || step.type === "update") {
        currentHighlightK = step.k!
        currentHighlightI = step.i!
        currentHighlightJ = step.j!
        isUpdating = step.type === "update"
      }
    }

    // Draw edges
    edges.forEach((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source)
      const targetNode = nodes.find((node) => node.id === edge.target)

      if (sourceNode && targetNode) {
        // Calculate direction vector
        const dx = targetNode.x - sourceNode.x
        const dy = targetNode.y - sourceNode.y
        const length = Math.sqrt(dx * dx + dy * dy)

        // Node radius
        const nodeRadius = 25

        // Calculate start and end points (adjusted for node radius)
        const startX = sourceNode.x + (dx * nodeRadius) / length
        const startY = sourceNode.y + (dy * nodeRadius) / length
        const endX = targetNode.x - (dx * nodeRadius) / length
        const endY = targetNode.y - (dy * nodeRadius) / length

        // Check if this edge is part of the shortest path
        const isInPath =
          shortestPath.length > 1 &&
          shortestPath.some(
            (node, index) =>
              index < shortestPath.length - 1 && node === edge.source && shortestPath[index + 1] === edge.target,
          )

        // Check if this edge is being processed in the current animation step
        const sourceIndex = nodes.findIndex((n) => n.id === edge.source)
        const targetIndex = nodes.findIndex((n) => n.id === edge.target)
        const isBeingProcessed =
          isAnimating &&
          ((sourceIndex === currentHighlightI && targetIndex === currentHighlightJ) ||
            (sourceIndex === currentHighlightI && nodes[currentHighlightK]?.id === edge.target) ||
            (nodes[currentHighlightK]?.id === edge.source && targetIndex === currentHighlightJ))

        // Draw edge shadow for depth effect
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
        ctx.lineWidth = 4
        ctx.stroke()

        // Draw the edge
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)

        if (isInPath) {
          // Glowing effect for path
          ctx.strokeStyle = "#22c55e"
          ctx.lineWidth = 3
          ctx.shadowColor = "#22c55e"
          ctx.shadowBlur = 10
        } else if (isBeingProcessed) {
          // Highlight edge being processed
          ctx.strokeStyle = isUpdating ? "#f97316" : "#3b82f6"
          ctx.lineWidth = 3
          ctx.shadowColor = isUpdating ? "#f97316" : "#3b82f6"
          ctx.shadowBlur = 8
        } else {
          ctx.strokeStyle = "rgba(148, 163, 184, 0.7)"
          ctx.lineWidth = 2
          ctx.shadowBlur = 0
        }

        ctx.stroke()
        ctx.shadowBlur = 0

        // Draw arrowhead
        const angle = Math.atan2(dy, dx)
        const arrowSize = 10

        ctx.beginPath()
        ctx.moveTo(endX, endY)
        ctx.lineTo(endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6))
        ctx.lineTo(endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6))
        ctx.closePath()

        if (isInPath) {
          ctx.fillStyle = "#22c55e"
        } else if (isBeingProcessed) {
          ctx.fillStyle = isUpdating ? "#f97316" : "#3b82f6"
        } else {
          ctx.fillStyle = "rgba(148, 163, 184, 0.7)"
        }

        ctx.fill()

        // Draw weight
        if (showWeights) {
          // Calculate position for weight label (offset from the middle of the edge)
          const midX = (startX + endX) / 2
          const midY = (startY + endY) / 2

          // Offset perpendicular to the edge
          const perpX = (-dy / length) * 15
          const perpY = (dx / length) * 15

          // Draw weight background
          ctx.beginPath()
          ctx.arc(midX + perpX, midY + perpY, 14, 0, 2 * Math.PI)
          ctx.fillStyle = isInPath
            ? "rgba(34, 197, 94, 0.2)"
            : isBeingProcessed
              ? isUpdating
                ? "rgba(249, 115, 22, 0.2)"
                : "rgba(59, 130, 246, 0.2)"
              : "rgba(30, 41, 59, 0.7)"
          ctx.fill()
          ctx.strokeStyle = isInPath
            ? "rgba(34, 197, 94, 0.5)"
            : isBeingProcessed
              ? isUpdating
                ? "rgba(249, 115, 22, 0.5)"
                : "rgba(59, 130, 246, 0.5)"
              : "rgba(148, 163, 184, 0.3)"
          ctx.lineWidth = 1
          ctx.stroke()

          // Draw weight text
          ctx.fillStyle = "#ffffff"
          ctx.font = "12px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(edge.weight.toString(), midX + perpX, midY + perpY)
        }
      }
    })

    // Draw nodes
    nodes.forEach((node, index) => {
      // Check if this node is part of the shortest path
      const isInPath = shortestPath.includes(node.id)

      // Check if this node is being processed in the current animation step
      const isBeingProcessed =
        isAnimating && (index === currentHighlightI || index === currentHighlightJ || index === currentHighlightK)

      const isIntermediateNode = isAnimating && index === currentHighlightK

      // Draw node shadow for 3D effect
      ctx.beginPath()
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
      ctx.fill()

      // Draw node
      ctx.beginPath()
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI)

      // Gradient fill
      const gradient = ctx.createRadialGradient(node.x - 5, node.y - 5, 0, node.x, node.y, 25)

      if (isInPath) {
        gradient.addColorStop(0, "#22c55e")
        gradient.addColorStop(1, "#16a34a")
        ctx.shadowColor = "#22c55e"
        ctx.shadowBlur = 15
      } else if (isIntermediateNode) {
        gradient.addColorStop(0, "#f97316")
        gradient.addColorStop(1, "#ea580c")
        ctx.shadowColor = "#f97316"
        ctx.shadowBlur = 15
      } else if (isBeingProcessed) {
        gradient.addColorStop(0, "#3b82f6")
        gradient.addColorStop(1, "#2563eb")
        ctx.shadowColor = "#3b82f6"
        ctx.shadowBlur = 10
      } else {
        gradient.addColorStop(0, "#64748b")
        gradient.addColorStop(1, "#475569")
        ctx.shadowBlur = 0
      }

      ctx.fillStyle = gradient
      ctx.fill()

      // Draw node border
      ctx.strokeStyle = isInPath ? "#22c55e" : isIntermediateNode ? "#f97316" : isBeingProcessed ? "#3b82f6" : "#94a3b8"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.shadowBlur = 0

      // Draw node label
      if (showNodeLabels) {
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 14px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(node.id, node.x, node.y)
        
        // Add text shadow for better visibility/contrast
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
        ctx.shadowBlur = 3
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        ctx.fillText(node.id, node.x, node.y)
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      }

      // Draw role indicator for k, i, j nodes in animation
      if (isAnimating) {
        if (index === currentHighlightK) {
          drawRoleIndicator(ctx, node.x, node.y - 35, "k", "#f97316")
        }
        if (index === currentHighlightI) {
          drawRoleIndicator(ctx, node.x - 35, node.y, "i", "#3b82f6")
        }
        if (index === currentHighlightJ) {
          drawRoleIndicator(ctx, node.x + 35, node.y, "j", "#3b82f6")
        }
      }
    })

    // Draw animation status
    if (isAnimating && animationSteps.length > 0) {
      const step = animationSteps[currentStepIndex]
      let statusText = ""

      if (step.type === "init") {
        statusText = "Initializing distance matrix"
      } else if (step.type === "processing") {
        const kNode = nodes[step.k!]?.id || step.k
        const iNode = nodes[step.i!]?.id || step.i
        const jNode = nodes[step.j!]?.id || step.j
        statusText = `Checking if path ${iNode} → ${kNode} → ${jNode} is shorter than direct path ${iNode} → ${jNode}`
      } else if (step.type === "update") {
        const kNode = nodes[step.k!]?.id || step.k
        const iNode = nodes[step.i!]?.id || step.i
        const jNode = nodes[step.j!]?.id || step.j
        statusText = `Found shorter path from ${iNode} to ${jNode} through ${kNode}! New distance: ${step.newDist}`
      } else if (step.type === "final") {
        statusText = "Algorithm complete! All shortest paths found."
      }

      // Draw status text
      ctx.fillStyle = "rgba(30, 41, 59, 0.8)"
      ctx.fillRect(10, canvas.height - 40, canvas.width - 20, 30)
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(statusText, canvas.width / 2, canvas.height - 25)

      // Draw progress bar
      const progressWidth = (canvas.width - 20) * (currentStepIndex / (animationSteps.length - 1))
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(10, canvas.height - 45, progressWidth, 5)
    }
  }, [nodes, edges, shortestPath, isAnimating, currentStepIndex, animationSteps, showWeights, showNodeLabels])

  // Helper function to draw role indicators (k, i, j)
  const drawRoleIndicator = (ctx: CanvasRenderingContext2D, x: number, y: number, role: string, color: string) => {
    ctx.beginPath()
    ctx.arc(x, y, 12, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = "#ffffff"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(role, x, y)
  }

  // Handle mouse events for node dragging
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if a node was clicked
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const dx = x - node.x
        const dy = y - node.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= 25) {
          setIsDraggingNode(true)
          setDraggedNodeId(node.id)
          break
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingNode && draggedNodeId) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setNodes(nodes.map((node) => (node.id === draggedNodeId ? { ...node, x, y } : node)))
      }
    }

    const handleMouseUp = () => {
      setIsDraggingNode(false)
      setDraggedNodeId(null)
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseleave", handleMouseUp)

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mouseleave", handleMouseUp)
    }
  }, [nodes, isDraggingNode, draggedNodeId])

  // Animation control functions
  const pauseAnimation = () => {
    setIsAnimating(false)
  }

  const resumeAnimation = () => {
    setIsAnimating(true)
  }

  const skipToEnd = () => {
    setCurrentStepIndex(animationSteps.length - 1)
    setIsAnimating(false)
  }

  const resetAnimation = () => {
    setCurrentStepIndex(0)
    setIsAnimating(false)
  }

  // Clear all data
  const clearAll = () => {
    setNodes([])
    setEdges([])
    setDistanceMatrix([])
    setNextMatrix([])
    setShortestPath([])
    setShortestDistance(null)
    setAlgorithmRun(false)
    setIsAnimating(false)
    setAnimationSteps([])
    setCurrentStepIndex(0)
    setSourceNode("")
    setTargetNode("")
  }

  // Load example graphs
  const loadExample = (example: string) => {
    clearAll()

    if (example === "simple") {
      // Simple 4-node graph
      const exampleNodes = [
        { id: "A", x: 100, y: 100 },
        { id: "B", x: 300, y: 100 },
        { id: "C", x: 300, y: 300 },
        { id: "D", x: 100, y: 300 },
      ]

      const exampleEdges = [
        { source: "A", target: "B", weight: 5 },
        { source: "B", target: "C", weight: 3 },
        { source: "C", target: "D", weight: 4 },
        { source: "D", target: "A", weight: 6 },
        { source: "A", target: "C", weight: 10 },
      ]

      setNodes(exampleNodes)
      setEdges(exampleEdges)
    } else if (example === "complex") {
      // More complex 6-node graph
      const exampleNodes = [
        { id: "A", x: 150, y: 100 },
        { id: "B", x: 300, y: 50 },
        { id: "C", x: 450, y: 100 },
        { id: "D", x: 450, y: 250 },
        { id: "E", x: 300, y: 300 },
        { id: "F", x: 150, y: 250 },
      ]

      const exampleEdges = [
        { source: "A", target: "B", weight: 2 },
        { source: "A", target: "F", weight: 4 },
        { source: "B", target: "C", weight: 3 },
        { source: "B", target: "E", weight: 8 },
        { source: "C", target: "D", weight: 1 },
        { source: "D", target: "E", weight: 5 },
        { source: "E", target: "F", weight: 7 },
        { source: "F", target: "A", weight: 4 },
        { source: "F", target: "D", weight: 9 },
      ]

      setNodes(exampleNodes)
      setEdges(exampleEdges)
    } else if (example === "negative") {
      // Graph with negative weights
      const exampleNodes = [
        { id: "A", x: 150, y: 150 },
        { id: "B", x: 350, y: 150 },
        { id: "C", x: 250, y: 300 },
      ]

      const exampleEdges = [
        { source: "A", target: "B", weight: 6 },
        { source: "B", target: "C", weight: -3 },
        { source: "C", target: "A", weight: 2 },
        { source: "A", target: "C", weight: 4 },
      ]

      setNodes(exampleNodes)
      setEdges(exampleEdges)
    }
  }

  // Export graph as JSON
  const exportGraph = () => {
    const data = {
      nodes,
      edges,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "graph.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import graph from JSON
  const importGraph = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (data.nodes && data.edges) {
          setNodes(data.nodes)
          setEdges(data.edges)
        }
      } catch (error) {
        console.error("Error importing graph:", error)
      }
    }
    reader.readAsText(file)

    // Reset the input
    e.target.value = ""
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Graph Visualization</CardTitle>
                  <CardDescription>Drag nodes to reposition. Shortest path is highlighted in green.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setShowWeights(!showWeights)}>
                          {showWeights ? (
                            <span className="text-xs font-bold">W</span>
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">W</span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle Weights</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setShowNodeLabels(!showNodeLabels)}>
                          {showNodeLabels ? (
                            <span className="text-xs font-bold">ID</span>
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">ID</span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle Node Labels</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-slate-900">
                <canvas ref={canvasRef} width={600} height={400} className="w-full h-[400px]" />
              </div>

              {algorithmRun && shortestPath.length > 0 && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded-md">
                  <p className="font-medium">
                    Shortest path from {sourceNode} to {targetNode}:
                  </p>
                  <p className="mt-1">Path: {shortestPath.join(" → ")}</p>
                  <p className="mt-1">Total distance: {shortestDistance}</p>
                </div>
              )}

              {algorithmRun && sourceNode && targetNode && shortestPath.length === 0 && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-md">
                  <p>
                    No path exists from {sourceNode} to {targetNode}
                  </p>
                </div>
              )}

              {isAnimating && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={isAnimating ? pauseAnimation : resumeAnimation}>
                      {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={resetAnimation}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={skipToEnd}>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 flex-1 max-w-xs ml-4">
                    <span className="text-xs">Slow</span>
                    <Slider
                      value={[animationSpeed]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value: readonly number[]) => setAnimationSpeed(value[0])}
                    />
                    <span className="text-xs">Fast</span>
                  </div>

                  <div>
                    <Badge variant="outline">
                      Step {currentStepIndex + 1} of {animationSteps.length}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Algorithm Controls</CardTitle>
              <CardDescription>Run the algorithm and find shortest paths</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={runFloydWarshall}
                    disabled={nodes.length < 2 || edges.length === 0 || isAnimating}
                    className="flex-1"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Run Floyd-Warshall Algorithm
                  </Button>

                  <Button variant="outline" onClick={() => setShowExamples(!showExamples)}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Examples
                  </Button>

                  <Button variant="outline" onClick={exportGraph}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>

                  <div className="relative">
                    <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                    <input 
                      id="import-file" 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={importGraph} 
                      aria-label="Import graph from JSON file"
                    />
                  </div>
                </div>

                {showExamples && (
                  <div className="p-3 bg-slate-800 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Example Graphs</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" onClick={() => loadExample("simple")}>
                        Simple (4 nodes)
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => loadExample("complex")}>
                        Complex (6 nodes)
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => loadExample("negative")}>
                        Negative Weights
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="sourceSelect">Source</Label>
                    <Select value={sourceNode} onValueChange={setSourceNode} disabled={!algorithmRun}>
                      <SelectTrigger id="sourceSelect">
                        <SelectValue placeholder="Source" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="targetSelect">Target</Label>
                    <Select value={targetNode} onValueChange={setTargetNode} disabled={!algorithmRun}>
                      <SelectTrigger id="targetSelect">
                        <SelectValue placeholder="Target" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button variant="destructive" onClick={clearAll} className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="nodes">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="nodes">Nodes</TabsTrigger>
              <TabsTrigger value="edges">Edges</TabsTrigger>
            </TabsList>

            <TabsContent value="nodes">
              <Card>
                <CardHeader>
                  <CardTitle>Add Node</CardTitle>
                  <CardDescription>Create nodes for your graph</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="nodeId">Node ID</Label>
                      <Input
                        id="nodeId"
                        value={newNodeId}
                        onChange={(e) => setNewNodeId(e.target.value)}
                        placeholder="A, B, C, etc."
                      />
                    </div>
                    <Button onClick={addNode} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {nodes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Existing Nodes</h4>
                      <div className="flex flex-wrap gap-2">
                        {nodes.map((node) => (
                          <div
                            key={node.id}
                            className="px-2 py-1 bg-orange-900/30 border border-orange-800/50 rounded text-sm"
                          >
                            {node.id}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Alert className="mt-4 bg-blue-900/20 border-blue-800">
                    <AlertDescription>Tip: You can drag nodes to reposition them on the canvas.</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edges">
              <Card>
                <CardHeader>
                  <CardTitle>Add Edge</CardTitle>
                  <CardDescription>Create weighted edges between nodes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="sourceNode">From</Label>
                        <Select value={newEdgeSource} onValueChange={setNewEdgeSource}>
                          <SelectTrigger id="sourceNode">
                            <SelectValue placeholder="Source" />
                          </SelectTrigger>
                          <SelectContent>
                            {nodes.map((node) => (
                              <SelectItem key={node.id} value={node.id}>
                                {node.id}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="targetNode">To</Label>
                        <Select value={newEdgeTarget} onValueChange={setNewEdgeTarget}>
                          <SelectTrigger id="targetNode">
                            <SelectValue placeholder="Target" />
                          </SelectTrigger>
                          <SelectContent>
                            {nodes.map((node) => (
                              <SelectItem key={node.id} value={node.id}>
                                {node.id}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={newEdgeWeight}
                          onChange={(e) => setNewEdgeWeight(Number(e.target.value) || 1)}
                        />
                      </div>
                      <Button onClick={addEdge} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {edges.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Existing Edges</h4>
                        <div className="max-h-[150px] overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Weight</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {edges.map((edge, index) => (
                                <TableRow key={index}>
                                  <TableCell>{edge.source}</TableCell>
                                  <TableCell>{edge.target}</TableCell>
                                  <TableCell>{edge.weight}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {algorithmRun && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Distance Matrix</CardTitle>
                <CardDescription>Shortest distances between all pairs of nodes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Node</TableHead>
                        {nodes.map((node) => (
                          <TableHead key={node.id}>{node.id}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nodes.map((node, i) => (
                        <TableRow key={node.id}>
                          <TableCell className="font-medium">{node.id}</TableCell>
                          {nodes.map((_, j) => (
                            <TableCell
                              key={j}
                              className={
                                sourceNode === node.id && targetNode === nodes[j].id
                                  ? "bg-green-900/30 font-medium"
                                  : ""
                              }
                            >
                              {distanceMatrix[i][j] === Number.POSITIVE_INFINITY ? "∞" : distanceMatrix[i][j]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
