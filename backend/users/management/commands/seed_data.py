from django.core.management.base import BaseCommand

from services.models import Service
from users.models import CustomUserModel


SEED_SERVICES = [
    {
        'service_name': 'Custom Furniture Build',
        'description': 'Built-to-order wood furniture crafted for homes, offices, and commercial spaces with durable finishing and precise measurements.',
        'price': 15000,
        'duration_of_service': '7 to 21 days',
        'sample_image': 'https://picsum.photos/seed/furniture/600/400',
        'rating': 4.9,
        'seller_first_name': 'Ketzh',
        'seller_last_name': 'Dayao',
        'seller_username': 'ketzh.dayao',
        'seller_email': 'ketzh@platform.local',
    },
    {
        'service_name': 'Woodwork Installation',
        'description': 'Professional installation for cabinets, shelves, doors, wall panels, and other woodwork fixtures with clean site finishing.',
        'price': 3500,
        'duration_of_service': '4 hours to 2 days',
        'sample_image': 'https://picsum.photos/seed/woodwork/600/400',
        'rating': 4.7,
        'seller_first_name': 'Miranda',
        'seller_last_name': 'Khristina',
        'seller_username': 'miranda.khristina',
        'seller_email': 'miranda@platform.local',
    },
    {
        'service_name': 'Carpentry Repairs',
        'description': 'Repair service for damaged wooden furniture, loose joints, warped panels, and worn finishes to restore function and appearance.',
        'price': 1500,
        'duration_of_service': '2 to 8 hours',
        'sample_image': 'https://picsum.photos/seed/repairs/600/400',
        'rating': 4.8,
        'seller_first_name': 'Andrei',
        'seller_last_name': 'Dimalanta',
        'seller_username': 'andrei.dimalanta',
        'seller_email': 'andrei@platform.local',
    },
    {
        'service_name': 'Structural Carpentry',
        'description': 'Framing, partitions, decking, and other structural woodwork completed with attention to strength, alignment, and finish quality.',
        'price': 20000,
        'duration_of_service': '5 to 14 days',
        'sample_image': 'https://picsum.photos/seed/structural/600/400',
        'rating': 4.6,
        'seller_first_name': 'Ketzh',
        'seller_last_name': 'Dayao',
        'seller_username': 'ketzh.dayao',
        'seller_email': 'ketzh@platform.local',
    },
]


class Command(BaseCommand):
    help = 'Seeds the database with the admin account and sample carpentry services.'

    def handle(self, *args, **options):
        # Create admin
        if not CustomUserModel.objects.filter(role=CustomUserModel.ROLE_ADMIN).exists():
            admin = CustomUserModel.objects.create_user(
                username='admin',
                email='admin@platform.local',
                password='admin12345',
                first_name='Platform',
                last_name='Admin',
                role=CustomUserModel.ROLE_ADMIN,
            )
            admin.is_staff = True
            admin.is_superuser = True
            admin.save(update_fields=['is_staff', 'is_superuser'])
            self.stdout.write(self.style.SUCCESS('Admin created: admin@platform.local / admin12345'))
        else:
            self.stdout.write('Admin already exists — skipped.')

        # Create seed services
        if Service.objects.exists():
            self.stdout.write('Services already exist — skipped.')
            return

        seen_sellers = {}
        for entry in SEED_SERVICES:
            email = entry['seller_email']
            if email not in seen_sellers:
                seller, _ = CustomUserModel.objects.get_or_create(
                    email=email,
                    defaults={
                        'username': entry['seller_username'],
                        'first_name': entry['seller_first_name'],
                        'last_name': entry['seller_last_name'],
                        'role': CustomUserModel.ROLE_SELLER,
                        'merchant_id': f'SEED-{entry["seller_username"].upper()}',
                    },
                )
                if _:
                    seller.set_password('seller12345')
                    seller.save(update_fields=['password'])
                seen_sellers[email] = seller

            Service.objects.create(
                seller=seen_sellers[email],
                service_name=entry['service_name'],
                description=entry['description'],
                price=entry['price'],
                duration_of_service=entry['duration_of_service'],
                sample_image=entry['sample_image'],
                rating=entry['rating'],
            )

        self.stdout.write(self.style.SUCCESS(f'Created {len(SEED_SERVICES)} seed services.'))
