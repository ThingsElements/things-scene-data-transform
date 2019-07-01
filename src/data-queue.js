/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import COMPONENT_IMAGE from '../assets/symbol-data-queue.png'

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: 'number',
      label: 'max-size',
      name: 'maximumSize'
    },
    {
      type: 'number',
      label: 'min-size',
      name: 'minimumSize'
    }
  ],
  'value-property': 'source'
}

import { Component, RectPath, Shape, error } from '@hatiolab/things-scene'

const SELF = function(o) {
  return o
}

export default class DataQueue extends RectPath(Shape) {
  static get nature() {
    return NATURE
  }

  static get image() {
    if (!DataQueue._image) {
      DataQueue._image = new Image()
      DataQueue._image.src = COMPONENT_IMAGE
    }
    return DataQueue._image
  }

  render(context) {
    var { left, top, width, height } = this.bounds

    context.beginPath()
    context.drawImage(DataQueue.image, left, top, width, height)
  }

  onchange(after, before) {
    if ('source' in after) {
      this._buildQueue()
    }
  }

  _buildQueue() {
    let { source, maximumSize, minimumSize } = this.state
    if (!this.result_queue) {
      var result_queue = []
    } else {
      var result_queue = this.result_queue
    }
    if (!maximumSize) {
      result_queue.push({ queue_data: source })
    } else {
      if (result_queue.length >= maximumSize) {
        result_queue.shift()
        result_queue.push({ queue_data: source })
      } else {
        result_queue.push({ queue_data: source })
      }
    }
    if (!minimumSize) {
      this.setState('data', [...result_queue])
    } else {
      if (result_queue.length >= minimumSize) {
        this.setState('data', [...result_queue])
      }
    }
    this.setState('result_queue', result_queue)
  }

  get source() {
    return this.getState('source')
  }

  set source(source) {
    this.setState('source', source)
  }

  get result_queue() {
    return this.getState('result_queue')
  }

  set result_queue(result_queue) {
    this.setState('result_queue', result_queue)
  }

  get hasTextProperty() {
    return false
  }

  get controls() {}
}

Component.register('data-queue', DataQueue)
