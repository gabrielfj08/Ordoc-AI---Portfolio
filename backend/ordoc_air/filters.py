"""
Filters for OrdocAir module
Equivalent to Rails filtering and scoping functionality
"""
import django_filters
from django.db.models import Q
from .models import Document, Directory, Organization, Department


class DocumentFilter(django_filters.FilterSet):
    """
    Filter for Document model
    Equivalent to Rails document filtering and scopes
    """
    
    # Basic filters
    status = django_filters.ChoiceFilter(choices=Document.STATUS_CHOICES)
    file_type = django_filters.CharFilter(lookup_expr='icontains')
    mime_type = django_filters.CharFilter(lookup_expr='icontains')
    
    # Date range filters
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    updated_after = django_filters.DateTimeFilter(field_name='updated_at', lookup_expr='gte')
    updated_before = django_filters.DateTimeFilter(field_name='updated_at', lookup_expr='lte')
    
    # File size filters
    file_size_min = django_filters.NumberFilter(field_name='file_size', lookup_expr='gte')
    file_size_max = django_filters.NumberFilter(field_name='file_size', lookup_expr='lte')
    
    # Relationship filters
    directory = django_filters.ModelChoiceFilter(queryset=Directory.objects.all())
    department = django_filters.ModelChoiceFilter(queryset=Department.objects.all())
    uploaded_by = django_filters.CharFilter(field_name='uploaded_by__username', lookup_expr='icontains')
    
    # Tag filters
    tags = django_filters.CharFilter(method='filter_tags')
    has_tags = django_filters.BooleanFilter(method='filter_has_tags')
    
    # Content filters
    has_ocr = django_filters.BooleanFilter(method='filter_has_ocr')
    ocr_content = django_filters.CharFilter(field_name='ocr_content', lookup_expr='icontains')
    
    # Version filters
    is_current_version = django_filters.BooleanFilter()
    version = django_filters.NumberFilter()
    
    class Meta:
        model = Document
        fields = [
            'status', 'file_type', 'mime_type', 'directory', 'department',
            'uploaded_by', 'is_current_version', 'version'
        ]
    
    def filter_tags(self, queryset, name, value):
        """Filter documents by tags (comma-separated)"""
        if not value:
            return queryset
        
        tags = [tag.strip() for tag in value.split(',')]
        query = Q()
        for tag in tags:
            query |= Q(tags__icontains=tag)
        
        return queryset.filter(query)
    
    def filter_has_tags(self, queryset, name, value):
        """Filter documents that have or don't have tags"""
        if value:
            return queryset.exclude(tags__exact='').exclude(tags__isnull=True)
        else:
            return queryset.filter(Q(tags__exact='') | Q(tags__isnull=True))
    
    def filter_has_ocr(self, queryset, name, value):
        """Filter documents that have or don't have OCR content"""
        if value:
            return queryset.exclude(ocr_content__exact='').exclude(ocr_content__isnull=True)
        else:
            return queryset.filter(Q(ocr_content__exact='') | Q(ocr_content__isnull=True))


class DirectoryFilter(django_filters.FilterSet):
    """
    Filter for Directory model
    """
    
    # Basic filters
    name = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    
    # Relationship filters
    parent = django_filters.ModelChoiceFilter(queryset=Directory.objects.all())
    department = django_filters.ModelChoiceFilter(queryset=Department.objects.all())
    
    # Hierarchy filters
    is_root = django_filters.BooleanFilter(method='filter_is_root')
    has_children = django_filters.BooleanFilter(method='filter_has_children')
    has_documents = django_filters.BooleanFilter(method='filter_has_documents')
    
    # Date filters
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = Directory
        fields = ['name', 'description', 'parent', 'department']
    
    def filter_is_root(self, queryset, name, value):
        """Filter root directories (no parent)"""
        if value:
            return queryset.filter(parent__isnull=True)
        else:
            return queryset.filter(parent__isnull=False)
    
    def filter_has_children(self, queryset, name, value):
        """Filter directories that have or don't have children"""
        if value:
            return queryset.filter(children__isnull=False).distinct()
        else:
            return queryset.filter(children__isnull=True)
    
    def filter_has_documents(self, queryset, name, value):
        """Filter directories that have or don't have documents"""
        if value:
            return queryset.filter(documents__isnull=False, documents__deleted_at__isnull=True).distinct()
        else:
            return queryset.exclude(documents__isnull=False, documents__deleted_at__isnull=True)


class OrganizationFilter(django_filters.FilterSet):
    """
    Filter for Organization model
    """
    
    # Basic filters
    corporate_name = django_filters.CharFilter(lookup_expr='icontains')
    cnpj = django_filters.CharFilter(lookup_expr='exact')
    subdomain = django_filters.CharFilter(lookup_expr='icontains')
    email = django_filters.CharFilter(lookup_expr='icontains')
    phone = django_filters.CharFilter(lookup_expr='icontains')
    contact_name = django_filters.CharFilter(lookup_expr='icontains')
    
    # Status filters
    is_active = django_filters.BooleanFilter()
    
    # Date filters
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = Organization
        fields = [
            'corporate_name', 'cnpj', 'subdomain', 'email', 'phone', 
            'contact_name', 'is_active'
        ]


class DepartmentFilter(django_filters.FilterSet):
    """
    Filter for Department model
    """
    
    # Basic filters
    name = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    
    # Relationship filters
    parent = django_filters.ModelChoiceFilter(queryset=Department.objects.all())
    organization = django_filters.ModelChoiceFilter(queryset=Organization.objects.all())
    
    # Hierarchy filters
    is_root = django_filters.BooleanFilter(method='filter_is_root')
    has_children = django_filters.BooleanFilter(method='filter_has_children')
    
    # Date filters
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = Department
        fields = ['name', 'description', 'parent', 'organization']
    
    def filter_is_root(self, queryset, name, value):
        """Filter root departments (no parent)"""
        if value:
            return queryset.filter(parent__isnull=True)
        else:
            return queryset.filter(parent__isnull=False)
    
    def filter_has_children(self, queryset, name, value):
        """Filter departments that have or don't have children"""
        if value:
            return queryset.filter(children__isnull=False).distinct()
        else:
            return queryset.filter(children__isnull=True)
