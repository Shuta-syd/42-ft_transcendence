import React from "react";
import { Controller } from "react-hook-form";

type FromControllerProps = {
  name: string; // Controllerの識別子name
  control: any; // useFormのcontrolオブジェクト
  handleOnChange?: any; // formのonChangeハンドラー
  RenderComponent: any // 実際に表示するComponent
}


function FormController(props: FromControllerProps) {
  const { name, control, RenderComponent } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={(
        { field }
      ) =>  RenderComponent(field)
      }
    />
  )
}

export default FormController;
