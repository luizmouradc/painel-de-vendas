import { useEffect, useState } from 'react'
import { api } from '../api'
import EmptyState from '../components/EmptyState'

const formularioInicial = {
  nome: '',
  email: '',
  cep: '',
  cidade: '',
}

export default function Clientes({ versao, onAlteracao, onMensagem }) {
  const [clientes, setClientes] = useState([])
  const [filtro, setFiltro] = useState('')
  const [formulario, setFormulario] = useState(formularioInicial)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)

  async function carregarClientes(cidade = filtro) {
    setCarregando(true)

    try {
      const dados = await api.listarClientes(cidade)
      setClientes(dados)
    } catch (error) {
      onMensagem(error.message, 'erro')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarClientes('')
  }, [versao])

  function alterarCampo(event) {
    const { name, value } = event.target
    setFormulario((atual) => ({ ...atual, [name]: value }))
  }

  async function buscarCep() {
    if (!formulario.cep.trim()) {
      onMensagem('Informe um CEP para fazer a busca.', 'erro')
      return
    }

    setBuscandoCep(true)

    try {
      const dados = await api.buscarCep(formulario.cep)
      setFormulario((atual) => ({ ...atual, cidade: dados.cidade || atual.cidade }))
      onMensagem(`CEP localizado: ${dados.cidade}/${dados.estado}`)
    } catch (error) {
      onMensagem(error.message, 'erro')
    } finally {
      setBuscandoCep(false)
    }
  }

  async function cadastrar(event) {
    event.preventDefault()
    setSalvando(true)

    try {
      await api.criarCliente({
        nome: formulario.nome.trim(),
        email: formulario.email.trim(),
        cidade: formulario.cidade.trim(),
      })

      setFormulario(formularioInicial)
      onMensagem('Cliente cadastrado com sucesso.')
      onAlteracao()
      await carregarClientes('')
    } catch (error) {
      onMensagem(error.message, 'erro')
    } finally {
      setSalvando(false)
    }
  }

  async function filtrar(event) {
    event.preventDefault()
    await carregarClientes(filtro)
  }

  return (
    <div className="content-grid">
      <section className="panel form-panel">
        <div className="panel-heading">
          <div>
            <span className="panel-kicker">NOVO CADASTRO</span>
            <h2>Adicionar cliente</h2>
          </div>
        </div>

        <form className="form-stack" onSubmit={cadastrar}>
          <label>
            Nome
            <input
              name="nome"
              value={formulario.nome}
              onChange={alterarCampo}
              placeholder="Ex.: Ana Souza"
              minLength="2"
              required
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              name="email"
              value={formulario.email}
              onChange={alterarCampo}
              placeholder="ana@email.com"
              required
            />
          </label>

          <label>
            CEP <span className="optional">opcional</span>
            <div className="input-action-row">
              <input
                name="cep"
                value={formulario.cep}
                onChange={alterarCampo}
                placeholder="58400-000"
              />
              <button type="button" className="button secondary" onClick={buscarCep} disabled={buscandoCep}>
                {buscandoCep ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </label>

          <label>
            Cidade
            <input
              name="cidade"
              value={formulario.cidade}
              onChange={alterarCampo}
              placeholder="Campina Grande"
              minLength="2"
              required
            />
          </label>

          <button className="button primary full" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Cadastrar cliente'}
          </button>
        </form>
      </section>

      <section className="panel data-panel">
        <div className="panel-heading responsive-heading">
          <div>
            <span className="panel-kicker">BASE DE CLIENTES</span>
            <h2>Clientes cadastrados</h2>
          </div>

          <form className="filter-form" onSubmit={filtrar}>
            <input
              value={filtro}
              onChange={(event) => setFiltro(event.target.value)}
              placeholder="Filtrar por cidade"
            />
            <button className="button secondary">Filtrar</button>
          </form>
        </div>

        {carregando ? (
          <div className="loading-card compact">Carregando clientes...</div>
        ) : clientes.length === 0 ? (
          <EmptyState texto="Nenhum cliente encontrado." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Cidade</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>#{cliente.id}</td>
                    <td><strong>{cliente.nome}</strong></td>
                    <td>{cliente.email}</td>
                    <td><span className="table-tag">{cliente.cidade}</span></td>
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
