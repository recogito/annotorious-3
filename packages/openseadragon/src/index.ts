import OpenSeadragon from 'openseadragon';
import { API, type APIOptions } from './api';

const init = (viewer: OpenSeadragon.Viewer, opts: APIOptions = {}) => new API(viewer, opts);

export { OpenSeadragon as OpenSeadragon };

export default { init };
