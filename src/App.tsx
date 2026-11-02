import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Download,
  Search,
  LayoutGrid,
  MonitorPlay,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { SLIDES_DATA, SECTIONS, STORYLINE_STAGES } from './data/slidesData';
import {
  getSlideById,
  getNextSlideId,
  getPrevSlideId,
  filterSlides,
  calculateProgressPercent,
} from './utils/deckLogic';
import { SlideDiagramRenderer } from './components/SlideDiagrams';
import { exportPresentationToPptx } from './utils/exportPptx';

export function App() {
  const [currentSlideId, setCurrentSlideId] = useState<number>(1);
  const [selectedSection, setSelectedSection] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'slide' | 'grid'>('slide');
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const currentSlide = getSlideById(currentSlideId, SLIDES_DATA);
  const filteredSlides = filterSlides(selectedSection, searchQuery, SLIDES_DATA);
  const progressPercent = calculateProgressPercent(currentSlideId, SLIDES_DATA);

  const handleNext = useCallback(() => {
    setCurrentSlideId((prev) => getNextSlideId(prev, SLIDES_DATA));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlideId((prev) => getPrevSlideId(prev, SLIDES_DATA));
  }, []);

  const handleSelectSlide = (id: number) => {
    setCurrentSlideId(id);
    setViewMode('slide');
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageDown') {
        // In RTL presentation, ArrowLeft advances to next slide
        handleNext();
      } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleNext, handlePrev]);

  const handleExportPptx = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportPresentationToPptx(SLIDES_DATA);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard?.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 1800);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col" dir="rtl">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (1 Primary CTA) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-[#0B1120]">
        <a
          href="#slide-view"
          onClick={(e) => {
            e.preventDefault();
            handleSelectSlide(1);
          }}
          className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0"
        >
          PHP2Shell Research Deck
        </a>

        <nav
          aria-label="ناوبری اصلی ارائه"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          <a
            href="#presentation"
            onClick={(e) => {
              e.preventDefault();
              setViewMode('slide');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'slide' ? 'text-sky-400 underline underline-offset-8' : ''
            }`}
          >
            ارائه ۱۶:۹
          </a>
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              setViewMode('grid');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'grid' ? 'text-sky-400 underline underline-offset-8' : ''
            }`}
          >
            نمای کلی ۴۵ اسلاید
          </a>
          <a
            href="#cve-analysis"
            onClick={(e) => {
              e.preventDefault();
              handleSelectSlide(15);
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            تحلیل CVEها
          </a>
          <a
            href="#soc-detection"
            onClick={(e) => {
              e.preventDefault();
              handleSelectSlide(29);
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            پایش SOC
          </a>
          <a
            href="#mitigation"
            onClick={(e) => {
              e.preventDefault();
              handleSelectSlide(38);
            }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            راهکارهای رفع نقص
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportPptx}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 disabled:opacity-60 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'در حال ساخت فایل PPTX...' : 'دانلود PowerPoint (.pptx)'}</span>
          </button>
        </div>
      </header>

      {/* Storyline Narrative Strip (15 Technical Milestones) */}
      <div className="bg-[#0F172A] border-b border-slate-800 px-6 py-2">
        <div className="flex flex-wrap items-center gap-1" dir="ltr">
          <span className="text-[11px] font-mono text-slate-400 mr-1.5 shrink-0">
            STORYLINE:
          </span>
          {STORYLINE_STAGES.map((stage, idx) => {
            const isActive = currentSlide.storyStage === stage.label;
            return (
              <React.Fragment key={stage.label}>
                <button
                  type="button"
                  onClick={() => handleSelectSlide(stage.slideId)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {stage.label}
                </button>
                {idx < STORYLINE_STAGES.length - 1 && (
                  <span className="text-slate-600 text-[10px] select-none" aria-hidden="true">
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Workspace Controls & Filter Bar */}
      <div className="bg-[#111827] border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Section Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedSection('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedSection === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            همه اسلایدها (۴۵)
          </button>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                setSelectedSection(sec.id);
                if (
                  currentSlideId < sec.slideRange[0] ||
                  currentSlideId > sec.slideRange[1]
                ) {
                  setCurrentSlideId(sec.slideRange[0]);
                }
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedSection === sec.id
                  ? 'bg-slate-800 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sec.shortTitle}
            </button>
          ))}
        </div>

        {/* Search & View Mode Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              aria-label="جستجو در اسلایدها"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی CVE، اصطلاح فنی یا دستور..."
              className="w-full bg-[#0B1120] border border-slate-800 focus:border-sky-500 rounded-lg pr-8 pl-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0B1120] p-1 rounded-lg border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('slide')}
              aria-label="نمای اسلاید ۱۶:۹"
              className={`px-2.5 py-1 text-xs rounded flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'slide'
                  ? 'bg-slate-800 text-sky-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span>اسلاید ۱۶:۹</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="نمای شبکه‌ای اسلایدها"
              className={`px-2.5 py-1 text-xs rounded flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-sky-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>شبکه ({filteredSlides.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowSpeakerNotes((prev) => !prev)}
            className={`px-2.5 py-1.5 text-xs rounded-lg border flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showSpeakerNotes
                ? 'bg-slate-800 border-slate-700 text-sky-300'
                : 'bg-[#0B1120] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>یادداشت سخنران</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Right Sidebar (in RTL): Slide Navigator List */}
        <aside
          aria-label="فهرست اسلایدها"
          className="w-full lg:w-72 border-b lg:border-b-0 lg:border-l border-slate-800 bg-[#0F172A] flex flex-col shrink-0 max-h-56 lg:max-h-[calc(100vh-140px)]"
        >
          <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>فهرست اسلایدها ({filteredSlides.length} مورد)</span>
            <span className="font-mono tabular-nums">{progressPercent}%</span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredSlides.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-xs text-slate-400 mb-3">
                  هیچ اسلایدی مطابق با عبارت جستجوشده یافت نشد.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSection('all');
                  }}
                  className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            ) : (
              filteredSlides.map((s) => {
                const active = s.id === currentSlideId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSlide(s.id)}
                    className={`w-full text-right px-4 py-2.5 transition-colors flex items-start gap-3 cursor-pointer ${
                      active
                        ? 'bg-sky-950/40 text-white'
                        : 'hover:bg-slate-900/70 text-slate-300'
                    }`}
                  >
                    <span
                      className={`font-mono text-xs px-1.5 py-0.5 rounded tabular-nums shrink-0 mt-0.5 ${
                        active
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {String(s.id).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium truncate">{s.title}</div>
                      <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5" dir="ltr">
                        {s.storyStage}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Primary Slide Viewport or Grid Overview */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0B1120]">
          {viewMode === 'grid' ? (
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-bold text-slate-100">
                  نمای کلی اسلایدهای پژوهشی PHP2Shell ({filteredSlides.length} اسلاید)
                </h1>
                <span className="text-xs text-slate-400">
                  برای مشاهده جزئیات کامل و دیاگرام هر اسلاید روی آن کلیک کنید
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredSlides.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSlide(s.id)}
                    className={`text-right p-4 rounded-xl border transition-colors flex flex-col justify-between cursor-pointer ${
                      s.id === currentSlideId
                        ? 'bg-[#111827] border-sky-500'
                        : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-mono text-sky-400 tabular-nums">
                          اسلاید {s.id} از ۴۵
                        </span>
                        <span className="font-mono text-[11px]" dir="ltr">
                          {s.storyStage}
                        </span>
                      </div>
                      <h2 className="text-sm font-bold text-slate-100 mb-1.5">
                        {s.title}
                      </h2>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {s.subtitle}
                      </p>
                    </div>
                    <div className="pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-300 line-clamp-2">
                      {s.keyTakeaway}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto flex flex-col gap-4">
              {/* 16:9 Slide Deck Frame */}
              <article
                aria-label={`اسلاید ${currentSlide.id}: ${currentSlide.title}`}
                className="bg-[#111827] border border-slate-800 rounded-xl p-5 sm:p-7 flex flex-col justify-between min-h-[540px]"
              >
                {/* Slide Top Metadata Row & Navigation */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="text-sky-400 font-semibold">
                        {currentSlide.sectionTitle}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-300" dir="ltr">
                        {currentSlide.storyStage}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-slate-300">
                        اسلاید {currentSlide.id} از {SLIDES_DATA.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentSlide.id <= 1}
                        aria-label="اسلاید قبلی"
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0B1120] border border-slate-800 hover:border-slate-700 disabled:opacity-40 text-slate-200 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span>اسلاید قبلی</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={currentSlide.id >= SLIDES_DATA.length}
                        aria-label="اسلاید بعدی"
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-500/15 border border-sky-500/40 hover:bg-sky-500/25 disabled:opacity-40 text-sky-300 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>اسلاید بعدی</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Slide Title & Subtitle */}
                  <div className="mb-5">
                    <h1
                      className="text-xl sm:text-2xl font-bold text-slate-50 leading-snug mb-2"
                      style={{ textWrap: 'balance' }}
                    >
                      {currentSlide.title}
                    </h1>
                    <p className="text-sm text-sky-400 font-medium">
                      {currentSlide.subtitle}
                    </p>
                  </div>

                  {/* Key Takeaway Box (All-around 1px border, no thick left border) */}
                  <div className="p-3.5 rounded-lg bg-[#0B1120] border border-slate-800 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      <span className="font-bold text-sky-400 ml-2">پیام کلیدی اسلاید:</span>
                      {currentSlide.keyTakeaway}
                    </div>
                  </div>

                  {/* Technical Diagram Block */}
                  <div className="mb-5">
                    <SlideDiagramRenderer
                      slide={currentSlide}
                      onJumpToSlide={handleSelectSlide}
                    />
                  </div>

                  {/* Slide Body: Bullets + Code Blocks / Tables */}
                  <div
                    className={`grid grid-cols-1 ${
                      (currentSlide.codeBlocks && currentSlide.codeBlocks.length > 0) ||
                      currentSlide.table
                        ? 'lg:grid-cols-12'
                        : 'lg:grid-cols-1'
                    } gap-5 items-start`}
                  >
                    {/* Technical Bullet Points */}
                    <div
                      className={
                        (currentSlide.codeBlocks && currentSlide.codeBlocks.length > 0) ||
                        currentSlide.table
                          ? 'lg:col-span-6 space-y-2.5'
                          : 'space-y-2.5'
                      }
                    >
                      <ul className="space-y-2.5 text-sm text-slate-200 leading-relaxed">
                        {currentSlide.bullets.map((bullet, idx) => (
                          <li
                            key={idx}
                            className="p-3 rounded-lg bg-[#0F172A] border border-slate-800/90 flex items-start gap-2.5"
                          >
                            <span className="font-mono text-xs text-sky-400 tabular-nums mt-0.5 shrink-0">
                              {String(idx + 1).padStart(2, '0')}.
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Code Blocks & Comparative Tables */}
                    {((currentSlide.codeBlocks && currentSlide.codeBlocks.length > 0) ||
                      currentSlide.table) && (
                      <div className="lg:col-span-6 flex flex-col gap-4">
                        {currentSlide.codeBlocks?.map((cb, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg bg-[#090D16] border border-slate-800 overflow-hidden"
                            dir="ltr"
                          >
                            <div className="px-3.5 py-2 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between gap-2">
                              <span className="text-xs font-mono text-sky-400 font-semibold truncate">
                                {cb.label}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyCode(cb.code, idx)}
                                className="px-2 py-1 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                              >
                                {copiedCodeIdx === idx ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-3.5 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                              <code>{cb.code}</code>
                            </pre>
                          </div>
                        ))}

                        {currentSlide.table && (
                          <div className="rounded-lg border border-slate-800 overflow-x-auto bg-[#0B1120]">
                            <table className="w-full text-right border-collapse text-xs">
                              <thead>
                                <tr className="bg-[#0F172A] border-b border-slate-800 text-sky-400">
                                  {currentSlide.table.headers.map((h, i) => (
                                    <th key={i} className="py-2.5 px-3 font-semibold">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/80 text-slate-200 tabular-nums">
                                {currentSlide.table.rows.map((row, rIdx) => (
                                  <tr
                                    key={rIdx}
                                    className="hover:bg-slate-900/60 transition-colors"
                                  >
                                    {row.map((cell, cIdx) => (
                                      <td
                                        key={cIdx}
                                        className={`py-2.5 px-3 ${
                                          cIdx === 0 ? 'font-semibold text-slate-100' : ''
                                        }`}
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Slide Footer Bar */}
                <div className="mt-6 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <div>
                    <span>پژوهش فنی امنیت سایبری: PHP2Shell</span>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span className="font-mono" dir="ltr">
                      CVE-2026-109618 &amp; CVE-2026-109619
                    </span>
                  </div>
                  <div className="font-mono tabular-nums" dir="ltr">
                    Target: PHP 8.4.26 · Patched: PHP 8.4.27 · Ratio 16:9
                  </div>
                </div>
              </article>

              {/* Speaker Notes Panel */}
              {showSpeakerNotes && (
                <section
                  aria-label="یادداشت سخنران"
                  className="bg-[#111827] border border-slate-800 rounded-xl p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400">
                      یادداشت تکمیلی سخنران (Speaker Notes — اسلاید {currentSlide.id})
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      درج خودکار در فایل خروجی PowerPoint (.pptx)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentSlide.speakerNotes}
                  </p>
                </section>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
