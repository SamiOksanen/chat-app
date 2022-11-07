import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import { useContext, useState } from 'react';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { AlertContext, UserContext, UserProps } from '../App';
import SignUpForm from './SignUpForm';

const { Title } = Typography;

type UserLogin = {
    username: string;
    password: string;
};

const authUri = import.meta.env.VITE_APP_AUTH_API_URL
    ? import.meta.env.VITE_APP_AUTH_API_URL
    : '/auth';

const LoginForm = () => {
    const { changeUser } = useContext(UserContext);
    const { changeAlert } = useContext(AlertContext);

    const [showSignUp, setShowSignUp] = useState(false);

    const onFinish = (values: UserLogin) => {
        console.log('Success:', values);

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        const raw = JSON.stringify({
            username: values.username,
            password: values.password,
        });

        fetch(authUri + '/login', {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Login failed');
            })
            .then((result) => changeUser && changeUser(result as UserProps))
            .catch((error) => {
                console.error(error);
                changeAlert &&
                    changeAlert({
                        message: 'Error',
                        description: (error as Error).message,
                        type: 'error',
                    });
            });
    };

    const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {!showSignUp ? (
                <Form
                    name="login"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    style={{ margin: 20 }}
                >
                    <Title>Chat App</Title>
                    <Title level={2}>Login</Title>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{ offset: 4, span: 16 }}
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button
                            type="link"
                            htmlType="button"
                            onClick={() => setShowSignUp(true)}
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                    <Footer style={{ textAlign: 'center' }}>
                        Chat App ©2022 Created by Sami Oksanen
                    </Footer>
                </Form>
            ) : (
                <SignUpForm showLoginForm={() => setShowSignUp(false)} />
            )}
        </>
    );
};

export default LoginForm;
