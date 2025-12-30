from ordoc_cloud.models import OrdocUser
from ordoc_flow.models import GroupRequester, GroupRequesterMember, Task, Procedure
from ordoc_air.models import Organization

# Get Ana and Org
ana = OrdocUser.objects.get(user__email='ana.silva@silvaadvocacia.com.br')
org = ana.organizations.first()

print(f"Fixing data for {ana.user.get_full_name()} in {org.corporate_name}")

# Get or Create Group 'Jurídico'
group, created = GroupRequester.objects.get_or_create(
    name='Jurídico',
    organization=org,
    defaults={'description': 'Departamento Jurídico'}
)
if created:
    print("Created Group 'Jurídico'")
else:
    print("Found Group 'Jurídico'")

# Add Ana to Group
member, created = GroupRequesterMember.objects.get_or_create(
    user=ana,
    group=group,
    defaults={'role': 'coordinator', 'is_active': True}
)
if created:
    print("Added Ana to Group")
else:
    print("Ana is already in Group")
    member.is_active = True
    member.save()

# Find some tasks and assign to this group
# Try to find tasks that are 'running' or 'draft'
tasks = Task.objects.filter(procedure__organization=org).exclude(status='finished')[:5]

if not tasks.exists():
    print("No active tasks found. Creating one.")
    proc = Procedure.objects.create(
        organization=org,
        process_number="TEST/2025",
        status="running",
        requester=ana, # Assuming she can be requester
        priority="high"
    )
    task = Task.objects.create(
        name="Análise Contratual Urgente",
        procedure=proc,
        status="running", # active
        priority="high",
        created_by=ana,
        group_assignee=group,
        prn=f"PRN-TEST-{proc.id}"
    )
    print(f"Created Task: {task.name}")
else:
    print(f"Assigning {tasks.count()} existing tasks to 'Jurídico'")
    for i, t in enumerate(tasks):
        t.group_assignee = group
        t.status = 'running' # Force active status
        t.priority = 'high' if i % 2 == 0 else 'normal'
        if i == 0:
            t.deadline = '2024-01-01' # Overdue
        t.save()
        print(f" - Assigned: {t.name} ({t.priority}, {t.status})")

print("Data fix complete.")
