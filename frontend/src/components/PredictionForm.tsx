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