
import * as yup from 'yup';

const REQUIRE_MSG = '入力が必要です'
const VIOLATION_NAME_COUNT = 'ユーザネームは1文字以上です'

const FtSignupValidationSchema = yup.object().shape({
  username: yup.string().required(REQUIRE_MSG).min(1, VIOLATION_NAME_COUNT),
})


export default FtSignupValidationSchema;
