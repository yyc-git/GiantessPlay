import { Mesh, Texture, Vector3, CubicBezierCurve3, TubeGeometry, MeshBasicMaterial, TextureLoader, NearestFilter, DoubleSide, CatmullRomCurve3, QuadraticBezierCurve3, CurvePath, Color, BufferGeometry, Float32BufferAttribute, Group, Matrix4, Quaternion } from "three"
import { mergeGeometries } from "../../../Merge";

let _random = (value) => {
    return value * Math.random() * 2 - value;
}

let _createLeaf = () => {
    let colors = [];
    let indices = [];
    const start = new Vector3(0, 0, 0);
    const end = new Vector3(0, 2, 0);
    const p1 = new Vector3(-0.5, 1, 0.5);
    const p2 = new Vector3(0.5, 1, 0.5);
    // const line = new LineCurve(start,end);// 直线没有getpoints方法  
    const curve = new CatmullRomCurve3([start, end]);
    const curve1 = new QuadraticBezierCurve3(start, p1, end);
    const curve2 = new QuadraticBezierCurve3(start, p2, end);

    const curvePath = new CurvePath<Vector3>();
    curvePath.curves.push(curve1, curve, curve2);
    const pointsArr = curvePath.getPoints(8);// path中的每条curve都会取8个点

    const segment = 8;
    // index
    for (let i = 0; i < segment; i++) {
        const v0 = i + 1;
        const v1 = i + (segment + 1);
        const v2 = i + (segment + 1) * 2 + 1;
        // 逆时针构造face
        indices.push(v1, v1 + 1, v0);
        indices.push(v0 + 1, v0, v1 + 1);

        indices.push(v1, v2, v1 + 1);
        indices.push(v2, v2 + 1, v1 + 1);

    }
    // color
    const color1 = new Color(0x32563f);//深绿色
    const color2 = new Color(0x3f660d); //浅绿色

    // 获取 x 坐标的绝对值的最大值，用于归一化
    let maxAbsX = 0;
    for (const point of pointsArr) {
        if (Math.abs(point.x) > maxAbsX) maxAbsX = Math.abs(point.x);
    }

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < segment + 1; i++) {
            // 计算叶子颜色，基于叶子的 x 轴绝对值位置进行插值
            const point = pointsArr[i + j * (segment + 1)];
            const t = Math.abs(point.x) / maxAbsX; // 在 0 到 1 之间线性插值
            const color = new Color().lerpColors(color1, color2, t); // 在两种颜色之间进行线性插值
            colors.push(color.r, color.g, color.b);
        }
    }

    const geometry = new BufferGeometry().setFromPoints(pointsArr);
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    const material = new MeshBasicMaterial({
        vertexColors: true,
        side: DoubleSide,
    })
    const leaf = new Mesh(geometry, material);
    return leaf;
}

