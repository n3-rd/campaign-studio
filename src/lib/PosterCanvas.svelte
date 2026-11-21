<script lang="ts">
  import type { SlideDoc } from './presets';

  let {
    slide,
    width,
    height,
    scopeId = 'cs-canvas',
    editable = false,
    onHtmlChange,
    onSelectElement,
    canvasEl = $bindable<HTMLDivElement | null>(null)
  }: {
    slide: SlideDoc;
    width: number;
    height: number;
    scopeId?: string;
    editable?: boolean;
    onHtmlChange?: (html: string) => void;
    onSelectElement?: (el: HTMLElement | null) => void;
    canvasEl?: HTMLDivElement | null;
  } = $props();

  let contentHost = $state<HTMLDivElement | null>(null);
  let lastWrittenHtml = '';
  let selectedNode: HTMLElement | null = null;

  function contrastColor(hex: string): string {
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return '#0B0C10';
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return lum > 0.55 ? '#0B0C10' : '#FFFFFF';
  }

  const accentFg = $derived(contrastColor(slide.accent));

  function serializeCleanHtml(): string {
    if (!contentHost) return '';
    const prev = selectedNode;
    if (prev) prev.removeAttribute('data-cs-selected');
    const html = contentHost.innerHTML;
    if (prev && contentHost.contains(prev)) prev.setAttribute('data-cs-selected', 'true');
    return html;
  }

  export function syncDomToSlide() {
    if (!contentHost || !onHtmlChange) return;
    lastWrittenHtml = serializeCleanHtml();
    onHtmlChange(lastWrittenHtml);
  }

  export function clearSelection() {
    if (selectedNode) {
      selectedNode.removeAttribute('data-cs-selected');
      selectedNode = null;
    }
    onSelectElement?.(null);
  }

  $effect(() => {
    const incoming = slide.html;
    if (contentHost && incoming !== lastWrittenHtml) {
      clearSelection();
      contentHost.innerHTML = incoming;
      lastWrittenHtml = incoming;
    }
  });

  function handleCanvasInput() {
    syncDomToSlide();
  }

  function handleCanvasClick(e: MouseEvent) {
    if (!editable || !contentHost) return;
    let target = e.target as HTMLElement | null;
    if (!target || target === contentHost) {
      clearSelection();
      return;
    }
    // Walk out of inline SVG internals so clicking an icon selects its wrapper
    while (target && target !== contentHost && target.namespaceURI === 'http://www.w3.org/2000/svg') {
      target = target.parentElement;
    }
    // Clicking the outer .canvas background deselects
    if (!target || target === contentHost || target.classList.contains('canvas')) {
      clearSelection();
      return;
    }
    if (selectedNode && selectedNode !== target) {
      selectedNode.removeAttribute('data-cs-selected');
    }
    selectedNode = target;
    selectedNode.setAttribute('data-cs-selected', 'true');
    onSelectElement?.(selectedNode);
  }

  function buildScopedCss(rawCss: string, id: string): string {
    const trimmed = rawCss.trim();
    const selRule = editable
      ? `[data-cs-selected="true"] { outline: 2px solid #2563eb !important; outline-offset: 4px !important; border-radius: 4px; }\n`
      : '';
    if (!trimmed && !selRule) return '';
    return `#${id} {\n${selRule}${trimmed}\n}`;
  }

  const scopedCss = $derived(buildScopedCss(slide.css, scopeId));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  id={scopeId}
  bind:this={canvasEl}
  onclick={handleCanvasClick}
  style="
    width: {width}px;
    height: {height}px;
    --bg: {slide.bg};
    --fg: {slide.fg};
    --accent: {slide.accent};
    --accent-fg: {accentFg};
    --pad: {slide.pad}px;
    --title-size: {slide.titleSize}px;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    background: {slide.bg};
    color: {slide.fg};
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
  "
>
  {#if scopedCss}
    {@html `<style>${scopedCss}</style>`}
  {/if}
  <div
    bind:this={contentHost}
    contenteditable={editable ? 'true' : 'false'}
    spellcheck="false"
    oninput={handleCanvasInput}
    style="width:100%;height:100%;outline:none;"
  ></div>
</div>
