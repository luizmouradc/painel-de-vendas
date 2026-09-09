# Front-end do InsightFlow

Interface web desenvolvida em React + Vite para consumir a API FastAPI do projeto.

## Funcionalidades

- Dashboard com faturamento, total de vendas, ticket médio e clientes ativos
- Ranking visual dos produtos com maior faturamento
- Alerta de produtos com estoque baixo
- Cadastro e filtro de clientes
- Consulta de CEP pela própria API do projeto
- Cadastro, edição e filtro de produtos
- Registro de vendas
- Atualização automática do estoque após uma venda
- Histórico de vendas
- Layout responsivo

## Executar

Com a API disponível em `http://127.0.0.1:8000`:

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

Se a API estiver em outro endereço, copie `.env.example` para `.env` e altere `VITE_API_URL`.
