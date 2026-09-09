const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    headers: {
      'Content-Type': 'application/json',
      ...opcoes.headers,
    },
    ...opcoes,
  })

  if (!resposta.ok) {
    let mensagem = 'Não foi possível concluir a operação.'

    try {
      const dados = await resposta.json()
      mensagem = dados.detail || mensagem
    } catch {
      // mantém a mensagem padrão
    }

    throw new Error(mensagem)
  }

  if (resposta.status === 204) {
    return null
  }

  return resposta.json()
}

export const api = {
  verificarSaude() {
    return requisicao('/health')
  },

  listarClientes(cidade = '') {
    const filtro = cidade ? `?cidade=${encodeURIComponent(cidade)}` : ''
    return requisicao(`/clientes${filtro}`)
  },

  criarCliente(dados) {
    return requisicao('/clientes', {
      method: 'POST',
      body: JSON.stringify(dados),
    })
  },

  buscarCep(cep) {
    return requisicao(`/integracoes/cep/${encodeURIComponent(cep)}`)
  },

  listarProdutos(categoria = '') {
    const filtro = categoria ? `?categoria=${encodeURIComponent(categoria)}` : ''
    return requisicao(`/produtos${filtro}`)
  },

  criarProduto(dados) {
    return requisicao('/produtos', {
      method: 'POST',
      body: JSON.stringify(dados),
    })
  },

  atualizarProduto(id, dados) {
    return requisicao(`/produtos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dados),
    })
  },

  listarVendas() {
    return requisicao('/vendas')
  },

  criarVenda(dados) {
    return requisicao('/vendas', {
      method: 'POST',
      body: JSON.stringify(dados),
    })
  },

  obterResumo() {
    return requisicao('/analytics/resumo')
  },

  obterProdutosTop(limite = 5) {
    return requisicao(`/analytics/produtos-top?limite=${limite}`)
  },
}
