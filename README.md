# Convite — Chá de Casa Nova | Vinicius & Mariana

## Estrutura

```
convite-cha-de-casa-nova/
├── index.html      → estrutura da página
├── style.css       → todo o visual (cores, tipografia, layout, animações)
├── script.js       → confirmação de presença via WhatsApp + animações de rolagem
└── assets/
    ├── hero.jpg         → foto principal (tela inicial)
    ├── galeria-dip.jpg  → foto da galeria (dançando no jardim)
    ├── galeria-1.jpg    → foto da galeria (abraço no mirante)
    └── galeria-2.jpg    → foto da galeria (selfie fim de tarde)
```

## Como usar

Abra o `index.html` em qualquer navegador — funciona direto, sem precisar de servidor.

Para hospedar (deixar com um link público pra mandar aos convidados), você pode
arrastar essa pasta inteira em serviços gratuitos como **Netlify Drop**, **Vercel**
ou **GitHub Pages**.

## O que editar quando tiver data e local fechados

Abra `index.html` e procure por `em breve` (3 ocorrências, dentro da seção
"Receita para uma casa nova") — troque pela data, horário e endereço reais.

## Número de WhatsApp das confirmações

Está no início do arquivo `script.js`, na constante `WHATSAPP_NUMBER`.

## Trocar fotos

Basta substituir os arquivos dentro de `assets/` mantendo os mesmos nomes
(`hero.jpg`, `galeria-dip.jpg`, `galeria-1.jpg`, `galeria-2.jpg`), ou trocar os nomes
referenciados no `index.html` (procure por `src="assets/...`).
