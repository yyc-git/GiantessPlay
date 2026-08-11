import * as THREE from "three";
/*************************************************************************************
 * CLASS NAME:  CustomizeTree
 * DESCRIPTION: 整合各种treeObj
 * NOTE:
 *
 *************************************************************************************/
class CustomizeTree {
  public indices
  public content

  constructor() {
    this.indices = new Map([
      ["普通乔木", 0],
      ["桂花", 1],
      ["国槐", 2],
      ["木芙蓉", 3],
      ["八棱海棠", 4],
      ["红枫", 5],
      ["桃树", 6],
      ["垂丝海棠", 7],
      ["丁香", 8],
      ["凤凰木", 9],
      ["水杉", 10],
      ["落叶松", 11],
      // ["海棠", 10],
      // ["红果冬青", 11],
    ]);
    this.content = [
      {
        name: "普通乔木",
        path: "meta3d-jiehuo-abstract/images/ordinarytree/",
        depth: 2,
        disturb: 0.08,
        gravity: 0,
        shrink: { single: 0.4, multi: 0.4, root: true },
        tubular_segments: 5,
        radial_segments: 4,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "cross", width: 0.7, height: 1 },
          scale: 3,
          alpha_test: 0.25,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 18, 0),
            radius: 0.6,
            sub_branches: [
              // [ sub_branches_position, noise1, sub_branches_angle, noise2, next_level_length, noise3, number ]
              [0.4, 0.1, Math.PI / 2.5, Math.PI / 36, 7, 0.5, 3],
              // [0.6, 0.05, Math.PI / 3, 0, 6, 0.5, 3],
              // [0.8, 0.05, Math.PI / 3, 0, 5, 0.5, 3],
              // [0.95, 0, 0, 0, 4, 0.5, 1],
            ],
          },
          // middle node
          {
            sub_branches: [
              [0.6, 0.2, Math.PI / 4, Math.PI / 36, 4, 0.5, 5],
              [0.9, 0, 0, 0, 3, 0.5, 1],
            ],
          },
          // leaf node
          {
            leaves: [
              // [ leaves_position, noise1, leaves_angle, noise2, number]
              [0.6, 0.35, Math.PI / 4, 0, 3],
              [0.95, 0, 0, 0, 1],
            ],
          },
        ],
      },
      {
        name: "桂花",
        path: "meta3d-jiehuo-abstract/images/guihua/",
        depth: 4,
        disturb: 0.02,
        gravity: 0,
        shrink: { single: 0.4, multi: 0.5, root: true },
        tubular_segments: 5,
        radial_segments: 4,
        sample_offset: 0.01,
        leaf: {
          geometry: { style: "cross", width: 1, height: 1 },
          scale: 0.8,
          alpha_test: 0.2,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 8, 0),
            radius: 0.3,
            sub_branches: [[0.6, 0.3, Math.PI / 5, Math.PI / 36, 4, 0.5, 5]],
          },
          // middle node
          {
            sub_branches: [[0.5, 0.4, Math.PI / 6, 0, 3, 0.5, 5]],
          },
          {
            sub_branches: [[0.5, 0.4, Math.PI / 6, 0, 2, 0.5, 2]],
          },
          {
            sub_branches: [[0.5, 0.4, Math.PI / 6, 0, 1, 0.5, 3]],
          },
          // leaf node
          {
            leaves: [[0.8, 0.2, Math.PI / 6, 0, 5]],
          },
        ],
      },
      {
        name: "国槐",
        path: "meta3d-jiehuo-abstract/images/guohuai/",
        depth: 5,
        disturb: 0.03,
        gravity: 0.07,
        shrink: { single: 0.4, multi: 0.45, root: true },
        tubular_segments: 5,
        radial_segments: 4,
        sample_offset: 0.01,
        leaf: {
          geometry: { style: "cross", width: 0.5, height: 1, foldDegree: 0.3 },
          scale: 0.6,
          alpha_test: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 15, 0),
            radius: 0.7,
            sub_branches: [
              [0.5, 0.1, Math.PI / 3, Math.PI / 36, 7, 0.5, 5],
              [0.8, 0.1, Math.PI / 4, Math.PI / 36, 6, 0.5, 3],
              [0.95, 0, 0, 0, 5, 0.5, 1],
            ],
          },
          // middle node
          {
            sub_branches: [
              [0.6, 0.2, Math.PI / 5, Math.PI / 36, 3, 0.5, 3],
              [0.95, 0, 0, 0, 3, 0.5, 1],
            ],
          },
          {
            sub_branches: [[0.6, 0.2, Math.PI / 5, Math.PI / 36, 2, 0.5, 3]],
          },
          {
            sub_branches: [[0.6, 0.3, Math.PI / 5, Math.PI / 36, 1, 0.5, 3]],
          },
          {
            sub_branches: [
              [0.5, 0.4, Math.PI / 5, Math.PI / 36, 2, 0, 3],
              [0.95, 0, 0, 0, 2, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.6, 0.4, Math.PI / 5, 0, 6]],
          },
        ],
      },
      {
        name: "木芙蓉",
        path: "meta3d-jiehuo-abstract/images/mufurong/",
        depth: 4,
        disturb: 0.03,
        gravity: 0.1,
        shrink: { single: 0.2, multi: 0.45, root: false },
        tubular_segments: 5,
        radial_segments: 4,
        sample_offset: 0,
        leaf: {
          geometry: { style: "surround", width: 1, height: 1 },
          scale: 0.15,
          alpha_test: 0.5,
        },
        flower: {
          scale: 0.08,
          alpha_test: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, -0.1, 0),
            end: new THREE.Vector3(0, 0, 0),
            radius: 0.3,
            sub_branches: [[0.7, 0.1, Math.PI / 11, Math.PI / 36, 3, 0.5, 4]],
          },
          // middle node
          {
            sub_branches: [[0.7, 0.2, Math.PI / 6, Math.PI / 36, 2, 0.5, 3]],
          },
          {
            sub_branches: [[0.7, 0.2, Math.PI / 6, Math.PI / 36, 1, 0.5, 3]],
          },
          {
            sub_branches: [[0.7, 0.2, Math.PI / 6, Math.PI / 36, 0.8, 0.2, 3]],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 3]],
          },
        ],
      },
      {
        name: "八棱海棠",
        path: "meta3d-jiehuo-abstract/images/8leng/",
        depth: 3,
        disturb: 0.05,
        gravity: -0.1,
        shrink: { single: 0.2, multi: 0.3, root: false },
        tubular_segments: 5,
        radial_segments: 4,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "folded", width: 0.5, height: 1 },
          scale: 0.2,
          alpha_test: 0.2,
        },
        flower: {
          scale: 0.08,
          alpha_test: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 7, 0),
            radius: 0.25,
            sub_branches: [
              [0.3, 0.1, Math.PI / 3, 0, 4.5, 0, 6],
              [0.4, 0.1, Math.PI / 4, 0, 4, 0, 4],
              [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
              [0.85, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          // middle node
          {
            sub_branches: [
              [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
              [0.9, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          {
            sub_branches: [
              [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
              [0.9, 0, 0, 0, 0.7, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 15]],
            flowers: [[0.9, 0, 0, 0, 1]],
          },
        ],
      },
      {
        name: "红枫",
        path: "meta3d-jiehuo-abstract/images/hongfeng/",
        depth: 3,
        disturb: 0.02,
        gravity: -0.2,
        shrink: { single: 0.2, multi: 0.35, root: true },
        tubular_segments: 5,
        radial_segments: 4,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "folded", width: 1, height: 1 },
          scale: 0.4,
          alpha_test: 0.2,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 9, 0),
            radius: 0.25,
            sub_branches: [
              [0.3, 0.1, Math.PI / 3, 0, 4.5, 0, 6],
              [0.4, 0.1, Math.PI / 4, 0, 4, 0, 4],
              [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
              [0.8, 0, 0, 0, 1, 0, 1],
            ],
          },
          // middle node
          {
            sub_branches: [
              [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
              [0.9, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          {
            sub_branches: [
              [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
              [0.9, 0, 0, 0, 0.7, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 10]],
          },
        ],
      },
      {
        name: "桃树",
        path: "meta3d-jiehuo-abstract/images/peach/",
        depth: 3,
        disturb: 0.02,
        gravity: -0.2,
        shrink: { single: 0.2, multi: 0.3, root: false },
        tubular_segments: 5,
        radial_segments: 4,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "folded", width: 0.5, height: 1 },
          scale: 0.2,
          alpha_test: 0.2,
        },
        flower: {
          scale: 0.08,
          alpha_test: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 7, 0),
            radius: 0.25,
            sub_branches: [
              [0.3, 0.1, Math.PI / 3, 0, 4.5, 0, 6],
              [0.4, 0.1, Math.PI / 4, 0, 4, 0, 4],
              [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
              [0.85, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          // middle node
          {
            sub_branches: [
              [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
              [0.9, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          {
            sub_branches: [
              [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
              [0.9, 0, 0, 0, 0.7, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 15]],
            flowers: [[0.9, 0, 0, 0, 1]],
          },
        ],
      },
      {
        name: "垂丝海棠",
        path: "meta3d-jiehuo-abstract/images/chuisi/",
        depth: 3,
        disturb: 0.05,
        gravity: -0.3,
        shrink: { single: 0.2, multi: 0.3, root: false },
        tubular_segments: 5,
        radial_segments: 4,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "folded", width: 0.5, height: 1 },
          scale: 0.2,
          alpha_test: 0.2,
        },
        flower: {
          scale: 0.08,
          alpha_test: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 8, 0),
            radius: 0.25,
            sub_branches: [
              [0.3, 0, Math.PI / 3, 0, 4.5, 0, 6],
              [0.4, 0.1, Math.PI / 4, 0, 4, 0, 4],
              [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
              [0.85, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          // middle node
          {
            sub_branches: [
              [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
              [0.9, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          {
            sub_branches: [
              [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
              [0.9, 0, 0, 0, 0.7, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 15]],
            flowers: [[0.9, 0, 0, 0, 1]],
          },
        ],
      },
      {
        name: "丁香",
        path: "meta3d-jiehuo-abstract/images/dingxiang/",
        depth: 4,
        disturb: 0.03,
        gravity: 0.1,
        shrink: { single: 0.2, multi: 0.45, root: false },
        tubular_segments: 5,
        radial_segments: 4,
        sample_offset: 0.007,
        leaf: {
          geometry: { style: "folded", width: 0.5, height: 1 },
          scale: 0.2,
          alpha_test: 0.2,
        },
        flower: {
          scale: 0.07,
          alpha_test: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, -0.1, 0),
            end: new THREE.Vector3(0, 0, 0),
            radius: 0.3,
            sub_branches: [[0.7, 0.1, Math.PI / 11, Math.PI / 36, 5, 0.5, 3]],
          },
          // middle node
          {
            sub_branches: [
              [0.4, 0.2, Math.PI / 5, Math.PI / 36, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, Math.PI / 36, 2, 0.5, 3],
            ],
          },
          {
            sub_branches: [[0.7, 0.2, Math.PI / 6, Math.PI / 36, 1, 0.5, 3]],
          },
          {
            sub_branches: [[0.7, 0.2, Math.PI / 6, Math.PI / 36, 0.8, 0.2, 5]],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 10]],
            flowers: [[0.9, 0.1, Math.PI / 3, 0, 5]],
          },
        ],
      },
      {
        name: "凤凰木",
        path: "meta3d-jiehuo-abstract/images/fenghuangmu/",
        depth: 3,
        disturb: 0.05,
        gravity: -0.1,
        shrink: { single: 0.2, multi: 0.35, root: true },
        tubular_segments: 5,
        radial_segments: 4,
        sample_offset: 0.005,
        leaf: {
          geometry: { style: "folded_reverse", width: 1, height: 1 },
          scale: 0.3,
          alpha_test: 0.2,
        },
        flower: {
          scale: 0.15,
          alpha_test: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 9, 0),
            radius: 0.25,
            sub_branches: [
              [0.3, 0.1, Math.PI / 3, 0, 4.5, 0, 6],
              [0.4, 0.1, Math.PI / 4, 0, 4, 0, 4],
              [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
              [0.8, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          // middle node
          {
            sub_branches: [
              [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
              [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
              [0.9, 0, 0, 0, 1, 0.5, 1],
            ],
          },
          {
            sub_branches: [
              [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
              [0.9, 0, 0, 0, 0.7, 0, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.7, 0.3, Math.PI / 3, 0, 5]],
            flowers: [[0.8, 0.2, Math.PI / 3, 0, 3]],
          },
        ],
      },
      {
        name: "水杉",
        path: "meta3d-jiehuo-abstract/images/shuishan/",
        depth: 2,
        disturb: 0.1,
        gravity: 0.2,
        shrink: { single: 0.15, multi: 0.2, root: true },
        tubular_segments: 10,
        radial_segments: 6,
        sample_offset: 0.002,
        leaf: {
          geometry: {
            style: "folded",
            width: 1,
            height: 2,
            width_foldDegree: 0.3,
            height_foldDegree: 0.5,
          },
          scale: 0.5,
          alpha_test: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 30, 0),
            radius: 0.6,
            sub_branches: [
              [0.4, 0.2, Math.PI / 3, Math.PI / 36, 5, 0.5, 30],
              [0.75, 0.2, Math.PI / 4, Math.PI / 36, 3, 0.5, 30],
              [0.95, 0, 0, 0, 3, 0.5, 1],
            ],
          },
          // middle node
          {
            sub_branches: [
              [0.5, 0.1, Math.PI / 5, 0, 3, 0.5, 5],
              [0.95, 0, 0, 0, 2, 0.5, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.65, 0.3, Math.PI / 5, 0, 10]],
          },
        ],
      },
      {
        name: "落叶松",
        path: "meta3d-jiehuo-abstract/images/luoyesong/",
        depth: 2,
        disturb: 0.1,
        gravity: -0.1,
        shrink: { single: 0.15, multi: 0.2, root: true },
        tubular_segments: 10,
        radial_segments: 6,
        sample_offset: 0.002,
        leaf: {
          geometry: {
            style: "cross",
            width: 1,
            height: 2,
          },
          scale: 0.5,
          alpha_test: 0.5,
        },
        branches: [
          // root node
          {
            start: new THREE.Vector3(0, 0, 0),
            end: new THREE.Vector3(0, 30, 0),
            radius: 0.6,
            sub_branches: [
              [0.4, 0.2, Math.PI / 2.5, Math.PI / 36, 5, 0.5, 20],
              [0.75, 0.2, Math.PI / 2.5, Math.PI / 36, 3, 0.5, 20],
              [0.95, 0, 0, 0, 3, 0.5, 1],
            ],
          },
          // middle node
          {
            sub_branches: [
              [0.5, 0.1, Math.PI / 4, 0, 3, 0.5, 5],
              [0.95, 0, 0, 0, 2, 0.5, 1],
            ],
          },
          // leaf node
          {
            leaves: [[0.65, 0.3, Math.PI / 4, 0, 10]],
          },
        ],
      },
      // {
      //   name: "海棠",
      //   path: "meta3d-jiehuo-abstract/images/haitang/",
      //   depth: 3,
      //   disturb: 0.03,
      //   gravity: 3,
      //   shrink: { single: 0.2, multi: 0.35, root: true },
      //   tubular_segments: 10,
      //   radial_segments: 4,
      //   sample_offset: 0.005,
      //   leaf: {
      //     geometry: { style: "folded", width: 0.5, height: 1 },
      //     scale: 0.3,
      //     alpha_test: 0.5,
      //   },
      //   flower: {
      //     scale: 0.1,
      //     alpha_test: 0.5,
      //   },
      //   branches: [
      //     // root node
      //     {
      //       start: new THREE.Vector3(0, 0, 0),
      //       end: new THREE.Vector3(0, 10, 0),
      //       radius: 0.25,
      //       sub_branches: [
      //         [0.4, 0.05, Math.PI / 3, 0, 4.5, 0, 6],
      //         [0.5, 0.1, Math.PI / 4, 0, 4, 0, 4],
      //         [0.6, 0.1, Math.PI / 5, 0, 2, 0, 4],
      //         [0.8, 0, 0, 0, 1, 0.5, 1],
      //       ],
      //     },
      //     // middle node
      //     {
      //       sub_branches: [
      //         [0.4, 0.2, Math.PI / 5, 0, 2, 0.5, 3],
      //         [0.7, 0.2, Math.PI / 5, 0, 2, 0.5, 2],
      //         [0.9, 0, 0, 0, 1, 0.5, 1],
      //       ],
      //     },
      //     {
      //       sub_branches: [
      //         [0.5, 0.2, Math.PI / 6, 0, 1, 0, 3],
      //         [0.9, 0, 0, 0, 0.7, 0, 1],
      //       ],
      //     },
      //     // leaf node
      //     {
      //       leaves: [[0.7, 0.3, Math.PI / 3, 0, 8]],
      //       flowers: [[0.8, 0.2, Math.PI / 3, 0, 3]],
      //     },
      //   ],
      // },
      // {
      //   name: "红果冬青",
      //   path: "meta3d-jiehuo-abstract/images/hongguo/",
      //   depth: 3,
      //   disturb: 0.05,
      //   gravity: 3,
      //   shrink: { single: 0.5, multi: 0.4, root: true },
      //   tubular_segments: 10,
      //   radial_segments: 5,
      //   sample_offset: 0.005,
      //   leaf: {
      //     geometry: { style: "folded", width: 0.3, height: 1 },
      //     scale: 0.3,
      //     alpha_test: 0.5,
      //   },
      //   fruit: {
      //     geometry: { style: "cross", width: 0.5, height: 1 },
      //     scale: 0.15,
      //     alpha_test: 0.5,
      //   },
      //   branches: [
      //     // root node
      //     {
      //       start: new THREE.Vector3(0, 0, 0),
      //       end: new THREE.Vector3(0, 3, 0),
      //       radius: 0.2,
      //       sub_branches: [[0.95, 0, Math.PI / 5, Math.PI / 36, 3, 0.5, 2]],
      //     },
      //     // middle node
      //     {
      //       sub_branches: [
      //         [0.4, 0.2, Math.PI / 3, 0, 2, 0.5, 6],
      //         [0.7, 0.2, Math.PI / 3, 0, 2, 0.5, 4],
      //         [0.9, 0, 0, 0, 1, 0.5, 1],
      //       ],
      //     },
      //     {
      //       sub_branches: [
      //         [0.5, 0.2, Math.PI / 4, 0, 1, 0, 4],
      //         [0.9, 0, 0, 0, 0.7, 0, 1],
      //       ],
      //     },
      //     // leaf node
      //     {
      //       leaves: [[0.7, 0.3, Math.PI / 3, 0, 10]],
      //       flowers: [[0.8, 0.2, Math.PI / 3, 0, 3]],
      //     },
      //   ],
      // },
    ];
  }

  getTree(name) {
    const { indices, content } = this;
    const id = indices.get(name);
    return content[id];
  }
}

export { CustomizeTree };
