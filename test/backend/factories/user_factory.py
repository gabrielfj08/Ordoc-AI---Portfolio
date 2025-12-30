"""
User model factory
"""

import factory
from django.contrib.auth import get_user_model
from faker import Faker

User = get_user_model()
fake = Faker('pt_BR')


class UserFactory(factory.django.DjangoModelFactory):
    """Factory for User model"""

    class Meta:
        model = User
        django_get_or_create = ('username',)

    username = factory.Sequence(lambda n: f'user{n}')
    email = factory.LazyAttribute(lambda obj: f'{obj.username}@test.com')
    first_name = factory.LazyFunction(lambda: fake.first_name())
    last_name = factory.LazyFunction(lambda: fake.last_name())
    is_active = True
    is_staff = False
    is_superuser = False

    @factory.post_generation
    def password(obj, create, extracted, **kwargs):
        """Set password after user creation"""
        if not create:
            return

        password = extracted or 'testpass123'
        obj.set_password(password)
        obj.save()


class AdminUserFactory(UserFactory):
    """Factory for admin users"""

    is_staff = True
    is_superuser = True
    username = factory.Sequence(lambda n: f'admin{n}')
