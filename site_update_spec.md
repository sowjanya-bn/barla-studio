# Personal Site Update — Build Spec
## sowjanya-bn.github.io/barla-studio/sowjanya/
## For Claude Code · 2026-06-23

---

## What to build

Two things in one pass:

1. Update `sowjanya/index.html` — add missing projects, update publication links, refresh the Now section
2. Create `sowjanya/research/index.html` — honeypot page with invisible visitor beacon

Do not change the visual design, CSS, fonts, layout or navigation structure. Content updates only, except for the new research page which should match the existing aesthetic exactly.

---

## Part 1 — Update sowjanya/index.html

### Publication section

Replace the existing publication entry with:

```
Accepted · ESWC 2026 · Best Student Paper Nomination

Competency Questions as Executable Plans
A Controlled RAG Architecture for Cultural Heritage Storytelling
Naga Sowjanya Barla and Jacopo de Berardinis

→ Springer: https://doi.org/10.1007/978-3-032-25156-5_25
→ arXiv: https://arxiv.org/abs/2604.02545
```

Both links should be visible. Springer link is the canonical published version.

---

### Now section

Replace current Now section content with:

```
MSc Data Science and Artificial Intelligence, University of Liverpool.
Research Assistant — British Music Experience museum installation project.
Building Sonora: a KG-grounded conversational agent for embodied museum interaction.
```

---

### Recent Work section

Replace the existing three project entries with these six. Keep the same card/section format as existing entries. Short and sweet — one line description, one link where available.

---

**Sonora / Lumi**
```
Title: Sonora — Embodied Museum Dialogue
Description: KG-grounded conversational agent for the British Music Experience. Built on Furhat. Epistemic honesty as a first-class dialogue objective.
Link: (none for now)
```

---

**BME Knowledge Graph**
```
Title: BME Knowledge Graph
Description: Knowledge graph for the British Music Experience. 5,972 entities, 15,953 relationships. Live with SPARQL-backed retrieval.
Link: (none for now)
```

---

**Memoria**
```
Title: Memoria
Description: Domain-agnostic RDF knowledge graph explorer. Deployed against the BME KG.
Link: (none for now)
```

---

**CQ-StoryRAG / ESWC paper**
```
Title: Competency Questions as Executable Plans
Description: Controlled RAG architecture for cultural heritage storytelling. Repurposes competency questions as run-time retrieval plans. ESWC 2026.
Link: https://doi.org/10.1007/978-3-032-25156-5_25
```

---

**Echo**
```
Title: Echo
Description: Furhat-based proof of concept for KG-grounded museum dialogue. Direct predecessor to Sonora.
Link: (none for now)
```

---

**DayPilot**
```
Title: DayPilot
Description: Local-first daily planning app. Optional bring-your-own-key LLM reflection layer. React Native.
Link: (none for now)
```

---

### Navigation / subtle research link

Add a single understated link to the research page. Place it in the existing navigation or at the bottom of the page, consistent with existing link style.

```html
<a href="/barla-studio/sowjanya/research/">Research</a>
```

Do not make this prominent. One link, same style as existing nav links.

---

### Invisible visitor beacon

Add this script to the `<head>` of `sowjanya/index.html`. It must be completely silent — no console output, no visible effect, wrapped in try/catch.

```html
<script>
(function() {
  try {
    fetch('APPS_SCRIPT_URL_HERE', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer || 'direct',
        userAgent: navigator.userAgent,
        language: navigator.language || '',
        screen: screen.width + 'x' + screen.height
      })
    });
  } catch(e) {}
})();
</script>
```

Leave `APPS_SCRIPT_URL_HERE` as a clear placeholder comment. The owner will replace it after deploying the Apps Script.

---

## Part 2 — Create sowjanya/research/index.html

### File location

```
barla-studio/sowjanya/research/index.html
```

### Design

Match the existing site exactly:
- Same CSS / stylesheet link
- Same font, spacing, colour palette
- Same navigation header with home link
- Same footer

### Content

The page should feel like a genuine research notes index. Real content, not placeholder text.

