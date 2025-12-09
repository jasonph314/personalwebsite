<script lang="ts">
  import { onMount } from 'svelte';
  import NavBar from './components/NavBar.svelte';
  import ContentView from './components/ContentView.svelte';
  import TerminalInput from './components/TerminalInput.svelte';
  import { theme } from './stores/theme';
  import { commands } from './utils/commands';

  // Current content to display
  let currentContent = '';
  let currentCommand = 'banner';

  // Navigation commands that show as clean pages
  const navCommands = ['about', 'projects', 'blog', 'setup', 'aoc', 'resume', 'contact', 'banner', 'help'];

  onMount(async () => {
    // Show banner on initial load
    const bannerFn = commands['banner'] as () => string;
    if (bannerFn) {
      currentContent = bannerFn();
      currentCommand = 'banner';
    }
  });

  async function handleNavCommand(event: CustomEvent<{ command: string }>) {
    const commandName = event.detail.command;
    const commandFunction = commands[commandName];

    if (commandFunction) {
      const output = await commandFunction([]);
      currentContent = output;
      currentCommand = commandName;
    }
  }

  async function handleTerminalCommand(event: CustomEvent<{ command: string; args: string[]; output: string }>) {
    const { command, args, output } = event.detail;

    // If it's a nav command, update the main view
    if (navCommands.includes(command) && args.length === 0) {
      currentContent = output;
      currentCommand = command;
    } else {
      // For non-nav commands, we could show output differently
      // For now, just update the content area
      currentContent = output;
      currentCommand = command;
    }
  }
</script>

<svelte:head>
  {#if import.meta.env.VITE_TRACKING_ENABLED === 'true'}
    <script
      async
      defer
      data-website-id={import.meta.env.VITE_TRACKING_SITE_ID}
      src={import.meta.env.VITE_TRACKING_URL}
    ></script>
  {/if}
</svelte:head>

<div class="app-container" style={`background-color: ${$theme.background};`}>
  <NavBar on:command={handleNavCommand} />
  
  <main
    class="main-content"
    style={`background-color: ${$theme.background}; color: ${$theme.foreground}; border-color: ${$theme.purple};`}
  >
    <ContentView content={currentContent} command={currentCommand} />
  </main>

  <footer class="terminal-footer">
    <TerminalInput on:command={handleTerminalCommand} />
  </footer>
</div>

<style>
  .app-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
  }

  @media (min-width: 640px) {
    .app-container {
      padding: 1rem;
    }
  }

  .main-content {
    flex: 1;
    border: 1px solid;
    border-radius: 0.375rem;
    padding: 1.5rem;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 640px) {
    .main-content {
      padding: 2rem;
    }
  }

  .terminal-footer {
    flex-shrink: 0;
  }
</style>
