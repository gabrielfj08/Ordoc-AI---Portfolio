from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('ordoc_air', '0005_document_versioning'),
    ]

    operations = [
        migrations.RenameField(
            model_name='document',
            old_name='original_filename',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='document',
            old_name='content_type',
            new_name='mime_type',
        ),
        migrations.AlterField(
            model_name='document',
            name='name',
            field=models.CharField(max_length=500, verbose_name='Nome'),
        ),
        migrations.AlterField(
            model_name='document',
            name='mime_type',
            field=models.CharField(max_length=100, blank=True, null=True, verbose_name='Tipo MIME'),
        ),
        migrations.RemoveIndex(
            model_name='document',
            name='ordoc_air_d_origina_cf4edc_idx',
        ),
        migrations.AddIndex(
            model_name='document',
            index=models.Index(fields=['name'], name='ordoc_air_doc_name_idx'),
        ),
    ]
