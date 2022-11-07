import { Button, Form, Input, Typography } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useContext } from 'react';
import { AlertContext, UserContext, UserProps } from '../App';

const { Title } = Typography;

const authUri = import.meta.env.VITE_APP_AUTH_API_URL
    ? import.meta.env.VITE_APP_AUTH_API_URL
    : '/auth';

type SignUpFormProps = {
    showLoginForm: () => void;
};

type UserSignUp = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const SignUpForm = ({ showLoginForm }: SignUpFormProps) => {
    const { changeUser } = useContext(UserContext);
    const { changeAlert } = useContext(AlertContext);

    const onFinish = (values: UserSignUp) => {
        console.log('Success:', values);

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        const raw = JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
        });

        fetch(authUri + '/signup', {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Sign up failed');
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
        <Form
            name="signup"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ margin: 20 }}
        >
            <Title>Chat App</Title>
            <Title level={2}>Sign Up</Title>
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    { required: true, message: 'Please input your username!' },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Please input your email!' },
                    {
                        type: 'email',
                        message: 'Please give a valid email address!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    { required: true, message: 'Please input your password!' },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Re-enter Password"
                name="confirmPassword"
                rules={[
                    {
                        required: true,
                        message: 'Please re-enter your password!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button
                    type="link"
                    htmlType="button"
                    onClick={() => showLoginForm()}
                >
                    Back to Login
                </Button>
            </Form.Item>
            <Footer style={{ textAlign: 'center' }}>
                Chat App ©2022 Created by Sami Oksanen
            </Footer>
        </Form>
    );
};

export default SignUpForm;
