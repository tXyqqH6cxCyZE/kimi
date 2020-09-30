import React from 'react';
import RcPagination from 'rc-pagination';
import 'rc-pagination/dist/rc-pagination.min.css';
// 通用分页组件
const Pagination = (props) => {
	return (
        <div className="row">
            <div className="col">
                <RcPagination {...props} 
                    //hideOnSinglePage  
                    showSizeChanger
                    showTotal={(total)=>{return "共 "+total+" 条"}}
                    showQuickJumper/>
            </div>
        </div>
    );
}
export default Pagination;