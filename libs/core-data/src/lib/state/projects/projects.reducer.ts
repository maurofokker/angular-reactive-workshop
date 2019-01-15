import { Project } from './../../projects/project.model';
import { ProjectsActionTypes } from './projects.actions';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export const initialProjects: Project[] = [
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
// export interface ProjectsState {
//   projects: Project[];
//   selectedProjectId: string | null;
// }

// X00 redefine the shape of the state to use NgRx Entity
export interface ProjectsState extends EntityState<Project> {
  selectedProjectId: string | null;
}
// X02 Create entity adapter
export const adapter: EntityAdapter<Project> = createEntityAdapter<Project>();

// 02 define initial state (object that implement ProjectsState interface)
export const initialState: ProjectsState = adapter.getInitialState({
  selectedProjectId: null
});

// export const initialState: ProjectsState = {
//   projects: initialProjects,
//   selectedProjectId: null
// }

// 03 build the most simplest reducer
// receive two parameters, the initial state of the app and the action object
// with a payload (usually saying this needs to happen or this is what happened)
export function projectsReducers(state = initialState, action): ProjectsState {
  switch(action.type) {
    case ProjectsActionTypes.ProjectSelected:
      return Object.assign({}, state, { selectedProjectId: action.payload });
    case ProjectsActionTypes.ProjectsLoaded:
      return adapter.addMany(action.payload, state);
    case ProjectsActionTypes.ProjectAdded:
      // performing some logic delegating to a stand alone function (bc it is testable)
      return adapter.addOne(action.payload, state);
    case ProjectsActionTypes.UpdateProject:
      return adapter.updateOne(action.payload, state);
    case ProjectsActionTypes.DeleteProject:
      return adapter.removeOne(action.payload, state);
    default:
      return state;
  }
}

// low level selectors at the feature (projects) reducer
// Selectors
export const getSelectedProjectId = (state: ProjectsState) => state.selectedProjectId;

// can get selectors from Entities
const { selectIds, selectEntities, selectAll } = adapter.getSelectors();

export const selectProjectIds = selectIds;
export const selectProjectEntities = selectEntities;
export const selectAllProjects = selectAll;
