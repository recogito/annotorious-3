import OpenSeadragon from 'openseadragon';
import { API, type APIOptions } from '../src/api';

const init = (viewer: OpenSeadragon.Viewer, opts: APIOptions = {}) => new API(viewer, opts);

export { API as Annotorious };
export { OpenSeadragon as OpenSeadragon };

export default { init };
