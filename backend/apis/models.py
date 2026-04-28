from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        PATIENT = 'PATIENT', 'Patient'
        PHARMACIST = 'PHARMACIST', 'Pharmacist'
        ADMIN = 'ADMIN', 'Admin'

    role = models.CharField(max_length=15, choices=Role.choices, default=Role.PATIENT)

    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class Patient(User):
    age = models.IntegerField(null=True, blank=True)
    wilaya = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)

    class Meta:
        verbose_name_plural = "Patients"

class Pharmacist(User):
    pharmacy_name = models.CharField(max_length=255)
    license_number = models.CharField(max_length=50)
    location = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)

    class Meta:
        verbose_name_plural = "Pharmacists"


class Administrator(User):
    department = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Administrators"

class Drug(models.Model):
    registration_number = models.CharField(max_length=100, blank=True, null=True)
    code = models.CharField(max_length=50, blank=True, null=True)
    generic_name = models.CharField(max_length=500, blank=True, null=True)
    brand_name = models.CharField(max_length=255, blank=True, null=True)
    form = models.CharField(max_length=255, blank=True, null=True)
    dosage = models.CharField(max_length=255, blank=True, null=True)
    packaging = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.brand_name} ({self.generic_name})"

