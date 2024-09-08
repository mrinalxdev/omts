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