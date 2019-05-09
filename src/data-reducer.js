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
      label: "accessor-target",
      name: "accessorTarget"
    },
    {
      type: "string",
      label: "accessor-item",
      name: "accessorItem"
    },
    {
      type: "string",
      label: "reducing-propname",
      name: "reducingPropname"
    },
    {
      type: "select",
      label: "reducing-type",
      name: "reducingType",
      property: {
        options: [
          {
            display: "Sum(총합)",
            value: "reduce_sum"
          },
          {
            display: "Average(평균값)",
            value: "reduce_mean"
          },
          {
            display: "Standard Deviation(표준편차)",
            value: "reduce_sd"
          },
          {
            display: "Variance(분산)",
            value: "reduce_variance"
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
    let {
      source,
      accessorTarget,
      accessorItem,
      reducingPropname,
      reducingType
    } = this.state;
    if (!reducingType) {
      reducingType = "reduce_sum";
    }

    if (accessorTarget && accessorTarget in source) {
      var source_target = source[accessorTarget];
      var target_item = source_target.map(m => m[accessorItem]);
      if (accessorItem && reducingPropname) {
        switch (reducingType) {
          case "reduce_sum":
            var return_val = target_item.reduce(
              (partial_sum, a) => partial_sum + a
            );
            source[reducingPropname] = return_val;
            break;
          case "reduce_mean":
            var return_val =
              target_item.reduce((partial_sum, a) => partial_sum + a) /
              target_item.length;
            source[reducingPropname] = return_val;
            break;
          case "reduce_sd":
            var array_length = target_item.length;
            var mean =
              target_item.reduce((partial_sum, a) => partial_sum + a) /
              array_length;
            var return_val = Math.sqrt(
              target_item
                .map(x => Math.pow(x - mean, 2))
                .reduce((a, b) => a + b) / array_length
            );
            source[reducingPropname] = return_val;
            break;
          case "reduce_variance":
            var array_length = target_item.length;
            var mean =
              target_item.reduce((partial_sum, a) => partial_sum + a) /
              array_length;
            var return_val =
              target_item
                .map(num => Math.pow(num - mean, 2))
                .reduce((partial_sum, a) => partial_sum + a) / array_length;
            source[reducingPropname] = return_val;
            break;
        }
        this.setState("data", { ...source });
      }
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

Component.register("data-reducer", DataReducer);
