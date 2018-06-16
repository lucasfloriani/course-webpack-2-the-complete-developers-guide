# O que é Webpack

Sua principal funcionalidade é combinar arquivos (js, sass, etc) gerando assim um bundle destes arquivos, resultando em uma melhor performance comparado ao carregamento de todos os arquivos separados.

Junto com está funcionalidade, pode se adicionar funções extras como minificação de arquivos, transpilação de códigos, adição de suporte a navegadores, dentre muitas outras coisas.

## Code splitting

Carregar certas partes do bundle somente quando for realmente necessário.

### Rimraf

Gerencia inconsistencias do comando de remover arquivos de sistemas operacionais, onde cada um contem seu próprio comando para remoção.

## Loaders (module)

Realizam um preprocessamento nos arquivos antes de juntarem no arquivo bundle, como por exemplo loaders para fazer a transpilação para códigos javascript com maior suporte com o babel.

### Babel modules

Babel é separado em 3 modulos, sendo estes:

* babel-loader: Mostra ao babel como trabalhar com o webpack;
* babel-core: Sabe como pegar o código, transpila-lo e gerar arquivos de saida;
* babel-preset-env: Lista de regras mostrando ao babel exatamente qual parte dos códigos ES6/7/8... ele deve verificar e como tornálo código ES5.

### CSS modules

* css-loader: Sabe como lidar com imports de arquivos css;
* style-loader: Pegar imports de arquivos css e adicionam eles ao documento HTML;
* extract-text-webpack-plugin: Pega uma referência a um loader e roda o webpack com ele e pega qualquer texto que é gerado por este loader e salva em um arquivo separado no diretório de saida.

### Image modules

* image-webpack-loader: Faz a compressão da imagem automaticamente como sites igual o tinypng;
* url-loader: Verifica se a imagem é pequena, se for ele adiciona no arquivo bundle javascript, se não ele cria um arquivo no diretório de saida.

## Plugins

Igual aos loaders porem fazem acessos no arquivos bundles.

### CommonsChunk plugin

Verifica se foi importado arquivos duplicados e adiciona somente no local indicado.

### HTMLWebpackPlugin

Adiciona automaticamente os links dos scripts criando seu próprio arquivo html, substituindo a função de manualmente trocar os arquivos bundle no html.
