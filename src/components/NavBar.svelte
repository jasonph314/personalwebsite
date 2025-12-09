<script lang="ts">
  import { theme } from '../stores/theme';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const navItems = [
    { label: 'About', command: 'about' },
    { label: 'Projects', command: 'projects' },
    { label: 'Blog', command: 'blog' },
    { label: 'Setup', command: 'setup' },
    { label: 'AoC', command: 'aoc' },
    { label: 'Resume', command: 'resume' },
  ];

  const socialLinks = [
    { label: 'GitHub', command: 'github', icon: 'gh' },
    { label: 'LinkedIn', command: 'linkedin', icon: 'in' },
    { label: 'Email', command: 'email', icon: '@' },
  ];

  function handleClick(command: string) {
    dispatch('command', { command });
  }
</script>

<nav 
  class="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 mb-3 sm:mb-4 rounded-md"
  style={`background-color: ${$theme.background}; border: 1px solid ${$theme.brightBlack};`}
>
  <!-- Logo/Home button -->
  <button
    class="home-button px-2 py-1 sm:px-3 sm:py-1.5 rounded text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105"
    style={`color: ${$theme.purple}; border: 1px solid ${$theme.purple};`}
    on:click={() => handleClick('banner')}
    on:mouseenter={(e) => {
      e.currentTarget.style.backgroundColor = `${$theme.purple}20`;
    }}
    on:mouseleave={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
    }}
    title="Home"
  >
    JH
  </button>

  <!-- Main nav items -->
  <div class="flex items-center gap-1 sm:gap-2 flex-wrap">
    {#each navItems as item}
      <button
        class="nav-button px-2 py-1 sm:px-3 sm:py-1.5 rounded text-sm sm:text-base transition-all duration-200 hover:scale-105"
        style={`color: ${$theme.foreground}; border: 1px solid ${$theme.brightBlack};`}
        on:click={() => handleClick(item.command)}
        on:mouseenter={(e) => {
          e.currentTarget.style.borderColor = $theme.purple;
          e.currentTarget.style.color = $theme.purple;
        }}
        on:mouseleave={(e) => {
          e.currentTarget.style.borderColor = $theme.brightBlack;
          e.currentTarget.style.color = $theme.foreground;
        }}
      >
        [ {item.label} ]
      </button>
    {/each}
  </div>

  <!-- Social links -->
  <div class="flex items-center gap-1 sm:gap-2">
    {#each socialLinks as link}
      <button
        class="social-button px-2 py-1 sm:px-2.5 sm:py-1.5 rounded text-sm sm:text-base transition-all duration-200 hover:scale-105"
        style={`color: ${$theme.cyan}; border: 1px solid ${$theme.brightBlack};`}
        title={link.label}
        on:click={() => handleClick(link.command)}
        on:mouseenter={(e) => {
          e.currentTarget.style.borderColor = $theme.cyan;
          e.currentTarget.style.backgroundColor = `${$theme.cyan}15`;
        }}
        on:mouseleave={(e) => {
          e.currentTarget.style.borderColor = $theme.brightBlack;
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {link.icon}
      </button>
    {/each}
  </div>
</nav>

<style>
  .home-button, .nav-button, .social-button {
    font-family: 'Cascadia Code', monospace;
    cursor: pointer;
    background: transparent;
  }

  .home-button:focus, .nav-button:focus, .social-button:focus {
    outline: none;
  }
</style>
