from datetime import datetime
import sys
from pathlib import Path

from airflow import DAG
from airflow.operators.python import PythonOperator

PROJECT_DIR = Path(__file__).resolve().parents[2]
sys.path.append(str(PROJECT_DIR))

from etl.processar_dados import processar_dados


with DAG(
    dag_id="pipeline_vendas_diario",
    start_date=datetime(2026, 1, 1),
    schedule="0 7 * * *",
    catchup=False,
    tags=["portfolio", "dados"],
) as dag:
    tratar_vendas = PythonOperator(
        task_id="tratar_vendas_csv",
        python_callable=processar_dados,
    )

    tratar_vendas
