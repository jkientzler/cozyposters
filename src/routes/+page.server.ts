import { OPEN_AI_KEY, REPLICATE_API_TOKEN } from '$env/static/private';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from "openai";
import Replicate from "replicate";

//REPLICATE
const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});
//OPENAI
const configuration = new Configuration({
  apiKey: OPEN_AI_KEY,
});

type PromptResponse = {
  animal: string;
  keywords: string;
  style: string;
}

const animalNames: Array<string> = ["cat", "dog", "horse", "kitten", "puppy", "penguin", "bunny"];
const styles: Array<string> = ["watercolor", "anime", "oil paint", "sketch", "photorealistic", "renaissance", "impressionist", "3D rendering"];
const settings: Array<string> = ["forest", "desert", "cafe", "living room", "meadow", "blanket pile"];
const gptPromptTrainingData: ChatCompletionRequestMessage[] = [
  {
    role: "system",
    content: "You are a creative prompt engineer who thinks up prompts for AI text to image generation. Your prompts all involve animals, and aim to produce cute, cozy images that will give viewers a feeling of warmth and contentment. Your prompts use keywords and short phrases, rather than full sentences, and always include at least two words describing the style of the generated image. The prompts are provided as a JSON object that follows the following schema: \n\n`{ \"animal\": string, \"keywords\": string, \"style\": string }`"
  },
  {
    role: "assistant",
    content: "{\"animal\": \"puppy\", \"keywords\": \"snuggled up\", \"style\": \"watercolor\"}"
  },
  {
    role: "assistant",
    content: "{\"animal\": \"kitten\", \"keywords\": \"curled up\", \"style\": \"pastel\"}"
  },
  {
    role: "assistant",
    content: "{\"animal\": \"bunny\", \"keywords\": \"cozy nest\", \"style\": \"chalk drawing\"}"
  },
  {
    role: "assistant",
    content: "{\"animal\": \"panda\", \"keywords\": \"hugging tree\", \"style\": \"cartoon\"}"
  },
  {
    role: "assistant",
    content: "{\"animal\": \"duckling\", \"keywords\": \"under a rainbow\", \"style\": \"digital painting\"}"
  },
  {
    role: "assistant",
    content: "{\"animal\": \"teddy bear\", \"keywords\": \"sitting on a shelf\", \"style\": \"knitted\"}"
  },
  {
    role: "assistant",
    content: "{\"animal\": \"baby seal\", \"keywords\": \"playing in snow\", \"style\": \"photorealistic\"}"
  },
  {
    role: "assistant",
    content: "{\"animal\": \"elephant\", \"keywords\": \"splashing in water\", \"style\": \"oil painting\"}"
  },
  {
    role: "assistant",
    content: "{\"animal\": \"penguin\", \"keywords\": \"waddling on ice\", \"style\": \"sketch\"}"
  }
];

function getRandomIntInclusive(max: number): number {
  const min: number = Math.ceil(0);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function getRandomImagePrompt(): string {
  const animal: string = animalNames[getRandomIntInclusive(animalNames.length - 1)];
  const style: string = styles[getRandomIntInclusive(styles.length - 1)];
  const setting: string = settings[getRandomIntInclusive(settings.length - 1)];
  return animal + " in " + setting + ", " + style + " style";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getGenerativePromptText(): Promise<string> {
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: gptPromptTrainingData,
    temperature: 0.99,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0.77,
    presence_penalty: 0,
  }).then(res => res.data.choices[0].message?.content);
  if(response){
    const responseObj = JSON.parse(response) as PromptResponse;
    const prompt = responseObj.animal + " " + responseObj.keywords + ", " + responseObj.style + " style";
    return prompt;
  } else {
    return "error symbol";
  }
}

async function getReplicateImagePromise(promptString: string): Promise<object> {
  const model = "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";
  const input = { prompt: promptString, num_inference_steps: 100 };
  return replicate.run(model, { input });
}

export async function load() {
  const imgPrompt = await getGenerativePromptText();
  return {
    imagePrompt: imgPrompt,
    streamed: {
      replicateOutputPromise: getReplicateImagePromise(imgPrompt)
    }
  };
}

