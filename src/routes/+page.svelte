<script lang="ts">
  import { dev } from '$app/environment';
  import { injectAnalytics } from '@vercel/analytics/sveltekit';
 
  injectAnalytics({ mode: dev ? 'development' : 'production' });
  export let data;
</script>

<h1>cozyposters</h1>
<p>An endless stream of adorable posters, just refresh the page for a new one.</p>
<p>ChatGPT generated the following prompt: {data.imagePrompt}</p>
{#await data.streamed.replicateOutputPromise}
  <p>awaiting generated image from Stable Diffusion</p>
{:then imageURL}
  <img src={imageURL} alt="generated AI art from Replicate"/>
{:catch error}
  <p>There was an issue getting the image. Please refresh the page to try again.</p>
{/await}