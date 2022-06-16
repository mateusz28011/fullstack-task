# Generated by Django 4.0.5 on 2022-06-13 20:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('city', models.CharField(max_length=50, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Weather',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weather', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='weather.city')),
            ],
        ),
        migrations.CreateModel(
            name='WeatherDay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day_number', models.SmallIntegerField(choices=[(-5, -5), (-4, -4), (-3, -3), (-2, -2), (-1, -1), (0, 0), (1, 1), (2, 2)])),
                ('weather', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weather.weather')),
            ],
            options={
                'unique_together': {('weather', 'day_number')},
            },
        ),
        migrations.CreateModel(
            name='WeatherHour',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hour_number', models.SmallIntegerField(choices=[(0, 0), (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8), (9, 9), (10, 10), (11, 11), (12, 12), (13, 13), (14, 14), (15, 15), (16, 16), (17, 17), (18, 18), (19, 19), (20, 20), (21, 21), (22, 22), (23, 23)])),
                ('condition', models.CharField(max_length=20)),
                ('temp_c', models.FloatField()),
                ('chance_of_rain', models.SmallIntegerField()),
                ('weather_day', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='weather.weatherday')),
            ],
            options={
                'unique_together': {('weather_day', 'hour_number')},
            },
        ),
    ]
