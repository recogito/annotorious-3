import type OpenSeadragon from 'openseadragon';
import { API } from './API';
import type { APIOptions } from './APIOptions';

const init = (viewer: OpenSeadragon.Viewer, opts: APIOptions = {}) => new API(viewer, opts);

export default { init };
