import { getChannelIcon } from './icons';

export type FormatId = 'square' | 'wide' | 'carousel' | 'custom';

export interface FormatSpec {
  id: Exclude<FormatId, 'custom'>;
  label: string;
  width: number;
  height: number;
}

export const FORMATS: Record<Exclude<FormatId, 'custom'>, FormatSpec> = {
  square: { id: 'square', label: '1:1', width: 1080, height: 1080 },
  wide: { id: 'wide', label: '16:9', width: 1200, height: 675 },
  carousel: { id: 'carousel', label: '4:5', width: 1080, height: 1350 }
};

export const THEME_SWATCHES = [
  { name: 'Warm Paper', bg: '#F4F3EE', fg: '#111214', accent: '#A3FF6E' },
  { name: 'Pure White', bg: '#FFFFFF', fg: '#111214', accent: '#111214' },
  { name: 'Obsidian', bg: '#0B0C10', fg: '#FFFFFF', accent: '#A3FF6E' },
  { name: 'Acid Lime', bg: '#A3FF6E', fg: '#0B0C10', accent: '#0B0C10' }
];

export interface SlideDoc {
  id: string;
  bg: string;
  fg: string;
  accent: string;
  pad: number;
  titleSize: number;
  html: string;
  css: string;
}

export interface CampaignPreset {
  id: string;
  name: string;
  tagline: string;
  format: Exclude<FormatId, 'custom'>;
  slide: Omit<SlideDoc, 'id'>;
}

function svg(id: string): string {
  return getChannelIcon(id)?.svg || '';
}

const BASE_CSS = `.canvas {
  width: 100%;
  height: 100%;
  padding: var(--pad);
  background: var(--bg);
  color: var(--fg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Outfit', sans-serif;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--fg) 8%, transparent);
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 500;
}

.meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  opacity: 0.55;
}

.main {
  margin: auto 0;
}

h1 {
  font-size: var(--title-size);
  line-height: 1.0;
  font-weight: 700;
  letter-spacing: -0.04em;
  margin: 0 0 26px 0;
}

.accent {
  color: var(--accent);
}

.mark {
  background: var(--accent);
  color: var(--accent-fg);
  padding: 0 12px;
  border-radius: 12px;
}

p {
  font-size: 30px;
  line-height: 1.4;
  opacity: 0.72;
  max-width: 800px;
  margin: 0;
}

.footer {
  padding-top: 24px;
  border-top: 1.5px solid color-mix(in srgb, var(--fg) 12%, transparent);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
}`;

export function createStarterSlide(): SlideDoc {
  return {
    id: `slide-${Math.random().toString(36).slice(2, 8)}`,
    bg: '#F4F3EE',
    fg: '#111214',
    accent: '#A3FF6E',
    pad: 72,
    titleSize: 84,
    html: `<div class="canvas">
  <div class="row">
    <span class="eyebrow">ANNOUNCEMENT</span>
    <span class="meta">01 / 01</span>
  </div>

  <div class="main">
    <h1>Click any text to <span class="mark">edit directly.</span></h1>
    <p>Adjust colors on the left, drop in blocks, or open HTML &amp; CSS for full control.</p>
  </div>

  <div class="footer">
    <div class="brand">yourbrand</div>
    <span class="meta">yourbrand.com</span>
  </div>
</div>`,
    css: BASE_CSS
  };
}

