import Accordion from 'react-bootstrap/Accordion';
import { getImage } from '../api/imageApi';
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Form, redirect } from 'react-router-dom';
import { Form as BootstrapForm } from 'react-bootstrap';
import { addProduct } from '../api/productApi';
import { simpleWindow } from '../utility/hooks/data';
import { FcOk } from "react-icons/fc";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DrawOnline from '../components/drawOnline';


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
	const [verticalCount, setVerticalCount] = useState(0);
	const [horizontalCount, setHorizontalCount] = useState(0);

	const { isLoading, isError, error } = useQuery(imageQuery());

	if (isLoading) {
		return <span>Loading...</span>
	}

	if (isError) {
		return <span>Error: {error.message}</span>
	}

	// function handleMOuseMove(e) {
	//     console.log(e.target.value);
	// }

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

	function handleWidthCountChange(e) {
		const count = e.target.value
		const initValue = info.size?.width / count;

		let arr = [];
		for (let index = 0; index < count; index++) {
			arr.push(initValue);
		}

		setVerticalCount(count);
		setInfo({
			...info,
			widths: arr
		})
		console.log('info: ', info)
	}

	function handleKeyInput(e) {
		if (e.key === 'Backspace')
			return
		if (!(e.key >= 0 && e.key <= 9))
			e.preventDefault();
	}

	return (
		<Container>
			<Row>
				<Col>
					<Form method='post'>
						<Accordion defaultActiveKey="0">
							<Accordion.Item eventKey="0">
								<Accordion.Header>Type {info.seria && info.seria && <FcOk />}</Accordion.Header>
								<Accordion.Body>
									<Container>
										<Row className="justify-content-md-center">
											<Col md="auto">
												<BootstrapForm.Label>Type</BootstrapForm.Label>
											</Col>
											<Col md="auto">
												<BootstrapForm.Control type='text' onChange={(event) => setInfo({ ...info, type: event.target.value })} />
											</Col>
										</Row>
									</Container>
									<Container>
										<Row className="justify-content-md-center">
											<Col md="auto">
												<BootstrapForm.Label>Seria</BootstrapForm.Label>
											</Col>
											<Col md="auto">
												<BootstrapForm.Control type='text' onChange={(event) => setInfo({ ...info, seria: event.target.value })} />
											</Col>
										</Row>
									</Container>

								</Accordion.Body>
							</Accordion.Item>
							<Accordion.Item eventKey="1">
								<Accordion.Header>Sizes {info.size?.height && info.size?.width && <FcOk />}</Accordion.Header>
								<Accordion.Body>

									<Container>
										<Row className="justify-content-md-center">
											<Col md="auto">
												<BootstrapForm.Label>Width</BootstrapForm.Label>
											</Col>
											<Col md="auto">
												<BootstrapForm.Control type='text' onKeyDown={handleKeyInput} onChange={handleWidthChange} />
											</Col>
										</Row>
									</Container>
									<Container>
										<Row className="justify-content-md-center">
											<Col md="auto">
												<BootstrapForm.Label>Height</BootstrapForm.Label>
											</Col>
											<Col md="auto">
												<BootstrapForm.Control type='text' onKeyDown={handleKeyInput} onChange={handleHeightChange} />
											</Col>
										</Row>
									</Container>
								</Accordion.Body>
							</Accordion.Item>
							<Accordion.Item eventKey="2">
								<Accordion.Header>Dividers</Accordion.Header>
								<Accordion.Body>
									<Container>
										<Row>
											<Col>
												<Container>
													<Row>
														<Col>
															<BootstrapForm.Label>Verticals</BootstrapForm.Label>
														</Col>
														<Col>
															<BootstrapForm.Control
																type="number"
																min={0}
																max={5}
																onChange={handleWidthCountChange}
															/>
															{info?.widths?.map((width, index) =>
																<div key={index}>
																	<BootstrapForm.Control key={index} value={width} onChange={(e) => {
																		const newVal = e.target.value;
																		const arr = info.widths;
																		arr[index] = newVal;
																		setInfo({
																			...info,
																			widths: arr
																		})
																	}}/>
																</div>
															)}
														</Col>
													</Row>
												</Container>
											</Col>
											<Col>
												<Container>
													<Row>
														<Col>
															<BootstrapForm.Label>Horizontals</BootstrapForm.Label>
														</Col>
														<Col>
															<BootstrapForm.Control
																type="number"
																min={0}
																max={5}
																onChange={(e) => setHorizontalCount(e.target.value)} />
														</Col>
														{
															horizontalCount ? (
																<Col>
																	<BootstrapForm.Control></BootstrapForm.Control>
																</Col>
															) : null
														}
													</Row>
												</Container>
											</Col>
										</Row>
									</Container>
								</Accordion.Body>
							</Accordion.Item>
							<Accordion.Item eventKey="3">
								<Accordion.Header>Glazing</Accordion.Header>
								<Accordion.Body>
									<BootstrapForm >
										<BootstrapForm.Check inline value='none' name='group' onChange={() => setglassType(null)} type='radio' label="None" /*checked={!glassType}*/ />
										<BootstrapForm.Check inline value='single' name='group' onChange={(e) => setglassType(e.target.value)} type='radio' label="Single glass" />
										<BootstrapForm.Check inline value='double' name='group' onChange={(e) => setglassType(e.target.value)} type='radio' label="Double glass" />
										<BootstrapForm.Check inline value='triple' name='group' onChange={(e) => setglassType(e.target.value)} type='radio' label="Triple glass" />
										<Container >
											<Row>
												<Col>
													<BootstrapForm.Select disabled={!glassType}>
														<option>Select first glass</option>
														<option value="1">One</option>
														<option value="2">Two</option>
														<option value="3">Three</option>
													</BootstrapForm.Select>
												</Col>
												<Col>
													<BootstrapForm.Check type="switch" label="tempered" disabled={!glassType} />
												</Col>
											</Row>
										</Container>

										<Container >
											<Row>
												<Col>
													<BootstrapForm.Select disabled={!glassType || glassType === 'single'}>
														<option>Select spacer</option>
														<option value="1">One</option>
														<option value="2">Two</option>
														<option value="3">Three</option>
													</BootstrapForm.Select>
												</Col>
												<Col>
													<BootstrapForm.Check type="switch" label="argon" disabled={!glassType || glassType === 'single'} />
												</Col>
											</Row>
										</Container>

										<Container>
											<Row>
												<Col>
													<BootstrapForm.Select disabled={!glassType || glassType === 'single'}>
														<option>Select second glass</option>
														<option value="1">One</option>
														<option value="2">Two</option>
														<option value="3">Three</option>
													</BootstrapForm.Select>
												</Col>
												<Col>
													<BootstrapForm.Check type="switch" label="tempered" disabled={!glassType || glassType === 'single'} />
												</Col>
											</Row>
										</Container>

										<Container >
											<Row>
												<Col>
													<BootstrapForm.Select disabled={!glassType || glassType === 'single' || glassType === 'double'}>
														<option>Select spacer</option>
														<option value="1">One</option>
														<option value="2">Two</option>
														<option value="3">Three</option>
													</BootstrapForm.Select>
												</Col>
												<Col>
													<BootstrapForm.Check type="switch" label="argon" disabled={!glassType || glassType === 'single' || glassType === 'double'} />
												</Col>
											</Row>
										</Container>

										<Container>
											<Row>
												<Col>
													<BootstrapForm.Select disabled={!glassType || glassType === 'single' || glassType === 'double'}>
														<option>Select third glass</option>
														<option value="1">One</option>
														<option value="2">Two</option>
														<option value="3">Three</option>
													</BootstrapForm.Select>
												</Col>
												<Col>
													<BootstrapForm.Check type="switch" label="tempered" disabled={!glassType || glassType === 'single' || glassType === 'double'} />
												</Col>
											</Row>
										</Container>

									</BootstrapForm>
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
						<input name='description' placeholder='description' value='test product' />
						<input name='price' placeholder='price' value={500} />
						<input name='projectId' placeholder='projectId' value={9} />
						{/* <input name='stage' placeholder='stage' value={0} />  */}
						{/* <input name='imageId' placeholder='stage' value={3} />  */}
						<button type='submit'>New</button>
					</Form>
				</Col>
				<Col>
					<h3>View {verticalCount}</h3>
					<DrawOnline schema={info} />
				</Col>
			</Row>
		</Container>


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