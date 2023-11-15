import { useQuery, useQueryClient } from "@tanstack/react-query";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { getProduct } from "../api/productApi";

const productQuery = (id) => ({
    queryKey: ['products', id],
    queryFn: () => getProduct(id)
})

export default function ProductDetails({ id }) {
    const { isLoading, isError, data: product, error } = useQuery(productQuery(id));
    const queryClient = useQueryClient();
    const image = queryClient.getQueryData(['images']);

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <Card style={{ width: '15rem' }}>
            <Card.Img variant="top" src={`data:image/png;base64, ${image && image[0]?.bytes}`}/>
            <Card.Body>
                <Card.Title>{product.description}</Card.Title>
                <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
    )
}