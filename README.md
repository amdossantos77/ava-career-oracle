# 🎙️ AVA Voice Challenge: Oráculo de Carreira da 42

> **"Reason with rigor, think with heart."** - Este projeto é uma demonstração técnica de um Agente de Voz IA de alta performance, desenvolvido como parte da candidatura para **Voice AI Engineer na AVA AI**.

## 🌟 O Conceito
O **Oráculo da 42** é um agente conversacional desenhado para guiar potenciais alunos no ecossistema da 42. Ele não apenas responde a perguntas, mas integra-se com APIs externas para verificar vagas de estágio em tempo real e capturar leads qualificadas.

## 🛠️ Tech Stack
*   **Voice AI:** [ElevenLabs Conversational AI](https://elevenlabs.io/) (SDK de React).
*   **Frontend:** Next.js 15, Tailwind CSS 4, Framer Motion (UI Premium/Glassmorphism).
*   **Backend:** FastAPI (Python 3.12+), Pydantic v2 (Clean Architecture).
*   **Docs:** Documentação técnica detalhada incluída na pasta `/docs`.

## 🚀 Como Executar

### 1. Backend
```bash
cd backend
pip install fastapi uvicorn
python main.py
```

### 2. Frontend
```bash
cd frontend
npm install
# Cria o ficheiro .env.local baseado no .env.local.example
npm run dev
```

## 🧠 A Lógica do Agente
O agente utiliza um **Pipeline de Baixa Latência** via WebSockets. Ele é capaz de:
1.  Checkar vagas live via `GET /check-slots`.
2.  Sincronizar leads com o CRM via `POST /capture-lead`.
3.  Manter uma persona consistente e mentorado (persona "Crack da 42").

## 📄 Documentação Detalhada
Para uma compreensão profunda de cada camada, consulta:
*   [Arquitetura do Sistema](docs/SYSTEM_ARCHITECTURE.md)
*   [Engenharia de Voz](docs/VOICE_AI_ENGINEERING.md)
*   [Guia de Frontend](docs/FRONTEND_MASTERCLASS.md)
*   [Integração de Backend](docs/BACKEND_INTEGRATION.md)

---
Desenvolvido com excelência técnica e foco em resultados.
