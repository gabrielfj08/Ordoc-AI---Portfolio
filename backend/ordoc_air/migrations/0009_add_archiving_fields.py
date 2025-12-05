# Migration to add archiving fields
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ordoc_air', '0008_add_storage_key'),
    ]

    operations = [
        # Add archived_at field
        migrations.AddField(
            model_name='document',
            name='archived_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Arquivado em'),
        ),
        # Add archived_by field
        migrations.AddField(
            model_name='document',
            name='archived_by',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='archived_documents',
                to=settings.AUTH_USER_MODEL,
                verbose_name='Arquivado por'
            ),
        ),
    ]
