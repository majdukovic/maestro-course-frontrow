/**
 * Privacy and Terms pages, bundled so the WebView works offline. Each page
 * has a visible heading, one in-page anchor link and one button, for
 * WebView testing. Placeholder legal text: FrontRow is a demo app.
 */
export type LegalPage = 'privacy' | 'terms';

function page(heading: string, sections: [id: string, title: string, body: string][]): string {
  const [first, ...rest] = sections;
  const last = rest[rest.length - 1]!;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${heading}</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.5 -apple-system, Roboto, sans-serif; margin: 0; padding: 16px 20px 48px; }
  h1 { font-size: 26px; margin: 8px 0 4px; }
  h2 { font-size: 19px; margin-top: 28px; }
  a { color: #FF3B5C; }
  button { font: inherit; padding: 10px 18px; border: 0; border-radius: 8px;
           background: #FF3B5C; color: #fff; margin-top: 12px; }
  #ack { margin-left: 8px; font-weight: 600; }
  .spacer { height: 60vh; }
</style>
</head>
<body>
<h1 id="top">${heading}</h1>
<p>Last updated: 12 May 2026</p>
<p><a id="jump" href="#${last[0]}">Jump to ${last[1]}</a></p>
<h2 id="${first![0]}">${first![1]}</h2>
<p>${first![2]}</p>
<div class="spacer"></div>
${rest.map(([id, title, body]) => `<h2 id="${id}">${title}</h2>\n<p>${body}</p>`).join('\n')}
<p><button id="accept" type="button"
  onclick="document.getElementById('ack').textContent='Thanks, noted.'">I understand</button><span id="ack"></span></p>
<p><a href="#top">Back to top</a></p>
</body>
</html>`;
}

export const LEGAL_PAGES: Record<LegalPage, { title: string; html: string }> = {
  privacy: {
    title: 'Privacy policy',
    html: page('Privacy policy', [
      [
        'summary',
        'Summary',
        'FrontRow is a demo app for QA training. It has no backend: all data is mock data stored on your device.',
      ],
      [
        'data',
        'Data we collect',
        'None. FrontRow sends no analytics, crash reports or personal data anywhere.',
      ],
      ['contact', 'Contact', 'Questions? Open an issue at github.com/majdukovic/frontrow.'],
    ]),
  },
  terms: {
    title: 'Terms of service',
    html: page('Terms of service', [
      [
        'use',
        'Using FrontRow',
        'FrontRow is open-source software under the MIT license, provided as is. Tickets in the app are not real.',
      ],
      [
        'purchases',
        'Purchases',
        'All purchases are simulated. No money changes hands and no card is ever charged.',
      ],
      ['changes', 'Changes', 'These terms may change between releases. See the changelog.'],
    ]),
  },
};
