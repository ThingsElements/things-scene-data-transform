/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import COMPONENT_IMAGE from "./data-paginator.png";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: "number",
      label: "page-size",
      name: "pageSize"
    },
    {
      type: "number",
      label: "duration",
      name: "duration",
      placeHolder: "Seconds"
    }
  ],
  "value-property": "source"
};

import { Component, RectPath, Shape, error } from "@hatiolab/things-scene";

const SELF = function(o) {
  return o;
};

export default class DataPaginator extends RectPath(Shape) {
  static get nature() {
    return NATURE;
  }

  static get image() {
    if (!DataPaginator._image) {
      DataPaginator._image = new Image();
      DataPaginator._image.src = COMPONENT_IMAGE;
    }

    return DataPaginator._image;
  }

  ready() {
    super.ready();

    this._buildInterval();
  }

  render(context) {
    var { left, top, width, height } = this.bounds;

    context.beginPath();
    context.drawImage(DataPaginator.image, left, top, width, height);
  }

  _buildInterval() {
    if (!this.app.isViewMode) {
      return;
    }

    var { duration = 0 } = this.state;

    this._buildData();

    if (!duration) {
      return;
    }

    this._interval = setInterval(() => {
      this._buildData();
    }, duration * 1000);
  }

  _buildData() {
    let { source, pageSize, currentPage = 0 } = this.state;

    if (!source || !source instanceof Array) {
      return;
    }

    if (!pageSize) {
      currentPage = 0;
      this.setState("data", {
        totalPage: 1,
        currentPage,
        pageSize: 0,
        list: source
      });
    } else {
      let totalPage =
        source.length / pageSize + (source.length % pageSize ? 1 : 0);
      currentPage %= totalPage;
      let offset = currentPage * pageSize;
      this.setState("data", {
        totalPage,
        currentPage,
        pageSize,
        list: source.slice(offset, Number(offset) + Number(pageSize))
      });
    }

    this.setState("currentPage", ++currentPage);
  }

  onchange(after, before) {
    if ("source" in after) {
      this.setState("currentPage", 0);
      this._buildData();
    }

    if ("duration" in after) {
      this._buildInterval();
    }
  }
  dispose() {
    super.dispose();
    clearInterval(this._interval);
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

Component.register("data-paginator", DataPaginator);
