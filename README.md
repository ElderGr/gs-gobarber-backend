# GoBarber GoStack
API desenvolvida para o agendamento de horários para uma barbearia ou cabeleireiro.
Projeto desenvolvido durante a Semana 2 do bootcamp GoStack afim de exercitar conceitos de arquitetura de software, persistência de dados, orm com o TypeORM, dentre outros conceitos.

## ⚙ Pré-requisitos
Para a execução do projeto em seu ambiente local é necessário possuir instalado:

- NodeJS em sua versão LTS
> https://nodejs.org/en/

- Ambiente PostgreSQL configurado ou imagem Docker PostgreSQL

## 🛠 Guia de instalação
1. Faça download do projeto do github
2. Após ter feito download do projeto, acesse o diretorio raiz do mesmo via linha de comando
3. No terminal, execute o comando npm install para instalar as dependências do projeto (Caso você tenha o yarn instalado em sua máquina, execute apenas yarn para a instalação das dependencias)
4. Tendo finalizado o processo anterior, execute o comando npm run dev (ou yarn dev), para executar a API e a partir desse momento a API estará sendo executada de forma local na porta 5000

5. Realize a configuração do seu ambiente local ou de uma imagem docker PostgreSQL, com duas bases nomeadas `gostack_gobarber`.
6. Execute o comando `yarn typeorm migration:run` ou `npm run typeorm migration:run` para a execução das migrations no banco de dados

## 📋 Comandos disponíveis
* dev:server: execução da API em ambiente local
* test: execução dos testes validando o desenvolvimento da api
* typeorm: execução dos comandos disponiveis da cli do typeorm
* build: gera o bundler dos arquivos Typescript da aplicação
