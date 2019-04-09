/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import COMPONENT_IMAGE from "./data-reducer.png";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [],
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

  render(context) {
    var { left, top, width, height } = this.bounds;

    context.beginPath();
    context.drawImage(DataReducer.image, left, top, width, height);
  }

  onchange(after, before) {
    if ("source" in after) {
      this._buildReducer();
    }
  }
  _buildReducer() {
    let { source } = this.state;
    console.log(source);
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
