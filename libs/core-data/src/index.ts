export { AuthGuardService } from './lib/auth/auth-guard.service';
export { AuthService } from './lib/auth/auth.service';
export { CoreDataModule } from './lib/core-data.module';
export { NotificationsService } from './lib/notifications/notifications.service';
export { CustomersService } from './lib/customers/customers.service';
export { Customer } from './lib/customers/customer.model';
export { Project } from './lib/projects/project.model';
export { ProjectsService } from './lib/projects/projects.service';
export { CustomersFacade } from './lib/state/customers/customers.facade';

// expose project state to other modules
export { ProjectsState } from './lib/state/projects/projects.reducer';
// this will make it available for our consumption inside of our projects feature
export { SelectProject, AddProject, UpdateProject, DeleteProject } from './lib/state/projects/projects.actions';
