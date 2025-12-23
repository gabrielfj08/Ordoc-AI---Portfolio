# Generated manually for DocumentTemplate model

from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ordoc_air', '0013_categorizationrule'),
    ]

    operations = [
        migrations.CreateModel(
            name='DocumentTemplate',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255, verbose_name='Nome')),
                ('description', models.TextField(blank=True, null=True, verbose_name='Descrição')),
                ('category', models.CharField(max_length=100, verbose_name='Categoria')),
                ('version', models.CharField(default='1.0', max_length=20, verbose_name='Versão')),
                ('status', models.CharField(choices=[('draft', 'Rascunho'), ('active', 'Ativo'), ('archived', 'Arquivado')], default='draft', max_length=20, verbose_name='Status')),
                ('file', models.FileField(upload_to='templates/', validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'txt', 'odt'])], verbose_name='Arquivo Template')),
                ('usage_count', models.PositiveIntegerField(default=0, verbose_name='Contador de Uso')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_templates', to=settings.AUTH_USER_MODEL)),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='document_templates', to='ordoc_air.organization', verbose_name='Organização')),
                ('tags', models.ManyToManyField(blank=True, related_name='templates', to='ordoc_air.tag', verbose_name='Tags')),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='updated_templates', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Template de Documento',
                'verbose_name_plural': 'Templates de Documentos',
                'ordering': ['-usage_count', 'name'],
                'unique_together': {('organization', 'name', 'version')},
            },
        ),
    ]
