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
	const [matrix, setMatrix] = useState([
		{
			x: 0, y: 0, w: 0, h: 0
		}
	]);

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

		const m = matrix[0];
		m.w = e.target.value;
		setMatrix(m);
	}

	function handleHeightChange(e) {
		if (isNaN(e.target.value))
			return;

			const m = matrix[0];
			m.h = e.target.value;
			setMatrix(m);
		}
	

	function handleDividersCountChange(e, key) {
		if (key !== 'widths' && key !== 'heights')
			return;

		const count = e.target.value
		const initValue = (key === 'widths')
			? Math.round(info.size?.width / count)
			: Math.round(info.size?.height / count);

		let arr = [];
		for (let index = 0; index < count; index++) {
			arr.push(initValue);
		}

		if (key === 'widths') {
			setVerticalCount(count);
			const matrix = calculateMatrix(arr, info.heights);
			setInfo({
				...info,
				widths: arr,
				matrix
			})
		}
		else { //heights
			setHorizontalCount(count);
			const matrix = calculateMatrix(info.widths, arr);
			setInfo({
				...info,
				heights: arr,
				matrix
			})
		}

	}

	function handleSizeChange(e, key, index) {
		if (key !== 'widths' && key !== 'heights')
			return;

		const newVal = e.target.value;
		const arr = (key === 'widths') ? info.widths : info.heights;
		arr[index] = Number(newVal);

		if (key === 'widths')
			setInfo({
				...info,
				widths: arr
			})
		else
			setInfo({
				...info,
				heights: arr
			})
	}

	function handleKeyInput(e) {
		if (e) return;
		if (e.key === 'Backspace')
			return
		if (!(e.key >= 0 && e.key <= 9))
			e.preventDefault();
	}

	function calculateMatrix(widths, heights) {
		let arr = [];
		let rows = heights?.length;
		let columns = widths?.length;

		// if (rows < 1 || columns < 1)
		// 	return null;

		let y = 0;

		for (let i = 0; i <= rows; i++) {
			let x = 0;
			arr[i] = [];
			for (let j = 0; j <= columns; j++) {
				arr[i][j] = { x, y }
				x += widths[j];
			}
			y += heights[i]
		}

		return arr;
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
																onChange={(e) => handleDividersCountChange(e, 'widths')} />
															{info?.widths?.map((width, index) =>
																<div key={index}>
																	<BootstrapForm.Control type='number' key={index} value={width} onChange={(e) => handleSizeChange(e, 'widths', index)} />
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
																onChange={(e) => handleDividersCountChange(e, 'heights')} />
															{info?.heights?.map((height, index) =>
																<div key={index}>
																	<BootstrapForm.Control type='number' key={index} value={height} onChange={(e) => handleSizeChange(e, 'heights', index)} />
																</div>
															)}
														</Col>
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
							{/* <Accordion.Item eventKey="4">
								<Accordion.Header>Merge</Accordion.Header>
								<Accordion.Body>

								</Accordion.Body>
							</Accordion.Item> */}
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
					<h3>View {horizontalCount}</h3>
					<DrawOnline schema={info} setInfo={setInfo} />
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