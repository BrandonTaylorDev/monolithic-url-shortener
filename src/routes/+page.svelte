<script lang="ts">
  import UrlForm from '$lib/components/UIForm.svelte';

  let url = '';
  let shortUrl = '';
  let errorMessage = '';
  let loading = false;
  let copied = false;
  let showResult = false;

  async function onSubmit(submittedUrl: string, alias?: string) {
    url = submittedUrl;
    showResult = false;
    copied = false;

    try {
      loading = true;
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: submittedUrl, alias })
      });

      const data = await response.json();
      if (data.alias) {
        const origin = window.location.origin;
        shortUrl = `${origin}/${data.alias}`;
        errorMessage = '';
        showResult = true;
      } else if (data.error === 'unavailable') {
        errorMessage = 'Alias unavailable. Please try a different one.';
        shortUrl = '';
        showResult = false;
      } else if (data.error) {
        errorMessage = data.error;
        showResult = false;
      }
    } catch (err) {
      console.error('Error calling /api/generate:', err);
      showResult = false;
    } finally {
      loading = false;
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  function createNewLink() {
    showResult = false;
    shortUrl = '';
    errorMessage = '';
    url = '';
  }
</script>

<div class="min-h-screen w-full bg-zinc-800 text-zinc-100 flex flex-col justify-center items-center p-4">
  <div class="max-w-2xl mx-auto w-full">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-white mb-4">
        URL Shortener
      </h1>
      <p class="text-zinc-300 text-lg">
        Transform long URLs into short, shareable links
      </p>
    </div>

    {#if !showResult}
      <UrlForm onSubmit={onSubmit} />
    {:else}
      <!-- Success Result Section -->
      <div class="bg-zinc-700 rounded-xl p-8 border border-zinc-600 shadow-2xl">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Your Short URL is Ready!</h2>
          <p class="text-zinc-300">Your long URL has been successfully shortened</p>
        </div>

        <!-- URL Display Section -->
        <div class="bg-zinc-800 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm text-zinc-400 mb-1">Original URL:</p>
              <p class="text-zinc-200 truncate text-sm">{url}</p>
            </div>
          </div>
        </div>

        <!-- Short URL Section -->
        <div class="bg-zinc-800 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm text-zinc-400 mb-1">Short URL:</p>
              <a href={shortUrl} target="_blank" class="text-cyan-400 hover:text-cyan-300 transition-colors truncate text-sm font-mono">
                {shortUrl}
              </a>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            on:click={copyToClipboard}
            class="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          >
            {#if copied}
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Copied!
            {:else}
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Copy Link
            {/if}
          </button>
          
          <a
            href={shortUrl}
            target="_blank"
            class="flex-1 bg-zinc-600 hover:bg-zinc-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Open Link
          </a>
        </div>

        <!-- Create New Link Button -->
        <div class="mt-6 text-center">
          <button
            on:click={createNewLink}
            class="text-zinc-400 hover:text-zinc-300 transition-colors text-sm underline"
          >
            Create another short link
          </button>
        </div>
      </div>
    {/if}

    {#if loading}
      <div class="flex justify-center mt-8">
        <div class="flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p class="mt-4 text-zinc-300">Creating your short link...</p>
        </div>
      </div>
    {/if}

    {#if errorMessage}
      <div class="mt-8 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-red-400">{errorMessage}</p>
        </div>
      </div>
    {/if}
  </div>
</div>
