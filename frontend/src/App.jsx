import { useEffect, useState } from 'react'
import { api } from './api'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import Clientes from './pages/Clientes'
import Dashboard from './pages/Dashboard'
import Produtos from './pages/Produtos'
import Vendas from './pages/Vendas'

export default function App() {
  const [pagina, setPagina] = useState('dashboard')
  const [versao, setVersao] = useState(0)
  const [apiConectada, setApiConectada] = useState(false)
  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso' })

  function registrarAlteracao() {
    setVersao((atual) => atual + 1)
  }

  function mostrarMensagem(mensagem, tipo = 'sucesso') {
    setToast({ mensagem, tipo })
  }

  useEffect(() => {
    if (!toast.mensagem) return undefined

    const timer = setTimeout(() => {
      setToast({ mensagem: '', tipo: 'sucesso' })
    }, 3500)

    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    let ativo = true

    async function verificarApi() {
      try {
        await api.verificarSaude()
        if (ativo) {
          setApiConectada(true)
        }
      } catch {
        if (ativo) {
          setApiConectada(false)
        }
      }
    }

    verificarApi()
    const intervalo = setInterval(verificarApi, 5000)

    return () => {
      ativo = false
      clearInterval(intervalo)
    }
  }, [])

  function renderizarPagina() {
    if (pagina === 'clientes') {
      return <Clientes versao={versao} onAlteracao={registrarAlteracao} onMensagem={mostrarMensagem} />
    }

    if (pagina === 'produtos') {
      return <Produtos versao={versao} onAlteracao={registrarAlteracao} onMensagem={mostrarMensagem} />
    }

    if (pagina === 'vendas') {
      return <Vendas versao={versao} onAlteracao={registrarAlteracao} onMensagem={mostrarMensagem} />
    }

    return <Dashboard versao={versao} />
  }

  return (
    <div className="app-shell">
      <Sidebar pagina={pagina} onMudarPagina={setPagina} apiConectada={apiConectada} />
      <main className="main-content">
        <Header pagina={pagina} />
        {renderizarPagina()}
      </main>
      <Toast mensagem={toast.mensagem} tipo={toast.tipo} />
    </div>
  )
}
