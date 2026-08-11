import { NewThreeInstance } from "../Main";

export let initGeometryAttributes = (geometry, maxCount) => {
    geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount * 3), 3)); // 一个顶点由3个坐标构成
    geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount), 1)); // 点的透明度，用1个浮点数表示
    geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount), 1)); // 点的初始大小，用1个浮点数表示
    // geometry.setAttribute('a_scale', new BufferAttribute(new Float32Array([]), 1)); // 点的放大量，用1个浮点数表示

    return geometry
}

export let initGeometryAttributesForOffset = (geometry, maxCount) => {
    geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount * 3), 3)); // 一个顶点由3个坐标构成
    geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount), 1)); // 点的透明度，用1个浮点数表示
    geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount), 1)); // 点的初始大小，用1个浮点数表示
    geometry.setAttribute('a_offset', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount * 2), 2));
    geometry.setAttribute('a_repeat', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount * 2), 2));

    return geometry
}

export let initGeometryAttributesForRotation = (geometry, maxCount) => {
    geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount * 3), 3)); // 一个顶点由3个坐标构成
    geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount), 1)); // 点的透明度，用1个浮点数表示
    geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount), 1)); // 点的初始大小，用1个浮点数表示
    geometry.setAttribute('a_rotation', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount), 1)); // 点的初始大小，用1个浮点数表示

    return geometry
}

export let initGeometryAttributesForColor = (geometry, maxCount) => {
    geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount * 3), 3)); // 一个顶点由3个坐标构成
    geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount), 1)); // 点的透明度，用1个浮点数表示
    geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount), 1)); // 点的初始大小，用1个浮点数表示
    geometry.setAttribute('a_color', NewThreeInstance.createBufferAttribtue(new Float32Array(maxCount * 3), 3)); // 点的初始大小，用1个浮点数表示

    return geometry
}

export let updateGeometryAttribute = (geometry, particles) => {
    const particleCount = particles.length;

    let positionList = geometry.getAttribute('position').array
    let opacityList = geometry.getAttribute('a_opacity').array
    let sizeList = geometry.getAttribute('a_size').array

    const maxCount = opacityList.length
    if (particleCount > maxCount) {
        // positionList = new Float32Array(maxCount * 3 * 2)
        // opacityList = new Float32Array(maxCount * 2)
        // sizeList = new Float32Array(maxCount * 2)
        positionList = new Float32Array(particleCount * 3 * 2)
        opacityList = new Float32Array(particleCount * 2)
        sizeList = new Float32Array(particleCount * 2)

        geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(positionList, 3));
        geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(opacityList, 1));
        geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(sizeList, 1));
    }

    // 使用 for 循环直接填充数组
    for (let i = 0; i < particleCount; i++) {
        const particle = particles[i];
        const posIndex = i * 3;

        positionList[posIndex] = particle.position[0];
        positionList[posIndex + 1] = particle.position[1];
        positionList[posIndex + 2] = particle.position[2];

        opacityList[i] = particle.opacity;
        sizeList[i] = particle.size;
    }

    // 直接使用预分配的数组创建 BufferAttribute
    geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(positionList, 3));
    geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(opacityList, 1));
    geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(sizeList, 1));

    // 设置范围
    geometry.setDrawRange(0, particleCount)

    return geometry
}

export let updateGeometryAttributeForOffset = (geometry, particles) => {
    const particleCount = particles.length;

    let positionList = geometry.getAttribute('position').array
    let opacityList = geometry.getAttribute('a_opacity').array
    let sizeList = geometry.getAttribute('a_size').array
    let offsetList = geometry.getAttribute('a_offset').array
    let repeatList = geometry.getAttribute('a_repeat').array

    const maxCount = opacityList.length
    if (particleCount > maxCount) {
        positionList = new Float32Array(particleCount * 3 * 2)
        opacityList = new Float32Array(particleCount * 2)
        sizeList = new Float32Array(particleCount * 2)
        offsetList = new Float32Array(particleCount * 2 * 2)
        repeatList = new Float32Array(particleCount * 2 * 2)

        geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(positionList, 3));
        geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(opacityList, 1));
        geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(sizeList, 1));
        geometry.setAttribute('a_offset', NewThreeInstance.createBufferAttribtue(offsetList, 2));
        geometry.setAttribute('a_repeat', NewThreeInstance.createBufferAttribtue(repeatList, 2));
    }

    // 使用 for 循环直接填充数组
    for (let i = 0; i < particleCount; i++) {
        const particle = particles[i];
        const posIndex = i * 3;
        const offsetOrSizeIndex = i * 2;

        positionList[posIndex] = particle.position[0];
        positionList[posIndex + 1] = particle.position[1];
        positionList[posIndex + 2] = particle.position[2];

        opacityList[i] = particle.opacity;
        sizeList[i] = particle.size;

        offsetList[offsetOrSizeIndex] = particle.offset[0];
        offsetList[offsetOrSizeIndex + 1] = particle.offset[1];

        repeatList[offsetOrSizeIndex] = particle.repeat[0];
        repeatList[offsetOrSizeIndex + 1] = particle.repeat[1];
    }

    // 直接使用预分配的数组创建 BufferAttribute
    geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(positionList, 3));
    geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(opacityList, 1));
    geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(sizeList, 1));
    geometry.setAttribute('a_offset', NewThreeInstance.createBufferAttribtue(offsetList, 2));
    geometry.setAttribute('a_repeat', NewThreeInstance.createBufferAttribtue(repeatList, 2));

    // 设置范围
    geometry.setDrawRange(0, particleCount)

    return geometry
}

