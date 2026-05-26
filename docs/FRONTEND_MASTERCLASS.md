# Frontend Masterclass: Design Premium com Next.js 15

Este documento explica as escolhas estéticas e técnicas da interface do Oráculo.

## 1. O Conceito Visual: Glassmorphism Dark
Para a AVA AI, não queríamos uma interface simples. Queríamos algo que parecesse "State of the Art".
*   **Fundo Negro Absoluto:** Reduz o cansaço visual e destaca os elementos de brilho.
*   **Ambience Glow:** Usamos duas "elipses" de luz suave com muito blur atrás do conteúdo para dar profundidade.

## 2. Tailwind CSS 4 & Variáveis CSS
O projeto usa a nova versão do Tailwind. Em vez de `tailwind.config.js`, usamos o ficheiro `globals.css` com a regra `@theme`.
*   **Vantagem:** Maior integração com as variáveis nativas do browser, resultando num bundle final mais pequeno.

## 3. Animações com Framer Motion
A "Aura" central não é um vídeo, é código vivo.
*   **Voice Wave:** Usamos um array de barras que animam a sua altura conforme o estado `isSpeaking`.
*   **AnimatePresence:** Garante que quando o Oráculo muda de "Idle" para "Ouvindo", a transição seja suave e não um corte seco.

## 4. O Componente OraclePage (`page.tsx`)
Este é um **Client Component** (indicado por `"use client"`).
*   **Porquê?** Porque precisamos de aceder a APIs do browser como a `getUserMedia` (microfone) e o `WebSocket`.
*   **Clean Code:** Separamos a lógica do SDK da ElevenLabs da parte visual para facilitar a manutenção.

## 5. Estratégia de Captura de Lead
Em termos de UX Profissional, o botão de "Falar" é o nosso CTA principal. O objetivo é que o utilizador se sinta atraído pela "magia" da voz e, durante a conversa, acabe por deixar os seus dados (que o agente captura via Backend).
