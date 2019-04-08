/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import COMPONENT_IMAGE from "./data-queue.png";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: "string",
      label: "queue",
      name: "queue"
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

function buildQueue(queue) {
  if (!queue) return SELF;

  var queues = String(queue)
    .trim()
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".")
    .filter(queue => !!queue.trim());

  return queues.length > 0
    ? function(o) {
        return queues.reduce((o, queue) => (o ? o[queue] : undefined), o);
      }
    : SELF;
}

export default class DataQueue extends RectPath(Shape) {
  static get nature() {
    return NATURE;
  }

  static get image() {
    if (!DataQueue._image) {
      DataQueue._image = new Image();
      DataQueue._image.src = COMPONENT_IMAGE;
    }

    return DataQueue._image;
  }

  get queueFunc() {
    if (!this._queueFunc) {
      this._queueFunc = buildQueue(this.getState("queue"));
    }

    return this._queueFunc;
  }

  render(context) {
    var { left, top, width, height } = this.bounds;

    context.beginPath();
    context.drawImage(DataQueue.image, left, top, width, height);
  }

  onchange(after, before) {
    if (after.hasOwnProperty("queue")) {
      delete this._queueFunc;
      this.setState("data", this.queueFunc(this.getState("source")));
    } else if (after.hasOwnProperty("source")) {
      this.setState("data", this.queueFunc(this.getState("source")));
    }
  }

  get queue() {
    return this.getState("queue");
  }

  set queue(queue) {
    this.setState("queue", queue);
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

Component.register("data-queue", DataQueue);
