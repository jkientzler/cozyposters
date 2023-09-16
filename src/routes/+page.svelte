<script lang="ts">
  export let data;
  let promise = data.imageURL;
</script>

<h1>Welcome to Jacqui's Poster Shop</h1>
<p>I want to make cozy animal posters here.</p>
<p>Your prompt is: {data.imagePrompt}</p>
{#await promise}
  <p>awaiting generated image</p>
{:then image_url}
  <img src={image_url} alt="generated AI art"/>
{:catch error}
  <p>There was an issue getting the image.</p>
{/await}
