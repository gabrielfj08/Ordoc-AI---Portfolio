# Migration to add storage_key field
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ordoc_air', '0007_add_missing_document_fields'),
    ]

    operations = [
        # Add storage_key field
        migrations.AddField(
            model_name='document',
            name='storage_key',
            field=models.CharField(blank=True, max_length=500, null=True, verbose_name='Chave de Armazenamento'),
        ),
    ]
