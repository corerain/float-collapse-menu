<div align="center"> <a href="https://www.corerain.com/solution?audience=2955440&bd_vid=10427434001647562028"> <img alt="Corerain Logo" width="200" height="200" src="./images/Logo_Corerain.png"> </a> <br> <br>

[![license](https://img.shields.io/badge/license-Apache-green.svg)](LICENSE)

<h1>FloatCollapseMenu</h1>
</div>

**English** | [中文](./README.zh-CN.md)

## Introduction

FloatCollapseMenu is a vue2.x component that imitates the Chrome browser to automatically collapse the drop-down menu.

## Feature

- **vue**：vue2.x组件

## For Vue.js 2.x

Use component:

### Base use:
``` html
<float-collapse-menu
  v-model="modelValue"
  :list="list"
  scroll-el=".test-demo-page"
  :props="props" />
```
.vue file:
``` js
  import FloatCollapseMenu from 'FloatCollapseMenu'
  ...
  export default {
    components: {
      FloatCollapseMenu,
    },
    data() {
      return {
        list: [
          {
            "id": 1, 
            "name": "\u5c71\u4e1c"
          }, 
          {
            "id": 2, 
            "name": "\u5317\u4eac",
            children: [
              {
                "id": 3, 
                "name": "\u5317\u4eac",
              }
            ]
          }
        ],
        props: {
          label: 'name',
          value: 'id',
          children: 'children'
        },
        modelValue: 1
    }
  }
  ...
```

## Props

|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|list|raw data list|`Array`|`true`|[]|
|props|listItem Fields corresponding to each data|`Object`|`false`|{"label":"label","value":"value","children":"children"}|
|value|Two-way binding data value|`String` /  `Number`|`true`|-|
|maxWidth|Check box maximum length|`Number`|`false`|304|
|minWidth|Check box minimum length|`Number`|`false`|180|
|popoverItemWidth|Floating menu item width|`Number`|`false`|224|
|borderWidth|border width|`Number`|`false`|1.5|
|scrollEl|page scroll element|`String`|`false`|body|


## Events

|Event Name|Description|Parameters|
|---|---|---|
|change|Two-way binding - select node|The parameter is the current node id|
|select|selected node|The parameter is the current node node|

## License

Copyright (C) 2022 Corerain. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

