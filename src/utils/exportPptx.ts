import PptxGenJS from 'pptxgenjs';
import { SLIDES_DATA, SlideItem } from '../data/slidesData';

export async function exportPresentationToPptx(
  slides: SlideItem[] = SLIDES_DATA
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Cybersecurity Research & SOC Engineering';
  pptx.company = 'Security Operations & Vulnerability Research';
  pptx.subject = 'PHP2Shell: CVE-2026-109618 & CVE-2026-109619 Technical Deep Dive';
  pptx.title = 'PHP2Shell: From Memory Corruption to Remote Code Execution';

  for (const item of slides) {
    const slide = pptx.addSlide();
    slide.background = { color: '0B1120' };

    // Top metadata bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.4,
      y: 0.25,
      w: 9.2,
      h: 0.36,
      fill: { color: '111827' },
      line: { color: '1E293B', width: 1 },
    });

    slide.addText(
      `Slide ${item.id} / ${slides.length}   |   Stage: ${item.storyStage}   |   ${item.sectionTitle}`,
      {
        x: 0.55,
        y: 0.28,
        w: 8.9,
        h: 0.3,
        fontSize: 9.5,
        color: '94A3B8',
        fontFace: 'Arial',
        align: 'right',
        rtlMode: true,
      }
    );

    // Slide Title
    slide.addText(item.title, {
      x: 0.4,
      y: 0.72,
      w: 9.2,
      h: 0.48,
      fontSize: 18,
      bold: true,
      color: 'F8FAFC',
      fontFace: 'Arial',
      align: 'right',
      rtlMode: true,
    });

    // Subtitle
    slide.addText(item.subtitle, {
      x: 0.4,
      y: 1.18,
      w: 9.2,
      h: 0.32,
      fontSize: 11,
      color: '38BDF8',
      fontFace: 'Arial',
      align: 'right',
      rtlMode: true,
    });

    // Key Takeaway Banner
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.4,
      y: 1.56,
      w: 9.2,
      h: 0.48,
      fill: { color: '172033' },
      line: { color: '334155', width: 1 },
    });

    slide.addText(`پیام کلیدی: ${item.keyTakeaway}`, {
      x: 0.55,
      y: 1.61,
      w: 8.9,
      h: 0.38,
      fontSize: 10,
      bold: true,
      color: 'E2E8F0',
      fontFace: 'Arial',
      align: 'right',
      rtlMode: true,
    });

    const hasCodeOrTable =
      (item.codeBlocks && item.codeBlocks.length > 0) || Boolean(item.table);

    // Right column (in RTL): Main bullets
    const bulletBoxX = hasCodeOrTable ? 5.05 : 0.4;
    const bulletBoxW = hasCodeOrTable ? 4.55 : 9.2;

    slide.addShape(pptx.ShapeType.rect, {
      x: bulletBoxX,
      y: 2.16,
      w: bulletBoxW,
      h: 3.05,
      fill: { color: '111827' },
      line: { color: '1E293B', width: 1 },
    });

    const bulletLines = item.bullets.map((b) => ({
      text: `• ${b}`,
      options: {
        fontSize: 10,
        color: 'CBD5E1',
        breakLine: true,
        rtlMode: true,
      },
    }));

    slide.addText(bulletLines, {
      x: bulletBoxX + 0.15,
      y: 2.25,
      w: bulletBoxW - 0.3,
      h: 2.85,
      fontFace: 'Arial',
      align: 'right',
      valign: 'top',
      lineSpacingMultiple: 1.2,
    });

    // Left column (in RTL): Code block or Table if present
    if (item.table) {
      const tableRows = [
        item.table.headers.map((h) => ({
          text: h,
          options: {
            bold: true,
            fontSize: 8.5,
            color: '38BDF8',
            fill: { color: '1E293B' },
            align: 'right' as const,
            rtlMode: true,
          },
        })),
        ...item.table.rows.map((r) =>
          r.map((cell) => ({
            text: cell,
            options: {
              fontSize: 8,
              color: 'E2E8F0',
              fill: { color: '0F172A' },
              align: 'right' as const,
              rtlMode: true,
            },
          }))
        ),
      ];

      slide.addTable(tableRows, {
        x: 0.4,
        y: 2.16,
        w: 4.5,
        border: { type: 'solid', pt: 0.75, color: '334155' },
      });
    } else if (item.codeBlocks && item.codeBlocks.length > 0) {
      const firstCode = item.codeBlocks[0];
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.4,
        y: 2.16,
        w: 4.5,
        h: 3.05,
        fill: { color: '090D16' },
        line: { color: '334155', width: 1 },
      });

      slide.addText(firstCode.label, {
        x: 0.52,
        y: 2.22,
        w: 4.25,
        h: 0.25,
        fontSize: 8.5,
        bold: true,
        color: '38BDF8',
        fontFace: 'Courier New',
        align: 'left',
      });

      slide.addText(firstCode.code, {
        x: 0.52,
        y: 2.52,
        w: 4.25,
        h: 2.6,
        fontSize: 8,
        color: 'A7F3D0',
        fontFace: 'Courier New',
        align: 'left',
        valign: 'top',
      });
    }

    // Footer bar
    slide.addText(
      'PHP2Shell Technical Research  ·  CVE-2026-109618 & CVE-2026-109619  ·  Target: PHP 8.4.26 / Patched: PHP 8.4.27',
      {
        x: 0.4,
        y: 5.28,
        w: 9.2,
        h: 0.22,
        fontSize: 8,
        color: '64748B',
        fontFace: 'Arial',
        align: 'center',
      }
    );

    // Speaker Notes
    slide.addNotes(item.speakerNotes);
  }

  await pptx.writeFile({
    fileName: 'PHP2Shell_CVE-2026-109618_CVE-2026-109619_Research_Deck.pptx',
  });
}
