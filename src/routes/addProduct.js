import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';
import { getImage } from '../api/imageApi';
import { useQuery } from "@tanstack/react-query";

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


export default function AddProduct() {

    const { isLoading, isError, data: images, error } = useQuery(imageQuery());

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }


    return (

        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Windows</Accordion.Header>
                <Accordion.Body>
                    Windows templates
                    {
                        images.map(image => (
                            <Image onClick={() => console.log(image.description)} src={`data:image/png;base64, ${image?.bytes}`} height={100} width={150} />
                        ))
                    }
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Doors</Accordion.Header>
                <Accordion.Body>
                    Doors templates
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