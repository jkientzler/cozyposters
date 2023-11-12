import { OPEN_AI_KEY, REPLICATE_API_TOKEN, WINSTON_LOG_LEVEL, DEV_LOGTAIL_TOKEN } from '$env/static/private';
import { OpenAI } from "openai";
import Replicate from "replicate";
import winston from 'winston';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';


//REPLICATE
const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

//LOGTAIL
const logtail = new Logtail(DEV_LOGTAIL_TOKEN);

type PromptResponse = {
  animal: string;
  keywords: string;
  setting: string;
  style: string;
}

enum LogLevel {
    Error = 'error',
    Warn = 'warn',
    Info = 'info',
    Http = 'http',
    Verbose = 'verbose',
    Debug = 'debug',
    Silly = 'silly'
}

//winston
const logger = winston.createLogger({
  level: WINSTON_LOG_LEVEL || LogLevel.Info,
  format: winston.format.json(),
  transports: new LogtailTransport(logtail),
});

const gptPromptTrainingData: OpenAI.Chat.ChatCompletionMessageParam[] = [
  {
    "role": "system",
    "content": "You are a creative prompt engineer who thinks up prompts for AI text to image generation. Your prompts all involve domesticated mammals, and aim to produce cute, cozy images that will give viewers a feeling of warmth and contentment. Your prompts use keywords and short phrases which do not use compositionality, always include keywords describing the setting/background of the image, and always include a combination of different styles to describe the style of the generated image. The prompts are provided as a JSON object that follows the following schema: \n\n`{ \"animal\": string, \"keywords\": string, \"setting\": string, \"style\": string }`\n\nExamples of good styles to use: impressionist, soft focus, oil painting, watercolor, 3D rendering, digital illustration, anime, kawaii\n\nExamples of bad styles that you should not use: photorealistic, photography, hd, minimalistic, cartoon, pastel, high quality\n\nExamples of animals to use: cat, dog, horse, kitten, puppy, bunny, rabbit, hamster, guinea pig, chinchilla\n\nExamples of possible settings: forest, desert, cafe, living room, meadow, blanket pile"
  },
  {
    "role": "assistant",
    "content": "{\"animal\": \"dog\", \"keywords\": \"knitting, fireplace\", \"setting\": \"cozy living room\", \"style\": \"watercolor\"}"
  },
  {
    "role": "assistant",
    "content": "{\"animal\": \"cat\", \"keywords\": \"reading, window view\", \"setting\": \"sunlit study\", \"style\": \"soft focus\"}"
  },
  {
    "role": "assistant",
    "content": "{\"animal\": \"rabbit\", \"keywords\": \"hot chocolate, snow\", \"setting\": \"winter cabin\", \"style\": \"impressionist\"}"
  },
  {
    "role": "assistant",
    "content": "{\"animal\": \"hamster\", \"keywords\": \"baking, kitchen counter\", \"setting\": \"rustic farmhouse kitchen\", \"style\": \"oil painting\"}"
  },
  {
    "role": "assistant",
    "content": "{\"animal\": \"guinea pig\", \"keywords\": \"flower crown, picnic blanket\", \"setting\": \"blooming garden\", \"style\": \"3D rendering\"}"
  },
  {
    "role": "assistant",
    "content": "{\"animal\": \"dog\", \"keywords\": \"painting, art supplies\", \"setting\": \"art studio\", \"style\": \"digital illustration\"}"
  },
  {
    "role": "assistant",
    "content": "{\"animal\": \"cat\", \"keywords\": \"tea, books\", \"setting\": \"cozy library\", \"style\": \"anime\"}"
  },
  {
    "role": "assistant",
    "content": "{\"animal\": \"rabbit\", \"keywords\": \"gardening, sun hat\", \"setting\": \"enchanted garden\", \"style\": \"kawaii\"}"
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getGenerativePromptText(): Promise<string> {
  logger.log(LogLevel.Debug, 'Entered getGenerativePromptText');
  
  const openai = new OpenAI({
    apiKey: OPEN_AI_KEY,
  });
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: gptPromptTrainingData,
    temperature: 1.5,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: { type: "json_object" },
  }).then(res => res.choices[0].message?.content); //TODO: get details for logging here?
  if(response){
    const responseObj = JSON.parse(response) as PromptResponse;
    const prompt = responseObj.animal + " " + responseObj.keywords + ", " + responseObj.setting + ", " + responseObj.style + " style";
    logger.log(LogLevel.Info, 'response received from createChatCompletion', {prompt: prompt});
    return prompt;
  } else {
    logger.log(LogLevel.Error, 'await openai.createChatCompletion failed'); //TODO: add error details
    return "error symbol";
  }
}

async function getReplicateImagePromise(promptString: string): Promise<object> {
  logger.log(LogLevel.Debug, 'Entered getReplicateImagePromise');
  const model = "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf";
  const input = { prompt: promptString, num_inference_steps: 100 };
  logger.log(LogLevel.Debug, 'Returning output of replicate.run() now.');
  return replicate.run(model, { input });
}

export async function load() {
  logger.log(LogLevel.Debug, 'Entered load');
  const imgPrompt = await getGenerativePromptText();
  logger.log(LogLevel.Debug, 'Returning image prompt and image promise now.');
  return {
    imagePrompt: imgPrompt,
    streamed: {
      replicateOutputPromise: getReplicateImagePromise(imgPrompt)
    }
  };
}

