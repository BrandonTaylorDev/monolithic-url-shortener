<script lang="ts">
  import { browser } from '$app/environment';

  export let onSubmit: ((url: string, alias?: string) => void) | undefined = undefined;

  let url = '';
  let alias = '';
  let isValid = true;
  let validationMessage = '';
  let domain = '';

  // Initialize domain only on client side
  if (browser) {
    domain = window.location.origin;
  }

  function validateUrl(url: string): boolean {
    const urlPattern = /^https?:\/\/[^\s]+$/i;
    return urlPattern.test(url.trim());
  }

  function handleUrlInput() {
    if (url && url.trim() !== '') {
      isValid = validateUrl(url);
      validationMessage = isValid ? '' : 'Please enter a valid URL (e.g., https://example.com)';
    } else {
      isValid = true;
      validationMessage = '';
    }
  }

  function handleSubmit() {
    if (!url || url.trim() === '') {
      isValid = false;
      validationMessage = 'URL is required';
      return;
    }

    const trimmed = url.trim();
    if (!validateUrl(trimmed)) {
      isValid = false;
      validationMessage = 'Please enter a valid URL (e.g., https://example.com)';
      return;
    }

    const aliasValue = alias && alias.trim() !== '' ? alias.trim() : undefined;
    onSubmit?.(trimmed, aliasValue);
  }
</script>

<div class="w-full max-w-2xl mx-auto">
  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    
    <!-- URL Input Section -->
    <div class="space-y-2">
      <label for="url-input" class="block text-sm font-medium text-zinc-300">
        Enter your long URL
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </div>
        <input
          id="url-input"
          type="url"
          placeholder="https://example.com/very/long/url"
          required
          bind:value={url}
          on:input={handleUrlInput}
          class="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 text-zinc-100 placeholder-zinc-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          class:border-red-500={!isValid}
        />
      </div>
      {#if !isValid && validationMessage}
        <p class="text-red-400 text-sm mt-1">{validationMessage}</p>
      {/if}
    </div>

    <!-- Custom Alias Section -->
    <div class="space-y-2">
      <label for="alias-input" class="block text-sm font-medium text-zinc-300">
        Custom alias (optional)
      </label>
      <div class="flex items-center space-x-2">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <input
            id="alias-input"
            type="text"
            placeholder="my-custom-link"
            maxlength="20"
            bind:value={alias}
            class="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 text-zinc-100 placeholder-zinc-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
      <p class="text-zinc-400 text-sm">Choose a custom alias for your short URL (max 20 characters)</p>
    </div>

    <!-- Preview Section -->
    <div class="bg-zinc-700 rounded-lg p-4 border border-zinc-600">
      <p class="text-sm text-zinc-300 mb-2">Your short URL will look like:</p>
      <div class="flex items-center space-x-2">
        <span class="text-zinc-400 font-mono text-sm">{domain || 'https://your-domain.com'}/</span>
        <span class="text-cyan-400 font-mono text-sm font-semibold">
          {alias || 'random'}
        </span>
      </div>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <span class="flex items-center justify-center">
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
        </svg>
        Shorten URL
      </span>
    </button>
  </form>
</div>