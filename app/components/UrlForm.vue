<script setup lang="ts">

  type UrlFormEmits = {
    (e: "submit", url: string, alias?: string): void;
  };

  const emit = defineEmits<UrlFormEmits>();
  const url = ref<string>("");
  const alias = ref<string>("");

  function handleSubmit() {
    
    if (!url.value || url.value.trim() === "") {
      return;
    }

    const urlPattern = /^https?:\/\/[^\s]+$/i;
    const trimmed = url.value.trim();
    if (!urlPattern.test(trimmed)) {
      return;
    }
    const aliasValue = alias.value && alias.value.trim() !== "" ? alias.value.trim() : undefined;
    emit("submit", trimmed, aliasValue);
  }
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <label for="url-input" class="sr-only">Enter URL</label>
    <input
      id="url-input"
      type="url"
      placeholder="Long URL"
      class="w-full p-2 border border-gray-300 rounded text-zinc-900"
      required
      v-model="url"
    />

    <div class="flex items-center mt-2 space-x-1">
      <input
        type="text"
        readonly
        value="https://short.brandontaylor.dev/"
        class="flex-1 p-2 border border-gray-300 rounded text-zinc-900 bg-gray-100"
      />
      <span class="mx-1 whitespace-nowrap">/s/</span>
      <input
        id="alias-input"
        type="text"
        placeholder="Alias (optional)"
        class="flex-1 p-2 border border-gray-300 rounded text-zinc-900"
        v-model="alias"
      />
    </div>
    <button
      type="submit"
      class="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
    >
      Submit
    </button>
  </form>
</template>
