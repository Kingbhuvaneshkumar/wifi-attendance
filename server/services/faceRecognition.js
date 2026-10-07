/**
 * Calculates Euclidean distance between two 128-dimensional face embedding vectors.
 * Lower distance = closer match (distance <= 0.60 indicates a face match in face-api.js).
 */
const euclideanDistance = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return 1.0;
  }
  const sumSquare = a.reduce((sum, val, idx) => sum + Math.pow(val - b[idx], 2), 0);
  return Math.sqrt(sumSquare);
};

exports.extractEmbedding = async (faceData) => {
  if (Array.isArray(faceData)) {
    return faceData;
  }
  return [];
};

exports.verifyFace = async (liveEmbedding, storedEmbeddings, maxDistanceThreshold = 0.60) => {
  if (!Array.isArray(storedEmbeddings) || storedEmbeddings.length === 0) {
    return { verified: false, distance: 1.0 };
  }

  const validEmbeddings = storedEmbeddings.filter(
    (e) => Array.isArray(e) && e.length > 0
  );

  if (validEmbeddings.length === 0) {
    return { verified: false, distance: 1.0 };
  }

  const distances = validEmbeddings.map((stored) =>
    euclideanDistance(liveEmbedding, stored)
  );
  const minDistance = Math.min(...distances);

  const verified = minDistance <= maxDistanceThreshold;

  console.log(
    `[Face Verification] Min Euclidean Distance: ${minDistance.toFixed(4)} | Threshold: ${maxDistanceThreshold} | Verified: ${verified}`
  );

  return {
    verified,
    distance: minDistance,
  };
};
