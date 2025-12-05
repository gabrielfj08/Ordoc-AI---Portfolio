# Migration to create Document-Tags ManyToMany relation
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ordoc_air', '0010_create_tag_table'),
    ]

    operations = [
        # Add ManyToMany field from Document to Tag
        migrations.AddField(
            model_name='document',
            name='tags',
            field=models.ManyToManyField(
                blank=True,
                related_name='documents',
                to='ordoc_air.tag',
                verbose_name='Tags'
            ),
        ),
    ]
