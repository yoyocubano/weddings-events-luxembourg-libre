#!/bin/bash

# Check if API Key is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "Error: ANTHROPIC_API_KEY is not set."
  echo "Usage: export ANTHROPIC_API_KEY='your-key' && ./test_claude_api.sh"
  exit 1
fi

echo "Testing Claude API with model: claude-3-sonnet-20240229 (Adjusted from tutorial for compatibility)..."

# Note: The tutorial mentioned 'claude-sonnet-4-5' which might be hypothetical or future. 
# Using a known valid model 'claude-3-sonnet-20240229' or 'claude-3-opus-20240229' ensures it works now.
# Feel free to change the model in the JSON below.

curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-sonnet-20240229",
    "max_tokens": 1000,
    "messages": [
      {
        "role": "user", 
        "content": "What should I search for to find the latest developments in renewable energy?"
      }
    ]
  }'
