# Generated by Django 4.1.7 on 2023-05-21 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('export_collections', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='exporttoken',
            name='collection_name',
            field=models.CharField(default='', max_length=200),
            preserve_default=False,
        ),
    ]