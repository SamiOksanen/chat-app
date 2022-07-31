import { Alert, AlertProps } from "antd"
import { useContext } from "react";
import { AlertContext } from "../App";

const FlexAlert = (props: AlertProps) => {
    const { changeAlert } = useContext(AlertContext);
    return <Alert
        showIcon
        closable
        onClose={() => changeAlert && changeAlert(null)}
        style={{ margin: '4px auto 4px auto' }}
        {...props}
    />
}

export default FlexAlert;