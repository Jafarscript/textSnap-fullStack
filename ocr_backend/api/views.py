# api/views.py 
import easyocr
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_LEFT
from django.http import FileResponse
from PIL import Image
import numpy as np
import io
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
import os
from docx import Document

# Path to font that supports multiple languages
FONT_PATH = os.path.join(os.path.dirname(__file__), 'fonts', 'NotoSans-Regular.ttf')
pdfmetrics.registerFont(TTFont('NotoSans', FONT_PATH))

class OCRAPIView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        image_file = request.FILES['image']
        language = request.POST.get('language', 'en')

        # Ensure image is in RGB
        image = Image.open(image_file).convert("RGB")
        image_np = np.array(image)

        # Run OCR
        try:
            reader = easyocr.Reader([language])
            result = reader.readtext(image_np)
            text = "\n".join([line[1] for line in result])
            return Response({"text": text})
        except Exception as e:
            return Response({"error": str(e), "text": ""}, status=400)


class GeneratePDF(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        language = request.data.get('language', 'en')

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)

        # Get default styles
        styles = getSampleStyleSheet()

        # Define a new paragraph style for RTL if needed
        # if language == 'ar':
        #     style = ParagraphStyle(
        #         'Arabic',
        #         parent=styles['Normal'],
        #         fontName='NotoSans',
        #         fontSize=12,
        #         leading=15,
        #         alignment=TA_RIGHT
        #     )
        # else:
        #     style = ParagraphStyle(
        #         'English',
        #         parent=styles['Normal'],
        #         fontName='NotoSans',
        #         fontSize=12,
        #         leading=15,
        #         alignment=TA_LEFT
        #     )

        # Build the story (list of flowables)
        story = []
        for line in text.split('\n'):
            if line.strip() == "":
                story.append(Spacer(1, 12))  # Blank line
            else:
                story.append(Paragraph(line.strip(), styles['Normal']))

        doc.build(story)
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename='output.pdf')
    


class GenerateWord(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        document = Document()
        lines = text.split('\n')

        for i, line in enumerate(lines):
            document.add_paragraph(line)
            # Add page break every 40 lines (adjustable)
            if (i + 1) % 40 == 0:
                document.add_page_break()

        buffer = io.BytesIO()
        document.save(buffer)
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename='output.docx')




