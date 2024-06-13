const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const process = require('process'); // root 경로를 가져오기 위함

// 날짜, 시스템이름(label), 형식, 출력 정의함수(printf), transport 등을 가져옴
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;

// 로그파일 저장경로 : root경로/logs
const logDir = `${process.cwd()}/server/logs`;

// 출력 형식
const logFormat = printf(({ level, message, label, timestamp}) => {
    // 날짜 시스템이름 로그레벨 메시지 순서로 출력 지정
    return `${timestamp} [${label}] ${level} ${message}`;
});

// 파일로 저장
const log_file = new winstonDaily({ // 일반 로그
    level: 'info', // info 레벨
    datePattern: 'YYYY-MM-DD', // 파일의 날짜 형식
    dirname: logDir, // 저장경로
    filename : `%DATE%.log`, // 파일이름 - 날짜형식
    maxFiles: 30, // 30일치 로그파일 저장
    zippedArchive: true // 로그파일을 gzip으로 압축할지 여부
});
const error_file = new winstonDaily({ // 에러
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + '/error', // /logs/error 폴더에 저장
    filename : `%DATE%.error.log`,
    maxFiles: 30,
    zippedArchive: true
});
const exception_file = new winstonDaily({ // 예외처리
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir,
    filename : `%DATE%.exception.log`,
    maxFiles: 30,
    zippedArchive: true
});

 // logger 설정
const logger = createLogger({
    level: 'info', // 로그의 심각도
    format: combine( // 로그 형식
        timestamp({ format : 'YYYY-MM-DD HH:mm:ss' }),
        label({ label : 'bookcycle' }),
        logFormat
    ), 
    transports: [ // 로그 저장 방식 - 파일 저장
        log_file, error_file
    ],
    exceptionHandlers: [ // 예외처리 발생 시 설정
        exception_file
    ]
});

// 배포 환경이 아닐 때 설정
if (process.env.NODE_ENV !== 'production') { // 파일도 저장하고 콘솔로도 출력
    logger.add(
        new transports.Console({
            format: format.combine( // log 설정을 여러 개 적용하기 위한 combine 설정
                format.colorize(), // level별 색상 적용
                format.simple() // '레벨: 메시지 json' 형식으로 출력
            )
        })
    );
}

module.exports = logger;