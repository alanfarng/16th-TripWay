# Generated by Django 5.0.4 on 2024-05-09 06:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('schedules', '0003_schedules_spot_alter_schedules_end_date_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedules',
            name='spot',
        ),
    ]
