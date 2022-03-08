import Dot from 'dot-object';

const dot = new Dot('.');
dot.keepArray = true;

export const objectToDotNotation = (obj: any) => dot.dot(obj);
