import os
import django
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ordoc_ai.settings")
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth.models import User
from ordoc_flow.models import ProcedureTemplate, Procedure, GroupRequester
from ordoc_air.models import Organization

def verify():
    # 1. Setup User and Org
    org = Organization.objects.get(subdomain='demo')
    user = User.objects.filter(is_superuser=True).first()
    if not user:
        print("No superuser found.")
        return

    # 2. Get a valid template
    template = ProcedureTemplate.objects.filter(organization=org).first()
    if not template:
        print("No template found for demo org.")
        return
    
    print(f"Testing with Template: {template.name} ({template.id})")

    # 3. Simulate API Call
    client = APIClient()
    client.force_authenticate(user=user)
    
    # Set headers
    headers = {
        'HTTP_X_API_SUBDOMAIN': 'demo',
        'HTTP_HOST': 'localhost'
    }
    
    payload = {
        "procedure_template": str(template.id),
        "priority": "normal"
    }
    
    print("Sending payload:", payload)
    
    # Test 0: No Headers (Check if Middleware crashes on missing header vs present header)
    resp_no_header = client.get('/api/v1/ordoc-flow/api/procedure-templates/')
    print(f"Sanity Check (No Header): {resp_no_header.status_code}")
    
    # Check if we can GET templates (sanity check)
    resp_get = client.get('/api/v1/ordoc-flow/api/procedure-templates/', **headers)
    print(f"Sanity Check (Templates): {resp_get.status_code}")
    if resp_get.status_code != 200:
        print("Sanity Check Failed!")
        try:
             print(resp_get.data)
        except:
             print(resp_get.content)

    response = client.post(
        '/api/v1/ordoc-flow/api/procedures/',
        payload,
        format='json',
        **headers
    )
    
    if response.status_code == 201:
        print("SUCCESS! Procedure created.")
        proc_id = response.data['id']
        proc = Procedure.objects.get(id=proc_id)
        print(f"Procedure ID: {proc.process_number}")
        print(f"Requester: {proc.requester}")
        print(f"Group: {proc.responsible_group}")
    else:
        print(f"FAILED: {response.status_code}")
        try:
            print(response.data)
        except AttributeError:
            print(response.content.decode('utf-8'))

if __name__ == "__main__":
    verify()
