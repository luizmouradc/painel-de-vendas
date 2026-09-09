export default function Toast({ mensagem, tipo }) {
  if (!mensagem) return null

  return <div className={`toast ${tipo === 'erro' ? 'toast-error' : ''}`}>{mensagem}</div>
}