export let updateGeometryAttributeForRepeatOffset = (geometry, specificState, particles) => {
    const particleCount = particles.length;

    let positionList = geometry.getAttribute('position').array
    let opacityList = geometry.getAttribute('a_opacity').array
    let sizeList = geometry.getAttribute('a_size').array
    let offsetList = geometry.getAttribute('a_offset').array
    let repeatList = geometry.getAttribute('a_repeat').array

    const maxCount = opacityList.length
    if (particleCount > maxCount) {
        positionList = new Float32Array(particleCount * 3 * 2)
        opacityList = new Float32Array(particleCount * 2)
        sizeList = new Float32Array(particleCount * 2)
        offsetList = new Float32Array(particleCount * 2 * 2)
        repeatList = new Float32Array(particleCount * 2 * 2)

        geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(positionList, 3));
        geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(opacityList, 1));
        geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(sizeList, 1));
        geometry.setAttribute('a_offset', NewThreeInstance.createBufferAttribtue(offsetList, 2));
        geometry.setAttribute('a_repeat', NewThreeInstance.createBufferAttribtue(repeatList, 2));
    }

    // 使用 for 循环直接填充数组
    for (let i = 0; i < particleCount; i++) {
        const particle = particles[i];
        const posIndex = i * 3;
        const offsetOrSizeIndex = i * 2;

        const position = particle.getPositionFunc(specificState)
        positionList[posIndex] = position[0];
        positionList[posIndex + 1] = position[1];
        positionList[posIndex + 2] = position[2];

        opacityList[i] = particle.opacity;
        sizeList[i] = particle.size;

        offsetList[offsetOrSizeIndex] = particle.offset[0];
        offsetList[offsetOrSizeIndex + 1] = particle.offset[1];

        repeatList[offsetOrSizeIndex] = particle.repeat[0];
        repeatList[offsetOrSizeIndex + 1] = particle.repeat[1];
    }

    // 直接使用预分配的数组创建 BufferAttribute
    geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(positionList, 3));
    geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(opacityList, 1));
    geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(sizeList, 1));
    geometry.setAttribute('a_offset', NewThreeInstance.createBufferAttribtue(offsetList, 2));
    geometry.setAttribute('a_repeat', NewThreeInstance.createBufferAttribtue(repeatList, 2));

    // 设置范围
    geometry.setDrawRange(0, particleCount)

    return geometry
}

export let updateGeometryAttributeForRotation = (geometry, particles) => {
    const particleCount = particles.length;

    let positionList = geometry.getAttribute('position').array
    let opacityList = geometry.getAttribute('a_opacity').array
    let sizeList = geometry.getAttribute('a_size').array
    let rotationList = geometry.getAttribute('a_rotation').array

    const maxCount = opacityList.length
    if (particleCount > maxCount) {
        positionList = new Float32Array(particleCount * 3 * 2)
        opacityList = new Float32Array(particleCount * 2)
        sizeList = new Float32Array(particleCount * 2)
        rotationList = new Float32Array(particleCount * 2)

        geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(positionList, 3));
        geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(opacityList, 1));
        geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(sizeList, 1));
        geometry.setAttribute('a_rotation', NewThreeInstance.createBufferAttribtue(rotationList, 1));
    }

    // 使用 for 循环直接填充数组
    for (let i = 0; i < particleCount; i++) {
        const particle = particles[i];
        const posIndex = i * 3;

        positionList[posIndex] = particle.position[0];
        positionList[posIndex + 1] = particle.position[1];
        positionList[posIndex + 2] = particle.position[2];

        opacityList[i] = particle.opacity;
        sizeList[i] = particle.size;
        rotationList[i] = particle.rotation;
    }

    // 直接使用预分配的数组创建 BufferAttribute
    geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(positionList, 3));
    geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(opacityList, 1));
    geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(sizeList, 1));
    geometry.setAttribute('a_rotation', NewThreeInstance.createBufferAttribtue(rotationList, 1));

    // 设置范围
    geometry.setDrawRange(0, particleCount)

    return geometry
}

export let updateGeometryAttributeForColor = (geometry, particles) => {
    const particleCount = particles.length;

    let positionList = geometry.getAttribute('position').array
    let opacityList = geometry.getAttribute('a_opacity').array
    let sizeList = geometry.getAttribute('a_size').array
    let colorList = geometry.getAttribute('a_color').array

    const maxCount = opacityList.length
    if (particleCount > maxCount) {
        positionList = new Float32Array(particleCount * 3 * 2)
        opacityList = new Float32Array(particleCount * 2)
        sizeList = new Float32Array(particleCount * 2)
        colorList = new Float32Array(particleCount * 3 * 2)

        geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(positionList, 3));
        geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(opacityList, 1));
        geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(sizeList, 1));
        geometry.setAttribute('a_color', NewThreeInstance.createBufferAttribtue(colorList, 3));
    }

    // 使用 for 循环直接填充数组
    for (let i = 0; i < particleCount; i++) {
        const particle = particles[i];
        const posIndex = i * 3;

        positionList[posIndex] = particle.position[0];
        positionList[posIndex + 1] = particle.position[1];
        positionList[posIndex + 2] = particle.position[2];

        colorList[posIndex] = particle.color[0];
        colorList[posIndex + 1] = particle.color[1];
        colorList[posIndex + 2] = particle.color[2];

        opacityList[i] = particle.opacity;
        sizeList[i] = particle.size;
    }

    // 直接使用预分配的数组创建 BufferAttribute
    geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(positionList, 3));
    geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(opacityList, 1));
    geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(sizeList, 1));
    geometry.setAttribute('a_color', NewThreeInstance.createBufferAttribtue(colorList, 3));

    // 设置范围
    geometry.setDrawRange(0, particleCount)

    return geometry
}