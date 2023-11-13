
import Accordion from 'react-bootstrap/Accordion';

export default function AddProduct() {
    return (

        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Windows</Accordion.Header>
                <Accordion.Body>
                    Windows templates
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