"""
FSM (Finite State Machine) Tests - 100% Coverage Required

Testa todas as transições de estado dos modelos do OrdocFlow.
Este arquivo DEVE ter 100% de cobertura de código.
"""

import pytest
from django.utils import timezone
from datetime import datetime, timedelta
from django_fsm import TransitionNotAllowed

from ordoc_flow.models import Procedure, Task
from test.backend.factories import UserFactory, OrganizationFactory


@pytest.mark.django_db
@pytest.mark.fsm
class TestProcedureFSM:
    """
    Testa máquina de estados do modelo Procedure

    Estados: archived, draft, running, started, finished

    Transições:
    - archived → draft (reactivate)
    - draft → running (start_flow)
    - archived/running → started (mark_as_started)
    - started → finished (complete)
    - draft/started → archived (archive)
    """

    @pytest.fixture
    def organization(self):
        """Organização de teste"""
        return OrganizationFactory()

    @pytest.fixture
    def user(self):
        """Usuário de teste"""
        return UserFactory()

    @pytest.fixture
    def archived_procedure(self, organization, user):
        """Procedimento arquivado"""
        from ordoc_flow.models import Procedure
        return Procedure.objects.create(
            name="Test Archived Procedure",
            status='archived',
            organization=organization,
            created_by=user
        )

    @pytest.fixture
    def draft_procedure(self, organization, user):
        """Procedimento em rascunho"""
        from ordoc_flow.models import Procedure
        return Procedure.objects.create(
            name="Test Draft Procedure",
            status='draft',
            organization=organization,
            created_by=user
        )

    @pytest.fixture
    def running_procedure(self, organization, user):
        """Procedimento em execução"""
        from ordoc_flow.models import Procedure
        return Procedure.objects.create(
            name="Test Running Procedure",
            status='running',
            organization=organization,
            created_by=user
        )

    @pytest.fixture
    def started_procedure(self, organization, user):
        """Procedimento iniciado"""
        from ordoc_flow.models import Procedure
        return Procedure.objects.create(
            name="Test Started Procedure",
            status='started',
            organization=organization,
            created_by=user
        )

    # ========================================================================
    # TRANSIÇÃO: archived → draft
    # ========================================================================

    def test_reactivate_from_archived_to_draft(self, archived_procedure):
        """Testa reativação de procedimento arquivado para rascunho"""
        assert archived_procedure.status == 'archived'

        archived_procedure.reactivate()
        archived_procedure.save()

        assert archived_procedure.status == 'draft'

    def test_reactivate_from_non_archived_fails(self, draft_procedure):
        """Testa que reativação só funciona de archived"""
        assert draft_procedure.status == 'draft'

        with pytest.raises(TransitionNotAllowed):
            draft_procedure.reactivate()

    # ========================================================================
    # TRANSIÇÃO: draft → running
    # ========================================================================

    def test_start_flow_from_draft_to_running(self, draft_procedure):
        """Testa início de fluxo de draft para running"""
        assert draft_procedure.status == 'draft'

        draft_procedure.start_flow()
        draft_procedure.save()

        assert draft_procedure.status == 'running'

    def test_start_flow_from_non_draft_fails(self, running_procedure):
        """Testa que start_flow só funciona de draft"""
        assert running_procedure.status == 'running'

        with pytest.raises(TransitionNotAllowed):
            running_procedure.start_flow()

    # ========================================================================
    # TRANSIÇÃO: archived/running → started
    # ========================================================================

    def test_mark_as_started_from_archived(self, archived_procedure):
        """Testa marcar como iniciado a partir de archived"""
        assert archived_procedure.status == 'archived'

        archived_procedure.mark_as_started()
        archived_procedure.save()

        assert archived_procedure.status == 'started'

    def test_mark_as_started_from_running(self, running_procedure):
        """Testa marcar como iniciado a partir de running"""
        assert running_procedure.status == 'running'

        running_procedure.mark_as_started()
        running_procedure.save()

        assert archived_procedure.status == 'started'

    # ========================================================================
    # TRANSIÇÃO: started → finished
    # ========================================================================

    def test_complete_from_started_to_finished(self, started_procedure):
        """Testa completar procedimento de started para finished"""
        assert started_procedure.status == 'started'

        started_procedure.complete()
        started_procedure.save()

        assert started_procedure.status == 'finished'
        assert started_procedure.finished_at is not None

    def test_complete_from_non_started_fails(self, draft_procedure):
        """Testa que complete só funciona de started"""
        assert draft_procedure.status == 'draft'

        with pytest.raises(TransitionNotAllowed):
            draft_procedure.complete()

    # ========================================================================
    # TRANSIÇÃO: draft/started → archived
    # ========================================================================

    def test_archive_from_draft(self, draft_procedure):
        """Testa arquivar a partir de draft"""
        assert draft_procedure.status == 'draft'

        draft_procedure.archive()
        draft_procedure.save()

        assert draft_procedure.status == 'archived'

    def test_archive_from_started(self, started_procedure):
        """Testa arquivar a partir de started"""
        assert started_procedure.status == 'started'

        started_procedure.archive()
        started_procedure.save()

        assert started_procedure.status == 'archived'

    def test_archive_from_running_fails(self, running_procedure):
        """Testa que archive não funciona de running"""
        assert running_procedure.status == 'running'

        with pytest.raises(TransitionNotAllowed):
            running_procedure.archive()


