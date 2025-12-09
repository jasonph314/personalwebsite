import packageJson from "../../package.json";
import themes from "../../themes.json";
import { history } from "../stores/history";
import { theme } from "../stores/theme";

export const commands: Record<string, (args: string[]) => Promise<string> | string> = {
  help: () => {
    const categories = {
      "Navigation": ["about", "projects", "blog", "aoc", "resume"],
      "Contact": ["github", "linkedin", "email", "contact"],
      "System": ["help", "clear", "banner", "theme"],
    };

    let output = "Available commands:\n\n";

    for (const [category, cmds] of Object.entries(categories)) {
      output += `${category}:\n`;
      output += cmds.map((cmd) => `  ${cmd}`).join("\n");
      output += "\n\n";
    }

    output += 'Tip: Use the navigation bar above or type commands directly.';

    return output;
  },

  // ============ ABOUT ============
  about: () => `
  Hi, I'm Jason Hong (jasonph)

  Currently a sophomore at MIT studying Computer Science 
  and Engineering. I'm a generalist at heart and enjoy 
  finding intersections between different fields.

  On my free time, I enjoy playing or watching basketball.

  Location: Cambridge, MA

  Type 'projects' to see my work, or 'contact' to get in touch.
`,

  // ============ PROJECTS ============
  projects: () => `
  Projects
  --------

  [1] AI Drone Project
      Details coming soon...

  [2] More projects TBD
      Check back later for updates!

  ---
  Want to collaborate? Type 'contact' to reach out.
`,

  // ============ BLOG ============
  blog: async (args: string[]) => {
    if (args.length === 0) {
      // List all blog posts
      try {
        const response = await fetch('/blog/index.json');
        if (!response.ok) {
          return `
  Blog
  ----

  No posts yet. Check back soon!

  ---
  Type 'blog <slug>' to read a specific post.
`;
        }
        const posts = await response.json();
        
        if (posts.length === 0) {
          return `
  Blog
  ----

  No posts yet. Check back soon!
`;
        }

        let output = `
  Blog
  ----

`;
        posts.forEach((post: { slug: string; title: string; date: string; description: string }, index: number) => {
          output += `  [${index + 1}] ${post.title}\n`;
          output += `      ${post.date} - ${post.description}\n`;
          output += `      > blog ${post.slug}\n\n`;
        });

        output += `  ---\n  Type 'blog <slug>' to read a post.`;
        return output;
      } catch {
        return `
  Blog
  ----

  No posts yet. Check back soon!
`;
      }
    }

    // Read specific blog post
    const slug = args[0];
    try {
      const response = await fetch(`/blog/posts/${slug}.md`);
      if (!response.ok) {
        return `Post '${slug}' not found. Type 'blog' to see all posts.`;
      }
      const content = await response.text();
      return `\n${content}`;
    } catch {
      return `Error loading post '${slug}'. Type 'blog' to see all posts.`;
    }
  },

  // ============ RESUME ============
  resume: () => {
    window.open('/resume.pdf', '_blank');
    return 'Opening resume in new tab...';
  },

  // ============ ADVENT OF CODE ============
  aoc: () => `
  Advent of Code Solutions
  ------------------------

  Coming soon!

  I'll be adding my solutions for various years here.
  Check back later for updates.

  ---
  Learn more: https://adventofcode.com
`,

  // ============ CONTACT ============
  contact: () => `
  Contact
  -------

  Email:    jasonph@mit.edu
  GitHub:   github.com/jasonph314
  LinkedIn: linkedin.com/in/jasonphong

  ---
  Type 'email', 'github', or 'linkedin' to open directly.
`,

  // ============ SOCIAL LINKS ============
  github: () => {
    window.open('https://github.com/jasonph314', '_blank');
    return 'Opening GitHub profile...';
  },

  linkedin: () => {
    window.open('https://www.linkedin.com/in/jasonphong/', '_blank');
    return 'Opening LinkedIn profile...';
  },

  email: () => {
    window.open('mailto:jasonph@mit.edu');
    return 'Opening email client...';
  },

  // ============ SYSTEM ============
  clear: () => {
    history.set([]);
    return "";
  },

  banner: () => `
       _                         _   _                   
      | | __ _ ___  ___  _ __   | | | | ___  _ __   __ _ 
   _  | |/ _\` / __|/ _ \\| '_ \\  | |_| |/ _ \\| '_ \\ / _\` |
  | |_| | (_| \\__ \\ (_) | | | | |  _  | (_) | | | | (_| |
   \\___/ \\__,_|___/\\___/|_| |_| |_| |_|\\___/|_| |_|\\__, |
                                                   |___/ 
  
  MIT CS '27 | Generalist | Builder

  Navigate using the buttons above, or type 'help' for commands.
`,

  theme: (args: string[]) => {
    const usage = `Usage: theme [args].
    [args]:
      ls: list all available themes
      set: set theme to [theme]

    [Examples]:
      theme ls
      theme set rainynight
    `;
    if (args.length === 0) {
      return usage;
    }

    switch (args[0]) {
      case "ls": {
        let result = themes.map((t) => t.name.toLowerCase()).join(", ");
        result += `\n\nCurrent theme: RainyNight (default)`;
        return result;
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
};
