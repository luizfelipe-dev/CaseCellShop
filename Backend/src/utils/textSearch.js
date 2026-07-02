const STOPWORDS = new Set([
  'a',
  'o',
  'e',
  'de',
  'da',
  'do',
  'das',
  'dos',
  'em',
  'para',
  'com',
  'um',
  'uma',
  'os',
  'as',
]);

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function tokenize(text) {
  return normalizeText(text)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

function buildTermFrequency(tokens) {
  const frequencies = new Map();

  for (const token of tokens) {
    frequencies.set(token, (frequencies.get(token) || 0) + 1);
  }

  return frequencies;
}

function buildVocabulary(...tokenLists) {
  const vocabulary = new Set();

  for (const tokens of tokenLists) {
    for (const token of tokens) {
      vocabulary.add(token);
    }
  }

  return [...vocabulary];
}

function vectorize(termFrequency, vocabulary) {
  return vocabulary.map((term) => termFrequency.get(term) || 0);
}

function cosineSimilarity(vectorA, vectorB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let index = 0; index < vectorA.length; index += 1) {
    dotProduct += vectorA[index] * vectorB[index];
    magnitudeA += vectorA[index] ** 2;
    magnitudeB += vectorB[index] ** 2;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

function calculateNameBoost(query, productName) {
  const normalizedQuery = normalizeText(query);
  const normalizedName = normalizeText(productName);
  const queryTokens = tokenize(query);

  if (normalizedName === normalizedQuery) {
    return 0.35;
  }

  if (normalizedName.includes(normalizedQuery) && normalizedQuery.length > 2) {
    return 0.2;
  }

  const matchedTokens = queryTokens.filter((token) =>
    normalizedName.includes(token)
  );

  if (queryTokens.length > 0) {
    return (matchedTokens.length / queryTokens.length) * 0.15;
  }

  return 0;
}

function rankByVectorSimilarity(query, items, options = {}) {
  const {
    textSelector = (item) => item.name,
    minScore = 0.12,
    limit = 5,
  } = options;

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return [];
  }

  const queryFrequencies = buildTermFrequency(queryTokens);
  const itemTokensList = items.map((item) => tokenize(textSelector(item)));
  const vocabulary = buildVocabulary(queryTokens, ...itemTokensList);
  const queryVector = vectorize(queryFrequencies, vocabulary);

  const ranked = items
    .map((item, index) => {
      const itemTokens = itemTokensList[index];
      const itemVector = vectorize(buildTermFrequency(itemTokens), vocabulary);
      const vectorScore = cosineSimilarity(queryVector, itemVector);
      const nameBoost = calculateNameBoost(query, item.name || textSelector(item));
      const score = Math.min(vectorScore + nameBoost, 1);

      return {
        item,
        score: Number(score.toFixed(4)),
      };
    })
    .filter((entry) => entry.score >= minScore)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);

  return ranked;
}

module.exports = {
  tokenize,
  cosineSimilarity,
  rankByVectorSimilarity,
};
