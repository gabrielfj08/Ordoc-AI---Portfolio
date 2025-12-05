# Generated migration to add missing Document fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ordoc_air', '0006_rename_document_fields'),
    ]

    operations = [
        # Add ocr_language field
        migrations.AddField(
            model_name='document',
            name='ocr_language',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
