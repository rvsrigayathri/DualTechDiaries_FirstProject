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
