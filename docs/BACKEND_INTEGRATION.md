# Backend Integration: O Cérebro de Dados

Este manual detalha como o FastAPI serve de ponte entre a voz e o "negócio".

## 1. FastAPI 0.110+ e Python Async
O nosso backend no diretório `/backend` usa programação assíncrona (`async def`).
*   **Significado Prático:** Enquanto o servidor espera por uma resposta de uma base de dados ou CRM, ele pode processar outros pedidos. Isto é crucial para sistemas de voz onde múltiplos utilizadores podem estar a falar ao mesmo tempo.

## 2. Endpoints Estratégicos

### /check-slots (GET)
*   **Função:** Verifica vagas disponíveis.
*   **Parâmetro:** `role_query`. Se o utilizador disser "Quero um estágio de dev", o agente passa "dev" para este endpoint.
*   **Lógica:** Filtramos a lista de `INTERNSHIPS` por status "Open".

### /capture-lead (POST)
*   **Função:** Regista o nome, telefone e interesse do candidato.
*   **Segurança:** Usamos Pydantic (`StudentLead`) para garantir que nenhum dado malformado entra no sistema.

## 3. Tool Calling (A Magia da Integração)
Na ElevenLabs, configuramos estes endpoints como "Tools". 
1.  O LLM decide: "Preciso de ver se há vagas para responder a este humano".
2.  A ElevenLabs faz o pedido ao teu FastAPI.
3.  O teu FastAPI responde com o JSON das vagas.
4.  O LLM lê o JSON e diz: "Sim! Temos uma vaga para Junior em Paris!".

## 4. Próximos Passos Profissionais (Scalability)
Para levar isto para produção real na AVA:
*   **Banc de Dados:** Trocar a lista em memória por PostgreSQL (via SQLAlchemy ou Tortoise ORM).
*   **Autenticação:** Adicionar API Keys para que apenas o nosso agente de voz possa chamar o backend.
*   **Sentry:** Instalar monitorização de erros para saber se o backend falhou no meio de uma chamada.
