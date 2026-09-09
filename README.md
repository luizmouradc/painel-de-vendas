<div align="center">

# Painel de Vendas

Uma aplicação para gerenciar clientes, produtos e vendas, acompanhando os principais dados do negócio de forma simples.

<!-- Quando o projeto estiver online, coloque o link aqui:
### [Acessar projeto](LINK_DO_DEPLOY)
-->

<br>

</div>

---

## Sobre o projeto

O **Painel de Vendas** é uma aplicação full stack que desenvolvi para praticar desenvolvimento com Python, APIs REST, banco de dados e manipulação de dados.

A aplicação permite cadastrar clientes e produtos, registrar vendas e acompanhar informações como faturamento, quantidade de vendas, ticket médio, produtos mais vendidos e estoque.

O front-end foi desenvolvido em React e se comunica com uma API criada em FastAPI. Os dados são armazenados em um banco SQLite durante o desenvolvimento local.

---

## Funcionalidades

- Cadastro e consulta de clientes
- Consulta de CEP por meio de API externa
- Cadastro e edição de produtos
- Controle de estoque
- Registro de vendas
- Atualização automática do estoque após uma venda
- Histórico de vendas
- Filtro de clientes por cidade
- Filtro de produtos por categoria
- Indicadores de faturamento
- Cálculo de ticket médio
- Ranking de produtos por faturamento
- Identificação de produtos com estoque baixo
- Verificação do status da API
- Testes automatizados do back-end

---

## Tecnologias utilizadas

<div align="center">

<img src="https://skillicons.dev/icons?i=python,fastapi,react,js,html,css,sqlite,docker&theme=dark"/>

</div>

<br>

Outras ferramentas e recursos utilizados no projeto:

- **SQLAlchemy** para comunicação com o banco de dados
- **Pandas** para tratamento e análise de dados
- **NumPy** para apoio ao processamento dos dados
- **Pytest** para testes automatizados
- **Vite** para desenvolvimento do front-end
- **Uvicorn** para execução da API
- **ViaCEP** para consulta de endereços por CEP
- **GitHub Actions** para execução automática dos testes
- **Airflow** para uma introdução à automação de pipelines de dados

---

## Estrutura do projeto

```text
painel-de-vendas/
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── analytics.py
│   └── integrations.py
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       ├── api.js
│       └── styles.css
│
├── etl/
├── airflow/
├── data/
├── sql/
├── tests/
├── requirements.txt
└── seed.py
```

---

## Demonstração

<div align="center">

### Visão geral

<!-- Adicione aqui o print da tela principal -->

<br><br>

### Clientes

<!-- Adicione aqui o print da tela de clientes -->

<br><br>

### Produtos

<!-- Adicione aqui o print da tela de produtos -->

<br><br>

### Vendas

<!-- Adicione aqui o print da tela de vendas -->

</div>

---

## Como executar

Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/painel-de-vendas.git
```

Entre na pasta:

```bash
cd painel-de-vendas
```

### Back-end

Crie o ambiente virtual:

```bash
python -m venv .venv
```

No Windows, ative o ambiente:

```bash
.venv\Scripts\Activate.ps1
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Carregue os dados iniciais:

```bash
python seed.py
```

Execute a API:

```bash
uvicorn app.main:app --reload
```

A API ficará disponível em:

```text
http://127.0.0.1:8000
```

A documentação do FastAPI pode ser acessada em:

```text
http://127.0.0.1:8000/docs
```

### Front-end

Em outro terminal, entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O endereço para acessar o front-end será exibido no terminal pelo Vite.

Normalmente:

```text
http://localhost:5173
```

---

<div align="center">

Feito por <a href="https://github.com/luizmouradc">Luiz Inácio</a>

</div>
