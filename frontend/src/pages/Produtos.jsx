import { useEffect, useState } from 'react'
import { api } from '../api'
import EmptyState from '../components/EmptyState'
import { formatarMoeda } from '../utils'

const formularioInicial = {
  nome: '',
  categoria: '',
  preco: '',
  estoque: '',
}

export default function Produtos({ versao, onAlteracao, onMensagem }) {
  const [produtos, setProdutos] = useState([])
  const [filtro, setFiltro] = useState('')
  const [formulario, setFormulario] = useState(formularioInicial)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  async function carregarProdutos(categoria = filtro) {
    setCarregando(true)

    try {
      const dados = await api.listarProdutos(categoria)
      setProdutos(dados)
    } catch (error) {
      onMensagem(error.message, 'erro')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarProdutos('')
  }, [versao])

  function alterarCampo(event) {
    const { name, value } = event.target
    setFormulario((atual) => ({ ...atual, [name]: value }))
  }

  function editar(produto) {
    setProdutoEditando(produto)
    setFormulario({
      nome: produto.nome,
      categoria: produto.categoria,
      preco: String(produto.preco),
      estoque: String(produto.estoque),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelarEdicao() {
    setProdutoEditando(null)
    setFormulario(formularioInicial)
  }

  async function salvar(event) {
    event.preventDefault()
    setSalvando(true)

    const dados = {
      nome: formulario.nome.trim(),
      categoria: formulario.categoria.trim(),
      preco: Number(formulario.preco),
      estoque: Number(formulario.estoque),
    }

    try {
      if (produtoEditando) {
        await api.atualizarProduto(produtoEditando.id, dados)
        onMensagem('Produto atualizado com sucesso.')
      } else {
        await api.criarProduto(dados)
        onMensagem('Produto cadastrado com sucesso.')
      }

      cancelarEdicao()
      onAlteracao()
      await carregarProdutos('')
    } catch (error) {
      onMensagem(error.message, 'erro')
    } finally {
      setSalvando(false)
    }
  }

  async function filtrar(event) {
    event.preventDefault()
    await carregarProdutos(filtro)
  }

  return (
    <div className="content-grid">
      <section className="panel form-panel">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">{produtoEditando ? 'EDIÇÃO' : 'NOVO CADASTRO'}</span>
            <h2>{produtoEditando ? `Editar produto #${produtoEditando.id}` : 'Adicionar produto'}</h2>
          </div>
        </div>

        <form className="form-stack" onSubmit={salvar}>
          <label>
            Nome
            <input name="nome" value={formulario.nome} onChange={alterarCampo} placeholder="Ex.: Teclado mecânico" minLength="2" required />
          </label>

          <label>
            Categoria
            <input name="categoria" value={formulario.categoria} onChange={alterarCampo} placeholder="Periféricos" minLength="2" required />
          </label>

          <div className="two-columns">
            <label>
              Preço
              <input type="number" name="preco" value={formulario.preco} onChange={alterarCampo} min="0.01" step="0.01" placeholder="199.90" required />
            </label>

            <label>
              Estoque
              <input type="number" name="estoque" value={formulario.estoque} onChange={alterarCampo} min="0" step="1" placeholder="15" required />
            </label>
          </div>

          <button className="button primary full" disabled={salvando}>
            {salvando ? 'Salvando...' : produtoEditando ? 'Salvar alterações' : 'Cadastrar produto'}
          </button>

          {produtoEditando && (
            <button type="button" className="button ghost full" onClick={cancelarEdicao}>
              Cancelar edição
            </button>
          )}
        </form>
      </section>

      <section className="panel data-panel">
        <div className="panel-heading responsive-heading">
          <div>
            <span className="panel-kicker">CATÁLOGO</span>
            <h2>Produtos cadastrados</h2>
          </div>

          <form className="filter-form" onSubmit={filtrar}>
            <input value={filtro} onChange={(event) => setFiltro(event.target.value)} placeholder="Filtrar por categoria" />
            <button className="button secondary">Filtrar</button>
          </form>
        </div>

        {carregando ? (
          <div className="loading-card compact">Carregando produtos...</div>
        ) : produtos.length === 0 ? (
          <EmptyState texto="Nenhum produto encontrado." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto) => (
                  <tr key={produto.id}>
                    <td>
                      <strong>{produto.nome}</strong>
                      <small className="table-subtitle">#{produto.id}</small>
                    </td>
                    <td>{produto.categoria}</td>
                    <td>{formatarMoeda(produto.preco)}</td>
                    <td>
                      <span className={`stock-pill ${produto.estoque <= 5 ? 'low' : ''}`}>
                        {produto.estoque} un.
                      </span>
                    </td>
                    <td className="table-action">
                      <button className="text-button" onClick={() => editar(produto)}>Editar</button>
                    </td>
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
