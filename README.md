# InsightFlow - Sistema Full Stack de Vendas e Analytics

Projeto de portfólio voltado para vagas de estágio/júnior em desenvolvimento back-end, full stack e dados.

O sistema possui um front-end em React integrado a uma API REST com FastAPI. Ele registra clientes, produtos e vendas, controla estoque, armazena dados em banco relacional, realiza tratamento de dados com Pandas/Numpy e possui uma DAG simples de Airflow para automatizar o pipeline de dados.

## Tecnologias

- React
- Vite
- HTML/CSS
- JavaScript
- Python 3
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pandas
- Numpy
- Airflow
- Power BI
- Pytest
- Docker
- Git/GitHub
- GitHub Actions

## O problema de negócio

Uma pequena loja precisa centralizar suas vendas e entender melhor o desempenho do negócio. Os dados estavam espalhados em planilhas, dificultando respostas para perguntas simples:

- Quanto a empresa faturou?
- Quais produtos vendem mais?
- Quais categorias geram mais receita?
- Quais produtos estão com estoque baixo?
- Em quais cidades estão os clientes mais ativos?

O InsightFlow transforma esses dados em uma aplicação simples e analisável.

## Funcionalidades

- Dashboard web com indicadores de negócio
- Cadastro e consulta de clientes
- Consulta de CEP integrada ao cadastro de cliente
- Cadastro, consulta e atualização de produtos
- Registro de vendas
- Validação de estoque
- Atualização automática do estoque após uma venda
- Filtros por cidade e categoria
- Indicadores de vendas via API
- Ranking de produtos por faturamento
- Integração HTTP com serviço externo de CEP
- Tratamento de CSV com Pandas/Numpy
- Automação diária do tratamento com Airflow
- Consultas SQL de exemplo
- Teste automatizado do fluxo principal
- Interface responsiva em React
- Estrutura preparada para dashboard no Power BI

## Estrutura

```text
projeto_vagas_estagio/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── app/
│   ├── analytics.py
│   ├── database.py
│   ├── integrations.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── airflow/dags/
│   └── pipeline_vendas.py
├── data/
│   ├── clientes_seed.csv
│   ├── produtos_seed.csv
│   └── vendas_brutas.csv
├── etl/
│   └── processar_dados.py
├── powerbi/
│   └── README.md
├── sql/
│   └── consultas.sql
├── tests/
│   └── test_api.py
├── .env.example
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Como executar localmente

### 1. Criar ambiente virtual

Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Linux/macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Opção simples: SQLite

Não configure nenhuma variável de ambiente. A aplicação criará `insightflow.db` automaticamente.

```bash
uvicorn app.main:app --reload
```

Abra:

```text
http://127.0.0.1:8000/docs
```

O Swagger permite testar a API diretamente pelo navegador.

### 4. Opção de portfólio: PostgreSQL com Docker

```bash
docker compose up -d
```

Crie um arquivo `.env` a partir de `.env.example` e configure a variável `DATABASE_URL` no terminal antes de iniciar a API.

Exemplo no PowerShell:

```powershell
$env:DATABASE_URL="postgresql+psycopg2://postgres:postgres@localhost:5432/insightflow"
uvicorn app.main:app --reload
```

## Executar o front-end

Com a API rodando em `http://127.0.0.1:8000`, abra outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra:

```text
http://localhost:5173
```

A URL da API pode ser alterada criando `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

O FastAPI já está configurado com CORS para permitir o acesso do front-end local.

## Telas do front-end

### Dashboard

Exibe:

- faturamento total;
- total de vendas;
- ticket médio;
- clientes ativos;
- ranking de produtos;
- produtos com estoque baixo;
- vendas recentes.

### Clientes

Permite cadastrar e filtrar clientes. O campo de CEP usa o endpoint `/integracoes/cep/{cep}` para consultar o ViaCEP através do próprio back-end e preencher a cidade.

### Produtos

Permite cadastrar produtos, alterar nome, categoria, preço e estoque e filtrar o catálogo por categoria.

### Vendas

Permite selecionar cliente e produto, informar quantidade e registrar a venda. A interface mostra o total previsto e o estoque disponível antes da confirmação.

## Endpoints principais

| Método | Endpoint | Objetivo |
|---|---|---|
| GET | `/health` | Verificar se a API está funcionando |
| GET | `/integracoes/cep/{cep}` | Consumir uma API externa via HTTP |
| POST | `/clientes` | Cadastrar cliente |
| GET | `/clientes` | Listar e filtrar clientes |
| POST | `/produtos` | Cadastrar produto |
| GET | `/produtos` | Listar e filtrar produtos |
| PATCH | `/produtos/{id}` | Atualizar produto |
| POST | `/vendas` | Registrar venda |
| GET | `/vendas` | Listar vendas |
| GET | `/analytics/resumo` | Indicadores gerais |
| GET | `/analytics/produtos-top` | Ranking de produtos |

## Exemplo de venda

```json
{
  "cliente_id": 1,
  "produto_id": 2,
  "quantidade": 3
}
```

Ao registrar a venda, a API:

1. verifica se o cliente existe;
2. verifica se o produto existe;
3. valida se existe estoque suficiente;
4. registra a venda;
5. reduz o estoque do produto.

Isso demonstra condicionais, funções, orientação a objetos, banco de dados e regras de negócio.

## Pipeline de dados

Execute:

```bash
python etl/processar_dados.py
```

O script lê `data/vendas_brutas.csv`, remove dados inválidos, converte tipos, calcula faturamento e classifica cada venda em uma faixa usando Pandas e Numpy.

Arquivo gerado:

```text
data/vendas_tratadas.csv
```

## Airflow

A DAG `pipeline_vendas_diario` executa o tratamento dos dados diariamente às 07:00.

Para um projeto de estágio, o objetivo aqui é demonstrar que você entende o papel de um orquestrador. Não é necessário transformar o repositório em uma infraestrutura complexa de Airflow.

## SQL demonstrado

O arquivo `sql/consultas.sql` contém exemplos de:

- SELECT
- WHERE
- JOIN
- INSERT
- UPDATE
- GROUP BY
- ORDER BY
- agregações com SUM

## Testes

Execute:

```bash
pytest -q
```

O teste automatizado cobre o fluxo principal:

```text
criar cliente -> criar produto -> registrar venda -> consultar analytics
```

## Power BI

O diretório `powerbi/` contém a sugestão de dashboard. A ideia é conectar o Power BI ao PostgreSQL e construir gráficos de faturamento, vendas, categorias, produtos e cidades.

## Possível arquitetura em AWS

Uma evolução do projeto poderia utilizar:

```text
Cliente
   |
   v
