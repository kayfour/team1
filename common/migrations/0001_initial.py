# Generated by Django 3.1 on 2020-09-15 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CoMmon',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('img_name', models.CharField(max_length=200)),
                ('contents', models.TextField()),
                ('date', models.DateTimeField()),
                ('time', models.DateTimeField()),
                ('dron_id', models.CharField(max_length=20)),
                ('x', models.CharField(max_length=50)),
                ('y', models.CharField(max_length=50)),
                ('ip_address', models.CharField(max_length=50)),
            ],
        ),
    ]
