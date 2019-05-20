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
  "value-property": "currentPage"
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

    if (Number(duration)) {
      this._interval = setInterval(() => {
        let { source, pageSize, currentPage = 1 } = this.state;

        let totalPage =
          Math.floor(source.length / pageSize) +
          (source.length % pageSize ? 1 : 0);

        if (++currentPage > totalPage) {
          currentPage = 1;
        }

        this.setState("currentPage", currentPage);

        this._buildData();
      }, duration * 1000);
    }
  }

  _buildData() {
    let { source, pageSize, currentPage = 1 } = this.state;

    if (!source || !source instanceof Array) {
      return;
    }

    let currentPageIndex = currentPage - 1;

    if (!pageSize) {
      currentPage = 1;
      this.setState("data", {
        totalPage: 1,
        totalRecords: source.length,
        currentPage,
        pageSize: 0,
        currentPageSize: data.length,
        startIndex: 1,
        endIndex: source.length,
        list: source
      });
    } else {
      let totalPage =
        Math.floor(source.length / pageSize) +
        (source.length % pageSize ? 1 : 0);

      let offset = currentPageIndex * pageSize;
      let data = source.slice(offset, Number(offset) + Number(pageSize));

      currentPage = currentPageIndex + 1;

      this.setState("data", {
        totalPage,
        totalRecords: source.length,
        currentPage,
        pageSize,
        currentPageSize: data.length,
        list: data,
        ...(currentPage > 0 && currentPage < totalPage + 1
          ? {
              startIndex: currentPageIndex * pageSize + 1,
              endIndex: Math.min(
                currentPageIndex * pageSize + data.length,
                source.length
              )
            }
          : {})
      });
    }
    this.setState("currentPage", currentPage);
  }

  onchange(after, before) {
    if ("source" in after) {
      this.setState("currentPage", 1);
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

  get currentPage() {
    return this.getState("currentPage");
  }

  set currentPage(page) {
    let { source = [], pageSize, currentPage = 1 } = this.state;

    let totalPage =
      Math.floor(source.length / pageSize) + (source.length % pageSize ? 1 : 0);

    switch (page) {
      case "first":
        page = 1;
        break;
      case "back":
        page = Math.max(currentPage - 1, 1);
        break;
      case "next":
        page = Math.min(currentPage + 1, totalPage);
        break;
      case "last":
        page = totalPage;
        break;
      default:
        break;
    }

    page = Number(page);
    if (isNaN(page)) {
      return;
    }

    this.setState("currentPage", page);

    this._buildData();
  }

  get hasTextProperty() {
    return false;
  }

  get controls() {}
}

Component.register("data-paginator", DataPaginator);
