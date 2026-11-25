# Development Guide: Resume and Portfolio Generator

Build one app that takes a person's LinkedIn and Naukri PDFs, merges them into one profile, and generates:

- **Desired resume:** the strongest general version of the person.
- **Required resume:** a version tailored to a pasted job description, plus a gap report.
- **Portfolio website:** built from the same profile.

This guide is written to be used inside **Google Antigravity**. Keep it in the project root so the agent can read it.

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Backend | Java 21 + Spring Boot 3 (Maven) | Your chosen backend language |
| Frontend | React + Vite | Fast setup, easy to preview |
| PDF reading | Apache PDFBox | Extracts text from uploaded PDFs |
| AI model | Gemini or Claude API, behind one interface | Parses, analyzes, and rewrites profile content |
| Resume PDF output | HTML template (Thymeleaf) + OpenHTMLtoPDF | Easy to style, produces PDF |
| Portfolio output | Static HTML/CSS from a template | Simple to preview, download, or host |
| Database | H2 (file mode) first, PostgreSQL later | Start simple |
| Tests | JUnit 5, Mockito, Spring Boot Test, Vitest | Standard for Java and React |

Keep the AI provider behind an interface (`AiClient`) so you can switch providers or mock it in tests.

---

## 2. Core Design Rule

**One profile in the middle, many outputs.**

```
LinkedIn PDF ─┐
              ├─> Extract text -> Parse to JSON -> Merge -> Analyze -> Profile
Naukri PDF ───┘                                                          │
                                  ┌──────────────────────────────────────┼───────────────┐
                                  v                                      v               v
                          Desired resume                        Required resume     Portfolio site
                                                                + gap report
                                                         (needs job description)
```

**Honesty rule (must be enforced in code and tests):** the AI may only reorder, shorten, and reword facts that exist in the profile. It must never invent skills, jobs, dates, or degrees. Suggestions for things to add must be marked `needsUserConfirmation: true`.

---

## 3. Project Structure

```
resume-portfolio-app/
├── development_guide.md
├── AGENTS.md                  # rules for the agent (see section 5)
├── .agent/
│   ├── rules/
│   └── workflows/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/yourname/resumeapp/
│       │   ├── ResumeAppApplication.java
│       │   ├── controller/    # REST endpoints
│       │   ├── service/       # extraction, parsing, merging, analysis, generation
│       │   ├── ai/            # AiClient interface + implementation
│       │   ├── model/         # Profile, Experience, Education, Skill, GapReport
│       │   ├── template/      # resume and portfolio templates
│       │   └── config/
│       └── test/java/...
├── frontend/
│   ├── package.json
│   └── src/
│       ├── pages/             # Upload, ProfileReview, ResumePreview, PortfolioPreview
│       ├── components/
│       └── api/
└── samples/                   # test PDFs (use fake data only)
```

---

## 4. Antigravity Setup

1. Install Antigravity from the official download page and sign in with your Google account.
2. Open the `resume-portfolio-app` folder as your workspace.
3. Put this guide and `AGENTS.md` in the project root.
4. Settings to check before the first prompt (menu names can change between versions):
   - **Review policy:** start with the agent asking before it applies changes. Switch to more autonomy only after you trust its behavior.
   - **Terminal command policy:** require approval for commands at first.
5. Use **Planning mode** for multi-file tasks (each stage below). Use **Fast mode** only for small edits.
6. Always read the agent's plan before it starts, and read the diff before you accept it.

Note: Antigravity changes quickly. If a menu or feature is named differently in your version, follow the in-app labels.

---

## 5. Agent Rules (`AGENTS.md`)

Create `AGENTS.md` in the project root with this content (you can also copy it into `.agent/rules/`):

