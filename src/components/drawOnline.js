import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';


const getPixelRatio = context => {
    var backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;

    return (window.devicePixelRatio || 1) / backingStore;
};

const getRectFromMatrix = (matrix) => {
    console.log('m: ', matrix)
    const rects = [];
    if (!matrix)
        return rects;

    const rows = matrix?.length;
    if (rows === 0)
        return rects;
    const columns = matrix[matrix?.length - 1]?.length;

    if (!rows || !columns)
        return rects;

    for (let i = 0; i < rows - 1; i++) {
        for (let j = 0; j < columns - 1; j++) {
            if (!matrix[i + 1][j + 1])
                continue;

            rects.push({
                x: matrix[i][j].x,
                y: matrix[i][j].y,
                w: matrix[i + 1][j + 1].x,
                h: matrix[i + 1][j + 1].y,
            })

        }
    }
    return rects;
}

export default function DrawOnline({ schema }) {

    const [curruntPoint, setCurruntPoint] = useState({ x: 0, y: 0 });

    if (!schema)
        return null;

    let jsonData = schema;
    // try {
    //     jsonData = JSON.parse(schema)    
    // }
    // catch(err) {
    //     console.log('error: ', err);
    //     return;
    // }
    const ref = useRef();

    useEffect(() => {
        let canvas = ref.current;
        let context = canvas.getContext('2d');

        let ratio = getPixelRatio(context);
        let width = getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
        let height = getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        context.strokeRect(0, 0, canvas.width, canvas.height);
        context.stroke();

        context.save()
        const scaleWidth = (canvas.width - 20) / jsonData.size?.width;
        const scaleHeight = (canvas.height - 20) / jsonData.size?.height;

        const minScale = Math.min(scaleWidth, scaleHeight);

        context.translate(10, 10);
        context.strokeRect(0, 0, jsonData.size?.width * minScale, jsonData.size?.height * minScale);


        if (jsonData?.widths && jsonData?.widths.length > 0) {
            let current = 0;
            for (let width of jsonData.widths) {
                current += width;
                context.moveTo(current * minScale, 0 * minScale);
                context.lineTo(current * minScale, jsonData.size.height * minScale);
            }
        }

        if (jsonData?.heights && jsonData?.heights.length > 0) {
            let current = 0;
            for (let height of jsonData.heights) {
                current += height;
                context.moveTo(0 * minScale, current * minScale);
                context.lineTo(jsonData.size.height * minScale, current * minScale);
            }
        }

        const rects = getRectFromMatrix(jsonData.matrix);

        //fiil just firtst rect
        // if (jsonData.matrix?.length > 0 && jsonData.matrix[1]?.length > 0) {

        //     context.fillStyle = "rgb(200, 0, 0)";
        //     context.fillRect(0, 0, minScale * jsonData.matrix[1][1].x, minScale * jsonData.matrix[1][1].y);
        //     console.log('xy:', jsonData.matrix[1][1].x, jsonData.matrix[1][1].y);
        //     console.log('rects: ', rects);
        // }

        rects.forEach(rect => {
            if (curruntPoint.x > rect.x && curruntPoint.y > rect.y && curruntPoint.x < rect.x + rect.w && curruntPoint.y < rect.y + rect.h) {

                context.save();
                context.fillStyle = "rgb(200, 0, 0)";
                context.fillRect(minScale * rect.x, minScale * rect.y, minScale * (rect.x + rect.w), minScale * (rect.y + rect.h));
                context.restore();
            }
        });

        context.stroke();
        context.restore();

    });

    return (
        <canvas onMouseMove={(e) => setCurruntPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })} ref={ref} style={{ width: '500px', height: '500px' }} />
    )
}

DrawOnline.propTypes = {
    schema: PropTypes.object.isRequired,
    w: PropTypes.string.isRequired,
    h: PropTypes.string.isRequired,
}