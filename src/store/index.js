// Modules
import brush from './modules/brushModule.js';
import globalConfiguration from './modules/globalConfigurationModule.js';

export const state = {
  isToolLocked: false,
  tools: [],
  clickProximity: 6,
  mousePositionImage: {},
  enabledElements: []
};

export const getters = {
  mouseTools: () =>
    state.tools.filter((tool) =>
      tool.supportedInteractionTypes.includes('mouse')
    ),
  touchTools: () =>
    state.tools.filter((tool) =>
      tool.supportedInteractionTypes.includes('touch')
    ),
  mousePositionImage: () => state.mousePositionImage,
  enabledElementByUID: (enabledElementUID) =>
    state.enabledElements.filter(
      (enabledElement) => enabledElement.uuid === enabledElementUID
    )
};

export const setters = {
  mousePositionImage: (mousePositionImage) => {
    state.mousePositionImage = mousePositionImage;
  }
};

export const mutations = {
  SET_IS_TOOL_LOCKED: (isLocked) => {
    state.isToolLocked = isLocked;
  },
  ADD_ENABLED_ELEMENT: (enabledElement) => {
    state.enabledElements.push(enabledElement);

    if (brush) {
      brush.setters.setElementVisible(enabledElement);
    }
  },
  REMOVE_ENABLED_ELEMENT: (enabledElement) => {
    const foundElementIndex = state.enabledElements.findIndex(
      (element) => element === enabledElement
    );

    if (foundElementIndex) {
      state.enabledElements.splice(foundElementIndex, 1);
    }
  }
};

export const modules = {
  brush,
  globalConfiguration
};

export default {
  modules,
  state,
  getters,
  mutations
};
