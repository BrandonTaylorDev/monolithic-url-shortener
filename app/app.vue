<script setup lang="ts">

  const url = ref<string>("");
  const shortUrl = ref<string>("");
  const errorMessage = ref<string>("");
  const loading = ref<boolean>(false);
  async function onSubmit(submittedUrl: string, alias?: string) {
    url.value = submittedUrl;
    
    try {
      loading.value = true;
      const response = await $fetch("/api/generate", {
        method: "POST",
        body: { url: submittedUrl, alias },
      });
      if (response.alias) {
        const origin = window.location.origin;
        shortUrl.value = `${origin}/s/${response.alias}`;
        errorMessage.value = "";
      } else if (response.error === "unavailable") {
        errorMessage.value = "Alias unavailable. Please try a different one.";
        shortUrl.value = "";
      }
    } catch (err) {
      console.error("Error calling /api/generate:", err);
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <div class="min-h-screen w-full bg-zinc-800 text-zinc-100 flex flex-col justify-center items-center p-4">
    <NuxtRouteAnnouncer />
    <div class="max-w-lg mx-auto w-full">
      <div class="mb-4">
        <p>
          Just a hacked&dash;together URL shortener for learning purposes. Feel free to download and modify to suit your needs :&rpar;.
        </p>
      </div>

      <UrlForm @submit="(url, alias) => onSubmit(url, alias)" />
      <div v-if="loading" class="flex justify-center mt-4">
        <Icon name="mdi:loading" class="animate-spin" />
      </div>

      <div v-if="shortUrl" class="mt-4 text-center">
        Shortened URL: <a :href="shortUrl" class="text-blue-300 underline" target="_blank">{{ shortUrl }}</a>
      </div>
      <div v-if="errorMessage" class="mt-4 text-center text-red-500">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>
