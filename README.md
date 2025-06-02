# Organizo

Organizo é um aplicativo web para organização pessoal, focado em produtividade, tarefas, calendário e motivação diária. O projeto foi desenvolvido com React (Next.js), TypeScript e TailwindCSS, com uma interface moderna, responsiva e personalizável por temas.

## Funcionalidades

- **Lista de Tarefas:** Crie, edite, conclua e organize tarefas e subtarefas.
- **Calendário Semanal:** Visualize sua semana, veja compromissos e eventos com destaque para o dia atual e eventos marcados.
- **Temas Personalizados:** Escolha entre temas como Classic, Sunset e Ocean, cada um com visual e cores únicos.
- **Gráfico de Produtividade:** Acompanhe seu desempenho nos últimos 7 dias de forma visual e interativa.
- **Cartão Motivacional:** Receba frases motivacionais diárias, com opção de copiar e trocar a frase.
- **Acessibilidade:** Interface acessível, com navegação por teclado e contraste ajustado por tema.

## Tecnologias Utilizadas

- **Frontend:** React, Next.js, TypeScript
- **Estilização:** TailwindCSS, CSS Modules
- **Ícones:** Heroicons
- **Gerenciamento de Tema:** Context API

## Estrutura do Projeto

```
frontend/
  ├── src/
  │   ├── components/
  │   │   ├── CalendarWeek.tsx
  │   │   ├── ProductivityChart.tsx
  │   │   ├── MotivationalCard.tsx
  │   │   ├── Card.tsx
  │   │   ├── ThemeContext.tsx
  │   │   └── ...
  │   ├── pages/
  │   └── ...
  └── ...
```

## Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/organizo.git
   cd organizo/frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse em:**  
   [http://localhost:3000](http://localhost:3000)

## Personalização de Temas

- Acesse as configurações de tema no menu do app.
- Os temas alteram não só as cores, mas também o visual dos cards, botões e elementos do calendário.

## Contribuição

Contribuições são bem-vindas!  
Abra uma issue ou envie um pull request.

## Licença

Este projeto está sob a licença MIT.

---
