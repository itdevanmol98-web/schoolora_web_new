export interface ArticleItem {
  id: string;
  category: 'School Management' | 'AI in Education' | 'Digital Transformation';
  badgeColor: 'blue' | 'cyan' | 'orange';
  title: string;
  description: string;
  readTime: string;
  publishedDate: string;
  imageUrl: string;
}

export const knowledgeArticles: ArticleItem[] = [
  {
    id: 'art-1',
    category: 'School Management',
    badgeColor: 'blue',
    title: 'How to Choose the Right School ERP?',
    description:
      'A practical guide for school trustees and principals evaluating modern ERP software to eliminate administrative bottlenecks.',
    readTime: '5 min read',
    publishedDate: 'September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'art-2',
    category: 'AI in Education',
    badgeColor: 'cyan',
    title: 'The Role of AI in Modern Education',
    description:
      'Discover how predictive analytics and AI assistants are helping educators identify learning gaps and personalize curriculum delivery.',
    readTime: '4 min read',
    publishedDate: 'September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'art-3',
    category: 'Digital Transformation',
    badgeColor: 'orange',
    title: 'Going Paperless in Schools: A Step-by-Step Roadmap',
    description:
      'How forward-thinking schools transitioned 100% of their admissions, fees, and report cards to secure digital workflows.',
    readTime: '6 min read',
    publishedDate: 'August 2026',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
  },
];
