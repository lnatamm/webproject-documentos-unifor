# Guia de Uso do Projeto

Este repositório é um template para integração entre **React** e **Python (FastAPI)**. Siga as instruções abaixo para criar novas rotas e modelos, além de testar sua API localmente.

---

## ⚙️ Requisitos

- **Node.js** (para rodar o frontend React)
- **Python** (para rodar o backend FastAPI)

---

## 🚀 Criando o App React

Para criar o app React utilizado neste projeto, execute o comando abaixo na raiz do repositório:

```bash
npm create vite@latest frontend --template react
```

Após criar o app, entre na pasta `frontend` e instale as dependências necessárias:

```bash
cd frontend
npm install
npm install axios
```

---

## 📁 Estrutura de Rotas

Para adicionar uma nova rota:

1. Crie um novo arquivo `.py` na pasta `routes`.
2. No arquivo, defina seu roteador:

    ```python
    from fastapi import APIRouter

    api_criada = APIRouter(
         prefix="/prefixo",
         tags=["Tag"]
    )

    # Exemplo de rota
    @api_criada.get("/")
    async def exemplo():
         return {"mensagem": "Rota funcionando!"}
    ```

3. No arquivo `main.py`, inclua o novo roteador:

    ```python
    from routes.seuarquivo import api_criada

    api.include_router(api_criada)
    ```

---

## 🗃️ Estrutura de Modelos

Para adicionar um novo modelo:

1. Crie um novo arquivo `.py` na pasta `models`.
2. Defina suas classes herdando de `BaseModel`:

    ```python
    from pydantic import BaseModel

    class MinhaClasse(BaseModel):
         parametro: str
         outro_parametro: int
    ```

---

## 🧪 Testando as Rotas

Após iniciar o servidor FastAPI, acesse a documentação interativa em:

```
http://localhost:porta/docs
```

Substitua `porta` pela porta configurada no seu projeto (por padrão, 8000).

---

## 📌 Observações

- Sempre inclua novas rotas no `main.py` usando `api.include_router(...)`.
- Mantenha a organização dos arquivos para facilitar a manutenção do projeto.

---

> Sinta-se à vontade para contribuir ou sugerir melhorias!