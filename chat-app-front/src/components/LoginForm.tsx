import { Button, Checkbox, Form, Input, Layout, Typography } from 'antd';

const { Title } = Typography;

const LoginForm = () => {
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form name="login" labelCol={{span: 4}} wrapperCol={{span: 16}} initialValues={{remember: true}} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" style={{ margin: 20 }}>
            <Title>Chat App</Title>
            <Title level={2}>Login</Title>
            <Form.Item label="Username" name="username" rules={[{required: true, message: 'Please input your username!'}]}>
                <Input />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{required: true, message: 'Please input your password!'}]}>
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{offset: 4, span: 16}}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 4, span: 16}}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;