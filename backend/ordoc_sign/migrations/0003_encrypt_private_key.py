from django.db import migrations
import ordoc_sign.encryption

ENC_PREFIX = ordoc_sign.encryption.ENC_PREFIX
encrypt_value = ordoc_sign.encryption.encrypt_value
EncryptedTextField = ordoc_sign.encryption.EncryptedTextField


def encrypt_existing_keys(apps, schema_editor):
    DigitalCertificate = apps.get_model('ordoc_sign', 'DigitalCertificate')
    for cert in DigitalCertificate.objects.exclude(private_key__isnull=True):
        if cert.private_key and not cert.private_key.startswith(ENC_PREFIX):
            cert.private_key = encrypt_value(cert.private_key)
            cert.save(update_fields=['private_key'])

class Migration(migrations.Migration):

    dependencies = [
        ('ordoc_sign', '0002_alter_signaturebatch_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='digitalcertificate',
            name='private_key',
            field=EncryptedTextField(blank=True, null=True, help_text='Chave privada (apenas para A1)'),
        ),
        migrations.RunPython(encrypt_existing_keys, migrations.RunPython.noop),
    ]
