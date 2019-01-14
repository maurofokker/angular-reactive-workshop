import { Action } from "@ngrx/store";
import { Project } from "../../projects/project.model";

// enum with action types in a single spot
export enum ProjectsActionTypes {
  ProjectSelected = '[Projects] Selected',
  LoadProjects = '[Projects] Load data',
  AddProject = '[Projects] Add Data',
  UpdateProject = '[Projects] Update Data',
  DeleteProject = '[Projects] Delete Data',
}

export class LoadProjects implements Action {
  readonly type = ProjectsActionTypes.LoadProjects;
  // need a payload bc we r sending in ... strongly type action object payload
  constructor(private payload: Project[]) { }
}

export class AddProject implements Action {
  readonly type = ProjectsActionTypes.AddProject;
  // need a payload bc we r sending in ... strongly type action object payload
  constructor(private payload: Project) { }
}

export class UpdateProject implements Action {
  readonly type = ProjectsActionTypes.UpdateProject;
  constructor(private payload: Project) {}
}

export class DeleteProject implements Action {
  readonly type = ProjectsActionTypes.DeleteProject;
  constructor(private payload: Project) {}
}

export class SelectProject implements Action {
  readonly type = ProjectsActionTypes.ProjectSelected;
  constructor(private payload: Project) {}
}

// export a type with union... can be this type or that type
export type ProjectsActions = SelectProject
  | AddProject
  | UpdateProject
  | DeleteProject
  | LoadProjects
  ;
