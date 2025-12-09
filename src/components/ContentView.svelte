<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { theme } from '../stores/theme';
  import { marked } from 'marked';

  export let content: string = '';
  export let command: string = '';

  const dispatch = createEventDispatcher();

  // Check if this is the banner
  $: isBanner = command === 'banner';
  
  // Check if this is the resume (embedded PDF)
  $: isResume = command === 'resume';

  // Check if this is the setup page (neofetch style)
  $: isSetup = command === 'setup';

  // Check if this is the blog list
  $: isBlog = command === 'blog';

  // Check if this is a blog post (rendered markdown)
  $: isBlogPost = command === 'blog-post';

  // Check if this is the projects list
  $: isProjects = command === 'projects';

  // Check if this is a project detail (rendered markdown)
  $: isProjectDetail = command === 'project-detail';

  // Check if this is the AoC page
  $: isAoC = command === 'aoc';

  // Check if this is an AoC solution (rendered markdown)
  $: isAoCDay = command === 'aoc-day';

  // Render markdown content for blog posts, project details, and AoC solutions
  $: renderedMarkdown = (isBlogPost || isProjectDetail || isAoCDay) ? marked(content) : '';

  // Blog posts from index
  interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description: string;
  }

  let blogPosts: BlogPost[] = [];

  // Projects from index
  interface Project {
    slug: string;
    title: string;
    description: string;
    tags?: string[];
    github?: string;
    demo?: string;
    featured?: boolean;
  }

  let projects: Project[] = [];

  // AoC years and solutions
  interface AoCYear {
    year: number;
    days: number[];
  }

  let aocYears: AoCYear[] = [];
  let selectedAoCYear: number | null = null;

  // Load blog posts when blog command is active
  $: if (isBlog) {
    loadBlogIndex();
  }

  // Load projects when projects command is active
  $: if (isProjects) {
    loadProjectsIndex();
  }

  // Load AoC data when aoc command is active
  $: if (isAoC) {
    loadAoCIndex();
  }

  async function loadBlogIndex() {
    try {
      const response = await fetch('/blog/index.json');
      if (response.ok) {
        blogPosts = await response.json();
      }
    } catch (e) {
      blogPosts = [];
    }
  }

  async function loadProjectsIndex() {
    try {
      const response = await fetch('/projects/index.json');
      if (response.ok) {
        projects = await response.json();
      }
    } catch (e) {
      projects = [];
    }
  }

  async function loadAoCIndex() {
    try {
      const response = await fetch('/aoc/index.json');
      if (response.ok) {
        aocYears = await response.json();
        // Select most recent year by default
        if (aocYears.length > 0 && !selectedAoCYear) {
          selectedAoCYear = aocYears[0].year;
        }
      }
    } catch (e) {
      aocYears = [];
    }
  }

  async function handleBlogPostClick(slug: string) {
    try {
      const response = await fetch(`/blog/posts/${slug}.md`);
      if (response.ok) {
        const postContent = await response.text();
        dispatch('blogpost', { content: postContent, slug });
      }
    } catch (e) {
      console.error('Failed to load blog post:', e);
    }
  }

  async function handleProjectClick(project: Project) {
    // Try to load detailed markdown, otherwise show basic info
    try {
      const response = await fetch(`/projects/${project.slug}.md`);
      if (response.ok) {
        const projectContent = await response.text();
        dispatch('projectdetail', { content: projectContent, slug: project.slug });
      } else {
        // No detailed markdown, create basic content
        let basicContent = `# ${project.title}\n\n${project.description}\n\n`;
        if (project.tags && project.tags.length > 0) {
          basicContent += `**Technologies:** ${project.tags.join(', ')}\n\n`;
        }
        if (project.github) {
          basicContent += `**GitHub:** [View Source](${project.github})\n\n`;
        }
        if (project.demo) {
          basicContent += `**Demo:** [Live Demo](${project.demo})\n\n`;
        }
        dispatch('projectdetail', { content: basicContent, slug: project.slug });
      }
    } catch (e) {
      console.error('Failed to load project:', e);
    }
  }

  function selectAoCYear(year: number) {
    selectedAoCYear = year;
  }

  async function handleAoCDayClick(year: number, day: number) {
    try {
      const paddedDay = day.toString().padStart(2, '0');
      const response = await fetch(`/aoc/${year}/${paddedDay}.md`);
      if (response.ok) {
        const dayContent = await response.text();
        dispatch('aocday', { content: dayContent, year, day });
      }
    } catch (e) {
      console.error('Failed to load AoC solution:', e);
    }
  }

  // Parse content into title and body
  $: parsed = parseContent(content);

  // Home page quick nav buttons
  const homeButtons = [
    { label: 'About', command: 'about' },
    { label: 'Projects', command: 'projects' },
    { label: 'Resume', command: 'resume' },
    { label: 'Contact', command: 'contact' },
  ];

  function handleButtonClick(cmd: string) {
    dispatch('command', { command: cmd });
  }

  function parseContent(text: string) {
    if (!text) return { title: '', body: '' };
    
    const lines = text.split('\n');
    
    // For banner, don't parse - just return as body
    if (isBanner) {
      return { title: '', body: text };
    }

    // Find the title (first non-empty line) and separator
    let titleIndex = -1;
    let separatorIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && titleIndex === -1) {
        titleIndex = i;
      } else if (titleIndex !== -1 && (line.match(/^[-─=]+$/) || line.match(/^-+$/))) {
        separatorIndex = i;
        break;
      }
    }

    if (titleIndex !== -1 && separatorIndex !== -1) {
      const title = lines[titleIndex].trim();
      const body = lines.slice(separatorIndex + 1).join('\n');
      return { title, body };
    }

    // Fallback: no clear title/separator structure
    return { title: '', body: text };
  }
