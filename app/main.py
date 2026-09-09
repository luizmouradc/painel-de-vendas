import os

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.analytics import produtos_mais_vendidos, resumo_vendas
from app.database import Base, engine, get_db
from app.integrations import consultar_cep
from app.models import Cliente, Produto, Venda
from app.schemas import (
    ClienteCreate,
    ClienteResponse,
    ProdutoCreate,
    ProdutoResponse,
    ProdutoUpdate,
    VendaCreate,
    VendaResponse,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InsightFlow API",
    description="API de vendas com análise de dados para projeto de portfólio.",
    version="1.0.0",
)

origens = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origem.strip() for origem in origens],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/integracoes/cep/{cep}")
async def obter_endereco_por_cep(cep: str):
    return await consultar_cep(cep)


@app.post("/clientes", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
def criar_cliente(dados: ClienteCreate, db: Session = Depends(get_db)):
    cliente = Cliente(**dados.model_dump())
    db.add(cliente)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="E-mail já cadastrado")

    db.refresh(cliente)
    return cliente


@app.get("/clientes", response_model=list[ClienteResponse])
def listar_clientes(
    cidade: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Cliente)
    if cidade:
        query = query.filter(Cliente.cidade.ilike(f"%{cidade}%"))
    return query.order_by(Cliente.id).all()


@app.post("/produtos", response_model=ProdutoResponse, status_code=status.HTTP_201_CREATED)
def criar_produto(dados: ProdutoCreate, db: Session = Depends(get_db)):
    produto = Produto(**dados.model_dump())
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto


@app.get("/produtos", response_model=list[ProdutoResponse])
def listar_produtos(
    categoria: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Produto)
    if categoria:
        query = query.filter(Produto.categoria.ilike(f"%{categoria}%"))
    return query.order_by(Produto.id).all()


@app.patch("/produtos/{produto_id}", response_model=ProdutoResponse)
def atualizar_produto(
    produto_id: int,
    dados: ProdutoUpdate,
    db: Session = Depends(get_db),
):
    produto = db.get(Produto, produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(produto, campo, valor)

    db.commit()
    db.refresh(produto)
    return produto


@app.post("/vendas", response_model=VendaResponse, status_code=status.HTTP_201_CREATED)
def criar_venda(dados: VendaCreate, db: Session = Depends(get_db)):
    cliente = db.get(Cliente, dados.cliente_id)
    produto = db.get(Produto, dados.produto_id)

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    if produto.estoque < dados.quantidade:
        raise HTTPException(status_code=400, detail="Estoque insuficiente")

    venda = Venda(
        cliente_id=dados.cliente_id,
        produto_id=dados.produto_id,
        quantidade=dados.quantidade,
        preco_unitario=produto.preco,
    )

    produto.estoque -= dados.quantidade
    db.add(venda)
    db.commit()
    db.refresh(venda)
    return venda


@app.get("/vendas", response_model=list[VendaResponse])
def listar_vendas(db: Session = Depends(get_db)):
    return db.query(Venda).order_by(Venda.data_venda.desc()).all()


@app.get("/analytics/resumo")
def obter_resumo(db: Session = Depends(get_db)):
    return resumo_vendas(db)


@app.get("/analytics/produtos-top")
def obter_produtos_top(
    limite: int = Query(default=5, ge=1, le=20),
    db: Session = Depends(get_db),
):
    return produtos_mais_vendidos(db, limite)
