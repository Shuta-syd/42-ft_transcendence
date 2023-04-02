import * as yup from 'yup';

const REQUIRE_MSG = '入力が必要です'
const VIOLATION_EMAIL = '正しい形式で入力してください'
const VIOLATION_NAME_COUNT = 'ユーザネームは5文字以上です'
const VIOLATION_PASSWORD = '大文字小文字数字をそれぞれ1文字以上含む10文字以上で入力してください'

const SignupValidationSchema = yup.object().shape({
  username: yup.string().required(REQUIRE_MSG).min(5, VIOLATION_NAME_COUNT),
  email: yup.string().required(REQUIRE_MSG).email(VIOLATION_EMAIL),
  password: yup.string().required(REQUIRE_MSG).matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)[A-Za-z\d]{10,}$/, VIOLATION_PASSWORD),
})

export default SignupValidationSchema;
