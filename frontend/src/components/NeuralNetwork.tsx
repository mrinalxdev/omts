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