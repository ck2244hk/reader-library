---
name: web-learning-helper
description: >
  Use this skill whenever the user wants to study, understand, or be tested on material from a
  website. Trigger on any URL paired with study intent — explicit phrases like "help me study this",
  "quiz me", "break this down", "I want to learn this", "help me understand", "let's go through
  this", or implicit signals like sharing a tutorial/doc/article link while asking a conceptual
  question about it. Also trigger when the user says things like "I'm reading X" or "I'm studying X"
  and shares a link. Covers all web content: technical docs, API references, tutorials, academic
  papers, blog posts, explainers. Do NOT trigger for URLs the user only wants quickly summarized —
  this skill is for deep structured learning sessions that produce a downloadable HTML study file.
---

# Web Learning Helper

A skill for reading web pages and turning them into a structured learning session:
terminology breakdown, logic flow, step-by-step memorization (for procedural content),
and an adaptive multiple-choice quiz.

---

## Step 1: Fetch the Page

Use `web_fetch` to retrieve the URL. If the page fails to load or is paywalled, tell the user
and ask them to paste the content directly.

---

## Step 2: Analyze Content Depth and Type

Before writing anything, internally assess:

- **Length**: short article / medium post / long doc / multi-section reference
- **Density**: how many distinct concepts, terms, or logical steps are present
- **Type**: tutorial, conceptual explainer, reference doc, research paper, general article
- **Procedural?**: does the content have steps, a sequence, or an order that must be followed?

Use this to calibrate output length, whether to include Step 4b, and quiz size.

---

## Step 3: Terminology Breakdown

Extract the **key terms** — jargon, domain-specific vocabulary, acronyms, and named concepts
the reader must understand to follow the material.

| Term | Plain-English Definition | Why It Matters in This Context |
|------|--------------------------|-------------------------------|
| ... | ... | ... |

Rules:
- Include only terms that are non-obvious or load-bearing for understanding the content
- Keep definitions tight — 1–2 sentences
- The "Why It Matters" column ties the term back to the specific article/doc, not a generic definition
- For technical docs: prioritize API names, design patterns, system concepts
- For academic content: prioritize methodology terms, field-specific vocabulary
- For general content: prioritize concepts the author builds their argument on

---

## Step 4: Logic Flow

Explain how the ideas in the content connect and build on each other. This is not a summary —
it's a map of the reasoning or structure.

Write this as flowing prose (not bullets), structured around the content's own progression.
Aim to answer: *What problem is being solved? How does the author/doc approach it? What are
the key steps or turning points in the reasoning? What does it all lead to?*

- For technical docs: trace the architecture or workflow decisions
- For tutorials: trace the learning progression and why each step follows from the last
- For research/academic: trace the argument — claim → evidence → implication
- For general articles: trace the narrative or argumentative arc

Length: proportional to content complexity. Short article = 2–3 paragraphs. Long doc = 4–6.

---

## Step 4b: Step-by-Step Breakdown (conditional)

**Include this section ONLY when the content has procedural or sequential structure.**

### When to include

Trigger Step 4b if the page contains any of:
- Numbered steps or a defined sequence of actions
- Installation / configuration / setup instructions
- An algorithm or process with distinct stages
- A workflow where step N must come before step N+1
- Tutorial sections titled "Step X", "Part X", "Phase X"

**Skip entirely** for purely conceptual content, opinion pieces, or reference docs with no
meaningful execution order.

### Format

Present as a numbered list. Each step must include:

1. **[Step name / action]** — what you actually do (imperative, specific, use exact names from the source)
   - *Why*: one sentence on why this step is necessary or what it sets up for the next step
   - *Watch out*: a gotcha, prerequisite, or common mistake — only include if genuinely relevant

Rules:
- Keep each step to 2–4 lines — optimized for memorization, not full explanation
- Use exact names, commands, and API terms from the source (never paraphrase CLI flags or type names)
- For sub-steps, nest with letters (a, b, c)
- If there are more than 12 steps, group into named phases (e.g. "Phase 1: Setup", "Phase 2: Execution")
- Do NOT duplicate content from Logic Flow — steps are for procedural recall, Logic Flow is for reasoning

---

## Step 5: Adaptive Quiz

Generate multiple-choice questions scaled to content depth:

| Content Type | Question Count |
|---|---|
| Short article (< 1000 words / few concepts) | 3–5 questions |
| Medium post / tutorial (1000–3000 words) | 5–8 questions |
| Long doc / academic paper / reference page | 8–12 questions |

### Question types — mix all of these:

- **Terminology**: "What does X mean in this context?"
- **Conceptual**: "Why does the author argue X leads to Y?"
- **Application**: "Given what you read, which approach fits situation Z?"
- **Logic/Relationship**: "Which best describes the relationship between X and Y?"
- **Sequence** *(only if Step 4b was included)*: "Which step comes immediately after X?", "What must be done before Y?", "What is the correct order of these steps?"
- **Gotcha**: at least 1–2 questions with plausible wrong answers that test careful reading vs. skimming

### Sequence question rules (when Step 4b applies)

- Include at least 2 sequence-order questions when procedural steps are present
- Question formats to use:
  - "What must happen before you can do X?"
  - "Which of the following is the correct order?"
  - "Step N sets up which subsequent step?"
  - "If you skip step N, what breaks?"
- Wrong answer options should use real steps from the list, just in the wrong order — don't invent fake steps

