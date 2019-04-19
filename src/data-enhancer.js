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
      label: "index-name",
      name: "indexName"
    },
    {
      type: "string",
      label: "accessor-target",
      name: "accessorTarget"
    },
    {
      type: "select",
      label: "index-type",
      name: "indexType",
      property: {
        options: [
          {
            display: "기본",
            value: "standard"
          },
          {
            display: "0, 1 반복",
            value: "repeating"
          }
        ]
      }
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

  render(context) {
    var { left, top, width, height } = this.bounds;

    context.beginPath();
    context.drawImage(DataEnhancer.image, left, top, width, height);
  }

  onchange(after, before) {
    if ("source" in after) {
      this._buildEnhancer();
    }
  }

  _buildEnhancer() {
    let { source, indexType, indexName, accessorTarget } = this.state;
    if (!indexType) {
      indexType = "standard";
    }
    if (accessorTarget && accessorTarget in source) {
      var source_target = source[accessorTarget];
      switch (indexType) {
        case "standard":
          for (var i = 0; i < source_target.length; i++) {
            source_target[i][indexName] = i;
          }
          break;
        case "repeating":
          for (var i = 0; i < source_target.length; i++) {
            if (i % 2 === 0) {
              source_target[i][indexName] = 0;
            } else {
              source_target[i][indexName] = 1;
            }
          }
          break;
      }
      source[accessorTarget] = source_target;
      this.setState("data", { ...source });
    }
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
