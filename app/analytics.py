import pandas as pd
from sqlalchemy import text
from sqlalchemy.orm import Session


def resumo_vendas(db: Session) -> dict:
    query = text(
        """
        SELECT
            v.id,
            v.cliente_id,
            v.produto_id,
            v.quantidade,
            v.preco_unitario,
            v.data_venda,
            p.nome AS produto,
            p.categoria,
            c.cidade
        FROM vendas v
        JOIN produtos p ON p.id = v.produto_id
        JOIN clientes c ON c.id = v.cliente_id
        """
    )

    df = pd.read_sql(query, db.get_bind())

    if df.empty:
        return {
            "total_vendas": 0,
            "faturamento_total": 0.0,
            "ticket_medio": 0.0,
            "clientes_ativos": 0,
        }

    df["faturamento"] = df["quantidade"] * df["preco_unitario"]

    return {
        "total_vendas": int(len(df)),
        "faturamento_total": round(float(df["faturamento"].sum()), 2),
        "ticket_medio": round(float(df["faturamento"].mean()), 2),
        "clientes_ativos": int(df["cliente_id"].nunique()),
    }


def produtos_mais_vendidos(db: Session, limite: int = 5) -> list[dict]:
    query = text(
        """
        SELECT
            p.nome AS produto,
            p.categoria,
            v.quantidade,
            v.preco_unitario
        FROM vendas v
        JOIN produtos p ON p.id = v.produto_id
        """
    )

    df = pd.read_sql(query, db.get_bind())

    if df.empty:
        return []

    df["faturamento"] = df["quantidade"] * df["preco_unitario"]

    ranking = (
        df.groupby(["produto", "categoria"], as_index=False)
        .agg(
            unidades_vendidas=("quantidade", "sum"),
            faturamento=("faturamento", "sum"),
        )
        .sort_values("faturamento", ascending=False)
        .head(limite)
    )

    ranking["faturamento"] = ranking["faturamento"].round(2)
    return ranking.to_dict(orient="records")
