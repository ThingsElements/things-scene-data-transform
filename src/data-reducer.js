/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import COMPONENT_IMAGE from "./data-reducer.png";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: "string",
      label: "reducer",
      name: "reducer"
    }
  ],
  "value-property": "source"
};

import {
  Component,
  RectPath,
  Shape,
  ScriptLoader,
  error
} from "@hatiolab/things-scene";

const SELF = function(o) {
  return o;
};

function buildReducer(reducer) {
  if (!reducer) return SELF;

  var reducers = String(reducer)
    .trim()
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".")
    .filter(reducer => !!reducer.trim());

  return reducers.length > 0
    ? function(o) {
        return reducers.reduce((o, reducer) => (o ? o[reducer] : undefined), o);
      }
    : SELF;
}

export default class DataReducer extends RectPath(Shape) {
  static get nature() {
    return NATURE;
  }

  static get image() {
    if (!DataReducer._image) {
      DataReducer._image = new Image();
      DataReducer._image.src = COMPONENT_IMAGE;
    }

    return DataReducer._image;
  }

  get reducerFunc() {
    if (!this._reducerFunc) {
      this._reducerFunc = buildReducer(this.getState("reducer"));
    }

    return this._reducerFunc;
  }

  render(context) {
    var { left, top, width, height } = this.bounds;

    context.beginPath();
    context.drawImage(DataReducer.image, left, top, width, height);
  }

  onchange(after, before) {
    if (after.hasOwnProperty("reducer")) {
      delete this._reducerFunc;
      this.setState("data", this.reducerFunc(this.getState("source")));
    } else if (after.hasOwnProperty("source")) {
      this.setState("data", this.reducerFunc(this.getState("source")));
    }
  }

  get reducer() {
    return this.getState("reducer");
  }

  set reducer(reducer) {
    this.setState("reducer", reducer);
  }

  get source() {
    return this.getState("source");
  }

  set source(source) {
    this.setState("source", source);
  }

  get hasTextProperty() {
    return false;
  }

  get controls() {}
}

Component.register("data-reducer", DataReducer);
