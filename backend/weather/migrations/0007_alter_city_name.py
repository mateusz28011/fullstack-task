# Generated by Django 4.0.5 on 2022-06-16 10:47

import django.contrib.postgres.fields.citext
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("weather", "0006_alter_weatherday_day_number_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="city",
            name="name",
            field=django.contrib.postgres.fields.citext.CICharField(
                max_length=100, unique=True
            ),
        ),
    ]