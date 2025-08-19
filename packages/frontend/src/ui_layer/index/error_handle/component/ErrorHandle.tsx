import "./ErrorHandle.scss"

import React, { useState, useEffect } from 'react';
import { Button, Col, Flex, Image, Layout, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import Title from "antd/es/typography/Title";
import { AppDispatch, AppState } from "../../../store/AppStore";
import { Mask } from "antd-mobile";

let ErrorHandle: React.FC = () => {
	let error = useSelector<AppState>((state) => state.errorHandle.error) as Error

	useEffect(() => {
		console.error(error)
	}, [error]);

	return <Layout className="error-handle-main"  >
		<Mask
			visible={true}
			opacity={0.5}
		>
			<Flex justify="center" align="center">
				<Title className="title">错误处理</Title>
			</Flex>

			<Row justify="center" className="row">
				<Col className="col" span={24}>
					<Row justify="center" >
						<Row justify="center" className="title_container">
							<Title className="level1" >{error.message}</Title>
						</Row>
						<Row justify="center" className="title_container">
							<Title className="level2" >{error.stack}</Title>
						</Row>
					</Row>

					{/* <Row className="level">
                </Row> */}
					{/* {
			renderButton(_ =>{

			}, "refresh", )
                } */}

				</Col>
			</Row>
		</Mask>
	</Layout >
};

export default ErrorHandle;