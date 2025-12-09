# Content Management Guide

This guide explains how to add and update content on jasonhong.net.

## Table of Contents

- [Adding a Blog Post](#adding-a-blog-post)
- [Adding a Project](#adding-a-project)
- [Adding Advent of Code Solutions](#adding-advent-of-code-solutions)
- [Updating Your Resume](#updating-your-resume)

---

## Adding a Blog Post

### Step 1: Create the Markdown File

Create a new `.md` file in `public/blog/posts/`:

```
public/blog/posts/my-new-post.md
```

Write your post using standard Markdown:

```markdown
# Post Title

Introduction paragraph...

## Section Heading

Content here...

- Bullet points
- Work great

```code
// Code blocks too
```
```

### Step 2: Add to Index

Add an entry to `public/blog/index.json`:

```json
[
  {
    "slug": "my-new-post",
    "title": "My New Post Title",
    "date": "2025-01-15",
    "description": "A brief description of the post"
  }
]
```

**Fields:**
- `slug` - Must match the filename (without `.md`)
- `title` - Displayed in the blog list
- `date` - Format: `YYYY-MM-DD`
- `description` - Short summary shown in the list

### Step 3: Test

```bash
npm run dev
```

Navigate to the blog section and click your new post.

---

## Adding a Project

### Step 1: Add to Index

Edit `public/projects/index.json`:

```json
[
  {
    "slug": "my-project",
    "title": "My Project Name",
    "description": "Brief description of the project",
    "tags": ["Svelte", "TypeScript", "AI"],
    "github": "https://github.com/username/repo",
    "demo": "https://myproject.com",
    "featured": true
  }
]
```

**Fields:**
- `slug` - Unique identifier
- `title` - Project name
- `description` - Short summary
- `tags` - Array of technology tags
- `github` - (optional) Link to source code
- `demo` - (optional) Link to live demo
- `featured` - (optional) Set to `true` to highlight

### Step 2: Add Detailed Description (Optional)

For a longer project description, create `public/projects/my-project.md`:

```markdown
# My Project Name

Detailed description of the project...

## Features

- Feature 1
- Feature 2

## Technical Details

Built with...
```

---

## Adding Advent of Code Solutions

### Step 1: Set Up the Year

If this is a new year, add it to `public/aoc/index.json`:

```json
[
  {
    "year": 2024,
    "days": [1, 2, 3, 5, 10]
  },
  {
    "year": 2023,
    "days": [1, 2, 3, 4, 5, 6, 7]
  }
]
```

The `days` array lists which days have solutions.

### Step 2: Create the Solution File

Create a file at `public/aoc/YYYY/DD.md`:

```
public/aoc/2024/01.md
public/aoc/2024/02.md
```

Use this format:

```markdown
# Day 1: Historian Hysteria

[Problem Link](https://adventofcode.com/2024/day/1)

## Part 1

Brief explanation of your approach...

```python
def solve_part1(data):
    # Your solution code
    return answer
```

## Part 2

Explanation of part 2 approach...

```python
def solve_part2(data):
    # Your solution code
    return answer
```

## Thoughts

Any reflections on the problem...
```

### Step 3: Create Year Directory

```bash
mkdir -p public/aoc/2024
```

---

## Updating Your Resume

Simply replace the PDF file:

```bash
cp ~/path/to/new/resume.pdf public/resume.pdf
```

The resume viewer will automatically use the new file.

---

## File Structure Reference

```
public/
├── blog/
│   ├── index.json              # Blog metadata
│   └── posts/
│       ├── my-first-post.md
│       └── another-post.md
├── projects/
│   ├── index.json              # Projects metadata
│   ├── project-1.md            # (optional) detailed descriptions
│   └── project-2.md
├── aoc/
│   ├── index.json              # AoC years/days metadata
│   ├── 2024/
│   │   ├── 01.md
│   │   ├── 02.md
│   │   └── ...
│   └── 2023/
│       └── ...
└── resume.pdf
```

---

## Tips

- **Preview changes locally** with `npm run dev` before deploying
- **Images** can be placed in `public/images/` and referenced as `/images/filename.png`
- **Code highlighting** works automatically in markdown code blocks
- **Dates** should use `YYYY-MM-DD` format for consistent sorting
