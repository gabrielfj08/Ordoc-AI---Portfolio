from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('ordoc_air', '0004_document_processing_fields'),
    ]

    operations = [
        migrations.RenameField(
            model_name='document',
            old_name='head_document',
            new_name='parent_document',
        ),
        migrations.AddField(
            model_name='document',
            name='version',
            field=models.PositiveIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='document',
            name='is_current_version',
            field=models.BooleanField(default=True),
        ),
    ]
