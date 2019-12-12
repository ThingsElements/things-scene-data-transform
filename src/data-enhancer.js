/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import COMPONENT_IMAGE from '../assets/symbol-data-enhancer.png'

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: 'string',
      label: 'index-name',
      name: 'indexName'
    },
    {
      type: 'string',
      label: 'accessor-target',
      name: 'accessorTarget'
    },
    {
      type: 'select',
      label: 'index-type',
      name: 'indexType',
      property: {
        options: [
          {
            display: 'Standard(0, 1, 2, ...)',
            value: 'standard'
          },
          {
            display: 'Repeating 0, 1',
            value: 'repeating'
          }
        ]
      }
    }
  ],
  'value-property': 'source'
}

import { Component, RectPath, Shape } from '@hatiolab/things-scene'

export default class DataEnhancer extends RectPath(Shape) {
  static get nature() {
    return NATURE
  }

  static get image() {
    if (!DataEnhancer._image) {
      DataEnhancer._image = new Image()
      DataEnhancer._image.src = COMPONENT_IMAGE
    }
    return DataEnhancer._image
  }

  render(context) {
    var { left, top, width, height } = this.bounds

    context.beginPath()
    context.drawImage(DataEnhancer.image, left, top, width, height)
  }

  onchange(after, before) {
    if ('source' in after) {
      this._buildEnhancer()
    }
  }

  _buildEnhancer() {
    let { source, indexType = 'standard', indexName, accessorTarget } = this.state

    if ((!accessorTarget && Array.isArray(source)) || (accessorTarget && accessorTarget in source)) {
      var sourceTarget = accessorTarget ? source[accessorTarget] : source
      switch (indexType) {
        case 'standard':
          for (var i = 0; i < sourceTarget.length; i++) {
            sourceTarget[i][indexName] = i
          }
          break
        case 'repeating':
          for (var i = 0; i < sourceTarget.length; i++) {
            if (i % 2 === 0) {
              sourceTarget[i][indexName] = 0
            } else {
              sourceTarget[i][indexName] = 1
            }
          }
          break
      }
      if (accessorTarget) {
        source[accessorTarget] = sourceTarget
        this.setState('data', { ...source })
      } else {
        this.setState('data', [...sourceTarget])
      }
    }
  }
  get source() {
    return this.getState('source')
  }

  set source(source) {
    this.setState('source', source)
  }

  get hasTextProperty() {
    return false
  }
}

Component.register('data-enhancer', DataEnhancer)
