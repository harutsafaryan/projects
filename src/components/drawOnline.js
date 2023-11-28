import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VscSymbolFile, VscSymbolNumeric, VscRefresh, VscSymbolRuler } from "react-icons/vsc";
import { BsUnion } from "react-icons/bs";


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
                w: matrix[i + 1][j + 1].x - matrix[i][j].x,
                h: matrix[i + 1][j + 1].y - matrix[i][j].y,
            })

        }
    }
    return rects;
}

export default function DrawOnline({ schema, setInfo }) {

    const [currentPoint, setCurrentPoint] = useState({ x: 0, y: 0 });
    const [checkedRects, setCheckedRects] = useState([]);
    let pointScale;

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

    function handleCheck() {
        const rects = getRectFromMatrix(jsonData.matrix);

        let current;
        rects.forEach(rect => {
            if (currentPoint.x * pointScale > rect.x &&
                currentPoint.y * pointScale > rect.y &&
                currentPoint.x * pointScale < rect.x + rect.w &&
                currentPoint.y * pointScale < rect.y + rect.h)
                current = rect;
        })

        const currentStringify = JSON.stringify(current);
        const checkedRectsStringify = checkedRects.map(r => JSON.stringify(r));

        const index = checkedRectsStringify.indexOf(currentStringify);
        if (index === -1) {
            setCheckedRects([...checkedRects, current]);
        }
        else {
            let arr = [];
            for (let i = 0; i < checkedRects.length; i++) {
                if (i === index)
                    continue;
                else
                    arr.push(rects[i]);
            }
            setCheckedRects(arr)
        }
    }

    function handlePointRemove() {
        const matrix = schema.matrix;
        matrix[2][2] = { x: 40, y: 40 };
        setInfo({
            ...schema,
            widths: schema.widths.map(w => w + 5)
        })
    }

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
        pointScale = jsonData.size?.width / width;

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
                context.lineTo(jsonData.size.width * minScale, current * minScale);
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
            if (currentPoint.x * pointScale > rect.x &&
                currentPoint.y * pointScale > rect.y &&
                currentPoint.x * pointScale < rect.x + rect.w &&
                currentPoint.y * pointScale < rect.y + rect.h) {
                context.fillStyle = "rgb(200, 0, 0)";
                context.fillRect(minScale * rect.x, minScale * rect.y, minScale * rect.w, minScale * rect.h);
            }
        });

        checkedRects.forEach(rect => {
            context.fillStyle = "rgb(0, 0, 200)";
            context.fillRect(minScale * rect.x, minScale * rect.y, minScale * rect.w, minScale * rect.h);
        });

        context.stroke();
        context.restore();

    });

    return (
        <div>
            <div>
                <canvas
                    onMouseMove={(e) => setCurrentPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
                    onClick={handleCheck}
                    onDoubleClick={handlePointRemove}
                    ref={ref}
                    style={{ width: '500px', height: '500px' }}
                />
            </div>
            <div>
                <button type='button' className='btn btn-light' onClick={() => setInfo({})}><VscSymbolFile /></button>
                <button type='button' className='btn btn-light' onClick={() => alert('clicked')}><VscSymbolNumeric color='green' /></button>
                <button type='button' className='btn btn-light' onClick={() => alert('clicked')}><BsUnion color={(checkedRects.length > 0) ? 'red' : 'green'} /></button>
                <button type='button' className='btn btn-light' onClick={() => alert('clicked')}><VscRefresh color='red' /></button>
                <button type='button' className='btn btn-light' onClick={() => alert('clicked')}><VscSymbolRuler color='red' /></button>
            </div>
        </div>
    )
}

DrawOnline.propTypes = {
    schema: PropTypes.object.isRequired,
    w: PropTypes.string.isRequired,
    h: PropTypes.string.isRequired,
    setInfo: PropTypes.object.isRequired
}