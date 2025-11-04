export interface App {
  id: string;
  name: string;
  logo: string;
  category: 'email' | 'communication' | 'productivity' | 'storage' | 'development' | 'calendar';
  description?: string;
}

export const AVAILABLE_APPS: App[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    logo: '/logos/gmail-svgrepo-com.svg',
    category: 'email',
    description: 'Email service by Google'
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: '/logos/slack-svgrepo-com.svg',
    category: 'communication',
    description: 'Team communication platform'
  },
  {
    id: 'notion',
    name: 'Notion',
    logo: '/logos/notion-svgrepo-com.svg',
    category: 'productivity',
    description: 'All-in-one workspace'
  },
  {
    id: 'trello',
    name: 'Trello',
    logo: '/logos/trello-svgrepo-com.svg',
    category: 'productivity',
    description: 'Project management tool'
  },
  {
    id: 'github',
    name: 'GitHub',
    logo: '/logos/github-svgrepo-com.svg',
    category: 'development',
    description: 'Code hosting platform'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    logo: '/logos/google-drive-svgrepo-com.svg',
    category: 'storage',
    description: 'Cloud storage service'
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    logo: '/logos/g-calendar-svgrepo-com.svg',
    category: 'calendar',
    description: 'Calendar and scheduling'
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    logo: '/logos/sheets-sheet-svgrepo-com.svg',
    category: 'productivity',
    description: 'Spreadsheet application'
  }
];

export const getAppById = (id: string): App | undefined => {
  return AVAILABLE_APPS.find(app => app.id === id);
};

export const getAppsByCategory = (category: App['category']): App[] => {
  return AVAILABLE_APPS.filter(app => app.category === category);
};

export const getAppLogo = (appId: string): string => {
  const app = getAppById(appId);
  return app?.logo || '/logos/default.svg';
};
