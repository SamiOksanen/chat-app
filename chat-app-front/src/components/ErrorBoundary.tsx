import { Component, ErrorInfo, ReactNode } from 'react';
import { Typography } from 'antd';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

const { Title } = Typography;

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <Title level={3}>Sorry.. there was an error</Title>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