// stern
let _createStem = (flower) => {
    const start = new Vector3(0, 0, 0);
    const end = new Vector3(0, 2, 0);
    // const p1 = new Vector3(-0.5, 0.5, 0.2);
    // const p2 = new Vector3(0.5, 1.5, -0.2);
    const p1 = new Vector3(0, 0.5, 0);
    const p2 = new Vector3(0, 1.5, 0);
    // 坐标偏移
    const offset = 0.5;
    p1.x = _random(offset);//-0.5~0.5
    p1.z = _random(offset);//-0.5~0.5
    p2.x = _random(offset);//-0.5~0.5
    p2.z = _random(offset);//-0.5~0.5

    const curve = new CubicBezierCurve3(start, p1, p2, end);
    // 添加叶子

    const leaf1 = _createLeaf()
    const leaf2 = _createLeaf()
    const leaf3 = _createLeaf()
    // 取贝塞尔曲线上的点生成叶子
    const points = curve.getPoints(8);// 9个点
    const base1 = points[2];
    const base2 = points[4];
    const base3 = points[6];
    // 平移叶子到目标位置
    const translation1 = new Vector3().subVectors(base1, start);
    const translation2 = new Vector3().subVectors(base2, start);
    const translation3 = new Vector3().subVectors(base3, start);

    // leaf1.position.copy(translation1);
    // leaf2.position.copy(translation2);
    // leaf3.position.copy(translation3);
    // 缩放
    const scaleSize = 0.5;
    // leaf1.scale.set(scaleSize + 0.1, scaleSize + 0.1, scaleSize + 0.1);
    // leaf2.scale.set(scaleSize, scaleSize, scaleSize);
    // leaf3.scale.set(scaleSize - 0.1, scaleSize - 0.1, scaleSize - 0.1)

    // // 分散分布
    // leaf1.rotateY(Math.PI / 3 * 2);
    // leaf3.rotateY(-Math.PI / 3 * 2);

    // 叶片偏移角度
    const angle = Math.PI / 180 * 60 + _random(Math.PI / 180 * 15);
    // leaf1.rotateX(-angle + Math.PI / 180 * 15);
    // leaf2.rotateX(-angle);
    // leaf3.rotateX(-angle - Math.PI / 180 * 15);



    // TODO fix: rotate wrong

    leaf1.geometry.applyMatrix4(new Matrix4().compose(
        translation1, new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 3 * 2).setFromAxisAngle(new Vector3(1, 0, 0), -angle + Math.PI / 180 * 15), new Vector3().set(scaleSize + 0.1, scaleSize + 0.1, scaleSize + 0.1)
    ))
    leaf2.geometry.applyMatrix4(new Matrix4().compose(
        translation2, new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -angle), new Vector3().set(scaleSize, scaleSize, scaleSize)
    ))
    leaf3.geometry.applyMatrix4(new Matrix4().compose(
        translation3, new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI / 3 * 2).setFromAxisAngle(new Vector3(1, 0, 0), -angle - Math.PI / 180 * 15), new Vector3().set(scaleSize - 0.1, scaleSize - 0.1, scaleSize - 0.1)
        // translation3, new Quaternion(), new Vector3().set(scaleSize - 0.1, scaleSize - 0.1, scaleSize - 0.1)
    ))



    flower.add(leaf1, leaf2, leaf3);

    const radius_noisy = 0.01;
    const radius = 0.05 + _random(radius_noisy);
    const tubegeometry = new TubeGeometry(curve, 8, radius, 8, false);
    const material = new MeshBasicMaterial({
        side: DoubleSide,
        color: 0x234010
    })
    const stem = new Mesh(tubegeometry, material);
    flower.add(stem);

}

