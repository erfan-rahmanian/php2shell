import { SLIDES_DATA, SECTIONS, SlideItem, SectionInfo } from '../data/slidesData';

export function getTotalSlidesCount(slides: SlideItem[] = SLIDES_DATA): number {
  return slides.length;
}

export function clampSlideId(targetId: number, slides: SlideItem[] = SLIDES_DATA): number {
  if (slides.length === 0) return 1;
  const minId = slides[0].id;
  const maxId = slides[slides.length - 1].id;
  if (targetId < minId) return minId;
  if (targetId > maxId) return maxId;
  return targetId;
}

export function getNextSlideId(currentId: number, slides: SlideItem[] = SLIDES_DATA): number {
  return clampSlideId(currentId + 1, slides);
}

export function getPrevSlideId(currentId: number, slides: SlideItem[] = SLIDES_DATA): number {
  return clampSlideId(currentId - 1, slides);
}

export function getSlideById(slideId: number, slides: SlideItem[] = SLIDES_DATA): SlideItem {
  const clamped = clampSlideId(slideId, slides);
  return slides.find((s) => s.id === clamped) || slides[0];
}

export function filterSlides(
  sectionId: number | 'all',
  searchQuery: string,
  slides: SlideItem[] = SLIDES_DATA
): SlideItem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return slides.filter((slide) => {
    const matchesSection = sectionId === 'all' || slide.sectionId === sectionId;
    if (!matchesSection) return false;
    if (!normalizedQuery) return true;

    const inTitle = slide.title.toLowerCase().includes(normalizedQuery);
    const inSubtitle = slide.subtitle.toLowerCase().includes(normalizedQuery);
    const inTakeaway = slide.keyTakeaway.toLowerCase().includes(normalizedQuery);
    const inNotes = slide.speakerNotes.toLowerCase().includes(normalizedQuery);
    const inBullets = slide.bullets.some((b) => b.toLowerCase().includes(normalizedQuery));
    const inCode =
      slide.codeBlocks?.some(
        (c) =>
          c.code.toLowerCase().includes(normalizedQuery) ||
          c.label.toLowerCase().includes(normalizedQuery)
      ) ?? false;
    const inTable =
      slide.table?.rows.some((r) =>
        r.some((cell) => cell.toLowerCase().includes(normalizedQuery))
      ) ?? false;

    return inTitle || inSubtitle || inTakeaway || inNotes || inBullets || inCode || inTable;
  });
}

export function getSectionForSlide(
  slideId: number,
  sections: SectionInfo[] = SECTIONS
): SectionInfo {
  const slide = getSlideById(slideId);
  return sections.find((sec) => sec.id === slide.sectionId) || sections[0];
}

export function calculateProgressPercent(
  currentId: number,
  slides: SlideItem[] = SLIDES_DATA
): number {
  if (slides.length === 0) return 0;
  const clamped = clampSlideId(currentId, slides);
  return Math.round((clamped / slides.length) * 100);
}

export function validateDeckIntegrity(slides: SlideItem[] = SLIDES_DATA): {
  valid: boolean;
  totalSlides: number;
  missingSpeakerNotesIds: number[];
  missingDiagramIds: number[];
} {
  const missingSpeakerNotesIds = slides
    .filter((s) => !s.speakerNotes || s.speakerNotes.trim().length < 20)
    .map((s) => s.id);
  const missingDiagramIds = slides
    .filter((s) => !s.diagramType || s.diagramType.trim().length === 0)
    .map((s) => s.id);

  return {
    valid:
      slides.length === 45 &&
      missingSpeakerNotesIds.length === 0 &&
      missingDiagramIds.length === 0,
    totalSlides: slides.length,
    missingSpeakerNotesIds,
    missingDiagramIds,
  };
}
