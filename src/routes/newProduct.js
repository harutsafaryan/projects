import Accordion from 'react-bootstrap/Accordion';
import { getImage } from '../api/imageApi';
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Form, redirect } from 'react-router-dom';
import { Form as BootstrapForm } from 'react-bootstrap';
import { addProduct } from '../api/productApi';
import Simple from '../components/simple';
import { simpleWindow } from '../utility/hooks/data';
import { FcOk } from "react-icons/fc";


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
        product.jsoninfo = JSON.stringify(simpleWindow);
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

    const [info, setInfo] = useState({});
    const [glassType, setglassType] = useState('');

    console.log('info: ', info);
    console.log('glassType: ', glassType);

    const { isLoading, isError, error } = useQuery(imageQuery());

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    function handleWidthChange(e) {
        if (isNaN(e.target.value))
            return;
        setInfo({
            ...info,
            size: {
                ...info.size,
                width: e.target.value
            }
        })
    }

    function handleHeightChange(e) {
        if (isNaN(e.target.value))
            return;
        setInfo({
            ...info,
            size: {
                ...info.size,
                height: e.target.value
            }
        })
    }

    return (
        <>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Type {info.seria && info.seria && <FcOk />}</Accordion.Header>
                    <Accordion.Body>
                        <input type='text' placeholder='type' onChange={(event) => setInfo({ ...info, type: event.target.value })} />
                        <input type='text' placeholder='seria' onChange={(event) => setInfo({ ...info, seria: event.target.value })} />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Sizes {info.size?.height && info.size?.width && <FcOk />}</Accordion.Header>
                    <Accordion.Body>
                        <input type="text" placeholder='width' onChange={handleWidthChange} />
                        <input type="text" placeholder='height' onChange={handleHeightChange} />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Slidings</Accordion.Header>
                    <Accordion.Body>
                        <Simple schema={simpleWindow} />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Glazing</Accordion.Header>
                    <Accordion.Body>
                        <BootstrapForm >
                            <div className='mb-3'>
                                <BootstrapForm.Check inline value='none' name='group' onChange={() => setglassType(null)} type='radio' label="None" checked={!glassType} />
                                <BootstrapForm.Check inline value='single' name='group' onChange={(e) => setglassType(e.target.value)} type='radio' label="Single glass" />
                                <BootstrapForm.Check inline value='double' name='group' onChange={(e) => setglassType(e.target.value)} type='radio' label="Double glass" />
                                <BootstrapForm.Check inline value='triple' name='group' onChange={(e) => setglassType(e.target.value)} type='radio' label="Triple glass" />
                            </div>
                            <div>
                                <BootstrapForm.Select disabled={!glassType}>
                                    <option>Select first glass</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </BootstrapForm.Select>

                                <BootstrapForm.Label>Second glass</BootstrapForm.Label>
                                <BootstrapForm.Control disabled={!glassType || glassType === 'single'} type="text" />

                                <BootstrapForm.Label>Second glass</BootstrapForm.Label>
                                <BootstrapForm.Control disabled={!glassType || glassType === 'single' || glassType === 'double'} type="text" />

                            </div>
                        </BootstrapForm>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Form method='post'>
                <input name='description' placeholder='description' value='test product' />
                <input name='price' placeholder='price' value={500} />
                <input name='projectId' placeholder='projectId' value={9} />
                {/* <input name='stage' placeholder='stage' value={0} />  */}
                {/* <input name='imageId' placeholder='stage' value={3} />  */}
                <button type='submit'>New</button>
            </Form>
        </>
    );
}

/** to show image
 *     <Accordion.Item eventKey="0">
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
 */



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