```
Research

A log of what I have been thinking about and building.
Not exhaustive. Updated occasionally.

---

Knowledge Graphs and Retrieval

Structured knowledge as a grounding layer for language model outputs.
Competency questions as run-time executable retrieval plans — not just ontology validation tools.
SPARQL-backed RAG for cultural heritage storytelling.

→ ESWC 2026: doi.org/10.1007/978-3-032-25156-5_25
→ arXiv: arxiv.org/abs/2604.02545

---

Embodied Conversational Agents

Museum dialogue systems built on knowledge graphs.
Epistemic honesty as a design constraint, not an afterthought.
KG-grounded response generation for visitor interaction on Furhat robots.

---

Retrieval-Augmented System Evaluation

Coverage, coherence and grounding beyond surface-level correctness.
Structured output validation for RAG pipelines.
Behaviour under knowledge gaps.

---

Signal and Labour Market Research

Personal observatory for technology labour markets.
Named: SignalCartography. Not yet public.

---

← Back
```

### Invisible visitor beacon

Add the same beacon script to the `<head>` of `research/index.html`. Identical to the one on the main page. Same placeholder comment for the Apps Script URL.

```html
<script>
(function() {
  try {
    fetch('APPS_SCRIPT_URL_HERE', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer || 'direct',
        userAgent: navigator.userAgent,
        language: navigator.language || '',
        screen: screen.width + 'x' + screen.height
      })
    });
  } catch(e) {}
})();
</script>
```

---

## Google Apps Script (owner sets up manually)

The owner must do this before wiring the beacon URL:

1. Go to https://script.google.com
2. Create new project — name it `barla-visitor-log`
3. Create a Google Sheet — name it `Visitor Log`
4. Copy the Sheet ID from the URL
5. Paste the Apps Script code below, replace `SHEET_ID_HERE`
6. Deploy → New Deployment → Web App
7. Execute as: Me / Who has access: Anyone
8. Copy the Web App URL
9. Replace `APPS_SCRIPT_URL_HERE` in both HTML files

### Apps Script

```javascript
const SHEET_ID = 'SHEET_ID_HERE';
const SHEET_NAME = 'visits';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp','Page','Referrer','User Agent','Classification','Language','Screen']);
      sheet.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.page || '',
      data.referrer || 'direct',
      data.userAgent || '',
      classifyVisitor(data.userAgent || ''),
      data.language || '',
      data.screen || ''
    ]);
  } catch(err) {}

  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}

function classifyVisitor(ua) {
  const u = ua.toLowerCase();
  if (u.includes('gptbot'))          return 'ai-gptbot';
  if (u.includes('chatgpt'))         return 'ai-chatgpt';
  if (u.includes('claude-web'))      return 'ai-claude';
  if (u.includes('claudebot'))       return 'ai-claude';
  if (u.includes('anthropic'))       return 'ai-anthropic';
  if (u.includes('perplexitybot'))   return 'ai-perplexity';
  if (u.includes('gemini'))          return 'ai-gemini';
  if (u.includes('cohere'))          return 'ai-cohere';
  if (u.includes('diffbot'))         return 'ai-diffbot';
  if (u.includes('googlebot'))       return 'crawler-google';
  if (u.includes('bingbot'))         return 'crawler-bing';
  if (u.includes('duckduckbot'))     return 'crawler-ddg';
  if (u.includes('python-httpx'))    return 'programmatic-httpx';
  if (u.includes('python-requests')) return 'programmatic-requests';
  if (u.includes('curl'))            return 'programmatic-curl';
  if (u.includes('wget'))            return 'programmatic-wget';
  if (u.includes('go-http-client'))  return 'programmatic-go';
  if (u.includes('axios'))           return 'programmatic-axios';
  if (!ua || ua.trim() === '')       return 'no-user-agent';
  if (u.includes('mozilla') && (u.includes('chrome') || u.includes('firefox') || u.includes('safari') || u.includes('edge'))) return 'human-browser';
  return 'unknown';
}

function doGet(e) {
  return ContentService.createTextOutput('ok').setMimeType(ContentService.MimeType.TEXT);
}
```

---

## Files to create

```
barla-studio/sowjanya/research/index.html
```

## Files to modify

```
barla-studio/sowjanya/index.html
```

---

## Notes for Claude Code

1. Do not change any CSS, layout, fonts or visual design. Content only.
2. Match the research page aesthetic exactly to the main site.
3. Both beacon scripts must be invisible — silent try/catch, no console output.
4. `mode: 'no-cors'` is required on both fetch calls. Do not remove it.
5. Leave `APPS_SCRIPT_URL_HERE` as a literal placeholder string with a comment.
6. Do not add research page to any sitemap or robots.txt.
7. The research link in navigation should be subtle — same style as existing links, not highlighted.
8. Both Springer and arXiv links should open in a new tab where the existing site does the same.
9. The Best Student Paper Nomination should be mentioned on the publication entry.
10. Projects without links should have no dead link — omit the link entirely rather than pointing to GitHub root.
