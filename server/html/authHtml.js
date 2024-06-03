require('dotenv').config();
const hostname = process.env.HOSTNAME || 'localhost';

const authHtml = (token) => {
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
                            <h1 style="text-align:center; line-height: 2 !important;">
                                <img width="300px" height="auto" src="cid:provide@bookcycle-logo.png"/>
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <h2>회원가입 인증 안내</h2>
                        </td>
                    </tr>
                    
                    <tr>
                        <td>
                            <table width="80%" align="center" bgcolor="white" style="margin:10px auto 30px!important; padding:20px!important; border-radius:10px; font-family:Pretendard-SemiBold;">
                                <tbody>
                                    <tr>
                                        <td align="center" style="line-height:1.5 !important;">
                                            <p>안녕하세요, 북사이클입니다.</p>
                                            <p>북사이클의 회원이 되신 것을 환영합니다!</p>
                                            <p>링크를 클릭해 <strong style="font-size:18px;"><a href="http://${hostname}:10000/email/verify?token=${token}">회원가입 인증</a></strong> 절차를 완료해주시기 바랍니다.</p>
                                            <p>해당 인증 링크는 <span style="color:red;">24시간 이후 만료</span>됩니다.</p>
                                            <p style="color:red; text-decoration:underline;">인증 링크가 만료되면 회원가입 절차를 다시 진행하셔야 합니다.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><hr/></td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="line-height:1.5 !important;">
                                            <p>북사이클에 관한 문의사항은 북사이클 고객지원 센터를 이용해주시기 바랍니다.</p>
                                            <p>감사합니다. <br/> 북사이클 팀 드림</p>
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

module.exports=authHtml;