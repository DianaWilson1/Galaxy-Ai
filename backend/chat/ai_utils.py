import os

import openai
from django.conf import settings

# Configure OpenAI API key
openai.api_key = settings.OPENAI_API_KEY

async def get_ai_response(message_text, conversation_history=None):
    """
    Get response from ChatGPT API

    Args:
        message_text (str): The user's message
        conversation_history (list): Optional list of previous messages for context

    Returns:
        str: AI response text
    """
    try:
        # Format conversation history for the API
        messages = []

        # System message to set the AI's behavior
        messages.append({
            "role": "system",
            "content": "You are Galaxy AI, a helpful and friendly AI assistant. You provide concise, accurate information and assist users with their questions and tasks."
        })

        # Add conversation history if provided
        if conversation_history:
            for msg in conversation_history:
                role = "user" if msg.sender == "user" else "assistant"
                messages.append({"role": role, "content": msg.content})

        # Add the current message
        messages.append({"role": "user", "content": message_text})

        # Make API call to ChatGPT
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",  # or another suitable model
            messages=messages,
            max_tokens=1024,
            temperature=0.7,
        )

        # Extract and return the AI's response
        ai_response = response.choices[0].message.content.strip()
        return ai_response

    except Exception as e:
        # Log the error and return a fallback message
        print(f"Error getting AI response: {str(e)}")
        return "I'm sorry, I'm having trouble processing your request right now. Please try again later."
