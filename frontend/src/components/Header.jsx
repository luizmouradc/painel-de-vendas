const titulos = {
  dashboard: ['Visão geral', 'Acompanhe os principais indicadores do negócio.'],
  clientes: ['Clientes', 'Cadastre e consulte os clientes da empresa.'],
  produtos: ['Produtos', 'Gerencie catálogo, preços e estoque.'],
  vendas: ['Vendas', 'Registre novas vendas e acompanhe o histórico.'],
}

export default function Header({ pagina }) {
  const [titulo, descricao] = titulos[pagina]

  return (
    <header className="page-header simple-header">
      <div>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
    </header>
  )
}
