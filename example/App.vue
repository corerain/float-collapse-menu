<!--
 * @Descripttion: 
 * @version: 
 * @Author: Jianyong Wang
 * @Date: 2020-06-04 12:18:43
 * @LastEditors: Jianyong Wang
 * @LastEditTime: 2022-05-12 15:35:28
--> 
<template>
  <div id="app">
    <div class="test-demo-page">
      <div class="test-demo-page-content">
        <float-collapse-menu
          v-model="modelValue"
          :list="list"
          scroll-el=".test-demo-page"
          :props="props" />
      </div>
    </div>
  </div>
</template>

<script>
import FloatCollapseMenu from '@/FloatCollapseMenu'

export default{
  name: 'App',
  components: {
    FloatCollapseMenu
  },
  data() {
    return {
      list: [
        {
          "areaLevel": 0, 
          "cameraId": 7, 
          "children": [
            {
              "areaLevel": 1, 
              "cameraId": null, 
              "children": [
                {
                  "areaLevel": 2, 
                  "cameraId": null, 
                  "children": [
                    {
                      "areaLevel": 3, 
                      "cameraId": null, 
                      "children": [
                        {
                          "areaLevel": 4, 
                          "cameraId": null, 
                          "children": [], 
                          "defAreaConfig": {}, 
                          "flowHeat": 0, 
                          "id": 9, 
                          "name": "333", 
                          "pictureUrl": "", 
                          "pid": 8, 
                          "sortNumber": 0
                        }
                      ], 
                      "defAreaConfig": {}, 
                      "flowHeat": 0, 
                      "id": 8, 
                      "name": "2222", 
                      "pictureUrl": "", 
                      "pid": 7, 
                      "sortNumber": 0
                    }
                  ], 
                  "defAreaConfig": {}, 
                  "flowHeat": 0, 
                  "id": 7, 
                  "name": "111", 
                  "pictureUrl": "", 
                  "pid": 2, 
                  "sortNumber": 0
                }
              ], 
              "defAreaConfig": {}, 
              "flowHeat": 0, 
              "id": 2, 
              "name": "\u6d4e\u5357", 
              "pictureUrl": "", 
              "pid": 1, 
              "sortNumber": 0
            }
          ], 
          "defAreaConfig": {
            "h": 0.21776590223741024, 
            "w": 0.24181502416636447, 
            "x": 0.17547024435425684, 
            "y": 0.10596300884199733
          }, 
          "flowHeat": 0, 
          "id": 1, 
          "name": "\u5c71\u4e1c", 
          "pictureUrl": "/static/uploadFiles/backgroundImages/49fa82fc-d0c6-460c-9e58-9cb704771e1f.jpg", 
          "pid": 0, 
          "sortNumber": 4
        }, 
        {
          "areaLevel": 0, 
          "cameraId": 4, 
          "children": [], 
          "defAreaConfig": {
            "h": 0.3051103747608158, 
            "w": 0.3047619047619048, 
            "x": 0.18857142857142856, 
            "y": 0.12708731973678067
          }, 
          "flowHeat": 0, 
          "id": 4, 
          "name": "\u5317\u4eac", 
          "pictureUrl": "/static/uploadFiles/backgroundImages/0e8ca7f7-6153-46b5-9947-e33df0da4351.jpg", 
          "pid": 0, 
          "sortNumber": 2
        }, 
        {
          "areaLevel": 0, 
          "cameraId": null, 
          "children": [], 
          "defAreaConfig": {}, 
          "flowHeat": 0, 
          "id": 5, 
          "name": "\u6d4e\u5357", 
          "pictureUrl": "", 
          "pid": 0, 
          "sortNumber": 1
        }, 
        {
          "areaLevel": 0, 
          "cameraId": null, 
          "children": [], 
          "defAreaConfig": {}, 
          "flowHeat": 0, 
          "id": 6, 
          "name": "\u4e0a\u6d77", 
          "pictureUrl": "", 
          "pid": 0, 
          "sortNumber": 0
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
}
</script>

<style lang="scss">
  @import 'styles/common.scss';

  #app {
    width: 100%;
    height: 100%;

    .test-demo-page {
      width: 100%;
      height: 100%;
      background: black;
      overflow-y: auto;

      .test-demo-page-content {
        width: 100%;
        height: 1500px;
      }
    }
  }
</style>
