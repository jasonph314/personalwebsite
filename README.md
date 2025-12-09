# jasonhong.net

Personal portfolio website built with Svelte, styled with a terminal aesthetic and the Rainy Night color theme.

## Features

- Terminal-style interface with clickable navigation
- Custom "Rainy Night" color theme (moody purples/blues)
- Responsive design
- Markdown blog system
- JSON-driven projects showcase
- Advent of Code solutions with embedded code
- Clean, Monkeytype-inspired aesthetics

## Commands

| Command | Description |
|---------|-------------|
| `about` | Learn about me |
| `projects` | View my projects |
| `blog` | Read blog posts |
| `resume` | Open resume PDF |
| `aoc` | Advent of Code solutions |
| `contact` | Contact information |
| `github` | Open GitHub profile |
| `linkedin` | Open LinkedIn profile |
| `email` | Send an email |
| `help` | List all commands |
| `theme ls/set` | Change color theme |

## Content Management

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions on:
- Adding blog posts
- Adding projects
- Adding Advent of Code solutions
- Updating your resume

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
public/
  blog/
    index.json          # Blog post metadata
    posts/              # Markdown blog posts
  projects/
    index.json          # Project metadata
  aoc/
    index.json          # AoC years metadata
    2024/               # Solutions by year
      01.md, 02.md...
  resume.pdf            # Resume file
src/
  components/           # Svelte components
  utils/commands.ts     # Terminal commands
  stores/theme.ts       # Theme state
```

## Deployment

Deployed on Vercel with custom domain `jasonhong.net`.

## Credits

Based on [m4tt72/terminal](https://github.com/m4tt72/terminal) template.
Color theme inspired by [omarchy-rainynight-theme](https://github.com/atif-1402/omarchy-rainynight-theme).
