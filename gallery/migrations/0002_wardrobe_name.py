# Generated by Django 5.1.1 on 2024-11-04 04:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='wardrobe',
            name='name',
            field=models.CharField(default='', max_length=100),
        ),
    ]
