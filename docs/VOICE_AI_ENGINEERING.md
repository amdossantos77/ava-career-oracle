# Engenharia de Voice AI: O Guia Definitivo

Este manual cobre a teoria e a prática de criar agentes de voz de alta performance, focando na ElevenLabs Conversational AI.

## 1. O Pipeline da Voz (STT -> LLM -> TTS)

Um agente de voz não é um bloco único, mas sim uma "cascata" de três inteligências:

1.  **STT (Speech-To-Text):** Transforma as ondas de áudio do microfone em texto. 
    *   *Desafio:* Ruído de fundo e sotaques.
    *   *Professional Tip:* A ElevenLabs usa modelos otimizados para capturar a intenção mesmo com interrupções.
2.  **LLM (Large Language Model):** Recebe o texto e gera uma resposta.
    *   É aqui que vive o "Oráculo". Ele analisa se o utilizador está interessado numa vaga ou apenas curioso.
3.  **TTS (Text-To-Speech):** Transforma a resposta do LLM em áudio humano.
    *   *Diferencial ElevenLabs:* Eles usam **Streaming TTS**, o que significa que o áudio começa a ser reproduzido enquanto o resto da frase ainda está a ser gerada.

---

## 2. Latência: O Inimigo Nº 1

Em conversas humanas, respondemos em cerca de **200ms - 300ms**. Se a IA demorar 2 segundos, a conversa morre. Como resolvemos isto?

*   **VAD (Voice Activity Detection):** O sistema precisa de saber exatamente quando paraste de falar para não te interromper, mas também para não ficar "a pensar" tempo demais.
*   **WebSockets:** Em vez de fazer pedidos HTTP normais (que têm muita overhead), usamos WebSockets para manter uma ligação aberta e constante entre o teu browser e a ElevenLabs.

---

## 3. Prompt Engineering para Voz

Escrever para ser lido é diferente de escrever para ser ouvido.
*   **Instruções de Estilo:** No Oráculo, pedimos frases curtas e diretas. Frases longas tornam a voz monótona e aumentam a latência.
*   **Tratamento de Números:** Garantimos que a IA diga "quarenta e dois" e não "quatro dois".
*   **Contexto de Ferramentas (Tool Calling):** Ensinamos o agente a dizer "Deixa-me ver as vagas..." antes de chamar o nosso backend, para preencher o silêncio enquanto a API responde.

---

## 4. Estratégia de "Interrupção"

Um agente profissional deve ser capaz de ser interrompido (**Barge-in**). Se o utilizador disser "Cala-te, já percebi!", a ElevenLabs detecta o áudio, interrompe o TTS e volta a ouvir imediatamente. Isto é gerido automaticamente pelo SDK que instalámos.

---

## 5. Implementação Prática neste Projeto

No ficheiro `frontend/app/page.tsx`, o hook `useConversation` gere este ciclo de vida:
*   **status == 'connected':** O WebSocket está aberto.
*   **isSpeaking:** Indica quando o TTS está ativo (usamos isto para animar a nossa UI).
