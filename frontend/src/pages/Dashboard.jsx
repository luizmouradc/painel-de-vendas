import { useEffect, useState } from 'react'
import { api } from '../api'
import EmptyState from '../components/EmptyState'
import StatCard from '../components/StatCard'
import { formatarData, formatarMoeda } from '../utils'

export default function Dashboard({ versao }) {
  const [resumo, setResumo] = useState(null)
  const [topProdutos, setTopProdutos] = useState([])
  const [produtos, setProdutos] = useState([])
  const [clientes, setClientes] = useState([])
  const [vendas, setVendas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro('')

      try {
        const [dadosResumo, ranking, listaProdutos, listaClientes, listaVendas] = await Promise.all([
          api.obterResumo(),
          api.obterProdutosTop(5),
          api.listarProdutos(),
          api.listarClientes(),
          api.listarVendas(),
        ])

        setResumo(dadosResumo)
        setTopProdutos(ranking)
        setProdutos(listaProdutos)
        setClientes(listaClientes)
        setVendas(listaVendas.slice(0, 5))
      } catch (error) {
        setErro(error.message)
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [versao])

  if (carregando) {
    return <div className="loading-card">Carregando indicadores...</div>
  }

  if (erro) {
    return <div className="error-card">{erro}</div>
  }

  const estoqueBaixo = produtos.filter((produto) => produto.estoque <= 5)
  const mapaClientes = Object.fromEntries(clientes.map((cliente) => [cliente.id, cliente.nome]))
  const mapaProdutos = Object.fromEntries(produtos.map((produto) => [produto.id, produto.nome]))
  const maiorFaturamento = Math.max(...topProdutos.map((item) => item.faturamento), 1)

  return (
    <div className="page-stack">
      <section className="stats-grid">
        <StatCard
          titulo="Faturamento"
          valor={formatarMoeda(resumo?.faturamento_total)}
          detalhe="Receita registrada nas vendas"
        />
        <StatCard
          titulo="Vendas"
          valor={resumo?.total_vendas ?? 0}
          detalhe="Quantidade de vendas realizadas"
        />
        <StatCard
          titulo="Ticket médio"
          valor={formatarMoeda(resumo?.ticket_medio)}
          detalhe="Valor médio por venda"
        />
        <StatCard
          titulo="Clientes ativos"
          valor={resumo?.clientes_ativos ?? 0}
          detalhe="Clientes que já compraram"
        />
      </section>

      <section className="dashboard-grid">
        <article className="panel panel-large">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">DESEMPENHO</span>
              <h2>Produtos com maior faturamento</h2>
            </div>
            <span className="soft-badge">Top 5</span>
          </div>

          {topProdutos.length === 0 ? (
            <EmptyState texto="Registre vendas para visualizar o ranking." />
          ) : (
            <div className="bar-chart">
              {topProdutos.map((item) => (
                <div className="bar-row" key={`${item.produto}-${item.categoria}`}>
                  <div className="bar-label">
                    <strong>{item.produto}</strong>
                    <span>{item.categoria}</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${Math.max((item.faturamento / maiorFaturamento) * 100, 6)}%` }}
                    />
                  </div>
                  <div className="bar-value">
                    <strong>{formatarMoeda(item.faturamento)}</strong>
                    <span>{item.unidades_vendidas} un.</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">ESTOQUE</span>
              <h2>Atenção necessária</h2>
            </div>
            <span className={`soft-badge ${estoqueBaixo.length ? 'warning' : 'success'}`}>
              {estoqueBaixo.length}
            </span>
          </div>

          {estoqueBaixo.length === 0 ? (
            <EmptyState texto="Nenhum produto com estoque baixo." />
          ) : (
            <div className="stock-list">
              {estoqueBaixo.slice(0, 6).map((produto) => (
                <div className="stock-item" key={produto.id}>
                  <div>
                    <strong>{produto.nome}</strong>
                    <span>{produto.categoria}</span>
                  </div>
                  <span className="stock-number">{produto.estoque} un.</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">ATIVIDADE</span>
            <h2>Vendas recentes</h2>
          </div>
        </div>

        {vendas.length === 0 ? (
          <EmptyState texto="Ainda não existem vendas registradas." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Total</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((venda) => (
                  <tr key={venda.id}>
                    <td>#{venda.id}</td>
                    <td>{mapaClientes[venda.cliente_id] || `Cliente #${venda.cliente_id}`}</td>
                    <td>{mapaProdutos[venda.produto_id] || `Produto #${venda.produto_id}`}</td>
                    <td>{venda.quantidade}</td>
                    <td>{formatarMoeda(venda.quantidade * venda.preco_unitario)}</td>
                    <td>{formatarData(venda.data_venda)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
