export type FromControllerProps = {
  name: string; // Controllerの識別子name
  control: any; // useFormのcontrolオブジェクト
  handleOnChange?: any; // formのonChangeハンドラー
  placeholder?: string; // formのplaceholder
}
