export default function StatCard({ titulo, valor, detalhe }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{titulo}</span>
      </div>
      <strong>{valor}</strong>
      <small>{detalhe}</small>
    </article>
  )
}
