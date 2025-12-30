"""
Organization model factory
"""

import factory
from faker import Faker

fake = Faker('pt_BR')


class OrganizationFactory(factory.django.DjangoModelFactory):
    """Factory for Organization model"""

    class Meta:
        model = 'ordoc_cloud.Organization'
        django_get_or_create = ('subdomain',)

    name = factory.LazyFunction(lambda: fake.company())
    subdomain = factory.Sequence(lambda n: f'org{n}')
    is_active = True

    @factory.lazy_attribute
    def description(self):
        return fake.catch_phrase()
