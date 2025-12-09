import themes from "../../themes.json";
import { theme } from "../stores/theme";

export const commands: Record<string, (args: string[]) => Promise<string> | string> = {
  help: () => `Help
────

Navigation
  about      Learn about me
  projects   View my projects
  blog       Read blog posts
  setup      My development setup
  aoc        Advent of Code solutions
  resume     View my resume

Contact
  contact    View contact info
  github     Open GitHub profile
  linkedin   Open LinkedIn profile
  email      Send me an email

System
  help       Show this help message
  clear      Clear the screen
  banner     Show welcome banner
  theme      Change color theme`,

  // ============ ABOUT ============
  about: () => `About
─────

Hi, I'm Jason Hong (jasonph).

Currently a sophomore at MIT studying Computer Science 
and Engineering. I'm a generalist at heart and enjoy 
finding intersections between different fields.

On my free time, I enjoy playing or watching basketball.

Location: Cambridge, MA`,

  // ============ PROJECTS ============
  // Projects are loaded from /projects/index.json by ContentView
  projects: () => `Projects
────────

`,

  // ============ BLOG ============
  blog: async (args: string[]) => {
    if (args.length === 0) {
      try {
        const response = await fetch('/blog/index.json');
        if (!response.ok) {
          return `Blog
────

No posts yet. Check back soon!`;
        }
        const posts = await response.json();
        
        if (posts.length === 0) {
          return `Blog
────

No posts yet. Check back soon!`;
        }

        let output = `Blog
────

`;
        posts.forEach((post: { slug: string; title: string; date: string; description: string }, index: number) => {
          output += `[${index + 1}] ${post.title}\n`;
          output += `    ${post.date} - ${post.description}\n\n`;
        });

        return output;
      } catch {
        return `Blog
────

No posts yet. Check back soon!`;
      }
    }

    // Read specific blog post
    const slug = args[0];
    try {
      const response = await fetch(`/blog/posts/${slug}.md`);
      if (!response.ok) {
        return `Post '${slug}' not found.`;
      }
      const content = await response.text();
      return content;
    } catch {
      return `Error loading post '${slug}'.`;
    }
  },

  // ============ RESUME ============
  resume: () => {
    // Return empty - the ContentView component handles the PDF embed
    return `Resume
──────

`;
  },

  // ============ SETUP ============
  // Note: The actual neofetch-style display is handled by ContentView.svelte
  setup: () => `Setup
─────

`,

  // ============ ADVENT OF CODE ============
  // AoC solutions are loaded from /aoc/index.json by ContentView
  aoc: () => `Advent of Code
──────────────

`,

  // ============ CONTACT ============
  contact: () => `Contact
───────

Email     jasonph@mit.edu
GitHub    github.com/jasonph314
LinkedIn  linkedin.com/in/jasonphong

Click the icons in the navigation bar or press / and 
type 'email', 'github', or 'linkedin' to open directly.`,

  // ============ SOCIAL LINKS ============
  github: () => {
    window.open('https://github.com/jasonph314', '_blank');
    return 'Opening GitHub...';
  },

  linkedin: () => {
    window.open('https://www.linkedin.com/in/jasonphong/', '_blank');
    return 'Opening LinkedIn...';
  },

  email: () => {
    window.open('mailto:jasonph@mit.edu');
    return 'Opening email client...';
  },

  // ============ SYSTEM ============
  clear: () => {
    return '';
  },

  banner: () => `Jason Hong

CS @ MIT
`,

  theme: (args: string[]) => {
    const usage = `Theme
─────

Usage: theme [command]

Commands:
  ls          List all available themes
  set [name]  Set theme to [name]

Examples:
  theme ls
  theme set dracula`;

    if (args.length === 0) {
      return usage;
    }

    switch (args[0]) {
      case "ls": {
        const themeList = themes.map((t) => t.name.toLowerCase()).join(", ");
        return `Theme
─────

Available themes:
${themeList}

Current: RainyNight`;
      }

      case "set": {
        if (args.length !== 2) {
          return usage;
        }

        const selectedTheme = args[1];
        const t = themes.find((t) => t.name.toLowerCase() === selectedTheme.toLowerCase());

        if (!t) {
          return `Theme '${selectedTheme}' not found. Try 'theme ls' to see all available themes.`;
        }

        theme.set(t);
        return `Theme set to ${t.name}`;
      }

      default: {
        return usage;
      }
    }
  },

  // ============ MISC ============
  date: () => new Date().toLocaleString(),
  
  whoami: () => "guest",
  
  hostname: () => "jasonhong.net",

  echo: (args: string[]) => args.join(" "),

  // Easter eggs
  sudo: (args: string[]) => {
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    return `Permission denied: nice try though :)`;
  },

  vi: () => `why use vi? try 'emacs'`,
  vim: () => `why use vim? try 'emacs'`,
  emacs: () => `why use emacs? try 'vim'`,
  neofetch: () => `neofetch
────────

       /\\          guest@jasonhong.net
      /  \\         ───────────────────
     /\\   \\        OS: Omarchy (Arch-based)
    /  ..  \\       Editor: Neovim
   /  '  '  \\      Keyboard: Kinesis 360
  / ..'  '.. \\     Theme: RainyNight
 /_'        '_\\    
                   CS @ MIT`,
};
