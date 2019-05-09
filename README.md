# things-scene-data-transform

## things-scene-data-transform에는 보드에서 표현되기 용이한 형태로 데이터를 가공해주는 컴포넌트들이 있다.

## data-accessor

**properties: accessor**

데이터의 입력받은 accessor를 key로 갖고 있거나, Array의 경우 해당 index 값의 데이터를 리턴해주는 컴포넌트이다.

## data-enhancer

**properties: accessor-target, index-name, index-type**

Object내 accessor-target에 해당되는 Array에 입력 받은 index-name값으로 index 역할을 해주는 property를 추가하여 주는 컴포넌트이다.

## data-paginator

**properties: page-size, duration**

한 페이지에 표시될 갯수를 page-size으로 설정하여 해당 갯수만큼, duration에 입력된 초의 시간 동안 데이터를 표시해주는 컴포넌트이다.

## data-queue

**properties: max-size, min-size**

입력받은 데이터를 Queue에 추가하고, Queue의 길이가 max-size 를 초과할 경우, 먼저 들어온 데이터부터 순차적으로 삭제해주는 기능을 제공하는 컴포넌트이다. Queue의 길이가 min-size사이즈 이상일 때만 표시하여 준다.

## data-reducer

**properties: accessor-target, accessor-item, reducing-propname, reducing-type**

입력한 accessor-target에 해당되는 Array 형식의 데이터 중 accessor-item로 입력된 데이터들의 값을 처리해주는 기능이다. 총합, 평균값, 표준편차, 분산 값 등 원하는 reducing-type을 선택하면, 입력한 reducing-propname을 key 값으로 처리된 값을 제공하는 컴포넌트이다.

## data-wrapper

**properties: property-name**

Array 형식의 데이터를 property-name 필드의 입력받은 값을 key값으로한 Object로 바꿔주는 컴포넌트이다.

## node package를 설치한다.

`$ yarn`

## 실행

`$ yarn serve`
`$ yarn serve:dev`

## 포트를 바꾸려면, -p 3001 식으로 추가해준다.

`$ yarn serve`
`$ yarn serve -p 3001`

## test in browser

http://localhost:3000

## build

`$ yarn build`

| type | filename                          | for            | tested |
| ---- | --------------------------------- | -------------- | ------ |
| UMD  | things-scene-data-transform.js    | modern browser | O      |
| UMD  | things-scene-data-transform-ie.js | ie 11          | O      |
| ESM  | things-scene-data-transform.mjs   | modern browser | O      |

## publish

`$ yarn publish`
