import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';
import { getImage } from '../api/imageApi';
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Form, redirect } from 'react-router-dom';
import { addProduct } from '../api/productApi';
import Circle from '../components/circle';


const imageQuery = () => ({
    queryKey: ['images'],
    queryFn: () => getImage()
})

export const loader =
    (queryClient) =>
        async () => {
            const query = imageQuery();
            return queryClient.getQueryData(query.queryKey) ??
                await queryClient.fetchQuery(query);
        }


export const action = (queryClient) =>
    async ({ request }) => {
        let formData = await request.formData();
        const product = Object.fromEntries(formData);
        console.log('product...', product)
        const response = await addProduct(product);
        if (response.status === 200) {
            await queryClient.invalidateQueries({ queryKey: ['products'] })
            return redirect('/');
        }
        else {
            throw new Response('', {
                status: 404,
                statusText: 'Not Found'
            })
        }
    }


export default function NewProduct() {

    const { isLoading, isError, data: images, error } = useQuery(imageQuery());

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Windows</Accordion.Header>
                    <Accordion.Body>
                        Windows templates
                        {
                            images.map(image => (
                                <Image key={image.id} onClick={() => console.log(image.description)} src={`data:image/png;base64, ${image?.bytes}`} height={100} width={150} />
                            ))
                        }
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Doors</Accordion.Header>
                    <Accordion.Body>
                        <Circle/>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Slidings</Accordion.Header>
                    <Accordion.Body>
                        Slidings templates
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Folding doors</Accordion.Header>
                    <Accordion.Body>
                        Folding doors templates
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Form method='post'>
                <input name='description' placeholder='description' value='test product' />
                <input name='price' placeholder='price' value={500} />
                <input name='length' placeholder='length' value={3000} />
                <input name='width' placeholder='width' value={2400} />
                {/* <input name='seria' placeholder='seria' value={Number(1)} /> */}
                <input name='projectId' placeholder='projectId' value={21} />
                {/* <input name='stage' placeholder='stage' value={1} />  */}
                <input name='imageId' placeholder='stage' value={3} /> 
                {/* <input name='userId' placeholder='userId' value={1} />  */}
                <button type='submit'>New</button>
            </Form>
        </>
    );
}

/* 
import { useEffect, useState } from 'react';
import { getImage, getImages } from '../api/imageApi';
import { URI } from '../utility/constants';
import axios from "axios";

export default function Photo() {

    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            const response = await axios(`${URI}/image`);
            console.log(response);
            setImage(response)
        }
        fetchImage();
    }, [])


    return (
        <>
            <h1>
                photo {image?.data.description}
            </h1>
            <img src={`data:image/png;base64, ${image?.data.bytes}`}/>
        </>
    )
}
*/