/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import COMPONENT_IMAGE from "./data-filter.png";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: "string",
      label: "filter",
      name: "filter"
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

function buildFilter(filter) {
  if (!filter) return SELF;

  var filters = String(filter)
    .trim()
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".")
    .filter(filter => !!filter.trim());

  return filters.length > 0
    ? function(o) {
        return filters.reduce((o, filter) => (o ? o[filter] : undefined), o);
      }
    : SELF;
}

export default class DataFilter extends RectPath(Shape) {
  static get nature() {
    return NATURE;
  }

  static get image() {
    if (!DataFilter._image) {
      DataFilter._image = new Image();
      DataFilter._image.src = COMPONENT_IMAGE;
    }

    return DataFilter._image;
  }

  get filterFunc() {
    if (!this._filterFunc) {
      this._filterFunc = buildFilter(this.getState("filter"));
    }

    return this._filterFunc;
  }

  render(context) {
    var { left, top, width, height } = this.bounds;

    context.beginPath();
    context.drawImage(DataFilter.image, left, top, width, height);
  }

  onchange(after, before) {
    if (after.hasOwnProperty("filter")) {
      delete this._filterFunc;
      this.setState("data", this.filterFunc(this.getState("source")));
    } else if (after.hasOwnProperty("source")) {
      this.setState("data", this.filterFunc(this.getState("source")));
    }
  }

  get filter() {
    return this.getState("filter");
  }

  set filter(filter) {
    this.setState("filter", filter);
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

Component.register("data-filter", DataFilter);
