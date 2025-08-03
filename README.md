# 🤖 NestJS Telegram-Ollama Microservice

A lightweight and simple NestJS microservice that connects a Telegram bot with [Ollama](https://ollama.com) — enabling AI-powered chat interactions right from Telegram.

## ✨ Features

- 🔗 Integrates Telegram Bot API with Ollama locally or remotely
- 🧠 Send messages to Ollama and receive AI responses
- ⚙️ Built with NestJS for modularity and scalability
- 🪶 Minimal and easy to extend

## 🧩 Architecture Overview

This service acts as a bridge between a Telegram bot and an Ollama LLM instance. When a user sends a message to the Telegram bot, the service forwards it to Ollama and replies with the model's response.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.x
- Docker (optional, for running Ollama locally)
- Telegram Bot Token
- Running instance of Ollama (local or remote)

### Installation

Run ollama locally
```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

```bash
npm i && npm run start 
