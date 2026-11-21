<script lang="ts">
  import { toBlob, toPng } from 'html-to-image';
  import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Check,
    ChevronDown,
    Code2,
    Copy,
    CopyPlus,
    Download,
    Italic,
    Plus,
    Sparkles,
    Trash2,
    Underline,
    Upload,
    X
  } from '@lucide/svelte';
  import PosterCanvas from './lib/PosterCanvas.svelte';
  import { getChannelIcon } from './lib/icons';
  import {
    FORMATS,
    PRESETS,
    SNIPPETS,
    THEME_SWATCHES,
    createStarterSlide,
    type FormatId,
    type SlideDoc
  } from './lib/presets';

  const FONT_OPTIONS = [
    { label: 'Outfit', value: "'Outfit', sans-serif" },
    { label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
    { label: 'Editorial Serif', value: "Georgia, 'Times New Roman', serif" },
    { label: 'System Sans', value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    { label: 'Monospace', value: "ui-monospace, SFMono-Regular, Menlo, monospace" }
  ];

  // Starts on a clean minimal blank canvas (no preset forced!)
  let format = $state<FormatId>('square');
  let customWidth = $state(1080);
  let customHeight = $state(1080);
  let slides = $state<SlideDoc[]>([createStarterSlide()]);
  let activeIdx = $state(0);

  // Clean UI toggles: Presets accordion closed by default, Code drawer toggleable
  let presetsOpen = $state(false);
  let codeOpen = $state(false);
  let codeTab = $state<'html' | 'css'>('html');

  // Selected element state for contextual styling
  let posterRef = $state<PosterCanvas | null>(null);
  let selectedEl = $state<HTMLElement | null>(null);
  let selTag = $state('');
  let selColor = $state('#111214');
  let selBg = $state('#ffffff');
  let selHasBg = $state(false);
  let selFont = $state("'Outfit', sans-serif");
  let selFontSize = $state(32);
  let selBold = $state(false);
  let selItalic = $state(false);
  let selUnderline = $state(false);
  let selUppercase = $state(false);
  let selAlign = $state<'left' | 'center' | 'right'>('left');
  let selRadius = $state(0);
  let selOpacity = $state(100);

  let canvasEl = $state<HTMLDivElement | null>(null);
  let stageWidth = $state(720);
  let stageHeight = $state(720);
  let exporting = $state(false);
  let copiedPng = $state(false);
  let statusMsg = $state<string | null>(null);

  const slide = $derived(slides[activeIdx] ?? slides[0]);

  const canvasWidth = $derived(
    format === 'custom' ? Math.max(320, Math.min(2400, customWidth || 1080)) : FORMATS[format].width
  );
  const canvasHeight = $derived(
    format === 'custom' ? Math.max(320, Math.min(2400, customHeight || 1080)) : FORMATS[format].height
  );

  const previewScale = $derived.by(() => {
    const availW = Math.max(220, stageWidth - 64);
    const availH = Math.max(220, stageHeight - 64);
    return Math.min(availW / canvasWidth, availH / canvasHeight, 0.7);
  });

  function rgbToHex(rgb: string): string {
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return '#111214';
    return (
      '#' +
      m
        .slice(0, 3)
        .map((n) => Math.min(255, Number(n)).toString(16).padStart(2, '0'))
        .join('')
    );
  }

  function readSelectedStyles(el: HTMLElement | null) {
    selectedEl = el;
    if (!el) return;
    const cs = getComputedStyle(el);
    const cls = typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/)[0]}` : '';
    selTag = `${el.tagName.toLowerCase()}${cls}`;
    selColor = rgbToHex(cs.color);
    const isTransparent = cs.backgroundColor === 'rgba(0, 0, 0, 0)' || cs.backgroundColor === 'transparent';
    selHasBg = !isTransparent;
    selBg = isTransparent ? '#ffffff' : rgbToHex(cs.backgroundColor);
    const ff = cs.fontFamily.toLowerCase();
    if (ff.includes('jetbrains')) selFont = FONT_OPTIONS[1].value;
    else if (ff.includes('georgia') || ff.includes('serif')) selFont = FONT_OPTIONS[2].value;
    else if (ff.includes('outfit')) selFont = FONT_OPTIONS[0].value;
    else if (ff.includes('mono')) selFont = FONT_OPTIONS[4].value;
    else selFont = FONT_OPTIONS[3].value;
    selFontSize = Math.round(parseFloat(cs.fontSize) || 24);
    selBold = Number(cs.fontWeight) >= 600 || cs.fontWeight === 'bold';
    selItalic = cs.fontStyle === 'italic';
    selUnderline = cs.textDecorationLine.includes('underline');
    selUppercase = cs.textTransform === 'uppercase';
    selAlign = cs.textAlign === 'center' ? 'center' : cs.textAlign === 'right' ? 'right' : 'left';
    selRadius = Math.round(parseFloat(cs.borderRadius) || 0);
    selOpacity = Math.round((parseFloat(cs.opacity) || 1) * 100);
  }

  function applyElStyle(prop: string, value: string) {
    if (!selectedEl) return;
    selectedEl.style.setProperty(prop, value);
    readSelectedStyles(selectedEl);
    posterRef?.syncDomToSlide();
  }

  function clearElBg() {
    if (!selectedEl) return;
    selectedEl.style.backgroundColor = 'transparent';
    readSelectedStyles(selectedEl);
    posterRef?.syncDomToSlide();
  }

  function duplicateSelectedEl() {
    if (!selectedEl || !selectedEl.parentElement) return;
    const copy = selectedEl.cloneNode(true) as HTMLElement;
    copy.removeAttribute('data-cs-selected');
    selectedEl.parentElement.insertBefore(copy, selectedEl.nextSibling);
    posterRef?.syncDomToSlide();
  }

  function deleteSelectedEl() {
    if (!selectedEl) return;
    const target = selectedEl;
    posterRef?.clearSelection();
    target.remove();
    posterRef?.syncDomToSlide();
  }

  function updateSlide(patch: Partial<SlideDoc>) {
    slides[activeIdx] = { ...slide, ...patch };
  }

  function applyPreset(presetId: string) {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    posterRef?.clearSelection();
    format = preset.format;
    slides[activeIdx] = {
      ...structuredClone(preset.slide),
      id: slide.id
    };
    presetsOpen = false;
  }

  function insertHtmlSnippet(snippet: string) {
    const idx = slide.html.lastIndexOf('</div>');
    const nextHtml =
      idx > 0
        ? `${slide.html.slice(0, idx)}${snippet}\n${slide.html.slice(idx)}`
        : `${slide.html}${snippet}`;
    updateSlide({ html: nextHtml });
  }

  function handleLogoUpload(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const imgTag = `<img src="${reader.result}" alt="logo" style="width:40px;height:40px;border-radius:10px;object-fit:cover;" />`;
      if (slide.html.includes('<div class="brand">')) {
        updateSlide({
          html: slide.html.replace('<div class="brand">', `<div class="brand">${imgTag} `)
        });
      } else {
        insertHtmlSnippet(`\n${imgTag}`);
      }
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  function addSlide() {
    posterRef?.clearSelection();
    const next = createStarterSlide();
    next.bg = slide.bg;
    next.fg = slide.fg;
    next.accent = slide.accent;
    slides = [...slides, next];
    activeIdx = slides.length - 1;
  }

  function removeSlide(idx: number) {
    if (slides.length <= 1) return;
    posterRef?.clearSelection();
    slides = slides.filter((_, i) => i !== idx);
    activeIdx = Math.min(activeIdx, slides.length - 1);
  }

  async function downloadPng() {
    if (!canvasEl || exporting) return;
    posterRef?.clearSelection();
    (document.activeElement as HTMLElement | null)?.blur?.();
    exporting = true;
    statusMsg = null;
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(canvasEl, {
        pixelRatio: 2,
        width: canvasWidth,
        height: canvasHeight,
        cacheBust: true
      });
      const a = document.createElement('a');
      a.download = `campaign-slide-${activeIdx + 1}-${canvasWidth}x${canvasHeight}@2x.png`;
      a.href = dataUrl;
      a.click();
      statusMsg = 'Exported 2x PNG';
      setTimeout(() => (statusMsg = null), 2000);
    } catch (err) {
      statusMsg = err instanceof Error ? err.message : 'Export failed';
    } finally {
      exporting = false;
    }
  }

  async function copyPngToClipboard() {
    if (!canvasEl || exporting) return;
    posterRef?.clearSelection();
    (document.activeElement as HTMLElement | null)?.blur?.();
    exporting = true;
    statusMsg = null;
    try {
      await document.fonts.ready;
      const blob = await toBlob(canvasEl, {
        pixelRatio: 2,
        width: canvasWidth,
        height: canvasHeight,
        cacheBust: true
      });
      if (!blob) throw new Error('Could not render image');
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      copiedPng = true;
      setTimeout(() => (copiedPng = false), 2000);
    } catch {
      statusMsg = 'Use Export PNG';
      setTimeout(() => (statusMsg = null), 2400);
    } finally {
      exporting = false;
    }
  }
</script>

<div class="flex h-screen flex-col overflow-hidden bg-[#FAFAF8] text-[#111214]">
  <!-- MINIMAL TOP BAR -->
  <header class="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5 sm:px-5">
    <div class="flex items-center gap-2.5">
      <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-[#111214] text-xs font-bold text-white">
        C
      </div>
      <h1 class="text-sm font-semibold tracking-tight">Campaign Studio</h1>
      <span class="hidden text-xs text-neutral-400 md:inline">· Click any element to edit text &amp; styles</span>
    </div>

    <div class="flex items-center gap-2">
      {#if statusMsg}
        <span class="hidden font-mono text-[11px] text-emerald-700 sm:inline">{statusMsg}</span>
      {/if}
      <button
        type="button"
        onclick={() => (codeOpen = !codeOpen)}
        class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition {codeOpen
          ? 'border-[#111214] bg-[#111214] text-white'
          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}"
      >
        <Code2 size={13} />
        HTML / CSS
      </button>
      <button
        type="button"
        onclick={copyPngToClipboard}
        disabled={exporting}
        class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
      >
        {#if copiedPng}
          <Check size={13} class="text-emerald-600" />
          Copied
        {:else}
          <Copy size={13} />
          Copy PNG
        {/if}
      </button>
      <button
        type="button"
        onclick={downloadPng}
        disabled={exporting}
        class="inline-flex items-center gap-1.5 rounded-lg bg-[#111214] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
      >
        <Download size={13} />
        {exporting ? 'Exporting…' : 'Export 2x PNG'}
      </button>
      <a
        href="https://github.com/n3-rd/campaign-studio"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        class="hidden rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-500 transition hover:text-[#111214] sm:inline-flex"
      >
        <span class="h-4 w-4">{@html getChannelIcon('github')?.svg}</span>
      </a>
    </div>
  </header>

  <!-- MAIN WORKSPACE -->
  <div class="flex min-h-0 flex-1 flex-col lg:flex-row">
    <!-- CLEAN MINIMAL LEFT BAR -->
    <aside class="w-full shrink-0 overflow-y-auto border-b border-neutral-200 bg-white lg:w-[290px] lg:border-b-0 lg:border-r">
      <!-- PRESETS ACCORDION (CLOSED BY DEFAULT, LIVE THUMBNAIL PREVIEWS) -->
      <div class="border-b border-neutral-200">
        <button
          type="button"
          onclick={() => (presetsOpen = !presetsOpen)}
          class="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-neutral-50"
        >
          <span class="inline-flex items-center gap-2 text-xs font-semibold">
            <Sparkles size={13} class="text-neutral-500" />
            Presets
            <span class="font-mono text-[10px] font-normal text-neutral-400">({PRESETS.length})</span>
          </span>
          <ChevronDown
            size={14}
            class="text-neutral-400 transition-transform {presetsOpen ? 'rotate-180' : ''}"
          />
        </button>

        {#if presetsOpen}
          <div class="grid grid-cols-2 gap-2 border-t border-neutral-100 bg-neutral-50/80 p-3">
            {#each PRESETS as preset (preset.id)}
              {@const pSpec = FORMATS[preset.format]}
              {@const thumbW = 114}
              {@const thumbScale = thumbW / pSpec.width}
              {@const thumbH = Math.round(pSpec.height * thumbScale)}
              <button
                type="button"
                onclick={() => applyPreset(preset.id)}
                class="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-left transition hover:border-[#111214]"
              >
                <div class="flex h-[94px] w-full items-center justify-center overflow-hidden bg-neutral-100 p-1">
                  <div
                    class="pointer-events-none relative overflow-hidden rounded"
                    style="width: {thumbW}px; height: {Math.min(thumbH, 86)}px;"
                  >
                    <div
                      style="transform: scale({thumbScale}); transform-origin: top left; width: {pSpec.width}px; height: {pSpec.height}px;"
                    >
                      <PosterCanvas
                        slide={{ ...preset.slide, id: preset.id }}
                        width={pSpec.width}
                        height={pSpec.height}
                        scopeId={`preset-${preset.id}`}
                      />
                    </div>
                  </div>
                </div>
                <div class="px-2 py-1.5">
                  <div class="text-[11px] font-semibold">{preset.name}</div>
                  <div class="truncate text-[10px] text-neutral-500">{preset.tagline}</div>
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <!-- SIMPLE CANVAS CONTROLS -->
      <div class="space-y-5 p-4">
        <section>
          <span class="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Canvas Size
          </span>
          <div class="grid grid-cols-4 gap-1.5">
            {#each Object.values(FORMATS) as f}
              <button
                type="button"
                onclick={() => (format = f.id)}
                class="rounded-lg border py-1.5 text-xs font-medium transition {format === f.id
                  ? 'border-[#111214] bg-[#111214] text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'}"
              >
                {f.label}
              </button>
            {/each}
            <button
              type="button"
              onclick={() => (format = 'custom')}
              class="rounded-lg border py-1.5 text-xs font-medium transition {format === 'custom'
                ? 'border-[#111214] bg-[#111214] text-white'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'}"
            >
              Custom
            </button>
          </div>
          {#if format === 'custom'}
            <div class="mt-2 grid grid-cols-2 gap-2">
              <input
                type="number"
                bind:value={customWidth}
                min={320}
                max={2400}
                class="rounded-lg border border-neutral-200 px-2.5 py-1.5 font-mono text-xs"
              />
              <input
                type="number"
                bind:value={customHeight}
                min={320}
                max={2400}
                class="rounded-lg border border-neutral-200 px-2.5 py-1.5 font-mono text-xs"
              />
            </div>
          {/if}
        </section>

        <section class="space-y-2.5">
          <span class="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Canvas Palette
          </span>
          <div class="grid grid-cols-4 gap-1.5">
            {#each THEME_SWATCHES as sw}
              <button
                type="button"
                onclick={() => updateSlide({ bg: sw.bg, fg: sw.fg, accent: sw.accent })}
                class="flex flex-col items-center gap-1 rounded-lg border border-neutral-200 p-1.5 text-[10px] text-neutral-600 transition hover:border-[#111214]"
              >
                <span class="h-4 w-full rounded border border-black/10" style="background: {sw.bg};"></span>
                {sw.name.split(' ')[0]}
              </button>
            {/each}
          </div>

          <div class="grid grid-cols-3 gap-2 pt-1">
            <label class="flex flex-col gap-1 text-[11px] text-neutral-500">
              Background
              <input
                type="color"
                value={slide.bg}
                oninput={(e) => updateSlide({ bg: e.currentTarget.value })}
                class="h-7 w-full cursor-pointer rounded-md border border-neutral-200 bg-white p-0.5"
              />
            </label>
            <label class="flex flex-col gap-1 text-[11px] text-neutral-500">
              Text
              <input
                type="color"
                value={slide.fg}
                oninput={(e) => updateSlide({ fg: e.currentTarget.value })}
                class="h-7 w-full cursor-pointer rounded-md border border-neutral-200 bg-white p-0.5"
              />
            </label>
            <label class="flex flex-col gap-1 text-[11px] text-neutral-500">
              Accent
              <input
                type="color"
                value={slide.accent}
                oninput={(e) => updateSlide({ accent: e.currentTarget.value })}
                class="h-7 w-full cursor-pointer rounded-md border border-neutral-200 bg-white p-0.5"
              />
            </label>
          </div>
        </section>

        <section class="space-y-3">
          <span class="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Canvas Defaults
          </span>
          <div>
            <div class="mb-1 flex justify-between text-[11px] text-neutral-500">
              <span>Headline Size</span>
              <span class="font-mono">{slide.titleSize}px</span>
            </div>
            <input
              type="range"
              min="40"
              max="130"
              step="2"
              value={slide.titleSize}
              oninput={(e) => updateSlide({ titleSize: Number(e.currentTarget.value) })}
              class="w-full accent-[#111214]"
            />
          </div>
          <div>
            <div class="mb-1 flex justify-between text-[11px] text-neutral-500">
              <span>Padding</span>
              <span class="font-mono">{slide.pad}px</span>
            </div>
            <input
              type="range"
              min="28"
              max="120"
              step="4"
              value={slide.pad}
              oninput={(e) => updateSlide({ pad: Number(e.currentTarget.value) })}
              class="w-full accent-[#111214]"
            />
          </div>
        </section>

        <section class="space-y-2">
          <span class="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Insert
          </span>
          <div class="flex flex-wrap gap-1.5">
            <label class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:border-[#111214]">
              <Upload size={12} />
              Upload Logo
              <input type="file" accept="image/*" onchange={handleLogoUpload} class="hidden" />
            </label>
            {#each SNIPPETS as sn}
              <button
                type="button"
                onclick={() => insertHtmlSnippet(sn.html)}
                class="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:border-[#111214]"
              >
                {sn.label}
              </button>
            {/each}
          </div>
        </section>
      </div>
    </aside>

    <!-- CENTER STAGE + CONTEXTUAL ELEMENT TOOLBAR -->
    <main class="flex min-h-0 flex-1 flex-col bg-[#F3F2EE]">
      <!-- SELECTED ELEMENT CONTEXT BAR -->
      <div class="flex min-h-[44px] shrink-0 flex-wrap items-center gap-2 border-b border-neutral-200/90 bg-white/95 px-3 py-1.5 backdrop-blur">
        {#if selectedEl}
          <span class="rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-700">
            {selTag}
          </span>

          <!-- FONT -->
          <select
            aria-label="Font family"
            value={selFont}
            onchange={(e) => applyElStyle('font-family', e.currentTarget.value)}
            class="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 focus:border-[#111214] focus:outline-none"
          >
            {#each FONT_OPTIONS as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>

          <!-- FONT SIZE -->
          <div class="inline-flex items-center rounded-md border border-neutral-200 bg-white">
            <button
              type="button"
              onmousedown={(e) => e.preventDefault()}
              onclick={() => applyElStyle('font-size', `${Math.max(10, selFontSize - 4)}px`)}
              class="px-1.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
            >
              −
            </button>
            <input
              type="number"
              aria-label="Font size"
              value={selFontSize}
              onchange={(e) => applyElStyle('font-size', `${Math.max(10, Math.min(200, Number(e.currentTarget.value) || 24))}px`)}
              class="w-11 border-x border-neutral-200 py-0.5 text-center font-mono text-xs focus:outline-none"
            />
            <button
              type="button"
              onmousedown={(e) => e.preventDefault()}
              onclick={() => applyElStyle('font-size', `${Math.min(200, selFontSize + 4)}px`)}
              class="px-1.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
            >
              +
            </button>
          </div>

          <!-- TEXT COLOR -->
          <label class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-neutral-200 bg-white px-1.5 py-1 text-[11px] text-neutral-600">
            <span>A</span>
            <input
              type="color"
              value={selColor}
              oninput={(e) => applyElStyle('color', e.currentTarget.value)}
              class="h-4 w-5 cursor-pointer border-0 bg-transparent p-0"
            />
          </label>

          <!-- FILL / BACKGROUND COLOR -->
          <div class="inline-flex items-center gap-0.5 rounded-md border border-neutral-200 bg-white px-1.5 py-1 text-[11px] text-neutral-600">
            <label class="inline-flex cursor-pointer items-center gap-1">
              <span>Fill</span>
              <input
                type="color"
                value={selBg}
                oninput={(e) => applyElStyle('background-color', e.currentTarget.value)}
                class="h-4 w-5 cursor-pointer border-0 bg-transparent p-0"
              />
            </label>
            {#if selHasBg}
              <button
                type="button"
                title="Clear background fill"
                onmousedown={(e) => e.preventDefault()}
                onclick={clearElBg}
                class="ml-0.5 rounded p-0.5 text-neutral-400 hover:text-red-600"
              >
                <X size={11} />
              </button>
            {/if}
          </div>

          <!-- TEXT FORMATTING -->
          <div class="inline-flex items-center rounded-md border border-neutral-200 bg-white p-0.5">
            <button
              type="button"
              title="Bold"
              onmousedown={(e) => e.preventDefault()}
              onclick={() => applyElStyle('font-weight', selBold ? '400' : '700')}
              class="rounded p-1 {selBold ? 'bg-[#111214] text-white' : 'text-neutral-600 hover:bg-neutral-100'}"
            >
              <Bold size={12} />
            </button>
            <button
              type="button"
              title="Italic"
              onmousedown={(e) => e.preventDefault()}
              onclick={() => applyElStyle('font-style', selItalic ? 'normal' : 'italic')}
              class="rounded p-1 {selItalic ? 'bg-[#111214] text-white' : 'text-neutral-600 hover:bg-neutral-100'}"
            >
              <Italic size={12} />
            </button>
            <button
              type="button"
              title="Underline"
              onmousedown={(e) => e.preventDefault()}
              onclick={() => applyElStyle('text-decoration', selUnderline ? 'none' : 'underline')}
              class="rounded p-1 {selUnderline ? 'bg-[#111214] text-white' : 'text-neutral-600 hover:bg-neutral-100'}"
            >
              <Underline size={12} />
            </button>
            <button
              type="button"
              title="Uppercase"
              onmousedown={(e) => e.preventDefault()}
              onclick={() => applyElStyle('text-transform', selUppercase ? 'none' : 'uppercase')}
              class="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold {selUppercase ? 'bg-[#111214] text-white' : 'text-neutral-600 hover:bg-neutral-100'}"
            >
              AA
            </button>
          </div>

          <!-- ALIGNMENT -->
          <div class="inline-flex items-center rounded-md border border-neutral-200 bg-white p-0.5">
            <button
              type="button"
              title="Align Left"
              onmousedown={(e) => e.preventDefault()}
              onclick={() => applyElStyle('text-align', 'left')}
              class="rounded p-1 {selAlign === 'left' ? 'bg-[#111214] text-white' : 'text-neutral-600 hover:bg-neutral-100'}"
            >
              <AlignLeft size={12} />
            </button>
            <button
              type="button"
              title="Align Center"
              onmousedown={(e) => e.preventDefault()}
              onclick={() => applyElStyle('text-align', 'center')}
              class="rounded p-1 {selAlign === 'center' ? 'bg-[#111214] text-white' : 'text-neutral-600 hover:bg-neutral-100'}"
            >
              <AlignCenter size={12} />
            </button>
            <button
              type="button"
              title="Align Right"
              onmousedown={(e) => e.preventDefault()}
              onclick={() => applyElStyle('text-align', 'right')}
              class="rounded p-1 {selAlign === 'right' ? 'bg-[#111214] text-white' : 'text-neutral-600 hover:bg-neutral-100'}"
            >
              <AlignRight size={12} />
            </button>
          </div>

          <!-- RADIUS & OPACITY -->
          <label class="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-500">
            <span>Radius</span>
            <input
              type="number"
              min="0"
              max="999"
              value={selRadius}
              onchange={(e) => applyElStyle('border-radius', `${Math.max(0, Number(e.currentTarget.value) || 0)}px`)}
              class="w-10 text-center font-mono text-xs text-neutral-800 focus:outline-none"
            />
          </label>

          <label class="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-500">
            <span>Opacity</span>
            <input
              type="number"
              min="5"
              max="100"
              step="5"
              value={selOpacity}
              onchange={(e) => applyElStyle('opacity', `${Math.max(5, Math.min(100, Number(e.currentTarget.value) || 100)) / 100}`)}
              class="w-10 text-center font-mono text-xs text-neutral-800 focus:outline-none"
            />
          </label>

          <!-- DUPLICATE / DELETE / DESELECT -->
          <div class="ml-auto inline-flex items-center gap-1">
            <button
              type="button"
              title="Duplicate element"
              onmousedown={(e) => e.preventDefault()}
              onclick={duplicateSelectedEl}
              class="rounded-md border border-neutral-200 bg-white p-1.5 text-neutral-600 hover:border-[#111214] hover:text-[#111214]"
            >
              <CopyPlus size={12} />
            </button>
            <button
              type="button"
              title="Delete element"
              onmousedown={(e) => e.preventDefault()}
              onclick={deleteSelectedEl}
              class="rounded-md border border-neutral-200 bg-white p-1.5 text-neutral-600 hover:border-red-300 hover:text-red-600"
            >
              <Trash2 size={12} />
            </button>
            <button
              type="button"
              title="Deselect"
              onclick={() => posterRef?.clearSelection()}
              class="rounded-md border border-neutral-200 bg-white p-1.5 text-neutral-400 hover:text-[#111214]"
            >
              <X size={12} />
            </button>
          </div>
        {:else}
          <span class="text-xs text-neutral-400">
            Click any element on the canvas to style its color, font, size, background, radius, or delete it.
          </span>
        {/if}
      </div>

      <!-- LIVE CANVAS -->
      <div
        bind:clientWidth={stageWidth}
        bind:clientHeight={stageHeight}
        class="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-6"
      >
        <div
          class="relative overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.09)] ring-1 ring-black/8"
          style="width: {Math.round(canvasWidth * previewScale)}px; height: {Math.round(canvasHeight * previewScale)}px;"
        >
          <div
            style="transform: scale({previewScale}); transform-origin: top left; width: {canvasWidth}px; height: {canvasHeight}px;"
          >
            <PosterCanvas
              bind:this={posterRef}
              {slide}
              width={canvasWidth}
              height={canvasHeight}
              scopeId="cs-stage"
              editable={true}
              onHtmlChange={(html) => updateSlide({ html })}
              onSelectElement={readSelectedStyles}
              bind:canvasEl
            />
          </div>
        </div>
      </div>

      <!-- BOTTOM SLIDE BAR -->
      <div class="flex shrink-0 items-center justify-between border-t border-neutral-200 bg-white px-4 py-2">
        <div class="flex items-center gap-1.5 overflow-x-auto">
          {#each slides as s, idx (s.id)}
            <div class="inline-flex items-center">
              <button
                type="button"
                onclick={() => {
                  posterRef?.clearSelection();
                  activeIdx = idx;
                }}
                class="rounded-lg border px-2.5 py-1 text-xs font-medium transition {activeIdx === idx
                  ? 'border-[#111214] bg-[#111214] text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'}"
              >
                Slide {idx + 1}
              </button>
              {#if slides.length > 1}
                <button
                  type="button"
                  onclick={() => removeSlide(idx)}
                  aria-label="Delete slide"
                  class="ml-0.5 rounded p-1 text-neutral-400 hover:text-red-600"
                >
                  <Trash2 size={12} />
                </button>
              {/if}
            </div>
          {/each}
          <button
            type="button"
            onclick={addSlide}
            class="inline-flex items-center gap-1 rounded-lg border border-dashed border-neutral-300 px-2.5 py-1 text-xs text-neutral-600 hover:border-[#111214] hover:text-[#111214]"
          >
            <Plus size={12} />
            Add Slide
          </button>
        </div>

        <span class="hidden font-mono text-[11px] text-neutral-500 sm:inline">
          {canvasWidth}×{canvasHeight} · 2x PNG ({canvasWidth * 2}×{canvasHeight * 2})
        </span>
      </div>
    </main>

    <!-- RIGHT CLEAN HTML / CSS DRAWER (TOGGLEABLE) -->
    {#if codeOpen}
      <section class="flex h-[340px] w-full shrink-0 flex-col border-t border-neutral-200 bg-white lg:h-auto lg:w-[420px] lg:border-l lg:border-t-0">
        <div class="flex items-center justify-between border-b border-neutral-200 px-3 py-2">
          <div class="flex rounded-lg border border-neutral-200 bg-neutral-100 p-0.5">
            <button
              type="button"
              onclick={() => (codeTab = 'html')}
              class="rounded-md px-3 py-1 font-mono text-xs font-medium {codeTab === 'html'
                ? 'bg-white text-[#111214] shadow-xs'
                : 'text-neutral-500'}"
            >
              index.html
            </button>
            <button
              type="button"
              onclick={() => (codeTab = 'css')}
              class="rounded-md px-3 py-1 font-mono text-xs font-medium {codeTab === 'css'
                ? 'bg-white text-[#111214] shadow-xs'
                : 'text-neutral-500'}"
            >
              styles.css
            </button>
          </div>
          <span class="font-mono text-[10px] text-neutral-400">Live synced</span>
        </div>

        {#if codeTab === 'html'}
          <textarea
            spellcheck="false"
            value={slide.html}
            oninput={(e) => updateSlide({ html: e.currentTarget.value })}
            class="min-h-0 flex-1 resize-none bg-[#FAFAF8] p-3.5 font-mono text-xs leading-relaxed text-[#111214] focus:bg-white focus:outline-none"
          ></textarea>
        {:else}
          <textarea
            spellcheck="false"
            value={slide.css}
            oninput={(e) => updateSlide({ css: e.currentTarget.value })}
            class="min-h-0 flex-1 resize-none bg-[#FAFAF8] p-3.5 font-mono text-xs leading-relaxed text-[#111214] focus:bg-white focus:outline-none"
          ></textarea>
        {/if}

        <div class="border-t border-neutral-200 bg-neutral-50 px-3.5 py-2 font-mono text-[10px] text-neutral-500">
          CSS vars: <code>--bg</code> <code>--fg</code> <code>--accent</code> <code>--accent-fg</code> <code>--pad</code> <code>--title-size</code>
        </div>
      </section>
    {/if}
  </div>
</div>
