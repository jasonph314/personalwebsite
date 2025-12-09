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
</script>

{#if visible}
  <div 
    class="terminal-input-container"
    style={`background-color: ${$theme.background}; border-color: ${$theme.brightBlack};`}
  >
    <span class="prompt" style={`color: ${$theme.brightBlack};`}>
      guest@jasonhong.net:~$
    </span>
    <input
      bind:this={input}
      bind:value={command}
      on:keydown={handleKeyDown}
      type="text"
      class="terminal-input"
      style={`color: ${$theme.foreground};`}
      placeholder="Type a command..."
      aria-label="Terminal command input"
    />
    <span class="hint" style={`color: ${$theme.brightBlack};`}>
      ESC to close
    </span>
  </div>
{:else}
  <div 
    class="terminal-hint"
    style={`color: ${$theme.brightBlack};`}
    on:click={() => visible = true}
    on:keydown={(e) => e.key === 'Enter' && (visible = true)}
    role="button"
    tabindex="0"
  >
    Press <span style={`color: ${$theme.purple};`}>/</span> to type a command
  </div>
{/if}

<style>
  .terminal-input-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-top: 1px solid;
    font-size: 0.875rem;
  }

  .prompt {
    white-space: nowrap;
    font-size: 0.8rem;
  }

  .terminal-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'Cascadia Code', monospace;
    font-size: 0.875rem;
  }

  .terminal-input::placeholder {
    opacity: 0.4;
  }

  .hint {
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .terminal-hint {
    padding: 0.75rem 1rem;
    text-align: right;
    font-size: 0.8rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .terminal-hint:hover {
    opacity: 0.8;
  }
</style>
