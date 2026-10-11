import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LSEC_ENTRIES, LSEC_CATEGORIES, LSEC_STATUS, createLsecRegistry, isPublishable, missingRequirements } from '../../js/data/lsec.js';

const validated = {
  concept: 'animal:perro',
  category: 'animales',
  label: 'Perro',
  status: LSEC_STATUS.VALIDATED,
  src: 'assets/lsec/videos/animal-perro.mp4',
  poster: null,
  captions: null,
  license: 'CC BY-NC-SA 4.0',
  signer: null,
  validation: { reviewers: ['Asociación de personas sordas (ejemplo)'], date: '2026-01-15' },
  consent: true,
};

test('ninguna seña se publica hoy: todas están pendientes', () => {
  const registry = createLsecRegistry();
  assert.equal(registry.publishableCount(), 0);
  assert.equal(registry.hasAnyVideo(), false);
  for (const entry of LSEC_ENTRIES) {
    assert.equal(entry.status, LSEC_STATUS.PENDING);
    assert.equal(entry.src, null);
    assert.equal(registry.videoFor(entry.concept), null);
  }
});

test('el vocabulario cubre las categorías pedidas', () => {
  const categories = new Set(LSEC_ENTRIES.map((e) => e.category));
  for (const c of LSEC_CATEGORIES) assert.ok(categories.has(c.id), c.id);
  assert.equal(new Set(LSEC_ENTRIES.map((e) => e.concept)).size, LSEC_ENTRIES.length, 'conceptos únicos');
});

test('una entrada completa y validada sí se muestra', () => {
  const registry = createLsecRegistry([validated]);
  assert.equal(registry.videoFor('animal:perro'), validated);
  assert.equal(registry.hasAnyVideo(), true);
  assert.deepEqual(missingRequirements(validated), []);
});

test('falta cualquier requisito → no se muestra', () => {
  const broken = [
    { status: LSEC_STATUS.REVIEW },
    { src: '' },
    { license: null },
    { consent: false },
    { validation: { reviewers: [], date: '2026-01-15' } },
    { validation: { reviewers: ['  '], date: '2026-01-15' } },
    { validation: { reviewers: ['Alguien'], date: 'ayer' } },
    { validation: null },
  ];
  for (const patch of broken) {
    const entry = { ...validated, ...patch };
    assert.equal(isPublishable(entry), false, JSON.stringify(patch));
    assert.equal(createLsecRegistry([entry]).videoFor(entry.concept), null);
  }
});
