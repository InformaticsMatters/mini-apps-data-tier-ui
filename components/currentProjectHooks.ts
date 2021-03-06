import { useGetProjects } from '@squonk/data-manager-client/project';

import { useRouter } from 'next/router';

export type ProjectId = string | undefined;

/**
 * @returns The selected projectId from the project key of the query parameters
 */
export const useCurrentProjectId = () => {
  const { push, query, pathname } = useRouter();

  const projectId = query.project as ProjectId;

  // Update project key of query params whilst leaving others alone
  // This could be made generic if we add more state to query parameters
  const setCurrentProject = (newProjectId: ProjectId) => {
    if (newProjectId !== undefined) {
      push({
        pathname,
        query: { ...query, project: newProjectId },
      });
    } else {
      const newQuery = { ...query };
      delete newQuery.project;
      push({
        pathname: pathname,
        query: newQuery,
      });
    }
  };

  return [projectId, setCurrentProject] as const;
};

/**
 * @returns The project associated with the project-id in the current url query parameters
 */
export const useCurrentProject = () => {
  const [currentProjectId] = useCurrentProjectId();
  const { data } = useGetProjects();
  const projects = data?.projects;

  return projects?.find((project) => project.project_id === currentProjectId) ?? null;
};