</script>

<div class="content-view">
  {#if isBanner}
    <!-- Banner: Large name centered with quick nav buttons -->
    <div class="banner-container">
      <div class="banner-name" style={`color: ${$theme.purple};`}>
        <h1 class="name-text">Jason Hong</h1>
        <p class="name-subtitle" style={`color: ${$theme.foreground};`}>CS @ MIT</p>
      </div>
      
      <!-- Quick nav buttons -->
      <div class="home-buttons">
        {#each homeButtons as btn}
          <button
            class="home-btn"
            style={`color: ${$theme.foreground}; border-color: ${$theme.brightBlack};`}
            on:click={() => handleButtonClick(btn.command)}
            on:mouseenter={(e) => {
              e.currentTarget.style.borderColor = $theme.purple;
              e.currentTarget.style.color = $theme.purple;
            }}
            on:mouseleave={(e) => {
              e.currentTarget.style.borderColor = $theme.brightBlack;
              e.currentTarget.style.color = $theme.foreground;
            }}
          >
            [ {btn.label} ]
          </button>
        {/each}
      </div>

      <!-- Terminal hint -->
      <p class="home-hint" style={`color: ${$theme.brightBlack};`}>
        Press <span style={`color: ${$theme.purple};`}>/</span> to type a command
      </p>
    </div>
  {:else if isResume}
    <!-- Resume: Embedded PDF -->
    <div class="resume-container">
      <h1 class="section-title" style={`color: ${$theme.purple};`}>Resume</h1>
      <div class="section-divider" style={`background-color: ${$theme.brightBlack};`}></div>
      <div class="pdf-wrapper">
        <iframe
          src="/resume.pdf"
          title="Jason Hong Resume"
          class="pdf-embed"
        ></iframe>
      </div>
      <a 
        href="/resume.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
        class="download-link"
        style={`color: ${$theme.cyan}; border-color: ${$theme.brightBlack};`}
      >
        Open in new tab ↗
      </a>
    </div>
  {:else if isSetup}
    <!-- Setup: Neofetch style -->
    <div class="setup-container">
      <h1 class="section-title" style={`color: ${$theme.purple};`}>Setup</h1>
      <div class="section-divider" style={`background-color: ${$theme.brightBlack};`}></div>
      
      <div class="neofetch">
        <pre class="neofetch-art" style={`color: ${$theme.purple};`}>{`       /\\
      /  \\
     /\\   \\
    /  ..  \\
   /  '  '  \\
  / ..'  '.. \\
 /_'        '_\\`}</pre>
        
        <div class="neofetch-info" style={`color: ${$theme.foreground};`}>
          <p class="neofetch-header" style={`color: ${$theme.cyan};`}>
            jasonph<span style={`color: ${$theme.foreground};`}>@</span><span style={`color: ${$theme.purple};`}>jasonhong.net</span>
          </p>
          <p class="neofetch-divider" style={`color: ${$theme.brightBlack};`}>─────────────────────────</p>
          
          <p><span class="neofetch-label" style={`color: ${$theme.purple};`}>OS</span> <a href="https://omarchy.com" target="_blank" rel="noopener" style={`color: ${$theme.cyan};`}>Omarchy</a> (Arch-based)</p>
          <p><span class="neofetch-label" style={`color: ${$theme.purple};`}>Editor</span> <a href="https://github.com/nvim-lua/kickstart.nvim" target="_blank" rel="noopener" style={`color: ${$theme.cyan};`}>Neovim</a></p>
          <p><span class="neofetch-label" style={`color: ${$theme.purple};`}>KB</span> <a href="https://kinesis-ergo.com/keyboards/advantage360/" target="_blank" rel="noopener" style={`color: ${$theme.cyan};`}>Kinesis Advantage 360</a></p>
          <p><span class="neofetch-label" style={`color: ${$theme.purple};`}>Theme</span> RainyNight</p>
          
          <p class="neofetch-divider" style={`color: ${$theme.brightBlack};`}></p>
          
          <p class="neofetch-tagline" style={`color: ${$theme.brightBlack};`}>btw i use arch</p>
        </div>
      </div>
    </div>
  {:else if isBlog}
    <!-- Blog: List of clickable posts -->
    <div class="content-container">
      <h1 class="section-title" style={`color: ${$theme.purple};`}>Blog</h1>
      <div class="section-divider" style={`background-color: ${$theme.brightBlack};`}></div>
      
      {#if blogPosts.length === 0}
        <p class="section-body" style={`color: ${$theme.foreground};`}>
          No posts yet. Check back soon!
        </p>
      {:else}
        <div class="blog-list">
          {#each blogPosts as post}
            <button
              class="blog-post-item"
              style={`color: ${$theme.foreground}; border-color: ${$theme.brightBlack};`}
              on:click={() => handleBlogPostClick(post.slug)}
              on:mouseenter={(e) => {
                e.currentTarget.style.borderColor = $theme.purple;
              }}
              on:mouseleave={(e) => {
                e.currentTarget.style.borderColor = $theme.brightBlack;
              }}
            >
              <span class="blog-post-title" style={`color: ${$theme.cyan};`}>{post.title}</span>
              <span class="blog-post-meta" style={`color: ${$theme.brightBlack};`}>
                {post.date} - {post.description}
              </span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {:else if isBlogPost}
    <!-- Blog post: Rendered markdown -->
    <div class="content-container blog-post-content">
      <article class="markdown-body" style={`color: ${$theme.foreground};`}>
        {@html renderedMarkdown}
      </article>
    </div>
  {:else if isProjects}
    <!-- Projects: List of clickable projects -->
    <div class="content-container">
      <h1 class="section-title" style={`color: ${$theme.purple};`}>Projects</h1>
      <div class="section-divider" style={`background-color: ${$theme.brightBlack};`}></div>
      
      {#if projects.length === 0}
        <p class="section-body" style={`color: ${$theme.foreground};`}>
          No projects yet. Check back soon!
        </p>
      {:else}
        <div class="projects-list">
          {#each projects as project}
            <button
              class="project-item"
              style={`color: ${$theme.foreground}; border-color: ${$theme.brightBlack};`}
              on:click={() => handleProjectClick(project)}
              on:mouseenter={(e) => {
                e.currentTarget.style.borderColor = $theme.purple;
              }}
              on:mouseleave={(e) => {
                e.currentTarget.style.borderColor = $theme.brightBlack;
              }}
            >
              <div class="project-header">
                <span class="project-title" style={`color: ${$theme.cyan};`}>{project.title}</span>
                {#if project.featured}
                  <span class="project-featured" style={`color: ${$theme.purple};`}>*</span>
                {/if}
              </div>
              <span class="project-description" style={`color: ${$theme.foreground};`}>
                {project.description}
              </span>
              {#if project.tags && project.tags.length > 0}
                <div class="project-tags">
                  {#each project.tags as tag}
                    <span class="project-tag" style={`color: ${$theme.brightBlack}; border-color: ${$theme.brightBlack};`}>
                      {tag}
                    </span>
                  {/each}
                </div>
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {:else if isProjectDetail}
    <!-- Project detail: Rendered markdown -->
    <div class="content-container blog-post-content">
      <article class="markdown-body" style={`color: ${$theme.foreground};`}>
        {@html renderedMarkdown}
      </article>
    </div>
  {:else if isAoC}
    <!-- Advent of Code: Year tabs with day grid -->
    <div class="content-container">
      <h1 class="section-title" style={`color: ${$theme.purple};`}>Advent of Code</h1>
      <div class="section-divider" style={`background-color: ${$theme.brightBlack};`}></div>
      
      {#if aocYears.length === 0}
        <p class="section-body" style={`color: ${$theme.foreground};`}>
          No solutions yet. Check back soon!
        </p>
      {:else}
        <!-- Year tabs -->
        <div class="aoc-year-tabs">
          {#each aocYears as yearData}
            <button
              class="aoc-year-tab"
              class:active={selectedAoCYear === yearData.year}
              style={`color: ${selectedAoCYear === yearData.year ? $theme.purple : $theme.foreground}; border-color: ${selectedAoCYear === yearData.year ? $theme.purple : $theme.brightBlack};`}
              on:click={() => selectAoCYear(yearData.year)}
            >
              {yearData.year}
            </button>
          {/each}
        </div>
        
        <!-- Days grid for selected year -->
        {#each aocYears as yearData}
          {#if yearData.year === selectedAoCYear}
            <div class="aoc-days-grid">
              {#each Array(25) as _, i}
                {@const day = i + 1}
                {@const hasDay = yearData.days.includes(day)}
                <button
                  class="aoc-day"
                  class:completed={hasDay}
                  disabled={!hasDay}
                  style={`
                    color: ${hasDay ? $theme.cyan : $theme.brightBlack};
                    border-color: ${hasDay ? $theme.brightBlack : $theme.brightBlack}40;
                    opacity: ${hasDay ? 1 : 0.4};
                  `}
                  on:click={() => hasDay && handleAoCDayClick(yearData.year, day)}
                  on:mouseenter={(e) => {
                    if (hasDay) e.currentTarget.style.borderColor = $theme.purple;
                  }}
                  on:mouseleave={(e) => {
                    if (hasDay) e.currentTarget.style.borderColor = $theme.brightBlack;
                  }}
                >
                  {day}
                </button>
              {/each}
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  {:else if isAoCDay}
    <!-- AoC day solution: Rendered markdown -->
    <div class="content-container blog-post-content">
      <article class="markdown-body" style={`color: ${$theme.foreground};`}>
        {@html renderedMarkdown}
      </article>
    </div>
  {:else if parsed.title}
    <!-- Regular content with title -->
    <div class="content-container">
      <h1 class="section-title" style={`color: ${$theme.purple};`}>
        {parsed.title}
      </h1>
      <div class="section-divider" style={`background-color: ${$theme.brightBlack};`}></div>
      <div class="section-body" style={`color: ${$theme.foreground};`}>
        <pre>{parsed.body}</pre>
      </div>
    </div>
  {:else}
    <!-- Fallback: raw content -->
    <div class="content-container">
      <pre class="section-body" style={`color: ${$theme.foreground};`}>{content}</pre>
    </div>
  {/if}
</div>

<style>
  .content-view {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Banner styles */
  .banner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    gap: 2rem;
  }

  .banner-name {
    text-align: center;
  }

  .name-text {
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .name-subtitle {
    font-size: 1.25rem;
    margin: 0.5rem 0 0 0;
    font-weight: 400;
  }

  @media (min-width: 640px) {
    .name-text {
      font-size: 4rem;
    }

    .name-subtitle {
      font-size: 1.5rem;
    }
  }

  @media (min-width: 768px) {
    .name-text {
      font-size: 5rem;
    }

    .name-subtitle {
      font-size: 1.75rem;
    }
  }

  .home-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  .home-btn {
    font-family: 'Cascadia Code', monospace;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .home-btn:hover {
    transform: scale(1.05);
  }

  @media (min-width: 640px) {
    .home-btn {
      font-size: 1.1rem;
      padding: 0.6rem 1.25rem;
    }
  }

  .home-hint {
    font-size: 1rem;
    margin: 0;
  }

  @media (min-width: 640px) {
    .home-hint {
      font-size: 1.1rem;
    }
  }

  /* Content container styles */
  .content-container {
    padding: 1rem 0;
    max-width: 750px;
  }

  .section-title {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    letter-spacing: 0.02em;
  }

  .section-divider {
    height: 2px;
    width: 60px;
    margin-bottom: 1.5rem;
    border-radius: 1px;
  }

  .section-body {
    margin: 0;
    white-space: pre-wrap;
    line-height: 1.8;
    font-size: 1.1rem;
  }

  .section-body :global(a) {
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  @media (min-width: 640px) {
    .content-container {
      padding: 1.5rem 0;
    }

    .section-title {
      font-size: 2rem;
    }

    .section-body {
      font-size: 1.15rem;
    }
  }

  /* Resume styles */
  .resume-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem 0;
  }

  .pdf-wrapper {
    flex: 1;
    min-height: 400px;
    margin-bottom: 1rem;
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .pdf-embed {
    width: 100%;
    height: 100%;
    border: none;
    background: #fff;
    border-radius: 0.375rem;
  }

  .download-link {
    display: inline-block;
    padding: 0.6rem 1.2rem;
    border: 1px solid;
    border-radius: 0.375rem;
    text-decoration: none;
    font-size: 1rem;
    transition: all 0.15s ease;
    width: fit-content;
  }

  .download-link:hover {
    opacity: 0.8;
  }

  /* Setup / Neofetch styles */
  .setup-container {
    padding: 1rem 0;
  }

  .neofetch {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }

  @media (min-width: 640px) {
    .neofetch {
      flex-direction: row;
      gap: 2rem;
      align-items: flex-start;
    }
  }

  .neofetch-art {
    font-size: 0.9rem;
    line-height: 1.3;
    margin: 0;
    white-space: pre;
  }

  @media (min-width: 640px) {
    .neofetch-art {
      font-size: 1.05rem;
    }
  }

  .neofetch-info {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 1rem;
  }

  @media (min-width: 640px) {
    .neofetch-info {
      font-size: 1.1rem;
    }
  }

  .neofetch-info p {
    margin: 0;
    line-height: 1.6;
  }

  .neofetch-info a {
    text-decoration: none;
  }

  .neofetch-info a:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .neofetch-header {
    font-weight: 600;
  }

  .neofetch-label {
    display: inline-block;
    min-width: 70px;
    font-weight: 500;
  }

  .neofetch-divider {
    margin: 0.25rem 0;
  }

  .neofetch-tagline {
    margin-top: 0.5rem !important;
    font-style: italic;
  }

  /* Blog styles */
  .blog-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .blog-post-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 1rem 1.25rem;
    background: transparent;
    border: 1px solid;
    border-radius: 0.375rem;
    cursor: pointer;
    text-align: left;
    font-family: 'Cascadia Code', monospace;
    transition: all 0.15s ease;
  }

  .blog-post-item:hover {
    transform: translateX(4px);
  }

  .blog-post-title {
    font-size: 1.1rem;
    font-weight: 500;
  }

  .blog-post-meta {
    font-size: 0.95rem;
  }

  @media (min-width: 640px) {
    .blog-post-title {
      font-size: 1.2rem;
    }

    .blog-post-meta {
      font-size: 1rem;
    }
  }

  /* Blog post markdown styles */
  .blog-post-content {
    max-width: 800px;
  }

  .markdown-body {
    line-height: 1.8;
    font-size: 1.05rem;
  }

  .markdown-body :global(h1) {
    font-size: 2rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--theme-purple, #bd93f9);
  }

  .markdown-body :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 2rem 0 1rem 0;
  }

  .markdown-body :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1.5rem 0 0.75rem 0;
  }

  .markdown-body :global(p) {
    margin: 1rem 0;
  }

  .markdown-body :global(ul),
  .markdown-body :global(ol) {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  .markdown-body :global(li) {
    margin: 0.5rem 0;
  }

  .markdown-body :global(code) {
    font-family: 'Cascadia Code', monospace;
    font-size: 0.9em;
    padding: 0.2em 0.4em;
    border-radius: 0.25rem;
    background: rgba(255, 255, 255, 0.1);
  }

  .markdown-body :global(pre) {
    margin: 1.5rem 0;
    padding: 1rem;
    border-radius: 0.375rem;
    background: rgba(0, 0, 0, 0.3);
    overflow-x: auto;
  }

  .markdown-body :global(pre code) {
    padding: 0;
    background: transparent;
  }

  .markdown-body :global(a) {
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .markdown-body :global(blockquote) {
    margin: 1rem 0;
    padding-left: 1rem;
    border-left: 3px solid var(--theme-purple, #bd93f9);
    opacity: 0.9;
  }

  .markdown-body :global(hr) {
    margin: 2rem 0;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  @media (min-width: 640px) {
    .markdown-body {
      font-size: 1.1rem;
    }

    .markdown-body :global(h1) {
      font-size: 2.25rem;
    }

    .markdown-body :global(h2) {
      font-size: 1.65rem;
    }
  }

  /* Projects styles */
  .projects-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .project-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
    background: transparent;
    border: 1px solid;
    border-radius: 0.375rem;
    cursor: pointer;
    text-align: left;
    font-family: 'Cascadia Code', monospace;
    transition: all 0.15s ease;
    width: 100%;
  }

  .project-item:hover {
    transform: translateX(4px);
  }

  .project-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .project-title {
    font-size: 1.1rem;
    font-weight: 500;
  }

  .project-featured {
    font-weight: bold;
  }

  .project-description {
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .project-tag {
    font-size: 0.8rem;
    padding: 0.15rem 0.5rem;
    border: 1px solid;
    border-radius: 0.25rem;
  }

  @media (min-width: 640px) {
    .project-title {
      font-size: 1.2rem;
    }

    .project-description {
      font-size: 1rem;
    }
  }

  /* Advent of Code styles */
  .aoc-year-tabs {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .aoc-year-tab {
    font-family: 'Cascadia Code', monospace;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .aoc-year-tab:hover {
    transform: scale(1.05);
  }

  .aoc-year-tab.active {
    font-weight: 600;
  }

  .aoc-days-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.75rem;
    max-width: 400px;
  }

  @media (min-width: 480px) {
    .aoc-days-grid {
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
    }
  }

  .aoc-day {
    font-family: 'Cascadia Code', monospace;
    font-size: 1rem;
    padding: 0.75rem;
    background: transparent;
    border: 1px solid;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s ease;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .aoc-day:not(:disabled):hover {
    transform: scale(1.1);
  }

  .aoc-day:disabled {
    cursor: not-allowed;
  }

  .aoc-day.completed {
    font-weight: 500;
  }
</style>
