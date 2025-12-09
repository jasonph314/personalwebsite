<script lang="ts">
  import { theme } from '../stores/theme';

  export let content: string = '';
  export let command: string = '';

  // Check if this is the banner (ASCII art)
  $: isBanner = command === 'banner';

  // Parse content into title and body
  $: parsed = parseContent(content);

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
    <!-- Banner: ASCII art centered -->
    <div class="banner-container">
      <pre class="banner-art" style={`color: ${$theme.purple};`}>{parsed.body}</pre>
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

  .banner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
  }

  .banner-art {
    font-size: 0.65rem;
    line-height: 1.2;
    margin: 0;
    white-space: pre;
  }

  @media (min-width: 640px) {
    .banner-art {
      font-size: 0.85rem;
    }
  }

  @media (min-width: 768px) {
    .banner-art {
      font-size: 1rem;
    }
  }

  .content-container {
    padding: 1rem 0;
    max-width: 700px;
  }

  .section-title {
    font-size: 1.5rem;
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
    font-size: 0.95rem;
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
      font-size: 1.75rem;
    }

    .section-body {
      font-size: 1rem;
    }
  }
</style>
