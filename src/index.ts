import { Hono } from 'hono'
import {cors} from 'hono/cors'


class NeuralNetwork {
  private inputNodes: number
  private hiddenNodes: number
  private outputNodes: number
  private weightsIH: number[][]
  private weightsHO: number[][]
  private biasH: number[]
  private biasO: number[]

  constructor(inputNodes: number, hiddenNodes: number, outputNodes: number) {
    this.inputNodes = inputNodes
    this.hiddenNodes = hiddenNodes
    this.outputNodes = outputNodes

    this.weightsIH = this.initializeWeights(this.inputNodes, this.hiddenNodes)
    this.weightsHO = this.initializeWeights(this.hiddenNodes, this.outputNodes)
    this.biasH = new Array(this.hiddenNodes).fill(0)
    this.biasO = new Array(this.outputNodes).fill(0)
  }

  private initializeWeights(rows: number, cols: number): number[][] {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() * 2 - 1)
    )
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x))
  }

  private dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0)
  }

  train(inputs: number[], targets: number[], learningRate: number): void {
    // Forward pass
    const hiddenOutputs = inputs.map((_, i) =>
      this.sigmoid(this.dotProduct(this.weightsIH[i], this.biasH))
    )
    const outputs = hiddenOutputs.map((_, i) =>
      this.sigmoid(this.dotProduct(this.weightsHO[i], this.biasO))
    )

    const outputErrors = targets.map((t, i) => t - outputs[i])
    const hiddenErrors = this.weightsHO.map((row) =>
      row.reduce((sum, weight, i) => sum + weight * outputErrors[i], 0)
    )

    this.weightsHO = this.weightsHO.map((row, i) =>
      row.map((weight, j) => weight + learningRate * outputErrors[i] * hiddenOutputs[j])
    )
    this.weightsIH = this.weightsIH.map((row, i) =>
      row.map((weight, j) => weight + learningRate * hiddenErrors[i] * inputs[j])
    )
    this.biasO = this.biasO.map((bias, i) => bias + learningRate * outputErrors[i])
    this.biasH = this.biasH.map((bias, i) => bias + learningRate * hiddenErrors[i])
  }

  predict(inputs: number[]): number[] {
    const hiddenOutputs = inputs.map((_, i) =>
      this.sigmoid(this.dotProduct(this.weightsIH[i], this.biasH))
    )
    return hiddenOutputs.map((_, i) =>
      this.sigmoid(this.dotProduct(this.weightsHO[i], this.biasO))
    )
  }

  getWeights(): { weightsIH: number[][], weightsHO: number[][] } {
    return { weightsIH: this.weightsIH, weightsHO: this.weightsHO }
  }
}

const app = new Hono()

app.use('/*', cors())

const nn = new NeuralNetwork(2, 3, 1)

app.post('/api/train', async (c) => {
  const { inputs, targets, learningRate } = await c.req.json()
  nn.train(inputs, targets, learningRate)
  return c.json({ success: true })
})

app.post('/api/predict', async (c) => {
  const { inputs } = await c.req.json()
  const prediction = nn.predict(inputs)
  return c.json({ prediction })
})

app.get('/api/weights', (c) => {
  const weights = nn.getWeights()
  return c.json(weights)
})

export default app