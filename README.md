# jasonhong.net

Personal website — Projects, Blog, Resume.

## Stack

- **Python + Flask** — lightweight server
- **Mistletoe** — markdown to HTML with math & syntax highlighting extensions
- **KaTeX** — math rendering (inline `$...$`, display `$$...$$`)
- **highlight.js** — code syntax highlighting
- **CAT-SOOP diagrams.js** — ASCII art diagrams to SVG

## Development

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py           # runs on http://localhost:8080
```

## Content Management

All content lives in `content/` as Markdown files:

- `content/index.md` — homepage
- `content/projects.md` — projects intro (project cards from `content/projects/index.json`)
- `content/blog.md` — blog intro (post list from `content/blog/index.json`)
- `content/blog/posts/*.md` — individual blog posts
- `content/resume.md` — resume page
- `content/aoc.md` — Advent of Code intro

### Adding a Blog Post

1. Write a `.md` file in `content/blog/posts/`
2. Add an entry to `content/blog/index.json`:
   ```json
   { "slug": "my-post", "title": "My Post", "date": "2026-05-20", "description": "A great post" }
   ```

### Adding a Project

Add an entry to `content/projects/index.json`:
```json
{ "slug": "my-project", "title": "My Project", "description": "...", "tags": ["Python", "ML"], "featured": true }
```

## Deployment

Deployed on **Vercel** via `vercel.json` + `runtime.txt`.
