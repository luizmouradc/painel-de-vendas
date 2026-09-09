import httpx
from fastapi import HTTPException


async def consultar_cep(cep: str) -> dict:
    cep_limpo = "".join(numero for numero in cep if numero.isdigit())

    if len(cep_limpo) != 8:
        raise HTTPException(status_code=400, detail="CEP inválido")

    url = f"https://viacep.com.br/ws/{cep_limpo}/json/"

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resposta = await client.get(url)
            resposta.raise_for_status()
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Falha ao consultar serviço de CEP")

    dados = resposta.json()
    if dados.get("erro"):
        raise HTTPException(status_code=404, detail="CEP não encontrado")

    return {
        "cep": dados.get("cep"),
        "cidade": dados.get("localidade"),
        "estado": dados.get("uf"),
        "bairro": dados.get("bairro"),
        "logradouro": dados.get("logradouro"),
    }
