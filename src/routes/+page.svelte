<script lang="ts">
  let animalNames: Array<string> = ["cat", "dog", "horse", "kitten", "puppy", "penguin", "bunny"];
  let styles: Array<string> = ["watercolor", "anime", "oil paint", "sketch", "photorealistic", "renaissance", "impressionist", "3D rendering"];
  let settings: Array<string> = ["forest", "desert", "cafe", "living room", "meadow", "blanket pile"];

  function getRandomIntInclusive(max: number): number {
  let min: number = Math.ceil(0);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

  function getRandomImagePrompt(): string {
    let animal: string = animalNames[getRandomIntInclusive(animalNames.length - 1)];
    let style: string = styles[getRandomIntInclusive(styles.length - 1)];
    let setting: string = settings[getRandomIntInclusive(settings.length - 1)];
    return animal + " in " + setting + " " + style;
  }

</script>

<h1>Welcome to Jacqui's Poster Shop</h1>
<p>I want to make cozy animal posters here.</p>
<p>Your prompt is: {getRandomImagePrompt()}</p>
