<script lang="ts">
  import UrlForm from '$lib/components/UIForm.svelte';

  let url = '';
  let shortUrl = '';
  let errorMessage = '';
  let loading = false;

  async function onSubmit(submittedUrl: string, alias?: string) {
    url = submittedUrl;

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
      } else if (data.error === 'unavailable') {
        errorMessage = 'Alias unavailable. Please try a different one.';
        shortUrl = '';
      } else if (data.error) {
        errorMessage = data.error;
      }
    } catch (err) {
      console.error('Error calling /api/generate:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen w-full bg-zinc-800 text-zinc-100 flex flex-col justify-center items-center p-4">
  <div class="max-w-lg mx-auto w-full">
    <div class="mb-4">
      <p>
        Just a hacked-together URL shortener for learning purposes.
        Feel free to download and modify to suit your needs :&rpar;
      </p>
    </div>

    <UrlForm onSubmit={onSubmit} />

    {#if loading}
      <div class="flex justify-center mt-4">
        <span class="animate-spin">⏳</span>
      </div>
    {/if}

    {#if shortUrl}
      <div class="mt-4 text-center">
        Shortened URL:
        <a href={shortUrl} class="text-blue-300 underline" target="_blank">
          {shortUrl}
        </a>
      </div>
    {/if}

    {#if errorMessage}
      <div class="mt-4 text-center text-red-500">
        {errorMessage}
      </div>
    {/if}
  </div>
</div>
