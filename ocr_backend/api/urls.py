from django.urls import path
from .views import OCRAPIView, GeneratePDF, GenerateWord


urlpatterns = [
    path("ocr/", OCRAPIView.as_view()),
    path("pdf/", GeneratePDF.as_view()),
    path('word/', GenerateWord.as_view())
]