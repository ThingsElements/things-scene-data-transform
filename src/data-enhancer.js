/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import COMPONENT_IMAGE from "./data-enhancer.png";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: "string",
      label: "enhancer",
      name: "enhancer"
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

function buildEnhancer(enhancer) {
  if (!enhancer) return SELF;

  var enhancers = String(enhancer)
    .trim()
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".")
    .filter(enhancer => !!enhancer.trim());

  return enhancers.length > 0
    ? function(o) {
        return enhancers.reduce(
          (o, enhancer) => (o ? o[enhancer] : undefined),
          o
        );
      }
    : SELF;
}

export default class DataEnhancer extends RectPath(Shape) {
  static get nature() {
    return NATURE;
  }

  static get image() {
    if (!DataEnhancer._image) {
      DataEnhancer._image = new Image();
      DataEnhancer._image.src = COMPONENT_IMAGE;
    }

    return DataEnhancer._image;
  }

  get enhancerFunc() {
    if (!this._enhancerFunc) {
      this._enhancerFunc = buildEnhancer(this.getState("enhancer"));
    }

    return this._enhancerFunc;
  }

  render(context) {
    var { left, top, width, height } = this.bounds;

    context.beginPath();
    context.drawImage(DataEnhancer.image, left, top, width, height);
  }

  onchange(after, before) {
    if (after.hasOwnProperty("enhancer")) {
      delete this._enhancerFunc;
      this.setState("data", this.enhancerFunc(this.getState("source")));
    } else if (after.hasOwnProperty("source")) {
      this.setState("data", this.enhancerFunc(this.getState("source")));
    }
  }

  get enhancer() {
    return this.getState("enhancer");
  }

  set enhancer(enhancer) {
    this.setState("enhancer", enhancer);
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

Component.register("data-enhancer", DataEnhancer);
