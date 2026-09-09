const itens = [
  { id: 'dashboard', texto: 'Visão geral' },
  { id: 'clientes', texto: 'Clientes' },
  { id: 'produtos', texto: 'Produtos' },
  { id: 'vendas', texto: 'Vendas' },
]

export default function Sidebar({ pagina, onMudarPagina, apiConectada }) {
  return (
    <aside className="sidebar">
      <div className="brand brand-simple">
        <div className="brand-texts">
          <strong className="brand-title">
            <span className="brand-normal">Painel de</span>
            <span className="brand-highlight">Vendas</span>
          </strong>
          <span className="brand-subtitle">Gestão e análise</span>
        </div>
      </div>

      <nav className="nav-list">
        {itens.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${pagina === item.id ? 'active' : ''}`}
            onClick={() => onMudarPagina(item.id)}
          >
            {item.texto}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className={`status-dot ${apiConectada ? 'online' : 'offline'}`} />
        {apiConectada ? 'API conectada' : 'API desconectada'}
      </div>
    </aside>
  )
}
