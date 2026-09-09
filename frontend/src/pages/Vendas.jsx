import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import EmptyState from '../components/EmptyState'
import { formatarData, formatarMoeda } from '../utils'

export default function Vendas({ versao, onAlteracao, onMensagem }) {
  const [clientes, setClientes] = useState([])
  const [produtos, setProdutos] = useState([])
  const [vendas, setVendas] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [produtoId, setProdutoId] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  async function carregarDados() {
    setCarregando(true)

    try {
      const [listaClientes, listaProdutos, listaVendas] = await Promise.all([
        api.listarClientes(),
        api.listarProdutos(),
        api.listarVendas(),
      ])

      setClientes(listaClientes)
      setProdutos(listaProdutos)
      setVendas(listaVendas)
    } catch (error) {
      onMensagem(error.message, 'erro')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [versao])

  const produtoSelecionado = useMemo(
    () => produtos.find((produto) => produto.id === Number(produtoId)),
    [produtos, produtoId],
  )

  const mapaClientes = useMemo(
    () => Object.fromEntries(clientes.map((cliente) => [cliente.id, cliente.nome])),
    [clientes],
  )

  const mapaProdutos = useMemo(
    () => Object.fromEntries(produtos.map((produto) => [produto.id, produto.nome])),
    [produtos],
  )

  const totalPrevisto = produtoSelecionado
    ? produtoSelecionado.preco * Number(quantidade || 0)
    : 0

  async function registrarVenda(event) {
    event.preventDefault()

    if (!clienteId || !produtoId) {
      onMensagem('Selecione um cliente e um produto.', 'erro')
      return
    }

    setSalvando(true)

    try {
      await api.criarVenda({
        cliente_id: Number(clienteId),
        produto_id: Number(produtoId),
        quantidade: Number(quantidade),
      })

      setClienteId('')
      setProdutoId('')
      setQuantidade(1)
      onMensagem('Venda registrada e estoque atualizado.')
      onAlteracao()
      await carregarDados()
    } catch (error) {
      onMensagem(error.message, 'erro')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="sale-layout">
        <article className="panel form-panel sale-form-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">NOVA OPERAÇÃO</span>
              <h2>Registrar venda</h2>
            </div>
          </div>

          <form className="form-stack" onSubmit={registrarVenda}>
            <label>
              Cliente
              <select value={clienteId} onChange={(event) => setClienteId(event.target.value)} required>
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nome} — {cliente.cidade}</option>
                ))}
              </select>
            </label>

            <label>
              Produto
              <select value={produtoId} onChange={(event) => setProdutoId(event.target.value)} required>
                <option value="">Selecione um produto</option>
                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id} disabled={produto.estoque === 0}>
                    {produto.nome} — {formatarMoeda(produto.preco)} — {produto.estoque} un.
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantidade
              <input
                type="number"
                value={quantidade}
                onChange={(event) => setQuantidade(event.target.value)}
                min="1"
                max={produtoSelecionado?.estoque || undefined}
                required
              />
            </label>

            <div className="sale-preview">
              <span>Total da venda</span>
              <strong>{formatarMoeda(totalPrevisto)}</strong>
              {produtoSelecionado && <small>Estoque disponível: {produtoSelecionado.estoque} unidades</small>}
            </div>

            <button className="button primary full" disabled={salvando || clientes.length === 0 || produtos.length === 0}>
              {salvando ? 'Registrando...' : 'Confirmar venda'}
            </button>
          </form>
        </article>

        <article className="panel sale-guide">
          <span className="panel-kicker">REGRA DE NEGÓCIO</span>
          <h2>O que acontece ao confirmar?</h2>
          <div className="flow-list">
            <div><span>1</span><p>A API verifica se o cliente existe.</p></div>
            <div><span>2</span><p>O produto e o estoque disponível são validados.</p></div>
            <div><span>3</span><p>A venda é salva no banco relacional.</p></div>
            <div><span>4</span><p>O estoque do produto é reduzido automaticamente.</p></div>
            <div><span>5</span><p>O dashboard passa a considerar a nova venda.</p></div>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">HISTÓRICO</span>
            <h2>Vendas registradas</h2>
          </div>
          <span className="soft-badge">{vendas.length}</span>
        </div>

        {carregando ? (
          <div className="loading-card compact">Carregando vendas...</div>
        ) : vendas.length === 0 ? (
          <EmptyState texto="Nenhuma venda foi registrada ainda." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Produto</th>
                  <th>Qtd.</th>
                  <th>Preço unit.</th>
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
                    <td>{formatarMoeda(venda.preco_unitario)}</td>
                    <td><strong>{formatarMoeda(venda.preco_unitario * venda.quantidade)}</strong></td>
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
