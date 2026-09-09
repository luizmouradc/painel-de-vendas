import pandas as pd

from app.database import Base, SessionLocal, engine
from app.models import Cliente, Produto

Base.metadata.create_all(bind=engine)


def carregar_dados():
    db = SessionLocal()

    try:
        clientes = pd.read_csv("data/clientes_seed.csv")
        produtos = pd.read_csv("data/produtos_seed.csv")

        if db.query(Cliente).count() == 0:
            for item in clientes.to_dict(orient="records"):
                db.add(Cliente(**item))

        if db.query(Produto).count() == 0:
            for item in produtos.to_dict(orient="records"):
                db.add(Produto(**item))

        db.commit()
        print("Dados iniciais carregados com sucesso.")
    finally:
        db.close()


if __name__ == "__main__":
    carregar_dados()
