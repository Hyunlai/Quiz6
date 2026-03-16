import carpentryFurniture from './assets/Carpentry_Furniture.jpg';
import carpentryInstallation from './assets/Carpentry_Installation.jpg';
import carpentryRepairs from './assets/Carpentry_Repairs.jpg';
import carpentryStructural from './assets/Carpentry_Structural.jpg';

const services = [
	{
		id: 'custom-furniture-build',
		service_name: 'Custom Furniture Build',
		description:
			'Built-to-order wood furniture crafted for homes, offices, and commercial spaces with durable finishing and precise measurements.',
		rating: 4.9,
		price: 'PHP 15,000 to PHP 45,000',
		price_value: 15000,
		duration_of_service: '7 to 21 days',
		sample_image: carpentryFurniture,
		name_of_the_expert: 'Ketzh Dayao',
	},
	{
		id: 'woodwork-installation',
		service_name: 'Woodwork Installation',
		description:
			'Professional installation for cabinets, shelves, doors, wall panels, and other woodwork fixtures with clean site finishing.',
		rating: 4.7,
		price: 'PHP 3,500 to PHP 12,000',
		price_value: 3500,
		duration_of_service: '4 hours to 2 days',
		sample_image: carpentryInstallation,
		name_of_the_expert: 'Miranda Khristina',
	},
	{
		id: 'carpentry-repairs',
		service_name: 'Carpentry Repairs',
		description:
			'Repair service for damaged wooden furniture, loose joints, warped panels, and worn finishes to restore function and appearance.',
		rating: 4.8,
		price: 'PHP 1,500 to PHP 6,000',
		price_value: 1500,
		duration_of_service: '2 to 8 hours',
		sample_image: carpentryRepairs,
		name_of_the_expert: 'Andrei Dimalanta',
	},
	{
		id: 'structural-carpentry',
		service_name: 'Structural Carpentry',
		description:
			'Framing, partitions, decking, and other structural woodwork completed with attention to strength, alignment, and finish quality.',
		rating: 4.6,
		price: 'PHP 20,000 to PHP 80,000',
		price_value: 20000,
		duration_of_service: '5 to 20 days',
		sample_image: carpentryStructural,
		name_of_the_expert: 'Benj Alcantara',
	},
];

export default services;
