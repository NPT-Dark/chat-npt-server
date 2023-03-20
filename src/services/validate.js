var EmailValidator = require("email-validator");
const ValidateLength = (value,max,min) =>{
    if(max != null)
    {
        if(value < max)
        {
            return true
        }
        return false
    }
    if(min != null){
        if(value > min)
        {
            return true
        }
        return false
    }
    if(min != null && max != null)
    {
        if(value > min && value < max)
        {
            return true
        }
        return false
    }
}
const ValidateEmail = (value)=>{
    return EmailValidator.validate(value);
}
module.exports = {ValidateLength,ValidateEmail}