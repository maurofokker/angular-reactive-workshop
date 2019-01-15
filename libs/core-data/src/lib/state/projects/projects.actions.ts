import { Action } from "@ngrx/store";
import { Project } from "../../projects/project.model";

// enum with action types in a single spot
export enum ProjectsActionTypes {
  ProjectSelected = '[Projects] Selected',
  LoadProjects = '[Projects] Load data',      // command
  ProjectsLoaded = '[Projects] Data loaded',  // then completion event
  AddProject = '[Projects] Add Data',
  ProjectAdded = '[Projects] Data added',
  UpdateProject = '[Projects] Update Data',
  ProjectUpdated = '[Projects] Data updated',
  DeleteProject = '[Projects] Delete Data',
  ProjectDeleted = '[Projects] Data deleted',
}

export class LoadProjects implements Action {
  readonly type = ProjectsActionTypes.LoadProjects;
  // no more payload bc it is a trigger
}

export class ProjectsLoaded implements Action {
  readonly type = ProjectsActionTypes.ProjectsLoaded;
  // need a payload bc we r sending in ... strongly type action object payload
  constructor(public payload: Project[]) { }
}

export class AddProject implements Action {
  readonly type = ProjectsActionTypes.AddProject;
  constructor(public payload: Project) { }
}

export class ProjectAdded implements Action {
  readonly type = ProjectsActionTypes.ProjectAdded;
  // need a payload bc we r sending in ... strongly type action object payload
  constructor(public payload: Project) { }
}

export class UpdateProject implements Action {
  readonly type = ProjectsActionTypes.UpdateProject;
  constructor(public payload: Project) { }
}

export class ProjectUpdated implements Action {
  readonly type = ProjectsActionTypes.ProjectUpdated;
  constructor(public payload: Project) {}
}

export class DeleteProject implements Action {
  readonly type = ProjectsActionTypes.DeleteProject;
  constructor(public payload: Project) { }
}

export class ProjectDeleted implements Action {
  readonly type = ProjectsActionTypes.ProjectDeleted;
  constructor(public payload: Project) {}
}

export class SelectProject implements Action {
  readonly type = ProjectsActionTypes.ProjectSelected;
  constructor(public payload: Project) {}
}

// export a type with union... can be this type or that type
export type ProjectsActions = SelectProject
  | AddProject
  | ProjectAdded
  | UpdateProject
  | ProjectUpdated
  | DeleteProject
  | ProjectDeleted
  | LoadProjects
  | ProjectsLoaded
  ;
