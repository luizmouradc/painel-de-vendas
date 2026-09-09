from pathlib import Path

import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[1]
ARQUIVO_ENTRADA = BASE_DIR / "data" / "vendas_brutas.csv"
ARQUIVO_SAIDA = BASE_DIR / "data" / "vendas_tratadas.csv"


def processar_dados() -> pd.DataFrame:
    df = pd.read_csv(ARQUIVO_ENTRADA)

    # Remove registros sem dados essenciais.
    df = df.dropna(subset=["cliente", "produto", "quantidade", "preco_unitario"])

    # Corrige tipos numéricos.
    df["quantidade"] = pd.to_numeric(df["quantidade"], errors="coerce")
    df["preco_unitario"] = pd.to_numeric(df["preco_unitario"], errors="coerce")
    df = df.dropna(subset=["quantidade", "preco_unitario"])

    # Mantém somente valores válidos.
    df = df[(df["quantidade"] > 0) & (df["preco_unitario"] > 0)]

    df["faturamento"] = df["quantidade"] * df["preco_unitario"]

    condicoes = [
        df["faturamento"] < 100,
        df["faturamento"].between(100, 499.99),
        df["faturamento"] >= 500,
    ]
    classificacoes = ["baixo", "medio", "alto"]
    df["faixa_venda"] = np.select(condicoes, classificacoes, default="nao_classificado")

    df.to_csv(ARQUIVO_SAIDA, index=False)
    return df


if __name__ == "__main__":
    resultado = processar_dados()
    print(f"Registros processados: {len(resultado)}")
    print(f"Arquivo gerado: {ARQUIVO_SAIDA}")
