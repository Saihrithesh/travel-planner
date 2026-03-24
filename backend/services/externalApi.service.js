import axios from 'axios';
import OpenAI from 'openai';

// Free weather API using open-meteo (No key required for basic usage)
export const fetchWeather = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    return response.data.current_weather;
  } catch (error) {
    throw new Error('Could not fetch weather data');
  }
};

// Generates an AI-based itinerary using OpenAI
export const generateAItinerary = async (destination, days, preferences) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful travel planner assistant.'
        },
        {
          role: 'user',
          content: `Generate a ${days}-day itinerary for ${destination}. Preferences: ${preferences}. Format the output as purely JSON where keys are "day1", "day2" etc., and each has an "activities" array with objects containing "time" and "description".`
        }
      ]
    });

    const jsonText = completion.choices[0].message.content;
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('AI Generation Error:', error.message);
    throw new Error('Failed to generate AI itinerary');
  }
};
