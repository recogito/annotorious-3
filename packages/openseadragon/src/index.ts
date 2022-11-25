import { API, type APIOptions } from './api';

export default { 
  
  init:  (viewer: OpenSeadragon.Viewer, opts: APIOptions = {}) => new API(viewer, opts)

};
