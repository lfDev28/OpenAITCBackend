const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(express.json());

app.post('/find-complexity', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${prompt}
            
            The time complexity of this algorithm is:
            ###
            `,
      temperature: 0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['\n'],
    });

    return res
      .status(200)
      .json({ success: true, data: response.data.choices[0].text });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.response ? error.response.data : error.message,
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
