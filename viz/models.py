# This is an auto-generated Django model module. CREATED BY python3 manage.py inspectdb command
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.




from django.db import models


class Results(models.Model):
    index = models.BigIntegerField(blank=True, primary_key=True)
    season = models.TextField(blank=True, null=True)
    division = models.TextField(blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    homeaway = models.TextField(blank=True, null=True)
    team = models.TextField(blank=True, null=True)
    opponent = models.TextField(blank=True, null=True)
    goals = models.BigIntegerField(blank=True, null=True)
    goals_opp = models.BigIntegerField(blank=True, null=True)
    result = models.TextField(blank=True, null=True)
    points = models.BigIntegerField(blank=True, null=True)
    h1_goals = models.TextField(blank=True, null=True)  # This field type is a guess.
    h1_goals_opp = models.TextField(blank=True, null=True)  # This field type is a guess.
    h1_result = models.TextField(blank=True, null=True)
    h1_points = models.TextField(blank=True, null=True)  # This field type is a guess.
    h2_goals = models.TextField(blank=True, null=True)  # This field type is a guess.
    h2_goals_opp = models.TextField(blank=True, null=True)  # This field type is a guess.
    h2_result = models.TextField(blank=True, null=True)
    h2_points = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'results'

class TestUser(models.Model):
    Userid = models.BigIntegerField(blank=False, null=False,primary_key=True)
    UserDomain=models.TextField(blank=False, null=False)
    UserName=models.TextField(blank=False, null=False)
    Password=models.CharField(blank=False, null=False,max_length=20)
    Email=models.EmailField(blank=False, null=False)