import {DOMParser} from 'xmldom';

const singleLineCommentRegex = /(%\/\/.*)$/gm;

export function svalToObject(sval: string, debug = false): any[] {
  const clean = cleanupComments(sval);

  const xml = svalToXml(clean);

  const nodes = [];

  for (let i = 0; i < xml.childNodes.length; i++) {
    const obj = svalXmlToObject(xml.childNodes.item(i) as Element, debug);
    if (obj) {
      nodes.push(obj);
    }
  }

  return nodes;
}

function cleanupComments(sval: string): string {
  return sval.replace(singleLineCommentRegex, '').trim();
}

function svalToXml(sval: string): Document {
  const document1 = new DOMParser({
    locator: {},
    errorHandler: function (level, msg) {
      throw msg;
    }
  }).parseFromString(sval, 'text/xml');
  return document1;
}

function svalXmlToObject(node: Element, debug = false, depth = 0): any {
  if (!node || !node.tagName) {
    return undefined;
  }

  if (debug) {
    if (node.hasAttribute && node.hasAttribute('name')) {
      console.log(' '.repeat(depth), node.getAttribute('name') + ':', node.tagName);
    } else {
      console.log(' '.repeat(depth), node.tagName);
    }
  }

  switch (node.tagName) {
    case 'loader':
    case 'null':
    case 'scene':
      return undefined;
    case 'string':
      return node.childNodes.item(0) ? node.childNodes.item(0).nodeValue : undefined;
    case 'int':
    case 'long':
      return node.childNodes.item(0) ? parseInt(node.childNodes.item(0).nodeValue, 10) : undefined;
    case 'float':
      return node.childNodes.item(0) ? parseFloat(node.childNodes.item(0).nodeValue) : undefined;
    case 'bool':
      return node.childNodes.item(0) ? node.childNodes.item(0).nodeValue.toLowerCase()[0] === 't' : undefined;
    case 'vec2':
    case 'vec3':
    case 'vec4':
      return node.childNodes.item(0) ? node.childNodes.item(0).nodeValue.split(' ').map(x => parseInt(x, 10)) : undefined;
    case 'array':
      const arr = [];

      for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes.item(i).constructor.name === 'Element') {
          const obj = svalXmlToObject(node.childNodes.item(i) as Element, debug, depth + 1);
          if (obj) {
            arr.push(obj);
          }
        }
      }

      return arr;
    case 'svals':
    case 'dict':
      const dict = {};

      for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes.item(i).constructor.name === 'Element') {
          const name = (node.childNodes.item(i) as Element).getAttribute('name');
          const obj = svalXmlToObject(node.childNodes.item(i) as Element, debug, depth + 1);
          if (obj) {
            dict[name] = obj;
          }
        }
      }

      return processDictionary(node, debug, depth);
    case 'unit':
      for (let i = 0; i < node.childNodes.length; i++) {
        if (node.childNodes.item(i).constructor.name === 'Element') {
          return {
            ...processDictionary(node.childNodes.item(i) as Element, debug, depth),
            class: (node.childNodes.item(i) as Element).getAttribute('class')
          };
        }
      }

      break;
  }

  throw new Error('Unknown data type: ' + node.tagName);
}

function processDictionary(node: Element, debug = false, depth = 0): any {
  const dict = {};

  for (let i = 0; i < node.childNodes.length; i++) {
    if (node.childNodes.item(i).constructor.name === 'Element') {
      const name = (node.childNodes.item(i) as Element).getAttribute('name');
      const obj = svalXmlToObject(node.childNodes.item(i) as Element, debug, depth);
      if (obj) {
        dict[name] = obj;
      }
    }
  }

  return dict;
}
