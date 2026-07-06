# Contexts

Files in this folder are loaded as context by the Claude Code agent at the start of every session in this project. Use them for stable, high-signal documentation that helps an agent (or a new developer) start aligned.

What goes here:

- Backend integration guides (when a frontend project consumes this API).
- Architecture overviews specific to this project.
- Domain glossaries when the field is non-obvious.
- Decision summaries that change rarely.

What does NOT go here:

- Ephemeral notes (use `.claude/scratch/` instead).
- Per-task progress (use `JOURNAL.md` at the project root).
- Standards (those live in `.tts/`).
