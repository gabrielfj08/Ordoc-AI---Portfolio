
import os
import django
from django.conf import settings
from django.urls import URLPattern, URLResolver

try:
    print("Initializing Django...")
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
    django.setup()
    
    from ordoc_ai.urls import urlpatterns
    
    def list_urls(lis, acc=None):
        if acc is None:
            acc = []
        if not lis:
            return
        for entry in lis:
            if isinstance(entry, URLPattern):
                print(''.join(acc) + str(entry.pattern))
            elif isinstance(entry, URLResolver):
                list_urls(entry.url_patterns, acc + [str(entry.pattern)])
    
    print("Listing all URLs:")
    list_urls(urlpatterns)

except Exception as e:
    import traceback
    traceback.print_exc()
