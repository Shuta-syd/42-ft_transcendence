import * as yup from 'yup';

const VIOLATION_EMAIL = '正しい形式で入力してください'
const VIOLATION_PASSWORD = '入力可能文字は英数字のみです'

const LoginValidationSchema = yup.object().shape({
  email: yup.string().email(VIOLATION_EMAIL),
  password: yup.string().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)[A-Za-z\d]{1,}$/, VIOLATION_PASSWORD),
})

export default LoginValidationSchema;
