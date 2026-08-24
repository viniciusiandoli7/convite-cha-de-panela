# Convite — Chá de Casa Nova | Vinicius & Mariana

Versão atualizada com fluxo de confirmação + presentes via Pix.

## Fluxo
1. O convidado entra no convite.
2. Confirma nome e número de pessoas.
3. A página abre automaticamente a etapa de presentes.
4. O convidado escolhe um presente simbólico ou digita outro valor.
5. O site gera um Pix com valor preenchido para a chave `41356973809` (Vinicius / Itaú).
6. Depois do envio, o convidado toca em “Já fiz o Pix” e o presente é registrado no mural.

## Importante sobre confirmação de pagamento e mural
Esta versão continua sendo um site estático (HTML/CSS/JS). Por segurança, um navegador não consegue consultar a conta do Itaú para saber se o Pix realmente caiu.

O botão “Já fiz o Pix” registra a DECLARAÇÃO do convidado, não uma confirmação bancária.

Além disso, o mural atual usa `localStorage`, portanto os registros ficam visíveis apenas no navegador/dispositivo que registrou o presente. Para que todos os convidados vejam o mesmo mural em tempo real, é necessário conectar um banco de dados/backend (por exemplo Supabase/Firebase) ou uma API própria. Isso requer credenciais do projeto hospedado e não deve ser embutido sem configuração adequada.

## Personalização pendente
No `index.html`, procure por `Em breve` para trocar:
- Data
- Horário
- Local

## Arquivos
- `index.html` — estrutura e textos
- `style.css` — design responsivo
- `script.js` — RSVP, lista de presentes, Pix e mural local
- `assets/` — imagens originais preservadas

## Hospedagem
Pode ser publicado no Netlify, Vercel ou GitHub Pages. Para o QR Code, a página usa o serviço público `api.qrserver.com`; o Pix copia-e-cola é gerado localmente mesmo que o QR externo não carregue.
