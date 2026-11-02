import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getTotalSlidesCount,
  clampSlideId,
  getNextSlideId,
  getPrevSlideId,
  getSlideById,
  filterSlides,
  getSectionForSlide,
  calculateProgressPercent,
  validateDeckIntegrity,
} from './deckLogic';

test('deck integrity verifies all 45 slides have speaker notes and diagrams', () => {
  const report = validateDeckIntegrity();
  assert.equal(report.totalSlides, 45);
  assert.deepEqual(report.missingSpeakerNotesIds, []);
  assert.deepEqual(report.missingDiagramIds, []);
  assert.equal(report.valid, true);
});

test('slide navigation clamps within 1..45 accurately', () => {
  assert.equal(getTotalSlidesCount(), 45);
  assert.equal(clampSlideId(0), 1);
  assert.equal(clampSlideId(-5), 1);
  assert.equal(clampSlideId(46), 45);
  assert.equal(getPrevSlideId(1), 1);
  assert.equal(getNextSlideId(1), 2);
  assert.equal(getNextSlideId(45), 45);
  assert.equal(getPrevSlideId(45), 44);
});

test('getSlideById and getSectionForSlide return accurate slide and section', () => {
  const slide16 = getSlideById(16);
  assert.equal(slide16.id, 16);
  assert.equal(slide16.sectionId, 3);
  assert.equal(slide16.title.includes('CVE-2026-109618'), true);

  const section = getSectionForSlide(16);
  assert.equal(section.id, 3);
  assert.equal(calculateProgressPercent(45), 100);
});

test('filterSlides filters by section and technical search terms', () => {
  const sec2Slides = filterSlides(2, '');
  assert.equal(sec2Slides.length, 6); // Slides 9 to 14

  const cve18Slides = filterSlides('all', 'CVE-2026-109618');
  assert.equal(cve18Slides.length >= 3, true);

  const splunkSlides = filterSlides('all', 'Splunk');
  assert.equal(splunkSlides.some((s) => s.id === 36), true);

  const patchedSlides = filterSlides(6, '8.4.27');
  assert.equal(patchedSlides.some((s) => s.id === 38), true);
});
