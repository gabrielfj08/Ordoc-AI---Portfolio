"""
Intelligence API URLs - URL routing for intelligence endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AnalyzeDocumentView,
    QuickExtractView,
    AlertViewSet,
    FeedbackViewSet,
    PatternViewSet,
    AnalysisViewSet
)

app_name = 'intelligence'

router = DefaultRouter()
router.register(r'alerts', AlertViewSet, basename='alert')
router.register(r'feedback', FeedbackViewSet, basename='feedback')
router.register(r'patterns', PatternViewSet, basename='pattern')
router.register(r'analyses', AnalysisViewSet, basename='analysis')

urlpatterns = [
    path('analyze/', AnalyzeDocumentView.as_view(), name='analyze'),
    path('extract/', QuickExtractView.as_view(), name='extract'),
    path('', include(router.urls)),
]