```markdown
# Project Rules

## Project
Resume and portfolio generator. Backend: Java 21, Spring Boot 3, Maven. Frontend: React + Vite.

## Code
- Follow the package structure in development_guide.md.
- Controllers stay thin. Logic goes in services.
- All AI calls go through the AiClient interface. Never call an AI SDK directly from a service.
- Never hardcode API keys. Read them from environment variables.
- Use clear names and short methods. Add comments only where logic is not obvious.

## Honesty rule
- Generated resume content must come only from the stored profile.
- Never invent skills, employers, dates, degrees, or numbers.
- Suggested additions must be flagged needsUserConfirmation = true.

## Testing
- Every service gets unit tests.
- Mock AiClient in tests. Tests must not call real AI APIs.
- Run `mvn test` (backend) and `npm test` (frontend) before saying a task is done.

## Privacy
- Uploaded PDFs contain personal data. Do not log their contents.
- Use fake data in /samples and in tests.
- Delete uploaded files after processing unless the user saves the profile.

## Workflow
- Make a plan first and wait for approval on tasks touching more than 3 files.
- Work on one stage at a time. Do not start the next stage unprompted.
```

---

## 6. Development Stages

Do one stage at a time. Each stage ends with working code and passing tests.

### Stage 1: Project setup
**Goal:** backend and frontend both run and can talk to each other.

Tasks:
- Create the Spring Boot project with Web, Validation, Thymeleaf, and H2 dependencies.
- Create the React + Vite project.
- Add a `GET /api/health` endpoint and show its result on the frontend.
- Enable CORS for the frontend dev server.

Done when: opening the frontend shows "Backend is running".

Tests: one Spring Boot test for the health endpoint.

### Stage 2: PDF upload and text extraction
**Goal:** upload a PDF and get its text back.

Tasks:
- `POST /api/profile/upload` accepting one or two PDF files (LinkedIn, Naukri) with a source label.
- Validate file type and size (for example, PDF only, max 5 MB).
- `PdfTextExtractor` service using PDFBox.
- Detect scanned PDFs with almost no text and return a clear error.

Done when: uploading a sample PDF returns extracted text.

Tests: valid PDF, non-PDF file, empty PDF, oversized file, scanned PDF.

### Stage 3: Profile parsing
**Goal:** turn raw text into a structured `Profile`.

Tasks:
- Define the `Profile` model: name, headline, summary, contact, skills, experience, education, projects, certifications, source.
- Write the prompt that asks the AI to return only JSON in this shape.
- Create `AiClient` interface and a real implementation.
- `ProfileParserService` that calls the AI, validates the JSON, and handles bad responses with a retry.

Done when: a sample LinkedIn PDF produces a correct `Profile` JSON.

Tests: mock `AiClient` with valid JSON, invalid JSON, and partial JSON.

### Stage 4: Merge two sources
**Goal:** combine LinkedIn and Naukri profiles into one.

Tasks:
- `ProfileMergeService` that matches entries by company and date overlap.
- Combine skills (remove duplicates, case-insensitive).
- When fields conflict (different titles or dates), keep both and mark a `conflict` for the user to resolve.
- Frontend page `ProfileReview` where the user fixes conflicts and edits details.

Done when: two sample PDFs produce one merged profile with conflicts shown.

Tests: duplicate skills, same job with different titles, jobs in only one source, no overlap.

### Stage 5: Profile analysis
**Goal:** give the user feedback on their profile.

Tasks:
- `ProfileAnalysisService` returns strengths, weak bullet points (no results or numbers), missing sections, and the roles the profile fits best.
- Show the analysis on the review page.

Tests: mock AI response, check the response is parsed and displayed.

### Stage 6: Desired resume
**Goal:** generate the general best resume as a PDF.

Tasks:
- Create a clean, single-column, ATS-friendly Thymeleaf template (no tables for layout, no images for text).
- `ResumeGeneratorService` that rewrites the summary and bullets using the AI, then fills the template.
- Convert HTML to PDF with OpenHTMLtoPDF.
- `GET /api/resume/desired` returns the PDF.
- Frontend preview and download button.

Done when: you can download a good-looking PDF resume.

Tests: honesty check (see section 8), template renders all sections, PDF is not empty.

### Stage 7: Portfolio generation
**Goal:** generate a portfolio site from the same profile.

Tasks:
- Template sections: Hero, About, Skills, Experience, Projects, Contact.
- Generate static HTML/CSS and offer a ZIP download.
- Add a live preview page in the frontend.
- Show LinkedIn and Naukri links as buttons.

