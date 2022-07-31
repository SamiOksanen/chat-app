import { Button, Checkbox, Form, Input, Layout, Typography } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import { useContext } from 'react';
import { AlertContext, UserContext } from '../App';

const { Title } = Typography;

const authUri = process.env.REACT_APP_AUTH_API_URL ? process.env.REACT_APP_AUTH_API_URL : '/auth';

const LoginForm = () => {
    const { changeUser } = useContext(UserContext);
    const { changeAlert } = useContext(AlertContext);

    const onFinish = (values: any) => {
        console.log('Success:', values);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "username": values.username,
            "password": values.password
        });

        fetch(authUri + '/login', { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Login failed');
            })
            .then(result => changeUser && changeUser(result))
            .catch(error => { console.error(error); changeAlert && changeAlert({ message: 'Error', description: error.message, type: 'error' }); });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form name="login" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" style={{ margin: 20 }}>
            <Title>Chat App</Title>
            <Title level={2}>Login</Title>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 4, span: 16 }}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
            <Footer style={{ textAlign: 'center' }}>Chat App ©2022 Created by Sami Oksanen</Footer>
        </Form>
    );
};

export default LoginForm;