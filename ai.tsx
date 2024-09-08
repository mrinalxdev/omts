// App.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import NeuralNetwork from './components/NeuralNetwork';
import TrainingForm from './components/TrainingForm';
import PredictionForm from './components/PredictionForm';

interface Weights {
  weightsIH: number[][];
  weightsHO: number[][];
}

function App() {
  const [weights, setWeights] = useState<Weights>({ weightsIH: [], weightsHO: [] });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/weights');
      setWeights(response.data);
    } catch (error) {
      console.error('Error fetching weights:', error);
      // Set default weights if fetch fails
      setWeights({ weightsIH: [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5]], weightsHO: [[0.5], [0.5], [0.5]] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrain = async (inputs: number[], target: number, learningRate: number) => {
    try {
      await axios.post('http://localhost:3000/api/train', { inputs, targets: [target], learningRate });
      fetchWeights();
    } catch (error) {
      console.error('Error training:', error);
    }
  };

  const handlePredict = async (inputs: number[]) => {
    try {
      const response = await axios.post('http://localhost:3000/api/predict', { inputs });
      setPrediction(response.data.prediction[0]);
    } catch (error) {
      console.error('Error predicting:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">Neural Network Visualizer</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TrainingForm onTrain={handleTrain} />
            <PredictionForm onPredict={handlePredict} prediction={prediction} />
          </div>
          <div className="mt-8">
            {isLoading ? (
              <p>Loading neural network...</p>
            ) : (
              <NeuralNetwork weights={weights} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;

//PredictionForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PredictionFormProps {
  onPredict: (inputs: number[]) => void;
  prediction: number | null;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict, prediction }) => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict([parseFloat(input1), parseFloat(input2)]);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold">Prediction</h2>
      <input
        type="number"
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        placeholder="Input 1"
        className="w-full px-3 py-2 border rounded-md"
        required
      />
      <input
        type="number"
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        placeholder="Input 2"
        className="w-full px-3 py-2 border rounded-md"
        required
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
      >
        Predict
      </button>
      {prediction !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-lg font-semibold"
        >
          Prediction: {prediction.toFixed(4)}
        </motion.div>
      )}
    </motion.form>
  );
};

export default PredictionForm;

// TrainingForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TrainingFormProps {
  onTrain: (inputs: number[], target: number, learningRate: number) => void;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ onTrain }) => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [target, setTarget] = useState('');
  const [learningRate, setLearningRate] = useState('0.1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTrain([parseFloat(input1), parseFloat(input2)], parseFloat(target), parseFloat(learningRate));
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold">Training</h2>
      <input
        type="number"
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        placeholder="Input 1"
        className="w-full px-3 py-2 border rounded-md"
        required
      />
      <input
        type="number"
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        placeholder="Input 2"
        className="w-full px-3 py-2 border rounded-md"
        required
      />
      <input
        type="number"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Target"
        className="w-full px-3 py-2 border rounded-md"
        required
      />
      <input
        type="number"
        value={learningRate}
        onChange={(e) => setLearningRate(e.target.value)}
        placeholder="Learning Rate"
        className="w-full px-3 py-2 border rounded-md"
        required
        step="0.01"
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Train
      </button>
    </motion.form>
  );
};

export default TrainingForm;

// NeuralNetwork.tsx
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface NeuralNetworkProps {
  weights: {
    weightsIH: number[][];
    weightsHO: number[][];
  };
}

const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ weights }) => {
  const weightsIH = weights?.weightsIH || [];
  const weightsHO = weights?.weightsHO || [];

  const inputNodes = weightsIH.length || 2;
  const hiddenNodes = (weightsIH[0]?.length || weightsHO.length || 3);
  const outputNodes = weightsHO[0]?.length || 1;

  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [weights, controls]);

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20,
      }
    }
  };

  const linkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { 
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.5 },
        delay: custom * 0.1
      }
    })
  };

  return (
    <svg width="400" height="300" viewBox="0 0 400 300">
      {/* Connections */}
      {weightsIH.flatMap((row, i) =>
        row.map((weight, j) => (
          <motion.line
            key={`ih-${i}-${j}`}
            x1={70}
            y1={(i + 1) * (300 / (inputNodes + 1))}
            x2={180}
            y2={(j + 1) * (300 / (hiddenNodes + 1))}
            stroke={weight > 0 ? '#48bb78' : '#f56565'}
            strokeWidth={Math.abs(weight) * 3}
            initial="hidden"
            animate={controls}
            variants={linkVariants}
            custom={i * hiddenNodes + j}
          />
        ))
      )}

      {weightsHO.flatMap((row, i) =>
        row.map((weight, j) => (
          <motion.line
            key={`ho-${i}-${j}`}
            x1={220}
            y1={(i + 1) * (300 / (hiddenNodes + 1))}
            x2={330}
            y2={(j + 1) * (300 / (outputNodes + 1))}
            stroke={weight > 0 ? '#48bb78' : '#f56565'}
            strokeWidth={Math.abs(weight) * 3}
            initial="hidden"
            animate={controls}
            variants={linkVariants}
            custom={inputNodes * hiddenNodes + i * outputNodes + j}
          />
        ))
      )}

      {/* Input nodes */}
      {Array.from({ length: inputNodes }).map((_, i) => (
        <motion.circle
          key={`input-${i}`}
          cx={50}
          cy={(i + 1) * (300 / (inputNodes + 1))}
          r="20"
          fill="#4299e1"
          initial="hidden"
          animate={controls}
          variants={nodeVariants}
          transition={{ delay: i * 0.1 }}
        />
      ))}

      {/* Hidden nodes */}
      {Array.from({ length: hiddenNodes }).map((_, i) => (
        <motion.circle
          key={`hidden-${i}`}
          cx={200}
          cy={(i + 1) * (300 / (hiddenNodes + 1))}
          r="20"
          fill="#ed8936"
          initial="hidden"
          animate={controls}
          variants={nodeVariants}
          transition={{ delay: (inputNodes + i) * 0.1 }}
        />
      ))}

      {/* Output nodes */}
      {Array.from({ length: outputNodes }).map((_, i) => (
        <motion.circle
          key={`output-${i}`}
          cx={350}
          cy={(i + 1) * (300 / (outputNodes + 1))}
          r="20"
          fill="#48bb78"
          initial="hidden"
          animate={controls}
          variants={nodeVariants}
          transition={{ delay: (inputNodes + hiddenNodes + i) * 0.1 }}
        />
      ))}
    </svg>
  );
};

export default NeuralNetwork;
// server file server/index.ts
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