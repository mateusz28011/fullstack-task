# Generated by Django 4.0.5 on 2022-06-15 21:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weather', '0005_remove_weatherhour_condition'),
    ]

    operations = [
        migrations.AlterField(
            model_name='weatherday',
            name='day_number',
            field=models.SmallIntegerField(choices=[(-5, '-5'), (-4, '-4'), (-3, '-3'), (-2, '-2'), (-1, '-1'), (0, '0'), (1, '1'), (2, '2')]),
        ),
        migrations.AlterField(
            model_name='weatherhour',
            name='hour_number',
            field=models.SmallIntegerField(choices=[(0, '0'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5'), (6, '6'), (7, '7'), (8, '8'), (9, '9'), (10, '10'), (11, '11'), (12, '12'), (13, '13'), (14, '14'), (15, '15'), (16, '16'), (17, '17'), (18, '18'), (19, '19'), (20, '20'), (21, '21'), (22, '22'), (23, '23')]),
        ),
    ]
