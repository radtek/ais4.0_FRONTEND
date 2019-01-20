module.exports = auth;

auth.$inject = ['IHttp', 'baseConfig'];
const configbybeCode=require('./configbybeCode');
function auth(IHttp, baseConfig) {
    return {
        // 登录
        login: function(userInfo) {
            return IHttp.login(userInfo).then(function(rs) {
                if (rs.data.resultCode == 1) {
                    let c=configbybeCode[rs.data.user.beCode];
                    angular.merge(rs.data.user,c);
                    sessionStorage.setItem('user', JSON.stringify(rs.data.user));
                    sessionStorage.setItem('menu', JSON.stringify(rs.data.menus));
                    if (rs.data.roomId)
                        sessionStorage.setItem('roomId', rs.data.roomId);
                }
                return rs;
            });
        },
        // 退出
        logout: function() {
            localStorage.clear();
            sessionStorage.clear();
        },
        // 是否有效的用户
        isAuthenticated: function() {
            return !!JSON.parse(sessionStorage.getItem('user'));
        },
        // 当前登录的用户信息
        loginUser: function() {
            let result = JSON.parse(sessionStorage.getItem('user'));
                return result;
        },
        // 用户权限
        userPermission: function() {
            return JSON.parse(sessionStorage.getItem('menu'));
        },
        // 当前模块
        curModule: function(name) {
            var user = this.loginUser();
            user.module = name;
            sessionStorage.setItem('user', JSON.stringify(user));
        },
        // 获取roomId
        getRoomId: function() {
            if (sessionStorage.getItem('roomId') != 'undefined')
                return JSON.parse(sessionStorage.getItem('roomId'));
            else
                return '';
        },
        // 判断文书提交后是否可以修改
        getDocAuth: function() {
            let bConfig = baseConfig.getOther(),
                user = this.loginUser(),
                saveActive = false;
            if (bConfig.majorUpdateFinishDoc == 1 && bConfig.assistantUpdateFinishDoc != 1) { //麻醉科主任和护士长也可以修改提交后的文书
                if (user.roleType === 'ANAES_DIRECTOR' || user.roleType === 'HEAD_NURSE' || user.roleType === 'ADMIN')
                    saveActive = true;
            } else if (bConfig.majorUpdateFinishDoc != 1 && bConfig.assistantUpdateFinishDoc == 1) {
                if (user.roleType === 'ANAES_DOCTOR' || user.roleType === 'NURSE' || user.roleType === 'ADMIN')
                    saveActive = true;
            } else if (bConfig.majorUpdateFinishDoc == 1 && bConfig.assistantUpdateFinishDoc == 1) {
                saveActive = true;
            }
            return saveActive;
        }
    }
}