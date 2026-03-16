from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

try:
	import google.generativeai as genai
except ImportError:  # pragma: no cover
	genai = None


def generate_carpentry_reply(prompt):
	normalized = prompt.lower()

	if 'price' in normalized or 'cost' in normalized:
		return 'Carpentry pricing depends on design complexity, wood type, labor, and site conditions.'

	if 'repair' in normalized:
		return 'For wood repairs, share clear photos, dimensions, and damage details to get an accurate estimate.'

	if 'material' in normalized or 'wood' in normalized:
		return 'Common carpentry materials are plywood, MDF, hardwood, and treated lumber depending on use case.'

	if 'install' in normalized:
		return 'Installation timelines vary by scope. Cabinets and shelves are often completed faster than structural works.'

	return 'I can help with carpentry and woodwork inquiries such as services, materials, pricing, installation, and repairs.'


def generate_gemini_reply(prompt):
	if not settings.GEMINI_API_KEY or not genai:
		return None

	try:
		genai.configure(api_key=settings.GEMINI_API_KEY)
		model = genai.GenerativeModel(settings.GEMINI_MODEL)
		response = model.generate_content(
			f"You are a carpentry and woodwork assistant. Keep answers practical and concise.\n\nUser: {prompt}"
		)
		text = (getattr(response, 'text', '') or '').strip()
		return text or None
	except Exception:
		return None


class AIChatbotView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		prompt = (request.data.get('prompt') or '').strip()
		if not prompt:
			return Response({'detail': 'prompt is required.'}, status=status.HTTP_400_BAD_REQUEST)

		reply = generate_gemini_reply(prompt) or generate_carpentry_reply(prompt)
		return Response({'reply': reply})
