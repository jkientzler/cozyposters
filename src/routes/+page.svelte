<script lang="ts">
  export let data;
</script>

<h1>Welcome to Jacqui's Poster Shop</h1>
<p>I want to make cozy animal posters here.</p>
<p>Your prompt is: {data.imagePrompt}</p>
{#await data.streamed.imagePromise}
  <p>awaiting generated image</p>
{:then imageURL}
  <img src={imageURL} alt="generated AI art"/>
{:catch error}
  <p>There was an issue getting the image.</p>
{/await}