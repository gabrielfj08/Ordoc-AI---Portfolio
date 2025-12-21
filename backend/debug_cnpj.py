
import os
import django
import sys

try:
    print("Initializing Django...")
    # Override settings for local debug
    os.environ['DB_HOST'] = 'localhost'
    os.environ['DB_USER'] = 'ordoc_user'
    os.environ['DB_PASSWORD'] = 'ordoc_password'
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
    django.setup()
    
    print("Importing Service...")
    from ordoc_integrations.services.receita_federal import ReceitaFederalService
    
    print("Instantiating Service...")
    service = ReceitaFederalService()
    
    cnpj = "06.990.590/0001-23" # Google Brasil
    print(f"Fetching data for {cnpj}...")
    
    data = service.get_company_data(cnpj)
    print("Data retrieved:")
    print(data)

except Exception as e:
    import traceback
    traceback.print_exc()
