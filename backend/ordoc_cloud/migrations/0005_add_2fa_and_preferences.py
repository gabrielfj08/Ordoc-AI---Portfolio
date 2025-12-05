# Migration criada após análise do esquema real do banco de dados
# Adiciona apenas os campos que realmente faltam

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ordoc_cloud', '0004_alter_ordocuser_phone'),
    ]

    operations = [
        # Two-Factor Authentication fields
        migrations.AddField(
            model_name='ordocuser',
            name='two_factor_enabled',
            field=models.BooleanField(default=False, verbose_name='2FA habilitado'),
        ),
        migrations.AddField(
            model_name='ordocuser',
            name='two_factor_secret',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
        migrations.AddField(
            model_name='ordocuser',
            name='two_factor_backup_codes',
            field=models.JSONField(blank=True, default=list),
        ),
        # Profile completeness
        migrations.AddField(
            model_name='ordocuser',
            name='profile_complete',
            field=models.BooleanField(default=False, verbose_name='Perfil completo'),
        ),
        # User preferences
        migrations.AddField(
            model_name='ordocuser',
            name='language',
            field=models.CharField(
                choices=[('pt-BR', 'Português (Brasil)'), ('en-US', 'English (US)'), ('es', 'Español')],
                default='pt-BR',
                max_length=10,
                verbose_name='Idioma'
            ),
        ),
        migrations.AddField(
            model_name='ordocuser',
            name='timezone',
            field=models.CharField(default='America/Sao_Paulo', max_length=50, verbose_name='Fuso horário'),
        ),
        migrations.AddField(
            model_name='ordocuser',
            name='email_notifications',
            field=models.BooleanField(default=True, verbose_name='Notificações por email'),
        ),
        # UserOrganizationRole missing fields
        migrations.AddField(
            model_name='userorganizationrole',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Ativo'),
        ),
        migrations.AddField(
            model_name='userorganizationrole',
            name='is_primary',
            field=models.BooleanField(default=False, verbose_name='Organização primária'),
        ),
        migrations.AddField(
            model_name='userorganizationrole',
            name='assigned_by',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=models.deletion.SET_NULL,
                related_name='assigned_roles',
                to='ordoc_cloud.ordocuser'
            ),
        ),
    ]
