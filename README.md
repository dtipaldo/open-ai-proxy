# OpenAI API Proxy Server

A simple Deno backend that securely proxies requests to OpenAI's API.

## Features

- Proxy requests to OpenAI's API
- Environment variable configuration
- CORS support for frontend integration
- Error handling
- Typed with TypeScript

## Setup

1. Clone this repository
2. Copy `.env.example` to `.env`
3. Add your OpenAI API key to the `.env` file

```bash
cp .env.example .env
# Edit .env with your OpenAI API key
```

## Running Locally

```bash
deno run --allow-net --allow-env --allow-read app.ts
```

Or use the provided script:

```bash
./start.sh
```

## Endpoints

### OpenAI Proxy

`POST /api/openai/:endpoint`

This endpoint forwards requests to the corresponding OpenAI API endpoint.

Examples:

- `/api/openai/chat/completions` - For chat completions
- `/api/openai/embeddings` - For creating embeddings
- `/api/openai/images/generations` - For image generation

The request body will be forwarded as-is to OpenAI's API. The response from OpenAI will be returned directly.

### Health Check

`GET /health`

Returns a simple status check to verify the server is running.

## Deployment

This server can be deployed to any platform that supports Deno, such as:

- [Deno Deploy](https://deno.com/deploy)
- [DigitalOcean](https://www.digitalocean.com/)
- [Heroku](https://www.heroku.com/)
- [AWS](https://aws.amazon.com/)

For Deno Deploy, you can deploy directly from your GitHub repository.

## Frontend Integration

In your frontend code, make requests to your deployed backend instead of directly to OpenAI:

```javascript
// Instead of calling OpenAI directly
const response = await fetch(
  "https://your-backend-url.com/api/openai/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello!" },
      ],
    }),
  }
);

const data = await response.json();
```

## Security Considerations

- Keep your `.env` file secure and never commit it to version control
- Consider implementing additional authentication for your API
- Set appropriate CORS policies in production
