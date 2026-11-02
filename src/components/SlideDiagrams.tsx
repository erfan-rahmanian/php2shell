import React, { useState } from 'react';
import { SlideItem } from '../data/slidesData';

interface DiagramProps {
  slide: SlideItem;
  onJumpToSlide?: (slideId: number) => void;
}

export const SlideDiagramRenderer: React.FC<DiagramProps> = ({ slide, onJumpToSlide }) => {
  const [uafPhase, setUafPhase] = useState<'allocated' | 'freed' | 'reallocated'>('freed');
  const [cleanupMode, setCleanupMode] = useState<'both' | 'normal' | 'bailout'>('both');
  const [selectedChainStep, setSelectedChainStep] = useState<number>(6);

  switch (slide.diagramType) {
    case 'title-overview':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-sky-400">
              RESEARCH ARCHITECTURE MAP · 15-STAGE TECHNICAL NARRATIVE
            </span>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              Target: PHP 8.4.26 · Patched: PHP 8.4.27 · CVSS v4.0: 9.2
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5" dir="ltr">
            {[
              { step: '01', name: 'PHP Runtime Arch', desc: 'Apache + mod_php SAPI', slideId: 5 },
              { step: '02', name: 'Upload Progress', desc: 'Pre-Script Multipart', slideId: 6 },
              { step: '03', name: 'OOM & Bailout', desc: 'memory_limit + longjmp()', slideId: 10 },
              { step: '04', name: 'Dangling Pointer', desc: 'UAF & Worker Reuse', slideId: 12 },
              { step: '05', name: 'CVE-2026-109618', desc: 'OOM Uninit State', slideId: 16 },
              { step: '06', name: 'CVE-2026-109619', desc: 'Stale Global State', slideId: 17 },
              { step: '07', name: 'Memory Disclosure', desc: 'PHPSESSID Heap Leak', slideId: 19 },
              { step: '08', name: 'ASLR Bypass', desc: 'Heap & libphp Base', slideId: 21 },
              { step: '09', name: 'RCE Control Hijack', desc: 'HashTable pDestructor', slideId: 22 },
              { step: '10', name: 'SOC & Mitigation', desc: 'SIEM, EDR & Patching', slideId: 29 },
            ].map((node) => (
              <button
                key={node.step}
                type="button"
                onClick={() => onJumpToSlide?.(node.slideId)}
                className="text-left p-2.5 rounded bg-[#111827] border border-slate-800 hover:border-sky-500/60 transition-colors group"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span className="text-sky-400 font-semibold">{node.step}</span>
                  <span>Slide {node.slideId}</span>
                </div>
                <div className="text-xs font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                  {node.name}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">{node.desc}</div>
              </button>
            ))}
          </div>
        </div>
      );

    case 'layer-stack':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-300 mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">معماری ۶ لایه اجرای وب و محل دقیق آسیب‌پذیری PHP2Shell</span>
            <span className="text-rose-400 font-mono" dir="ltr">
              Layer 3 Compromised = Layers 4 &amp; 5 Bypassed
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {[
              {
                num: '6',
                title: 'Database & Dependent Services (MySQL / PostgreSQL / Redis)',
                note: 'سرویس‌های داده و ذخیره‌سازی متصل به برنامه',
                status: 'normal',
              },
              {
                num: '5',
                title: 'Application Code (WordPress / Custom Portal / index.php)',
                note: 'کد منبع برنامه — حتی اگر ۱۰۰٪ بدون باگ باشد، پیش از اجرا دور زده می‌شود',
                status: 'bypassed',
              },
              {
                num: '4',
                title: 'Web Framework (Laravel / Symfony / Drupal Core)',
                note: 'میان‌افزارها، کنترلرها و Authentication — قبل از فراخوانی، خطا رخ می‌دهد',
                status: 'bypassed',
              },
              {
                num: '3',
                title: 'PHP Runtime & Zend Engine (CVE-2026-109618 & CVE-2026-109619)',
                note: 'نقطه وقوع PHP2Shell: مدیریت حافظه Request، Upload Progress و Bailout',
                status: 'critical',
              },
              {
                num: '2',
                title: 'Web Server (Apache + mod_php / Nginx + PHP-FPM)',
                note: 'دریافت بسته HTTP و تحویل به SAPI با مدل Worker Reuse',
                status: 'normal',
              },
              {
                num: '1',
                title: 'Operating System & Container (Ubuntu 24.04 / Docker / ASLR)',
                note: 'حافظه مجازی، ASLR و اجرای پروسه با دسترسی کاربر www-data',
                status: 'normal',
              },
            ].map((layer) => (
              <div
                key={layer.num}
                className={`p-2.5 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  layer.status === 'critical'
                    ? 'bg-rose-950/40 border-rose-500/70 text-rose-100'
                    : layer.status === 'bypassed'
                    ? 'bg-amber-950/20 border-amber-700/50 text-amber-100'
                    : 'bg-[#111827] border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700 tabular-nums">
                    L{layer.num}
                  </span>
                  <span className="text-xs font-semibold font-mono" dir="ltr">
                    {layer.title}
                  </span>
                </div>
                <span className="text-xs text-slate-300">{layer.note}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'apache-modphp-arch':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-300 mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">معماری اجرای Apache + mod_php در آزمایشگاه TryHackMe</span>
            <span className="text-sky-400 font-mono" dir="ltr">
              Pre-Application Execution Boundary
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-stretch" dir="ltr">
            {[
              {
                step: '1. Client',
                title: 'Attacker HTTP Client',
                detail: 'Multipart/Form-Data POST Request',
                tone: 'border-slate-700 bg-[#111827]',
              },
              {
                step: '2. Web Server',
                title: 'Apache httpd (Prefork)',
                detail: 'Receives socket on 127.0.0.1:8088',
                tone: 'border-slate-700 bg-[#111827]',
              },
              {
                step: '3. SAPI Layer',
                title: 'Apache mod_php',
                detail: 'Embedded inside Apache Worker PID',
                tone: 'border-sky-500/50 bg-sky-950/20',
              },
              {
                step: '4. PHP Engine',
                title: 'PHP Runtime / Zend MM',
                detail: 'Parses Multipart & Upload Progress (PHP2Shell Trigger!)',
                tone: 'border-rose-500/80 bg-rose-950/30',
              },
              {
                step: '5. Script',
                title: 'Application Code',
                detail: 'index.php (Often never reached on OOM)',
                tone: 'border-amber-500/50 bg-amber-950/20',
              },
              {
                step: '6. Output',
                title: 'HTTP Response',
                detail: 'Set-Cookie: PHPSESSID=[Leaked Heap]',
                tone: 'border-emerald-500/50 bg-emerald-950/20',
              },
            ].map((box) => (
              <div
                key={box.step}
                className={`p-3 rounded border ${box.tone} flex flex-col justify-between`}
              >
                <div>
                  <div className="text-[11px] font-mono text-slate-400">{box.step}</div>
                  <div className="text-xs font-bold text-slate-100 mt-1">{box.title}</div>
                </div>
                <div className="text-[11px] text-slate-300 mt-2 pt-2 border-t border-slate-800/80">
                  {box.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'http-10stage-lifecycle':
    case 'pre-script-surface':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4">
          <div className="text-xs text-slate-300 mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">چرخه ۱۰ مرحله‌ای پردازش HTTP Request در PHP Runtime</span>
            <span className="text-rose-400 font-medium">
              مرحله ۴ و ۵ پیش از اجرای کد برنامه (مرحله ۸) اجرا می‌شوند
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" dir="ltr">
            {[
              { id: '01', name: 'HTTP Request Arrival', phase: 'Web Server', critical: false },
              { id: '02', name: 'Handover to PHP SAPI', phase: 'mod_php / FPM', critical: false },
              { id: '03', name: 'HTTP Headers Parsing', phase: 'SAPI Startup', critical: false },
              { id: '04', name: 'Request Body Parsing', phase: 'Multipart Handler', critical: true },
              { id: '05', name: 'Upload Progress Track', phase: 'Session Hook (Trigger)', critical: true },
              { id: '06', name: 'Request Env Setup', phase: 'Runtime Init', critical: false },
              { id: '07', name: 'Superglobals & Session', phase: '$_POST / $_FILES', critical: false },
              { id: '08', name: 'Application Script', phase: 'index.php (Bypassed)', critical: false },
              { id: '09', name: 'Response Generation', phase: 'Set-Cookie Header', critical: true },
              { id: '10', name: 'Resource Shutdown', phase: 'Destructors / Bailout', critical: true },
            ].map((st) => (
              <div
                key={st.id}
                className={`p-2.5 rounded border ${
                  st.critical
                    ? 'bg-rose-950/30 border-rose-500/70'
                    : st.id === '08'
                    ? 'bg-slate-900/50 border-dashed border-slate-700 opacity-75'
                    : 'bg-[#111827] border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={st.critical ? 'text-rose-400 font-bold' : 'text-sky-400'}>
                    STAGE {st.id}
                  </span>
                  <span className="text-slate-400">{st.phase}</span>
                </div>
                <div className="text-xs font-semibold text-slate-100 mt-1">{st.name}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'memory-limit-oom':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4" dir="ltr">
          <div className="text-xs font-mono text-amber-400 font-bold mb-2">
            ZEND MEMORY MANAGER (ZMM) — HEAP EXHAUSTION &amp; OOM THRESHOLD
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/40">
              <div className="text-emerald-400 font-bold">0MB — 64MB</div>
              <div className="text-[11px] text-slate-300 mt-1">Normal Request &amp; SAPI Buffers</div>
            </div>
            <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/50">
              <div className="text-amber-400 font-bold">64MB — 127.9MB</div>
              <div className="text-[11px] text-slate-300 mt-1">Crafted Multipart Parts &amp; Headers</div>
            </div>
            <div className="p-2.5 rounded bg-rose-950/50 border border-rose-500">
              <div className="text-rose-400 font-bold">128MB (memory_limit)</div>
              <div className="text-[11px] text-rose-200 mt-1">emalloc() Fails → Fatal OOM Error</div>
            </div>
            <div className="p-2.5 rounded bg-[#111827] border border-rose-500/60">
              <div className="text-sky-400 font-bold">Bailout Path</div>
              <div className="text-[11px] text-slate-300 mt-1">zend_bailout() jumps via longjmp()</div>
            </div>
          </div>
        </div>
      );

    case 'bailout-longjmp':
    case 'cleanup-vs-bailout':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-200">
              مقایسه بصری: Normal Cleanup در برابر Emergency Bailout با تابع longjmp()
            </span>
            <div className="flex items-center gap-1 bg-[#111827] p-1 rounded border border-slate-800">
              <button
                type="button"
                onClick={() => setCleanupMode('both')}
                className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  cleanupMode === 'both' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                مقایسه هم‌زمان
              </button>
              <button
                type="button"
                onClick={() => setCleanupMode('normal')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  cleanupMode === 'normal'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Normal Cleanup
              </button>
              <button
                type="button"
                onClick={() => setCleanupMode('bailout')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  cleanupMode === 'bailout'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Emergency Bailout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="ltr">
            {(cleanupMode === 'both' || cleanupMode === 'normal') && (
              <div className="p-3.5 rounded bg-[#111827] border border-emerald-500/40">
                <div className="text-xs font-mono font-bold text-emerald-400 mb-2">
                  PATH A: NORMAL REQUEST CLEANUP (SAFE)
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">
                    1. Identify Request Allocations &amp; Structures
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">
                    2. Free Heap Memory: <span className="text-emerald-300">efree(ptr)</span>
                  </div>
                  <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-200">
                    3. Reset Pointers: <span className="font-bold">global_state-&gt;ptr = NULL;</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">
                    4. Verify Internal State Consistency → Clean Worker Reuse
                  </div>
                </div>
              </div>
            )}

            {(cleanupMode === 'both' || cleanupMode === 'bailout') && (
              <div className="p-3.5 rounded bg-[#111827] border border-rose-500/60">
                <div className="text-xs font-mono font-bold text-rose-400 mb-2">
                  PATH B: EMERGENCY BAILOUT VIA longjmp() (VULNERABLE)
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">
                    1. Partial Init / Allocation Exceeds <span className="text-amber-300">memory_limit</span>
                  </div>
                  <div className="p-2 rounded bg-rose-950/50 border border-rose-500/70 text-rose-200">
                    2. <span className="font-bold">zend_bailout() → longjmp(*EG(bailout))</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/40 border border-dashed border-rose-500/40 text-slate-400 line-through">
                    3. [SKIPPED] Reset Pointers (global_state-&gt;ptr = NULL)
                  </div>
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-500/60 text-amber-200">
                    4. Result: <span className="font-bold">Dangling Pointer / Stale State</span> persists in Worker!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 'dangling-pointer-before-after':
    case 'uaf-7step-heap':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-200">
              شبیه‌ساز وضعیت حافظه Heap: قبل از Free، ایجاد Dangling Pointer و وقوع Use-After-Free
            </span>
            <div className="flex items-center gap-1 bg-[#111827] p-1 rounded border border-slate-800" dir="ltr">
              <button
                type="button"
                onClick={() => setUafPhase('allocated')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  uafPhase === 'allocated'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1. Before Free (Valid)
              </button>
              <button
                type="button"
                onClick={() => setUafPhase('freed')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  uafPhase === 'freed'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2. After Free (Dangling)
              </button>
              <button
                type="button"
                onClick={() => setUafPhase('reallocated')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  uafPhase === 'reallocated'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3. Reallocated (UAF Exploit)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs" dir="ltr">
            <div
              className={`p-3 rounded border ${
                uafPhase === 'allocated'
                  ? 'bg-emerald-950/30 border-emerald-500'
                  : 'bg-[#111827] border-slate-800'
              }`}
            >
              <div className="text-emerald-400 font-bold mb-1">STATE 1: VALID ALLOCATION</div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 mb-2">
                Pointer A (Worker Global)<br />
                <span className="text-sky-400">val = 0x70d1a2c01040</span>
              </div>
              <div className="text-center text-emerald-400 my-1">↓ points to valid object</div>
              <div className="p-2 bg-emerald-950/40 rounded border border-emerald-500/50">
                Heap Chunk @ 0x70d1a2c01040<br />
                Status: <span className="text-emerald-300 font-bold">IN_USE (Object A)</span>
              </div>
            </div>

            <div
              className={`p-3 rounded border ${
                uafPhase === 'freed'
                  ? 'bg-amber-950/30 border-amber-500'
                  : 'bg-[#111827] border-slate-800'
              }`}
            >
              <div className="text-amber-400 font-bold mb-1">STATE 2: DANGLING POINTER</div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 mb-2">
                Pointer A (Not Reset on Bailout)<br />
                <span className="text-amber-300">val = 0x70d1a2c01040</span>
              </div>
              <div className="text-center text-amber-400 my-1">↓ points to freed memory!</div>
              <div className="p-2 bg-amber-950/40 rounded border border-dashed border-amber-500/60">
                Heap Chunk @ 0x70d1a2c01040<br />
                Status: <span className="text-amber-300 font-bold">FREED (Zend FreeList)</span>
              </div>
            </div>

            <div
              className={`p-3 rounded border ${
                uafPhase === 'reallocated'
                  ? 'bg-rose-950/30 border-rose-500'
                  : 'bg-[#111827] border-slate-800'
              }`}
            >
              <div className="text-rose-400 font-bold mb-1">STATE 3: USE-AFTER-FREE (UAF)</div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 mb-2">
                Pointer A (Dereferenced in Req #2)<br />
                <span className="text-rose-300">val = 0x70d1a2c01040</span>
              </div>
              <div className="text-center text-rose-400 my-1">↓ interprets attacker bytes as Object A</div>
              <div className="p-2 bg-rose-950/50 rounded border border-rose-500/80">
                Heap Chunk @ 0x70d1a2c01040<br />
                Status: <span className="text-rose-300 font-bold">ATTACKER FAKE STRUCT</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'prefork-worker-reuse':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4" dir="ltr">
          <div className="text-xs font-mono text-slate-400 mb-3 flex items-center justify-between">
            <span>APACHE PREFORK MPM + mod_php WORKER REUSE PERSISTENCE</span>
            <span className="text-amber-400">Same Child Process (PID 418) Handles Both Requests</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center font-mono text-xs">
            <div className="p-3 rounded bg-[#111827] border border-amber-500/50">
              <div className="text-amber-400 font-bold">HTTP REQUEST #1 (Trigger)</div>
              <ul className="mt-2 space-y-1 text-slate-300 text-[11px]">
                <li>• Sends crafted Multipart + Upload Progress</li>
                <li>• Hits memory_limit → OOM &amp; Bailout</li>
                <li>• Leaves Dangling Pointer in Worker RAM</li>
              </ul>
            </div>
            <div className="p-3 rounded bg-rose-950/30 border border-rose-500/60 text-center">
              <div className="text-rose-300 font-bold">APACHE WORKER (PID 418)</div>
              <div className="text-[11px] text-slate-300 mt-1">
                Process does NOT restart after Req #1
              </div>
              <div className="mt-2 px-2 py-1 rounded bg-slate-950 text-rose-400 border border-rose-800">
                Stale Pointer Preserved in Memory
              </div>
            </div>
            <div className="p-3 rounded bg-[#111827] border border-sky-500/50">
              <div className="text-sky-400 font-bold">HTTP REQUEST #2 (Exploit)</div>
              <ul className="mt-2 space-y-1 text-slate-300 text-[11px]">
                <li>• Routed to same Worker (PID 418)</li>
                <li>• Reuses corrupted global/session state</li>
                <li>• Leaks PHPSESSID memory or triggers RCE</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'cve-109618-deepdive':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4" dir="ltr">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-rose-400">
              CVE-2026-109618 — RCE VIA OUT-OF-MEMORY CORRUPTION (ROOT CAUSE FLOW)
            </span>
            <span className="text-xs font-mono text-slate-400">CWE-755 / CWE-824</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded bg-[#111827] border border-slate-800">
              <div className="text-sky-400 font-bold">1. Premature Exposure</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Request memory block is linked into runtime state BEFORE all internal fields are initialized.
              </p>
            </div>
            <div className="p-3 rounded bg-amber-950/30 border border-amber-500/60">
              <div className="text-amber-400 font-bold">2. Allocation OOM</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Multipart parsing allocation exceeds <code className="text-amber-300">memory_limit</code> mid-initialization.
              </p>
            </div>
            <div className="p-3 rounded bg-rose-950/30 border border-rose-500/60">
              <div className="text-rose-400 font-bold">3. Bailout Interrupt</div>
              <p className="text-[11px] text-slate-300 mt-1">
                <code className="text-rose-300">longjmp()</code> aborts init immediately; structure remains half-initialized.
              </p>
            </div>
            <div className="p-3 rounded bg-rose-950/50 border border-rose-500">
              <div className="text-rose-300 font-bold">4. Corrupt Shutdown</div>
              <p className="text-[11px] text-slate-200 mt-1">
                Shutdown routine traverses uninitialized/inconsistent pointers → Memory Corruption &amp; RCE.
              </p>
            </div>
          </div>
        </div>
      );

    case 'cve-109619-deepdive':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4" dir="ltr">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-amber-400">
              CVE-2026-109619 — RCE VIA STALE GLOBAL STATE (ROOT CAUSE FLOW)
            </span>
            <span className="text-xs font-mono text-slate-400">CWE-416 (Use-After-Free)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded bg-[#111827] border border-slate-800">
              <div className="text-sky-400 font-bold">1. Session Upload Hook</div>
              <p className="text-[11px] text-slate-300 mt-1">
                <code className="text-sky-300">session.upload_progress</code> stores pointers to request-heap data in worker-level global state.
              </p>
            </div>
            <div className="p-3 rounded bg-amber-950/30 border border-amber-500/60">
              <div className="text-amber-400 font-bold">2. Fatal Error / Bailout</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Fatal OOM interrupts normal request teardown; request heap is freed, but global state is NOT reset.
              </p>
            </div>
            <div className="p-3 rounded bg-rose-950/30 border border-rose-500/60">
              <div className="text-rose-400 font-bold">3. Stale Reference</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Worker keeps dangling global pointer pointing to freed request heap memory across request boundary.
              </p>
            </div>
            <div className="p-3 rounded bg-rose-950/50 border border-rose-500">
              <div className="text-rose-300 font-bold">4. Next Request UAF</div>
              <p className="text-[11px] text-slate-200 mt-1">
                Subsequent request accesses stale global state before re-init → Use-After-Free &amp; RCE.
              </p>
            </div>
          </div>
        </div>
      );

    case 'attack-chain-10stage': {
      const stages = [
        { id: 1, title: 'Multipart HTTP Request', detail: 'Attacker sends crafted multipart/form-data payload to target PHP endpoint.' },
        { id: 2, title: 'Upload Progress Init', detail: 'PHP SAPI activates session.upload_progress during early request body parsing.' },
        { id: 3, title: 'OOM & Bailout Trigger', detail: 'Controlled allocation hits memory_limit, triggering zend_bailout() / longjmp().' },
        { id: 4, title: 'Dangling Pointer Left', detail: 'Emergency bailout skips cleanup; invalid pointer/state remains in Apache worker.' },
        { id: 5, title: 'Worker Reuse (Req #2)', detail: 'Follow-up HTTP request hits the same worker process and reuses corrupted state.' },
        { id: 6, title: 'Memory Disclosure', detail: 'Over-read of corrupted Session ID leaks adjacent heap pointers in Set-Cookie: PHPSESSID.' },
        { id: 7, title: 'ASLR Bypass Math', detail: 'Exploit extracts chunk base (Heap) and libphp base to defeat ASLR randomization.' },
        { id: 8, title: 'Heap Structure Forgery', detail: 'Attacker plants fake Zend HashTable structure at known heap address.' },
        { id: 9, title: 'Control Flow Hijack', detail: 'Overwritten pDestructor pointer redirects HashTable cleanup to system().' },
        { id: 10, title: 'Unauthenticated RCE', detail: 'Arbitrary shell command executes under www-data worker privileges.' },
      ];
      const activeStage = stages.find((s) => s.id === selectedChainStep) || stages[5];

      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-sky-400">
              فلوچارت تعاملی ۱۰ مرحله زنجیره حمله PHP2Shell (برای مشاهده جزئیات روی هر مرحله کلیک کنید)
            </span>
            <span className="text-xs font-mono text-slate-400" dir="ltr">
              Stage {activeStage.id} of 10 Selected
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3" dir="ltr">
            {stages.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedChainStep(st.id)}
                className={`p-2 rounded border text-left font-mono transition-colors cursor-pointer ${
                  selectedChainStep === st.id
                    ? 'bg-sky-950/60 border-sky-400 text-white'
                    : st.id >= 9
                    ? 'bg-rose-950/25 border-rose-500/50 text-slate-200 hover:border-rose-400'
                    : 'bg-[#111827] border-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="text-[10px] text-sky-400">STEP {String(st.id).padStart(2, '0')}</div>
                <div className="text-xs font-semibold truncate mt-0.5">{st.title}</div>
              </button>
            ))}
          </div>
          <div className="p-3 rounded bg-[#111827] border border-slate-700 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2" dir="ltr">
            <div>
              <span className="text-sky-400 font-bold">
                [STAGE {String(activeStage.id).padStart(2, '0')}: {activeStage.title}]
              </span>{' '}
              <span className="text-slate-200">{activeStage.detail}</span>
            </div>
            <span className="text-[11px] text-emerald-400 shrink-0">Unauthenticated Flow</span>
          </div>
        </div>
      );
    }

    case 'aslr-concept':
    case 'aslr-two-runs-bypass':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4" dir="ltr">
          <div className="text-xs font-mono text-slate-300 mb-3 flex items-center justify-between">
            <span>ASLR MEMORY LAYOUT COMPARISON: EXECUTION #1 VS EXECUTION #2</span>
            <span className="text-emerald-400">Memory Disclosure Reveals Live Base Addresses</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-3 rounded bg-[#111827] border border-sky-500/50">
              <div className="text-sky-400 font-bold mb-2">
                PROCESS EXECUTION #1 (Lab PoC Run)
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Zend Heap (chunk base):</span>
                  <span className="text-emerald-300 font-bold tabular-nums">0x70d1a2c00000</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">libphp.so (libphp base):</span>
                  <span className="text-sky-300 font-bold tabular-nums">0x70d1a4911000</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Target Function Offset:</span>
                  <span className="text-amber-300 tabular-nums">libphp_base + 0x0024c180</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded bg-[#111827] border border-amber-500/50">
              <div className="text-amber-400 font-bold mb-2">
                PROCESS EXECUTION #2 (After Container/Worker Restart)
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Zend Heap (chunk base):</span>
                  <span className="text-emerald-300 font-bold tabular-nums">0x7f94b1800000</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">libphp.so (libphp base):</span>
                  <span className="text-sky-300 font-bold tabular-nums">0x7f94b3511000</span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Target Function Offset:</span>
                  <span className="text-amber-300 tabular-nums">libphp_base + 0x0024c180</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'hashtable-pdestructor-rce':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4" dir="ltr">
          <div className="text-xs font-mono text-rose-400 font-bold mb-2">
            CONTROL FLOW HIJACKING: ZEND HASHTABLE pDestructor OVERWRITE
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded bg-[#111827] border border-slate-800">
              <div className="text-slate-400 text-[11px]">NORMAL ZEND HASHTABLE</div>
              <div className="text-emerald-400 font-bold mt-1">pDestructor = ZVAL_PTR_DTOR</div>
              <div className="text-[11px] text-slate-300 mt-1">
                Safely decrements refcount &amp; frees Bucket memory on cleanup.
              </div>
            </div>
            <div className="p-3 rounded bg-rose-950/30 border border-rose-500/70">
              <div className="text-rose-300 text-[11px]">FORGED HEAP HASHTABLE</div>
              <div className="text-rose-400 font-bold mt-1">pDestructor = &amp;system()</div>
              <div className="text-[11px] text-slate-200 mt-1">
                Bucket data points to command string: <code className="text-amber-300">&quot;cat /f&gt;/out/p1&quot;</code>
              </div>
            </div>
            <div className="p-3 rounded bg-emerald-950/30 border border-emerald-500/60">
              <div className="text-emerald-300 text-[11px]">CLEANUP TRIGGER</div>
              <div className="text-emerald-400 font-bold mt-1">zend_hash_destroy()</div>
              <div className="text-[11px] text-slate-200 mt-1">
                Calls <code className="text-emerald-300">system(&quot;cat /f&gt;/out/p1&quot;)</code> as <code className="text-sky-300">uid=33(www-data)</code>
              </div>
            </div>
          </div>
        </div>
      );

    case 'soc-4pillar-telemetry':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4" dir="ltr">
          <div className="text-xs font-mono text-sky-400 font-bold mb-2.5">
            SOC CORRELATION PIPELINE — 4 TELEMETRY SOURCES FOR PHP2SHELL DETECTION
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="p-2.5 rounded bg-[#111827] border border-slate-800">
              <div className="text-sky-400 font-bold">1. HTTP Request Log</div>
              <div className="text-[11px] text-slate-300 mt-1">
                Anomalous Multipart POST + PHP_SESSION_UPLOAD_PROGRESS
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#111827] border border-amber-500/50">
              <div className="text-amber-400 font-bold">2. HTTP Response Header</div>
              <div className="text-[11px] text-slate-300 mt-1">
                Oversized Set-Cookie: PHPSESSID (Heap Leak)
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#111827] border border-rose-500/50">
              <div className="text-rose-400 font-bold">3. PHP / Apache Error</div>
              <div className="text-[11px] text-slate-300 mt-1">
                Allowed memory size exhausted / SIGSEGV (11)
              </div>
            </div>
            <div className="p-2.5 rounded bg-rose-950/40 border border-rose-500">
              <div className="text-rose-300 font-bold">4. Endpoint Process</div>
              <div className="text-[11px] text-slate-200 mt-1">
                apache2 (www-data) spawning /bin/sh or bash
              </div>
            </div>
          </div>
        </div>
      );

    case 'soc-7step-workflow':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4">
          <div className="text-xs font-mono text-sky-400 mb-3" dir="ltr">
            SOC INCIDENT INVESTIGATION PLAYBOOK (7-STEP WORKFLOW)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2" dir="ltr">
            {[
              { step: '1', name: 'Asset ID', sub: 'PHP Ver & SAPI' },
              { step: '2', name: 'Request', sub: 'Multipart POST' },
              { step: '3', name: 'Response', sub: 'PHPSESSID Len' },
              { step: '4', name: 'Runtime', sub: 'OOM & SIGSEGV' },
              { step: '5', name: 'Endpoint', sub: 'apache2 → sh' },
              { step: '6', name: 'Impact', sub: 'Secrets & Scope' },
              { step: '7', name: 'Contain', sub: 'Patch & Restart' },
            ].map((item) => (
              <div
                key={item.step}
                className="p-2.5 rounded bg-[#111827] border border-slate-800 text-center font-mono"
              >
                <div className="text-xs font-bold text-sky-400">STEP 0{item.step}</div>
                <div className="text-xs font-semibold text-slate-100 mt-1">{item.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'waf-placement-analysis':
    case 'framework-vs-runtime-patch':
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-4" dir="ltr">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded bg-rose-950/25 border border-rose-500/50">
              <div className="text-rose-400 font-bold">
                INEFFECTIVE ALONE: IN-APP WAF / FRAMEWORK UPDATE
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Updating Laravel/WordPress or running a PHP-script WAF does NOT patch <code className="text-rose-300">libphp.so</code> (PHP 8.4.26 remains vulnerable pre-script).
              </div>
            </div>
            <div className="p-3 rounded bg-emerald-950/25 border border-emerald-500/50">
              <div className="text-emerald-400 font-bold">
                EFFECTIVE REMEDIATION: RUNTIME PATCH + WORKER RESTART
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                Upgrade PHP binary/image to <code className="text-emerald-300">8.4.27 / 8.3.36 / 8.2.35 / 8.5.12</code> + restart all Apache / PHP-FPM workers.
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#111827] border border-slate-700 text-sky-400" dir="ltr">
              STAGE: {slide.storyStage}
            </span>
            <span className="text-xs text-slate-300">
              {slide.sectionTitle} — اسلاید {slide.id} از ۴۵
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400" dir="ltr">
            CVE-2026-109618 · CVE-2026-109619 · PHP 8.4.26 → 8.4.27
          </div>
        </div>
      );
  }
};
