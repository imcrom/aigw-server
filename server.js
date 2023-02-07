const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();




app.use(express.json());

app.get("/api", (req, res) => {
    res.json({"message": "Hello from server!"});
});

app.post("/api", async (req, res) => {


    const data = req.body;
  
    const options = {
        method: 'POST',
        url: 'https://stablediffusionapi.com/api/v3/dreambooth',
        headers: {
          'Content-Type': 'application/json',
        },

        body: {
            key: 'YimEHAg0HxDBkYtZp7X8ZEv7u84XWtt66TgVA78BnGWQlLHe6cdoDQREjpV5',
            model_id: 'realistic-vision-v13',
            prompt: data.posPrompt,
            negative_prompt: data.negPrompt + 'painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime',
            width: '512',
            height: '512',
            samples: '1',
            num_inference_steps: '30',
            seed: null,
            guidance_scale: 7.5,
            webhook: null,
            track_id: null,
          },
          json: true,
        };



        
        try {
            const data = await fetchData(options, options.url);
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    
  });

async function fetchData(options, url) {
  return new Promise((resolve, reject) => {
    const fetch = () => {
      request(options, (error, response, body) => {
        if (error) {
          reject(error);
        }
        console.log(response.body);
        if (response.body.status === "processing") {
          setTimeout(() => {
            fetch();
          }, response.body.eta * 1000);
        } else if (response.body.status === "success") {
          resolve(body);
        } else {
          clearTimeout();
          resolve(new Error("Unsupported status: " + response.body.status));
        }
      });
    };
    fetch();
  });
}

app.listen(5000, () => {console.log("server started on port 5000")});