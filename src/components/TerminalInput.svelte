<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { theme } from '../stores/theme';
  import { commands } from '../utils/commands';

  export let visible = false;

  const dispatch = createEventDispatcher();

  let command = '';
  let input: HTMLInputElement;

  // Focus input when visible
  $: if (visible && input) {
    // Small delay to ensure DOM is ready
    setTimeout(() => input?.focus(), 10);
  }

  onMount(() => {
    // Listen for '/' key to show terminal
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      // Don't trigger if already typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === '/' && !visible) {
        e.preventDefault();
        visible = true;
      }
    };

    window.addEventListener('keydown', handleGlobalKeydown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeydown);
    };
  });

  async function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      visible = false;
      command = '';
      return;
    }

    if (e.key === 'Enter' && command.trim()) {
      const [commandName, ...args] = command.trim().split(' ');
      const commandFunction = commands[commandName];

      if (commandFunction) {
        const output = await commandFunction(args);
        dispatch('command', { command: commandName, args, output });
      } else {
        dispatch('command', { 
          command: commandName, 
          args, 
          output: `${commandName}: command not found. Type 'help' for available commands.` 
        });
      }

      command = '';
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const autoCompleteCommand = Object.keys(commands).find((cmd) =>
        cmd.startsWith(command),
      );
      if (autoCompleteCommand) {
        command = autoCompleteCommand;
      }
    }
  }

  function handleHintClick() {
    visible = true;
  }
</script>

<div class="terminal-footer" style={`border-color: ${$theme.brightBlack};`}>
  {#if visible}
    <div 
      class="terminal-input-container"
      style={`background-color: ${$theme.background};`}
    >
      <span class="prompt" style={`color: ${$theme.purple};`}>
        guest@jasonhong.net:~$
      </span>
      <input
        bind:this={input}
        bind:value={command}
        on:keydown={handleKeyDown}
        type="text"
        class="terminal-input"
        style={`color: ${$theme.foreground};`}
        placeholder="Type 'help' for available commands"
        aria-label="Terminal command input"
      />
      <span class="hint" style={`color: ${$theme.brightBlack};`}>
        ESC to close
      </span>
    </div>
  {:else}
    <button 
      class="terminal-hint"
      style={`color: ${$theme.foreground}; background-color: ${$theme.background};`}
      on:click={handleHintClick}
      aria-label="Open terminal"
    >
      <span class="hint-text">
        Press <kbd style={`color: ${$theme.purple}; background-color: ${$theme.brightBlack}30;`}>/</kbd> to open terminal
      </span>
    </button>
  {/if}
</div>

<style>
  .terminal-footer {
    border-top: 1px solid;
    margin-top: 0.5rem;
  }

  .terminal-input-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    font-size: 1.05rem;
  }

  .prompt {
    white-space: nowrap;
    font-size: 1rem;
    font-weight: 500;
  }

  .terminal-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'Cascadia Code', monospace;
    font-size: 1.05rem;
  }

  .terminal-input::placeholder {
    opacity: 0.4;
  }

  .hint {
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .terminal-hint {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1rem 1.25rem;
    border: none;
    cursor: pointer;
    font-family: 'Cascadia Code', monospace;
    font-size: 1.05rem;
    transition: opacity 0.2s;
  }

  .terminal-hint:hover {
    opacity: 0.8;
  }

  .hint-text {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem 0.5rem;
    border-radius: 0.25rem;
    font-family: 'Cascadia Code', monospace;
    font-size: 1rem;
    font-weight: 600;
  }
</style>
