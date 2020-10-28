const responseBody = {
    message: '',
    timestamp: 0,
    result: null,
    code: 0
}
const utils = {
    /**
     * 根据传入的参数返回响应对象
     * @param {响应的数据} data 
     * @param {响应的消息} message 
     * @param {http响应码} code 
     * @param {自定义相应头}} headers 
     */
    builder: function(data, message, code = 0, headers = {}) {
        responseBody.result = data
        if (message !== undefined && message !== null) {
            responseBody.message = message
        }
        if (code !== undefined && code !== 0) {
            responseBody.code = code
            responseBody._status = code
        }
        if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
            responseBody._headers = headers
        }
        responseBody.timestamp = new Date().getTime()
        return responseBody
    },
    /**
     * 生成token
     */
    token: function() {
        let str = "";
        const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        for (var i = 0; i < 31; i++) {
            pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    }
}


module.exports = utils