/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import COMPONENT_IMAGE from "./data-wrapper.png";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: "string",
      label: "property-name",
      name: "propertyName"
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

export default class DataWrapper extends RectPath(Shape) {
  static get nature() {
    return NATURE;
  }

  static get image() {
    if (!DataWrapper._image) {
      DataWrapper._image = new Image();
      DataWrapper._image.src = COMPONENT_IMAGE;
    }

    return DataWrapper._image;
  }

  render(context) {
    var { left, top, width, height } = this.bounds;

    context.beginPath();
    context.drawImage(DataWrapper.image, left, top, width, height);
  }

  onchange(after, before) {
    if ("source" in after) {
      this._buildWrapper();
    }
  }

  _buildWrapper() {
    let { source, propertyName } = this.state;
    var return_val = {};
    return_val[propertyName] = source;
    this.setState("data", return_val);
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

Component.register("data-wrapper", DataWrapper);
