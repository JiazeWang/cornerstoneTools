import external from '../externalModules.js';
import BaseTool from './base/BaseTool.js';
import MouseCursor from '../util/MouseCursor.js';
import { getToolState, removeToolState } from '../stateManagement/toolState.js';
import { state } from '../store/index.js';

/**
 * @public
 * @class EraserTool
 * @memberof Tools
 *
 * @classdesc Tool for deleting the data of other Annotation Tools.
 * @extends Tools.Base.BaseTool
 */
export default class EraserTool extends BaseTool {
  constructor(configuration = {}) {
    const defaultConfig = {
      name: 'Eraser',
      supportedInteractionTypes: ['Mouse', 'Touch'],
    };
    const initialConfiguration = Object.assign(defaultConfig, configuration);

    super(initialConfiguration);

    this.initialConfiguration = initialConfiguration;

    this.configuration.svgCursor = this.configuration.svgCursor || eraserCursor;

    this.preMouseDownCallback = this._deleteAllNearbyTools.bind(this);
    this.preTouchStartCallback = this._deleteAllNearbyTools.bind(this);
  }

  _deleteAllNearbyTools(evt) {
    const coords = evt.detail.currentPoints.canvas;
    const element = evt.detail.element;

    state.tools.forEach(function(tool) {
      const toolState = getToolState(element, tool.name);

      if (toolState) {
        // Modifying in a foreach? Probably not ideal
        toolState.data.forEach(function(data) {
          if (
            typeof tool.pointNearTool === 'function' &&
            tool.pointNearTool(element, data, coords)
          ) {
            removeToolState(element, tool.name, data);
            external.cornerstone.updateImage(element);
          }
        });
      }
    });

    const consumeEvent = true;

    return consumeEvent;
  }
}

const eraserCursor = new MouseCursor(
  `<svg
    data-icon="eraser" role="img" xmlns="http://www.w3.org/2000/svg"
    width="32" height="28" viewBox="0 0 2048 1792"
  >
    <path transform="translate(0,1792) scale(1,-1)" fill="#ffffff" d="M960 1408l336-384h-768l-336 384h768zm1013-1077q15
      34 9.5 71.5t-30.5 65.5l-896 1024q-38 44-96 44h-768q-38
      0-69.5-20.5t-47.5-54.5q-15-34-9.5-71.5t30.5-65.5l896-1024q38-44 96-44h768q38
      0 69.5 20.5t47.5 54.5z"
    />
  </svg>`,
  'topLeft'
);
