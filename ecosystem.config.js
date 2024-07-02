module.exports = {
	apps: [
	{
		name: 'bookcycle-pm2',
		script: './server/server.js', // 실행할 스크립트 경로
		instances: 'max', // cpu 코어 수 만큼 인스턴스 실행
		exec_mode: 'cluster', // 클러스터 모드 실행, 여러 인스턴스로 실행함
		env: {
			NODE_ENV: 'development', // 개발환경 변수
		},
		env_production: {
			NODE_ENV: 'production', // 배포환경 변수
		}
	}
	]
};
