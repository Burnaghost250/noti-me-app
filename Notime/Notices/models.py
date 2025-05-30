from django.db import models
from django.utils import timezone 

class noti(models.Model):
    title = models.CharField(max_length=100)
    descri = models.TextField()
    img = models.FileField()
    ckeck = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
        class Meta:
            ordering = ['created']