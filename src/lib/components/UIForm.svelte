<script lang="ts">
  import { Input, Button } from 'flowbite-svelte';

  export let onSubmit: ((url: string, alias?: string) => void) | undefined = undefined;

  let url = '';
  let alias = '';

  function handleSubmit() {
    if (!url || url.trim() === '') {
      return;
    }

    const urlPattern = /^https?:\/\/[^\s]+$/i;
    const trimmed = url.trim();

    if (!urlPattern.test(trimmed)) {
      return;
    }

    const aliasValue = alias && alias.trim() !== '' ? alias.trim() : undefined;

    // Call the callback prop if provided
    onSubmit?.(trimmed, aliasValue);
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <label for="url-input" class="sr-only">Enter URL</label>

  <Input
    id="url-input"
    type="url"
    placeholder="Long URL"
    required
    bind:value={url}
    class="flex-1 bg-gray-100 border text-gray-900 text-sm rounded-lg p-2.5"
  />

  <div class="flex items-center mt-2 space-x-1">
    <Input
      type="text"
      readonly
      value="https://short.brandontaylor.dev"
      class="flex-1 bg-gray-100 border text-gray-900 text-sm rounded-lg p-2.5 cursor-none select-none"
    />

    <span class="mx-2 whitespace-nowrap">/</span>

    <Input
      id="alias-input"
      type="text"
      placeholder="Alias (optional)"
      class="flex-1 bg-gray-100 border text-gray-900 text-sm rounded-lg p-2.5"
      bind:value={alias}
    />
  </div>

  <Button type="submit" class="mt-2 px-4 py-2 w-full bg-cyan-700 active:bg-cyan-800 hover:cursor-pointer">
    Submit
  </Button>
</form>