### Answer format

Each question:
- A) ...
- B) ...
- C) ...
- D) ...

Answer Key (hidden by default in the HTML output):
- Correct answer letter
- 1–2 sentence explanation of *why* it's correct
- For tricky wrong answers, briefly note why they're incorrect

---

## Output Format — Single-Column HTML File

Deliver output as a **self-contained, downloadable HTML file** with a single-column scrollable layout.
No iframes, no split panels.

### Layout Spec

```
┌──────────────────────────────────────────┐
│  ◆  [Page Title]          [URL badge ↗]  │  ← sticky header
├──────────────────────────────────────────┤
│  (max-width 800px, centered)             │
│                                          │
│  One-line framing sentence               │
│                                          │
│  KEY TERMINOLOGY                         │
│  ┌─────────────────────────────────┐     │
│  │ Term │ Definition │ Why matters │     │
│  └─────────────────────────────────┘     │
│                                          │
│  LOGIC FLOW                              │
│  prose paragraphs...                     │
│                                          │
│  STEP-BY-STEP  ← only if procedural     │
│  1. Step name                            │
│     Why: ...                             │
│     Watch out: ...                       │
│  2. ...                                  │
│                                          │
│  QUIZ — N Questions   [score tally]      │
│  ┌──────────────────────────────────┐    │
│  │ Q1 · [type badge]                │    │
│  │ Question text                    │    │
│  │ ○ A  option text                 │    │
│  │ ○ B  option text   ← clickable  │    │
│  │ ○ C  option text                 │    │
│  │ ○ D  option text                 │    │
│  │ [Check Answer] button            │    │
│  │ ✓/✗ feedback + explanation       │    │
│  └──────────────────────────────────┘    │
│  ...                                     │
│                                          │
│  [Score summary when all answered]       │
│                                          │
└──────────────────────────────────────────┘
```

### Design Requirements

- **Dark theme** — `#0d0f14` background, off-white text
- **Max content width**: 800px, centered with auto margins
- **Fonts** via Google Fonts: IBM Plex Mono for code/terms/labels, DM Serif Display for headings, Syne for body
- **Sticky header bar**: page title left, URL as clickable badge right (opens in new tab)
- **Terminology table**: alternating row shading, monospace term column, distinct header row
- **Step-by-step section**: numbered cards with WHY/WATCH OUT badges
- **Section labels**: small uppercase monospace labels above each section

### Interactive Quiz Requirements

Each question card must be fully interactive using vanilla JS (no libraries). Implement exactly:

**Option selection:**
- Each option is a clickable `<div>` or `<button>` with `data-option="A"` (B, C, D)
- Clicking an option selects it — adds `selected` class, deselects others
- Selected state: left border highlight in gold (`--gold`), background tint, letter badge turns gold
- Options are NOT disabled before checking — user can change selection freely

**Check Answer button:**
- Each card has a "Check Answer" button, disabled until an option is selected
- On click: locks all options (pointer-events: none), reveals inline feedback
- Correct: card gets green left border, correct option highlighted green, shows ✓ + explanation
- Wrong: selected option highlighted red, correct option highlighted green, shows ✗ + explanation
- Button changes to "✓ Answered" and becomes disabled after checking

**Inline feedback:**
- Hidden `<div class="q-feedback">` revealed after checking
- Contains: result icon (✓ or ✗), one-line verdict, full explanation text
- Correct feedback: green accent; Wrong feedback: red accent with correct answer called out

**Score tracker:**
- Sticky or fixed score counter in the header or quiz section: "X / N answered · Y correct"
- Updates live as each question is checked
- When all questions answered: show a summary card at the bottom of the quiz section
  - "You scored Y/N" in DM Serif Display
  - Short contextual message: 90–100% = "Excellent", 70–89% = "Good", <70% = "Review recommended"

**CSS classes to implement:**
```css
.q-option               /* base option row */
.q-option.selected      /* user has clicked this option */
.q-option.correct       /* revealed as correct answer */
.q-option.wrong         /* user's wrong selection */
.q-feedback             /* hidden by default, shown after check */
.q-feedback.correct     /* green styling */
.q-feedback.wrong       /* red styling */
.check-btn              /* Check Answer button */
.check-btn:disabled     /* before selection / after answered */
```

**JS — embed a `<script>` block at the bottom of the body with this logic:**
```js
// Per card: track selected option, correct answer, answered state
// selectOption(cardEl, letter) — handle option click
// checkAnswer(cardEl) — validate, apply classes, show feedback, update score
// updateScore() — recount and update the header tally + show summary if all done
```

### Output Order

1. Framing sentence (below header)
2. Key Terminology table
3. Logic Flow prose
4. Step-by-Step (only if procedural content detected)
5. Interactive Quiz cards (with JS)
6. Score summary (rendered by JS when all questions answered)

No preamble in chat — just say "Here's your learning session:" and present the file.

---

## Edge Cases

- **Page behind login / paywalled**: Tell the user, ask them to paste the text
- **Very short page (< 300 words)**: Condensed terminology + logic section, 3 questions minimum, skip Step 4b
- **Non-English content**: Proceed in the content's language unless user asks for English
- **Multi-page docs**: Focus on the fetched page only; offer to continue with linked sections if relevant
- **Code-heavy pages (tutorials, API docs)**: Include at least 2 quiz questions referencing specific code patterns or API behavior shown on the page; Step 4b almost always applies here