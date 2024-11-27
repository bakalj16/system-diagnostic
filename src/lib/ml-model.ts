import * as tf from '@tensorflow/tfjs';

export async function trainPredictiveModel(historicalData: any[]) {
  // Prepara los datos
  const inputs = historicalData.map(d => [d.cpuUsage, d.memoryUsage, d.networkTraffic]);
  const labels = historicalData.map(d => d.performanceScore);

  const inputTensor = tf.tensor2d(inputs);
  const labelTensor = tf.tensor1d(labels);

  // Crea y entrena el modelo
  const model = tf.sequential();
  model.add(tf.layers.dense({inputShape: [3], units: 10, activation: 'relu'}));
  model.add(tf.layers.dense({units: 1}));

  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse'],
  });

  await model.fit(inputTensor, labelTensor, {
    batchSize: 32,
    epochs: 100,
    shuffle: true,
    validationSplit: 0.2
  });

  return model;
}

export function predictPerformance(model: tf.LayersModel, currentData: number[]) {
  const inputTensor = tf.tensor2d([currentData]);
  const prediction = model.predict(inputTensor) as tf.Tensor;
  return prediction.dataSync()[0];
}