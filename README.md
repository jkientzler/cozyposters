# CozyPosters
This is a project I made after hammocking in the park and thinking "gee, how wonderful it would be to have an endlessly refresh-able website of adorable animal images."

You can see it live at cozyposters.com. Be warned though, its pretty rough.

## Under the Hood
I decided to use this project to learn ChatGPT APIs, Replicate's StableDiffusion APIs, Svelte, Vercel, and AWS stuff. In the past I've used React & Azure so this was an interesting experience. This is also my first experience using AI models at all.

### Other issues
AI is a fickle beast, and the ChatGPT prompt generator needs some massaging to make good prompts for the Replicate StableDiffusion2 model to generate images from. 

I also need to improve the performance with some frontloading of images/clean up my promise handling.

My ChatGPT model *loves* hamsters. So right now the site is mostly cozy hamsters.

There's also no styling or UI right now. Its a glorified proof of concept.
