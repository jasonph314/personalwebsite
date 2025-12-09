<script lang="ts">
  import Ps1 from './components/Ps1.svelte';
  import Input from './components/Input.svelte';
  import History from './components/History.svelte';
  import NavBar from './components/NavBar.svelte';
  import { theme } from './stores/theme';
  import { history } from './stores/history';
  import { commands } from './utils/commands';

  async function handleNavCommand(event: CustomEvent<{ command: string }>) {
    const commandName = event.detail.command;
    const commandFunction = commands[commandName];

    if (commandFunction) {
      const output = await commandFunction([]);
      $history = [...$history, { command: commandName, outputs: [output] }];
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

<div class="h-full flex flex-col p-2 sm:p-4" style={`background-color: ${$theme.background};`}>
  <NavBar on:command={handleNavCommand} />
  
  <main
    class="flex-1 border rounded-md p-3 sm:p-4 overflow-auto text-xs sm:text-sm md:text-base"
    style={`background-color: ${$theme.background}; color: ${$theme.foreground}; border-color: ${$theme.purple};`}
  >
    <History />

    <div class="flex flex-col md:flex-row">
      <Ps1 />

      <Input />
    </div>
  </main>
</div>
