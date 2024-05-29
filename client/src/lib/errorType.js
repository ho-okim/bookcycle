const errorType = [
    {
        type: 400, message: '요청에 오류가 있습니다 \n요청을 다시 확인해주세요'
    },
    {
        type: 401, message: '접근이 차단되었습니다'
    },
    {
        type: 403, message: '접근이 차단되었습니다'
    },
    {
        type: 404, message: '요청하신 페이지를 찾을 수 없습니다 \n요청을 다시 확인해주세요'
    },
    {
        type: 500, message: '서버에 오류가 발생했습니다 \n다시 요청해주세요'
    },
    {
        type: 503, message: '서비스를 이용할 수 없습니다'
    },
]

export default errorType;