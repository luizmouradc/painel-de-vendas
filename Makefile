run:
	uvicorn app.main:app --reload

seed:
	python seed.py

etl:
	python etl/processar_dados.py

test:
	pytest -q
