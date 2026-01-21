/**
 * Comprehensive list of business types and industries
 * Organized by category for easy searching and selection
 */

export interface BusinessType {
  id: string;
  name: string;
  category: string;
  keywords: string[]; // For search functionality
}

export interface BusinessCategory {
  id: string;
  name: string;
  icon: string;
  types: BusinessType[];
}

// All business categories with their types
export const businessCategories: BusinessCategory[] = [
  {
    id: 'home-services',
    name: 'Home Services',
    icon: '🏠',
    types: [
      { id: 'pest-control', name: 'Pest Control', category: 'Home Services', keywords: ['exterminator', 'bugs', 'insects', 'rodents', 'termites', 'bed bugs'] },
      { id: 'plumbing', name: 'Plumbing', category: 'Home Services', keywords: ['plumber', 'pipes', 'drains', 'water heater', 'leak'] },
      { id: 'electrical', name: 'Electrical', category: 'Home Services', keywords: ['electrician', 'wiring', 'outlets', 'lighting', 'panel'] },
      { id: 'hvac', name: 'HVAC', category: 'Home Services', keywords: ['heating', 'cooling', 'air conditioning', 'furnace', 'AC'] },
      { id: 'roofing', name: 'Roofing', category: 'Home Services', keywords: ['roof', 'shingles', 'gutters', 'roof repair'] },
      { id: 'landscaping', name: 'Landscaping', category: 'Home Services', keywords: ['lawn', 'garden', 'yard', 'trees', 'lawn care'] },
      { id: 'cleaning', name: 'House Cleaning', category: 'Home Services', keywords: ['maid', 'housekeeping', 'janitorial', 'deep clean'] },
      { id: 'carpet-cleaning', name: 'Carpet Cleaning', category: 'Home Services', keywords: ['rugs', 'upholstery', 'steam clean'] },
      { id: 'painting', name: 'Painting', category: 'Home Services', keywords: ['painter', 'interior', 'exterior', 'house painting'] },
      { id: 'flooring', name: 'Flooring', category: 'Home Services', keywords: ['hardwood', 'tile', 'carpet', 'laminate', 'vinyl'] },
      { id: 'windows', name: 'Window Services', category: 'Home Services', keywords: ['window cleaning', 'window replacement', 'glass'] },
      { id: 'garage-door', name: 'Garage Door', category: 'Home Services', keywords: ['garage door repair', 'opener', 'installation'] },
      { id: 'handyman', name: 'Handyman', category: 'Home Services', keywords: ['repairs', 'maintenance', 'odd jobs', 'fix'] },
      { id: 'home-security', name: 'Home Security', category: 'Home Services', keywords: ['alarm', 'cameras', 'security system', 'surveillance'] },
      { id: 'pool-service', name: 'Pool Service', category: 'Home Services', keywords: ['pool cleaning', 'pool maintenance', 'pool repair'] },
      { id: 'septic', name: 'Septic Services', category: 'Home Services', keywords: ['septic tank', 'septic pumping', 'sewage'] },
      { id: 'tree-service', name: 'Tree Service', category: 'Home Services', keywords: ['tree removal', 'tree trimming', 'arborist', 'stump'] },
      { id: 'fence', name: 'Fencing', category: 'Home Services', keywords: ['fence installation', 'fence repair', 'gates'] },
      { id: 'pressure-washing', name: 'Pressure Washing', category: 'Home Services', keywords: ['power washing', 'cleaning', 'deck', 'driveway'] },
      { id: 'junk-removal', name: 'Junk Removal', category: 'Home Services', keywords: ['hauling', 'trash', 'cleanup', 'debris'] },
      { id: 'insulation', name: 'Insulation', category: 'Home Services', keywords: ['attic', 'wall insulation', 'energy efficiency'] },
      { id: 'chimney', name: 'Chimney Services', category: 'Home Services', keywords: ['chimney sweep', 'chimney repair', 'fireplace'] },
      { id: 'solar', name: 'Solar Installation', category: 'Home Services', keywords: ['solar panels', 'solar energy', 'renewable'] },
    ]
  },
  {
    id: 'construction',
    name: 'Construction & Remodeling',
    icon: '🔨',
    types: [
      { id: 'general-contractor', name: 'General Contractor', category: 'Construction & Remodeling', keywords: ['construction', 'building', 'contractor'] },
      { id: 'home-remodeling', name: 'Home Remodeling', category: 'Construction & Remodeling', keywords: ['renovation', 'remodel', 'home improvement'] },
      { id: 'kitchen-remodeling', name: 'Kitchen Remodeling', category: 'Construction & Remodeling', keywords: ['kitchen renovation', 'cabinets', 'countertops'] },
      { id: 'bathroom-remodeling', name: 'Bathroom Remodeling', category: 'Construction & Remodeling', keywords: ['bathroom renovation', 'shower', 'tub'] },
      { id: 'basement-finishing', name: 'Basement Finishing', category: 'Construction & Remodeling', keywords: ['basement remodel', 'basement renovation'] },
      { id: 'additions', name: 'Home Additions', category: 'Construction & Remodeling', keywords: ['room addition', 'extension', 'expansion'] },
      { id: 'deck-patio', name: 'Deck & Patio', category: 'Construction & Remodeling', keywords: ['deck building', 'patio construction', 'outdoor'] },
      { id: 'concrete', name: 'Concrete', category: 'Construction & Remodeling', keywords: ['concrete contractor', 'driveway', 'foundation'] },
      { id: 'masonry', name: 'Masonry', category: 'Construction & Remodeling', keywords: ['brick', 'stone', 'block', 'mason'] },
      { id: 'siding', name: 'Siding', category: 'Construction & Remodeling', keywords: ['vinyl siding', 'exterior', 'cladding'] },
      { id: 'drywall', name: 'Drywall', category: 'Construction & Remodeling', keywords: ['sheetrock', 'drywall repair', 'plastering'] },
      { id: 'demolition', name: 'Demolition', category: 'Construction & Remodeling', keywords: ['demo', 'teardown', 'removal'] },
      { id: 'framing', name: 'Framing', category: 'Construction & Remodeling', keywords: ['wood framing', 'structure', 'carpentry'] },
      { id: 'cabinet-making', name: 'Cabinet Making', category: 'Construction & Remodeling', keywords: ['custom cabinets', 'cabinetry', 'woodworking'] },
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: '🚗',
    types: [
      { id: 'auto-repair', name: 'Auto Repair', category: 'Automotive', keywords: ['mechanic', 'car repair', 'auto shop'] },
      { id: 'auto-body', name: 'Auto Body Shop', category: 'Automotive', keywords: ['collision', 'body work', 'paint'] },
      { id: 'oil-change', name: 'Oil Change', category: 'Automotive', keywords: ['lube', 'quick lube', 'oil service'] },
      { id: 'tire-shop', name: 'Tire Shop', category: 'Automotive', keywords: ['tires', 'wheels', 'alignment'] },
      { id: 'auto-glass', name: 'Auto Glass', category: 'Automotive', keywords: ['windshield', 'glass repair', 'replacement'] },
      { id: 'car-wash', name: 'Car Wash', category: 'Automotive', keywords: ['detailing', 'car cleaning', 'wash'] },
      { id: 'towing', name: 'Towing', category: 'Automotive', keywords: ['tow truck', 'roadside assistance', 'recovery'] },
      { id: 'car-dealership', name: 'Car Dealership', category: 'Automotive', keywords: ['auto dealer', 'new cars', 'used cars'] },
      { id: 'motorcycle', name: 'Motorcycle Shop', category: 'Automotive', keywords: ['motorcycle repair', 'bikes', 'motorcycle dealer'] },
      { id: 'transmission', name: 'Transmission Shop', category: 'Automotive', keywords: ['transmission repair', 'gearbox'] },
      { id: 'brake-shop', name: 'Brake Shop', category: 'Automotive', keywords: ['brakes', 'brake repair', 'brake pads'] },
      { id: 'muffler-exhaust', name: 'Muffler & Exhaust', category: 'Automotive', keywords: ['exhaust', 'muffler repair', 'catalytic'] },
    ]
  },
  {
    id: 'health-medical',
    name: 'Health & Medical',
    icon: '⚕️',
    types: [
      { id: 'dentist', name: 'Dentist', category: 'Health & Medical', keywords: ['dental', 'teeth', 'oral health'] },
      { id: 'chiropractor', name: 'Chiropractor', category: 'Health & Medical', keywords: ['chiropractic', 'spine', 'adjustment'] },
      { id: 'physical-therapy', name: 'Physical Therapy', category: 'Health & Medical', keywords: ['PT', 'rehabilitation', 'therapy'] },
      { id: 'optometrist', name: 'Optometrist', category: 'Health & Medical', keywords: ['eye doctor', 'vision', 'glasses'] },
      { id: 'dermatologist', name: 'Dermatologist', category: 'Health & Medical', keywords: ['skin doctor', 'skin care', 'dermatology'] },
      { id: 'med-spa', name: 'Medical Spa', category: 'Health & Medical', keywords: ['medspa', 'aesthetics', 'botox', 'fillers'] },
      { id: 'urgent-care', name: 'Urgent Care', category: 'Health & Medical', keywords: ['walk-in clinic', 'emergency', 'immediate care'] },
      { id: 'mental-health', name: 'Mental Health', category: 'Health & Medical', keywords: ['therapist', 'counseling', 'psychiatry', 'psychology'] },
      { id: 'veterinarian', name: 'Veterinarian', category: 'Health & Medical', keywords: ['vet', 'animal hospital', 'pet doctor'] },
      { id: 'orthodontist', name: 'Orthodontist', category: 'Health & Medical', keywords: ['braces', 'invisalign', 'teeth straightening'] },
      { id: 'podiatrist', name: 'Podiatrist', category: 'Health & Medical', keywords: ['foot doctor', 'feet', 'ankle'] },
      { id: 'hearing', name: 'Hearing Services', category: 'Health & Medical', keywords: ['audiologist', 'hearing aids', 'hearing test'] },
      { id: 'acupuncture', name: 'Acupuncture', category: 'Health & Medical', keywords: ['acupuncturist', 'alternative medicine', 'TCM'] },
      { id: 'massage-therapy', name: 'Massage Therapy', category: 'Health & Medical', keywords: ['massage', 'bodywork', 'relaxation'] },
      { id: 'home-healthcare', name: 'Home Healthcare', category: 'Health & Medical', keywords: ['home care', 'nursing', 'senior care'] },
      { id: 'pharmacy', name: 'Pharmacy', category: 'Health & Medical', keywords: ['drugstore', 'prescription', 'medication'] },
    ]
  },
  {
    id: 'legal-financial',
    name: 'Legal & Financial',
    icon: '⚖️',
    types: [
      { id: 'personal-injury-lawyer', name: 'Personal Injury Lawyer', category: 'Legal & Financial', keywords: ['injury attorney', 'accident lawyer', 'PI'] },
      { id: 'family-lawyer', name: 'Family Lawyer', category: 'Legal & Financial', keywords: ['divorce attorney', 'custody', 'family law'] },
      { id: 'criminal-lawyer', name: 'Criminal Defense Lawyer', category: 'Legal & Financial', keywords: ['criminal attorney', 'defense', 'DUI'] },
      { id: 'immigration-lawyer', name: 'Immigration Lawyer', category: 'Legal & Financial', keywords: ['immigration attorney', 'visa', 'green card'] },
      { id: 'estate-lawyer', name: 'Estate Planning Lawyer', category: 'Legal & Financial', keywords: ['wills', 'trusts', 'probate'] },
      { id: 'bankruptcy-lawyer', name: 'Bankruptcy Lawyer', category: 'Legal & Financial', keywords: ['bankruptcy attorney', 'debt', 'chapter 7'] },
      { id: 'accountant', name: 'Accountant', category: 'Legal & Financial', keywords: ['CPA', 'accounting', 'bookkeeping'] },
      { id: 'tax-prep', name: 'Tax Preparation', category: 'Legal & Financial', keywords: ['tax service', 'tax filing', 'income tax'] },
      { id: 'financial-advisor', name: 'Financial Advisor', category: 'Legal & Financial', keywords: ['wealth management', 'investment', 'planning'] },
      { id: 'insurance-agent', name: 'Insurance Agent', category: 'Legal & Financial', keywords: ['insurance broker', 'life insurance', 'auto insurance'] },
      { id: 'mortgage-broker', name: 'Mortgage Broker', category: 'Legal & Financial', keywords: ['mortgage lender', 'home loan', 'refinance'] },
      { id: 'notary', name: 'Notary', category: 'Legal & Financial', keywords: ['notary public', 'notarization', 'documents'] },
    ]
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: '🏢',
    types: [
      { id: 'real-estate-agent', name: 'Real Estate Agent', category: 'Real Estate', keywords: ['realtor', 'home sales', 'property'] },
      { id: 'property-management', name: 'Property Management', category: 'Real Estate', keywords: ['rental management', 'landlord', 'tenant'] },
      { id: 'home-inspection', name: 'Home Inspection', category: 'Real Estate', keywords: ['inspector', 'home inspection', 'property inspection'] },
      { id: 'appraisal', name: 'Property Appraisal', category: 'Real Estate', keywords: ['appraiser', 'valuation', 'home value'] },
      { id: 'title-company', name: 'Title Company', category: 'Real Estate', keywords: ['title insurance', 'escrow', 'closing'] },
      { id: 'commercial-real-estate', name: 'Commercial Real Estate', category: 'Real Estate', keywords: ['commercial property', 'office space', 'retail'] },
      { id: 'staging', name: 'Home Staging', category: 'Real Estate', keywords: ['staging', 'home presentation', 'selling'] },
    ]
  },
  {
    id: 'beauty-wellness',
    name: 'Beauty & Wellness',
    icon: '💄',
    types: [
      { id: 'hair-salon', name: 'Hair Salon', category: 'Beauty & Wellness', keywords: ['hairdresser', 'haircut', 'stylist', 'barber'] },
      { id: 'nail-salon', name: 'Nail Salon', category: 'Beauty & Wellness', keywords: ['manicure', 'pedicure', 'nails'] },
      { id: 'spa', name: 'Day Spa', category: 'Beauty & Wellness', keywords: ['spa services', 'facial', 'relaxation'] },
      { id: 'tanning', name: 'Tanning Salon', category: 'Beauty & Wellness', keywords: ['tanning bed', 'spray tan', 'sun'] },
      { id: 'tattoo', name: 'Tattoo Shop', category: 'Beauty & Wellness', keywords: ['tattoo artist', 'tattoos', 'ink'] },
      { id: 'piercing', name: 'Piercing Studio', category: 'Beauty & Wellness', keywords: ['body piercing', 'ear piercing'] },
      { id: 'lashes', name: 'Lash Studio', category: 'Beauty & Wellness', keywords: ['eyelash extensions', 'lash lift', 'lashes'] },
      { id: 'brows', name: 'Brow Studio', category: 'Beauty & Wellness', keywords: ['eyebrows', 'microblading', 'waxing'] },
      { id: 'gym', name: 'Gym / Fitness Center', category: 'Beauty & Wellness', keywords: ['fitness', 'workout', 'exercise', 'health club'] },
      { id: 'yoga', name: 'Yoga Studio', category: 'Beauty & Wellness', keywords: ['yoga classes', 'meditation', 'pilates'] },
      { id: 'personal-training', name: 'Personal Training', category: 'Beauty & Wellness', keywords: ['trainer', 'fitness coach', 'workout'] },
      { id: 'weight-loss', name: 'Weight Loss Clinic', category: 'Beauty & Wellness', keywords: ['diet', 'weight management', 'nutrition'] },
    ]
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    icon: '🍽️',
    types: [
      { id: 'restaurant', name: 'Restaurant', category: 'Food & Beverage', keywords: ['dining', 'food', 'eat'] },
      { id: 'cafe', name: 'Cafe / Coffee Shop', category: 'Food & Beverage', keywords: ['coffee', 'cafe', 'espresso'] },
      { id: 'bar', name: 'Bar / Nightclub', category: 'Food & Beverage', keywords: ['bar', 'drinks', 'nightlife'] },
      { id: 'bakery', name: 'Bakery', category: 'Food & Beverage', keywords: ['bread', 'pastries', 'cakes'] },
      { id: 'catering', name: 'Catering', category: 'Food & Beverage', keywords: ['catering service', 'events', 'food service'] },
      { id: 'food-truck', name: 'Food Truck', category: 'Food & Beverage', keywords: ['mobile food', 'street food'] },
      { id: 'pizza', name: 'Pizza Shop', category: 'Food & Beverage', keywords: ['pizza', 'pizzeria', 'delivery'] },
      { id: 'fast-food', name: 'Fast Food', category: 'Food & Beverage', keywords: ['quick service', 'burgers', 'fries'] },
      { id: 'ice-cream', name: 'Ice Cream Shop', category: 'Food & Beverage', keywords: ['ice cream', 'frozen yogurt', 'dessert'] },
      { id: 'brewery', name: 'Brewery / Winery', category: 'Food & Beverage', keywords: ['craft beer', 'wine', 'brewing'] },
    ]
  },
  {
    id: 'education',
    name: 'Education & Training',
    icon: '📚',
    types: [
      { id: 'tutoring', name: 'Tutoring', category: 'Education & Training', keywords: ['tutor', 'academic help', 'learning'] },
      { id: 'driving-school', name: 'Driving School', category: 'Education & Training', keywords: ['driving lessons', 'driver education'] },
      { id: 'music-lessons', name: 'Music Lessons', category: 'Education & Training', keywords: ['music teacher', 'piano', 'guitar'] },
      { id: 'dance-studio', name: 'Dance Studio', category: 'Education & Training', keywords: ['dance lessons', 'ballet', 'dance classes'] },
      { id: 'martial-arts', name: 'Martial Arts', category: 'Education & Training', keywords: ['karate', 'taekwondo', 'MMA', 'self-defense'] },
      { id: 'language-school', name: 'Language School', category: 'Education & Training', keywords: ['language learning', 'ESL', 'foreign language'] },
      { id: 'preschool', name: 'Preschool / Daycare', category: 'Education & Training', keywords: ['childcare', 'nursery', 'early education'] },
      { id: 'test-prep', name: 'Test Prep', category: 'Education & Training', keywords: ['SAT', 'ACT', 'GRE', 'exam prep'] },
      { id: 'art-classes', name: 'Art Classes', category: 'Education & Training', keywords: ['art lessons', 'painting', 'drawing'] },
      { id: 'cooking-classes', name: 'Cooking Classes', category: 'Education & Training', keywords: ['culinary', 'chef', 'cooking school'] },
      { id: 'swimming-lessons', name: 'Swimming Lessons', category: 'Education & Training', keywords: ['swim school', 'swimming', 'aquatics'] },
    ]
  },
  {
    id: 'events-entertainment',
    name: 'Events & Entertainment',
    icon: '🎉',
    types: [
      { id: 'wedding-planning', name: 'Wedding Planning', category: 'Events & Entertainment', keywords: ['wedding planner', 'weddings', 'bridal'] },
      { id: 'photography', name: 'Photography', category: 'Events & Entertainment', keywords: ['photographer', 'photos', 'portraits'] },
      { id: 'videography', name: 'Videography', category: 'Events & Entertainment', keywords: ['video production', 'videographer', 'film'] },
      { id: 'dj', name: 'DJ Services', category: 'Events & Entertainment', keywords: ['DJ', 'music', 'party'] },
      { id: 'event-venue', name: 'Event Venue', category: 'Events & Entertainment', keywords: ['venue rental', 'banquet hall', 'event space'] },
      { id: 'party-rentals', name: 'Party Rentals', category: 'Events & Entertainment', keywords: ['party supplies', 'tent rental', 'equipment'] },
      { id: 'florist', name: 'Florist', category: 'Events & Entertainment', keywords: ['flowers', 'floral', 'arrangements'] },
      { id: 'entertainment', name: 'Entertainment', category: 'Events & Entertainment', keywords: ['performer', 'magician', 'clown'] },
      { id: 'limousine', name: 'Limousine Service', category: 'Events & Entertainment', keywords: ['limo', 'luxury transport', 'chauffeur'] },
      { id: 'photo-booth', name: 'Photo Booth', category: 'Events & Entertainment', keywords: ['photo booth rental', 'party photos'] },
    ]
  },
  {
    id: 'pet-services',
    name: 'Pet Services',
    icon: '🐕',
    types: [
      { id: 'pet-grooming', name: 'Pet Grooming', category: 'Pet Services', keywords: ['dog grooming', 'pet salon', 'groomer'] },
      { id: 'pet-boarding', name: 'Pet Boarding', category: 'Pet Services', keywords: ['kennel', 'pet hotel', 'dog boarding'] },
      { id: 'dog-training', name: 'Dog Training', category: 'Pet Services', keywords: ['dog trainer', 'obedience', 'puppy training'] },
      { id: 'pet-sitting', name: 'Pet Sitting', category: 'Pet Services', keywords: ['pet sitter', 'dog walking', 'pet care'] },
      { id: 'pet-store', name: 'Pet Store', category: 'Pet Services', keywords: ['pet shop', 'pet supplies', 'animals'] },
      { id: 'dog-daycare', name: 'Dog Daycare', category: 'Pet Services', keywords: ['doggy daycare', 'dog care', 'pet daycare'] },
    ]
  },
  {
    id: 'moving-storage',
    name: 'Moving & Storage',
    icon: '📦',
    types: [
      { id: 'moving-company', name: 'Moving Company', category: 'Moving & Storage', keywords: ['movers', 'relocation', 'moving service'] },
      { id: 'storage', name: 'Storage Facility', category: 'Moving & Storage', keywords: ['self storage', 'storage unit', 'mini storage'] },
      { id: 'packing', name: 'Packing Services', category: 'Moving & Storage', keywords: ['packing', 'boxes', 'moving supplies'] },
      { id: 'piano-moving', name: 'Piano Moving', category: 'Moving & Storage', keywords: ['piano movers', 'specialty moving'] },
      { id: 'commercial-moving', name: 'Commercial Moving', category: 'Moving & Storage', keywords: ['office moving', 'business relocation'] },
    ]
  },
  {
    id: 'technology',
    name: 'Technology & IT',
    icon: '💻',
    types: [
      { id: 'it-support', name: 'IT Support', category: 'Technology & IT', keywords: ['tech support', 'computer help', 'IT services'] },
      { id: 'computer-repair', name: 'Computer Repair', category: 'Technology & IT', keywords: ['PC repair', 'laptop repair', 'computer fix'] },
      { id: 'web-design', name: 'Web Design', category: 'Technology & IT', keywords: ['website design', 'web development', 'websites'] },
      { id: 'seo', name: 'SEO Services', category: 'Technology & IT', keywords: ['search engine optimization', 'SEO agency'] },
      { id: 'digital-marketing', name: 'Digital Marketing', category: 'Technology & IT', keywords: ['online marketing', 'marketing agency'] },
      { id: 'app-development', name: 'App Development', category: 'Technology & IT', keywords: ['mobile apps', 'software development'] },
      { id: 'managed-services', name: 'Managed IT Services', category: 'Technology & IT', keywords: ['MSP', 'IT management', 'outsourced IT'] },
      { id: 'cybersecurity', name: 'Cybersecurity', category: 'Technology & IT', keywords: ['security', 'data protection', 'network security'] },
      { id: 'phone-repair', name: 'Phone Repair', category: 'Technology & IT', keywords: ['cell phone repair', 'iPhone repair', 'screen repair'] },
      { id: 'data-recovery', name: 'Data Recovery', category: 'Technology & IT', keywords: ['data recovery', 'hard drive', 'file recovery'] },
    ]
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    icon: '🛒',
    types: [
      { id: 'clothing-store', name: 'Clothing Store', category: 'Retail & E-commerce', keywords: ['fashion', 'apparel', 'boutique'] },
      { id: 'jewelry-store', name: 'Jewelry Store', category: 'Retail & E-commerce', keywords: ['jewelry', 'diamonds', 'rings'] },
      { id: 'furniture-store', name: 'Furniture Store', category: 'Retail & E-commerce', keywords: ['furniture', 'home goods', 'decor'] },
      { id: 'appliance-store', name: 'Appliance Store', category: 'Retail & E-commerce', keywords: ['appliances', 'electronics', 'home appliances'] },
      { id: 'sporting-goods', name: 'Sporting Goods', category: 'Retail & E-commerce', keywords: ['sports', 'outdoor', 'fitness'] },
      { id: 'hardware-store', name: 'Hardware Store', category: 'Retail & E-commerce', keywords: ['hardware', 'tools', 'home improvement'] },
      { id: 'gift-shop', name: 'Gift Shop', category: 'Retail & E-commerce', keywords: ['gifts', 'souvenirs', 'specialty'] },
      { id: 'ecommerce', name: 'E-commerce Store', category: 'Retail & E-commerce', keywords: ['online store', 'online shop', 'dropshipping'] },
      { id: 'thrift-store', name: 'Thrift Store', category: 'Retail & E-commerce', keywords: ['consignment', 'secondhand', 'resale'] },
      { id: 'liquor-store', name: 'Liquor Store', category: 'Retail & E-commerce', keywords: ['wine', 'beer', 'spirits', 'alcohol'] },
      { id: 'smoke-shop', name: 'Smoke Shop', category: 'Retail & E-commerce', keywords: ['vape', 'tobacco', 'cigars'] },
      { id: 'flooring-store', name: 'Flooring Store', category: 'Retail & E-commerce', keywords: ['flooring', 'tile', 'carpet store'] },
    ]
  },
  {
    id: 'saas-software',
    name: 'SaaS & Software',
    icon: '☁️',
    types: [
      { id: 'saas', name: 'SaaS Product', category: 'SaaS & Software', keywords: ['software', 'cloud', 'subscription'] },
      { id: 'b2b-software', name: 'B2B Software', category: 'SaaS & Software', keywords: ['enterprise', 'business software'] },
      { id: 'productivity', name: 'Productivity Tools', category: 'SaaS & Software', keywords: ['productivity', 'workflow', 'tools'] },
      { id: 'crm', name: 'CRM Software', category: 'SaaS & Software', keywords: ['customer relationship', 'sales software'] },
      { id: 'hr-software', name: 'HR Software', category: 'SaaS & Software', keywords: ['human resources', 'payroll', 'HR'] },
      { id: 'accounting-software', name: 'Accounting Software', category: 'SaaS & Software', keywords: ['bookkeeping', 'invoicing', 'finance'] },
      { id: 'project-management', name: 'Project Management', category: 'SaaS & Software', keywords: ['project tools', 'collaboration', 'tasks'] },
    ]
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    icon: '👔',
    types: [
      { id: 'consulting', name: 'Consulting', category: 'Professional Services', keywords: ['consultant', 'advisory', 'business consulting'] },
      { id: 'marketing-agency', name: 'Marketing Agency', category: 'Professional Services', keywords: ['advertising', 'branding', 'creative'] },
      { id: 'pr-agency', name: 'PR Agency', category: 'Professional Services', keywords: ['public relations', 'media', 'communications'] },
      { id: 'staffing', name: 'Staffing Agency', category: 'Professional Services', keywords: ['recruiting', 'temp agency', 'hiring'] },
      { id: 'translation', name: 'Translation Services', category: 'Professional Services', keywords: ['translator', 'interpreter', 'language'] },
      { id: 'printing', name: 'Printing Services', category: 'Professional Services', keywords: ['print shop', 'signs', 'banners'] },
      { id: 'courier', name: 'Courier Service', category: 'Professional Services', keywords: ['delivery', 'messenger', 'shipping'] },
      { id: 'answering-service', name: 'Answering Service', category: 'Professional Services', keywords: ['call center', 'virtual receptionist'] },
    ]
  },
  {
    id: 'travel-hospitality',
    name: 'Travel & Hospitality',
    icon: '✈️',
    types: [
      { id: 'hotel', name: 'Hotel', category: 'Travel & Hospitality', keywords: ['lodging', 'accommodation', 'stay'] },
      { id: 'vacation-rental', name: 'Vacation Rental', category: 'Travel & Hospitality', keywords: ['Airbnb', 'VRBO', 'rental property'] },
      { id: 'travel-agency', name: 'Travel Agency', category: 'Travel & Hospitality', keywords: ['travel agent', 'trips', 'vacation'] },
      { id: 'tour-operator', name: 'Tour Operator', category: 'Travel & Hospitality', keywords: ['tours', 'guided tours', 'excursions'] },
      { id: 'airport-shuttle', name: 'Airport Shuttle', category: 'Travel & Hospitality', keywords: ['airport transport', 'shuttle service'] },
      { id: 'rv-rental', name: 'RV Rental', category: 'Travel & Hospitality', keywords: ['motorhome', 'camper rental', 'RV'] },
      { id: 'boat-rental', name: 'Boat Rental', category: 'Travel & Hospitality', keywords: ['boat charter', 'yacht', 'watercraft'] },
    ]
  },
  {
    id: 'other',
    name: 'Other Services',
    icon: '📋',
    types: [
      { id: 'laundry', name: 'Laundry / Dry Cleaning', category: 'Other Services', keywords: ['laundromat', 'dry cleaner', 'cleaning'] },
      { id: 'tailor', name: 'Tailor / Alterations', category: 'Other Services', keywords: ['seamstress', 'clothing alterations', 'sewing'] },
      { id: 'locksmith', name: 'Locksmith', category: 'Other Services', keywords: ['locks', 'keys', 'security'] },
      { id: 'shoe-repair', name: 'Shoe Repair', category: 'Other Services', keywords: ['cobbler', 'shoe cobbler', 'shoes'] },
      { id: 'funeral-home', name: 'Funeral Home', category: 'Other Services', keywords: ['mortuary', 'funeral services', 'cremation'] },
      { id: 'pawn-shop', name: 'Pawn Shop', category: 'Other Services', keywords: ['pawn', 'loans', 'buy sell'] },
      { id: 'self-defense', name: 'Self-Defense Classes', category: 'Other Services', keywords: ['self defense', 'safety', 'protection'] },
      { id: 'escape-room', name: 'Escape Room', category: 'Other Services', keywords: ['escape game', 'puzzle room', 'entertainment'] },
      { id: 'bowling', name: 'Bowling Alley', category: 'Other Services', keywords: ['bowling', 'arcade', 'recreation'] },
      { id: 'golf', name: 'Golf Course', category: 'Other Services', keywords: ['golf', 'driving range', 'country club'] },
      { id: 'other', name: 'Other', category: 'Other Services', keywords: ['other', 'miscellaneous'] },
    ]
  },
];

// Flatten all business types for search
export const allBusinessTypes: BusinessType[] = businessCategories.flatMap(cat => cat.types);

// Search function for business types
export function searchBusinessTypes(query: string): BusinessType[] {
  if (!query.trim()) {
    return allBusinessTypes;
  }

  const lowerQuery = query.toLowerCase();
  
  return allBusinessTypes.filter(type => 
    type.name.toLowerCase().includes(lowerQuery) ||
    type.category.toLowerCase().includes(lowerQuery) ||
    type.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))
  );
}

// Get category by ID
export function getCategoryById(id: string): BusinessCategory | undefined {
  return businessCategories.find(cat => cat.id === id);
}

// Get business type by ID
export function getBusinessTypeById(id: string): BusinessType | undefined {
  return allBusinessTypes.find(type => type.id === id);
}