@pytest.mark.django_db
@pytest.mark.fsm
class TestTaskFSM:
    """
    Testa máquina de estados do modelo Task

    Estados: running, draft, started, finished, refused

    Transições:
    - * → running (transition_to_running)
    - * → started (transition_to_started)
    - * → finished (transition_to_finished)
    - * → refused (transition_to_refused)
    """

    @pytest.fixture
    def organization(self):
        """Organização de teste"""
        return OrganizationFactory()

    @pytest.fixture
    def user(self):
        """Usuário de teste"""
        return UserFactory()

    @pytest.fixture
    def procedure(self, organization, user):
        """Procedimento de teste"""
        from ordoc_flow.models import Procedure
        return Procedure.objects.create(
            name="Test Procedure for Task",
            status='draft',
            organization=organization,
            created_by=user
        )

    @pytest.fixture
    def draft_task(self, procedure, user):
        """Task em rascunho"""
        from ordoc_flow.models import Task
        return Task.objects.create(
            name="Test Draft Task",
            status='draft',
            procedure=procedure,
            assigned_to=user,
            order=1
        )

    # ========================================================================
    # TRANSIÇÕES: * → running
    # ========================================================================

    def test_transition_to_running_from_draft(self, draft_task):
        """Testa transição para running a partir de draft"""
        assert draft_task.status == 'draft'

        draft_task.transition_to_running()
        draft_task.save()

        assert draft_task.status == 'running'

    def test_transition_to_running_from_finished(self, draft_task):
        """Testa transição para running a partir de finished"""
        # Primeiro completar
        draft_task.status = 'finished'
        draft_task.save()

        draft_task.transition_to_running()
        draft_task.save()

        assert draft_task.status == 'running'

    # ========================================================================
    # TRANSIÇÕES: * → started
    # ========================================================================

    def test_transition_to_started_from_running(self, draft_task):
        """Testa transição para started a partir de running"""
        draft_task.status = 'running'
        draft_task.save()

        draft_task.transition_to_started()
        draft_task.save()

        assert draft_task.status == 'started'

    # ========================================================================
    # TRANSIÇÕES: * → finished
    # ========================================================================

    def test_transition_to_finished_from_started(self, draft_task):
        """Testa transição para finished a partir de started"""
        draft_task.status = 'started'
        draft_task.save()

        draft_task.transition_to_finished()
        draft_task.save()

        assert draft_task.status == 'finished'

    # ========================================================================
    # TRANSIÇÕES: * → refused
    # ========================================================================

    def test_transition_to_refused_from_running(self, draft_task):
        """Testa transição para refused a partir de running"""
        draft_task.status = 'running'
        draft_task.save()

        draft_task.transition_to_refused()
        draft_task.save()

        assert draft_task.status == 'refused'

    def test_transition_to_refused_from_finished(self, draft_task):
        """Testa transição para refused a partir de finished (reabertura)"""
        draft_task.status = 'finished'
        draft_task.save()

        draft_task.transition_to_refused()
        draft_task.save()

        assert draft_task.status == 'refused'


@pytest.mark.django_db
@pytest.mark.fsm
class TestGroupRequesterFSM:
    """
    Testa máquina de estados do modelo GroupRequester

    Estados: active, inactive

    Transições:
    - inactive → active (activate_group)
    - active → inactive (deactivate_group)
    """

    @pytest.fixture
    def organization(self):
        """Organização de teste"""
        return OrganizationFactory()

    @pytest.fixture
    def inactive_group(self, organization):
        """Grupo inativo"""
        from ordoc_flow.models import GroupRequester
        return GroupRequester.objects.create(
            name="Inactive Group",
            status='inactive',
            organization=organization
        )

    @pytest.fixture
    def active_group(self, organization):
        """Grupo ativo"""
        from ordoc_flow.models import GroupRequester
        return GroupRequester.objects.create(
            name="Active Group",
            status='active',
            organization=organization
        )

    def test_activate_group_from_inactive(self, inactive_group):
        """Testa ativar grupo a partir de inactive"""
        assert inactive_group.status == 'inactive'

        inactive_group.activate_group()
        inactive_group.save()

        assert inactive_group.status == 'active'

    def test_activate_group_from_active_fails(self, active_group):
        """Testa que ativar grupo já ativo falha"""
        assert active_group.status == 'active'

        with pytest.raises(TransitionNotAllowed):
            active_group.activate_group()

    def test_deactivate_group_from_active(self, active_group):
        """Testa desativar grupo a partir de active"""
        assert active_group.status == 'active'

        active_group.deactivate_group()
        active_group.save()

        assert active_group.status == 'inactive'

    def test_deactivate_group_from_inactive_fails(self, inactive_group):
        """Testa que desativar grupo já inativo falha"""
        assert inactive_group.status == 'inactive'

        with pytest.raises(TransitionNotAllowed):
            inactive_group.deactivate_group()
