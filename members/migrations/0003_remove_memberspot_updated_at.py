# Generated by Django 5.0.4 on 2024-05-26 02:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0002_remove_memberspot_deleted_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='memberspot',
            name='updated_at',
        ),
    ]