let _createFlower = (flower, config) => {
    const color = new Color();

    let colors = [];
    let indices = [];

    // const start = new Vector3(0, 0, 0);
    // const end = new Vector3(0, 2, 0.4);
    // let p1 = new Vector3(-0.2, 2.2, 0.1);
    // let p2 = new Vector3(0.2, 2.2, 0.1);
    // let p3 = new Vector3(0, 1.5, -0.1);//控制颜色分布
    const geometry = new BufferGeometry();



    let start = config.start
    let end = config.end
    let p1 = config.p1
    let p2 = config.p2
    let p3 = config.p3

    let { color1, color2, color3, color4 } = config

    setAttribute();
    // // gui
    // gui = new GUI();
    // gui.close();
    // const folder1 = gui.addFolder('p12');
    // // const folder2 = gui.addFolder('p2');
    // const folder3 = gui.addFolder('p3');
    // const folder4 = gui.addFolder('start');
    // const folder5 = gui.addFolder('end');

    // folder4.close();
    // folder5.close();

    // folder1.add(p2, 'x', 0, 4, 0.1).onFinishChange((value) => {//控制花瓣左右大小
    //     p1.x = -value;
    //     p2.x = value;
    //     setAttribute();
    // });
    // folder1.add(p1, 'y', -4, 4, 0.1).onFinishChange((value) => {//控制上下分布
    //     p1.y = value;
    //     p2.y = value;
    //     setAttribute();
    // });
    // folder1.add(p1, 'z', -4, 4, 0.1).onFinishChange((value) => {//控制花瓣平整度
    //     p1.z = value;
    //     p2.z = value;
    //     setAttribute();
    // });

    // // folder2.add(p2, 'x', 0, 1, 0.1).onFinishChange(setAttribute);
    // // folder2.add(p2, 'y', 0, 2, 0.1).onFinishChange(setAttribute);
    // // folder2.add(p2, 'z', -1, 1, 0.1).onFinishChange(setAttribute);

    // folder3.add(p3, 'x', -4, 4, 0.1).onFinishChange(setAttribute);
    // folder3.add(p3, 'y', -4, 4, 0.1).onFinishChange(setAttribute);//主要控制颜色分布
    // folder3.add(p3, 'z', -4, 4, 0.1).onFinishChange(setAttribute);//控制花瓣中间翘动

    // folder4.add(start, 'x', -1, 1, 0.1).onFinishChange(setAttribute);
    // folder4.add(start, 'y', 0, 2, 0.1).onFinishChange(setAttribute);
    // folder4.add(start, 'z', -1, 1, 0.1).onFinishChange(setAttribute);


    // folder5.add(end, 'x', -4, 4, 0.1).onFinishChange(setAttribute);//花瓣偏转
    // folder5.add(end, 'y', -4, 4, 0.1).onFinishChange(setAttribute);//控制花瓣长度，和p12.y一起效果
    // folder5.add(end, 'z', -4, 4, 0.1).onFinishChange(setAttribute);//花瓣的聚拢程度




    function setAttribute() {
        // curve
        const curve1 = new QuadraticBezierCurve3(start, p1, end);
        const curve2 = new QuadraticBezierCurve3(start, p2, end);
        const curve3 = new QuadraticBezierCurve3(start, p3, end);
        // path
        const curvePath = new CurvePath<Vector3>();
        curvePath.curves.push(curve1, curve3, curve2);

        // positions
        const segment = 8;
        let pointsArr = curvePath.getPoints(segment);// 8+1 * 3
        // // color
        // const color1 = new Color(0x7c75e2);//紫色
        // const color2 = new Color(0xa4b1ff);//浅紫色

        // const color3 = new Color(0xfdf100);//黄色
        // const color4 = new Color(0xf0be01);//黄色
        const r = 0;//花蕊半径
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < segment + 1; i++) {

                // 计算叶子颜色，基于叶子的高度进行插值
                const t = pointsArr[i + j * (segment + 1)].y / end.y; // 在0到1之间线性插值

                if (i <= r) {//花蕊颜色
                    color.lerpColors(color3, color4, t); // 在两种颜色之间进行线性插值
                    colors.push(color.r, color.g, color.b);
                } else {
                    color.lerpColors(color2, color1, t); // 在两种颜色之间进行线性插值
                    colors.push(color.r, color.g, color.b);
                }
            }
        }
        // index
        for (let i = 0; i < segment; i++) {
            const v0 = i + 1;
            const v1 = i + (segment + 1);
            const v2 = i + (segment + 1) * 2 + 1;
            // 逆时针构造face
            indices.push(v1, v1 + 1, v0);
            indices.push(v0 + 1, v0, v1 + 1);

            indices.push(v1, v2, v1 + 1);
            indices.push(v2, v2 + 1, v1 + 1);
        }
        geometry.setFromPoints(pointsArr);
        geometry.setIndex(indices);
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    }

    const material = new MeshBasicMaterial({
        vertexColors: true,
        side: DoubleSide,
        // transparent: true,
        // opacity: 0.5,
        // wireframe:true,
    });
    // const petal = new Mesh(geometry, material);
    // const petals = new Group();
    // let petalNum = 21;

    let petalGeometries = []
    // const petals = new Group();
    // let petalNum = 21;
    let petalNum = config.petalNum
    for (let i = 0; i <= Math.PI * 2; i += Math.PI * 2 / petalNum) {
        const geo = geometry.clone();// 创建一个新对象
        // 同层花瓣上下浮动
        const waveNoisy = 5;
        const angle = Math.PI / 180 * waveNoisy;
        geo.rotateY(_random(angle));
        // 花瓣长度变化
        const scaleNoisy = 0.05;
        const scaleY = 1 + _random(scaleNoisy);
        geo.scale(1, scaleY, 1);
        geo.rotateZ(i);
        petalGeometries.push(geo);
    }

    let mergedGeo = mergeGeometries(petalGeometries)
    let petal = new Mesh(mergedGeo, material);




    // 缩放尺寸
    const scaleSize = 0.5 + _random(0.1);
    // 偏角
    const angle = Math.PI / 180 * 30;
    mergedGeo.scale(scaleSize, scaleSize, scaleSize)
    mergedGeo.rotateZ(_random(angle));
    mergedGeo.rotateX(-Math.PI / 2 + _random(angle));

    mergedGeo.translate(0, 2, 0)


    flower.add(petal);
}

export let create = (config) => {
    let flower = new Group();

    _createStem(flower);
    _createFlower(flower, config);

    return flower
}