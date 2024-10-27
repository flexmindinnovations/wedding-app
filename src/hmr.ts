import { NgModuleRef, ApplicationRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';


interface HotModule {
  accept: (callback?: () => void) => void;
  dispose: (callback: () => void) => void;
}

// Extending NodeModule to include the `hot` property
interface HRMLNodeModule {
  hot?: HotModule;
}

// Define the type for the hmrBootstrap function
type HmrBootstrapFunction = (
  module: HRMLNodeModule,
  bootstrap: () => Promise<NgModuleRef<any>>
) => void;

export const hmrBootstrap: HmrBootstrapFunction = (
  module: HRMLNodeModule,
  bootstrap: () => Promise<NgModuleRef<any>>
) => {
  let ngModule: NgModuleRef<any>;

  if (module.hot) {
    module.hot.accept();
  }

  bootstrap().then(mod => (ngModule = mod));

  if (module.hot) {
    module.hot.dispose(() => {
      const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
      const elements = appRef.components.map(c => c.location.nativeElement);
      const removeOldHosts = createNewHosts(elements);
      ngModule.destroy();
      removeOldHosts();
    });
  }
};
