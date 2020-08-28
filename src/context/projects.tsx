import React, { useCallback, useEffect, useState } from 'react';

import { Project } from '../Services/apiTypes';
import DataTierAPI from '../Services/DataTierAPI';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  refreshProjects: () => void;
}

export const ProjectsContext = React.createContext<ProjectState>({
  projects: [],
  loading: true,
  refreshProjects: () => {},
});

export const ProjectsProvider: React.FC = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshProjects = useCallback(async () => {
    setLoading(true);
    const newProjects = await DataTierAPI.getAvailableProjects();
    setProjects(newProjects);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  return (
    <ProjectsContext.Provider value={{ projects, loading, refreshProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};