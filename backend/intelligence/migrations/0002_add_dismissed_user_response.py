# Generated migration to add 'dismissed' option to UserResponse

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('intelligence', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proactivealert',
            name='user_response',
            field=models.CharField(
                choices=[
                    ('pending', 'Pendente'),
                    ('accepted', 'Aceito'),
                    ('rejected', 'Rejeitado'),
                    ('modified', 'Modificado'),
                    ('dismissed', 'Dispensado')
                ],
                default='pending',
                max_length=20
            ),
        ),
    ]
