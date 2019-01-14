import { Project } from './../../projects/project.model';
import { ProjectsActionTypes } from './projects.actions';

const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Project One',
    details: 'This is a sample project',
    percentComplete: 20,
    approved: false,
    customerId: null
  },
  {
    id: '2',
    title: 'Project Two',
    details: 'This is a sample project',
    percentComplete: 40,
    approved: false,
    customerId: null
  },
  {
    id: '3',
    title: 'Project Three',
    details: 'This is a sample project',
    percentComplete: 100,
    approved: true,
    customerId: null
  }
];

const createProject = (projects, project) => [...projects, project];
const updateProject = (projects, project) => projects.map(p => {
  return p.id === project.id ? Object.assign({}, project) : p;
});
const deleteProject = (projects, project) => projects.filter(w => project.id !== w.id);

// 01 define the shape of my state
export interface ProjectsState {
  projects: Project[];
  selectedProjectId: string | null;
}

// 02 define initial state (object that implement ProjectsState interface)
export const initialState: ProjectsState = {
  projects: initialProjects,
  selectedProjectId: null
}

// 03 build the most simplest reducer
// receive two parameters, the initial state of the app and the action object
// with a payload (usually saying this needs to happen or this is what happened)
export function projectsReducers(state = initialState, action): ProjectsState {
  switch(action.type) {
    case ProjectsActionTypes.ProjectSelected:
      return {
        selectedProjectId: action.payload,
        projects: state.projects
      }
    case ProjectsActionTypes.AddProject:
      // performing some logic delegating to a stand alone function (bc it is testable)
      return {
        selectedProjectId: state.selectedProjectId,
        projects: createProject(state.projects, action.payload)
      }
    case ProjectsActionTypes.UpdateProject:
      return {
        selectedProjectId: state.selectedProjectId,
        projects: updateProject(state.projects, action.payload)
      }
    case ProjectsActionTypes.DeleteProject:
      return {
        selectedProjectId: state.selectedProjectId,
        projects: deleteProject(state.projects, action.payload)
      }
    default:
      return state;
  }
}