Tests: all sections present, missing sections hidden cleanly, links are correct.

### Stage 8: Job tailoring (required resume)
**Goal:** tailor the resume to a job description and show gaps.

Tasks:
- Add a job description text box (paste only at first).
- `JobAnalysisService` extracts must-have skills, nice-to-have skills, and keywords.
- Generate the required resume: reorder experience and skills, rephrase bullets using the job's keywords, using only profile facts.
- `GapReport`: skills the job wants that the profile does not show, with a `needsUserConfirmation` flag.
- Show the gap report beside the resume.

Tests: honesty check again, missing skill appears in the gap report and not in the resume, empty job description handled.

### Stage 9: Polish and deployment
- Loading states, clear error messages, and mobile layout.
- Rate limiting and upload limits.
- Save profiles (optional): add login and a database.
- Deploy the backend and frontend (choose a host when you reach this stage).

---

## 7. Starter Prompts for Antigravity

Paste these one at a time, in Planning mode. Review each plan before approving.

**Stage 1**
```
Read development_guide.md and AGENTS.md. Complete Stage 1 only: create the Spring Boot backend
and React + Vite frontend with the folder structure from section 3, add GET /api/health, and
show its result on the frontend. Add a test for the endpoint. Show me your plan first.
```

**Stage 2**
```
Complete Stage 2 from development_guide.md: PDF upload endpoint, validation, and PdfTextExtractor
using PDFBox, including tests for the cases listed. Do not start Stage 3.
```

**Stage 3**
```
Complete Stage 3: the Profile model, the AiClient interface, a Gemini implementation reading the
key from an environment variable, and ProfileParserService with retry on invalid JSON. Mock
AiClient in all tests.
```

For later stages, use the same pattern: *"Complete Stage N from development_guide.md only. Show the plan first. Add the tests listed."*

---

## 8. Testing Guide

### Test types
- **Unit tests:** parsing, merging, template filling. Mock the AI.
- **Integration tests:** upload endpoint to extracted text, profile to PDF.
- **End-to-end test:** upload sample PDFs, then download the resume and confirm the PDF is created.
- **Frontend tests:** upload form, review page, preview page.

### Sample data (put in `/samples`, fake people only)
- A complete LinkedIn export.
- A complete Naukri export.
- A profile with missing sections.
- A fresher profile (no work experience).
- A long profile (10+ years).
- A scanned PDF with no extractable text.
- A PDF with unusual formatting or multiple columns.

### The honesty check (most important test)
For every generated resume:
1. Extract all skills, companies, dates, and degrees from the output.
2. Confirm each one exists in the source profile.
3. Fail the test if anything is new.

Also test with a job description that asks for skills the profile lacks, and confirm those skills appear only in the gap report.

### Manual checklist before each stage is done
- [ ] `mvn test` passes
- [ ] `npm test` passes
- [ ] App runs from a clean start
- [ ] Tried at least one messy input
- [ ] No personal data or API keys in logs or committed files

---

## 9. Security and Privacy

- Store the AI API key in an environment variable. Add `.env` to `.gitignore`.
- Resumes contain names, phone numbers, and emails. Never log them.
- Delete uploaded PDFs after processing unless the user chooses to save their profile.
- Limit upload size and file type.
- Tell users clearly that their profile text is sent to an AI provider.
- Do not scrape LinkedIn or Naukri links. Use uploaded PDFs only.

---

## 10. Working Habits in Antigravity

- Ask for a plan, read it, then approve.
- Keep each task to one stage so the diff stays reviewable.
- Commit to Git after every working stage.
- If the agent goes off track, stop it and give a narrower instruction instead of adding more instructions on top.
- When something fails, paste the exact error and the relevant file into the next prompt.
- Update `AGENTS.md` whenever the agent repeats a mistake, so it stops repeating it.

---

## 11. Decisions to Make Early

1. **AI provider:** Gemini or Claude for parsing and rewriting.
2. **Accounts:** no login at first (upload, generate, download), or add login in Stage 9.
3. **Portfolio hosting:** ZIP download only, or hosted links.
4. **Resume design:** one template first, more later.
