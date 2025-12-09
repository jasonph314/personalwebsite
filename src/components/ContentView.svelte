<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { theme } from '../stores/theme';

  export let content: string = '';
  export let command: string = '';

  const dispatch = createEventDispatcher();

  // Check if this is the banner (ASCII art)
  $: isBanner = command === 'banner';
  
  // Check if this is the resume (embedded PDF)
  $: isResume = command === 'resume';

  // Check if this is the setup page (neofetch style)
  $: isSetup = command === 'setup';

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
    <!-- Banner: ASCII art centered with quick nav buttons -->
    <div class="banner-container">
      <pre class="banner-art" style={`color: ${$theme.purple};`}>{parsed.body}</pre>
      
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

  .banner-art {
    font-size: 0.75rem;
    line-height: 1.2;
    margin: 0;
    white-space: pre;
  }

  @media (min-width: 640px) {
    .banner-art {
      font-size: 1rem;
    }
  }

  @media (min-width: 768px) {
    .banner-art {
      font-size: 1.15rem;
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
</style>
