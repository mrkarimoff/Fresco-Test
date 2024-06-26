import { playSound } from '../../utils/playSound';
import { actionTypes as networkActionTypes } from '../modules/network';
import createNodeSound from '~/public/interviewer/interaction-sounds/create-node.mp3';
import removeNodeSound from '~/public/interviewer/interaction-sounds/discard.mp3';
import toggleOnSound from '~/public/interviewer/interaction-sounds/toggle-on.mp3';
import toggleOffSound from '~/public/interviewer/interaction-sounds/toggle-off.mp3';
import openAppSound from '~/public/interviewer/interaction-sounds/open-app.mp3';
import addEdgeSound from '~/public/interviewer/interaction-sounds/create-edge.mp3';
import errorSound from '~/public/interviewer/interaction-sounds/error.mp3';
import edgeLinkingSound from '~/public/interviewer/interaction-sounds/node-linking-mode.mp3';
import finishSessionSound from '~/public/interviewer/interaction-sounds/finish-interview.mp3';
import dropSound from '~/public/interviewer/interaction-sounds/drop-node.mp3';
import { getNetworkEdges } from '../../selectors/network';

const sounds = {
  open: playSound({ src: openAppSound }),
  createNode: playSound({ src: createNodeSound, debounceInterval: 200 }),
  createEdge: playSound({ src: addEdgeSound }),
  removeNode: playSound({ src: removeNodeSound }),
  toggleOn: playSound({ src: toggleOnSound }),
  toggleOff: playSound({ src: toggleOffSound }),
  error: playSound({ src: errorSound }),
  link: playSound({ src: edgeLinkingSound, loop: true }),
  drop: playSound({ src: dropSound }),
  finishSession: playSound({ src: finishSessionSound }),
};
/**
 * Redux middleware that plays sounds on certain actions
 * @param store
 * @returns
 */
const sound = (store) => (next) => (action) => {
  const result = next(action);
  const enableSounds = store.getState().deviceSettings.enableExperimentalSounds;

  if (!enableSounds) {
    return result;
  }

  switch (action.type) {
    // 'PLAY_SOUND' and 'STOP_SOUND' are generic actions so that components
    // can play sounds without having to import the sounds module or the
    // .wav files.
    case 'PLAY_SOUND':
      sounds[action.sound].play();
      break;
    case 'STOP_SOUND':
      sounds[action.sound].stop();
      break;
    case 'DEVICE_READY':
      sounds.open.play();
      break;
    case 'UPDATE_PROMPT': {
      sounds.link.stop(); // If we change prompt, stop the node linking sound.
      break;
    }
    case networkActionTypes.ADD_NODE: {
      sounds.createNode.play();
      break;
    }
    case networkActionTypes.UPDATE_NODE: {
      // Because UPDATE_NODE is quite generic, I added an additional 'sound'
      // property to the action to allow for sounds to be triggered where
      // necessary.
      if (action.sound) {
        sounds[action.sound].play();
      }

      break;
    }
    case networkActionTypes.REMOVE_NODE:
      sounds.removeNode.play();
      break;
    case networkActionTypes.REMOVE_NODE_FROM_PROMPT:
      sounds.toggleOff.play();
      break;
    case networkActionTypes.ADD_NODE_TO_PROMPT:
      sounds.toggleOn.play();
      break;
    case networkActionTypes.TOGGLE_EDGE: {
      const { from, to, type } = action.modelData;
      const sessionEdges = getNetworkEdges(store.getState());

      const edgeExists = sessionEdges.some((edge) => (
        edge.from === from && edge.to === to && edge.type === type
      ));

      if (edgeExists) {
        sounds.createEdge.play();
      } else {
        sounds.toggleOff.play();
      }
      break;
    }
    case networkActionTypes.TOGGLE_NODE_ATTRIBUTES: {
      const { attributes } = action;

      if (attributes) {
        // When toggling an attribute on, action.attributes[variableUID] = true
        // When toggling an attribute off, action.attributes[variableUID] = false
        const toggledOn = Object.values(attributes).includes(true);

        if (toggledOn) {
          playSound({ src: toggleOnSound }).play();
        } else {
          playSound({ src: toggleOffSound }).play();
        }
      }

      break;
    }
    case networkActionTypes.ADD_EDGE:
      sounds.createEdge.play();
      break;
    case networkActionTypes.REMOVE_EDGE:
      sounds.toggleOff.play();
      break;
    case '@@redux-form/SET_SUBMIT_FAILED': // Handles validation errors in forms
      sounds.error.play();
      break;
    default:
      break;
  }

  return result;
};

export default sound;
