# migracion inicial: registra el modelo proxy PanelCMS
# no crea tablas (es proxy de auth.User), solo registra el ContentType
# para que jazzmin pueda mostrarlo en la sidebar

from django.db import migrations


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='PanelCMS',
            fields=[],
            options={
                'verbose_name': 'panel',
                'verbose_name_plural': 'Panel',
                'proxy': True,
                'indexes': [],
                'constraints': [],
            },
            bases=('auth.user',),
        ),
    ]
