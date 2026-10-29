# Nutri Salvation — projeto para VS Code

## Instalar
1. Extraia o ZIP em uma pasta temporária.
2. Copie index.html, style.css, play.css, app.js, play.js e bowl.jpg para:
   C:\Users\arian\OneDrive\Desktop\Nutri-Salvation
3. Se já existirem arquivos com esses nomes, guarde uma cópia deles antes de substituir.
   Preserve pastas .git, arquivos .env, package.json e quaisquer outros arquivos existentes.
4. No VS Code, abra essa pasta. Para visualizar, abra index.html no navegador.
   Se já tiver a extensão Live Server instalada, pode usar Open with Live Server.

## Arquivos
- index.html: estrutura, formulário e seções do site.
- style.css: estilos gerais e responsividade.
- play.css: aparência e animações do Nutri Lab.
- app.js: questionário e geração local de PDF.
- play.js: jogo, ingredientes, missões e montador de sobremesa.
- bowl.jpg: imagem do prato principal.

## Funcionamento
Projeto estático em HTML, CSS e JavaScript, sem etapa de build ou dependências npm.
Inclui três missões culinárias, exploração do prato e montagem de sobremesa.
Fontes do Google são carregadas quando há internet; há fontes alternativas locais.
Dados preenchidos ficam apenas na memória da página. O PDF é gerado no navegador.
A versão não inclui busca automática na internet nem prescrição de dieta clínica.

A cópia local é independente da publicação hospedada: editar aqui não publica automaticamente.
