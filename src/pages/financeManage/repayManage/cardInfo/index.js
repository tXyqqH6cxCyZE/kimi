import React, { Component } from 'react';
import {Row, Col, Button} from 'antd';
import {fmtMoney} from 'utils/format'

const CardInfo = (props) => {
	const {info} = props;
	return (
        <div className="contain-wrapper">
		    <Row gutter={16} className="contain">
		      <Col span={8}>
		        <div className="box box-wrap">
		        	<div className="header">待还款融资单</div>
		        	<div className="content1">
		        		<div className="operate">			        			
			                <div className="creditline">
			                	<p className="num">{info.unsettledCount}</p>
			                	<span>笔数</span>
			               	</div>
			                <div className="available">
			                	<p className="num">{info.unsettledAmount && fmtMoney(info.unsettledAmount)}</p>
			                	<span>金额(元)</span>
			                </div>
		        		</div>		
		        	</div>
		        </div>
		      </Col>
		      <Col span={8}>
		        <div className="box box-wrap">
		        	<div className="header">逾期融资单</div>
		        	<div className="content1">
		        		<div className="operate">			        			
			                <div className="creditline">
			                	<p className="num">{info.overdueCount}</p>
			                	<span>笔数</span>
			               	</div>
			                <div className="available">
			                	<p className="num">{info.overdueAmount && fmtMoney(info.overdueAmount)}</p>
			                	<span>金额(元)</span>
			                </div>
		        		</div>			        		
		        	</div>
		        </div>
		      </Col>
		      <Col span={8}>
		        <div className="box box-wrap">
		        	<div className="header">3日待还</div>
		        	<div className="content1">
		        		<div className="operate">			        			
			                <div className="creditline">
			                	<p className="num">{info.due3DaysCount}</p>
			                	<span>笔数</span>
			               	</div>
			                <div className="available">
			                	<p className="num">{info.due3DaysAmount && fmtMoney(info.due3DaysAmount)}</p>
			                	<span>金额(元)</span>
			                </div>
		        		</div>			        		
		        	</div>
		        </div>
		      </Col>		      
		    </Row>
		</div>
	)
}

export default CardInfo;