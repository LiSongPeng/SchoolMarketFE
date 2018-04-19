$(function () {
    $("form").submit(function () {
        var identify = $("input[name='identify']").val();
        var password = $("input[name='password']").val();
        var confirmPassword = $("input[name='confirmPassword']").val();
        var email = $("input[name='email']").val();
        var phone = $("input[name='phone']").val();
        var identifyReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        var phoneReg = /^1[34578]\d{9}$/;
        var emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        var passwordReg = /^([A-Z]|[a-z]|[0-9]){8,20}$/;
        if (!identifyReg.test(identify)) {
            swal("身份证格式错误！");
            return false;
        }
        if (!phoneReg.test(phone)) {
            swal("手机号格式错误！");
            return false;
        }
        if (!emailReg.test(email)) {
            swal("邮箱格式错误！");
            return false;
        }
        if (!passwordReg.test(password)) {
            swal("密码必须由大于8位小于20位的字母或数字组成！");
            return false;
        }
        if (password != confirmPassword) {
            swal("密码前后输入不一致！");
            return false;
        }
        return true;
    });
});