/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import COMPONENT_IMAGE from "./data-map.png";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: "string",
      label: "map",
      name: "map"
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

function buildMap(map) {
  if (!map) return SELF;

  var maps = String(map)
    .trim()
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".")
    .filter(map => !!map.trim());

  return maps.length > 0
    ? function(o) {
        return maps.reduce((o, map) => (o ? o[map] : undefined), o);
      }
    : SELF;
}

export default class DataMap extends RectPath(Shape) {
  static get nature() {
    return NATURE;
  }

  static get image() {
    if (!DataMap._image) {
      DataMap._image = new Image();
      DataMap._image.src = COMPONENT_IMAGE;
    }

    return DataMap._image;
  }

  get mapFunc() {
    if (!this._mapFunc) {
      this._mapFunc = buildMap(this.getState("map"));
    }

    return this._mapFunc;
  }

  render(context) {
    var { left, top, width, height } = this.bounds;

    context.beginPath();
    context.drawImage(DataMap.image, left, top, width, height);
  }

  onchange(after, before) {
    if (after.hasOwnProperty("map")) {
      delete this._mapFunc;
      this.setState("data", this.mapFunc(this.getState("source")));
    } else if (after.hasOwnProperty("source")) {
      this.setState("data", this.mapFunc(this.getState("source")));
    }
  }

  get map() {
    return this.getState("map");
  }

  set map(map) {
    this.setState("map", map);
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

Component.register("data-map", DataMap);