FastAPI em EC2 ou ECS
   |
   v
PostgreSQL no RDS
   |
   +----> S3 para arquivos CSV
   |
   +----> CloudWatch para logs e monitoramento
```

Uma versão serverless também poderia usar API Gateway + Lambda para alguns serviços menores.

## O que este projeto demonstra para as vagas

### Programação
Variáveis, condicionais, loops, funções, listas, dicionários, módulos e tratamento de dados.

### Orientação a objetos
Os modelos `Cliente`, `Produto` e `Venda` representam entidades do domínio.

### SQL e banco relacional
PostgreSQL, relacionamentos, chaves estrangeiras, SELECT, WHERE, JOIN, INSERT e UPDATE.

### Front-end
React, componentes, estados, formulários, consumo de API com `fetch`, tratamento de erros, atualização da interface e layout responsivo.

### APIs e HTTP
FastAPI, endpoints REST, métodos GET/POST/PATCH, códigos HTTP, CORS, validação de entrada e documentação Swagger. O front-end consome a API via HTTP e o endpoint de CEP também demonstra o back-end atuando como cliente HTTP de outro serviço.

### Dados
Pandas e Numpy para limpeza, transformação, análise e geração de indicadores.

### Airflow
Automação de uma tarefa de processamento de dados.

### Power BI
Visualização dos indicadores de negócio.

### Git/GitHub
O projeto pode ser desenvolvido com branches, commits pequenos, pull requests e code review. O workflow em `.github/workflows/tests.yml` executa os testes automaticamente em pushes e pull requests.

### Testes
Pytest e TestClient para validar o comportamento da API.

### Cloud
Arquitetura proposta com serviços básicos de AWS.

## Sugestão de histórico de commits

```text
feat: cria estrutura inicial da api
feat: adiciona modelos de clientes e produtos
feat: adiciona registro de vendas e controle de estoque
feat: adiciona endpoints de analytics
feat: cria frontend react e integração com a api
feat: adiciona dashboard de indicadores
feat: adiciona telas de clientes produtos e vendas
feat: cria pipeline de tratamento com pandas
feat: adiciona dag do airflow
feat: adiciona consultas sql de exemplo
test: adiciona teste do fluxo de venda
docs: adiciona documentação do projeto
```

## Melhorias futuras

- autenticação com JWT e tela de login;
- paginação dos endpoints;
- migrations com Alembic;
- testes do front-end;
- logs estruturados;
- deploy em AWS;
- integração com Google Analytics para cruzar origem de tráfego e conversões;
- upload de CSV para S3;
- dashboard Power BI publicado;
- mais testes unitários e de integração.

## Como explicar em uma entrevista

> Eu desenvolvi uma aplicação full stack para centralizar vendas de uma pequena loja. Criei o front-end em React e uma API REST em FastAPI, conectada a um banco relacional com clientes, produtos e vendas. O front consome a API via HTTP e permite cadastrar clientes e produtos, registrar vendas e visualizar indicadores. Ao registrar uma venda, o back-end valida o estoque e atualiza o produto. Também criei uma parte de dados com Pandas e Numpy para limpar CSVs e gerar indicadores, usei SQL para consultas analíticas e deixei uma DAG de Airflow para automatizar o processamento. Como evolução, planejei uma arquitetura simples em AWS usando EC2/RDS/S3/CloudWatch.

O objetivo não é mostrar que você domina todas essas tecnologias em nível avançado, e sim demonstrar que consegue integrar conceitos básicos de desenvolvimento, dados e banco de dados em um problema de negócio coerente.
