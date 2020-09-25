from django.db import models

# Create your models here.
class CoMmon(models.Model):
  id = models.AutoField(primary_key=True)
  img_name = models.CharField(max_length=200)
  date = models.CharField(max_length=20)
  time = models.DateTimeField()
  dron_id = models.CharField(max_length=20)
  address = models.CharField(max_length=200)
  x = models.CharField(max_length=50)
  y = models.CharField(max_length=50)
  ip_address = models.CharField(max_length=50)
  wdate = models.DateTimeField()
