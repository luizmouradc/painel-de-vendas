from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ClienteCreate(BaseModel):
    nome: str = Field(min_length=2, max_length=120)
    email: EmailStr
    cidade: str = Field(min_length=2, max_length=100)


class ClienteResponse(ClienteCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ProdutoCreate(BaseModel):
    nome: str = Field(min_length=2, max_length=120)
    categoria: str = Field(min_length=2, max_length=80)
    preco: float = Field(gt=0)
    estoque: int = Field(ge=0)


class ProdutoUpdate(BaseModel):
    nome: str | None = None
    categoria: str | None = None
    preco: float | None = Field(default=None, gt=0)
    estoque: int | None = Field(default=None, ge=0)


class ProdutoResponse(ProdutoCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class VendaCreate(BaseModel):
    cliente_id: int
    produto_id: int
    quantidade: int = Field(gt=0)


class VendaResponse(BaseModel):
    id: int
    cliente_id: int
    produto_id: int
    quantidade: int
    preco_unitario: float
    data_venda: datetime
    model_config = ConfigDict(from_attributes=True)
