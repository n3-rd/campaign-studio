export interface ChannelIcon {
  id: string;
  label: string;
  svg: string;
}

export const CHANNEL_ICONS: ChannelIcon[] = [
  {
    id: 'gmail',
    label: 'Gmail',
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M2 6.5V18a1.5 1.5 0 0 0 1.5 1.5H6V11l6 4.5L18 11v8.5h2.5A1.5 1.5 0 0 0 22 18V6.5a2 2 0 0 0-3.2-1.6L12 10 5.2 4.9A2 2 0 0 0 2 6.5Z" fill="#EA4335"/><path d="M2 6.5V18a1.5 1.5 0 0 0 1.5 1.5H6V11L2 8V6.5Z" fill="#4285F4"/><path d="M22 6.5V18a1.5 1.5 0 0 1-1.5 1.5H18V11l4-3V6.5Z" fill="#34A853"/><path d="M18 11V5.5l.8-.6A2 2 0 0 1 22 6.5V8l-4 3Z" fill="#FBBC04"/><path d="M6 11V5.5l-.8-.6A2 2 0 0 0 2 6.5V8l4 3Z" fill="#C5221F"/></svg>`
  },
  {
    id: 'slack',
    label: 'Slack',
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M6.2 15.2a2 2 0 1 1-2-2h2v2Zm1 0a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5Z" fill="#E01E5A"/><path d="M9.2 6.2a2 2 0 1 1 2-2v2h-2Zm0 1a2 2 0 1 1 0 4h-5a2 2 0 1 1 0-4h5Z" fill="#36C5F0"/><path d="M18.2 9.2a2 2 0 1 1 2 2h-2v-2Zm-1 0a2 2 0 1 1-4 0v-5a2 2 0 1 1 4 0v5Z" fill="#2EB67D"/><path d="M15.2 18.2a2 2 0 1 1-2 2v-2h2Zm0-1a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4h-5Z" fill="#ECB22E"/></svg>`
  },
  {
    id: 'discord',
    label: 'Discord',
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M19.73 4.87A18.2 18.2 0 0 0 15.2 3.5a12.6 12.6 0 0 0-.56 1.15 16.8 16.8 0 0 0-5.28 0A12.6 12.6 0 0 0 8.8 3.5a18.2 18.2 0 0 0-4.54 1.37C1.4 9.13.62 13.3 1 17.4a18.4 18.4 0 0 0 5.56 2.8 13.6 13.6 0 0 0 1.2-1.94 12 12 0 0 1-1.88-.9l.46-.36a13 13 0 0 0 11.32 0l.46.36c-.6.35-1.23.66-1.88.9.34.68.75 1.33 1.2 1.94A18.3 18.3 0 0 0 23 17.4c.47-4.76-.8-8.9-3.27-12.53ZM8.48 14.88c-1.08 0-1.97-.99-1.97-2.2s.87-2.2 1.97-2.2c1.1 0 2 .99 1.97 2.2 0 1.21-.87 2.2-1.97 2.2Zm7.04 0c-1.08 0-1.97-.99-1.97-2.2s.87-2.2 1.97-2.2c1.1 0 1.99.99 1.97 2.2 0 1.21-.87 2.2-1.97 2.2Z" fill="#5865F2"/></svg>`
  },
  {
    id: 'telegram',
    label: 'Telegram',
    svg: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10.5" fill="#26A5E4"/><path d="M16.9 7.8 6.4 11.8c-.7.3-.7.7-.1.9l2.7.8 6.2-3.9c.3-.2.6-.1.3.1l-5 4.5-.2 2.8c.3 0 .4-.1.6-.3l1.4-1.4 2.9 2.1c.5.3.9.1 1-.5l1.9-8.8c.2-.8-.3-1.1-.8-.9Z" fill="#fff"/></svg>`
  },
  {
    id: 'webhook',
    label: 'Webhooks',
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" stroke="#F59E0B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'github',
    label: 'GitHub',
    svg: `<svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.72 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" fill="#9CA3AF"/></svg>`
  },
  {
    id: 'stripe',
    label: 'Stripe',
    svg: `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#635BFF"/><path d="M11.1 9.5c0-.6.5-.9 1.3-.9 1.1 0 2.5.4 3.6 1V6.8c-1.2-.5-2.4-.7-3.6-.7-2.9 0-4.9 1.5-4.9 4.1 0 3.9 5.4 3.3 5.4 5 0 .7-.6 1-1.5 1-1.3 0-2.9-.5-4.1-1.3v2.9c1.4.6 2.8.9 4.1.9 3 0 5-1.5 5-4.1 0-4.2-5.3-3.5-5.3-5.1Z" fill="#fff"/></svg>`
  },
  {
    id: 'linear',
    label: 'Linear',
    svg: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" fill="#5E6AD2"/><path d="M4.6 14.4 9.6 19.4M3.8 11.2 12.8 20.2M5.7 7.8 16.2 18.3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`
  },
  {
    id: 'x',
    label: 'X',
    svg: `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#18181B"/><path d="M13.3 10.8 18.2 5h-1.2l-4.2 5-3.4-5H5.5l5.1 7.6L5.5 19h1.2l4.5-5.3 3.6 5.3h3.9l-5.4-8.2Zm-1.6 1.9-.5-.8L7.1 6h1.8l3.3 4.8.5.8 4.3 6.3h-1.8l-3.5-5.2Z" fill="#fff"/></svg>`
  }
];

export function getChannelIcon(id: string): ChannelIcon | undefined {
  return CHANNEL_ICONS.find((c) => c.id === id);
}