export const PRESETS: CampaignPreset[] = [
  {
    id: 'psa-paper',
    name: 'Humor / PSA',
    tagline: 'Warm paper + unread badge',
    format: 'square',
    slide: {
      bg: '#F4F3EE',
      fg: '#0E0F12',
      accent: '#A3FF6E',
      pad: 72,
      titleSize: 92,
      html: `<div class="canvas">
  <div class="row">
    <span class="eyebrow">PUBLIC SERVICE ANNOUNCEMENT</span>
    <span class="meta">01 / INBOX REALITY</span>
  </div>

  <div class="main">
    <div class="status-pill">
      <span class="dot"></span>
      <span class="addr">info@yourbrand.com</span>
      <span class="badge">412 unread</span>
    </div>

    <h1>Nobody checks<br/>info@.</h1>
    <p>Forward it straight to Slack, Discord, or your personal Gmail so somebody actually replies.</p>

    <div class="icons">
      <span class="icon-box">${svg('gmail')}</span>
      <span class="icon-box">${svg('slack')}</span>
      <span class="icon-box">${svg('discord')}</span>
      <span class="icon-box">${svg('telegram')}</span>
      <span class="meta">+ Webhooks</span>
    </div>
  </div>

  <div class="footer">
    <div class="brand">automasend</div>
    <span class="meta">automasend.com</span>
  </div>
</div>`,
      css: `${BASE_CSS}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  background: #FFFFFF;
  border: 1.5px solid #E2E0D8;
  border-radius: 18px;
  padding: 14px 22px;
  margin-bottom: 36px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #EF4444;
}
.addr {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
}
.badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  background: #FEE2E2;
  color: #B91C1C;
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 600;
}
.icons {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 38px;
}
.icon-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #FFFFFF;
  border: 1.5px solid #E2E0D8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.icon-box svg { width: 28px; height: 28px; }`
    }
  },
  {
    id: 'launch-lime',
    name: 'Launch Poster',
    tagline: 'Acid lime + dark pills',
    format: 'square',
    slide: {
      bg: '#A3FF6E',
      fg: '#0B0C10',
      accent: '#0B0C10',
      pad: 72,
      titleSize: 82,
      html: `<div class="canvas">
  <div class="row">
    <div class="brand">automasend</div>
    <span class="pill-dark">LIVE NOW</span>
  </div>

  <div class="main">
    <h1>Forward domain emails to the apps you actually open.</h1>
    <div class="pills">
      <span class="chip">${svg('gmail')} Gmail</span>
      <span class="chip">${svg('slack')} Slack</span>
      <span class="chip">${svg('discord')} Discord</span>
      <span class="chip">${svg('telegram')} Telegram</span>
      <span class="chip">${svg('webhook')} Webhooks</span>
    </div>
  </div>

  <div class="footer">
    <strong>Free for 2 custom domains</strong>
    <span class="meta">automasend.com →</span>
  </div>
</div>`,
      css: `${BASE_CSS}

.pill-dark {
  background: #0B0C10;
  color: #A3FF6E;
  padding: 9px 18px;
  border-radius: 999px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 600;
}
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #0B0C10;
  color: #FFFFFF;
  padding: 12px 20px;
  border-radius: 999px;
  font-size: 19px;
  font-weight: 600;
}
.chip svg { width: 22px; height: 22px; }
.footer strong { font-size: 22px; }`
    }
  },
  {
    id: 'receipt-dark',
    name: 'Receipt / Savings',
    tagline: 'Dark split + paper invoice',
    format: 'square',
    slide: {
      bg: '#0B0C10',
      fg: '#FFFFFF',
      accent: '#A3FF6E',
      pad: 72,
      titleSize: 70,
      html: `<div class="canvas">
  <div class="row">
    <span class="eyebrow">FOR 1–5 PERSON TEAMS</span>
    <span class="meta">MONTHLY BILL</span>
  </div>

  <div class="split">
    <div>
      <h1>4 aliases.<br/>1 human.<br/><span class="accent">$0/month.</span></h1>
      <p>You don't need four paid mail seats just to look legit. Forward every alias to your inbox or Slack.</p>
    </div>

    <div class="receipt">
      <div class="r-head">OLD EMAIL INVOICE</div>
      <div class="r-row"><span>hello@</span><span>$7.00</span></div>
      <div class="r-row"><span>support@</span><span>$7.00</span></div>
      <div class="r-row"><span>billing@</span><span>$7.00</span></div>
      <div class="r-row"><span>founders@</span><span>$7.00</span></div>
      <div class="r-total"><span>TOTAL</span><s>$28.00/mo</s></div>
      <div class="r-win">With Automasend: $0</div>
    </div>
  </div>

  <div class="footer">
    <div class="brand">automasend</div>
    <span class="meta">automasend.com</span>
  </div>
</div>`,
      css: `${BASE_CSS}

.split {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 44px;
  align-items: center;
  margin: auto 0;
}
.split p { font-size: 25px; }
.receipt {
  background: #F4F3EE;
  color: #0E0F12;
  border-radius: 22px;
  padding: 30px 26px;
  font-family: 'JetBrains Mono', monospace;
}
.r-head {
  font-size: 13px;
  color: #71717A;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px dashed #C7C4B8;
}
.r-row {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  margin-bottom: 12px;
}
.r-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px dashed #C7C4B8;
  font-size: 17px;
}
.r-total s { color: #DC2626; font-size: 24px; }
.r-win {
  margin-top: 18px;
  background: #0E0F12;
  color: var(--accent);
  border-radius: 12px;
  padding: 14px;
  text-align: center;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 19px;
}`
    }
  },
  {
    id: 'before-after',
    name: 'Before / After',
    tagline: 'High-contrast comparison',
    format: 'square',
    slide: {
      bg: '#0C0D11',
      fg: '#FFFFFF',
      accent: '#A3FF6E',
      pad: 72,
      titleSize: 78,
      html: `<div class="canvas">
  <div class="row">
    <span class="eyebrow">FIRST IMPRESSIONS</span>
    <span class="meta">SAME INBOX, BETTER LOOK</span>
  </div>

  <div class="main">
    <h1>Keep using Gmail.<br/><span class="accent">Stop looking like it.</span></h1>

    <div class="stack">
      <div class="card bad">
        <div>
          <div class="mono"><s>northstar.studio2026@gmail.com</s></div>
          <div class="sub">"Is this a real company or my uncle?"</div>
        </div>
        <span class="tag-bad">NAH</span>
      </div>

      <div class="card good">
        <div>
          <div class="mono">hello@northstar.studio</div>
          <div class="sub accent">Lands right inside your Gmail anyway.</div>
        </div>
        <span class="tag-good">CLEAN</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="brand">automasend</div>
    <span class="meta">automasend.com</span>
  </div>
</div>`,
      css: `${BASE_CSS}

.stack { display: flex; flex-direction: column; gap: 20px; margin-top: 38px; }
.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 26px 30px;
  border-radius: 20px;
}
.bad { background: #14161D; border: 1.5px solid #242836; opacity: 0.72; }
.good { background: #131B15; border: 2px solid var(--accent); }
.mono { font-family: 'JetBrains Mono', monospace; font-size: 24px; }
.sub { font-size: 18px; margin-top: 6px; opacity: 0.75; }
.tag-bad {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  background: rgba(248,113,113,0.14);
  color: #F87171;
  padding: 8px 14px;
  border-radius: 999px;
}
.tag-good {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  background: var(--accent);
  color: #0B0C10;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 999px;
}`
    }
  },
  {
    id: 'routing-wide',
    name: 'Multi-Channel 16:9',
    tagline: 'Wide X / PH fan-out card',
    format: 'wide',
    slide: {
      bg: '#0B0C10',
      fg: '#FFFFFF',
      accent: '#A3FF6E',
      pad: 56,
      titleSize: 58,
      html: `<div class="canvas">
  <div class="row">
    <span class="eyebrow">MULTI-CHANNEL FORWARDING</span>
    <span class="meta">automasend.com</span>
  </div>

  <div class="split">
    <div>
      <h1>One email address.<br/><span class="accent">Every channel</span> your team checks.</h1>
      <p>Route any alias on your domain to Gmail, Slack, Discord, Telegram, or custom webhooks.</p>
    </div>

    <div class="panel">
      <div class="source">orders@yourshop.com</div>
      <div class="grid">
        <div class="dest">${svg('gmail')} Gmail</div>
        <div class="dest">${svg('slack')} Slack</div>
        <div class="dest">${svg('discord')} Discord</div>
        <div class="dest">${svg('telegram')} Telegram</div>
      </div>
      <div class="dest full">${svg('webhook')} Custom Webhooks <span class="meta">Any app</span></div>
    </div>
  </div>

  <div class="footer">
    <div class="brand">automasend</div>
    <span class="meta accent">Free for 2 custom domains</span>
  </div>
</div>`,
      css: `${BASE_CSS}

.split {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 38px;
  align-items: center;
  margin: auto 0;
}
.split p { font-size: 21px; }
.panel {
  background: #13151C;
  border: 1.5px solid #242836;
  border-radius: 22px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.source {
  background: #0B0C10;
  border: 1px solid #262A38;
  border-radius: 12px;
  padding: 14px 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 19px;
}
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.dest {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #1A1D27;
  border: 1px solid #282C3B;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
  font-weight: 500;
}
.dest svg { width: 24px; height: 24px; flex-shrink: 0; }
.dest.full { justify-content: flex-start; }
.dest.full .meta { margin-left: auto; font-size: 13px; }`
    }
  }
];

export const SNIPPETS = [
  {
    label: '+ Badge',
    html: `\n<span class="eyebrow">NEW</span>`
  },
  {
    label: '+ Heading',
    html: `\n<h2 style="font-size:48px;font-weight:700;letter-spacing:-0.03em;margin:16px 0;">Subheading</h2>`
  },
  {
    label: '+ Note',
    html: `\n<p>Add a short human explanation here.</p>`
  },
  {
    label: '+ App Icons',
    html: `\n<div style="display:flex;gap:12px;margin-top:24px;">\n  <span style="width:44px;height:44px;display:inline-flex;">${svg('gmail')}</span>\n  <span style="width:44px;height:44px;display:inline-flex;">${svg('slack')}</span>\n  <span style="width:44px;height:44px;display:inline-flex;">${svg('discord')}</span>\n  <span style="width:44px;height:44px;display:inline-flex;">${svg('telegram')}</span>\n</div>`
  }
];
