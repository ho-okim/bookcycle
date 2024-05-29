const pool = require("../db.js"); // db connection pool

// 로그인 여부 확인하는 함수
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated() && req.user.verification === 1) {
        next();
    } else {
        res.status(403).json({ message : "not logged in" });
    }
}

// 로그인 및 차단 여부를 확인하는 함수
exports.isLoggedInAndBlocked = (req, res, next) => {
    if (req.isAuthenticated() && req.user.verification === 1) {
        if (req.user.blocked === 0) {
            next();
        } else {
            res.status(401).json({ message : "blocked user" });
        }
    } else {
        res.status(403).json({ message : "not logged in" });
    }
}

// 비로그인 여부 확인하는 함수
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.status(403).json({ message : "already logged in" });
    }
}

// DB에서 사용자 id로 권한 조회
async function getUserRole(userId) {
    let sql = `SELECT role_id FROM users WHERE id = ?`;
    const [res] = await pool.query(sql, [userId]);
    return res && res.role_id;
}

// 관리자 접근 확인하는 함수
exports.isAdmin = async (req, res, next) => {
    const { user } = req;
    if (req.isAuthenticated() && user.verification === 1) {
        try {
            // DB에서 해당 사용자 권한 조회
            const res = await getUserRole(user.id);

            if (res == 1) { // 관리자라면 다음 함수 실행
                next();
            }  else {
                res.status(401).json({ message : "not allowed" });
            }
        } catch (error) {
            console.error('failed to get user role', error);
            res.status(500).json({ message : 'failed to get user role' });
        }
    } else {
        res.status(403).json({ message : "not logged in" });
    }
}
