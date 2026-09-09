from pathlib import Path

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app

TEST_DB = Path("./test_insightflow.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{TEST_DB}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_fluxo_basico_de_venda():
    cliente = client.post(
        "/clientes",
        json={
            "nome": "Maria Teste",
            "email": "maria.teste@email.com",
            "cidade": "Campina Grande",
        },
    )
    assert cliente.status_code == 201

    produto = client.post(
        "/produtos",
        json={
            "nome": "Teclado",
            "categoria": "Periféricos",
            "preco": 200.0,
            "estoque": 10,
        },
    )
    assert produto.status_code == 201

    venda = client.post(
        "/vendas",
        json={
            "cliente_id": cliente.json()["id"],
            "produto_id": produto.json()["id"],
            "quantidade": 2,
        },
    )
    assert venda.status_code == 201

    resumo = client.get("/analytics/resumo")
    assert resumo.status_code == 200
    assert resumo.json()["total_vendas"] == 1
    assert resumo.json()["faturamento_total"] == 400.0
