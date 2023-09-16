<script lang="ts">
  export let data;
</script>

<h1>Welcome to Jacqui's Poster Shop</h1>
<p>I want to make cozy animal posters here.</p>
<p>Your prompt is: {data.imagePrompt}</p>
{#await data.streamed.replicateOutputPromise}
  <p>awaiting generated Replicate image</p>
{:then imageURL}
  <h1>Replicate</h1>
  <img src={imageURL} alt="generated AI art from Replicate"/>
{:catch error}
  <p>There was an issue getting the image.</p>
{/await}