export const START_REQUEST = 'START_REQUEST';
export const FINISH_REQUEST = 'FINISH_REQUEST';

export const startRequest = (request) => {
  return {
    type: START_REQUEST,
    request
  }
}

export const finishRequest = (request) => {
  return {
    type: FINISH_REQUEST,
    request
  }
}