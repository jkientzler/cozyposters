//import { OPEN_AI_KEY } from '$env/static/private';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: OPEN_AI_KEY,
});

const animalNames: Array<string> = ["cat", "dog", "horse", "kitten", "puppy", "penguin", "bunny"];
const styles: Array<string> = ["watercolor", "anime", "oil paint", "sketch", "photorealistic", "renaissance", "impressionist", "3D rendering"];
const settings: Array<string> = ["forest", "desert", "cafe", "living room", "meadow", "blanket pile"];

function getRandomIntInclusive(max: number): number {
  const min: number = Math.ceil(0);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function getRandomImagePrompt(): string {
  const animal: string = animalNames[getRandomIntInclusive(animalNames.length - 1)];
  const style: string = styles[getRandomIntInclusive(styles.length - 1)];
  const setting: string = settings[getRandomIntInclusive(settings.length - 1)];
  return animal + " in " + setting + " " + style;
}

async function getImageURL(prompt: string) {
  const openai = new OpenAIApi(configuration);
  const response = await openai.createImage({
    prompt: prompt,
    n: 1,
    size: "256x256",
  });
  return response.data.data[0].url;
}

export function load() {
  const imgPrompt = getRandomImagePrompt();
  return {
    imagePrompt: imgPrompt,
    imageURL: getImageURL(imgPrompt)
  };
}
