# Nutri Salvation — melhoria da experiência do perfil

Este pacote foi construído sobre os arquivos vistos em `ViniciosAlvees/Nutri-Salvation` (branch `main`, 29/10/2026). Ele não substitui `app.js`, `style.css`, `play.js`, `play.css`, as imagens nem o jogo Nutri Lab.

## Arquivos que você precisa acrescentar

- `nutri-upgrade.js` — novas perguntas, restrições, animação e guia/PDF enriquecido.
- `nutri-upgrade.css` — estilos responsivos e confetes.
- `scripts/aplicar-atualizacao.mjs` — conecta os dois arquivos ao `index.html`, sem apagar o resto.

## Como aplicar no VS Code

1. Extraia o ZIP dentro da pasta raiz do seu repositório local (onde está o `index.html`).
2. Abra o terminal na raiz do projeto e execute:

   ```bash
   node scripts/aplicar-atualizacao.mjs
   npm install
   npm run build
   npm run dev
   ```

3. Verifique o formulário, inclusive uma pessoa com alergia/restrição, outra sem alergia, alguém com treino e alguém menor de 18 anos. Veja a mensagem de parabéns e o PDF.
4. Commit sugerido:

   ```bash
   git add index.html nutri-upgrade.js nutri-upgrade.css scripts/aplicar-atualizacao.mjs
   git commit -m "feat: ampliar perfil com restricoes, hidratacao, sono e celebracao"
   git push origin main
   ```

O instalador pode ser executado mais de uma vez sem duplicar links. Ele não modifica os arquivos antigos de lógica e estilo; apenas `index.html`. Se o index tiver sido reorganizado, revise manualmente as tags de script e CSS antes de executar.

## Regras de saúde e privacidade

- Alergias e restrições geram ideias de **organização** sem ingredientes apresentados como seguros; a pessoa pode baixar o resumo e discutir com um nutricionista.
- Para quem precisa de dieta clínica ou menores de 18 anos, não são apresentados volumes fixos de água nem prescrição nutricional.
- Os horários e 250 mL do exemplo são **ilustrativos, não uma meta automática**. Esporte e calor podem aumentar perdas; nunca recomendamos forçar água ou superar a sede e as perdas.
- O sono é comparado com faixas etárias gerais.
- Tudo funciona no navegador; o formulário não envia dados a um servidor. O PDF contém dados pessoais, portanto deve ser guardado com cuidado.

### Referências

- [Ministério da Saúde, Guia Alimentar](https://www.gov.br/saude/pt-br/assuntos/saude-brasil/publicacoes-para-promocao-a-saude/guia_alimentar_populacao_brasileira_2ed.pdf/view)
- [NIH, sono por faixa etária](https://www.nhlbi.nih.gov/health/sleep/how-much-sleep)
- [NATA, reposição de líquidos na atividade física](https://pmc.ncbi.nlm.nih.gov/articles/PMC5634236/)

## Limitação importante

O ambiente desta conversa não tem acesso de escrita ao seu GitHub ou ao VS Code local; por isso o pacote está pronto para ser adicionado, mas **não houve push automático**. Recomenda-se testar o PDF e a interface em navegadores de computador e celular depois de inserir os arquivos.
