import Actions, {ActionTypes} from '../actions';
import {copyMemo} from '../state';

// Global object is used to bypass redux state to improve performance
const dragKey = Symbol.for('__MUTESWAN_DRAGDATA__');

window[dragKey] = {};

const getDragData = () => window[dragKey];

// Get responsive margin before/after the drop target
const getDropMargin = () =>
  Number.parseInt(
    window
      .getComputedStyle(window.document.querySelector('.muteswan'), ':after')
      .getPropertyValue('height'),
    10
  );

/**
 * Immer drafter to handle Drag/Drop actions
 */
const dragDrafter = (draft, action) => {
  if (action.type === ActionTypes.DRAG) {
    const newDragData = {
      ...action.data,
      elements: [],
      memo: copyMemo(draft.memos[action.id])
    };
    window[dragKey] = {
      ...newDragData,
      dropMargin: getDropMargin()
    };
    draft.transient.isDrag = true;
    return;
  }

  if (action.type === ActionTypes.DROP) {
    draft.transient.isDrag = false;
    const dragData = window[dragKey];
    window[dragKey] = {};
    const dragMemo = copyMemo(dragData.memo);

    // Iterate over hover elements to find drop target
    for (const element of dragData.elements) {
      // Check if drop target is an item
      if (element.classList.contains('item')) {
        const targetMemo = draft.memos[element.id];
        if (targetMemo) {
          action.asyncDispatch(
            Actions.move({
              id: dragMemo.id,
              target: targetMemo.id,
              position: dragData.position,
              isPerma: targetMemo.isPerma
            })
          );
          break;
        }
      }

      // Check if drop target is a group
      if (element.classList.contains('group')) {
        const unix = Number.parseInt(element.dataset.unix, 10);
        action.asyncDispatch(
          Actions.move({
            unix,
            id: dragMemo.id,
            isPerma: element.id === 'permanent'
          })
        );
        break;
      }
    }
  }
};

export {dragKey, getDragData, dragDrafter};
