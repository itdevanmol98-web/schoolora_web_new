export interface TestimonialItem {
  id: string;
  role: string;
  schoolName: string;
  location: string;
  quote: string;
  rating: number;
  authorInitials: string;
  authorImage?: string;
}

export const testimonialsData: TestimonialItem[] = [
  {
    id: 't1',
    role: 'School Administrator',
    schoolName: 'ABC Public School',
    location: 'North Zone',
    quote:
      'Axionexa ERP has simplified our entire school operations. From admission inquiries to fee collection and transport GPS, everything is synchronized flawlessly.',
    rating: 5,
    authorInitials: 'SA',
  },
  {
    id: 't2',
    role: 'Principal',
    schoolName: 'DPS International School',
    location: 'Central Branch',
    quote:
      'Easy to use, powerful features and excellent support. The principal executive dashboard gives me complete daily clarity on academics, attendance, and campus finances.',
    rating: 5,
    authorInitials: 'PR',
  },
  {
    id: 't3',
    role: 'Academic Coordinator',
    schoolName: 'Green Valley School',
    location: 'West Campus',
    quote:
      'A complete solution for modern schools. Teachers save countless hours on manual attendance and report card preparation, allowing us to focus entirely on quality teaching.',
    rating: 5,
    authorInitials: 'AC',
  },
];
