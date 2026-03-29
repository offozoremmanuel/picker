
const emailtemplate = (fullName, otp)=>{
    return`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>otp page</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <div class="main">
        <h1>Email  OTP Verification</h1>
        <p>Dear ${fullName},</p>
        <p>To verify your account, please enter the following verification code on the  splita</p>

            <h2>${otp}</h2>

        <p>The verification code expires in 5 minutes. If you do not request this code, please ignore this message</p>
    </div>
</body>
</html>
`
}
module.exports = emailtemplate;