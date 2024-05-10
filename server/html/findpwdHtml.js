const findpwdHtml = (secured_key) => {
    return(
        `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title></title>
            <style>
                @font-face {
                    font-family: 'Pretendard-SemiBold';
                    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-SemiBold.woff') format('woff');
                    font-style: normal;
                }
                body {
                    font-family: 'Pretendard-SemiBold' !important;
                }
            </style>
        </head>
        <body>
            <table width="100%" height="100%" cellspacing="0" cellpadding="0" align="center" bgcolor="#e3f5ff" style="margin:20px auto; max-width:768px; font-family:Pretendard-SemiBold; border-radius:10px;">
                <tbody>
                    <tr>
                        <td align="center" style="padding-top:20px;">
                            <h1 style="text-align:center; line-height:2 !important;">
                                <img width="300px" height="auto" src="cid:provide@bookcycle-logo.png"/>
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <h2>비밀번호 초기화 안내</h2>
                        </td>
                    </tr>
                    
                    <tr>
                        <td>
                            <table width="80%" align="center" bgcolor="white" style="margin:10px auto 30px!important; padding:20px!important; border-radius:10px; font-family:Pretendard-SemiBold;">
                                <tbody>
                                    <tr>
                                        <td align="center" style="line-height:1.5 !important;">
                                            <p>안녕하세요, 북사이클입니다.</p>
                                            <p>해당 이메일로 가입된 계정의 비밀번호를 초기화하려면</p>
                                            <p><a href="http://localhost:10000/password/verify/${secured_key}"><strong>링크</strong></a>를 클릭해주시기 바랍니다.</p>
                                            <p>해당 인증 링크는 <span style="color:red;">10분 후 만료</span>됩니다.</p>
                                            <p>만약 비밀번호 초기화를 요청하지 않았음에도 이메일이 발송되었다면 고객지원 센터에 문의해주시기 바랍니다.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><hr/></td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="line-height:1.5 !important;">
                                            <p>감사합니다. <br/> 북사이클 팁 드림</p>
                                        </td>
                                    </tr>
                                </tbody>    
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>
        `
    )
}

module.exports=findpwdHtml;