const crypto = require('crypto');

const toVector = (hash) => {
  const buffer = Buffer.from(hash, 'hex');
  return Array.from(buffer).slice(0, 128).map((value) => value / 255);
};

const cosineSimilarity = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return 0;
  }

  const dot = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const normA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const normB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));

  if (normA === 0 || normB === 0) return 0;

  return dot / (normA * normB);
};

exports.extractEmbedding = async (base64Image) => {
  const hash = crypto.createHash('sha256').update(base64Image).digest('hex');
  return toVector(hash);
};

exports.verifyFace = async (embedding, storedEmbeddings, threshold = 0.65) => {
  if (!Array.isArray(storedEmbeddings) || storedEmbeddings.length === 0) {
    return { verified: false, score: 0 };
  }

  const scores = storedEmbeddings.map((stored) => cosineSimilarity(embedding, stored));
  const score = Math.max(...scores, 0);
  return { verified: score >= threshold, score };
};
