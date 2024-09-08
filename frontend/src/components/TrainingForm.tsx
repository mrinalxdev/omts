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