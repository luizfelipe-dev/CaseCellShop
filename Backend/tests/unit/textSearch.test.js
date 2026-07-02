const {
  tokenize,
  cosineSimilarity,
  rankByVectorSimilarity,
} = require('../../src/utils/textSearch');

describe('textSearch', () => {
  it('tokeniza texto removendo acentos e stopwords', () => {
    const tokens = tokenize('Capinha para o iPhone 15');
    expect(tokens).toContain('capinha');
    expect(tokens).toContain('iphone');
    expect(tokens).not.toContain('para');
    expect(tokens).not.toContain('o');
  });

  it('calcula similaridade de cosseno entre vetores', () => {
    const score = cosineSimilarity([1, 1, 0], [1, 1, 0]);
    expect(score).toBeCloseTo(1);
  });

  it('rankeia produtos por similaridade vetorial', () => {
    const catalog = [
      { id: '1', name: 'Capinha Silicone iPhone 15', description: 'Proteção flexível' },
      { id: '2', name: 'Capinha Galaxy S24', description: 'Transparente' },
      { id: '3', name: 'Capinha Eco Reciclada', description: 'Sustentável' },
    ];

    const ranked = rankByVectorSimilarity('iphone silicone', catalog, {
      textSelector: (item) => `${item.name} ${item.description}`,
      minScore: 0.05,
    });

    expect(ranked.length).toBeGreaterThanOrEqual(1);
    expect(ranked[0].item.id).toBe('1');
    expect(ranked[0].score).toBeGreaterThan(0.2);
  });
});
