#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
django.setup()

from ordoc_air.serializers import DirectorySerializer

s = DirectorySerializer()
print("=" * 60)
print("DIRECTORY SERIALIZER FIELDS")
print("=" * 60)
print("\n📋 All Fields:")
for name, field in s.fields.items():
    print(f"  - {name}: {field.__class__.__name__} (required={field.required}, read_only={field.read_only})")

print("\n✅ Required Fields:")
required = [f for f, v in s.fields.items() if v.required and not v.read_only]
for f in required:
    print(f"  - {f}")

print("\n📖 Read-only Fields:")
readonly = [f for f, v in s.fields.items() if v.read_only]
for f in readonly:
    print(f"  - {f}")
