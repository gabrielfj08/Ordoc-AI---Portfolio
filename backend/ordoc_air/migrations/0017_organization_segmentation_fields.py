from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ordoc_air', '0016_document_favorited_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='type',
            field=models.CharField(blank=True, default='', max_length=50, verbose_name='Tipo'),
        ),
        migrations.AddField(
            model_name='organization',
            name='subtype',
            field=models.CharField(blank=True, default='', max_length=50, verbose_name='Subtipo'),
        ),
        migrations.AddField(
            model_name='organization',
            name='features',
            field=models.JSONField(blank=True, default=dict, verbose_name='Features'),
        ),
        migrations.AddField(
            model_name='organization',
            name='subtype_source',
            field=models.CharField(blank=True, default='', max_length=50, verbose_name='Origem do Subtipo'),
        ),
        migrations.AddField(
            model_name='organization',
            name='subtype_confidence',
            field=models.FloatField(blank=True, null=True, verbose_name='Confiança do Subtipo'),
        ),
    ]
