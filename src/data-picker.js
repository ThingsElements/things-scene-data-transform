/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
// 이부분이 accessor부분
import COMPONENT_IMAGE from "./data-picker.png";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: "string",
      label: "accessor",
      name: "accessor"
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

function buildAccessor(accessor) {
  if (!accessor) return SELF;

  var accessors = String(accessor)
    .trim()
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".")
    .filter(accessor => !!accessor.trim());

  return accessors.length > 0
    ? function(o) {
        return accessors.reduce(
          (o, accessor) => (o ? o[accessor] : undefined),
          o
        );
      }
    : SELF;
}

export default class DataPicker extends RectPath(Shape) {
  static get nature() {
    return NATURE;
  }

  static get image() {
    if (!DataPicker._image) {
      DataPicker._image = new Image();
      DataPicker._image.src = COMPONENT_IMAGE;
    }

    return DataPicker._image;
  }

  get accessorFunc() {
    if (!this._accessorFunc) {
      this._accessorFunc = buildAccessor(this.getState("accessor"));
    }

    return this._accessorFunc;
  }

  render(context) {
    var { left, top, width, height } = this.bounds;

    context.beginPath();
    context.drawImage(DataPicker.image, left, top, width, height);
  }

  onchange(after, before) {
    if (after.hasOwnProperty("accessor")) {
      delete this._accessorFunc;
      this.setState("data", this.accessorFunc(this.getState("source")));
    } else if (after.hasOwnProperty("source")) {
      this.setState("data", this.accessorFunc(this.getState("source")));
    }
  }

  get accessor() {
    return this.getState("accessor");
  }

  set accessor(accessor) {
    this.setState("accessor", accessor);
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

Component.register("data-picker", DataPicker);
