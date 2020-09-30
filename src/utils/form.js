import axios from 'axios'
import path from 'config/pathConfig';

const format = (formdata) => {
	let data = new FormData();
	for(let key in formdata) {
        data.append(key, formdata[key]);
    }
	return data
}
export const service = (url, data) => {
	try {
		return axios({
		  method: 'post',
		  url: `${path.BASE_URL}${url}`,
		  data: format(data),
		  headers: {'Content-Type': 'multipart/form-data'}
		})
	}
	catch (err) {
        return err.response;
    }
}
